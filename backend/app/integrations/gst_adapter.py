from typing import Any


# ==========================================
# GST / E-INVOICE ADAPTER
# ==========================================
#
# This module is intentionally provider-neutral.
#
# Future flow:
#
# GST / e-Invoice Provider
#          ↓
#      API Response
#          ↓
#     This Adapter
#          ↓
#    Normalized Invoice
#          ↓
#       FinTwin
#
# Do NOT put API credentials here.
# Credentials and authenticated API calls
# should be handled by the backend configuration
# and the appropriate authorized provider.
# ==========================================


# ==========================================
# HELPERS
# ==========================================

def safe_number(value: Any) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def clean_value(value: Any) -> str:

    if value is None:
        return ""

    return str(value).strip()


def normalize_status(
    status: Any,
) -> str:

    value = (
        clean_value(status)
        .lower()
    )

    if value in {
        "paid",
        "paid invoice",
        "complete",
        "completed",
    }:
        return "Paid"

    if value in {
        "overdue",
        "late",
    }:
        return "Overdue"

    return "Pending"


# ==========================================
# NORMALIZE GST INVOICE
# ==========================================

def normalize_gst_invoice(
    invoice: dict,
) -> dict:

    invoice_number = (
        invoice.get("invoice_number")
        or invoice.get("invoiceNumber")
        or invoice.get("invoiceNo")
        or invoice.get("documentNumber")
        or invoice.get("docNo")
        or ""
    )

    customer_name = (
        invoice.get("customer_name")
        or invoice.get("customerName")
        or invoice.get("buyerName")
        or invoice.get("recipientName")
        or ""
    )

    customer_gstin = (
        invoice.get("customer_gstin")
        or invoice.get("customerGstin")
        or invoice.get("buyerGstin")
        or invoice.get("recipientGstin")
        or ""
    )

    invoice_date = (
        invoice.get("invoice_date")
        or invoice.get("invoiceDate")
        or invoice.get("documentDate")
        or ""
    )

    due_date = (
        invoice.get("due_date")
        or invoice.get("dueDate")
        or ""
    )

    taxable_value = safe_number(
        invoice.get("taxable_value")
        or invoice.get("taxableValue")
        or invoice.get("taxableAmount")
    )

    cgst = safe_number(
        invoice.get("cgst")
        or invoice.get("cgstAmount")
    )

    sgst = safe_number(
        invoice.get("sgst")
        or invoice.get("sgstAmount")
    )

    igst = safe_number(
        invoice.get("igst")
        or invoice.get("igstAmount")
    )

    total_tax = (
        cgst
        + sgst
        + igst
    )

    total_amount = safe_number(
        invoice.get("total_amount")
        or invoice.get("totalAmount")
        or invoice.get("invoiceValue")
        or invoice.get("grandTotal")
    )

    if total_amount == 0:

        total_amount = (
            taxable_value
            + total_tax
        )

    status = normalize_status(
        invoice.get("status")
    )

    return {
        "id": clean_value(
            invoice_number
        ),

        "customer": clean_value(
            customer_name
        ),

        "customerGstin": clean_value(
            customer_gstin
        ),

        "amount": round(
            total_amount,
            2,
        ),

        "taxableAmount": round(
            taxable_value,
            2,
        ),

        "cgst": round(
            cgst,
            2,
        ),

        "sgst": round(
            sgst,
            2,
        ),

        "igst": round(
            igst,
            2,
        ),

        "invoiceDate": clean_value(
            invoice_date
        ),

        "dueDate": clean_value(
            due_date
        ),

        "status": status,

        "source": "gst",
    }


# ==========================================
# NORMALIZE E-INVOICE
# ==========================================

def normalize_einvoice(
    einvoice: dict,
) -> dict:

    normalized = (
        normalize_gst_invoice(
            einvoice
        )
    )

    normalized["source"] = (
        "einvoice"
    )

    normalized["irn"] = clean_value(
        einvoice.get("irn")
        or einvoice.get("IRN")
        or einvoice.get("invoiceReferenceNumber")
    )

    normalized["ackNumber"] = clean_value(
        einvoice.get("ack_number")
        or einvoice.get("ackNumber")
        or einvoice.get("AckNo")
    )

    normalized["ackDate"] = clean_value(
        einvoice.get("ack_date")
        or einvoice.get("ackDate")
        or einvoice.get("AckDate")
    )

    return normalized


# ==========================================
# NORMALIZE GST CUSTOMER
# ==========================================

def normalize_gst_customer(
    customer: dict,
) -> dict:

    gstin = (
        customer.get("gstin")
        or customer.get("GSTIN")
        or customer.get("customerGstin")
        or ""
    )

    name = (
        customer.get("name")
        or customer.get("customerName")
        or customer.get("legalName")
        or customer.get("tradeName")
        or ""
    )

    state = (
        customer.get("state")
        or customer.get("stateName")
        or ""
    )

    return {
        "id": clean_value(
            gstin
        ),

        "name": clean_value(
            name
        ),

        "gstin": clean_value(
            gstin
        ),

        "state": clean_value(
            state
        ),

        "source": "gst",
    }


# ==========================================
# NORMALIZE GST DATASET
# ==========================================

def normalize_gst_dataset(
    response: dict,
) -> dict:

    invoices = []

    einvoices = []

    customers = []


    # --------------------------------------
    # GST invoices
    # --------------------------------------

    raw_invoices = (
        response.get("invoices")
        or response.get("data", {}).get(
            "invoices",
            []
        )
        or []
    )

    for invoice in raw_invoices:

        if isinstance(
            invoice,
            dict,
        ):

            invoices.append(
                normalize_gst_invoice(
                    invoice
                )
            )


    # --------------------------------------
    # e-Invoices
    # --------------------------------------

    raw_einvoices = (
        response.get("einvoices")
        or response.get("eInvoices")
        or response.get("data", {}).get(
            "einvoices",
            []
        )
        or []
    )

    for einvoice in raw_einvoices:

        if isinstance(
            einvoice,
            dict,
        ):

            einvoices.append(
                normalize_einvoice(
                    einvoice
                )
            )


    # --------------------------------------
    # Customers
    # --------------------------------------

    raw_customers = (
        response.get("customers")
        or response.get("data", {}).get(
            "customers",
            []
        )
        or []
    )

    for customer in raw_customers:

        if isinstance(
            customer,
            dict,
        ):

            customers.append(
                normalize_gst_customer(
                    customer
                )
            )


    return {
        "invoices": invoices,

        "einvoices": einvoices,

        "customers": customers,

        "source": "gst",
    }


# ==========================================
# CONNECTION STATUS
# ==========================================

def get_gst_connection_status() -> dict:

    return {
        "provider": "GST / e-Invoice",

        "connected": False,

        "status": "NOT_CONFIGURED",

        "message": (
            "GST/e-Invoice integration is "
            "architecturally prepared but an "
            "authorized provider connection has "
            "not been configured yet."
        ),
    }