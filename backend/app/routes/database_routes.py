from __future__ import annotations
from datetime import date
from typing import Optional, List, Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
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


# ==========================================
# ROUTER
# ==========================================

router = APIRouter(
    prefix="/api",
    tags=["Database"],
)


# ==========================================
# REQUEST MODELS
# ==========================================


# ------------------------------------------
# Invoice
# ------------------------------------------

class InvoiceCreateRequest(BaseModel):
    id: str
    businessId: str
    customerId: str
    customer: Optional[str] = None
    amount: float
    invoiceDate: str
    dueDate: str
    status: str = "Pending"
    paymentDate: Optional[str] = None
    source: str = "manual"


class InvoiceUpdateRequest(BaseModel):
    customerId: Optional[str] = None
    customer: Optional[str] = None
    amount: Optional[float] = None
    invoiceDate: Optional[str] = None
    dueDate: Optional[str] = None
    status: Optional[str] = None
    paymentDate: Optional[str] = None
    source: Optional[str] = None


# ------------------------------------------
# Customer
# ------------------------------------------

class CustomerCreateRequest(BaseModel):
    id: str
    businessId: str
    name: str
    industry: Optional[str] = None


class CustomerUpdateRequest(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None


# ==========================================
# DATE HELPER
# ==========================================

def parse_date(value: Optional[str]):

    if not value:
        return None

    try:

        return date.fromisoformat(
            value
        )

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid date format: {value}. "
                "Use YYYY-MM-DD."
            ),
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

            "id":
                business.id,

            "name":
                business.name,

            "industry":
                business.industry,

            "gstin":
                business.gstin,

            "currency":
                business.currency,

            "openingCash":
                business.opening_cash,

            "monthlyRevenue":
                business.monthly_revenue,

            "monthlyExpenses":
                business.monthly_expenses,
        },
    }


# ==========================================
# CUSTOMERS - GET
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

                "id":
                    customer.id,

                "name":
                    customer.name,

                "industry":
                    customer.industry,

                "businessId":
                    customer.business_id,

            }

            for customer in customers
        ],
    }


# ==========================================
# CUSTOMERS - CREATE
# ==========================================

@router.post("/customers")
def create_customer(
    request: CustomerCreateRequest,
    db: Session = Depends(get_db),
):

    # --------------------------------------
    # Check duplicate customer
    # --------------------------------------

    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.id ==
            request.id
        )
        .first()
    )

    if existing_customer:

        raise HTTPException(
            status_code=409,
            detail=(
                "Customer with this ID "
                "already exists."
            ),
        )


    # --------------------------------------
    # Check business exists
    # --------------------------------------

    business = (
        db.query(Business)
        .filter(
            Business.id ==
            request.businessId
        )
        .first()
    )

    if not business:

        raise HTTPException(
            status_code=404,
            detail="Business not found.",
        )


    # --------------------------------------
    # Create customer
    # --------------------------------------

    customer = Customer(

        id=request.id,

        business_id=
            request.businessId,

        name=request.name,

        industry=
            request.industry,
    )


    db.add(customer)

    db.commit()

    db.refresh(customer)


    return {

        "success": True,

        "customer": {

            "id":
                customer.id,

            "name":
                customer.name,

            "industry":
                customer.industry,

            "businessId":
                customer.business_id,
        },
    }


# ==========================================
# CUSTOMERS - UPDATE
# ==========================================

@router.put("/customers/{customer_id}")
def update_customer(
    customer_id: str,
    request: CustomerUpdateRequest,
    db: Session = Depends(get_db),
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id ==
            customer_id
        )
        .first()
    )


    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found.",
        )


    # --------------------------------------
    # Update name
    # --------------------------------------

    if request.name is not None:

        customer.name = (
            request.name
        )


    # --------------------------------------
    # Update industry
    # --------------------------------------

    if request.industry is not None:

        customer.industry = (
            request.industry
        )


    db.commit()

    db.refresh(customer)


    return {

        "success": True,

        "customer": {

            "id":
                customer.id,

            "name":
                customer.name,

            "industry":
                customer.industry,

            "businessId":
                customer.business_id,
        },
    }


# ==========================================
# CUSTOMERS - DELETE
# ==========================================

@router.delete("/customers/{customer_id}")
def delete_customer(
    customer_id: str,
    db: Session = Depends(get_db),
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id ==
            customer_id
        )
        .first()
    )


    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found.",
        )


    # --------------------------------------
    # Check invoice references
    # --------------------------------------

    invoice_count = (
        db.query(Invoice)
        .filter(
            Invoice.customer_id ==
            customer_id
        )
        .count()
    )


    if invoice_count > 0:

        raise HTTPException(
            status_code=409,
            detail=(
                "Customer cannot be deleted "
                "because "
                f"{invoice_count} invoice(s) "
                "reference this customer."
            ),
        )


    # --------------------------------------
    # Delete customer
    # --------------------------------------

    db.delete(customer)

    db.commit()


    return {

        "success": True,

        "message":
            "Customer deleted successfully.",

        "customerId":
            customer_id,
    }


# ==========================================
# INVOICES - GET
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

                "id":
                    invoice.id,

                "customerId":
                    invoice.customer_id,

                "customer":
                    invoice.customer,

                "amount":
                    invoice.amount,

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

                "status":
                    invoice.status,

                "paymentDate": (

                    invoice.payment_date.isoformat()

                    if invoice.payment_date

                    else None
                ),

                "source":
                    invoice.source,

                "businessId":
                    invoice.business_id,
            }

            for invoice in invoices
        ],
    }


# ==========================================
# INVOICES - CREATE
# ==========================================

@router.post("/invoices")
def create_invoice(
    request: InvoiceCreateRequest,
    db: Session = Depends(get_db),
):

    # --------------------------------------
    # Check duplicate invoice
    # --------------------------------------

    existing_invoice = (
        db.query(Invoice)
        .filter(
            Invoice.id ==
            request.id
        )
        .first()
    )


    if existing_invoice:

        raise HTTPException(
            status_code=409,
            detail=(
                "Invoice with this ID "
                "already exists."
            ),
        )


    # --------------------------------------
    # Check business
    # --------------------------------------

    business = (
        db.query(Business)
        .filter(
            Business.id ==
            request.businessId
        )
        .first()
    )


    if not business:

        raise HTTPException(
            status_code=404,
            detail="Business not found.",
        )


    # --------------------------------------
    # Check customer
    # --------------------------------------

    customer = (
        db.query(Customer)
        .filter(
            Customer.id ==
            request.customerId
        )
        .first()
    )


    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found.",
        )


    # --------------------------------------
    # Create invoice
    # --------------------------------------

    invoice = Invoice(

        id=request.id,

        business_id=
            request.businessId,

        customer_id=
            request.customerId,

        customer=
            request.customer,

        amount=
            request.amount,

        invoice_date=
            parse_date(
                request.invoiceDate
            ),

        due_date=
            parse_date(
                request.dueDate
            ),

        status=
            request.status,

        payment_date=
            parse_date(
                request.paymentDate
            ),

        source=
            request.source,
    )


    db.add(invoice)

    db.commit()

    db.refresh(invoice)


    return {

        "success": True,

        "invoice": {

            "id":
                invoice.id,

            "customerId":
                invoice.customer_id,

            "customer":
                invoice.customer,

            "amount":
                invoice.amount,

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

            "status":
                invoice.status,

            "paymentDate": (

                invoice.payment_date.isoformat()

                if invoice.payment_date

                else None
            ),

            "source":
                invoice.source,

            "businessId":
                invoice.business_id,
        },
    }


# ==========================================
# INVOICES - UPDATE
# ==========================================

@router.put("/invoices/{invoice_id}")
def update_invoice(
    invoice_id: str,
    request: InvoiceUpdateRequest,
    db: Session = Depends(get_db),
):

    invoice = (
        db.query(Invoice)
        .filter(
            Invoice.id ==
            invoice_id
        )
        .first()
    )


    if not invoice:

        raise HTTPException(
            status_code=404,
            detail="Invoice not found.",
        )


    # --------------------------------------
    # Customer
    # --------------------------------------

    if request.customerId is not None:

        customer = (
            db.query(Customer)
            .filter(
                Customer.id ==
                request.customerId
            )
            .first()
        )


        if not customer:

            raise HTTPException(
                status_code=404,
                detail="Customer not found.",
            )


        invoice.customer_id = (
            request.customerId
        )


    # --------------------------------------
    # Customer name
    # --------------------------------------

    if request.customer is not None:

        invoice.customer = (
            request.customer
        )


    # --------------------------------------
    # Amount
    # --------------------------------------

    if request.amount is not None:

        invoice.amount = (
            request.amount
        )


    # --------------------------------------
    # Invoice date
    # --------------------------------------

    if request.invoiceDate is not None:

        invoice.invoice_date = (
            parse_date(
                request.invoiceDate
            )
        )


    # --------------------------------------
    # Due date
    # --------------------------------------

    if request.dueDate is not None:

        invoice.due_date = (
            parse_date(
                request.dueDate
            )
        )


    # --------------------------------------
    # Status
    # --------------------------------------

    if request.status is not None:

        invoice.status = (
            request.status
        )


    # --------------------------------------
    # Payment date
    # --------------------------------------

    if request.paymentDate is not None:

        invoice.payment_date = (
            parse_date(
                request.paymentDate
            )
        )

    elif request.status == "Pending":

        invoice.payment_date = None


    # --------------------------------------
    # Source
    # --------------------------------------

    if request.source is not None:

        invoice.source = (
            request.source
        )


    db.commit()

    db.refresh(invoice)


    return {

        "success": True,

        "invoice": {

            "id":
                invoice.id,

            "customerId":
                invoice.customer_id,

            "customer":
                invoice.customer,

            "amount":
                invoice.amount,

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

            "status":
                invoice.status,

            "paymentDate": (

                invoice.payment_date.isoformat()

                if invoice.payment_date

                else None
            ),

            "source":
                invoice.source,

            "businessId":
                invoice.business_id,
        },
    }


# ==========================================
# INVOICES - DELETE
# ==========================================

@router.delete("/invoices/{invoice_id}")
def delete_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
):

    invoice = (
        db.query(Invoice)
        .filter(
            Invoice.id ==
            invoice_id
        )
        .first()
    )


    if not invoice:

        raise HTTPException(
            status_code=404,
            detail="Invoice not found.",
        )


    db.delete(invoice)

    db.commit()


    return {

        "success": True,

        "message":
            "Invoice deleted successfully.",

        "invoiceId":
            invoice_id,
    }


# ==========================================
# PAYMENTS - GET
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

                "id":
                    payment.id,

                "invoiceId":
                    payment.invoice_id,

                "customerId":
                    payment.customer_id,

                "amount":
                    payment.amount,

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

                "daysDelayed":
                    payment.days_delayed,

                "source":
                    payment.source,

                "businessId":
                    payment.business_id,
            }

            for payment in payments
        ],
    }


# ==========================================
# EXPENSES - GET
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

                "id":
                    expense.id,

                "category":
                    expense.category,

                "description":
                    expense.description,

                "amount":
                    expense.amount,

                "date": (

                    expense.date.isoformat()

                    if expense.date

                    else None
                ),

                "recurring":
                    expense.recurring,

                "source":
                    expense.source,

                "businessId":
                    expense.business_id,
            }

            for expense in expenses
        ],
    }


# ==========================================
# RECURRING EXPENSES - GET
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

                "id":
                    expense.id,

                "category":
                    expense.category,

                "description":
                    expense.description,

                "amount":
                    expense.amount,

                "frequency":
                    expense.frequency,

                "dayOfMonth":
                    expense.day_of_month,

                "source":
                    expense.source,

                "businessId":
                    expense.business_id,
            }

            for expense in expenses
        ],
    }