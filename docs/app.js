const { useState } = React;

function Dashboard({ portfolio }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total value: ${portfolio.totalValue.toFixed(2)}</p>
      <p>Cash balance: ${portfolio.cashBalance.toFixed(2)}</p>
      <h3>Recent activity</h3>
      <ul>
        {portfolio.activities.map((a, i) => (
          <li key={i}>{a.description}: ${a.amount.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}

function Recommendations({ items }) {
  return (
    <div>
      <h2>Recommendations</h2>
      <ul>
        {items.map((rec, i) => (
          <li key={i}>{rec.action} {rec.ticker} - {rec.reason}</li>
        ))}
      </ul>
    </div>
  );
}

function Simulation({ portfolio, onSimulate }) {
  const [ticker, setTicker] = useState('');
  const [action, setAction] = useState('buy');
  const [amount, setAmount] = useState('0');

  const handle = () => {
    onSimulate({ ticker, action, amount: parseFloat(amount) });
  };

  return (
    <div>
      <h2>Simulation Mode</h2>
      <div>
        <label>
          Ticker:
          <input value={ticker} onChange={e => setTicker(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Action:
          <select value={action} onChange={e => setAction(e.target.value)}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </label>
      </div>
      <button onClick={handle}>Simulate</button>
    </div>
  );
}

function History({ history }) {
  const max = Math.max(...history, 1);
  return (
    <div>
      <h2>Portfolio History</h2>
      {history.map((v, i) => (
        <div key={i} className="history-bar" style={{ width: `${(v / max) * 100}%` }}>
          Day {i + 1}: ${v.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

function Settings({ settings, onUpdate }) {
  const [risk, setRisk] = useState(settings.riskLevel);
  const [freq, setFreq] = useState(settings.notifyFrequency);

  const handle = () => onUpdate({ riskLevel: risk, notifyFrequency: freq });

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label>
          Risk level:
          <select value={risk} onChange={e => setRisk(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Notification frequency:
          <select value={freq} onChange={e => setFreq(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>
      <button onClick={handle}>Save</button>
    </div>
  );
}

function App() {
  const [view, setView] = useState('dashboard');
  const [portfolio, setPortfolio] = useState({
    totalValue: 10000,
    cashBalance: 2500,
    activities: [{ description: 'Initial deposit', amount: 10000 }]
  });
  const [recommendations] = useState([
    { action: 'Buy', ticker: 'AAPL', reason: 'Strong earnings' },
    { action: 'Sell', ticker: 'TSLA', reason: 'High valuation' }
  ]);
  const [history, setHistory] = useState([9500, 9600, 9700, 9800, 10000]);
  const [settings, setSettings] = useState({ riskLevel: 'medium', notifyFrequency: 'weekly' });

  const simulateTrade = (trade) => {
    const newActivities = portfolio.activities.concat({ description: `Simulated ${trade.action} ${trade.ticker}`, amount: trade.amount });
    let cash = portfolio.cashBalance;
    let total = portfolio.totalValue;
    if (trade.action === 'buy') {
      cash -= trade.amount;
      total += trade.amount;
    } else {
      cash += trade.amount;
      total -= trade.amount;
    }
    setPortfolio({ totalValue: total, cashBalance: cash, activities: newActivities });
    setHistory(history.concat(total));
    setView('dashboard');
  };

  let content;
  if (view === 'dashboard') content = <Dashboard portfolio={portfolio} />;
  else if (view === 'recommendations') content = <Recommendations items={recommendations} />;
  else if (view === 'simulation') content = <Simulation portfolio={portfolio} onSimulate={simulateTrade} />;
  else if (view === 'history') content = <History history={history} />;
  else if (view === 'settings') content = <Settings settings={settings} onUpdate={setSettings} />;

  return (
    <div>
      <h1>SmartPortfolio Demo</h1>
      <nav>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('recommendations')}>Recommendations</button>
        <button onClick={() => setView('simulation')}>Simulation</button>
        <button onClick={() => setView('history')}>History</button>
        <button onClick={() => setView('settings')}>Settings</button>
      </nav>
      <hr />
      {content}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
