from datetime import date

from app.database import SessionLocal
from app.models import (
    Business,
    Customer,
    Invoice,
    Payment,
    Expense,
    RecurringExpense,
)


# ==========================================
# SAMPLE BUSINESS
# ==========================================

BUSINESS = {
    "id": "BUS-001",
    "name": "ABC Manufacturing",
    "industry": "Manufacturing",
    "gstin": "",
    "currency": "INR",
    "opening_cash": 840000,
    "monthly_revenue": 1200000,
    "monthly_expenses": 800000,
}


# ==========================================
# SAMPLE CUSTOMERS
# ==========================================

CUSTOMERS = [
    {
        "id": "CUS-001",
        "name": "Customer A",
        "industry": "Automotive",
    },
    {
        "id": "CUS-002",
        "name": "Customer B",
        "industry": "Retail",
    },
    {
        "id": "CUS-003",
        "name": "Customer C",
        "industry": "Construction",
    },
    {
        "id": "CUS-004",
        "name": "Customer D",
        "industry": "Wholesale",
    },
    {
        "id": "CUS-005",
        "name": "Customer E",
        "industry": "Retail",
    },
]


# ==========================================
# SAMPLE INVOICES
# ==========================================

INVOICES = [
    {
        "id": "INV-1001",
        "customer_id": "CUS-001",
        "customer": "Customer A",
        "amount": 250000,
        "invoice_date": date(2026, 8, 1),
        "due_date": date(2026, 8, 31),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
    {
        "id": "INV-1002",
        "customer_id": "CUS-002",
        "customer": "Customer B",
        "amount": 180000,
        "invoice_date": date(2026, 8, 3),
        "due_date": date(2026, 9, 2),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
    {
        "id": "INV-1003",
        "customer_id": "CUS-003",
        "customer": "Customer C",
        "amount": 120000,
        "invoice_date": date(2026, 8, 5),
        "due_date": date(2026, 8, 20),
        "status": "Paid",
        "payment_date": date(2026, 8, 18),
        "source": "sample",
    },
    {
        "id": "INV-1004",
        "customer_id": "CUS-001",
        "customer": "Customer A",
        "amount": 320000,
        "invoice_date": date(2026, 8, 7),
        "due_date": date(2026, 9, 6),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
    {
        "id": "INV-1005",
        "customer_id": "CUS-004",
        "customer": "Customer D",
        "amount": 95000,
        "invoice_date": date(2026, 8, 9),
        "due_date": date(2026, 9, 8),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
    {
        "id": "INV-1008",
        "customer_id": "CUS-003",
        "customer": "Customer C",
        "amount": 145000,
        "invoice_date": date(2026, 8, 15),
        "due_date": date(2026, 9, 14),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
    {
        "id": "INV-1009",
        "customer_id": "CUS-001",
        "customer": "Customer A",
        "amount": 275000,
        "invoice_date": date(2026, 8, 17),
        "due_date": date(2026, 9, 16),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
    {
        "id": "INV-1010",
        "customer_id": "CUS-005",
        "customer": "Customer E",
        "amount": 110000,
        "invoice_date": date(2026, 8, 18),
        "due_date": date(2026, 9, 17),
        "status": "Pending",
        "payment_date": None,
        "source": "sample",
    },
]


# ==========================================
# SAMPLE PAYMENTS
# ==========================================

PAYMENTS = [
    {
        "id": "PAY-001",
        "invoice_id": "INV-1003",
        "customer_id": "CUS-003",
        "amount": 120000,
        "expected_date": date(2026, 8, 20),
        "actual_date": date(2026, 8, 18),
        "days_delayed": -2,
        "source": "sample",
    },
    {
        "id": "PAY-002",
        "invoice_id": "INV-0998",
        "customer_id": "CUS-001",
        "amount": 210000,
        "expected_date": date(2026, 7, 20),
        "actual_date": date(2026, 8, 1),
        "days_delayed": 12,
        "source": "sample",
    },
    {
        "id": "PAY-003",
        "invoice_id": "INV-0999",
        "customer_id": "CUS-002",
        "amount": 175000,
        "expected_date": date(2026, 7, 25),
        "actual_date": date(2026, 7, 29),
        "days_delayed": 4,
        "source": "sample",
    },
    {
        "id": "PAY-004",
        "invoice_id": "INV-0997",
        "customer_id": "CUS-001",
        "amount": 280000,
        "expected_date": date(2026, 7, 15),
        "actual_date": date(2026, 8, 5),
        "days_delayed": 21,
        "source": "sample",
    },
]


# ==========================================
# RECURRING EXPENSES
# ==========================================

RECURRING_EXPENSES = [
    {
        "id": "EXP-001",
        "category": "Salaries",
        "description": "Employee salaries",
        "amount": 350000,
        "frequency": "monthly",
        "day_of_month": 1,
        "source": "sample",
    },
    {
        "id": "EXP-002",
        "category": "Rent",
        "description": "Factory rent",
        "amount": 120000,
        "frequency": "monthly",
        "day_of_month": 5,
        "source": "sample",
    },
    {
        "id": "EXP-003",
        "category": "Utilities",
        "description": "Electricity and utilities",
        "amount": 80000,
        "frequency": "monthly",
        "day_of_month": 10,
        "source": "sample",
    },
    {
        "id": "EXP-004",
        "category": "Operations",
        "description": "Operational expenses",
        "amount": 250000,
        "frequency": "monthly",
        "day_of_month": 15,
        "source": "sample",
    },
]


# ==========================================
# ONE-TIME EXPENSES
# ==========================================

EXPENSES = [
    {
        "id": "EXP-101",
        "category": "Equipment",
        "description": "Machine maintenance",
        "amount": 85000,
        "date": date(2026, 8, 12),
        "recurring": False,
        "source": "sample",
    },
    {
        "id": "EXP-102",
        "category": "Transport",
        "description": "Logistics expense",
        "amount": 45000,
        "date": date(2026, 8, 18),
        "recurring": False,
        "source": "sample",
    },
]


# ==========================================
# SEED DATABASE
# ==========================================

def seed_database():

    db = SessionLocal()

    try:
        print("Starting FinTwin database seed...")

        # --------------------------------------
        # BUSINESS
        # --------------------------------------

        business = db.get(
            Business,
            BUSINESS["id"],
        )

        if not business:
            business = Business(
                **BUSINESS
            )

            db.add(business)

            print("✓ Business added")

        else:
            print("✓ Business already exists")


        # --------------------------------------
        # CUSTOMERS
        # --------------------------------------

        for data in CUSTOMERS:

            customer = db.get(
                Customer,
                data["id"],
            )

            if not customer:

                customer = Customer(
                    business_id=BUSINESS["id"],
                    **data,
                )

                db.add(customer)

        print(
            f"✓ Customers processed: {len(CUSTOMERS)}"
        )


        # --------------------------------------
        # INVOICES
        # --------------------------------------

        for data in INVOICES:

            invoice = db.get(
                Invoice,
                data["id"],
            )

            if not invoice:

                invoice = Invoice(
                    business_id=BUSINESS["id"],
                    **data,
                )

                db.add(invoice)

        print(
            f"✓ Invoices processed: {len(INVOICES)}"
        )


        # --------------------------------------
        # PAYMENTS
        # --------------------------------------

        for data in PAYMENTS:

            payment = db.get(
                Payment,
                data["id"],
            )

            if not payment:

                payment = Payment(
                    business_id=BUSINESS["id"],
                    **data,
                )

                db.add(payment)

        print(
            f"✓ Payments processed: {len(PAYMENTS)}"
        )


        # --------------------------------------
        # RECURRING EXPENSES
        # --------------------------------------

        for data in RECURRING_EXPENSES:

            expense = db.get(
                RecurringExpense,
                data["id"],
            )

            if not expense:

                expense = RecurringExpense(
                    business_id=BUSINESS["id"],
                    **data,
                )

                db.add(expense)

        print(
            "✓ Recurring expenses processed: "
            f"{len(RECURRING_EXPENSES)}"
        )


        # --------------------------------------
        # ONE-TIME EXPENSES
        # --------------------------------------

        for data in EXPENSES:

            expense = db.get(
                Expense,
                data["id"],
            )

            if not expense:

                expense = Expense(
                    business_id=BUSINESS["id"],
                    **data,
                )

                db.add(expense)

        print(
            f"✓ Expenses processed: {len(EXPENSES)}"
        )


        # --------------------------------------
        # COMMIT
        # --------------------------------------

        db.commit()

        print()
        print("==========================================")
        print("FinTwin database seeded successfully!")
        print("==========================================")

    except Exception as error:

        db.rollback()

        print()
        print("Database seed failed:")
        print(error)

        raise

    finally:

        db.close()


# ==========================================
# RUN
# ==========================================

if __name__ == "__main__":
    seed_database()