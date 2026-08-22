// ==========================================
// FinTwin Initial Clean Financial State & Demo Presets
// ==========================================

// Comprehensive Industry Sectors for MSMEs and Enterprises
export const INDUSTRY_SECTORS = [
  "Manufacturing & Heavy Engineering",
  "Automotive & Auto Components",
  "Textiles, Apparel & Garments",
  "Pharmaceuticals & Healthcare",
  "Retail, FMCG & Supermarkets",
  "Logistics, Supply Chain & Freight",
  "Agriculture, Dairy & Food Processing",
  "Construction, Real Estate & Infrastructure",
  "Information Technology & SaaS",
  "Electronics & Electrical Equipment",
  "Chemicals, Petrochemicals & Polymers",
  "Hospitality, Restaurants & Catering",
  "Renewable Energy & Solar Systems",
  "Gems, Jewellery & Handicrafts",
  "Education, EdTech & Training",
  "Media, Advertising & Digital Agencies",
  "Paper, Printing & Packaging",
  "Metals, Mining & Metallurgy",
  "Professional, Accounting & Legal Services",
  "FinTech, NBFC & Financial Services",
  "E-Commerce & D2C Brands",
  "Medical Devices & Diagnostics",
  "Telecommunications & Networking",
  "Aerospace & Defense Components",
  "Wholesale & Commodity Trading",
  "General Commercial Enterprise",
];

export const EXECUTIVE_ROLES = [
  { id: "CEO", title: "CEO (Chief Executive Officer)", desc: "Strategic solvency, shock stress-testing & growth financing", icon: "👑" },
  { id: "CFO", title: "CFO (Chief Financial Officer)", desc: "Deep cash flow telemetry, 90-day AI forecast & capital allocation", icon: "💼" },
  { id: "Accountant", title: "Accountant (Finance & Payroll)", desc: "Invoices, GST reconciliation, worker management & salary disbursement", icon: "📊" },
];

// Clean starting state with zero pre-filled numbers
export const cleanBusiness = {
  id: "BUS-001",
  name: "My Enterprise",
  industry: "Manufacturing & Heavy Engineering",
  gstin: "",
  currency: "INR",
  openingCash: 0,
  monthlyRevenue: 0,
  monthlyExpenses: 0,
  minCashReserve: 0,
  targetRunwayDays: 60,
};

export const business = {
  ...cleanBusiness,
};

export const customers = [];
export const invoices = [];
export const payments = [];
export const recurringExpenses = [];
export const expenses = [];
export const workers = [];
export const payrollDisbursements = [];

// ==========================================
// OPTIONAL DEMO PRESETS (For testing only)
// ==========================================

export const demoPresets = {
  "BUS-001": {
    business: {
      id: "BUS-001",
      name: "ABC Manufacturing",
      industry: "Manufacturing",
      gstin: "27AABCA1234F1Z8",
      currency: "INR",
      openingCash: 840000,
      monthlyRevenue: 1200000,
      monthlyExpenses: 800000,
      minCashReserve: 300000,
      targetRunwayDays: 60,
    },
    customers: [
      { id: "CUS-001", name: "Customer A (Auto Corp)", industry: "Automotive", contactEmail: "finance@autocorp.in", creditScore: "High Risk", paymentTermsDays: 30, avgDelayDays: 18 },
      { id: "CUS-002", name: "Customer B (Metro Retail)", industry: "Retail", contactEmail: "ap@metroretail.com", creditScore: "Medium Risk", paymentTermsDays: 30, avgDelayDays: 12 },
      { id: "CUS-003", name: "Customer C (Apex Infra)", industry: "Construction", contactEmail: "accounts@apexinfra.org", creditScore: "Low Risk", paymentTermsDays: 45, avgDelayDays: 3 },
    ],
    invoices: [
      { id: "INV-1001", customerId: "CUS-001", customer: "Customer A (Auto Corp)", amount: 350000, invoiceDate: "2026-08-01", dueDate: "2026-08-31", status: "Pending", predictedDelayDays: 18, riskScore: "High" },
      { id: "INV-1002", customerId: "CUS-002", customer: "Customer B (Metro Retail)", amount: 180000, invoiceDate: "2026-08-05", dueDate: "2026-09-05", status: "Pending", predictedDelayDays: 12, riskScore: "Medium" },
      { id: "INV-1003", customerId: "CUS-003", customer: "Customer C (Apex Infra)", amount: 420000, invoiceDate: "2026-07-15", dueDate: "2026-08-15", status: "Paid", predictedDelayDays: 2, riskScore: "Low" },
      { id: "INV-1004", customerId: "CUS-001", customer: "Customer A (Auto Corp)", amount: 280000, invoiceDate: "2026-08-12", dueDate: "2026-09-12", status: "Pending", predictedDelayDays: 20, riskScore: "High" },
    ],
    recurringExpenses: [
      { id: "REC-001", category: "Payroll & Salaries", description: "Factory Staff Payroll", amount: 320000, frequency: "Monthly", dayOfMonth: 1 },
      { id: "REC-002", category: "Facility & Rent", description: "Warehouse Rent", amount: 120000, frequency: "Monthly", dayOfMonth: 5 },
      { id: "REC-003", category: "Utilities & Power", description: "Industrial Electricity", amount: 65000, frequency: "Monthly", dayOfMonth: 10 },
    ],
    expenses: [
      { id: "EXP-001", category: "Raw Materials", description: "High-grade Steel Sheet Batch", amount: 180000, date: "2026-08-04", recurring: false },
      { id: "EXP-002", category: "Logistics & Freight", description: "Inter-state Freight", amount: 45000, date: "2026-08-10", recurring: false },
    ],
  },
};