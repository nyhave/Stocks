const { Portfolio, Activity, displayDashboard } = require('./dashboard');

class Trade {
  constructor(ticker, amount, action) {
    this.ticker = ticker;
    this.amount = amount;
    this.action = action;
  }
}

function simulateTrade(portfolio, trade) {
  const newPortfolio = new Portfolio(
    portfolio.totalValue,
    portfolio.cashBalance,
    [...portfolio.activities]
  );
  if (trade.action === 'buy') {
    newPortfolio.cashBalance -= trade.amount;
    newPortfolio.totalValue += trade.amount;
  } else {
    newPortfolio.cashBalance += trade.amount;
    newPortfolio.totalValue -= trade.amount;
  }
  newPortfolio.activities.push(
    new Activity(`Simulated ${trade.action} ${trade.ticker}`, trade.amount)
  );
  return newPortfolio;
}

async function runSimulation(portfolio, ask) {
  console.log('\n===== Simulation Mode =====');
  const ticker = await ask('Ticker symbol: ');
  const action = (await ask('Action (buy/sell): ')).toLowerCase();
  const amount = parseFloat(await ask('Amount in USD: '));
  const trade = new Trade(ticker, amount, action);
  const newPortfolio = simulateTrade(portfolio, trade);
  displayDashboard(newPortfolio);
  return newPortfolio;
}

module.exports = { Trade, simulateTrade, runSimulation };
