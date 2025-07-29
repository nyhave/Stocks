# 📄 Visionsdokument – SmartPortfolio

**Version:** 1.0  
**Dato:** 28. juli 2025  
**Kontaktperson:** Morten Nyhave Nielsen

---

## 🎯 Vision

Formålet er at skabe en brugervenlig web- og mobilapplikation, der hjælper private investorer med at optimere deres aktieportefølje over tid. Appen skal give forslag til, hvornår brugeren bør sælge udvalgte aktier og investere i nye, baseret på data og strategi – samtidig med at den understøtter, at porteføljen ikke altid er 100 % investeret.

Brugeren skal ikke være afhængig af at følge aktiemarkedet dagligt, men modtage relevante og velbegrundede anbefalinger i et enkelt overblik.

### Vision (English)

The goal is to create a user-friendly web and mobile application that helps private investors optimize their stock portfolio over time. The app should provide suggestions for when the user should sell selected stocks and invest in new ones, based on data and strategy, while supporting that the portfolio is not always 100% invested.

The user should not be dependent on following the stock market daily but should receive relevant and well-founded recommendations at a glance.

---

## 🧩 Centrale funktioner (MVP)

### 1. Porteføljeoverblik
- Manuel eller automatisk indtastning/import af nuværende beholdning
- Visning af aktier, kontantbeholdning og historik
- Grafisk visning af udvikling

### 2. Køb/salg-anbefalinger
- Forslag til udskiftning af aktier (sælg X, køb Y)
- Forklaring på forslag (fx nøgletal, brancheanalyse, momentum)
- Brugertilpasning af præferencer: value, vækst, tech, udbytte m.m.

### 3. Likviditet og balancering
- Understøtter kontantbuffer og ikke-fuldt investerede porteføljer
- Foreslår ikke bare nye køb, men også hvad der evt. bør sælges først

### 4. Simulering og godkendelse
- Brugeren kan simulere ændringer og se effekt før godkendelse
- Alt styres manuelt – ingen automatiske handler

### 5. Notifikationer og rapporter
- Push/mail: "Nu anbefaler vi en ændring"
- Månedlig rapport: performance vs. benchmark

---

## 💼 Forretningsmodel

### Freemium
- **Gratis:** Grundlæggende porteføljeoverblik og performance
- **Premium (49–99 kr./md):**
  - Dynamiske anbefalinger
  - Personlige rapporter og notifikationer
  - Avancerede analyser

---

## 👥 Målgruppe

- Private investorer med porteføljer over 100.000 kr.
- Teknologivante, men ikke nødvendigvis professionelle
- Ønsker rådgivning uden at skulle følge markedet dagligt

---

## 📈 Teknisk retning (forslag)

- **Frontend:** React for the web (and potentially React Native for mobile)
- **Backend:** Firebase 
- **Data:** Integration til fx Yahoo Finance, Finnhub eller Alpha Vantage API
- **Analyse:** JavaScript-motor til transaktionsforslag / JavaScript engine for transaction suggestions
- **Hosting:** endnu ikke afklaret. Vi starter med GitHub Pages

---

## 🚀 Langsigtet mål

At blive den foretrukne digitale rådgiver for semiaktive investorer i Danmark – og senere internationalt.

