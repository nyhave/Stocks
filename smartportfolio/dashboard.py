"""Dashboard module for SmartPortfolio CLI."""

from dataclasses import dataclass
from typing import List

@dataclass
class Activity:
    description: str
    amount: float

@dataclass
class Portfolio:
    total_value: float
    cash_balance: float
    activities: List[Activity]


def display_dashboard(portfolio: Portfolio) -> None:
    """Print a simple portfolio dashboard."""
    print("\n===== Dashboard =====")
    print(f"Total value: ${portfolio.total_value:.2f}")
    print(f"Cash balance: ${portfolio.cash_balance:.2f}")
    print("Recent activity:")
    for act in portfolio.activities[-5:]:
        print(f"- {act.description}: ${act.amount:.2f}")
    print()
