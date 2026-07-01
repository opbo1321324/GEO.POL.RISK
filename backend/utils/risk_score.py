"""
utils/risk_score.py
Compute the Composite Risk Index (0–100) for each country-year record.
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold

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
        
    # Create binary crisis target for ML (1 if risk score > 50, else 0)
    df["crisis"] = (df["risk_score"] > 50).astype(int)

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

def run_ml_analysis(df: pd.DataFrame) -> dict:
    features = [c for c in INDICATORS.keys() if c in df.columns]
    
    sub = df[features + ["crisis"]].dropna()
    if sub.empty or len(sub["crisis"].unique()) < 2:
        return {"lr_auc": 0, "rf_auc": 0, "ranking": []}
        
    X = sub[features]
    y = sub["crisis"]
    
    scaler = StandardScaler()
    X_sc = scaler.fit_transform(X)
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    # Logistic Regression
    lr = LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42)
    lr_auc = cross_val_score(lr, X_sc, y, cv=cv, scoring="roc_auc").mean()
    lr.fit(X_sc, y)
    lr_coef = np.abs(lr.coef_[0])
    
    # Random Forest
    rf = RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42)
    rf_auc = cross_val_score(rf, X, y, cv=cv, scoring="roc_auc").mean()
    rf.fit(X, y)
    rf_imp = rf.feature_importances_
    
    # Calculate composite score for ranking (normalized to 100)
    rf_norm = (rf_imp / rf_imp.max()) * 100 if rf_imp.max() > 0 else np.zeros(len(features))
    lr_norm = (lr_coef / lr_coef.max()) * 100 if lr_coef.max() > 0 else np.zeros(len(features))
    
    composite_score = (rf_norm * 0.6) + (lr_norm * 0.4)
    
    ranking = []
    for i, feature in enumerate(features):
        category = "Macroeconomic" if feature in ["inflation", "gdp_growth", "interest_rate", "currency_rate"] else \
                   "Financial" if feature in ["government_debt", "current_account", "trade_imports", "liquidity"] else \
                   "Geopolitical"
                   
        ranking.append({
            "feature": feature.replace("_", " ").title(),
            "category": category,
            "rf_importance": round(float(rf_norm[i]), 2),
            "lr_importance": round(float(lr_norm[i]), 2),
            "composite_score": round(float(composite_score[i]), 2)
        })
        
    ranking = sorted(ranking, key=lambda x: x["composite_score"], reverse=True)
    for i, item in enumerate(ranking):
        item["rank"] = i + 1
        
    return {
        "lr_auc": round(float(lr_auc), 3),
        "rf_auc": round(float(rf_auc), 3),
        "ranking": ranking
    }
