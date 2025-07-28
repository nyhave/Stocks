"""Command-line interface for SmartPortfolio demo."""

from smartportfolio.dashboard import Activity, Portfolio, display_dashboard
from smartportfolio.recommendations import Recommendation, list_recommendations
from smartportfolio.simulation import run_simulation
from smartportfolio.history import show_history
from smartportfolio.settings import Settings, configure_settings


def main() -> None:
    portfolio = Portfolio(
        total_value=10000.0,
        cash_balance=2500.0,
        activities=[
            Activity(description="Initial deposit", amount=10000.0),
        ],
    )
    recommendations = [
        Recommendation(action="buy", ticker="AAPL", reason="Strong earnings"),
        Recommendation(action="sell", ticker="TSLA", reason="High valuation"),
    ]
    history = [9500, 9600, 9700, 9800, 10000]
    settings = Settings()

    while True:
        print("Main Menu")
        print("1. Dashboard")
        print("2. Recommendations")
        print("3. Simulation mode")
        print("4. Portfolio history")
        print("5. Settings")
        print("6. Quit")
        choice = input("Choose an option: ")
        if choice == "1":
            display_dashboard(portfolio)
        elif choice == "2":
            list_recommendations(recommendations)
        elif choice == "3":
            run_simulation(portfolio)
        elif choice == "4":
            show_history(history)
        elif choice == "5":
            settings = configure_settings(settings)
        elif choice == "6":
            break
        else:
            print("Invalid choice.\n")


if __name__ == "__main__":
    main()
