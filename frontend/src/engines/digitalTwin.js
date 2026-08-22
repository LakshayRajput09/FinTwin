// ==========================================
// FinTwin Digital Twin Engine & Analytics Layer
// ==========================================

import {
  getBusiness,
  getInvoices,
  getPayments,
  getExpenses,
  getRecurringExpenses,
} from "../data/financialStore";

// ==========================================
// CURRENT CASH POSITION
// ==========================================

export function calculateCurrentCash() {
  const business = getBusiness();
  return Number(business.openingCash || 0);
}

// ==========================================
// TOTAL RECEIVABLES & AGING
// ==========================================

export function calculateReceivables() {
  const invoices = getInvoices();
  return invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
}

export function calculateAgingBreakdown() {
  const invoices = getInvoices().filter((inv) => inv.status !== "Paid");
  const now = new Date();

  let b0_30 = 0;
  let b31_60 = 0;
  let b61_90 = 0;
  let b90_plus = 0;

  invoices.forEach((inv) => {
    const due = new Date(inv.dueDate || now);
    const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    const amt = Number(inv.amount || 0);

    if (diffDays <= 30) {
      b0_30 += amt;
    } else if (diffDays <= 60) {
      b31_60 += amt;
    } else if (diffDays <= 90) {
      b61_90 += amt;
    } else {
      b90_plus += amt;
    }
  });

  return {
    "0-30 Days": b0_30,
    "31-60 Days": b31_60,
    "61-90 Days": b61_90,
    "90+ Days": b90_plus,
    total: b0_30 + b31_60 + b61_90 + b90_plus,
  };
}

// ==========================================
// TOTAL REVENUE
// ==========================================

export function calculateRevenue() {
  const invoices = getInvoices();
  return invoices.reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
}

// ==========================================
// EXPENSE METRICS
// ==========================================

export function calculateRecurringExpenses() {
  const expenses = getRecurringExpenses();
  return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
}

export function calculateOneTimeExpenses() {
  const expenses = getExpenses();
  return expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
}

export function calculateTotalMonthlyBurn() {
  const recurring = calculateRecurringExpenses();
  const oneTime = calculateOneTimeExpenses();
  return recurring + Math.round(oneTime / 2);
}

// ==========================================
// DAYS SALES OUTSTANDING (DSO) & HEALTH METRICS
// ==========================================

export function calculateDSO() {
  const receivables = calculateReceivables();
  const revenue = calculateRevenue();
  if (revenue <= 0) return 0;
  return Math.round((receivables / revenue) * 90);
}

export function calculateRunwayDays() {
  const cash = calculateCurrentCash();
  const monthlyBurn = calculateTotalMonthlyBurn();
  if (monthlyBurn <= 0) {
    return cash > 0 ? 180 : 0;
  }
  const dailyBurn = monthlyBurn / 30;
  return Math.max(0, Math.round(cash / dailyBurn));
}

export function calculateWorkingCapitalRatio() {
  const cash = calculateCurrentCash();
  const receivables = calculateReceivables();
  const monthlyBurn = calculateTotalMonthlyBurn();
  const currentAssets = cash + receivables;
  const currentLiabilities = monthlyBurn;
  if (currentLiabilities <= 0) return currentAssets > 0 ? 3.0 : 0.0;
  return Number((currentAssets / currentLiabilities).toFixed(2));
}

// ==========================================
// COMPREHENSIVE CASH FLOW SUMMARY
// ==========================================

export function getCashFlowSummary() {
  const currentCash = calculateCurrentCash();
  const receivables = calculateReceivables();
  const recurringExpenses = calculateRecurringExpenses();
  const oneTimeExpenses = calculateOneTimeExpenses();
  const totalExpenses = recurringExpenses + oneTimeExpenses;
  const projectedCash = currentCash + receivables - totalExpenses;
  const runwayDays = calculateRunwayDays();
  const dso = calculateDSO();
  const workingCapitalRatio = calculateWorkingCapitalRatio();

  let status = "Awaiting Data";
  if (currentCash > 0 || receivables > 0 || totalExpenses > 0) {
    status = projectedCash >= 300000 ? "Healthy" : projectedCash >= 0 ? "Moderate" : "Critical Deficit";
  }

  return {
    currentCash,
    receivables,
    recurringExpenses,
    oneTimeExpenses,
    totalExpenses,
    projectedCash,
    runwayDays,
    dso,
    workingCapitalRatio,
    netChange: projectedCash - currentCash,
    status,
  };
}

// ==========================================
// LOCAL AI 90-DAY FORECAST ENGINE
// ==========================================

export function generateLocalForecast(days = 90) {
  const currentCash = calculateCurrentCash();
  const monthlyBurn = calculateTotalMonthlyBurn();
  const dailyBurn = monthlyBurn / 30;
  const revenue = calculateRevenue();

  const timeline = [];
  const step = 5;
  let breachDay = null;

  for (let d = 0; d <= days; d += step) {
    const dailyInflowExpected = revenue > 0 ? (d / 30) * (revenue / 3) : 0;
    const dailyInflowWorst = dailyInflowExpected * 0.7;
    const dailyInflowBest = dailyInflowExpected * 1.25;

    const cumulativeBurn = dailyBurn * d;

    const expectedVal = Math.round(currentCash + dailyInflowExpected - cumulativeBurn);
    const worstVal = Math.round(currentCash + dailyInflowWorst - cumulativeBurn * 1.15);
    const bestVal = Math.round(currentCash + dailyInflowBest - cumulativeBurn * 0.9);

    if (worstVal < 0 && breachDay === null && currentCash > 0) {
      breachDay = d;
    }

    timeline.push({
      day: `Day ${d}`,
      dayNum: d,
      expected: expectedVal,
      worstCase: worstVal,
      bestCase: bestVal,
      burnRate: Math.round(cumulativeBurn),
    });
  }

  return {
    timeline,
    initialCash: currentCash,
    lowestProjectedCash: Math.min(...timeline.map((t) => t.worstCase)),
    breachDay: breachDay ? `Day ${breachDay}` : currentCash > 0 ? "No breach (Safe)" : "N/A",
    recommendation:
      currentCash === 0 && revenue === 0
        ? "Upload your invoices (CSV/Excel/PDF/JSON) or set opening cash to generate live predictive runway."
        : breachDay && breachDay <= 45
        ? "Early warning: Consider invoice discounting or short-term credit line to avoid liquidity crunch."
        : "Liquidity stable: Cash reserves remain above minimum safety threshold.",
  };
}

// ==========================================
// SHOCK SIMULATOR CALCULATION
// ==========================================

export function calculateShockSimulation({
  revenueChangePercent = 0,
  expenseChangePercent = 0,
  paymentDelayDays = 0,
}) {
  const base = getCashFlowSummary();
  const baseRevenue = calculateRevenue();
  const baseExpense = calculateTotalMonthlyBurn();

  const adjustedRevenue = baseRevenue * (1 + revenueChangePercent / 100);
  const adjustedExpense = baseExpense * (1 + expenseChangePercent / 100);
  const adjustedDelayImpact = base.receivables * (paymentDelayDays / 60);

  const stressedProjectedCash = Math.round(
    base.currentCash + (adjustedRevenue * 0.8) - adjustedExpense - adjustedDelayImpact
  );

  const stressedRunway = adjustedExpense > 0
    ? Math.max(0, Math.round((base.currentCash / (adjustedExpense / 30))))
    : base.currentCash > 0 ? 120 : 0;

  const runwayDiff = stressedRunway - base.runwayDays;

  return {
    baselineCash: base.projectedCash,
    stressedCash: stressedProjectedCash,
    cashVariance: stressedProjectedCash - base.projectedCash,
    baselineRunway: base.runwayDays,
    stressedRunway,
    runwayDiff,
    riskLevel:
      base.currentCash === 0 && baseRevenue === 0
        ? "Awaiting Data"
        : stressedProjectedCash < 0
        ? "Critical Deficit"
        : stressedProjectedCash < 200000
        ? "High Warning"
        : "Manageable",
  };
}