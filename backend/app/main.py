from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.ml.predict import predict_payment_delay
from app.services.forecast_service import generate_cash_forecast
from app.services.risk_service import generate_risk_analysis
from app.services.simulator_service import run_simulation
from app.services.financing_service import generate_financing_analysis


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="FinTwin API",
    description="AI-powered financial digital twin for MSMEs",
    version="1.0.0",
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# REQUEST MODELS
# ==========================================

class PaymentPredictionRequest(BaseModel):
    invoice_amount: float
    days_until_due: int
    previous_avg_delay: float
    previous_late_payments: int
    customer_invoice_count: int


class ForecastRequest(BaseModel):
    current_cash: float
    invoices: list[dict]
    payments: list[dict]
    recurring_expenses: list[dict]
    one_time_expenses: list[dict]


class RiskRequest(BaseModel):
    current_cash: float
    invoices: list[dict]
    recurring_expenses: list[dict]
    one_time_expenses: list[dict]
    forecast: dict


class SimulationRequest(BaseModel):
    current_cash: float
    invoices: list[dict]
    recurring_expenses: list[dict]
    one_time_expenses: list[dict]

    revenue_change_percent: float = 0
    expense_change_percent: float = 0
    payment_delay_days: int = 0


class FinancingRequest(BaseModel):
    liquidity_gap: float
    outstanding_receivables: float
    current_cash: float


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "FinTwin API is running",
        "status": "healthy",
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "FinTwin Backend",
    }


# ==========================================
# ML PAYMENT DELAY PREDICTION
# ==========================================

@app.post("/api/ml/predict-payment-delay")
def predict_payment(
    request: PaymentPredictionRequest,
):

    result = predict_payment_delay(
        invoice_amount=request.invoice_amount,
        days_until_due=request.days_until_due,
        previous_avg_delay=request.previous_avg_delay,
        previous_late_payments=request.previous_late_payments,
        customer_invoice_count=request.customer_invoice_count,
    )

    return {
        "success": True,
        "prediction": result,
    }


# ==========================================
# AI CASH FLOW FORECAST
# ==========================================

@app.post("/api/forecast")
def create_forecast(
    request: ForecastRequest,
):

    result = generate_cash_forecast(
        current_cash=request.current_cash,
        invoices=request.invoices,
        payments=request.payments,
        recurring_expenses=request.recurring_expenses,
        one_time_expenses=request.one_time_expenses,
    )

    return {
        "success": True,
        "forecast": result,
    }


# ==========================================
# AI RISK ANALYSIS
# ==========================================

@app.post("/api/risk")
def create_risk_analysis(
    request: RiskRequest,
):

    result = generate_risk_analysis(
        current_cash=request.current_cash,
        invoices=request.invoices,
        recurring_expenses=request.recurring_expenses,
        one_time_expenses=request.one_time_expenses,
        forecast=request.forecast,
    )

    return {
        "success": True,
        "risk": result,
    }


# ==========================================
# FINANCIAL SHOCK SIMULATOR
# ==========================================

@app.post("/api/simulator")
def create_simulation(
    request: SimulationRequest,
):

    result = run_simulation(
        current_cash=request.current_cash,
        invoices=request.invoices,
        recurring_expenses=request.recurring_expenses,
        one_time_expenses=request.one_time_expenses,
        revenue_change_percent=request.revenue_change_percent,
        expense_change_percent=request.expense_change_percent,
        payment_delay_days=request.payment_delay_days,
    )

    return {
        "success": True,
        "simulation": result,
    }


# ==========================================
# FINANCING OPTIONS
# ==========================================

@app.post("/api/financing")
def create_financing_analysis(
    request: FinancingRequest,
):

    result = generate_financing_analysis(
        liquidity_gap=request.liquidity_gap,
        outstanding_receivables=request.outstanding_receivables,
        current_cash=request.current_cash,
    )

    return {
        "success": True,
        "financing": result,
    }