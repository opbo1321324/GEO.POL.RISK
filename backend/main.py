import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np

# Adjust path so utils can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from utils.data_loader import load_all_data
from utils.risk_score import compute_risk_scores, run_ml_analysis

app = FastAPI(title="EWS Backend API")

# Enable CORS for Next.js frontend (which will run on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data into memory
raw_data = load_all_data()
df_risk = compute_risk_scores(raw_data)

# Replace NaN with None for JSON serialization
df_risk = df_risk.replace({np.nan: None})

@app.get("/api/dashboard")
def get_dashboard_data():
    latest_year = df_risk["year"].max()
    latest_data = df_risk[df_risk["year"] == latest_year]
    
    avg_risk = latest_data["risk_score"].mean()
    high_risk_count = latest_data[latest_data["risk_level"].isin(["High", "Extreme"])].shape[0]
    avg_infl = latest_data["inflation"].mean() if "inflation" in latest_data.columns else 0
    avg_gdp = latest_data["gdp_growth"].mean() if "gdp_growth" in latest_data.columns else 0
    
    # Trend data (average risk score by year)
    trend = df_risk.groupby("year")["risk_score"].mean().reset_index()
    
    return {
        "kpis": {
            "countries_covered": latest_data["country"].nunique(),
            "avg_risk": float(avg_risk),
            "high_risk_count": int(high_risk_count),
            "avg_inflation": float(avg_infl) if avg_infl else None,
            "avg_gdp_growth": float(avg_gdp) if avg_gdp else None,
            "latest_year": int(latest_year)
        },
        "trend": trend.to_dict(orient="records"),
        "top_riskiest": latest_data.nlargest(10, "risk_score")[["country", "risk_score", "risk_level"]].to_dict(orient="records")
    }

@app.get("/api/map")
def get_map_data(year: int = None):
    if not year:
        year = int(df_risk["year"].max())
    year_data = df_risk[df_risk["year"] == year]
    # For a map, it's easiest to just send the whole dataframe for that year
    return year_data.to_dict(orient="records")

@app.get("/api/countries")
def get_countries():
    return sorted(df_risk["country"].unique().tolist())

@app.get("/api/country/{country_name}")
def get_country_analysis(country_name: str):
    country_data = df_risk[df_risk["country"] == country_name].sort_values("year")
    return country_data.to_dict(orient="records")

@app.get("/api/full-data")
def get_full_data():
    return df_risk.to_dict(orient="records")

@app.get("/api/ml-analysis")
def get_ml_analysis():
    return run_ml_analysis(df_risk)
