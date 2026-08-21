from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    Business,
    Customer,
    Invoice,
    Payment,
    Expense,
    RecurringExpense,
)


router = APIRouter(
    prefix="/api",
    tags=["Database"],
)


# ==========================================
# BUSINESS
# ==========================================

@router.get("/business")
def get_business(
    db: Session = Depends(get_db),
):
    business = (
        db.query(Business)
        .first()
    )

    if not business:
        return {
            "success": False,
            "message": "Business not found",
        }

    return {
        "success": True,
        "business": {
            "id": business.id,
            "name": business.name,
            "industry": business.industry,
            "gstin": business.gstin,
            "currency": business.currency,
            "openingCash": business.opening_cash,
            "monthlyRevenue": business.monthly_revenue,
            "monthlyExpenses": business.monthly_expenses,
        },
    }


# ==========================================
# CUSTOMERS
# ==========================================

@router.get("/customers")
def get_customers(
    db: Session = Depends(get_db),
):
    customers = (
        db.query(Customer)
        .all()
    )

    return {
        "success": True,
        "customers": [
            {
                "id": customer.id,
                "name": customer.name,
                "industry": customer.industry,
                "businessId": customer.business_id,
            }
            for customer in customers
        ],
    }


# ==========================================
# INVOICES
# ==========================================

@router.get("/invoices")
def get_invoices(
    db: Session = Depends(get_db),
):
    invoices = (
        db.query(Invoice)
        .all()
    )

    return {
        "success": True,
        "invoices": [
            {
                "id": invoice.id,
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
                "businessId": invoice.business_id,
            }
            for invoice in invoices
        ],
    }


# ==========================================
# PAYMENTS
# ==========================================

@router.get("/payments")
def get_payments(
    db: Session = Depends(get_db),
):
    payments = (
        db.query(Payment)
        .all()
    )

    return {
        "success": True,
        "payments": [
            {
                "id": payment.id,
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
                "businessId": payment.business_id,
            }
            for payment in payments
        ],
    }


# ==========================================
# EXPENSES
# ==========================================

@router.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db),
):
    expenses = (
        db.query(Expense)
        .all()
    )

    return {
        "success": True,
        "expenses": [
            {
                "id": expense.id,
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
                "businessId": expense.business_id,
            }
            for expense in expenses
        ],
    }


# ==========================================
# RECURRING EXPENSES
# ==========================================

@router.get("/recurring-expenses")
def get_recurring_expenses(
    db: Session = Depends(get_db),
):
    expenses = (
        db.query(RecurringExpense)
        .all()
    )

    return {
        "success": True,
        "recurringExpenses": [
            {
                "id": expense.id,
                "category": expense.category,
                "description": expense.description,
                "amount": expense.amount,
                "frequency": expense.frequency,
                "dayOfMonth": expense.day_of_month,
                "source": expense.source,
                "businessId": expense.business_id,
            }
            for expense in expenses
        ],
    }