from __future__ import annotations
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db, init_db
from app.routes import database_routes

from app.models.business import Business
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.models.payment import Payment
from app.models.expense import Expense
from app.models.recurring_expense import RecurringExpense

from app.ml.predict import predict_payment_delay
from app.services.forecast_service import generate_cash_forecast
from app.services.risk_service import generate_risk_analysis
from app.services.simulator_service import run_simulation
from app.services.financing_service import generate_financing_analysis
from app.services.gst_service import (
    calculate_transaction_gst,
    reconcile_overall_gst,
    validate_gstin,
)
from app.services.setu_aa_service import (
    create_aa_consent,
    approve_aa_consent,
    fetch_aa_fi_data,
    verify_pan_card,
    send_aadhaar_okyc_otp,
    verify_aadhaar_okyc_otp,
    verify_bank_account_penny_drop,
    verify_gstin_entity,
    verify_udyam_msme,
    verify_ckyc_registry,
    generate_full_setu_compliance_audit,
)


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
    allow_origins=["*"],
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
    customer_default_percent: float = 0
    raw_material_inflation_percent: float = 0
    payroll_hike_percent: float = 0
    tax_outflow_amount: float = 0
    loan_emi_amount: float = 0
    treds_discount_percent: float = 0
    govt_subsidy_amount: float = 0
    sec43b_overdue_days: int = 0
    repo_rate_hike_bps: float = 0
    capex_outflow_amount: float = 0
    itc_reversal_amount: float = 0
    cash_recovery_percent: float = 0
    supplier_discount_percent: float = 0
    export_surge_percent: float = 0


class FinancingRequest(BaseModel):
    liquidity_gap: float
    outstanding_receivables: float
    current_cash: float


class GstCalculateRequest(BaseModel):
    amount: float
    rate_percent: float = 18.0
    is_inclusive: bool = False
    is_interstate: bool = False


class GstReconcileRequest(BaseModel):
    invoices: list[dict]
    expenses: list[dict]
    default_gst_rate: float = 18.0


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def serialize_business(business):
    return {
        "id": business.id,
        "name": business.name,
        "industry": business.industry,
        "gstin": business.gstin,
        "currency": business.currency,
        "openingCash": business.opening_cash,
        "monthlyRevenue": business.monthly_revenue,
        "monthlyExpenses": business.monthly_expenses,
    }


def serialize_customer(customer):
    return {
        "id": customer.id,
        "businessId": customer.business_id,
        "name": customer.name,
        "industry": customer.industry,
    }


def serialize_invoice(invoice):
    return {
        "id": invoice.id,
        "businessId": invoice.business_id,
        "customerId": invoice.customer_id,
        "customer": invoice.customer,
        "amount": invoice.amount,
        "invoiceDate": (
            invoice.invoice_date.isoformat()
            if invoice.invoice_date
            else None
        ),
        "dueDate": (
            invoice.due_date.isoformat()
            if invoice.due_date
            else None
        ),
        "status": invoice.status,
        "paymentDate": (
            invoice.payment_date.isoformat()
            if invoice.payment_date
            else None
        ),
        "source": invoice.source,
    }


def serialize_payment(payment):
    return {
        "id": payment.id,
        "businessId": payment.business_id,
        "invoiceId": payment.invoice_id,
        "customerId": payment.customer_id,
        "amount": payment.amount,
        "expectedDate": (
            payment.expected_date.isoformat()
            if payment.expected_date
            else None
        ),
        "actualDate": (
            payment.actual_date.isoformat()
            if payment.actual_date
            else None
        ),
        "daysDelayed": payment.days_delayed,
        "source": payment.source,
    }


def serialize_expense(expense):
    return {
        "id": expense.id,
        "businessId": expense.business_id,
        "category": expense.category,
        "description": expense.description,
        "amount": expense.amount,
        "date": (
            expense.date.isoformat()
            if expense.date
            else None
        ),
        "recurring": expense.recurring,
        "source": expense.source,
    }


def serialize_recurring_expense(expense):
    return {
        "id": expense.id,
        "businessId": expense.business_id,
        "category": expense.category,
        "description": expense.description,
        "amount": expense.amount,
        "frequency": expense.frequency,
        "dayOfMonth": expense.day_of_month,
        "source": expense.source,
    }


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
# BUSINESS
# ==========================================

@app.get("/api/business")
def get_business(db: Session = Depends(get_db)):

    business = (
        db.query(Business)
        .first()
    )

    if not business:
        return {}

    return serialize_business(business)


# ==========================================
# CUSTOMERS
# ==========================================

@app.get("/api/customers")
def get_customers(
    db: Session = Depends(get_db),
):

    customers = (
        db.query(Customer)
        .all()
    )

    return [
        serialize_customer(customer)
        for customer in customers
    ]


# ==========================================
# INVOICES
# ==========================================

@app.get("/api/invoices")
def get_invoices(
    db: Session = Depends(get_db),
):

    invoices = (
        db.query(Invoice)
        .all()
    )

    return [
        serialize_invoice(invoice)
        for invoice in invoices
    ]


# ==========================================
# PAYMENTS
# ==========================================

@app.get("/api/payments")
def get_payments(
    db: Session = Depends(get_db),
):

    payments = (
        db.query(Payment)
        .all()
    )

    return [
        serialize_payment(payment)
        for payment in payments
    ]


# ==========================================
# EXPENSES
# ==========================================

@app.get("/api/expenses")
def get_expenses(
    db: Session = Depends(get_db),
):

    expenses = (
        db.query(Expense)
        .filter(
            Expense.recurring == False
        )
        .all()
    )

    return [
        serialize_expense(expense)
        for expense in expenses
    ]


# ==========================================
# RECURRING EXPENSES
# ==========================================

@app.get("/api/recurring-expenses")
def get_recurring_expenses(
    db: Session = Depends(get_db),
):

    expenses = (
        db.query(RecurringExpense)
        .all()
    )

    return [
        serialize_recurring_expense(expense)
        for expense in expenses
    ]


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
        customer_default_percent=request.customer_default_percent,
        raw_material_inflation_percent=request.raw_material_inflation_percent,
        payroll_hike_percent=request.payroll_hike_percent,
        tax_outflow_amount=request.tax_outflow_amount,
        loan_emi_amount=request.loan_emi_amount,
        treds_discount_percent=request.treds_discount_percent,
        govt_subsidy_amount=request.govt_subsidy_amount,
        sec43b_overdue_days=request.sec43b_overdue_days,
        repo_rate_hike_bps=request.repo_rate_hike_bps,
        capex_outflow_amount=request.capex_outflow_amount,
        itc_reversal_amount=request.itc_reversal_amount,
        cash_recovery_percent=request.cash_recovery_percent,
        supplier_discount_percent=request.supplier_discount_percent,
        export_surge_percent=request.export_surge_percent,
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


# ==========================================
# GST API ENDPOINTS
# ==========================================

@app.post("/api/gst/calculate")
def get_transaction_gst(request: GstCalculateRequest):
    result = calculate_transaction_gst(
        amount=request.amount,
        rate_percent=request.rate_percent,
        is_inclusive=request.is_inclusive,
        is_interstate=request.is_interstate,
    )
    return {
        "success": True,
        "calculation": result,
    }


@app.post("/api/gst/reconcile")
def get_overall_gst_reconciliation(request: GstReconcileRequest):
    result = reconcile_overall_gst(
        invoices=request.invoices,
        expenses=request.expenses,
        default_gst_rate=request.default_gst_rate,
    )
    return {
        "success": True,
        "reconciliation": result,
    }


@app.get("/api/gst/validate/{gstin}")
def get_gstin_validation(gstin: str):
    result = validate_gstin(gstin=gstin)
    return {
        "success": True,
        "validation": result,
    }


# ==========================================
# SETU ACCOUNT AGGREGATOR & KYC VERIFICATION ROUTES
# ==========================================

class AaConsentRequest(BaseModel):
    mobile_number: str
    aa_handle: str = "@setu"
    fip_ids: Optional[list[str]] = None
    customer_name: str = "Enterprise Director"
    data_life_months: int = 12


class AaApproveRequest(BaseModel):
    accounts: Optional[list[dict]] = None


class PanVerifyRequest(BaseModel):
    pan_number: str
    expected_name: Optional[str] = None


class AadhaarOtpRequest(BaseModel):
    aadhaar_number: str


class AadhaarVerifyRequest(BaseModel):
    request_id: str
    otp: str
    expected_name: Optional[str] = None


class BankVerifyRequest(BaseModel):
    account_number: str
    ifsc: str
    entity_name: Optional[str] = None


class GstinVerifyRequest(BaseModel):
    gstin: str


class UdyamVerifyRequest(BaseModel):
    udyam_number: str


class CkycVerifyRequest(BaseModel):
    query: str


@app.post("/api/aa/consent")
def post_aa_consent(req: AaConsentRequest):
    return create_aa_consent(
        mobile_number=req.mobile_number,
        aa_handle=req.aa_handle,
        fip_ids=req.fip_ids,
        customer_name=req.customer_name,
        data_life_months=req.data_life_months,
    )


@app.post("/api/aa/consent/{consent_id}/approve")
def post_aa_approve(consent_id: str, req: Optional[AaApproveRequest] = None):
    accounts = req.accounts if req else None
    return approve_aa_consent(consent_id=consent_id, accounts=accounts)


@app.get("/api/aa/consent/{consent_id}/data")
def get_aa_fi_data(consent_id: str):
    return fetch_aa_fi_data(consent_id=consent_id)


@app.post("/api/aa/kyc/pan")
def post_kyc_pan(req: PanVerifyRequest):
    return verify_pan_card(pan_number=req.pan_number, expected_name=req.expected_name)


@app.post("/api/aa/kyc/aadhaar/otp")
def post_kyc_aadhaar_otp(req: AadhaarOtpRequest):
    return send_aadhaar_okyc_otp(aadhaar_number=req.aadhaar_number)


@app.post("/api/aa/kyc/aadhaar/verify")
def post_kyc_aadhaar_verify(req: AadhaarVerifyRequest):
    return verify_aadhaar_okyc_otp(request_id=req.request_id, otp=req.otp, expected_name=req.expected_name)


@app.post("/api/aa/kyc/bank-account")
def post_kyc_bank(req: BankVerifyRequest):
    return verify_bank_account_penny_drop(account_number=req.account_number, ifsc=req.ifsc, entity_name=req.entity_name)


@app.post("/api/aa/kyc/gstin")
def post_kyc_gstin(req: GstinVerifyRequest):
    return verify_gstin_entity(gstin=req.gstin)


@app.post("/api/aa/kyc/udyam")
def post_kyc_udyam(req: UdyamVerifyRequest):
    return verify_udyam_msme(udyam_number=req.udyam_number)


@app.post("/api/aa/kyc/ckyc")
def post_kyc_ckyc(req: CkycVerifyRequest):
    return verify_ckyc_registry(ckyc_number_or_pan=req.query)


@app.get("/api/aa/kyc/full-audit")
def get_kyc_full_audit():
    return generate_full_setu_compliance_audit()


# ==========================================
# INCLUDE DATABASE CRUD ROUTER
# ==========================================
app.include_router(database_routes.router)


# ==========================================
# STARTUP INITIALIZATION
# ==========================================
@app.on_event("startup")
def on_startup():
    try:
        init_db()
    except Exception as e:
        print(f"Warning during DB init: {e}")