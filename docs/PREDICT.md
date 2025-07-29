# Predict-funktionen / Predict Function

## Dansk

### Formål

Predict-funktionen er hjertet i SmartPortfolio og tager udgangspunkt i brugerens nuværende portefølje, markedets tilstand og investeringsstil. Den returnerer en forbedret portefølje, en liste over anbefalede transaktioner samt en vurdering af, om det er et godt tidspunkt at handle.

### Input
1. **Portfolio**
   - Beholdning: liste over aktier med ticker, antal, anskaffelseskurs og dato.
   - Kontantbeholdning.
   - Investeringshorisont (kort, mellem, lang).
   - Risikovillighed (lav, mellem, høj).
   - Favoritter / fravalg af aktier eller sektorer.
2. **Market data**
   - Aktuelle kurser og historiske bevægelser.
   - Nøgletal (PE, PEG, ROIC, gæld, udbytte).
   - Momentum (1, 3 og 6 måneder).
   - Makroindikatorer (rente, sektorrotation).
3. **Brugerpræferencer**
   - Stilvalg: value, growth, stabilt udbytte eller ESG.
   - Handelsfrekvens.
   - Kontantbuffer.

### Output
1. **Handling-score** (0–100)
   - 0–40: Vent
   - 41–70: Overvej justering
   - 71–100: Anbefalet handling
2. **Revideret portefølje** med foreslåede vægte.
3. **Transaktionsliste** over aktier der bør sælges eller købes.
4. **Forklaring** i kort tekst.

### Funktionalitet og logik
Predict kombinerer en scoringsmodel og et regelsæt for at sikre spredning, kontantbuffer og maksimal eksponering. Hver aktie vurderes ud fra nøgletal, performance og om den matcher brugerens strategi.

### Eksempelkald
```python
from smartportfolio.predict import predict, PortfolioInput, Stock

portfolio = PortfolioInput(
    holdings=[Stock(ticker="AAPL", quantity=10, purchase_price=150.0, purchase_date="2024-01-10")],
    cash_balance=2500.0,
    horizon="mellem",
    risk="middel"
)

result = predict(portfolio)
print(result)
```

---

## English

### Purpose
The predict function forms the core of SmartPortfolio. It evaluates the current portfolio together with market conditions and the user’s investment style. The function returns an improved portfolio, a list of recommended transactions and a score indicating whether action should be taken now.

### Input
1. **Portfolio**
   - Holdings: list of stocks with ticker, quantity, acquisition price and date.
   - Cash balance.
   - Investment horizon (short, medium, long).
   - Risk appetite (low, medium, high).
   - Favorites / exclusions of stocks or sectors.
2. **Market data**
   - Current prices and historical movements.
   - Key ratios (PE, PEG, ROIC, debt, dividend).
   - Momentum (1, 3 and 6 months).
   - Macro indicators (interest rates, sector rotation).
3. **User preferences**
   - Style: value, growth, steady dividend or ESG.
   - Trading frequency.
   - Desired cash buffer.

### Output
1. **Action score** (0–100)
   - 0–40: Hold
   - 41–70: Consider adjustments
   - 71–100: Action recommended
2. **Revised portfolio** with suggested weights.
3. **Transaction list** of stocks to sell or buy.
4. **Explanation** in clear text.

### Functionality and logic
The predict function combines a scoring model and rule set to ensure diversification, cash buffer and maximum exposure. Each stock is rated by key figures, performance and fit with the user’s strategy.

### Example call
```python
from smartportfolio.predict import predict, PortfolioInput, Stock

portfolio = PortfolioInput(
    holdings=[Stock(ticker="AAPL", quantity=10, purchase_price=150.0, purchase_date="2024-01-10")],
    cash_balance=2500.0,
    horizon="medium",
    risk="medium"
)

result = predict(portfolio)
print(result)
```
