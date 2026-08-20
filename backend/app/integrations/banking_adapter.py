from typing import Any


# ==========================================
# BANKING / ACCOUNT AGGREGATOR ADAPTER
# ==========================================
#
# Future architecture:
#
# Authorized Banking / AA Provider
#              ↓
#       Authenticated API
#              ↓
#      banking_adapter.py
#              ↓
#       Normalized data
#              ↓
#        FinTwin Backend
#
# This adapter does NOT directly connect to
# a bank or Account Aggregator yet.
#
# Credentials, consent and provider-specific
# authentication must be handled securely by
# the backend.
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


# ==========================================
# TRANSACTION TYPE
# ==========================================

def normalize_transaction_type(
    value: Any,
) -> str:

    value = (
        clean_value(value)
        .lower()
    )

    if value in {
        "credit",
        "cr",
        "in",
        "income",
        "deposit",
    }:
        return "CREDIT"

    if value in {
        "debit",
        "dr",
        "out",
        "expense",
        "withdrawal",
    }:
        return "DEBIT"

    return "UNKNOWN"


# ==========================================
# NORMALIZE BANK TRANSACTION
# ==========================================

def normalize_bank_transaction(
    transaction: dict,
) -> dict:

    transaction_id = (
        transaction.get("id")
        or transaction.get("transaction_id")
        or transaction.get("transactionId")
        or transaction.get("txnId")
        or ""
    )

    transaction_date = (
        transaction.get("date")
        or transaction.get("transactionDate")
        or transaction.get("valueDate")
        or ""
    )

    description = (
        transaction.get("description")
        or transaction.get("narration")
        or transaction.get("remarks")
        or ""
    )

    transaction_type = normalize_transaction_type(
        transaction.get("type")
        or transaction.get("transactionType")
        or transaction.get("creditDebit")
    )

    amount = safe_number(
        transaction.get("amount")
        or transaction.get("transactionAmount")
    )

    balance = safe_number(
        transaction.get("balance")
        or transaction.get("closingBalance")
        or transaction.get("availableBalance")
    )

    reference = (
        transaction.get("reference")
        or transaction.get("referenceNumber")
        or transaction.get("utr")
        or ""
    )

    return {
        "id": clean_value(
            transaction_id
        ),

        "date": clean_value(
            transaction_date
        ),

        "description": clean_value(
            description
        ),

        "type": transaction_type,

        "amount": round(
            amount,
            2,
        ),

        "balance": round(
            balance,
            2,
        ),

        "reference": clean_value(
            reference
        ),

        "source": "banking",
    }


# ==========================================
# NORMALIZE ACCOUNT
# ==========================================

def normalize_bank_account(
    account: dict,
) -> dict:

    account_id = (
        account.get("id")
        or account.get("accountId")
        or account.get("account_id")
        or ""
    )

    masked_number = (
        account.get("maskedAccountNumber")
        or account.get("masked_account_number")
        or account.get("accountNumberMasked")
        or ""
    )

    account_type = (
        account.get("type")
        or account.get("accountType")
        or ""
    )

    bank_name = (
        account.get("bankName")
        or account.get("bank_name")
        or account.get("institution")
        or ""
    )

    currency = (
        account.get("currency")
        or "INR"
    )

    current_balance = safe_number(
        account.get("balance")
        or account.get("currentBalance")
        or account.get("availableBalance")
    )

    return {
        "id": clean_value(
            account_id
        ),

        "maskedAccountNumber": clean_value(
            masked_number
        ),

        "accountType": clean_value(
            account_type
        ),

        "bankName": clean_value(
            bank_name
        ),

        "currency": clean_value(
            currency
        ),

        "currentBalance": round(
            current_balance,
            2,
        ),

        "source": "banking",
    }


# ==========================================
# CALCULATE CASH POSITION
# ==========================================

def calculate_cash_position(
    transactions: list[dict],
) -> dict:

    total_credits = 0.0

    total_debits = 0.0

    latest_balance = 0.0


    for transaction in transactions:

        amount = safe_number(
            transaction.get("amount")
        )

        transaction_type = (
            transaction.get("type")
            or "UNKNOWN"
        )

        if transaction_type == "CREDIT":

            total_credits += amount

        elif transaction_type == "DEBIT":

            total_debits += amount


        balance = safe_number(
            transaction.get("balance")
        )

        if balance != 0:

            latest_balance = balance


    net_cash_flow = (
        total_credits
        - total_debits
    )


    return {
        "total_credits": round(
            total_credits,
            2,
        ),

        "total_debits": round(
            total_debits,
            2,
        ),

        "net_cash_flow": round(
            net_cash_flow,
            2,
        ),

        "latest_balance": round(
            latest_balance,
            2,
        ),
    }


# ==========================================
# NORMALIZE BANKING DATASET
# ==========================================

def normalize_banking_dataset(
    response: dict,
) -> dict:

    transactions = []

    accounts = []


    # --------------------------------------
    # Accounts
    # --------------------------------------

    raw_accounts = (
        response.get("accounts")
        or response.get("data", {}).get(
            "accounts",
            []
        )
        or []
    )


    for account in raw_accounts:

        if isinstance(
            account,
            dict,
        ):

            accounts.append(
                normalize_bank_account(
                    account
                )
            )


    # --------------------------------------
    # Transactions
    # --------------------------------------

    raw_transactions = (
        response.get("transactions")
        or response.get("data", {}).get(
            "transactions",
            []
        )
        or []
    )


    for transaction in raw_transactions:

        if isinstance(
            transaction,
            dict,
        ):

            transactions.append(
                normalize_bank_transaction(
                    transaction
                )
            )


    cash_position = (
        calculate_cash_position(
            transactions
        )
    )


    return {
        "accounts": accounts,

        "transactions": transactions,

        "cash_position": cash_position,

        "source": "banking",
    }


# ==========================================
# CONNECTION STATUS
# ==========================================

def get_banking_connection_status() -> dict:

    return {
        "provider": (
            "Banking / Account Aggregator"
        ),

        "connected": False,

        "status": "NOT_CONFIGURED",

        "consent_required": True,

        "message": (
            "Banking integration is architecturally "
            "prepared but an authorized provider and "
            "customer consent flow have not been "
            "configured yet."
        ),
    }