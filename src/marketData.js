// Load market quotes from Yahoo Finance and cache in Firestore
async function loadMarketData() {
  if (!window.db) {
    console.error('Firestore not initialized');
    return;
  }
  const docRef = window.db.collection('marketData').doc('latest');
  try {
    const doc = await docRef.get();
    let shouldUpdate = true;
    if (doc.exists) {
      const data = doc.data();
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
      await docRef.set({ quotes, updated: firebase.firestore.Timestamp.now() });
      window.marketData = quotes;
    }
  } catch (err) {
    console.error('Failed to load market data', err);
  }
}
window.loadMarketData = loadMarketData;
