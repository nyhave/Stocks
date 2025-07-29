function getHoldingsWithValue(portfolio) {
  return portfolio.holdings.map(h => ({
    ...h,
    value: (h.weight / 100) * portfolio.invested,
    price:
      window.marketData && window.marketData[h.ticker]
        ? window.marketData[h.ticker].price
        : null
  }));
}


const demoHistory = [
  1000000, 1005000, 995000, 1010000, 1025000,
  1018000, 1032000, 1040000, 1035000, 1050000
];

function DashboardPage({ lang }) {
  const [holdings, setHoldings] = React.useState(
    getHoldingsWithValue(window.demoPortfolio)
  );

  React.useEffect(() => {
    window.updateHoldings = () => {
      setHoldings(getHoldingsWithValue(window.demoPortfolio));
    };
    return () => {
      delete window.updateHoldings;
    };
  }, []);

  const t = window.locales[lang].labels;
  return (
    <div className="container">
      <h1>SmartPortfolio Dashboard</h1>
      <table className="transactions">
        <thead>
          <tr><th>Ticker</th><th>{t.price}</th><th>%</th><th>Value (DDK)</th></tr>
        </thead>
        <tbody>
          {holdings.map((h, i) => (
            <tr key={i}>
              <td>{h.ticker}</td>
              <td>{h.price ? h.price.toFixed(2) : '-'}</td>
              <td>{h.weight.toFixed(2)}</td>
              <td>{Math.round(h.value).toLocaleString()}</td>
            </tr>
          ))}
          <tr>
            <td>Cash</td>
            <td>-</td>
            <td>{(100 - window.demoPortfolio.holdings.reduce((a, b) => a + b.weight, 0)).toFixed(2)}</td>
            <td>{Math.round(window.demoPortfolio.invested * (100 - window.demoPortfolio.holdings.reduce((a, b) => a + b.weight, 0)) / 100).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function PredictPage({ lang }) {
  const [risk, setRisk] = React.useState('medium');
  const [cash, setCash] = React.useState(10);
  const [bias, setBias] = React.useState('none');
  const [result, setResult] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
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
    const res = await clientPredict({ risk, cash, bias }, lang);
    setResult(res);
    setSelected(null);
    setLoading(false);
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
        <label htmlFor="bias">{t.bias}:
          <select id="bias" value={bias} onChange={e => setBias(e.target.value)}>
            <option value="none">none</option>
            <option value="tech">tech</option>
            <option value="finance">finance</option>
            <option value="industrial">industrial</option>
          </select>
        </label>
        {cashError && <div className="error">{cashError}</div>}
        <button
          className="bg-blue-600 text-white text-xl px-6 py-3 rounded disabled:opacity-50 w-full sm:w-auto"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading && <span className="spinner" aria-label="loading"></span>}
          {loading ? t.predicting : t.predict}
        </button>
      </div>
      {result && (
        <div className="result">
          <h2>{t.result}</h2>
          {result.portfolios.map((p, idx) => {
            const base = { low: 0.04, medium: 0.07, high: 0.12 };
            const currentReturn = window.demoPortfolio.invested * base[risk];
            const improvement = p.expectedReturn - currentReturn;
            return (
              <div key={idx} className="portfolio">
                <h3>{p.name}</h3>
                <p>{t.expectedReturn}: {Math.round(p.expectedReturn).toLocaleString()}</p>
                <button
                  className="bg-blue-600 text-white text-xl px-6 py-3 rounded mt-2 w-full sm:w-auto"
                  onClick={() => setSelected(idx)}
                >
                  {t.show}
                </button>
                {selected === idx && (
                  <div>
                    <p>{p.explanation}</p>
                    <p>{t.improvement}: {Math.round(improvement).toLocaleString()}</p>
                    <table className="transactions">
                      <thead><tr><th>Ticker</th><th>%</th></tr></thead>
                      <tbody>
                        {p.holdings.map((h, j) => (
                          <tr key={j}><td>{h.ticker}</td><td>{h.weight.toFixed(2)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
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
            {Math.round(v).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}


function SettingsPage({ lang, setLang, darkMode, setDarkMode }) {
  const [risk, setRisk] = React.useState('medium');
  const [freq, setFreq] = React.useState('weekly');
  const t = window.locales[lang].labels;
  return (
    <div className="container">
      <h1>{t.nav.settings}</h1>
      <label htmlFor="langSelectSettings">{t.lang}:
        <select
          id="langSelectSettings"
          value={lang}
          onChange={e => setLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="da">Dansk</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={e => setDarkMode(e.target.checked)}
        />{' '}
        {t.darkMode}
      </label>
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
      <button
        className="bg-blue-600 text-white text-xl px-6 py-3 rounded mt-2 w-full sm:w-auto"
        onClick={() => alert('Saved')}
        title={t.save}
      >
        {t.save}
      </button>
      <button
        className="bg-blue-600 text-white text-xl px-6 py-3 rounded mt-2 w-full sm:w-auto"
        onClick={() => {
          if (window.initFirebase) {
            window.initFirebase();
          }
          if (window.loadMarketData) {
            window.loadMarketData().then(() => {
              if (window.updateHoldings) window.updateHoldings();
            });
          }
        }}
        title={t.loadData}
      >
        {t.loadData}
      </button>
    </div>
  );
}

function App() {
  const [lang, setLang] = React.useState('en');
  const [darkMode, setDarkMode] = React.useState(false);
  const [page, setPage] = React.useState('dashboard');
  const [menuOpen, setMenuOpen] = React.useState(false);

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
        return (
          <SettingsPage
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
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
        setMenuOpen(false);
      }}
    >
      {label}
    </a>
  );

  return (
    <div>
      <nav className={menuOpen ? 'open' : ''}>
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="nav-links">
          {navLink('dashboard', t.nav.dashboard)}
          {navLink('predict', t.nav.predict)}
          {navLink('history', t.nav.history)}
          {navLink('settings', t.nav.settings)}
        </div>
      </nav>
      {renderPage()}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

