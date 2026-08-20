// ==========================================
// FinTwin Digital Twin Engine
// ==========================================
//
// Converts raw financial data into a
// business-level financial picture.
//
// This is the first version of the
// Digital Twin calculation layer.
//
// Future versions can add:
// - ML forecasting
// - Customer payment probability
// - GST data
// - Account Aggregator data
// - Seasonal patterns
// ==========================================


import {
  getBusiness,
  getInvoices,
  getPayments,
  getExpenses,
  getRecurringExpenses,
}from "../data/financialStore";


// ==========================================
// CURRENT CASH POSITION
// ==========================================

export function calculateCurrentCash() {
  const business = getBusiness();

  return Number(
    business.openingCash || 0
  );
}


// ==========================================
// TOTAL RECEIVABLES
// ==========================================

export function calculateReceivables() {
  const invoices = getInvoices();

  return invoices
    .filter(
      (invoice) =>
        invoice.status !== "Paid"
    )
    .reduce(
      (total, invoice) =>
        total +
        Number(invoice.amount || 0),
      0
    );
}


// ==========================================
// TOTAL REVENUE
// ==========================================

export function calculateRevenue() {
  const invoices = getInvoices();

  return invoices.reduce(
    (total, invoice) =>
      total +
      Number(invoice.amount || 0),
    0
  );
}


// ==========================================
// MONTHLY RECURRING EXPENSES
// ==========================================

export function calculateRecurringExpenses() {
  const expenses =
    getRecurringExpenses();

  return expenses.reduce(
    (total, expense) =>
      total +
      Number(expense.amount || 0),
    0
  );
}


// ==========================================
// ONE-TIME EXPENSES
// ==========================================

export function calculateOneTimeExpenses() {
  const expenses =
    getExpenses();

  return expenses.reduce(
    (total, expense) =>
      total +
      Number(expense.amount || 0),
    0
  );
}


// ==========================================
// TOTAL EXPENSES
// ==========================================

export function calculateTotalExpenses() {

  const recurring =
    calculateRecurringExpenses();

  const oneTime =
    calculateOneTimeExpenses();

  return recurring + oneTime;
}


// ==========================================
// PROJECTED CASH POSITION
// ==========================================
//
// Basic model:
//
// Current Cash
// + Expected Receivables
// - Expected Expenses
//
// ==========================================

export function calculateProjectedCash() {

  const currentCash =
    calculateCurrentCash();

  const receivables =
    calculateReceivables();

  const expenses =
    calculateTotalExpenses();

  return (
    currentCash +
    receivables -
    expenses
  );
}


// ==========================================
// NET CASH FLOW
// ==========================================

export function calculateNetCashFlow() {

  const revenue =
    calculateRevenue();

  const expenses =
    calculateTotalExpenses();

  return revenue - expenses;
}


// ==========================================
// LIQUIDITY GAP
// ==========================================
//
// If projected cash becomes negative,
// we have a liquidity gap.
//
// ==========================================

export function calculateLiquidityGap() {

  const projectedCash =
    calculateProjectedCash();

  if (projectedCash >= 0) {
    return 0;
  }

  return Math.abs(
    projectedCash
  );
}


// ==========================================
// FINANCIAL HEALTH SCORE
// ==========================================
//
// Prototype scoring model.
//
// This is NOT a credit score.
// It is an internal financial-health
// indicator for the business owner.
//
// ==========================================

export function calculateHealthScore() {

  let score = 100;


  // ------------------------------
  // Receivables concentration
  // ------------------------------

  const concentration =
    calculateCustomerConcentration();

  if (concentration > 0.6) {
    score -= 20;
  } else if (
    concentration > 0.4
  ) {
    score -= 10;
  }


  // ------------------------------
  // Liquidity
  // ------------------------------

  const gap =
    calculateLiquidityGap();

  if (gap > 0) {
    score -= 25;
  }


  // ------------------------------
  // Payment delays
  // ------------------------------

  const averageDelay =
    calculateAveragePaymentDelay();

  if (averageDelay > 30) {
    score -= 20;
  } else if (
    averageDelay > 15
  ) {
    score -= 10;
  }


  return Math.max(
    0,
    Math.min(100, score)
  );
}


// ==========================================
// CUSTOMER CONCENTRATION
// ==========================================
//
// Returns the largest customer's share
// of total outstanding receivables.
//
// Example:
//
// Customer A = ₹10L
// Total = ₹17L
//
// Concentration = 58.8%
//
// ==========================================

export function calculateCustomerConcentration() {

  const invoices =
    getInvoices().filter(
      (invoice) =>
        invoice.status !== "Paid"
    );


  const total =
    invoices.reduce(
      (sum, invoice) =>
        sum +
        Number(invoice.amount || 0),
      0
    );


  if (total === 0) {
    return 0;
  }


  const customerTotals = {};


  invoices.forEach(
    (invoice) => {

      const customer =
        invoice.customer ||
        "Unknown";

      customerTotals[customer] =
        (customerTotals[customer] || 0) +
        Number(invoice.amount || 0);

    }
  );


  const largest =
    Math.max(
      ...Object.values(
        customerTotals
      )
    );


  return largest / total;
}


// ==========================================
// AVERAGE PAYMENT DELAY
// ==========================================

export function calculateAveragePaymentDelay() {

  const payments =
    getPayments();


  if (!payments.length) {
    return 0;
  }


  const totalDelay =
    payments.reduce(
      (total, payment) =>
        total +
        Number(
          payment.daysDelayed || 0
        ),
      0
    );


  return (
    totalDelay /
    payments.length
  );
}


// ==========================================
// CASH FLOW SUMMARY
// ==========================================

export function getCashFlowSummary() {

  const currentCash =
    calculateCurrentCash();

  const receivables =
    calculateReceivables();

  const expenses =
    calculateTotalExpenses();

  const projectedCash =
    calculateProjectedCash();

  const netCashFlow =
    calculateNetCashFlow();

  const liquidityGap =
    calculateLiquidityGap();


  return {

    currentCash,

    receivables,

    expenses,

    projectedCash,

    netCashFlow,

    liquidityGap,

    hasLiquidityGap:
      liquidityGap > 0,

  };
}


// ==========================================
// RISK SUMMARY
// ==========================================

export function getRiskSummary() {

  const concentration =
    calculateCustomerConcentration();

  const averageDelay =
    calculateAveragePaymentDelay();

  let concentrationRisk =
    "LOW";

  let delayRisk =
    "LOW";


  if (concentration > 0.6) {
    concentrationRisk =
      "HIGH";
  } else if (
    concentration > 0.4
  ) {
    concentrationRisk =
      "MEDIUM";
  }


  if (averageDelay > 30) {
    delayRisk =
      "HIGH";
  } else if (
    averageDelay > 15
  ) {
    delayRisk =
      "MEDIUM";
  }


  return {

    concentration:
      concentration * 100,

    concentrationRisk,

    averageDelay,

    delayRisk,

  };
}


// ==========================================
// COMPLETE DIGITAL TWIN
// ==========================================

export function getDigitalTwin() {

  const cashFlow =
    getCashFlowSummary();

  const risk =
    getRiskSummary();

  const healthScore =
    calculateHealthScore();


  return {

    cashFlow,

    risk,

    healthScore,

    generatedAt:
      new Date().toISOString(),

  };
}