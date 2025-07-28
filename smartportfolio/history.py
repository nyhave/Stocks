"""Portfolio history module for SmartPortfolio CLI."""

from typing import List


def show_history(history: List[float]) -> None:
    """Print portfolio history as a simple chart."""
    print("\n===== Portfolio History =====")
    for i, value in enumerate(history[-10:], 1):
        bar = '*' * int(value / max(history) * 40) if history else ''
        print(f"Day {i:2d}: {bar} (${value:.2f})")
    print()
