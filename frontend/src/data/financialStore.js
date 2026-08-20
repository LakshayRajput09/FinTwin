// ==========================================
// FinTwin Financial Store
// ==========================================
//
// Central data layer for the application.
//
// IMPORTANT:
// Pages and components should eventually
// access financial information through this
// store instead of keeping separate copies.
//
// Future sources:
// - CSV / Excel
// - GST / e-Invoice
// - RBI Account Aggregator
// - Manual entries
// ==========================================

import {
  business,
  customers,
  invoices,
  payments,
  recurringExpenses,
  expenses,
} from "./sampleData";


// ==========================================
// INTERNAL STATE
// ==========================================

let financialData = {
  business: { ...business },

  customers: [...customers],

  invoices: [...invoices],

  payments: [...payments],

  recurringExpenses: [
    ...recurringExpenses,
  ],

  expenses: [...expenses],
};


// ==========================================
// GET COMPLETE DATA
// ==========================================

export function getFinancialData() {
  return {
    ...financialData,

    customers: [
      ...financialData.customers,
    ],

    invoices: [
      ...financialData.invoices,
    ],

    payments: [
      ...financialData.payments,
    ],

    recurringExpenses: [
      ...financialData.recurringExpenses,
    ],

    expenses: [
      ...financialData.expenses,
    ],
  };
}


// ==========================================
// BUSINESS
// ==========================================

export function getBusiness() {
  return {
    ...financialData.business,
  };
}


// ==========================================
// INVOICES
// ==========================================

export function getInvoices() {
  return [
    ...financialData.invoices,
  ];
}


export function addInvoice(invoice) {
  financialData.invoices.push({
    ...invoice,

    source:
      invoice.source || "manual",
  });
}


export function addInvoices(newInvoices) {
  newInvoices.forEach(
    (invoice) => {
      addInvoice(invoice);
    }
  );
}
// ==========================================
// REPLACE INVOICES
// ==========================================

export function replaceInvoices(newInvoices) {
  financialData.invoices = newInvoices.map(
    (invoice) => ({
      ...invoice,
      source:
        invoice.source || "csv",
    })
  );
}


// ==========================================
// CUSTOMERS
// ==========================================

export function getCustomers() {
  return [
    ...financialData.customers,
  ];
}


export function addCustomer(customer) {
  financialData.customers.push({
    ...customer,

    source:
      customer.source || "manual",
  });
}


// ==========================================
// PAYMENTS
// ==========================================

export function getPayments() {
  return [
    ...financialData.payments,
  ];
}


export function addPayment(payment) {
  financialData.payments.push({
    ...payment,

    source:
      payment.source || "manual",
  });
}


// ==========================================
// EXPENSES
// ==========================================

export function getExpenses() {
  return [
    ...financialData.expenses,
  ];
}


export function getRecurringExpenses() {
  return [
    ...financialData.recurringExpenses,
  ];
}


export function addExpense(expense) {
  financialData.expenses.push({
    ...expense,

    source:
      expense.source || "manual",
  });
}


// ==========================================
// UPDATE INVOICE
// ==========================================

export function updateInvoice(
  invoiceId,
  updates
) {
  financialData.invoices =
    financialData.invoices.map(
      (invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              ...updates,
            }
          : invoice
    );
}


// ==========================================
// REMOVE INVOICE
// ==========================================

export function removeInvoice(
  invoiceId
) {
  financialData.invoices =
    financialData.invoices.filter(
      (invoice) =>
        invoice.id !== invoiceId
    );
}


// ==========================================
// CALCULATE TOTAL RECEIVABLES
// ==========================================

export function getTotalReceivables() {
  return financialData.invoices
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
// CALCULATE TOTAL REVENUE
// ==========================================

export function getTotalRevenue() {
  return financialData.invoices.reduce(
    (total, invoice) =>
      total +
      Number(invoice.amount || 0),
    0
  );
}


// ==========================================
// CALCULATE TOTAL EXPENSES
// ==========================================

export function getTotalExpenses() {

  const recurringTotal =
    financialData.recurringExpenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
      0
    );

  const oneTimeTotal =
    financialData.expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount || 0),
      0
    );

  return (
    recurringTotal +
    oneTimeTotal
  );
}


// ==========================================
// RESET DATA
// ==========================================
//
// Useful for development/testing.
// ==========================================

export function resetFinancialData() {
  financialData = {
    business: { ...business },

    customers: [...customers],

    invoices: [...invoices],

    payments: [...payments],

    recurringExpenses: [
      ...recurringExpenses,
    ],

    expenses: [...expenses],
  };
}


// ==========================================
// DATA SOURCE SUMMARY
// ==========================================

export function getDataSources() {

  const allRecords = [
    ...financialData.invoices,
    ...financialData.payments,
    ...financialData.expenses,
    ...financialData.recurringExpenses,
  ];

  const sources = {};

  allRecords.forEach(
    (record) => {

      const source =
        record.source || "unknown";

      sources[source] =
        (sources[source] || 0) + 1;
    }
  );

  return sources;
}