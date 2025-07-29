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

function Help({ text }) {
  const [show, setShow] = React.useState(false);
  return (
    <span className="help" onClick={() => setShow(!show)}>
      ?{show && <span className="helptext">{text}</span>}
    </span>
  );
}

const riskLevels = ['low', 'medium', 'high'];

function PredictDemo() {
  const [risk, setRisk] = React.useState(() => localStorage.getItem('risk') || 'medium');
  const [cash, setCash] = React.useState(() => Number(localStorage.getItem('cash') || 10));
  const [lang, setLang] = React.useState(() => localStorage.getItem('lang') || 'en');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [cashError, setCashError] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem('darkMode') === 'true');
  const [holdings, setHoldings] = React.useState(getHoldingsWithValue(window.demoPortfolio));

  React.useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  React.useEffect(() => {
    localStorage.setItem('risk', risk);
  }, [risk]);

  React.useEffect(() => {
    localStorage.setItem('cash', cash);
  }, [cash]);

  React.useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

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

  const getTransactionCost = t => {
    const fee = exchangeFees[t.exchange] || 0;
    return (t.amount * fee) / 100;
  };

  return (
    <div className="container">
      <h1>SmartPortfolio React Demo (with Firebase)</h1>
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
      <div className="controls">
        <label htmlFor="risk">{t.risk}:
          <input
            id="risk"
            type="range"
            min="0"
            max="2"
            step="1"
            value={riskLevels.indexOf(risk)}
            onChange={e => setRisk(riskLevels[e.target.value])}
          />
          <span className="range-value">{risk}</span>
          <Help text={t.riskHelp} />
        </label>
        <label htmlFor="cash">{t.cash}:
          <input id="cash" type="range" min="0" max="100" value={cash} onChange={handleCashChange} />
          <span className="range-value">{cash}%</span>
          <Help text={t.cashHelp} />
        </label>
        {cashError && <div className="error">{cashError}</div>}
        <label htmlFor="lang">{t.lang}:
          <select id="lang" value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="da">Dansk</option>
          </select>
        </label>
        <label>
          <input type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} /> {t.darkMode}
        </label>
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PredictDemo />);
