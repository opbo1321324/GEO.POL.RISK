from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, roc_curve, confusion_matrix, classification_report
import shap
from pydantic import BaseModel
from backend.main import df_risk, app, np, pd

# Setup ML data context
from utils.risk_score import INDICATORS
FEATURE_COLS = [c for c in list(INDICATORS.keys()) if c in df_risk.columns]
TARGET_COL = "risk_level"
LABEL_MAP = {"Low": 0, "Medium": 1, "High": 2, "Extreme": 3}
INV_LABEL = {v: k for k, v in LABEL_MAP.items()}

ml_df = df_risk[FEATURE_COLS + [TARGET_COL]].dropna()
ml_df[TARGET_COL + "_enc"] = ml_df[TARGET_COL].map(LABEL_MAP)
ml_df = ml_df.dropna(subset=[TARGET_COL + "_enc"])
X = ml_df[FEATURE_COLS]
y = ml_df[TARGET_COL + "_enc"].astype(int)

class TrainRequest(BaseModel):
    model_type: str = "Random Forest"
    test_size: int = 20
    n_estimators: int = 100
    max_depth: int | None = None
    use_shap: bool = True

@app.post("/api/ml/train")
def train_model(req: TrainRequest):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=req.test_size / 100.0, random_state=42, stratify=y if y.nunique() > 1 else None
    )

    if req.model_type == "Random Forest":
        model = RandomForestClassifier(n_estimators=req.n_estimators, max_depth=req.max_depth, random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)
        importances = model.feature_importances_
    else:
        from sklearn.preprocessing import StandardScaler
        from sklearn.pipeline import Pipeline
        model = Pipeline([
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, random_state=42, multi_class="auto")),
        ])
        model.fit(X_train, y_train)
        clf = model.named_steps["clf"]
        importances = np.abs(clf.coef_).mean(axis=0) if hasattr(clf, "coef_") else np.zeros(len(FEATURE_COLS))

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test) if hasattr(model, "predict_proba") else None

    # Feature Importance
    fi_list = [{"feature": f.replace("_", " ").title(), "importance": float(i)} for f, i in zip(FEATURE_COLS, importances)]
    fi_list = sorted(fi_list, key=lambda x: x["importance"], reverse=True)

    # Confusion Matrix
    present_labels = sorted(y_test.unique())
    label_names = [INV_LABEL.get(i, str(i)) for i in present_labels]
    cm = confusion_matrix(y_test, y_pred, labels=present_labels)
    cm_norm = cm.astype(float) / cm.sum(axis=1, keepdims=True)
    
    # SHAP
    shap_data = []
    if req.use_shap and req.model_type == "Random Forest":
        try:
            explainer = shap.TreeExplainer(model)
            shap_vals = explainer.shap_values(X_test)
            if isinstance(shap_vals, list):
                mean_shap = np.mean([np.abs(sv).mean(axis=0) for sv in shap_vals], axis=0)
            else:
                mean_shap = np.abs(shap_vals).mean(axis=0)
            shap_data = [{"feature": f.replace("_", " ").title(), "shap": float(s)} for f, s in zip(FEATURE_COLS, mean_shap)]
            shap_data = sorted(shap_data, key=lambda x: x["shap"], reverse=True)
        except Exception:
            pass

    return {
        "metrics": {
            "train_samples": len(X_train),
            "test_samples": len(X_test)
        },
        "feature_importance": fi_list,
        "confusion_matrix": {
            "labels": label_names,
            "values": cm.tolist(),
            "normalized": cm_norm.tolist()
        },
        "shap_values": shap_data
    }
