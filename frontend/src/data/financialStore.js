// ==========================================
// FinTwin Financial Data Store (Clean Slate Ready)
// ==========================================

import {
  cleanBusiness,
  demoPresets,
} from "./sampleData";

import { API_URL } from "../config";

const STORAGE_KEY = "fintwin_live_store_v4";

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Could not load from localStorage:", e);
  }
  return null;
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

const initialSaved = loadFromStorage();

let financialData = initialSaved || {
  business: { ...cleanBusiness },
  customers: [],
  invoices: [],
  payments: [],
  recurringExpenses: [],
  expenses: [],
};

let databaseConnected = false;
const subscribers = new Set();

export function subscribeFinancialData(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function notifySubscribers() {
  saveToStorage(financialData);
  subscribers.forEach((callback) => {
    try {
      callback(getFinancialData());
    } catch (error) {
      console.error("Financial store subscriber error:", error);
    }
  });
}

export function isDatabaseConnected() {
  return databaseConnected;
}

export function getFinancialData() {
  return {
    business: { ...financialData.business },
    customers: [...financialData.customers],
    invoices: [...financialData.invoices],
    payments: [...financialData.payments],
    recurringExpenses: [...financialData.recurringExpenses],
    expenses: [...financialData.expenses],
  };
}

export function getBusiness() {
  return { ...financialData.business };
}

export function getCustomers() {
  return [...financialData.customers];
}

export function getInvoices() {
  return [...financialData.invoices];
}

export function getPayments() {
  return [...financialData.payments];
}

export function getRecurringExpenses() {
  return [...financialData.recurringExpenses];
}

export function getExpenses() {
  return [...financialData.expenses];
}

// ==========================================
// CLEAN SLATE / RESET CONTROLS
// ==========================================

export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}

  financialData = {
    business: { ...cleanBusiness },
    customers: [],
    invoices: [],
    payments: [],
    recurringExpenses: [],
    expenses: [],
  };
  notifySubscribers();
}

export function loadDemoData(presetKey = "BUS-001") {
  const preset = demoPresets[presetKey] || demoPresets["BUS-001"];
  financialData = {
    business: { ...preset.business },
    customers: [...preset.customers],
    invoices: [...preset.invoices],
    payments: [],
    recurringExpenses: [...preset.recurringExpenses],
    expenses: [...preset.expenses],
  };
  notifySubscribers();
}

export function switchBusinessProfile(profileId) {
  if (demoPresets[profileId]) {
    loadDemoData(profileId);
  }
}

export function updateBusinessProfile(updated) {
  financialData.business = {
    ...financialData.business,
    ...updated,
  };
  notifySubscribers();
}

// ==========================================
// INVOICE ACTIONS
// ==========================================

export function createInvoices(newInvoices) {
  const normalized = Array.isArray(newInvoices) ? newInvoices : [newInvoices];
  financialData.invoices = [...normalized, ...financialData.invoices];

  // Auto-register any new customers from uploaded invoices
  normalized.forEach((inv) => {
    if (inv.customer && !financialData.customers.some((c) => c.name === inv.customer)) {
      financialData.customers.push({
        id: inv.customerId || `CUS-${financialData.customers.length + 1}`,
        name: inv.customer,
        industry: "Client Account",
        contactEmail: "",
        creditScore: "Medium Risk",
        paymentTermsDays: 30,
        avgDelayDays: inv.predictedDelayDays || 5,
      });
    }
  });

  notifySubscribers();
}

export function addInvoice(invoice) {
  const newInvoice = {
    id: invoice.id || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: invoice.customerId || `CUS-${financialData.customers.length + 1}`,
    customer: invoice.customer || "General Client",
    amount: Number(invoice.amount) || 0,
    invoiceDate: invoice.invoiceDate || new Date().toISOString().slice(0, 10),
    dueDate: invoice.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    status: invoice.status || "Pending",
    predictedDelayDays: Number(invoice.predictedDelayDays) || 5,
    riskScore: invoice.riskScore || "Medium",
    paymentDate: invoice.status === "Paid" ? new Date().toISOString().slice(0, 10) : null,
    source: invoice.source || "user_upload",
  };

  createInvoices([newInvoice]);
  return newInvoice;
}

export function updateInvoiceStatus(invoiceId, newStatus) {
  financialData.invoices = financialData.invoices.map((inv) => {
    if (inv.id === invoiceId) {
      const isPaid = newStatus === "Paid";
      return {
        ...inv,
        status: newStatus,
        paymentDate: isPaid ? new Date().toISOString().slice(0, 10) : null,
      };
    }
    return inv;
  });
  notifySubscribers();
}

export function deleteInvoice(invoiceId) {
  financialData.invoices = financialData.invoices.filter((i) => i.id !== invoiceId);
  notifySubscribers();
}

// ==========================================
// EXPENSE ACTIONS
// ==========================================

export function addExpense(expense) {
  const isRec = Boolean(expense.recurring);
  if (isRec) {
    const newRec = {
      id: expense.id || `REC-${Math.floor(100 + Math.random() * 900)}`,
      businessId: financialData.business.id,
      category: expense.category || "General",
      description: expense.description || "Recurring Expense",
      amount: Number(expense.amount) || 0,
      frequency: expense.frequency || "Monthly",
      dayOfMonth: Number(expense.dayOfMonth) || 1,
      source: "user_entry",
    };
    financialData.recurringExpenses = [newRec, ...financialData.recurringExpenses];
  } else {
    const newExp = {
      id: expense.id || `EXP-${Math.floor(100 + Math.random() * 900)}`,
      businessId: financialData.business.id,
      category: expense.category || "General",
      description: expense.description || "One-time Expense",
      amount: Number(expense.amount) || 0,
      date: expense.date || new Date().toISOString().slice(0, 10),
      recurring: false,
      source: "user_entry",
    };
    financialData.expenses = [newExp, ...financialData.expenses];
  }
  notifySubscribers();
}

export function deleteExpense(id, isRecurring = false) {
  if (isRecurring) {
    financialData.recurringExpenses = financialData.recurringExpenses.filter((e) => e.id !== id);
  } else {
    financialData.expenses = financialData.expenses.filter((e) => e.id !== id);
  }
  notifySubscribers();
}

// ==========================================
// CUSTOMER ACTIONS
// ==========================================

export function addCustomer(customer) {
  const newCus = {
    id: customer.id || `CUS-${financialData.customers.length + 1}`,
    name: customer.name || "New Client",
    industry: customer.industry || "General Industry",
    contactEmail: customer.contactEmail || "",
    creditScore: customer.creditScore || "Medium Risk",
    paymentTermsDays: Number(customer.paymentTermsDays) || 30,
    avgDelayDays: Number(customer.avgDelayDays) || 0,
  };
  financialData.customers = [...financialData.customers, newCus];
  notifySubscribers();
  return newCus;
}

export function updateCustomer(customerId, updatedFields) {
  financialData.customers = financialData.customers.map((c) =>
    c.id === customerId ? { ...c, ...updatedFields } : c
  );
  notifySubscribers();
}

// ==========================================
// REMOTE DATABASE SYNC (SAFE FALLBACK)
// ==========================================

export async function loadFinancialData() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      databaseConnected = true;
      try {
        const [bizRes, custRes, invRes] = await Promise.all([
          fetch(`${API_URL}/api/business`),
          fetch(`${API_URL}/api/customers`),
          fetch(`${API_URL}/api/invoices`),
        ]);
        if (bizRes.ok) {
          const biz = await bizRes.json();
          if (biz && biz.name) financialData.business = { ...financialData.business, ...biz };
        }
        if (custRes.ok) {
          const cust = await custRes.json();
          if (Array.isArray(cust) && cust.length > 0) financialData.customers = cust;
        }
        if (invRes.ok) {
          const inv = await invRes.json();
          if (Array.isArray(inv) && inv.length > 0) financialData.invoices = inv;
        }
      } catch (err) {
        console.warn("Partial sync:", err);
      }
    } else {
      databaseConnected = false;
    }
  } catch (error) {
    databaseConnected = false;
  }
  notifySubscribers();
  return financialData;
}