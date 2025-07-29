const exchangeFees = {
  NewYork: 0.1,
  London: 0.5,
  Tokyo: 0.3,
  Frankfurt: 0.2
};

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

function PredictDemo() {
  const [risk, setRisk] = React.useState('medium');
  const [cash, setCash] = React.useState(10);
  const [lang, setLang] = React.useState('en');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [cashError, setCashError] = React.useState(null);
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

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
      <div className="controls">
        <label htmlFor="risk">{t.risk}:
          <select id="risk" value={risk} onChange={e => setRisk(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <span className="help" title="Select your overall risk appetite" aria-label="risk help">?</span>
        </label>
        <label htmlFor="cash">{t.cash}:
          <input id="cash" type="number" min="0" max="100" value={cash} onChange={handleCashChange} />
          <span className="help" title="Percentage of portfolio kept as cash (0-100)" aria-label="cash help">?</span>
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
