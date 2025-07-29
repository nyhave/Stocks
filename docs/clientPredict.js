function clientPredict(input, lang) {
  const { risk = 'medium', cash = 10, bias = 'none' } = input;
  const invested = window.demoPortfolio.invested;
  const biasOptions = {
    none: [],
    tech: ['AAPL', 'MSFT', 'GOOG', 'NVDA', 'META', 'NFLX', 'SNOW', 'PLTR'],
    finance: ['JPM', 'C', 'GS', 'AXP'],
    industrial: ['GE', 'RR.L', 'IAG.L']
  };
  const allTickers = biasOptions.tech.concat(biasOptions.finance, biasOptions.industrial);

  const baseReturn = { low: 0.04, medium: 0.07, high: 0.12 };
  const biasBoost = bias === 'none' ? 0 : 0.02;
  const t = window.locales[lang];

  function buildHoldings(biasTickers, cashPercent) {
    const investWeight = 100 - cashPercent;
    const biasWeight = biasTickers.length ? investWeight * 0.6 : 0;
    const otherTickers = allTickers.filter(t => !biasTickers.includes(t)).slice(0, 5);
    const otherWeight = investWeight - biasWeight;
    const biasEach = biasTickers.length ? biasWeight / biasTickers.length : 0;
    const otherEach = otherTickers.length ? otherWeight / otherTickers.length : 0;
    const holdings = [];
    biasTickers.forEach(tk => holdings.push({ ticker: tk, weight: parseFloat(biasEach.toFixed(2)) }));
    otherTickers.forEach(tk => holdings.push({ ticker: tk, weight: parseFloat(otherEach.toFixed(2)) }));
    return holdings;
  }

  const suggestions = [
    { name: t.portfolioNames.defensive, risk: 'low', cash: Math.min(cash + 10, 100) },
    { name: t.portfolioNames.balanced, risk: 'medium', cash },
    { name: t.portfolioNames.aggressive, risk: 'high', cash: Math.max(cash - 10, 0) }
  ];

  const portfolios = suggestions.map(p => {
    const holdings = buildHoldings(biasOptions[bias], p.cash);
    const expReturnRate = baseReturn[p.risk] + biasBoost;
    const expectedReturn = invested * expReturnRate;
    const explanation = `${p.name} - ${t.biasExplanation[bias]}`;
    return { ...p, holdings, expectedReturn, explanation };
  });

  return new Promise(resolve => {
    setTimeout(() => resolve({ portfolios }), 500);
  });
}
window.clientPredict = clientPredict;
