import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.impute import SimpleImputer
from sklearn.multioutput import MultiOutputRegressor
from fractions import Fraction
import joblib

# Load dataset
df = pd.read_excel("CT Dataset For Model Error Prediction.xlsx")

# Convert strings like '13.1/1', '1,200' etc.
def convert_ratio_like_value(val):
    try:
        if isinstance(val, str):
            val = val.strip().replace('\\', '/')
            if '/' in val:
                parts = val.split('/')
                if len(parts) == 2:
                    return float(Fraction(parts[0]) / Fraction(parts[1]))
            val = val.replace(',', '')
        return float(val)
    except (ValueError, TypeError, ZeroDivisionError):
        return np.nan

# Preprocess function
def preprocess_data(df):
    df = df.copy()
    numeric_cols = ['CTRatio', 'Burden', 'STC', 'BDVOil', 'PrimarytoSecondary', 'PrimarytoEarth', 'SecondarytoEarth']
    for col in numeric_cols:
        df[col] = df[col].apply(convert_ratio_like_value)
    categorical_cols = ['Type1', 'Type2', 'class']
    for col in categorical_cols:
        df[col] = df[col].astype(str).str.strip()
    return df

# Input and output columns
input_cols = [
    "CTRatio", "Burden", "STC", "Type1", "Type2", "class",
    "BDVOil", "PrimarytoSecondary", "PrimarytoEarth", "SecondarytoEarth"
]

output_cols = [
    "Ratio100Error120", "Ratio100Error100", "Ratio100Error20", "Ratio100Error5", "Ratio100Error1",
    "Phase100Error120", "Phase100Error100", "Phase100Error20", "Phase100Error5", "Phase100Error1",
    "Ratio25Error120", "Ratio25Error100", "Ratio25Error20", "Ratio25Error5", "Ratio25Error1",
    "Phase25Error120", "Phase25Error100", "Phase25Error20", "Phase25Error5", "Phase25Error1"
]

# Apply preprocessing
df = preprocess_data(df)

# Drop rows with missing outputs
df = df.dropna(subset=output_cols)

# Separate inputs and outputs
X = df[input_cols]
y = df[output_cols]

# Define numeric and categorical columns
numeric_cols = ['CTRatio', 'Burden', 'STC', 'BDVOil', 'PrimarytoSecondary', 'PrimarytoEarth', 'SecondarytoEarth']
categorical_cols = ['Type1', 'Type2', 'class']

# Column transformer
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('encoder', OneHotEncoder(handle_unknown="ignore"))
        ]), categorical_cols),
        ("num", Pipeline([
            ('imputer', SimpleImputer(strategy='mean')),
            ('scaler', 'passthrough')
        ]), numeric_cols)
    ]
)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Full pipeline with MultiOutput + GradientBoosting
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("regressor", MultiOutputRegressor(GradientBoostingRegressor()))
])

# Grid search hyperparameters
param_grid = {
    "regressor__estimator__n_estimators": [100, 200],
    "regressor__estimator__learning_rate": [0.05, 0.1],
    "regressor__estimator__max_depth": [3, 5]
}

# Grid search setup
grid_search = GridSearchCV(
    pipeline,
    param_grid,
    scoring="neg_mean_absolute_error",
    cv=3,
    verbose=1,
    n_jobs=-1
)

# Fit the model
grid_search.fit(X_train, y_train)
best_model = grid_search.best_estimator_

# Predictions
y_pred = best_model.predict(X_test)

# Evaluation
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Output results
print("✅ Best Parameters:", grid_search.best_params_)
print(f"✅ Mean Absolute Error (All Output Groups): {mae:.4f}")
print(f"✅ R² Score (All Output Groups): {r2:.4f}")

# Save model
joblib.dump(best_model, "ct_error_predictor_model_all_outputs.joblib")
print("✅ Model saved successfully.")
