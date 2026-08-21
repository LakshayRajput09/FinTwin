// ==========================================
// FinTwin Financial Store
// ==========================================
//
// Central data layer for the application.
//
// Database-backed version.
//
// Data flow:
//
// React
//   ↓
// financialStore
//   ↓
// FastAPI
//   ↓
// PostgreSQL
//
// sampleData is kept only as a local fallback
// if the API cannot be reached.
//
// ==========================================

import {
  business as sampleBusiness,
  customers as sampleCustomers,
  invoices as sampleInvoices,
  payments as samplePayments,
  recurringExpenses as sampleRecurringExpenses,
  expenses as sampleExpenses,
} from "./sampleData";

import { API_URL } from "../config";


// ==========================================
// INTERNAL STATE
// ==========================================

let financialData = {
  business: {
    ...sampleBusiness,
  },

  customers: [
    ...sampleCustomers,
  ],

  invoices: [
    ...sampleInvoices,
  ],

  payments: [
    ...samplePayments,
  ],

  recurringExpenses: [
    ...sampleRecurringExpenses,
  ],

  expenses: [
    ...sampleExpenses,
  ],
};


// ==========================================
// DATABASE STATUS
// ==========================================

let databaseConnected = false;


// ==========================================
// GET DATABASE STATUS
// ==========================================

export function isDatabaseConnected() {
  return databaseConnected;
}


// ==========================================
// LOAD DATA FROM DATABASE
// ==========================================
//
// This function retrieves all financial data
// from PostgreSQL through FastAPI.
//
// ==========================================

export async function loadFinancialData() {

  try {

    const [
      businessResponse,
      customersResponse,
      invoicesResponse,
      paymentsResponse,
      expensesResponse,
      recurringExpensesResponse,
    ] = await Promise.all([

      fetch(
        `${API_URL}/api/business`
      ),

      fetch(
        `${API_URL}/api/customers`
      ),

      fetch(
        `${API_URL}/api/invoices`
      ),

      fetch(
        `${API_URL}/api/payments`
      ),

      fetch(
        `${API_URL}/api/expenses`
      ),

      fetch(
        `${API_URL}/api/recurring-expenses`
      ),
    ]);


    // ==========================================
    // CHECK RESPONSES
    // ==========================================

    if (
      !businessResponse.ok ||
      !customersResponse.ok ||
      !invoicesResponse.ok ||
      !paymentsResponse.ok ||
      !expensesResponse.ok ||
      !recurringExpensesResponse.ok
    ) {
      throw new Error(
        "Database API request failed"
      );
    }


    // ==========================================
    // READ JSON
    // ==========================================

    const [
      businessData,
      customersData,
      invoicesData,
      paymentsData,
      expensesData,
      recurringExpensesData,
    ] = await Promise.all([

      businessResponse.json(),

      customersResponse.json(),

      invoicesResponse.json(),

      paymentsResponse.json(),

      expensesResponse.json(),

      recurringExpensesResponse.json(),
    ]);


    // ==========================================
    // UPDATE INTERNAL STATE
    // ==========================================

    if (
      businessData.success &&
      businessData.business
    ) {
      financialData.business =
        businessData.business;
    }


    if (
      customersData.success &&
      Array.isArray(
        customersData.customers
      )
    ) {
      financialData.customers =
        customersData.customers;
    }


    if (
      invoicesData.success &&
      Array.isArray(
        invoicesData.invoices
      )
    ) {
      financialData.invoices =
        invoicesData.invoices;
    }


    if (
      paymentsData.success &&
      Array.isArray(
        paymentsData.payments
      )
    ) {
      financialData.payments =
        paymentsData.payments;
    }


    if (
      expensesData.success &&
      Array.isArray(
        expensesData.expenses
      )
    ) {
      financialData.expenses =
        expensesData.expenses;
    }


    if (
      recurringExpensesData.success &&
      Array.isArray(
        recurringExpensesData.recurringExpenses
      )
    ) {
      financialData.recurringExpenses =
        recurringExpensesData.recurringExpenses;
    }


    databaseConnected = true;

    console.log(
      "FinTwin database connected successfully."
    );


    return getFinancialData();

  } catch (error) {

    databaseConnected = false;

    console.error(
      "FinTwin database connection failed:",
      error
    );

    console.warn(
      "Using local sample data fallback."
    );


    return getFinancialData();
  }
}


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


// ==========================================
// ADD INVOICE
// ==========================================
//
// NOTE:
// This still updates local state for now.
//
// Database POST endpoint will be added
// in the next migration step.
// ==========================================

export function addInvoice(invoice) {

  financialData.invoices.push({

    ...invoice,

    source:
      invoice.source ||
      "manual",
  });
}


// ==========================================
// ADD MULTIPLE INVOICES
// ==========================================

export function addInvoices(
  newInvoices
) {

  newInvoices.forEach(
    (invoice) => {

      addInvoice(invoice);

    }
  );
}


// ==========================================
// REPLACE INVOICES
// ==========================================

export function replaceInvoices(
  newInvoices
) {

  financialData.invoices =
    newInvoices.map(
      (invoice) => ({

        ...invoice,

        source:
          invoice.source ||
          "csv",
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


// ==========================================
// ADD CUSTOMER
// ==========================================

export function addCustomer(
  customer
) {

  financialData.customers.push({

    ...customer,

    source:
      customer.source ||
      "manual",
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


// ==========================================
// ADD PAYMENT
// ==========================================

export function addPayment(
  payment
) {

  financialData.payments.push({

    ...payment,

    source:
      payment.source ||
      "manual",
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


// ==========================================
// RECURRING EXPENSES
// ==========================================

export function getRecurringExpenses() {

  return [
    ...financialData.recurringExpenses,
  ];
}


// ==========================================
// ADD EXPENSE
// ==========================================

export function addExpense(
  expense
) {

  financialData.expenses.push({

    ...expense,

    source:
      expense.source ||
      "manual",
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
// TOTAL RECEIVABLES
// ==========================================

export function getTotalReceivables() {

  return financialData.invoices

    .filter(
      (invoice) =>
        invoice.status !== "Paid"
    )

    .reduce(
      (
        total,
        invoice
      ) =>
        total +
        Number(
          invoice.amount || 0
        ),

      0
    );
}


// ==========================================
// TOTAL REVENUE
// ==========================================

export function getTotalRevenue() {

  return financialData.invoices

    .reduce(
      (
        total,
        invoice
      ) =>
        total +
        Number(
          invoice.amount || 0
        ),

      0
    );
}


// ==========================================
// TOTAL EXPENSES
// ==========================================

export function getTotalExpenses() {

  const recurringTotal =
    financialData.recurringExpenses

      .reduce(
        (
          total,
          expense
        ) =>
          total +
          Number(
            expense.amount || 0
          ),

        0
      );


  const oneTimeTotal =
    financialData.expenses

      .reduce(
        (
          total,
          expense
        ) =>
          total +
          Number(
            expense.amount || 0
          ),

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

export function resetFinancialData() {

  financialData = {

    business: {
      ...sampleBusiness,
    },

    customers: [
      ...sampleCustomers,
    ],

    invoices: [
      ...sampleInvoices,
    ],

    payments: [
      ...samplePayments,
    ],

    recurringExpenses: [
      ...sampleRecurringExpenses,
    ],

    expenses: [
      ...sampleExpenses,
    ],
  };


  databaseConnected = false;
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
        record.source ||
        "unknown";


      sources[source] =
        (
          sources[source] ||
          0
        ) + 1;

    }
  );


  return sources;
}