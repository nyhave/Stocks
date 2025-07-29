# Predict-algoritmen

## Dansk

Predict-funktionen er hjertet i SmartPortfolio. Den tager udgangspunkt i brugerens nuværende portefølje, aktuelle markedsdata og investeringspræferencer. Resultatet er en opdateret portefølje samt en handleplan med vurdering af, om der bør foretages køb eller salg nu.

Input til funktionen består af:

- **Portefølje**: liste over beholdninger, kontantbeholdning, investeringshorisont, risikovillighed og eventuelle favoritter/fravalg.
- **Markedsdata**: nøgletal, momentum, rente og nyhedssentiment.
- **Brugerpræferencer**: stilvalg (value, vækst, udbytte, ESG), ønsket handelsfrekvens og kontantbuffer.

Output er:

1. **Handling-score** (0-100) der indikerer, om det er tid til at handle.
2. **Ny porteføljesammensætning** med foreslåede vægte.
3. **Transaktionsliste** over aktier der bør købes eller sælges.
4. **Kort forklaring** på anbefalingen.

Algoritmen kombinerer en simpel scoringsmodel med regler for spredning og risikostyring. I denne demo er logikken forenklet, men strukturen gør det let at udbygge med mere avancerede beregninger.

## English

The predict function is the core of SmartPortfolio. It analyzes the user's current portfolio along with market data and investment preferences. The output is an updated portfolio plus a recommended action plan indicating whether to buy or sell now.

Input parameters include:

- **Portfolio**: holdings, cash balance, investment horizon, risk level and any favorites/blacklist.
- **Market data**: valuation metrics, momentum, interest rate and news sentiment.
- **User preferences**: style (value, growth, dividend, ESG), desired trading frequency and cash buffer.

The function returns:

1. **Action score** (0-100) describing if trading is advised.
2. **Revised portfolio composition** with suggested weights.
3. **List of transactions** to buy or sell specific stocks.
4. **Short explanation** of the recommendation.

The algorithm uses a scoring model combined with rule-based checks for diversification and risk. This demo keeps the logic simple while leaving room for future improvements.

