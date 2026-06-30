"""
utils/risk_score.py
Compute the Composite Risk Index (0–100) for each country-year record.
"""
import numpy as np
import pandas as pd


# ── Indicator weights & direction ──────────────────────────────────────────────
# direction = +1 means "higher value → higher risk"
#            = -1 means "higher value → lower risk" (protective)
INDICATORS = {
    "inflation":       {"weight": 0.15, "direction": +1},
    "government_debt": {"weight": 0.12, "direction": +1},
    "current_account": {"weight": 0.10, "direction": +1},  # large deficit = higher risk
    "gdp_growth":      {"weight": 0.12, "direction": -1},  # lower growth = higher risk
    "interest_rate":   {"weight": 0.10, "direction": +1},
    "currency_rate":   {"weight": 0.08, "direction": +1},
    "trade_imports":   {"weight": 0.08, "direction": -1},
    "liquidity":       {"weight": 0.08, "direction": -1},
    "conflict_events": {"weight": 0.07, "direction": +1},
    "protests":        {"weight": 0.05, "direction": +1},
    "fatalities":      {"weight": 0.05, "direction": +1},
}

RISK_LEVELS = [
    (0,  25,  "Low",     "#10b981"),
    (25, 50,  "Medium",  "#f59e0b"),
    (50, 75,  "High",    "#ef4444"),
    (75, 101, "Extreme", "#dc2626"),
]


def _minmax(series: pd.Series) -> pd.Series:
    """Min-max normalise a series to [0, 1], handling NaN gracefully."""
    lo, hi = series.min(), series.max()
    if hi == lo:
        return pd.Series(np.zeros(len(series)), index=series.index)
    return (series - lo) / (hi - lo)


def compute_risk_scores(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add columns:
      - risk_score       : float in [0, 100]
      - risk_level       : 'Low' / 'Medium' / 'High' / 'Extreme'
      - risk_color       : hex color for that level
      - <indicator>_norm : normalised value for each indicator
    """
    df = df.copy()

    weighted_sum = pd.Series(np.zeros(len(df)), index=df.index)
    total_weight = 0.0

    for col, meta in INDICATORS.items():
        if col not in df.columns or df[col].isna().all():
            continue

        # Fill NaN with median so scoring still works
        filled = df[col].fillna(df[col].median())
        normed = _minmax(filled)
        norm_col = f"{col}_norm"
        df[norm_col] = normed

        # Flip direction for protective indicators
        contribution = normed if meta["direction"] == +1 else (1 - normed)
        weighted_sum += contribution * meta["weight"]
        total_weight += meta["weight"]

    if total_weight > 0:
        df["risk_score"] = (weighted_sum / total_weight * 100).clip(0, 100).round(2)
    else:
        df["risk_score"] = 50.0

    # Map score → level + color
    def _classify(score):
        for lo, hi, label, color in RISK_LEVELS:
            if lo <= score < hi:
                return label, color
        return "Extreme", "#dc2626"

    labels_colors = df["risk_score"].apply(_classify)
    df["risk_level"] = labels_colors.apply(lambda x: x[0])
    df["risk_color"] = labels_colors.apply(lambda x: x[1])

    return df


def get_risk_color(level: str) -> str:
    for _, _, lbl, clr in RISK_LEVELS:
        if lbl == level:
            return clr
    return "#94a3b8"


def get_risk_level_from_score(score: float) -> tuple[str, str]:
    for lo, hi, label, color in RISK_LEVELS:
        if lo <= score < hi:
            return label, color
    return "Extreme", "#dc2626"
