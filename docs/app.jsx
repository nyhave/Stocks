const exchangeFees = {
  NewYork: 0.1,
  London: 0.5,
  Tokyo: 0.3,
  Frankfurt: 0.2
};

function getHoldingsWithValue(portfolio) {
  return portfolio.holdings.map(h => ({
    ...h,
    value: (h.weight / 100) * portfolio.invested
  }));
}

function dummyPredict(input, lang) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        actionScore: 75,
        explanation: window.locales[lang].explanationTechTooHigh,
        transactions: [
          { action: 'buy', ticker: 'AAPL', amount: 2, exchange: 'NewYork' },
          { action: 'sell', ticker: 'TSLA', amount: 1, exchange: 'London' }
        ]
      });
    }, 500);
  });
}

const demoHistory = [
  1000000, 1005000, 995000, 1010000, 1025000,
  1018000, 1032000, 1040000, 1035000, 1050000
];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const en = window.locales.en.errorBoundaryMessage;
      const da = window.locales.da.errorBoundaryMessage;
      return <div className="error">{en} / {da}</div>;
    }
    return this.props.children;
  }
}

function DashboardPage({ lang }) {
  const holdings = React.useMemo(
    () => getHoldingsWithValue(window.demoPortfolio),
    []
  );
  const t = window.locales[lang].labels;
  return (
    <div className="container">
      <h1>SmartPortfolio Dashboard</h1>
      <table className="transactions">
        <thead>
          <tr><th>Ticker</th><th>%</th><th>Value (DDK)</th></tr>
        </thead>
        <tbody>
          {holdings.map((h, i) => (
            <tr key={i}>
              <td>{h.ticker}</td>
              <td>{h.weight}</td>
              <td>{h.value.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td>Cash</td>
            <td>{(100 - window.demoPortfolio.holdings.reduce((a, b) => a + b.weight, 0)).toFixed(2)}</td>
            <td>{(window.demoPortfolio.invested * (100 - window.demoPortfolio.holdings.reduce((a, b) => a + b.weight, 0)) / 100).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PredictPage({ lang }) {
  const [risk, setRisk] = React.useState('medium');
  const [cash, setCash] = React.useState(10);
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [cashError, setCashError] = React.useState(null);
  const t = window.locales[lang].labels;

  const handleCashChange = e => {
    const val = Number(e.target.value);
    setCash(val);
    if (val < 0 || val > 100) {
      setCashError(t.cashError);
    } else {
      setCashError(null);
    }
  };

  const handlePredict = async () => {
    if (cash < 0 || cash > 100) {
      setCashError(t.cashError);
      return;
    }
    setLoading(true);
    const res = await dummyPredict({ risk, cash }, lang);
    setResult(res);
    setLoading(false);
  };

  const getTransactionCost = tItem => {
    const fee = exchangeFees[tItem.exchange] || 0;
    return (tItem.amount * fee) / 100;
  };

  return (
    <div className="container">
      <h1>SmartPortfolio Predict</h1>
      <div className="controls">
        <label htmlFor="risk">{t.risk}:
          <select id="risk" value={risk} onChange={e => setRisk(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>
        <label htmlFor="cash">{t.cash}:
          <input id="cash" type="number" min="0" max="100" value={cash} onChange={handleCashChange} />
        </label>
        {cashError && <div className="error">{cashError}</div>}
        <button onClick={handlePredict} disabled={loading}>
          {loading && <span className="spinner" aria-label="loading"></span>}
          {loading ? t.predicting : t.predict}
        </button>
      </div>
      {result && (
        <div className="result">
          <h2>{t.result}</h2>
          <div className="score-bar"><div className="score" style={{ width: result.actionScore + '%' }}></div></div>
          <p className="explanation">{result.explanation}</p>
          <table className="transactions">
            <thead>
              <tr><th>{t.actions.buy}/{t.actions.sell}</th><th>Ticker</th><th>Amt</th><th>{t.cost}</th></tr>
            </thead>
            <tbody>
              {result.transactions.map((tItem, i) => (
                <tr key={i} className={tItem.action}>
                  <td>{tItem.action === 'buy' ? '✔️' : '❌'} {t.actions[tItem.action]}</td>
                  <td>{tItem.ticker}</td>
                  <td>{tItem.amount}</td>
                  <td>{getTransactionCost(tItem).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function HistoryPage({ lang }) {
  const max = Math.max(...demoHistory);
  const t = window.locales[lang].labels;
  return (
    <div className="container">
      <h1>{t.nav.history}</h1>
      <ul className="history">
        {demoHistory.map((v, i) => (
          <li key={i}>
            <div className="bar" style={{ width: (v / max) * 100 + '%' }}></div>
            {v.toFixed(0)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SettingsPage({ lang }) {
  const [risk, setRisk] = React.useState('medium');
  const [freq, setFreq] = React.useState('weekly');
  const t = window.locales[lang].labels;
  return (
    <div className="container">
      <h1>{t.nav.settings}</h1>
      <label>{t.risk}:
        <select value={risk} onChange={e => setRisk(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </label>
      <label>{t.notify}:
        <select value={freq} onChange={e => setFreq(e.target.value)}>
          <option value="daily">daily</option>
          <option value="weekly">weekly</option>
          <option value="monthly">monthly</option>
        </select>
      </label>
      <button onClick={() => alert('Saved')}>{t.save}</button>
    </div>
  );
}

function App() {
  const [lang, setLang] = React.useState('en');
  const [darkMode, setDarkMode] = React.useState(false);
  const [page, setPage] = React.useState('dashboard');

  React.useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const t = window.locales[lang].labels;

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage lang={lang} />;
      case 'predict':
        return <PredictPage lang={lang} />;
      case 'history':
        return <HistoryPage lang={lang} />;
      case 'settings':
        return <SettingsPage lang={lang} />;
      default:
        return null;
    }
  };

  const navLink = (key, label) => (
    <a
      href="#"
      className={page === key ? 'active' : ''}
      onClick={e => {
        e.preventDefault();
        setPage(key);
      }}
    >
      {label}
    </a>
  );

  return (
    <div>
      <nav>
        {navLink('dashboard', t.nav.dashboard)}
        {navLink('predict', t.nav.predict)}
        {navLink('history', t.nav.history)}
        {navLink('settings', t.nav.settings)}
        <label htmlFor="langSelect">{t.lang}:
          <select id="langSelect" value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="da">Dansk</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> {t.darkMode}
        </label>
      </nav>
      {renderPage()}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

