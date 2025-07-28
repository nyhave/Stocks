"""Recommendations module for SmartPortfolio CLI."""

from dataclasses import dataclass
from typing import List

@dataclass
class Recommendation:
    action: str  # "buy" or "sell"
    ticker: str
    reason: str


def list_recommendations(recommendations: List[Recommendation]) -> None:
    """Print buy/sell recommendations."""
    print("\n===== Recommendations =====")
    for rec in recommendations:
        print(f"{rec.action.title()} {rec.ticker} - {rec.reason}")
    print()
