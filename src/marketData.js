// Load market quotes from Yahoo Finance and cache in Firestore
import { collection, doc, getDoc, setDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

async function loadMarketData() {
  if (!window.db) {
    console.error('Firestore not initialized');
    return;
  }
  const docRef = doc(collection(window.db, 'marketData'), 'latest');
  try {
    const snapshot = await getDoc(docRef);
    let shouldUpdate = true;
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.updated && Date.now() - data.updated.toMillis() < 86400000) {
        shouldUpdate = false;
        window.marketData = data.quotes;
      }
    }
    if (shouldUpdate) {
      const tickers = window.demoPortfolio.holdings.map(h => h.ticker).join(',');
      const resp = await fetch(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers}`
      );
      const json = await resp.json();
      const quotes = {};
      if (json && json.quoteResponse && json.quoteResponse.result) {
        json.quoteResponse.result.forEach(r => {
          quotes[r.symbol] = {
            price: r.regularMarketPrice,
            currency: r.currency
          };
        });
      }
      await setDoc(docRef, { quotes, updated: Timestamp.now() });
      window.marketData = quotes;
    }
  } catch (err) {
    console.error('Failed to load market data', err);
  }
}
window.loadMarketData = loadMarketData;
