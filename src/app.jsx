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


// Demo portfolio history and benchmark values for different ranges
const demoHistory = {
  oneMonth: [
    1040000, 1045000, 1042000, 1048000, 1050000,
    1053000, 1051000, 1056000, 1058000, 1060000,
    1062000, 1065000, 1063000, 1067000, 1070000,
    1072000, 1075000, 1073000, 1078000, 1080000,
    1083000, 1082000, 1087000, 1089000, 1090000,
    1092000, 1094000, 1096000, 1098000, 1100000
  ],
  sixMonths: [
    980000, 990000, 995000, 1000000, 1005000, 995000,
    1010000, 1025000, 1018000, 1032000, 1040000, 1035000,
    1050000
  ],
  oneYear: [
    950000, 960000, 970000, 980000, 990000, 995000,
    1000000, 1005000, 995000, 1010000, 1025000,
    1018000, 1032000, 1040000, 1035000, 1050000
  ],
  benchmark: {
    oneMonth: Array.from({ length: 30 }, (_, i) => 1000000 + i * 2000),
    sixMonths: [
      970000, 975000, 980000, 985000, 990000, 995000,
      1000000, 1005000, 1008000, 1011000, 1014000, 1017000,
      1020000
    ],
    oneYear: [
      930000, 940000, 950000, 960000, 970000, 980000,
      990000, 995000, 1000000, 1005000, 1010000,
      1015000, 1020000, 1025000, 1030000, 1035000
    ]
  }
};

const demoTransactions = [
  { date: '2025-01-05', type: 'buy', ticker: 'AAPL', qty: 15, price: 150 },
  { date: '2025-02-10', type: 'sell', ticker: 'GOOG', qty: 5, price: 2800 },
  { date: '2025-03-15', type: 'buy', ticker: 'MSFT', qty: 10, price: 320 },
  { date: '2025-04-01', type: 'buy', ticker: 'NVDA', qty: 8, price: 600 },
  { date: '2025-05-20', type: 'sell', ticker: 'NFLX', qty: 4, price: 500 }
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
  const [range, setRange] = React.useState('oneYear');
  const chartRef = React.useRef(null);
  const chartInstanceRef = React.useRef(null);
  const t = window.locales[lang].labels;

  const exportCsv = () => {
    const rows = [
      ['Date', 'Type', 'Ticker', 'Qty', 'Price']
    ].concat(
      demoTransactions.map(tr => [
        tr.date,
        tr.type,
        tr.ticker,
        tr.qty,
        tr.price
      ])
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = csvContent;
    link.download = 'transactions.csv';
    link.click();
  };

  React.useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext('2d');
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: demoHistory[range].map((_, i) => i + 1),
        datasets: [
          {
            label: 'Portfolio',
            data: demoHistory[range],
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Benchmark',
            data: demoHistory.benchmark[range],
            borderColor: 'green',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }, [range]);

  const values = demoHistory[range];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const change = ((values[values.length - 1] - values[0]) / values[0]) * 100;
  const avg = change / values.length;

  return (
    <div className="container">
      <h1>{t.nav.history}</h1>
      <label>{t.range}:
        <select value={range} onChange={e => setRange(e.target.value)}>
          <option value="oneMonth">1M</option>
          <option value="sixMonths">6M</option>
          <option value="oneYear">1Y</option>
        </select>
      </label>
      <canvas ref={chartRef}></canvas>
      <div>
        <p>{t.highest}: {Math.round(max).toLocaleString()}</p>
        <p>{t.lowest}: {Math.round(min).toLocaleString()}</p>
        <p>{t.change}: {change.toFixed(2)}</p>
        <p>{t.averageReturn}: {avg.toFixed(2)}</p>
      </div>
      <h2>{t.transactions}</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={exportCsv}
      >
        {t.exportCsv}
      </button>
      <table className="transactions">
        <thead>
          <tr>
            <th>Date</th><th>{t.type}</th><th>Ticker</th><th>Qty</th><th>{t.price}</th>
          </tr>
        </thead>
        <tbody>
          {demoTransactions.map((tr, idx) => (
            <tr key={idx} className={tr.type}>
              <td>{tr.date}</td>
              <td>{t.actions[tr.type]}</td>
              <td>{tr.ticker}</td>
              <td>{tr.qty}</td>
              <td>{tr.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
        }}
        title={t.initFirebase}
      >
        {t.initFirebase}
      </button>
      <button
        className="bg-blue-600 text-white text-xl px-6 py-3 rounded mt-2 w-full sm:w-auto"
        onClick={() => {
          if (window.testConnection) {
            window.testConnection();
          }
        }}
        title={t.testConnection}
      >
        {t.testConnection}
      </button>
      <button
        className="bg-blue-600 text-white text-xl px-6 py-3 rounded mt-2 w-full sm:w-auto"
        onClick={() => {
          if (window.loadMarketData) {
            window.loadMarketData().then(() => {
              if (window.updateHoldings) window.updateHoldings();
            });
          }
        }}
        title={t.readMarket}
      >
        {t.readMarket}
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

