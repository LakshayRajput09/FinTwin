from typing import Any


# ==========================================
# HELPERS
# ==========================================

def safe_number(value: Any) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


# ==========================================
# PAYMENT DELAY RISK
# ==========================================

def analyze_payment_delay_risk(
    payment_predictions: list[dict],
) -> dict:

    if not payment_predictions:
        return {
            "risk": "LOW",
            "score": 0,
            "message": "No outstanding payment predictions.",
            "high_risk_invoices": [],
        }

    high_risk = []
    medium_risk = []

    total_amount = 0
    weighted_delay = 0

    for prediction in payment_predictions:

        amount = safe_number(
            prediction.get("amount")
        )

        delay = safe_number(
            prediction.get(
                "predicted_delay_days"
            )
        )

        risk = str(
            prediction.get(
                "payment_risk",
                "LOW"
            )
        ).upper()

        total_amount += amount
        weighted_delay += amount * delay

        if risk == "HIGH":
            high_risk.append(prediction)

        elif risk == "MEDIUM":
            medium_risk.append(prediction)

    average_delay = (
        weighted_delay / total_amount
        if total_amount > 0
        else 0
    )

    high_amount = sum(
        safe_number(
            item.get("amount")
        )
        for item in high_risk
    )

    if high_amount > total_amount * 0.40:
        overall_risk = "HIGH"
        score = 85

    elif (
        high_risk
        or average_delay > 20
    ):
        overall_risk = "HIGH"
        score = 75

    elif (
        medium_risk
        or average_delay > 10
    ):
        overall_risk = "MEDIUM"
        score = 50

    else:
        overall_risk = "LOW"
        score = 20

    return {
        "risk": overall_risk,
        "score": score,
        "average_predicted_delay_days": round(
            average_delay,
            2,
        ),
        "high_risk_amount": round(
            high_amount,
            2,
        ),
        "high_risk_invoices": high_risk,
        "medium_risk_invoices": medium_risk,
    }


# ==========================================
# CUSTOMER CONCENTRATION RISK
# ==========================================

def analyze_customer_concentration(
    invoices: list[dict],
) -> dict:

    outstanding = [
        invoice
        for invoice in invoices
        if str(
            invoice.get(
                "status",
                ""
            )
        ).lower() != "paid"
    ]

    if not outstanding:
        return {
            "risk": "LOW",
            "score": 0,
            "largest_customer": None,
            "largest_customer_amount": 0,
            "concentration_percentage": 0,
        }

    customer_totals = {}

    total_receivables = 0

    for invoice in outstanding:

        customer = (
            invoice.get("customer")
            or invoice.get("customerId")
            or "Unknown"
        )

        amount = safe_number(
            invoice.get("amount")
        )

        customer_totals[customer] = (
            customer_totals.get(
                customer,
                0,
            )
            + amount
        )

        total_receivables += amount

    if total_receivables <= 0:
        return {
            "risk": "LOW",
            "score": 0,
            "largest_customer": None,
            "largest_customer_amount": 0,
            "concentration_percentage": 0,
        }

    largest_customer = max(
        customer_totals,
        key=customer_totals.get,
    )

    largest_amount = customer_totals[
        largest_customer
    ]

    concentration = (
        largest_amount
        / total_receivables
        * 100
    )

    if concentration >= 60:
        risk = "HIGH"
        score = 90

    elif concentration >= 40:
        risk = "MEDIUM"
        score = 60

    else:
        risk = "LOW"
        score = 20

    return {
        "risk": risk,
        "score": score,
        "largest_customer": largest_customer,
        "largest_customer_amount": round(
            largest_amount,
            2,
        ),
        "total_receivables": round(
            total_receivables,
            2,
        ),
        "concentration_percentage": round(
            concentration,
            2,
        ),
    }


# ==========================================
# LIQUIDITY RISK
# ==========================================

def analyze_liquidity_risk(
    forecast: dict,
) -> dict:

    periods = forecast.get(
        "forecast",
        [],
    )

    if not periods:
        return {
            "risk": "LOW",
            "score": 0,
            "minimum_projected_cash": 0,
            "liquidity_gap": 0,
        }

    minimum_cash = min(
        safe_number(
            period.get(
                "projected_cash"
            )
        )
        for period in periods
    )

    maximum_gap = max(
        safe_number(
            period.get(
                "liquidity_gap"
            )
        )
        for period in periods
    )

    high_periods = [
        period
        for period in periods
        if str(
            period.get(
                "risk",
                ""
            )
        ).upper() == "HIGH"
    ]

    if maximum_gap > 0:
        risk = "HIGH"
        score = 95

    elif high_periods:
        risk = "HIGH"
        score = 80

    elif minimum_cash <= 0:
        risk = "HIGH"
        score = 90

    elif minimum_cash < (
        safe_number(
            forecast.get(
                "current_cash"
            )
        ) * 0.5
    ):
        risk = "MEDIUM"
        score = 55

    else:
        risk = "LOW"
        score = 15

    return {
        "risk": risk,
        "score": score,
        "minimum_projected_cash": round(
            minimum_cash,
            2,
        ),
        "liquidity_gap": round(
            maximum_gap,
            2,
        ),
        "high_risk_periods": high_periods,
    }


# ==========================================
# EXPENSE PRESSURE
# ==========================================

def analyze_expense_pressure(
    current_cash: float,
    recurring_expenses: list[dict],
    one_time_expenses: list[dict],
) -> dict:

    recurring_total = sum(
        safe_number(
            expense.get("amount")
        )
        for expense in recurring_expenses
    )

    one_time_total = sum(
        safe_number(
            expense.get("amount")
        )
        for expense in one_time_expenses
    )

    total_expenses = (
        recurring_total
        + one_time_total
    )

    current_cash = safe_number(
        current_cash
    )

    if current_cash <= 0:

        coverage_months = 0

    elif recurring_total > 0:

        coverage_months = (
            current_cash
            / recurring_total
        )

    else:

        coverage_months = 999

    if coverage_months < 1:
        risk = "HIGH"
        score = 90

    elif coverage_months < 2:
        risk = "MEDIUM"
        score = 60

    else:
        risk = "LOW"
        score = 20

    return {
        "risk": risk,
        "score": score,
        "recurring_expenses": round(
            recurring_total,
            2,
        ),
        "one_time_expenses": round(
            one_time_total,
            2,
        ),
        "total_expenses": round(
            total_expenses,
            2,
        ),
        "cash_coverage_months": round(
            coverage_months,
            2,
        ),
    }


# ==========================================
# OVERALL RISK
# ==========================================

def calculate_overall_risk(
    payment_risk: dict,
    concentration_risk: dict,
    liquidity_risk: dict,
    expense_risk: dict,
) -> dict:

    risks = [
        payment_risk,
        concentration_risk,
        liquidity_risk,
        expense_risk,
    ]

    scores = [
        safe_number(
            risk.get("score")
        )
        for risk in risks
    ]

    overall_score = (
        sum(scores)
        / len(scores)
        if scores
        else 0
    )

    if overall_score >= 70:
        risk_level = "HIGH"

    elif overall_score >= 40:
        risk_level = "MEDIUM"

    else:
        risk_level = "LOW"

    return {
        "risk": risk_level,
        "score": round(
            overall_score,
            2,
        ),
    }


# ==========================================
# EXPLAINABLE RISK FACTORS
# ==========================================

def generate_risk_explanations(
    payment_risk: dict,
    concentration_risk: dict,
    liquidity_risk: dict,
    expense_risk: dict,
) -> list[dict]:

    explanations = []

    # ------------------------------
    # Payment delay
    # ------------------------------

    if payment_risk["risk"] == "HIGH":

        explanations.append(
            {
                "type": "PAYMENT_DELAY",
                "severity": "HIGH",
                "title": "High payment-delay risk",
                "message": (
                    "Several outstanding invoices "
                    "are expected to be paid later "
                    "than their contractual due dates."
                ),
            }
        )

    elif payment_risk["risk"] == "MEDIUM":

        explanations.append(
            {
                "type": "PAYMENT_DELAY",
                "severity": "MEDIUM",
                "title": "Moderate payment-delay risk",
                "message": (
                    "Historical customer behavior "
                    "suggests some collection delays."
                ),
            }
        )


    # ------------------------------
    # Concentration
    # ------------------------------

    if concentration_risk["risk"] == "HIGH":

        explanations.append(
            {
                "type": "CONCENTRATION",
                "severity": "HIGH",
                "title": "High customer concentration",
                "message": (
                    f"{concentration_risk['concentration_percentage']:.1f}% "
                    "of outstanding receivables depend "
                    f"on {concentration_risk['largest_customer']}."
                ),
            }
        )

    elif concentration_risk["risk"] == "MEDIUM":

        explanations.append(
            {
                "type": "CONCENTRATION",
                "severity": "MEDIUM",
                "title": "Customer concentration risk",
                "message": (
                    f"{concentration_risk['concentration_percentage']:.1f}% "
                    "of outstanding receivables come "
                    "from the largest customer."
                ),
            }
        )


    # ------------------------------
    # Liquidity
    # ------------------------------

    if liquidity_risk["risk"] == "HIGH":

        explanations.append(
            {
                "type": "LIQUIDITY",
                "severity": "HIGH",
                "title": "Potential liquidity gap",
                "message": (
                    "Projected cash becomes insufficient "
                    "to cover expected obligations."
                ),
            }
        )

    elif liquidity_risk["risk"] == "MEDIUM":

        explanations.append(
            {
                "type": "LIQUIDITY",
                "severity": "MEDIUM",
                "title": "Liquidity pressure",
                "message": (
                    "Projected cash falls significantly "
                    "below the current cash position."
                ),
            }
        )


    # ------------------------------
    # Expense pressure
    # ------------------------------

    if expense_risk["risk"] == "HIGH":

        explanations.append(
            {
                "type": "EXPENSE_PRESSURE",
                "severity": "HIGH",
                "title": "High expense pressure",
                "message": (
                    "Current cash provides less than "
                    "one month of recurring expense coverage."
                ),
            }
        )

    elif expense_risk["risk"] == "MEDIUM":

        explanations.append(
            {
                "type": "EXPENSE_PRESSURE",
                "severity": "MEDIUM",
                "title": "Moderate expense pressure",
                "message": (
                    "Recurring expenses are consuming "
                    "a significant portion of available cash."
                ),
            }
        )


    if not explanations:

        explanations.append(
            {
                "type": "GENERAL",
                "severity": "LOW",
                "title": "Financial position appears stable",
                "message": (
                    "No major risk indicators were "
                    "identified from the current data."
                ),
            }
        )


    return explanations


# ==========================================
# COMPLETE RISK ANALYSIS
# ==========================================

def generate_risk_analysis(
    current_cash: float,
    invoices: list[dict],
    recurring_expenses: list[dict],
    one_time_expenses: list[dict],
    forecast: dict,
) -> dict:

    payment_predictions = forecast.get(
        "payment_predictions",
        [],
    )


    payment_risk = (
        analyze_payment_delay_risk(
            payment_predictions
        )
    )


    concentration_risk = (
        analyze_customer_concentration(
            invoices
        )
    )


    liquidity_risk = (
        analyze_liquidity_risk(
            forecast
        )
    )


    expense_risk = (
        analyze_expense_pressure(
            current_cash,
            recurring_expenses,
            one_time_expenses,
        )
    )


    overall = calculate_overall_risk(
        payment_risk,
        concentration_risk,
        liquidity_risk,
        expense_risk,
    )


    explanations = (
        generate_risk_explanations(
            payment_risk,
            concentration_risk,
            liquidity_risk,
            expense_risk,
        )
    )


    return {
        "overall": overall,

        "payment_delay": payment_risk,

        "customer_concentration":
            concentration_risk,

        "liquidity": liquidity_risk,

        "expense_pressure":
            expense_risk,

        "explanations":
            explanations,
    }