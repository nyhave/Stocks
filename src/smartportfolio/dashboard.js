class Activity {
  constructor(description, amount) {
    this.description = description;
    this.amount = amount;
  }
}

class Portfolio {
  constructor(totalValue, cashBalance, activities = []) {
    this.totalValue = totalValue;
    this.cashBalance = cashBalance;
    this.activities = activities;
  }
}

function displayDashboard(portfolio) {
  console.log('\n===== Dashboard =====');
  console.log(`Total value: $${portfolio.totalValue.toFixed(2)}`);
  console.log(`Cash balance: $${portfolio.cashBalance.toFixed(2)}`);
  console.log('Recent activity:');
  portfolio.activities.slice(-5).forEach(act => {
    console.log(`- ${act.description}: $${act.amount.toFixed(2)}`);
  });
  console.log();
}

module.exports = { Activity, Portfolio, displayDashboard };
