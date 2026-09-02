from typing import Any


# ==========================================
# HELPERS
# ==========================================

def safe_number(value: Any) -> float:
    try:
        return float(value or 0)
    except (TypeError, ValueError):
        return 0.0


def round_money(value: float) -> float:
    return round(value, 2)


# ==========================================
# BASE FINANCIAL POSITION
# ==========================================

def calculate_base_position(
    current_cash: float,
    invoices: list[dict],
    recurring_expenses: list[dict],
    one_time_expenses: list[dict],
) -> dict:

    current_cash = safe_number(current_cash)

    receivables = sum(
        safe_number(invoice.get("amount"))
        for invoice in invoices
        if str(
            invoice.get("status", "")
        ).lower() != "paid"
    )

    recurring = sum(
        safe_number(expense.get("amount"))
        for expense in recurring_expenses
    )

    one_time = sum(
        safe_number(expense.get("amount"))
        for expense in one_time_expenses
    )

    total_expenses = recurring + one_time

    net_position = (
        current_cash
        + receivables
        - total_expenses
    )

    return {
        "current_cash": round_money(
            current_cash
        ),
        "receivables": round_money(
            receivables
        ),
        "recurring_expenses": round_money(
            recurring
        ),
        "one_time_expenses": round_money(
            one_time
        ),
        "total_expenses": round_money(
            total_expenses
        ),
        "net_position": round_money(
            net_position
        ),
    }


# ==========================================
# REVENUE SHOCK
# ==========================================

def simulate_revenue_shock(
    base: dict,
    revenue_change_percent: float,
) -> dict:

    change = safe_number(
        revenue_change_percent
    )

    receivables = safe_number(
        base["receivables"]
    )

    adjusted_receivables = (
        receivables
        * (1 + change / 100)
    )

    cash_position = (
        safe_number(
            base["current_cash"]
        )
        + adjusted_receivables
        - safe_number(
            base["total_expenses"]
        )
    )

    return {
        "scenario": "Revenue Shock",

        "revenue_change_percent": change,

        "adjusted_receivables":
            round_money(
                adjusted_receivables
            ),

        "projected_cash":
            round_money(
                cash_position
            ),

        "cash_impact":
            round_money(
                cash_position
                - base["net_position"]
            ),
    }


# ==========================================
# EXPENSE SHOCK
# ==========================================

def simulate_expense_shock(
    base: dict,
    expense_change_percent: float,
) -> dict:

    change = safe_number(
        expense_change_percent
    )

    expenses = safe_number(
        base["total_expenses"]
    )

    adjusted_expenses = (
        expenses
        * (1 + change / 100)
    )

    cash_position = (
        safe_number(
            base["current_cash"]
        )
        + safe_number(
            base["receivables"]
        )
        - adjusted_expenses
    )

    return {
        "scenario": "Expense Shock",

        "expense_change_percent": change,

        "adjusted_expenses":
            round_money(
                adjusted_expenses
            ),

        "projected_cash":
            round_money(
                cash_position
            ),

        "cash_impact":
            round_money(
                cash_position
                - base["net_position"]
            ),
    }


# ==========================================
# PAYMENT DELAY SHOCK
# ==========================================

def simulate_payment_delay(
    base: dict,
    delay_days: int,
) -> dict:

    delay_days = int(
        safe_number(delay_days)
    )

    receivables = safe_number(
        base["receivables"]
    )

    # Estimate the proportion of receivables
    # delayed based on the shock duration.
    #
    # This is intentionally a scenario model,
    # not a lending decision.

    if delay_days <= 0:
        delayed_percentage = 0

    elif delay_days <= 15:
        delayed_percentage = 25

    elif delay_days <= 30:
        delayed_percentage = 50

    elif delay_days <= 60:
        delayed_percentage = 75

    else:
        delayed_percentage = 100

    delayed_amount = (
        receivables
        * delayed_percentage
        / 100
    )

    immediately_available_receivables = (
        receivables
        - delayed_amount
    )

    projected_cash = (
        safe_number(
            base["current_cash"]
        )
        + immediately_available_receivables
        - safe_number(
            base["total_expenses"]
        )
    )

    liquidity_gap = max(
        0,
        -projected_cash,
    )

    return {
        "scenario": "Payment Delay",

        "delay_days": delay_days,

        "delayed_percentage":
            delayed_percentage,

        "delayed_amount":
            round_money(
                delayed_amount
            ),

        "projected_cash":
            round_money(
                projected_cash
            ),

        "liquidity_gap":
            round_money(
                liquidity_gap
            ),

        "cash_impact":
            round_money(
                projected_cash
                - base["net_position"]
            ),
    }


# ==========================================
# COMBINED SHOCK
# ==========================================

def simulate_combined_shock(
    base: dict,
    revenue_change_percent: float,
    expense_change_percent: float,
    payment_delay_days: int,
) -> dict:

    revenue_change = safe_number(
        revenue_change_percent
    )

    expense_change = safe_number(
        expense_change_percent
    )

    delay_days = int(
        safe_number(
            payment_delay_days
        )
    )

    # ------------------------------
    # Revenue impact
    # ------------------------------

    receivables = safe_number(
        base["receivables"]
    )

    adjusted_receivables = (
        receivables
        * (1 + revenue_change / 100)
    )

    # ------------------------------
    # Payment delay impact
    # ------------------------------

    if delay_days <= 0:
        delayed_percentage = 0

    elif delay_days <= 15:
        delayed_percentage = 25

    elif delay_days <= 30:
        delayed_percentage = 50

    elif delay_days <= 60:
        delayed_percentage = 75

    else:
        delayed_percentage = 100

    delayed_amount = (
        adjusted_receivables
        * delayed_percentage
        / 100
    )

    available_receivables = (
        adjusted_receivables
        - delayed_amount
    )

    # ------------------------------
    # Expense impact
    # ------------------------------

    expenses = safe_number(
        base["total_expenses"]
    )

    adjusted_expenses = (
        expenses
        * (1 + expense_change / 100)
    )

    # ------------------------------
    # Final position
    # ------------------------------

    projected_cash = (
        safe_number(
            base["current_cash"]
        )
        + available_receivables
        - adjusted_expenses
    )

    liquidity_gap = max(
        0,
        -projected_cash,
    )

    return {
        "scenario": "Combined Shock",

        "revenue_change_percent":
            revenue_change,

        "expense_change_percent":
            expense_change,

        "payment_delay_days":
            delay_days,

        "adjusted_receivables":
            round_money(
                adjusted_receivables
            ),

        "delayed_amount":
            round_money(
                delayed_amount
            ),

        "adjusted_expenses":
            round_money(
                adjusted_expenses
            ),

        "projected_cash":
            round_money(
                projected_cash
            ),

        "liquidity_gap":
            round_money(
                liquidity_gap
            ),

        "cash_impact":
            round_money(
                projected_cash
                - base["net_position"]
            ),
    }


# ==========================================
# RISK CLASSIFICATION
# ==========================================

def classify_scenario(
    projected_cash: float,
    liquidity_gap: float,
) -> str:

    projected_cash = safe_number(
        projected_cash
    )

    liquidity_gap = safe_number(
        liquidity_gap
    )

    if liquidity_gap > 0:
        return "HIGH"

    if projected_cash <= 0:
        return "HIGH"

    if projected_cash < 100000:
        return "MEDIUM"

    return "LOW"


# ==========================================
# SCENARIO EXPLANATION
# ==========================================

def explain_scenario(
    scenario: dict,
) -> str:

    scenario_name = scenario.get(
        "scenario",
        "Scenario",
    )

    projected_cash = safe_number(
        scenario.get(
            "projected_cash"
        )
    )

    liquidity_gap = safe_number(
        scenario.get(
            "liquidity_gap"
        )
    )

    if liquidity_gap > 0:

        return (
            f"{scenario_name} creates a "
            f"potential liquidity gap of "
            f"₹{liquidity_gap:,.0f}. "
            "The business may need to reduce "
            "outflows, accelerate collections, "
            "or consider suitable working-capital "
            "options."
        )

    if projected_cash <= 0:

        return (
            f"{scenario_name} causes projected "
            "cash to fall to zero or below. "
            "Immediate cash-flow management "
            "would be important."
        )

    if projected_cash < 100000:

        return (
            f"{scenario_name} significantly "
            "reduces available cash and leaves "
            "a relatively small liquidity buffer."
        )

    return (
        f"{scenario_name} does not create an "
        "immediate liquidity gap under the "
        "selected assumptions."
    )


# ==========================================
# COMPLETE SIMULATION
# ==========================================

def run_simulation(
    current_cash: float,
    invoices: list[dict],
    recurring_expenses: list[dict],
    one_time_expenses: list[dict],
    revenue_change_percent: float = 0,
    expense_change_percent: float = 0,
    payment_delay_days: int = 0,
    customer_default_percent: float = 0,
    raw_material_inflation_percent: float = 0,
    payroll_hike_percent: float = 0,
    tax_outflow_amount: float = 0,
    loan_emi_amount: float = 0,
    treds_discount_percent: float = 0,
    govt_subsidy_amount: float = 0,
    sec43b_overdue_days: int = 0,
    repo_rate_hike_bps: float = 0,
    capex_outflow_amount: float = 0,
    itc_reversal_amount: float = 0,
    cash_recovery_percent: float = 0,
    supplier_discount_percent: float = 0,
    export_surge_percent: float = 0,
) -> dict:

    # --------------------------------------
    # Calculate base position
    # --------------------------------------
    base = calculate_base_position(
        current_cash=current_cash,
        invoices=invoices,
        recurring_expenses=recurring_expenses,
        one_time_expenses=one_time_expenses,
    )

    net_position = base["net_position"]
    receivables = base["receivables"]
    total_expenses = base["total_expenses"]
    recurring = base["recurring_expenses"]

    def classify(cash, gap):
        if gap > 0 or cash <= 0:
            return "HIGH"
        if cash < 150000:
            return "MEDIUM"
        return "LOW"

    # 1. Base Scenario
    base_scenario = {
        "scenario": "Base Case (Current)",
        "parameter": "Normal Operations",
        "projected_cash": net_position,
        "cash_impact": 0,
        "liquidity_gap": max(0.0, -net_position),
        "risk": classify(net_position, max(0.0, -net_position)),
        "explanation": "Current financial position without external shocks.",
    }

    # 2. Revenue Shock
    adj_rev = receivables * (1 + revenue_change_percent / 100)
    rev_impact = adj_rev - receivables
    rev_cash = current_cash + adj_rev - total_expenses
    revenue_scenario = {
        "scenario": "Revenue Shock",
        "parameter": f"{'+' if revenue_change_percent > 0 else ''}{revenue_change_percent}% Demand",
        "projected_cash": rev_cash,
        "cash_impact": rev_impact,
        "liquidity_gap": max(0.0, -rev_cash),
        "risk": classify(rev_cash, max(0.0, -rev_cash)),
        "explanation": "Revenue contraction creates an operating shortfall." if rev_cash <= 0 else "Sales shift sustained within liquid reserves.",
    }

    # 3. Operating Expense Shock
    adj_exp = total_expenses * (1 + expense_change_percent / 100)
    exp_impact = total_expenses - adj_exp
    exp_cash = current_cash + receivables - adj_exp
    expense_scenario = {
        "scenario": "Operating Expense Surge",
        "parameter": f"{'+' if expense_change_percent > 0 else ''}{expense_change_percent}% General Opex",
        "projected_cash": exp_cash,
        "cash_impact": exp_impact,
        "liquidity_gap": max(0.0, -exp_cash),
        "risk": classify(exp_cash, max(0.0, -exp_cash)),
        "explanation": "General operational expenditure increase across utilities and administration.",
    }

    # 4. Payment Delay Shock
    delay_pct = 0.0 if payment_delay_days <= 0 else 25.0 if payment_delay_days <= 15 else 50.0 if payment_delay_days <= 30 else 75.0 if payment_delay_days <= 60 else 100.0
    delayed_amt = (receivables * delay_pct) / 100.0
    delay_cash = current_cash + (receivables - delayed_amt) - total_expenses
    payment_scenario = {
        "scenario": "Payment Delay Shock",
        "parameter": f"{payment_delay_days}d Delay ({delay_pct}% trapped)",
        "projected_cash": delay_cash,
        "cash_impact": -delayed_amt,
        "liquidity_gap": max(0.0, -delay_cash),
        "risk": classify(delay_cash, max(0.0, -delay_cash)),
        "explanation": f"Customer lag locks ₹{int(delayed_amt):,} in overdue credit.",
    }

    # 5. Customer Default Shock
    defaulted_amt = (receivables * customer_default_percent) / 100.0
    default_cash = current_cash + (receivables - defaulted_amt) - total_expenses
    default_scenario = {
        "scenario": "Top Client Default",
        "parameter": f"{customer_default_percent}% Bad Debt Write-off",
        "projected_cash": default_cash,
        "cash_impact": -defaulted_amt,
        "liquidity_gap": max(0.0, -default_cash),
        "risk": classify(default_cash, max(0.0, -default_cash)),
        "explanation": f"Permanent loss of ₹{int(defaulted_amt):,} in written-off invoices.",
    }

    # 6. Raw Material Inflation Shock
    raw_mat_base = total_expenses * 0.45
    raw_mat_surge = (raw_mat_base * raw_material_inflation_percent) / 100.0
    raw_mat_cash = current_cash + receivables - (total_expenses + raw_mat_surge)
    raw_mat_scenario = {
        "scenario": "Raw Material Inflation",
        "parameter": f"+{raw_material_inflation_percent}% Procurement Cost",
        "projected_cash": raw_mat_cash,
        "cash_impact": -raw_mat_surge,
        "liquidity_gap": max(0.0, -raw_mat_cash),
        "risk": classify(raw_mat_cash, max(0.0, -raw_mat_cash)),
        "explanation": f"Supply chain inflation adds ₹{int(raw_mat_surge):,} to monthly manufacturing costs.",
    }

    # 7. Section 43B(h) Delay & 3x RBI Penal Compound Interest Shock
    overdue_ratio = 0.0 if sec43b_overdue_days <= 0 else min(1.0, 0.35 + (sec43b_overdue_days / 100.0))
    overdue_43b_amt = receivables * overdue_ratio
    sec43b_penal_interest = overdue_43b_amt * 0.195 * (max(15, sec43b_overdue_days) / 365.0)
    sec43b_tax_disallowance = (overdue_43b_amt * 0.30 * 0.25) if sec43b_overdue_days > 45 else 0.0
    sec43b_total_hit = (sec43b_penal_interest + sec43b_tax_disallowance) if sec43b_overdue_days > 0 else 0.0
    sec43b_cash = net_position - sec43b_total_hit
    sec43b_scenario = {
        "scenario": "Section 43B(h) Delay & Penal Shock",
        "parameter": f"{sec43b_overdue_days}d Overdue (3x RBI Interest)",
        "projected_cash": sec43b_cash,
        "cash_impact": -sec43b_total_hit,
        "liquidity_gap": max(0.0, -sec43b_cash),
        "risk": classify(sec43b_cash, max(0.0, -sec43b_cash)),
        "explanation": "MSE payments past 45 days incur 3x RBI bank rate (~19.5%) compound interest and statutory income tax disallowances.",
    }

    # 8. RBI Repo Rate Hike on Bank OD/CC (+bps)
    repo_quarterly_surge = 2000000.0 * (repo_rate_hike_bps / 10000.0) * (3.0 / 12.0)
    repo_rate_cash = net_position - repo_quarterly_surge
    repo_rate_scenario = {
        "scenario": "RBI Repo Rate Hike on Bank OD/CC",
        "parameter": f"+{repo_rate_hike_bps} bps Floating Rate Hike",
        "projected_cash": repo_rate_cash,
        "cash_impact": -repo_quarterly_surge,
        "liquidity_gap": max(0.0, -repo_rate_cash),
        "risk": classify(repo_rate_cash, max(0.0, -repo_rate_cash)),
        "explanation": f"Higher repo rate increases quarterly borrowing costs by ₹{int(repo_quarterly_surge):,} on bank credit lines.",
    }

    # 9. GST ITC Reversal & GSTR-2B Lockup
    itc_cash = net_position - itc_reversal_amount
    itc_scenario = {
        "scenario": "GST ITC Reversal & Supplier Freeze",
        "parameter": f"₹{int(itc_reversal_amount):,} ITC Reversal",
        "projected_cash": itc_cash,
        "cash_impact": -itc_reversal_amount,
        "liquidity_gap": max(0.0, -itc_cash),
        "risk": classify(itc_cash, max(0.0, -itc_cash)),
        "explanation": "GSTR-2B non-compliance by suppliers triggers Input Tax Credit reversal liability.",
    }

    # 10. Capex Machinery & Tooling Outflow
    capex_cash = net_position - capex_outflow_amount
    capex_scenario = {
        "scenario": "Capex Machinery Acquisition",
        "parameter": f"₹{int(capex_outflow_amount):,} Down-payment",
        "projected_cash": capex_cash,
        "cash_impact": -capex_outflow_amount,
        "liquidity_gap": max(0.0, -capex_cash),
        "risk": classify(capex_cash, max(0.0, -capex_cash)),
        "explanation": "Direct capital expenditure for plant automation and capacity expansion.",
    }

    # 11. Team Payroll Expansion
    payroll_base = recurring * 0.40
    payroll_surge = (payroll_base * payroll_hike_percent) / 100.0
    payroll_cash = current_cash + receivables - (total_expenses + payroll_surge)
    payroll_scenario = {
        "scenario": "Team Payroll Expansion",
        "parameter": f"+{payroll_hike_percent}% Wage / Hiring Surge",
        "projected_cash": payroll_cash,
        "cash_impact": -payroll_surge,
        "liquidity_gap": max(0.0, -payroll_cash),
        "risk": classify(payroll_cash, max(0.0, -payroll_cash)),
        "explanation": f"Payroll increment or new hires add ₹{int(payroll_surge):,} in recurring monthly liabilities.",
    }

    # 12. GST & Tax Settlement
    tax_cash = net_position - tax_outflow_amount
    tax_scenario = {
        "scenario": "GST & Tax Settlement",
        "parameter": f"₹{int(tax_outflow_amount):,} Tax Due",
        "projected_cash": tax_cash,
        "cash_impact": -tax_outflow_amount,
        "liquidity_gap": max(0.0, -tax_cash),
        "risk": classify(tax_cash, max(0.0, -tax_cash)),
        "explanation": f"Statutory GST and Advance Tax settlement requires lump-sum outflow of ₹{int(tax_outflow_amount):,}.",
    }

    # 13. Bank Loan EMI Servicing
    emi_quarterly = loan_emi_amount * 3.0
    loan_cash = net_position - emi_quarterly
    loan_scenario = {
        "scenario": "Bank Loan EMI Servicing",
        "parameter": f"₹{int(loan_emi_amount):,} / mo EMI",
        "projected_cash": loan_cash,
        "cash_impact": -emi_quarterly,
        "liquidity_gap": max(0.0, -loan_cash),
        "risk": classify(loan_cash, max(0.0, -loan_cash)),
        "explanation": f"3 months of principal & interest installments consume ₹{int(emi_quarterly):,}.",
    }

    # 14. Export Bulk Order Working Capital Strain
    export_upfront_cost = (total_expenses * 0.45) * (export_surge_percent / 100.0)
    export_net_cash = net_position - export_upfront_cost
    export_scenario = {
        "scenario": "Export Order Working Capital Strain",
        "parameter": f"+{export_surge_percent}% Order Volume Stretch",
        "projected_cash": export_net_cash,
        "cash_impact": -export_upfront_cost,
        "liquidity_gap": max(0.0, -export_net_cash),
        "risk": classify(export_net_cash, max(0.0, -export_net_cash)),
        "explanation": "High-volume export order requires upfront raw material procurement 60 days before LC payment realization.",
    }

    # 15. Autonomous WhatsApp & Email Cash Recovery (Relief)
    trapped_for_recovery = delayed_amt if delayed_amt > 0 else (receivables * 0.65)
    recovered_cash = (trapped_for_recovery * cash_recovery_percent) / 100.0
    recovery_cash = net_position + recovered_cash
    recovery_scenario = {
        "scenario": "⚡ Autonomous Cash Recovery Blitz",
        "parameter": f"{cash_recovery_percent}% Trapped Cash Recovered",
        "projected_cash": recovery_cash,
        "cash_impact": recovered_cash,
        "liquidity_gap": max(0.0, -recovery_cash),
        "risk": classify(recovery_cash, max(0.0, -recovery_cash)),
        "is_relief": True,
        "explanation": f"Pre-litigation MSME statutory notices recover ₹{int(recovered_cash):,} via WhatsApp & Email dispatch.",
    }

    # 16. TReDS Early Invoice Discounting (Relief)
    treds_vol = (receivables * min(85.0, treds_discount_percent)) / 100.0
    treds_fee = treds_vol * 0.015
    treds_inflow = treds_vol - treds_fee
    treds_cash = current_cash + treds_inflow + (receivables - treds_vol) - total_expenses
    treds_scenario = {
        "scenario": "⚡ TReDS Early Discounting",
        "parameter": f"{treds_discount_percent}% Receivables Discounted",
        "projected_cash": treds_cash,
        "cash_impact": treds_inflow - (receivables * treds_discount_percent / 100.0),
        "liquidity_gap": max(0.0, -treds_cash),
        "risk": classify(treds_cash, max(0.0, -treds_cash)),
        "is_relief": True,
        "explanation": f"Unlocks ₹{int(treds_inflow):,} in instant liquid cash within 24h at 1.5% institutional fee.",
    }

    # 17. Early Supplier Cash Discount (2/10 Net 30 Relief)
    discount_savings = (total_expenses * 0.45) * (supplier_discount_percent / 100.0)
    discount_cash = net_position + discount_savings
    discount_scenario = {
        "scenario": "🤝 Early Supplier Cash Discount (2/10 Net 30)",
        "parameter": f"{supplier_discount_percent}% Prompt Payment Savings",
        "projected_cash": discount_cash,
        "cash_impact": discount_savings,
        "liquidity_gap": max(0.0, -discount_cash),
        "risk": classify(discount_cash, max(0.0, -discount_cash)),
        "is_relief": True,
        "explanation": f"Paying vendors within 10 days captures ₹{int(discount_savings):,} in prompt payment discounts.",
    }

    # 18. Government Subsidy Grant (Relief)
    subsidy_cash = net_position + govt_subsidy_amount
    subsidy_scenario = {
        "scenario": "🇮🇳 Govt MSME Capital Grant",
        "parameter": f"₹{int(govt_subsidy_amount):,} Capital Subsidy",
        "projected_cash": subsidy_cash,
        "cash_impact": govt_subsidy_amount,
        "liquidity_gap": max(0.0, -subsidy_cash),
        "risk": classify(subsidy_cash, max(0.0, -subsidy_cash)),
        "is_relief": True,
        "explanation": f"Non-repayable PMEGP / PM Vishwakarma capital subsidy directly crediting ₹{int(govt_subsidy_amount):,}.",
    }

    # 19. Integrated Combined Reality
    comb_adj_rev = receivables * (1 + revenue_change_percent / 100.0)
    comb_default_loss = (comb_adj_rev * customer_default_percent) / 100.0
    comb_post_default = max(0.0, comb_adj_rev - comb_default_loss)
    comb_trapped = (comb_post_default * delay_pct) / 100.0
    comb_avail_rev = comb_post_default - comb_trapped

    comb_treds_vol = (comb_trapped * min(85.0, treds_discount_percent)) / 100.0
    comb_treds_inflow = comb_treds_vol * 0.985

    comb_general_exp = total_expenses * (1 + expense_change_percent / 100.0)
    comb_raw_material_surge = (total_expenses * 0.45 * raw_material_inflation_percent) / 100.0
    comb_payroll_surge = (recurring * 0.40 * payroll_hike_percent) / 100.0
    comb_expenses = comb_general_exp + comb_raw_material_surge + comb_payroll_surge + emi_quarterly

    combined_cash = (
        current_cash
        + comb_avail_rev
        + comb_treds_inflow
        + recovered_cash
        + discount_savings
        + govt_subsidy_amount
        - comb_expenses
        - tax_outflow_amount
        - sec43b_total_hit
        - repo_quarterly_surge
        - capex_outflow_amount
        - itc_reversal_amount
        - export_upfront_cost
    )

    combined_scenario = {
        "scenario": "Combined Reality",
        "parameter": "All Shocks & Reliefs Integrated",
        "projected_cash": combined_cash,
        "cash_impact": combined_cash - net_position,
        "liquidity_gap": max(0.0, -combined_cash),
        "risk": classify(combined_cash, max(0.0, -combined_cash)),
        "explanation": "Combined multi-factor stress triggers a liquidity deficit. Implement relief levers immediately." if combined_cash <= 0 else "Combined stress absorbed with remaining positive cash buffer.",
    }

    # --------------------------------------
    # Return complete simulation
    # --------------------------------------
    return {
        "base": base,
        "assumptions": {
            "revenue_change_percent": safe_number(revenue_change_percent),
            "expense_change_percent": safe_number(expense_change_percent),
            "payment_delay_days": int(safe_number(payment_delay_days)),
            "customer_default_percent": safe_number(customer_default_percent),
            "raw_material_inflation_percent": safe_number(raw_material_inflation_percent),
            "payroll_hike_percent": safe_number(payroll_hike_percent),
            "tax_outflow_amount": safe_number(tax_outflow_amount),
            "loan_emi_amount": safe_number(loan_emi_amount),
            "treds_discount_percent": safe_number(treds_discount_percent),
            "govt_subsidy_amount": safe_number(govt_subsidy_amount),
            "sec43b_overdue_days": int(safe_number(sec43b_overdue_days)),
            "repo_rate_hike_bps": safe_number(repo_rate_hike_bps),
            "capex_outflow_amount": safe_number(capex_outflow_amount),
            "itc_reversal_amount": safe_number(itc_reversal_amount),
            "cash_recovery_percent": safe_number(cash_recovery_percent),
            "supplier_discount_percent": safe_number(supplier_discount_percent),
            "export_surge_percent": safe_number(export_surge_percent),
        },
        "scenarios": [
            base_scenario,
            combined_scenario,
            revenue_scenario,
            payment_scenario,
            default_scenario,
            raw_mat_scenario,
            sec43b_scenario,
            repo_rate_scenario,
            itc_scenario,
            capex_scenario,
            payroll_scenario,
            tax_scenario,
            loan_scenario,
            expense_scenario,
            export_scenario,
            recovery_scenario,
            treds_scenario,
            discount_scenario,
            subsidy_scenario,
        ],
    }