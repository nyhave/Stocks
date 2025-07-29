"""Simple predict algorithm for SmartPortfolio demo."""

from dataclasses import dataclass, field
from typing import List


@dataclass
class Holding:
    ticker: str
    quantity: int
    purchase_price: float


@dataclass
class PortfolioInput:
    holdings: List[Holding]
    cash: float
    horizon: str  # short, medium, long
    risk: str  # low, medium, high
    favorites: List[str] = field(default_factory=list)
    blacklist: List[str] = field(default_factory=list)


@dataclass
class Transaction:
    action: str  # "buy" or "sell"
    ticker: str
    amount: float


@dataclass
class PredictResult:
    action_score: int
    new_portfolio: PortfolioInput
    transactions: List[Transaction]
    explanation: str


def predict(portfolio: PortfolioInput) -> PredictResult:
    """Return a simple prediction based on risk level."""
    score = 80 if portfolio.risk == "high" else 40
    transactions: List[Transaction] = []
    if score > 70:
        transactions.append(Transaction(action="buy", ticker="MSFT", amount=1000))
        explanation = "Market trend positive - consider buying MSFT"
    else:
        explanation = "Portfolio in good balance"
    return PredictResult(
        action_score=score,
        new_portfolio=portfolio,
        transactions=transactions,
        explanation=explanation,
    )
