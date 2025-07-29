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

## Command Line Demo

The repository now includes a small CLI demonstrating the five GUI concepts:

```bash
python3 smartportfolio_cli.py
```

From the menu you can access:

1. **Dashboard** – shows a mock portfolio overview
2. **Recommendations** – prints example buy/sell suggestions
3. **Simulation mode** – lets you test a trade before approving
4. **Portfolio history** – displays a simple ASCII chart
5. **Settings** – change risk level and notification frequency

## GUI Concept

A simple user interface could include:

1. **Dashboard** – overview of total portfolio value, cash balance, and recent activity.
2. **Recommendations** – clear list of buy/sell suggestions with short explanations.
3. **Simulation mode** – preview the effect of potential trades before approving them.
4. **Portfolio history** – charts of performance compared to benchmarks.
5. **Settings** – personal preferences for risk level, sectors, and notification frequency.


## Web Demo

The `docs/` folder now contains a lightweight React web demo that can be served via GitHub Pages. It handles Firebase initialisation directly in the browser and uses [Tailwind CSS](https://tailwindcss.com/) for responsive styling on both mobile and desktop. If you replace it with a full React app, build it locally (for example with `npm run build`) and copy the static files into `docs/`.

The old Flutter demo has been removed. If no build is present, the page shows a simple placeholder message. Integration with a Python backend will be added later.

