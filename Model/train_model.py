import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import joblib

# Load dataset
df = pd.read_csv('PT Dataset For Model Error Prediction.csv')

# Drop constant or unneeded columns
df = df.drop(columns=['VoltageFactor', 'Speciations'], errors='ignore')  # Removed 'Speciations'

# Define input and target features based on remaining usable columns
input_features = [
    'Burden', 'class', 'BDVOil', 
    'PrimarytoSecondary', 'PrimarytoEarth', 'SecondarytoEarth'
]
target_features = [
    'Ratio100Error120', 'Ratio100Error100', 'Ratio100Error80',
    'Phase100Error120', 'Phase100Error100', 'Phase100Error80'
]

# Verify that the required columns exist
missing_inputs = [col for col in input_features if col not in df.columns]
missing_targets = [col for col in target_features if col not in df.columns]

if missing_inputs or missing_targets:
    raise ValueError(f"Missing columns - Inputs: {missing_inputs}, Targets: {missing_targets}")

# Create input/output sets
X = df[input_features]
y = df[target_features]

# Define categorical columns for one-hot encoding
categorical_cols = ['class']

# Create preprocessing and model pipeline
preprocessor = ColumnTransformer([
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
], remainder='passthrough')

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
pipeline.fit(X_train, y_train)

# Save model to file
joblib.dump(pipeline, 'pt_error_predictor.pkl')

# Optional: Evaluate model
print(f"Model R^2 score on test data: {pipeline.score(X_test, y_test):.4f}")
