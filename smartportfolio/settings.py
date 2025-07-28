"""Settings module for SmartPortfolio CLI."""

from dataclasses import dataclass


@dataclass
class Settings:
    risk_level: str = "medium"  # low, medium, high
    notify_frequency: str = "weekly"


def configure_settings(settings: Settings) -> Settings:
    """Interactively configure user settings."""
    print("\n===== Settings =====")
    risk = input(f"Risk level (low/medium/high) [{settings.risk_level}]: ")
    if risk:
        settings.risk_level = risk
    freq = input(f"Notification frequency (daily/weekly/monthly) [{settings.notify_frequency}]: ")
    if freq:
        settings.notify_frequency = freq
    print("Settings updated.\n")
    return settings
