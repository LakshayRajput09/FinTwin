// ==========================================
// FinTwin Financial Data Store (User-Linked & Backend Synced)
// ==========================================

import { cleanBusiness } from "./sampleData";
import { API_URL } from "../config";

let activeUserId = null;
let activeBusinessId = null;

export const initialVendors = [
  {
    id: "VEN-001",
    name: "Tata Steel Alloys Ltd",
    category: "Raw Materials",
    gstin: "27AAACT2727Q1ZW",
    isMsmeRegistered: true,
    msmeRegNo: "UDYAM-MH-01-0023412",
    contactPerson: "Rajesh Sharma",
    phone: "+91 98201 44521",
    email: "supplies@tatasteel.com",
    paymentTermsDays: 30,
    earlyDiscountPercent: 2,
    earlyDiscountDays: 10,
    reliabilityScore: 96,
  },
  {
    id: "VEN-002",
    name: "Apex Precision Tools & Dies",
    category: "Tooling & Spares",
    gstin: "29AABCA9876C1Z3",
    isMsmeRegistered: true,
    msmeRegNo: "UDYAM-KR-03-0098124",
    contactPerson: "Kavita Rao",
    phone: "+91 98450 11234",
    email: "orders@apextools.in",
    paymentTermsDays: 45,
    earlyDiscountPercent: 1.5,
    earlyDiscountDays: 7,
    reliabilityScore: 92,
  },
  {
    id: "VEN-003",
    name: "National Logistics & Freight",
    category: "Logistics & Freight",
    gstin: "07AAACN4431D1ZO",
    isMsmeRegistered: false,
    msmeRegNo: "",
    contactPerson: "Harpreet Singh",
    phone: "+91 98110 55678",
    email: "billing@nationallogistics.com",
    paymentTermsDays: 15,
    earlyDiscountPercent: 0,
    earlyDiscountDays: 0,
    reliabilityScore: 88,
  },
];

export const initialPurchaseOrders = [
  {
    id: "PO-2026-001",
    vendorId: "VEN-001",
    vendorName: "Tata Steel Alloys Ltd",
    itemDescription: "Hot Rolled Steel Coils (Grade IS 2062 - 12 Tons)",
    orderDate: "2026-08-10",
    deliveryDate: "2026-08-25",
    amount: 680000,
    status: "Delivered",
    paymentStatus: "Pending",
    invoiceNumber: "TSA/26/884",
    invoiceDate: "2026-08-15",
    dueDate: "2026-09-14",
    isMsme43BhApplicable: true,
    earlyDiscountEligible: true,
  },
  {
    id: "PO-2026-002",
    vendorId: "VEN-002",
    vendorName: "Apex Precision Tools & Dies",
    itemDescription: "Carbide End Mills & CNC Tooling Insert Sets",
    orderDate: "2026-08-18",
    deliveryDate: "2026-08-28",
    amount: 145000,
    status: "In Transit",
    paymentStatus: "Pending",
    invoiceNumber: "APT/802",
    invoiceDate: "2026-08-22",
    dueDate: "2026-10-06",
    isMsme43BhApplicable: true,
    earlyDiscountEligible: true,
  },
  {
    id: "PO-2026-003",
    vendorId: "VEN-003",
    vendorName: "National Logistics & Freight",
    itemDescription: "Interstate Freight Dispatch to Pune & Bengaluru Depots",
    orderDate: "2026-08-20",
    deliveryDate: "2026-08-24",
    amount: 54000,
    status: "Delivered",
    paymentStatus: "Paid",
    invoiceNumber: "NL/26/512",
    invoiceDate: "2026-08-20",
    dueDate: "2026-09-04",
    isMsme43BhApplicable: false,
    earlyDiscountEligible: false,
  },
];

export const initialCustomers = [
  {
    id: "CUS-001",
    name: "Auto Corp Ltd",
    industry: "Automotive OEM",
    phone: "+91 98201 55678",
    contactEmail: "finance@autocorp.in",
    contactPerson: "Rajeev Mehra (Finance Controller)",
    creditScore: "High Risk",
    paymentTermsDays: 30,
    avgDelayDays: 22,
  },
  {
    id: "CUS-002",
    name: "Metro Retail Distribution",
    industry: "Retail & FMCG",
    phone: "+91 98450 22331",
    contactEmail: "ap@metroretail.com",
    contactPerson: "Sunita Verma (Accounts Payable)",
    creditScore: "Medium Risk",
    paymentTermsDays: 30,
    avgDelayDays: 14,
  },
  {
    id: "CUS-003",
    name: "Paramount Precision Engineering",
    industry: "Industrial Machinery",
    phone: "+91 98110 99882",
    contactEmail: "accounts@paramount.com",
    contactPerson: "Kunal Ghosh (CFO)",
    creditScore: "High Risk",
    paymentTermsDays: 45,
    avgDelayDays: 28,
  },
  {
    id: "CUS-004",
    name: "Apex Infrastructure & Projects",
    industry: "Infrastructure",
    phone: "+91 98332 11440",
    contactEmail: "billing@apexinfra.org",
    contactPerson: "Anil Sharma (Accounts Head)",
    creditScore: "Low Risk",
    paymentTermsDays: 45,
    avgDelayDays: 4,
  },
];

export const initialInvoices = [
  {
    id: "INV-1001",
    customerId: "CUS-001",
    customer: "Auto Corp Ltd",
    phone: "+91 98201 55678",
    email: "finance@autocorp.in",
    amount: 350000,
    invoiceDate: "2026-07-15",
    dueDate: "2026-08-15",
    status: "Overdue",
    predictedDelayDays: 22,
    riskScore: "High",
  },
  {
    id: "INV-1002",
    customerId: "CUS-002",
    customer: "Metro Retail Distribution",
    phone: "+91 98450 22331",
    email: "ap@metroretail.com",
    amount: 180000,
    invoiceDate: "2026-07-28",
    dueDate: "2026-08-28",
    status: "Overdue",
    predictedDelayDays: 14,
    riskScore: "Medium",
  },
  {
    id: "INV-1003",
    customerId: "CUS-003",
    customer: "Paramount Precision Engineering",
    phone: "+91 98110 99882",
    email: "accounts@paramount.com",
    amount: 540000,
    invoiceDate: "2026-07-05",
    dueDate: "2026-08-05",
    status: "Overdue",
    predictedDelayDays: 28,
    riskScore: "High",
  },
  {
    id: "INV-1004",
    customerId: "CUS-004",
    customer: "Apex Infrastructure & Projects",
    phone: "+91 98332 11440",
    email: "billing@apexinfra.org",
    amount: 420000,
    invoiceDate: "2026-08-10",
    dueDate: "2026-09-10",
    status: "Pending",
    predictedDelayDays: 4,
    riskScore: "Low",
  },
  {
    id: "INV-1005",
    customerId: "CUS-004",
    customer: "Apex Infrastructure & Projects",
    phone: "+91 98332 11440",
    email: "billing@apexinfra.org",
    amount: 290000,
    invoiceDate: "2026-06-20",
    dueDate: "2026-07-20",
    status: "Paid",
    predictedDelayDays: 2,
    riskScore: "Low",
    paymentDate: "2026-07-22",
  },
];

export const initialPayments = [
  {
    id: "PAY-1001",
    invoiceId: "INV-1005",
    customerId: "CUS-004",
    customer: "Apex Infrastructure & Projects",
    amount: 290000,
    expectedDate: "2026-07-20",
    actualDate: "2026-07-22",
    daysDelayed: 2,
    source: "HDFC Bank IMPS",
  },
  {
    id: "PAY-1002",
    invoiceId: "INV-1004",
    customerId: "CUS-004",
    customer: "Apex Infrastructure & Projects",
    amount: 150000,
    expectedDate: "2026-08-01",
    actualDate: "2026-08-01",
    daysDelayed: 0,
    source: "ICICI Netbanking",
  },
];

export const initialRecurringExpenses = [
  { id: "REC-001", category: "Payroll & Salaries", description: "Core Engineering & Factory Staff Payroll", amount: 198000, frequency: "Monthly", dayOfMonth: 1 },
  { id: "REC-002", category: "Facility & Rent", description: "Industrial Workshop Facility Lease (MIDC Chakan)", amount: 85000, frequency: "Monthly", dayOfMonth: 5 },
  { id: "REC-003", category: "Utilities & Power", description: "High-Tension Factory Electricity & Power", amount: 48000, frequency: "Monthly", dayOfMonth: 7 },
  { id: "REC-004", category: "Software & SaaS", description: "ERP, GST E-Invoicing & Accounting Cloud Suite", amount: 24000, frequency: "Monthly", dayOfMonth: 10 },
  { id: "REC-005", category: "Loan EMI / Working Capital", description: "SIDBI Machinery Term Loan EMI", amount: 35000, frequency: "Monthly", dayOfMonth: 15 },
];

export const initialExpenses = [
  { id: "EXP-001", category: "Raw Materials", description: "Alloy Steel Billets Batch 12T (IS 2062)", amount: 185000, date: "2026-08-14", recurring: false },
  { id: "EXP-002", category: "Logistics & Freight", description: "Interstate Dispatch Trailer to Pune Hub", amount: 42000, date: "2026-08-20", recurring: false },
  { id: "EXP-003", category: "Maintenance & Tooling", description: "CNC Milling Insert Tooling Set Replacement", amount: 28000, date: "2026-08-26", recurring: false },
];

export const initialWorkers = [
  {
    id: "WRK-001",
    name: "Rameshwar Prasad",
    designation: "Senior CNC Machinist",
    department: "Operations & Factory Floor",
    monthlySalary: 38000,
    phone: "+91 98201 22334",
    email: "rameshwar@bharatprecision.in",
    bankAccount: "HDFC0001234 - 50100234123456",
    upiId: "rameshwar@okhdfcbank",
    status: "Active",
    joiningDate: "2024-03-15",
  },
  {
    id: "WRK-002",
    name: "Ananya Deshmukh",
    designation: "Finance & Accounts Lead",
    department: "Accounts & Finance",
    monthlySalary: 55000,
    phone: "+91 98110 44556",
    email: "ananya@bharatprecision.in",
    bankAccount: "ICIC0000456 - 002301567890",
    upiId: "ananya@icici",
    status: "Active",
    joiningDate: "2023-08-01",
  },
  {
    id: "WRK-003",
    name: "Vikramaditya Chauhan",
    designation: "Quality & Metallurgical Inspector",
    department: "Procurement & Quality",
    monthlySalary: 32000,
    phone: "+91 98450 77889",
    email: "vikram@bharatprecision.in",
    bankAccount: "SBIN0007890 - 30891234567",
    upiId: "vikramaditya@oksbi",
    status: "Active",
    joiningDate: "2024-06-10",
  },
  {
    id: "WRK-004",
    name: "Suresh Pillai",
    designation: "Warehouse Logistics Coordinator",
    department: "Logistics & Warehouse",
    monthlySalary: 28000,
    phone: "+91 98332 99001",
    email: "suresh@bharatprecision.in",
    bankAccount: "KKBK0001122 - 9988112233",
    upiId: "sureshp@kotak",
    status: "Active",
    joiningDate: "2025-01-12",
  },
  {
    id: "WRK-005",
    name: "Deepak Verma",
    designation: "B2B OEM Sales Engineer",
    department: "Sales & Marketing",
    monthlySalary: 45000,
    phone: "+91 98765 43210",
    email: "deepak@bharatprecision.in",
    bankAccount: "UTIB0000345 - 91801004567890",
    upiId: "deepakverma@axisbank",
    status: "Active",
    joiningDate: "2024-11-01",
  },
];

export const initialPayrollDisbursements = [
  {
    id: "DISB-2026-08",
    workerId: "WRK-001",
    workerName: "Rameshwar Prasad",
    month: "August 2026",
    baseSalary: 38000,
    bonus: 2000,
    deductions: 1500,
    netPayable: 38500,
    disbursedAt: "2026-08-31T18:30:00.000Z",
    paymentMode: "UPI / NEFT",
    status: "Processed",
  },
  {
    id: "DISB-2026-08-2",
    workerId: "WRK-002",
    workerName: "Ananya Deshmukh",
    month: "August 2026",
    baseSalary: 55000,
    bonus: 0,
    deductions: 2000,
    netPayable: 53000,
    disbursedAt: "2026-08-31T18:30:00.000Z",
    paymentMode: "Bank IMPS",
    status: "Processed",
  },
];

let financialData = {
  business: {
    ...cleanBusiness,
    openingCash: 1240000,
    monthlyRevenue: 1450000,
    monthlyExpenses: 620000,
  },
  customers: [...initialCustomers],
  invoices: [...initialInvoices],
  payments: [...initialPayments],
  recurringExpenses: [...initialRecurringExpenses],
  expenses: [...initialExpenses],
  workers: [...initialWorkers],
  payrollDisbursements: [...initialPayrollDisbursements],
  vendors: [...initialVendors],
  purchaseOrders: [...initialPurchaseOrders],
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
  if (activeUserId) {
    try {
      localStorage.setItem(`fintwin_userdata_${activeUserId}`, JSON.stringify(financialData));
    } catch (e) {
      console.warn("Could not save to user localStorage:", e);
    }
  }

  subscribers.forEach((callback) => {
    try {
      callback(getFinancialData());
    } catch (error) {
      console.error("Financial store subscriber error:", error);
    }
  });
}

// ==========================================
// USER SESSION INITIALIZATION & PERSISTENCE
// ==========================================

export function initUserSession(user) {
  if (!user) return;
  activeUserId = user.id;
  activeBusinessId = user.businessId || "BUS-001";

  // 1. Try loading cached user-specific data from localStorage
  try {
    const cached = localStorage.getItem(`fintwin_userdata_${activeUserId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      financialData = {
        business: {
          ...cleanBusiness,
          id: activeBusinessId,
          name: user.company || parsed.business?.name || "Precision Auto Gears Ltd",
          gstin: user.gstin || parsed.business?.gstin || "07AAAAA0000A1Z5",
          openingCash: parsed.business?.openingCash || 1240000,
          monthlyRevenue: parsed.business?.monthlyRevenue || 1450000,
          monthlyExpenses: parsed.business?.monthlyExpenses || 620000,
          ...parsed.business,
        },
        customers: parsed.customers && parsed.customers.length > 0 ? parsed.customers : [...initialCustomers],
        invoices: parsed.invoices && parsed.invoices.length > 0 ? parsed.invoices : [...initialInvoices],
        payments: parsed.payments && parsed.payments.length > 0 ? parsed.payments : [...initialPayments],
        recurringExpenses: parsed.recurringExpenses && parsed.recurringExpenses.length > 0 ? parsed.recurringExpenses : [...initialRecurringExpenses],
        expenses: parsed.expenses && parsed.expenses.length > 0 ? parsed.expenses : [...initialExpenses],
        workers: parsed.workers && parsed.workers.length > 0 ? parsed.workers : [...initialWorkers],
        payrollDisbursements: parsed.payrollDisbursements && parsed.payrollDisbursements.length > 0 ? parsed.payrollDisbursements : [...initialPayrollDisbursements],
        vendors: parsed.vendors && parsed.vendors.length > 0 ? parsed.vendors : [...initialVendors],
        purchaseOrders: parsed.purchaseOrders && parsed.purchaseOrders.length > 0 ? parsed.purchaseOrders : [...initialPurchaseOrders],
      };
    } else {
      // Default enterprise state with ready-to-test invoices and risk attributes
      financialData = {
        business: {
          ...cleanBusiness,
          id: activeBusinessId,
          name: user.company || "Precision Auto Gears Ltd",
          gstin: user.gstin || "07AAAAA0000A1Z5",
          openingCash: 1240000,
          monthlyRevenue: 1450000,
          monthlyExpenses: 620000,
        },
        customers: [...initialCustomers],
        invoices: [...initialInvoices],
        payments: [...initialPayments],
        recurringExpenses: [...initialRecurringExpenses],
        expenses: [...initialExpenses],
        workers: [...initialWorkers],
        payrollDisbursements: [...initialPayrollDisbursements],
        vendors: [...initialVendors],
        purchaseOrders: [...initialPurchaseOrders],
      };
    }
  } catch (e) {
    console.warn("Error restoring user session data:", e);
  }

  notifySubscribers();

  // 2. Sync with remote backend database
  syncWithBackendDatabase();
}

export function clearActiveSession() {
  activeUserId = null;
  activeBusinessId = null;

  financialData = {
    business: { ...cleanBusiness },
    customers: [],
    invoices: [],
    payments: [],
    recurringExpenses: [],
    expenses: [],
    workers: [],
    payrollDisbursements: [],
    vendors: [...initialVendors],
    purchaseOrders: [...initialPurchaseOrders],
  };

  notifySubscribers();
}

export function isDatabaseConnected() {
  return databaseConnected;
}

export function getFinancialData() {
  return {
    business: { ...(financialData.business || {}) },
    customers: Array.isArray(financialData.customers) ? [...financialData.customers] : [],
    invoices: Array.isArray(financialData.invoices) ? [...financialData.invoices] : [],
    payments: Array.isArray(financialData.payments) ? [...financialData.payments] : [],
    recurringExpenses: Array.isArray(financialData.recurringExpenses) ? [...financialData.recurringExpenses] : [],
    expenses: Array.isArray(financialData.expenses) ? [...financialData.expenses] : [],
    workers: Array.isArray(financialData.workers) ? [...financialData.workers] : [],
    payrollDisbursements: Array.isArray(financialData.payrollDisbursements) ? [...financialData.payrollDisbursements] : [],
    vendors: Array.isArray(financialData.vendors) ? [...financialData.vendors] : [...initialVendors],
    purchaseOrders: Array.isArray(financialData.purchaseOrders) ? [...financialData.purchaseOrders] : [...initialPurchaseOrders],
  };
}

export function getBusiness() {
  return { ...(financialData.business || {}) };
}

export function getCustomers() {
  return Array.isArray(financialData.customers) ? [...financialData.customers] : [];
}

export function getInvoices() {
  return Array.isArray(financialData.invoices) ? [...financialData.invoices] : [];
}

export function getPayments() {
  return Array.isArray(financialData.payments) ? [...financialData.payments] : [];
}

export function getRecurringExpenses() {
  return Array.isArray(financialData.recurringExpenses) ? [...financialData.recurringExpenses] : [];
}

export function getExpenses() {
  return Array.isArray(financialData.expenses) ? [...financialData.expenses] : [];
}

// ==========================================
// BUSINESS PROFILE ACTIONS
// ==========================================

export function updateBusinessProfile(updated) {
  financialData.business = {
    ...financialData.business,
    ...updated,
    id: activeBusinessId || financialData.business.id || "BUS-001",
  };
  notifySubscribers();

  // Persist to backend database
  fetch(`${API_URL}/api/business`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: financialData.business.id,
      name: financialData.business.name,
      industry: financialData.business.industry,
      gstin: financialData.business.gstin,
      currency: financialData.business.currency,
      openingCash: Number(financialData.business.openingCash || 0),
      monthlyRevenue: Number(financialData.business.monthlyRevenue || 0),
      monthlyExpenses: Number(financialData.business.monthlyExpenses || 0),
    }),
  }).catch((err) => console.warn("Backend business sync error:", err));
}

// ==========================================
// INVOICE ACTIONS
// ==========================================

export function createInvoices(newInvoices) {
  const bizId = activeBusinessId || financialData.business.id || "BUS-001";
  const normalized = (Array.isArray(newInvoices) ? newInvoices : [newInvoices]).map((inv) => ({
    ...inv,
    businessId: bizId,
  }));

  financialData.invoices = [...normalized, ...financialData.invoices];

  // Auto-register new customers
  normalized.forEach((inv) => {
    if (inv.customer && !financialData.customers.some((c) => c.name === inv.customer)) {
      financialData.customers.push({
        id: inv.customerId || `CUS-${financialData.customers.length + 1}`,
        businessId: bizId,
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

  // Persist bulk invoices to backend database
  fetch(`${API_URL}/api/invoices/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      normalized.map((inv) => ({
        id: inv.id,
        businessId: bizId,
        customerId: inv.customerId || `CUS-${Math.floor(100 + Math.random() * 900)}`,
        customer: inv.customer,
        amount: Number(inv.amount || 0),
        invoiceDate: inv.invoiceDate || new Date().toISOString().slice(0, 10),
        dueDate: inv.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        status: inv.status || "Pending",
        paymentDate: inv.paymentDate || null,
        source: inv.source || "file_upload",
      }))
    ),
  }).catch((err) => console.warn("Backend bulk invoice sync error:", err));
}

export function addInvoice(invoice) {
  const bizId = activeBusinessId || financialData.business.id || "BUS-001";
  const newInvoice = {
    id: invoice.id || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    businessId: bizId,
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
      const updated = {
        ...inv,
        status: newStatus,
        paymentDate: isPaid ? new Date().toISOString().slice(0, 10) : null,
      };

      // Persist to backend
      fetch(`${API_URL}/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          paymentDate: updated.paymentDate,
        }),
      }).catch((err) => console.warn("Backend invoice update error:", err));

      return updated;
    }
    return inv;
  });
  notifySubscribers();
}

export function updateInvoiceRecovery(invoiceId, recoveryData) {
  financialData.invoices = financialData.invoices.map((inv) => {
    if (inv.id === invoiceId) {
      return {
        ...inv,
        ...recoveryData,
        lastRecoveryActionAt: new Date().toISOString(),
      };
    }
    return inv;
  });
  notifySubscribers();
}

export function deleteInvoice(invoiceId) {
  financialData.invoices = financialData.invoices.filter((i) => i.id !== invoiceId);
  notifySubscribers();

  fetch(`${API_URL}/api/invoices/${invoiceId}`, {
    method: "DELETE",
  }).catch((err) => console.warn("Backend invoice delete error:", err));
}

// ==========================================
// EXPENSE ACTIONS
// ==========================================

export function addExpense(expense) {
  const bizId = activeBusinessId || financialData.business.id || "BUS-001";
  const isRec = Boolean(expense.recurring);

  if (isRec) {
    const newRec = {
      id: expense.id || `REC-${Math.floor(100 + Math.random() * 900)}`,
      businessId: bizId,
      category: expense.category || "General",
      description: expense.description || "Recurring Expense",
      amount: Number(expense.amount) || 0,
      frequency: expense.frequency || "Monthly",
      dayOfMonth: Number(expense.dayOfMonth) || 1,
      source: "user_entry",
    };
    financialData.recurringExpenses = [newRec, ...financialData.recurringExpenses];

    fetch(`${API_URL}/api/recurring-expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRec),
    }).catch((err) => console.warn("Backend recurring expense error:", err));
  } else {
    const newExp = {
      id: expense.id || `EXP-${Math.floor(100 + Math.random() * 900)}`,
      businessId: bizId,
      category: expense.category || "General",
      description: expense.description || "One-time Expense",
      amount: Number(expense.amount) || 0,
      date: expense.date || new Date().toISOString().slice(0, 10),
      recurring: false,
      source: "user_entry",
    };
    financialData.expenses = [newExp, ...financialData.expenses];

    fetch(`${API_URL}/api/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExp),
    }).catch((err) => console.warn("Backend expense error:", err));
  }
  notifySubscribers();
}

export function deleteExpense(id, isRecurring = false) {
  if (isRecurring) {
    financialData.recurringExpenses = financialData.recurringExpenses.filter((e) => e.id !== id);
    fetch(`${API_URL}/api/recurring-expenses/${id}`, { method: "DELETE" }).catch(() => {});
  } else {
    financialData.expenses = financialData.expenses.filter((e) => e.id !== id);
    fetch(`${API_URL}/api/expenses/${id}`, { method: "DELETE" }).catch(() => {});
  }
  notifySubscribers();
}

// ==========================================
// CUSTOMER ACTIONS
// ==========================================

export function addCustomer(customer) {
  const bizId = activeBusinessId || financialData.business.id || "BUS-001";
  const newCus = {
    id: customer.id || `CUS-${financialData.customers.length + 1}`,
    businessId: bizId,
    name: customer.name || "New Client",
    industry: customer.industry || "General Industry",
    contactEmail: customer.contactEmail || "",
    creditScore: customer.creditScore || "Medium Risk",
    paymentTermsDays: Number(customer.paymentTermsDays) || 30,
    avgDelayDays: Number(customer.avgDelayDays) || 0,
  };
  financialData.customers = [...financialData.customers, newCus];
  notifySubscribers();

  fetch(`${API_URL}/api/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: newCus.id,
      businessId: bizId,
      name: newCus.name,
      industry: newCus.industry,
    }),
  }).catch(() => {});

  return newCus;
}

export function updateCustomer(customerId, updatedFields) {
  financialData.customers = financialData.customers.map((c) =>
    c.id === customerId ? { ...c, ...updatedFields } : c
  );
  notifySubscribers();
}

// ==========================================
// RESET & DEMO CONTROLS
// ==========================================

export function clearAllData() {
  if (activeUserId) {
    try {
      localStorage.removeItem(`fintwin_userdata_${activeUserId}`);
    } catch (e) {}
  }

  financialData = {
    business: { ...cleanBusiness, id: activeBusinessId || "BUS-001" },
    customers: [],
    invoices: [],
    payments: [],
    recurringExpenses: [],
    expenses: [],
  };
  notifySubscribers();
}

// ==========================================
// REMOTE DATABASE SYNC
// ==========================================

export async function syncWithBackendDatabase() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_URL}/health`, { signal: controller.signal });
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
          const bizData = await bizRes.json();
          if (bizData && bizData.business && bizData.business.name) {
            financialData.business = { ...financialData.business, ...bizData.business };
          }
        }
        if (custRes.ok) {
          const cData = await custRes.json();
          if (cData && Array.isArray(cData.customers) && cData.customers.length > 0) {
            financialData.customers = cData.customers;
          }
        }
        if (invRes.ok) {
          const iData = await invRes.json();
          if (iData && Array.isArray(iData.invoices) && iData.invoices.length > 0) {
            financialData.invoices = iData.invoices;
          }
        }
      } catch (err) {
        console.warn("Partial sync error:", err);
      }
    } else {
      databaseConnected = false;
    }
  } catch (error) {
    databaseConnected = false;
  }
  notifySubscribers();
}

// ==========================================
// WORKERS & SALARY PAYROLL ACTIONS
// ==========================================

export function getWorkers() {
  return Array.isArray(financialData.workers) ? [...financialData.workers] : [];
}

export function getPayrollDisbursements() {
  return Array.isArray(financialData.payrollDisbursements) ? [...financialData.payrollDisbursements] : [];
}

export function addWorker(worker) {
  const newWorker = {
    id: worker.id || `WRK-${Math.floor(1000 + Math.random() * 9000)}`,
    name: worker.name || "Worker",
    designation: worker.designation || "Staff Specialist",
    department: worker.department || "Operations",
    monthlySalary: Number(worker.monthlySalary) || 25000,
    phone: worker.phone || "",
    email: worker.email || "",
    bankAccount: worker.bankAccount || "",
    upiId: worker.upiId || "",
    status: worker.status || "Active",
    joiningDate: worker.joiningDate || new Date().toISOString().slice(0, 10),
    lastSalaryPaidDate: null,
  };

  financialData.workers = [newWorker, ...(financialData.workers || [])];
  notifySubscribers();
  return newWorker;
}

export function updateWorker(id, updatedData) {
  financialData.workers = (financialData.workers || []).map((w) =>
    w.id === id ? { ...w, ...updatedData } : w
  );
  notifySubscribers();
}

export function deleteWorker(id) {
  financialData.workers = (financialData.workers || []).filter((w) => w.id !== id);
  notifySubscribers();
}

export function disburseSalary({ workerId, month, bonus = 0, deductions = 0, note = "" }) {
  const worker = (financialData.workers || []).find((w) => w.id === workerId);
  if (!worker) return null;

  const baseSalary = Number(worker.monthlySalary) || 0;
  const netAmount = Math.max(0, baseSalary + Number(bonus) - Number(deductions));
  const dateStr = new Date().toISOString().slice(0, 10);
  const disbursementId = `PAY-${Date.now().toString().slice(-6)}`;

  const disbursement = {
    id: disbursementId,
    workerId: worker.id,
    workerName: worker.name,
    designation: worker.designation,
    department: worker.department,
    month: month || new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    baseSalary,
    bonus: Number(bonus),
    deductions: Number(deductions),
    netAmount,
    disbursedDate: dateStr,
    status: "Completed",
    referenceId: `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
    note: note || `Monthly salary for ${worker.name}`,
  };

  // 1. Record payroll disbursement
  financialData.payrollDisbursements = [disbursement, ...(financialData.payrollDisbursements || [])];

  // 2. Mark worker's last paid date
  worker.lastSalaryPaidDate = dateStr;

  // 3. Log as an Expense in the Financial ledger so burn rate and runway automatically update
  addExpense({
    category: "Payroll & Salaries",
    description: `Salary: ${worker.name} (${worker.designation})`,
    amount: netAmount,
    recurring: false,
    date: dateStr,
  });

  notifySubscribers();
  return disbursement;
}

export function disburseAllSalaries({ month }) {
  const activeWorkers = (financialData.workers || []).filter((w) => w.status === "Active");
  const results = [];
  activeWorkers.forEach((worker) => {
    const res = disburseSalary({
      workerId: worker.id,
      month: month || new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    });
    if (res) results.push(res);
  });
  return results;
}

export function loadFinancialData() {
  if (activeUserId) {
    syncWithBackendDatabase();
  }
}

// ==========================================
// VENDOR & SUPPLIER MANAGEMENT
// ==========================================

export function getVendors() {
  return [...(financialData.vendors || initialVendors)];
}

export function addVendor(vendor) {
  const newVendor = {
    ...vendor,
    id: vendor.id || `VEN-${Date.now().toString().slice(-4)}`,
    isMsmeRegistered: Boolean(vendor.isMsmeRegistered),
    reliabilityScore: Number(vendor.reliabilityScore) || 90,
  };
  financialData.vendors = [newVendor, ...(financialData.vendors || [])];
  notifySubscribers();
  return newVendor;
}

export function updateVendor(id, updates) {
  financialData.vendors = (financialData.vendors || []).map((v) =>
    v.id === id ? { ...v, ...updates } : v
  );
  notifySubscribers();
}

export function deleteVendor(id) {
  financialData.vendors = (financialData.vendors || []).filter((v) => v.id !== id);
  notifySubscribers();
}

// ==========================================
// PURCHASE ORDERS & BILLS PAYABLE
// ==========================================

export function getPurchaseOrders() {
  return [...(financialData.purchaseOrders || initialPurchaseOrders)];
}

export function addPurchaseOrder(po) {
  const newPo = {
    ...po,
    id: po.id || `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
    amount: Number(po.amount) || 0,
    status: po.status || "Created",
    paymentStatus: po.paymentStatus || "Pending",
    orderDate: po.orderDate || new Date().toISOString().slice(0, 10),
  };
  financialData.purchaseOrders = [newPo, ...(financialData.purchaseOrders || [])];

  // Auto record as expense if it has an invoice
  if (newPo.invoiceNumber) {
    addExpense({
      category: "Cost of Goods Sold (Raw Materials)",
      description: `Vendor Bill: ${newPo.vendorName} (${newPo.itemDescription})`,
      amount: newPo.amount,
      recurring: false,
      date: newPo.invoiceDate || newPo.orderDate,
    });
  }

  notifySubscribers();
  return newPo;
}

export function updatePurchaseOrder(id, updates) {
  financialData.purchaseOrders = (financialData.purchaseOrders || []).map((p) =>
    p.id === id ? { ...p, ...updates } : p
  );
  notifySubscribers();
}

export function deletePurchaseOrder(id) {
  financialData.purchaseOrders = (financialData.purchaseOrders || []).filter((p) => p.id !== id);
  notifySubscribers();
}

export function payPurchaseOrder(id, paymentMethod = "Bank Transfer (NEFT/RTGS)") {
  const po = (financialData.purchaseOrders || []).find((p) => p.id === id);
  if (!po) return null;

  po.paymentStatus = "Paid";
  po.paidDate = new Date().toISOString().slice(0, 10);
  po.paymentMethod = paymentMethod;

  notifySubscribers();
  return po;
}