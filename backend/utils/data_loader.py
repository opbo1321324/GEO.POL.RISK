"""
utils/data_loader.py
Load and merge all EWS Excel datasets from the data/ folder.
"""
import os
import pandas as pd
import numpy as np
import streamlit as st

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

# ── File registry ──────────────────────────────────────────────────────────────
FILES = {
    "imf":        "IMF_WEO_Cleaned_G20.xlsx",
    "acled":      "ACLED_Cleaned_Country_Year.xlsx",
    "inflation":  "Inflation_Cleaned_G20.xlsx",
    "interest":   "Interest_Rates_Cleaned_G20.xlsx",
    "currency":   "Currency_Rates_Cleaned_G20.xlsx",
    "liquidity":  "International_Liquidity_Cleaned_G20.xlsx",
    "trade":      "Trade_Imports_Cleaned_G20.xlsx",
}

# Expected column aliases (various possible headers → standard name)
COLUMN_ALIASES = {
    "country":            ["country", "country_name", "economy", "name", "Country", "Country Name"],
    "year":               ["year", "Year", "date", "Date", "yr"],
    "gdp_growth":         ["gdp_growth", "GDP Growth", "gdp growth", "ngdp_rpch", "NGDP_RPCH", "GDP_Growth"],
    "government_debt":    ["government_debt", "Debt", "debt", "ggxwdg_ngdp", "GGXWDG_NGDP", "Gov_Debt"],
    "current_account":    ["current_account", "Current Account", "bca_ngdpd", "BCA_NGDPD", "CA_Balance"],
    "inflation":          ["inflation", "Inflation", "inf", "pcpipch", "PCPIPCH", "CPI"],
    "interest_rate":      ["interest_rate", "Interest Rate", "rate", "Rate", "Interest_Rate"],
    "currency_rate":      ["currency_rate", "Currency Rate", "exchange_rate", "rate", "Rate", "FX_Rate"],
    "trade_imports":      ["trade_imports", "Imports", "imports", "Trade_Imports", "tm_rpch"],
    "liquidity":          ["liquidity", "Reserves", "reserves", "International_Reserves", "Liquidity"],
    "conflict_events":    ["conflict_events", "events", "Events", "conflict", "Conflict_Events", "total_events"],
    "protests":           ["protests", "protest", "Protests", "demonstrations", "Demonstrations"],
    "fatalities":         ["fatalities", "Fatalities", "deaths", "Deaths", "total_fatalities"],
}


def _normalise_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Rename columns to standard names based on COLUMN_ALIASES."""
    rename_map = {}
    for std_name, aliases in COLUMN_ALIASES.items():
        for alias in aliases:
            if alias in df.columns and std_name not in rename_map.values():
                rename_map[alias] = std_name
                break
    return df.rename(columns=rename_map)


def _load_single(key: str, filename: str) -> pd.DataFrame | None:
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return None
    try:
        df = pd.read_excel(path)
        df = _normalise_columns(df)
        # Ensure country & year columns exist
        if "country" not in df.columns or "year" not in df.columns:
            return None
        df["country"] = df["country"].astype(str).str.strip()
        df["year"] = pd.to_numeric(df["year"], errors="coerce")
        df = df.dropna(subset=["year"])
        df["year"] = df["year"].astype(int)
        return df
    except Exception:
        return None


@st.cache_data(show_spinner=False)
def load_all_data() -> pd.DataFrame:
    """Load, merge, and return the consolidated dataset."""
    frames = {}
    for key, filename in FILES.items():
        df = _load_single(key, filename)
        if df is not None:
            frames[key] = df

    if not frames:
        return _generate_synthetic_data()

    # Start with IMF as base (or first available)
    base_key = "imf" if "imf" in frames else list(frames.keys())[0]
    merged = frames.pop(base_key)

    for key, df in frames.items():
        # Keep only useful columns
        cols = ["country", "year"] + [c for c in df.columns if c not in ("country", "year") and c in list(COLUMN_ALIASES.keys())]
        cols = list(dict.fromkeys(cols))
        df_sub = df[[c for c in cols if c in df.columns]]
        merged = merged.merge(df_sub, on=["country", "year"], how="outer", suffixes=("", f"_{key}"))

    # Drop duplicate columns (keep first occurrence)
    merged = merged.loc[:, ~merged.columns.duplicated()]

    # Ensure all expected numeric columns exist
    numeric_cols = [
        "gdp_growth", "government_debt", "current_account", "inflation",
        "interest_rate", "currency_rate", "trade_imports", "liquidity",
        "conflict_events", "protests", "fatalities",
    ]
    for col in numeric_cols:
        if col not in merged.columns:
            merged[col] = np.nan

    merged = merged.sort_values(["country", "year"]).reset_index(drop=True)
    return merged


# ── Synthetic Data Fallback ────────────────────────────────────────────────────
G20_COUNTRIES = [
    "Argentina", "Australia", "Brazil", "Canada", "China", "France",
    "Germany", "India", "Indonesia", "Italy", "Japan", "Mexico",
    "Russia", "Saudi Arabia", "South Africa", "South Korea",
    "Turkey", "United Kingdom", "United States", "European Union",
]

COUNTRY_ISO = {
    "Argentina": "ARG", "Australia": "AUS", "Brazil": "BRA", "Canada": "CAN",
    "China": "CHN", "France": "FRA", "Germany": "DEU", "India": "IND",
    "Indonesia": "IDN", "Italy": "ITA", "Japan": "JPN", "Mexico": "MEX",
    "Russia": "RUS", "Saudi Arabia": "SAU", "South Africa": "ZAF",
    "South Korea": "KOR", "Turkey": "TUR", "United Kingdom": "GBR",
    "United States": "USA", "European Union": "EUU",
}

def _generate_synthetic_data() -> pd.DataFrame:
    """Generate realistic synthetic data when Excel files are absent."""
    rng = np.random.default_rng(42)
    years = list(range(2010, 2024))
    rows = []
    for country in G20_COUNTRIES:
        base_risk = rng.uniform(10, 70)
        for year in years:
            trend = (year - 2010) * rng.uniform(-0.5, 1.2)
            shock = rng.normal(0, 5) if rng.random() < 0.15 else 0
            rows.append({
                "country":         country,
                "iso_alpha3":      COUNTRY_ISO.get(country, ""),
                "year":            year,
                "gdp_growth":      rng.normal(2.5, 2.5),
                "government_debt": rng.uniform(30, 130),
                "current_account": rng.normal(-1, 4),
                "inflation":       abs(rng.normal(3, 4)) + shock,
                "interest_rate":   abs(rng.normal(3, 3)),
                "currency_rate":   rng.uniform(0.5, 5.0),
                "trade_imports":   rng.normal(0, 8),
                "liquidity":       rng.uniform(50, 800),
                "conflict_events": max(0, int(rng.normal(base_risk * 0.4 + trend, 15))),
                "protests":        max(0, int(rng.normal(base_risk * 0.3, 10))),
                "fatalities":      max(0, int(rng.normal(base_risk * 0.2 + shock, 30))),
            })
    return pd.DataFrame(rows)


def get_country_list(df: pd.DataFrame) -> list[str]:
    return sorted(df["country"].unique().tolist())


def get_year_range(df: pd.DataFrame) -> tuple[int, int]:
    return int(df["year"].min()), int(df["year"].max())


def get_latest_year_data(df: pd.DataFrame) -> pd.DataFrame:
    latest = df["year"].max()
    return df[df["year"] == latest].copy()
