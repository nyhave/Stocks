"""Simplified predict algorithm for SmartPortfolio."""

from dataclasses import dataclass
from typing import List


@dataclass
class Stock:
    ticker: str
    quantity: int
    purchase_price: float
    purchase_date: str


@dataclass
class PortfolioInput:
    holdings: List[Stock]
    cash_balance: float
    horizon: str
    risk: str


@dataclass
class Transaction:
    action: str  # "buy" or "sell"
    ticker: str
    amount: int
    reason: str


@dataclass
class Prediction:
    action_score: int
    new_holdings: List[Stock]
    transactions: List[Transaction]
    explanation: str


def predict(portfolio: PortfolioInput) -> Prediction:
    """Return a dummy prediction based on the portfolio risk level."""
    if portfolio.risk == "low":
        score = 40
        transactions: List[Transaction] = []
        explanation = "Porteføljen ser stabil ud."
    else:
        score = 75
        transactions = [
            Transaction(action="sell", ticker="TSLA", amount=2, reason="High valuation"),
            Transaction(action="buy", ticker="AAPL", amount=2, reason="Strong earnings"),
        ]
        explanation = "Ny kandidat passer bedre til din strategi."

    return Prediction(
        action_score=score,
        new_holdings=portfolio.holdings,
        transactions=transactions,
        explanation=explanation,
    )
