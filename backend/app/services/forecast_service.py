from datetime import date, timedelta
from typing import Any, Optional

from app.ml.predict import predict_payment_delay


# ==========================================
# HELPERS
# ==========================================

def parse_date(value: Any) -> date:
    """
    Convert an ISO date string into a Python date.
    """

    if isinstance(value, date):
        return value

    return date.fromisoformat(
        str(value)
    )


def calculate_expected_payment_date(
    due_date: Any,
    predicted_delay_days: float,
) -> date:

    due = parse_date(due_date)

    return due + timedelta(
        days=round(predicted_delay_days)
    )


# ==========================================
# CUSTOMER HISTORY
# ==========================================

def build_customer_history(
    invoices: list[dict],
    payments: list[dict],
) -> dict:

    history = {}

    for invoice in invoices:

        customer = (
            invoice.get("customer")
            or invoice.get("customerId")
            or "Unknown"
        )

        if customer not in history:

            history[customer] = {
                "invoice_count": 0,
                "total_invoiced": 0,
                "delays": [],
                "late_payments": 0,
            }

        history[customer][
            "invoice_count"
        ] += 1

        history[customer][
            "total_invoiced"
        ] += float(
            invoice.get("amount", 0)
        )


    for payment in payments:

        customer = (
            payment.get("customer")
            or payment.get("customerId")
            or "Unknown"
        )

        if customer not in history:

            history[customer] = {
                "invoice_count": 0,
                "total_invoiced": 0,
                "delays": [],
                "late_payments": 0,
            }

        delay = float(
            payment.get(
                "daysDelayed",
                payment.get(
                    "days_delayed",
                    0,
                ),
            )
        )

        history[customer][
            "delays"
        ].append(delay)

        if delay > 0:

            history[customer][
                "late_payments"
            ] += 1


    for customer in history:

        delays = history[
            customer
        ]["delays"]

        if delays:

            history[
                customer
            ]["average_delay"] = (
                sum(delays)
                / len(delays)
            )

        else:

            history[
                customer
            ]["average_delay"] = 0


    return history


# ==========================================
# PREDICT INVOICE PAYMENT
# ==========================================

def predict_invoice_payment(
    invoice: dict,
    customer_history: dict,
    today: Optional[date] = None,
) -> dict:

    if today is None:

        today = date.today()


    customer = (
        invoice.get("customer")
        or invoice.get("customerId")
        or "Unknown"
    )


    history = customer_history.get(
        customer,
        {
            "invoice_count": 0,
            "average_delay": 0,
            "late_payments": 0,
        },
    )


    due_date = parse_date(
        invoice["dueDate"]
    )


    days_until_due = (
        due_date - today
    ).days


    predicted_delay = (
        predict_payment_delay(
            invoice_amount=float(
                invoice.get("amount", 0)
            ),

            days_until_due=max(
                0,
                days_until_due,
            ),

            previous_avg_delay=float(
                history.get(
                    "average_delay",
                    0,
                )
            ),

            previous_late_payments=int(
                history.get(
                    "late_payments",
                    0,
                )
            ),

            customer_invoice_count=int(
                history.get(
                    "invoice_count",
                    0,
                )
            ),
        )
    )


    expected_payment_date = (
        calculate_expected_payment_date(
            due_date,
            predicted_delay[
                "predicted_delay_days"
            ],
        )
    )


    return {
        "invoice_id": invoice.get(
            "id"
        ),

        "customer": customer,

        "amount": float(
            invoice.get(
                "amount",
                0,
            )
        ),

        "due_date": due_date.isoformat(),

        "predicted_delay_days":
            predicted_delay[
                "predicted_delay_days"
            ],

        "payment_risk":
            predicted_delay[
                "risk"
            ],

        "expected_payment_date":
            expected_payment_date.isoformat(),
    }


# ==========================================
# FORECAST INFLOWS
# ==========================================

def calculate_predicted_inflows(
    invoices: list[dict],
    payments: list[dict],
   today: Optional[date] = None,
) -> list[dict]:

    if today is None:

        today = date.today()


    customer_history = (
        build_customer_history(
            invoices,
            payments,
        )
    )


    predictions = []


    for invoice in invoices:

        status = str(
            invoice.get(
                "status",
                "",
            )
        ).lower()


        if status == "paid":

            continue


        prediction = (
            predict_invoice_payment(
                invoice,
                customer_history,
                today,
            )
        )


        predictions.append(
            prediction
        )


    return predictions


# ==========================================
# FORECAST EXPENSES
# ==========================================

def calculate_monthly_expenses(
    recurring_expenses: list[dict],
    one_time_expenses: list[dict],
) -> float:

    recurring_total = sum(
        float(
            expense.get(
                "amount",
                0,
            )
        )
        for expense in recurring_expenses
    )


    one_time_total = sum(
        float(
            expense.get(
                "amount",
                0,
            )
        )
        for expense in one_time_expenses
    )


    return (
        recurring_total
        + one_time_total
    )


# ==========================================
# CASH FORECAST
# ==========================================

def generate_cash_forecast(
    current_cash: float,
    invoices: list[dict],
    payments: list[dict],
    recurring_expenses: list[dict],
    one_time_expenses: list[dict],
    horizon_days: int = 90,
   today: Optional[date] = None,
) -> dict:

    if today is None:

        today = date.today()


    predictions = (
        calculate_predicted_inflows(
            invoices,
            payments,
            today,
        )
    )


    total_expenses = (
        calculate_monthly_expenses(
            recurring_expenses,
            one_time_expenses,
        )
    )


    periods = [
        30,
        60,
        90,
    ]


    forecast = []


    for period in periods:

        period_end = (
            today
            + timedelta(
                days=period
            )
        )


        expected_inflows = 0

        contributing_invoices = []


        for prediction in predictions:

            payment_date = parse_date(
                prediction[
                    "expected_payment_date"
                ]
            )


            if (
                payment_date
                <= period_end
            ):

                expected_inflows += (
                    prediction[
                        "amount"
                    ]
                )

                contributing_invoices.append(
                    prediction
                )


        months = period / 30

        expected_outflows = (
            total_expenses * months
        )


        projected_cash = (
            current_cash
            + expected_inflows
            - expected_outflows
        )


        liquidity_gap = max(
            0,
            -projected_cash,
        )


        if projected_cash < 0:

            risk = "HIGH"

        elif (
            projected_cash
            < current_cash * 0.5
        ):

            risk = "MEDIUM"

        else:

            risk = "LOW"


        forecast.append(
            {
                "period_days": period,

                "period_end":
                    period_end.isoformat(),

                "expected_inflows":
                    round(
                        expected_inflows,
                        2,
                    ),

                "expected_outflows":
                    round(
                        expected_outflows,
                        2,
                    ),

                "projected_cash":
                    round(
                        projected_cash,
                        2,
                    ),

                "liquidity_gap":
                    round(
                        liquidity_gap,
                        2,
                    ),

                "risk": risk,

                "contributing_invoices":
                    contributing_invoices,
            }
        )


    return {
        "today": today.isoformat(),

        "current_cash":
            round(
                current_cash,
                2,
            ),

        "forecast": forecast,

        "payment_predictions":
            predictions,
    }