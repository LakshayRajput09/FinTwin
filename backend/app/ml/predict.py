import os
import joblib
import pandas as pd


# ==========================================
# MODEL CONFIGURATION
# ==========================================

MODEL_PATH = os.path.join(
    "models",
    "payment_delay_model.joblib",
)


FEATURES = [
    "invoice_amount",
    "days_until_due",
    "previous_avg_delay",
    "previous_late_payments",
    "customer_invoice_count",
]


# ==========================================
# LOAD MODEL
# ==========================================

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )


model = joblib.load(
    MODEL_PATH
)


# ==========================================
# PREDICT PAYMENT DELAY
# ==========================================

def predict_payment_delay(
    invoice_amount: float,
    days_until_due: int,
    previous_avg_delay: float,
    previous_late_payments: int,
    customer_invoice_count: int,
):

    data = pd.DataFrame(
        [
            {
                "invoice_amount": invoice_amount,
                "days_until_due": days_until_due,
                "previous_avg_delay": previous_avg_delay,
                "previous_late_payments": previous_late_payments,
                "customer_invoice_count": customer_invoice_count,
            }
        ]
    )

    prediction = model.predict(
        data[FEATURES]
    )[0]

    prediction = max(
        0,
        round(float(prediction), 2)
    )


    # ======================================
    # RISK CLASSIFICATION
    # ======================================

    if prediction <= 7:

        risk = "LOW"

    elif prediction <= 20:

        risk = "MEDIUM"

    else:

        risk = "HIGH"


    return {
        "predicted_delay_days": prediction,
        "risk": risk,
    }