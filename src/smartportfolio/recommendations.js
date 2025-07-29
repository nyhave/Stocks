function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class Recommendation {
  constructor(action, ticker, reason) {
    this.action = action;
    this.ticker = ticker;
    this.reason = reason;
  }
}

function listRecommendations(recommendations) {
  console.log('\n===== Recommendations =====');
  recommendations.forEach(rec => {
    console.log(`${capitalize(rec.action)} ${rec.ticker} - ${rec.reason}`);
  });
  console.log();
}

module.exports = { Recommendation, listRecommendations };
