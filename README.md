# 📊 SmartPortfolio

This repository contains the early planning documents for **SmartPortfolio**, a web and mobile application aimed at helping private investors optimize their stock portfolios.

See [VISION.md](VISION.md) for the detailed vision statement in both Danish and English.

## Overview

SmartPortfolio is intended to:

- Provide an easy-to-understand portfolio overview
- Offer buy/sell recommendations based on data and user preferences
- Support partially invested portfolios with a cash buffer
- Let users simulate changes before approving them

This project is currently in the planning phase. More documentation and implementation details will follow as development progresses.

The React application in the repository root is now the production front-end served via GitHub Pages.

## GUI Concept

A simple user interface could include:

1. **Dashboard** – overview of total portfolio value, cash balance, and recent activity.
2. **Recommendations** – clear list of buy/sell suggestions with short explanations.
3. **Simulation mode** – preview the effect of potential trades before approving them.
4. **Portfolio history** – charts of performance compared to benchmarks.
5. **Settings** – personal preferences for risk level, sectors, and notification frequency.


## React App

The project root hosts `index.html` which contains the production React application served from GitHub Pages. The supporting scripts live inside the `src/` folder. Build the app locally (for example with `npm run build`) and copy the static files into `src/` when updating the site.

The old Flutter demo has been removed. If no build is present, the page shows a simple placeholder message. The backend will also be written in JavaScript.

Sample command-line scripts demonstrating the portfolio logic are located in `src/smartportfolio/`. They can be executed with Node for quick experimentation.


## Progressive Web App

SmartPortfolio can be installed as a Progressive Web App on modern browsers. When installed, the app opens in its own window without the browser address bar.

1. Open [SmartPortfolio](https://morninj.github.io/SmartPortfolio/) in your mobile or desktop browser.
2. Use the browser's **Add to Home Screen** or **Install** option.
3. Launch the app from the home screen to run it in standalone mode.

The manifest and service worker needed for installation are included in the repository.
