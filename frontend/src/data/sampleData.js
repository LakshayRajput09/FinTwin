// ==========================================
// FinTwin Sample Financial Data
// ==========================================
//
// This is our initial prototype data layer.
//
// Later, the same structure can receive data from:
// 1. CSV / Excel
// 2. GST / e-Invoice APIs
// 3. RBI Account Aggregator integrations
// 4. Manual user entries
//
// The rest of the application should not need
// to care where the data originally came from.
// ==========================================


export const business = {
  id: "BUS-001",

  name: "ABC Manufacturing",

  industry: "Manufacturing",

  gstin: "",

  currency: "INR",

  openingCash: 840000,

  monthlyRevenue: 1200000,

  monthlyExpenses: 800000,
};


// ==========================================
// CUSTOMERS
// ==========================================

export const customers = [
  {
    id: "CUS-001",
    name: "Customer A",
    industry: "Automotive",
  },

  {
    id: "CUS-002",
    name: "Customer B",
    industry: "Retail",
  },

  {
    id: "CUS-003",
    name: "Customer C",
    industry: "Construction",
  },

  {
    id: "CUS-004",
    name: "Customer D",
    industry: "Wholesale",
  },

  {
    id: "CUS-005",
    name: "Customer E",
    industry: "Retail",
  },
];


// ==========================================
// INVOICES
// ==========================================

export const invoices = [
  {
    id: "INV-1001",
    customerId: "CUS-001",
    customer: "Customer A",

    amount: 250000,

    invoiceDate: "2026-08-01",
    dueDate: "2026-08-31",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },

  {
    id: "INV-1002",
    customerId: "CUS-002",
    customer: "Customer B",

    amount: 180000,

    invoiceDate: "2026-08-03",
    dueDate: "2026-09-02",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },

  {
    id: "INV-1003",
    customerId: "CUS-003",
    customer: "Customer C",

    amount: 120000,

    invoiceDate: "2026-08-05",
    dueDate: "2026-08-20",

    status: "Paid",

    paymentDate: "2026-08-18",

    source: "sample",
  },

  {
    id: "INV-1004",
    customerId: "CUS-001",
    customer: "Customer A",

    amount: 320000,

    invoiceDate: "2026-08-07",
    dueDate: "2026-09-06",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },

  {
    id: "INV-1005",
    customerId: "CUS-004",
    customer: "Customer D",

    amount: 95000,

    invoiceDate: "2026-08-09",
    dueDate: "2026-09-08",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },

  {
    id: "INV-1008",
    customerId: "CUS-003",
    customer: "Customer C",

    amount: 145000,

    invoiceDate: "2026-08-15",
    dueDate: "2026-09-14",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },

  {
    id: "INV-1009",
    customerId: "CUS-001",
    customer: "Customer A",

    amount: 275000,

    invoiceDate: "2026-08-17",
    dueDate: "2026-09-16",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },

  {
    id: "INV-1010",
    customerId: "CUS-005",
    customer: "Customer E",

    amount: 110000,

    invoiceDate: "2026-08-18",
    dueDate: "2026-09-17",

    status: "Pending",

    paymentDate: null,

    source: "sample",
  },
];


// ==========================================
// PAYMENT HISTORY
// ==========================================

export const payments = [
  {
    id: "PAY-001",

    invoiceId: "INV-1003",

    customerId: "CUS-003",

    amount: 120000,

    expectedDate: "2026-08-20",

    actualDate: "2026-08-18",

    daysDelayed: -2,

    source: "sample",
  },

  {
    id: "PAY-002",

    invoiceId: "INV-0998",

    customerId: "CUS-001",

    amount: 210000,

    expectedDate: "2026-07-20",

    actualDate: "2026-08-01",

    daysDelayed: 12,

    source: "sample",
  },

  {
    id: "PAY-003",

    invoiceId: "INV-0999",

    customerId: "CUS-002",

    amount: 175000,

    expectedDate: "2026-07-25",

    actualDate: "2026-07-29",

    daysDelayed: 4,

    source: "sample",
  },

  {
    id: "PAY-004",

    invoiceId: "INV-0997",

    customerId: "CUS-001",

    amount: 280000,

    expectedDate: "2026-07-15",

    actualDate: "2026-08-05",

    daysDelayed: 21,

    source: "sample",
  },
];


// ==========================================
// RECURRING EXPENSES
// ==========================================

export const recurringExpenses = [
  {
    id: "EXP-001",

    category: "Salaries",

    description: "Employee salaries",

    amount: 350000,

    frequency: "monthly",

    dayOfMonth: 1,

    source: "sample",
  },

  {
    id: "EXP-002",

    category: "Rent",

    description: "Factory rent",

    amount: 120000,

    frequency: "monthly",

    dayOfMonth: 5,

    source: "sample",
  },

  {
    id: "EXP-003",

    category: "Utilities",

    description: "Electricity and utilities",

    amount: 80000,

    frequency: "monthly",

    dayOfMonth: 10,

    source: "sample",
  },

  {
    id: "EXP-004",

    category: "Operations",

    description: "Operational expenses",

    amount: 250000,

    frequency: "monthly",

    dayOfMonth: 15,

    source: "sample",
  },
];


// ==========================================
// ONE-TIME EXPENSES
// ==========================================

export const expenses = [
  {
    id: "EXP-101",

    category: "Equipment",

    description: "Machine maintenance",

    amount: 85000,

    date: "2026-08-12",

    recurring: false,

    source: "sample",
  },

  {
    id: "EXP-102",

    category: "Transport",

    description: "Logistics expense",

    amount: 45000,

    date: "2026-08-18",

    recurring: false,

    source: "sample",
  },
];