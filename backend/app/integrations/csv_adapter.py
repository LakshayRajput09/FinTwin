import csv
import io
from typing import Any


# ==========================================
# HELPERS
# ==========================================

def clean_value(value: Any):
    """
    Clean values coming from CSV files.
    """

    if value is None:
        return ""

    return str(value).strip()


def number_value(value: Any) -> float:
    """
    Convert CSV numeric values into float.
    Handles values such as:
    100000
    ₹100000
    1,00,000
    """

    if value is None:
        return 0.0

    value = str(value).strip()

    value = (
        value
        .replace("₹", "")
        .replace(",", "")
        .replace(" ", "")
    )

    try:
        return float(value)
    except ValueError:
        return 0.0


def normalize_status(value: Any) -> str:
    """
    Normalize invoice/payment status.
    """

    value = clean_value(value).lower()

    if value in {
        "paid",
        "complete",
        "completed",
    }:
        return "Paid"

    if value in {
        "pending",
        "unpaid",
        "outstanding",
    }:
        return "Pending"

    if value in {
        "overdue",
        "late",
    }:
        return "Overdue"

    return (
        value.capitalize()
        if value
        else "Pending"
    )


# ==========================================
# CSV READER
# ==========================================

def read_csv_content(
    csv_content: str,
) -> list[dict]:

    if not csv_content:
        return []

    csv_file = io.StringIO(
        csv_content
    )

    reader = csv.DictReader(
        csv_file
    )

    return [
        dict(row)
        for row in reader
    ]


# ==========================================
# INVOICE NORMALIZATION
# ==========================================

def normalize_invoice(
    row: dict,
) -> dict:

    invoice_id = (
        row.get("id")
        or row.get("invoice_id")
        or row.get("invoiceId")
        or row.get("Invoice ID")
        or ""
    )

    customer = (
        row.get("customer")
        or row.get("customer_name")
        or row.get("customerName")
        or row.get("Customer")
        or ""
    )

    amount = (
        row.get("amount")
        or row.get("invoice_amount")
        or row.get("Invoice Amount")
        or 0
    )

    invoice_date = (
        row.get("invoiceDate")
        or row.get("invoice_date")
        or row.get("Invoice Date")
        or ""
    )

    due_date = (
        row.get("dueDate")
        or row.get("due_date")
        or row.get("Due Date")
        or ""
    )

    status = (
        row.get("status")
        or row.get("Status")
        or "Pending"
    )

    return {
        "id": clean_value(
            invoice_id
        ),

        "customer": clean_value(
            customer
        ),

        "amount": number_value(
            amount
        ),

        "invoiceDate": clean_value(
            invoice_date
        ),

        "dueDate": clean_value(
            due_date
        ),

        "status": normalize_status(
            status
        ),

        "source": "csv",
    }


# ==========================================
# PAYMENT NORMALIZATION
# ==========================================

def normalize_payment(
    row: dict,
) -> dict:

    payment_id = (
        row.get("id")
        or row.get("payment_id")
        or row.get("paymentId")
        or row.get("Payment ID")
        or ""
    )

    invoice_id = (
        row.get("invoice_id")
        or row.get("invoiceId")
        or row.get("Invoice ID")
        or ""
    )

    customer = (
        row.get("customer")
        or row.get("customer_name")
        or row.get("Customer")
        or ""
    )

    amount = (
        row.get("amount")
        or row.get("payment_amount")
        or row.get("Payment Amount")
        or 0
    )

    payment_date = (
        row.get("paymentDate")
        or row.get("payment_date")
        or row.get("Payment Date")
        or ""
    )

    return {
        "id": clean_value(
            payment_id
        ),

        "invoiceId": clean_value(
            invoice_id
        ),

        "customer": clean_value(
            customer
        ),

        "amount": number_value(
            amount
        ),

        "paymentDate": clean_value(
            payment_date
        ),

        "source": "csv",
    }


# ==========================================
# EXPENSE NORMALIZATION
# ==========================================

def normalize_expense(
    row: dict,
) -> dict:

    expense_id = (
        row.get("id")
        or row.get("expense_id")
        or row.get("expenseId")
        or row.get("Expense ID")
        or ""
    )

    description = (
        row.get("description")
        or row.get("expense")
        or row.get("Description")
        or ""
    )

    amount = (
        row.get("amount")
        or row.get("expense_amount")
        or row.get("Expense Amount")
        or 0
    )

    expense_date = (
        row.get("date")
        or row.get("expenseDate")
        or row.get("expense_date")
        or row.get("Date")
        or ""
    )

    return {
        "id": clean_value(
            expense_id
        ),

        "description": clean_value(
            description
        ),

        "amount": number_value(
            amount
        ),

        "date": clean_value(
            expense_date
        ),

        "source": "csv",
    }


# ==========================================
# CUSTOMER NORMALIZATION
# ==========================================

def normalize_customer(
    row: dict,
) -> dict:

    customer_id = (
        row.get("id")
        or row.get("customer_id")
        or row.get("customerId")
        or row.get("Customer ID")
        or ""
    )

    name = (
        row.get("name")
        or row.get("customer")
        or row.get("customer_name")
        or row.get("Customer")
        or ""
    )

    return {
        "id": clean_value(
            customer_id
        ),

        "name": clean_value(
            name
        ),

        "source": "csv",
    }


# ==========================================
# GENERIC IMPORT
# ==========================================

def import_csv(
    csv_content: str,
    record_type: str,
) -> list[dict]:

    rows = read_csv_content(
        csv_content
    )

    record_type = (
        record_type
        .strip()
        .lower()
    )


    if record_type == "invoice":

        return [
            normalize_invoice(row)
            for row in rows
        ]


    if record_type == "payment":

        return [
            normalize_payment(row)
            for row in rows
        ]


    if record_type == "expense":

        return [
            normalize_expense(row)
            for row in rows
        ]


    if record_type == "customer":

        return [
            normalize_customer(row)
            for row in rows
        ]


    raise ValueError(
        "Unsupported record type. "
        "Use invoice, payment, "
        "expense or customer."
    )


# ==========================================
# COMPLETE CSV DATASET
# ==========================================

def import_financial_csv(
    csv_content: str,
) -> dict:

    rows = read_csv_content(
        csv_content
    )

    invoices = []
    payments = []
    expenses = []
    customers = []


    for row in rows:

        record_type = (
            row.get("type")
            or row.get("record_type")
            or row.get("recordType")
            or ""
        )

        record_type = (
            record_type
            .strip()
            .lower()
        )


        if record_type == "invoice":

            invoices.append(
                normalize_invoice(row)
            )


        elif record_type == "payment":

            payments.append(
                normalize_payment(row)
            )


        elif record_type == "expense":

            expenses.append(
                normalize_expense(row)
            )


        elif record_type == "customer":

            customers.append(
                normalize_customer(row)
            )


    return {
        "invoices": invoices,

        "payments": payments,

        "expenses": expenses,

        "customers": customers,

        "source": "csv",
    }