"""Simulation module for SmartPortfolio CLI."""

from dataclasses import dataclass
from typing import Tuple

from .dashboard import Portfolio, Activity, display_dashboard

@dataclass
class Trade:
    ticker: str
    amount: float
    action: str  # "buy" or "sell"


def simulate_trade(portfolio: Portfolio, trade: Trade) -> Portfolio:
    """Return a new portfolio after applying the simulated trade."""
    new_portfolio = Portfolio(
        total_value=portfolio.total_value,
        cash_balance=portfolio.cash_balance,
        activities=list(portfolio.activities),
    )
    if trade.action == "buy":
        new_portfolio.cash_balance -= trade.amount
        new_portfolio.total_value += trade.amount
    else:
        new_portfolio.cash_balance += trade.amount
        new_portfolio.total_value -= trade.amount
    new_portfolio.activities.append(
        Activity(description=f"Simulated {trade.action} {trade.ticker}", amount=trade.amount)
    )
    return new_portfolio


def run_simulation(portfolio: Portfolio) -> None:
    """Interactively simulate a trade."""
    print("\n===== Simulation Mode =====")
    ticker = input("Ticker symbol: ")
    action = input("Action (buy/sell): ").lower()
    amount = float(input("Amount in USD: "))
    trade = Trade(ticker=ticker, action=action, amount=amount)
    new_portfolio = simulate_trade(portfolio, trade)
    display_dashboard(new_portfolio)
