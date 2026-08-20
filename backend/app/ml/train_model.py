import os

import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


# ==========================================
# CONFIGURATION
# ==========================================

DATA_PATH = "data/payment_history.csv"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(
    MODEL_DIR,
    "payment_delay_model.joblib",
)


# ==========================================
# LOAD DATA
# ==========================================

df = pd.read_csv(DATA_PATH)

print(f"Loaded {len(df)} records.")


# ==========================================
# FEATURES
# ==========================================

features = [
    "invoice_amount",
    "days_until_due",
    "previous_avg_delay",
    "previous_late_payments",
    "customer_invoice_count",
]

target = "payment_delay_days"


X = df[features]

y = df[target]


# ==========================================
# TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = (
    train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )
)


print(
    f"Training records: {len(X_train)}"
)

print(
    f"Testing records: {len(X_test)}"
)


# ==========================================
# MODEL
# ==========================================

model = RandomForestRegressor(
    n_estimators=200,
    max_depth=12,
    random_state=42,
    n_jobs=-1,
)


# ==========================================
# TRAIN
# ==========================================

print("Training model...")

model.fit(
    X_train,
    y_train,
)


# ==========================================
# PREDICTION
# ==========================================

predictions = model.predict(
    X_test
)


# ==========================================
# EVALUATION
# ==========================================

mae = mean_absolute_error(
    y_test,
    predictions,
)

mse = mean_squared_error(
    y_test,
    predictions,
)

rmse = mse ** 0.5

r2 = r2_score(
    y_test,
    predictions,
)


print()
print("===================================")
print("MODEL PERFORMANCE")
print("===================================")

print(
    f"MAE  : {mae:.2f} days"
)

print(
    f"RMSE : {rmse:.2f} days"
)

print(
    f"R²   : {r2:.3f}"
)


# ==========================================
# FEATURE IMPORTANCE
# ==========================================

print()
print("===================================")
print("FEATURE IMPORTANCE")
print("===================================")

importance = pd.DataFrame(
    {
        "feature": features,
        "importance": model.feature_importances_,
    }
).sort_values(
    "importance",
    ascending=False,
)


for _, row in importance.iterrows():

    print(
        f"{row['feature']}: "
        f"{row['importance']:.3f}"
    )


# ==========================================
# SAVE MODEL
# ==========================================

os.makedirs(
    MODEL_DIR,
    exist_ok=True,
)

joblib.dump(
    model,
    MODEL_PATH,
)


print()
print(
    f"Model saved to: {MODEL_PATH}"
)