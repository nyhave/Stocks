function dummyPredict(input, lang) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        actionScore: 75,
        explanation: {
          da: 'Din eksponering mod tech er for h\u00f8j',
          en: 'Your exposure to tech is too high',
        },
        transactions: [
          { action: 'buy', ticker: 'AAPL', amount: 2 },
          { action: 'sell', ticker: 'TSLA', amount: 1 }
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

  const handlePredict = async () => {
    if (cash < 0 || cash > 100) {
      alert('Cash % must be between 0 and 100');
      return;
    }
    setLoading(true);
    const res = await dummyPredict({ risk, cash }, lang);
    setResult(res);
    setLoading(false);
  };

  const explanation = result ? result.explanation[lang] : '';

  return (
    <div className="container">
      <h1>SmartPortfolio React Demo (with Firebase)</h1>
      <div className="controls">
        <label htmlFor="risk">Risk:
          <select id="risk" value={risk} onChange={e => setRisk(e.target.value)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <span className="help" title="Select your overall risk appetite">?</span>
        </label>
        <label htmlFor="cash">Cash %:
          <input id="cash" type="number" min="0" max="100" value={cash} onChange={e => setCash(Number(e.target.value))} />
          <span className="help" title="Percentage of portfolio kept as cash (0-100)">?</span>
        </label>
        <label htmlFor="lang">Language:
          <select id="lang" value={lang} onChange={e => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="da">Dansk</option>
          </select>
        </label>
        <button onClick={handlePredict} disabled={loading}>{loading ? 'Predicting...' : 'Predict'}</button>
      </div>
      {result && (
        <div className="result">
          <h2>Result</h2>
          <div className="score-bar"><div className="score" style={{ width: result.actionScore + '%' }}></div></div>
          <p className="explanation">{explanation}</p>
          <ul>
            {result.transactions.map((t, i) => (
              <li key={i} className={t.action}>{t.action === 'buy' ? '✔️' : '❌'} {t.action} {t.ticker} ({t.amount})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PredictDemo />);

