const readline = require('readline');
const { Activity, Portfolio, displayDashboard } = require('./smartportfolio/dashboard');
const { Recommendation, listRecommendations } = require('./smartportfolio/recommendations');
const { runSimulation } = require('./smartportfolio/simulation');
const { showHistory } = require('./smartportfolio/history');
const { Settings, configureSettings } = require('./smartportfolio/settings');

function createInterface() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}

function askQuestion(rl, query) {
  return new Promise(resolve => rl.question(query, answer => resolve(answer)));
}

async function main() {
  const rl = createInterface();
  const ask = q => askQuestion(rl, q);

  let portfolio = new Portfolio(10000.0, 2500.0, [new Activity('Initial deposit', 10000.0)]);
  const recommendations = [
    new Recommendation('buy', 'AAPL', 'Strong earnings'),
    new Recommendation('sell', 'TSLA', 'High valuation')
  ];
  const history = [9500, 9600, 9700, 9800, 10000];
  let settings = new Settings();

  while (true) {
    console.log('Main Menu');
    console.log('1. Dashboard');
    console.log('2. Recommendations');
    console.log('3. Simulation mode');
    console.log('4. Portfolio history');
    console.log('5. Settings');
    console.log('6. Quit');
    const choice = await ask('Choose an option: ');
    if (choice === '1') {
      displayDashboard(portfolio);
    } else if (choice === '2') {
      listRecommendations(recommendations);
    } else if (choice === '3') {
      portfolio = await runSimulation(portfolio, ask);
    } else if (choice === '4') {
      showHistory(history);
    } else if (choice === '5') {
      settings = await configureSettings(settings, ask);
    } else if (choice === '6') {
      break;
    } else {
      console.log('Invalid choice.\n');
    }
  }

  rl.close();
}

if (require.main === module) {
  main();
}
