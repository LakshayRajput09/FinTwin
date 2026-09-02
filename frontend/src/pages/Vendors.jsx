import React, { useState, useEffect } from "react";
import {
  Building2,
  Package,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Percent,
  TrendingUp,
  FileText,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ShieldAlert,
  Download,
  Copy,
  Check,
  ExternalLink,
  Landmark,
  Zap,
  Sparkles,
  ChevronRight,
  DollarSign,
  Truck,
  FileCheck,
  X,
  CreditCard,
  Send,
  Eye,
} from "lucide-react";

import ModulePage from "../components/ModulePage";
import {
  getVendors,
  addVendor,
  getPurchaseOrders,
  addPurchaseOrder,
  payPurchaseOrder,
  getInvoices,
  getBusiness,
  subscribeFinancialData,
} from "../data/financialStore";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { calculateInvoiceRiskAnalysis } from "../utils/riskRecoveryEngine";
import CashRecoveryModal from "../components/CashRecoveryModal";

export default function Vendors() {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();

  const [vendors, setVendors] = useState(getVendors());
  const [purchaseOrders, setPurchaseOrders] = useState(getPurchaseOrders());
  const [invoices, setInvoices] = useState(getInvoices());
  const [business, setBusiness] = useState(getBusiness());

  // Navigation tab
  const [activeTab, setActiveTab] = useState("msme_43b"); // "msme_43b" | "orders" | "discounting" | "directory"

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddPoModal, setShowAddPoModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [selectedNoticeRecord, setSelectedNoticeRecord] = useState(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Dynamic Discounting Calculator State
  const [calcInvoiceAmount, setCalcInvoiceAmount] = useState(250000);
  const [calcDiscountPercent, setCalcDiscountPercent] = useState(2);
  const [calcDaysEarly, setCalcDaysEarly] = useState(20);

  // Form States
  const [newVendorForm, setNewVendorForm] = useState({
    name: "",
    category: "Raw Materials",
    gstin: "",
    isMsmeRegistered: true,
    msmeRegNo: "",
    contactPerson: "",
    phone: "",
    email: "",
    paymentTermsDays: 30,
    earlyDiscountPercent: 1.5,
    earlyDiscountDays: 7,
  });

  const [newPoForm, setNewPoForm] = useState({
    vendorId: "",
    itemDescription: "",
    amount: "",
    orderDate: new Date().toISOString().slice(0, 10),
    deliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
    invoiceNumber: "",
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    isMsme43BhApplicable: true,
    earlyDiscountEligible: true,
  });

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setVendors(getVendors());
      setPurchaseOrders(getPurchaseOrders());
      setInvoices(getInvoices());
      setBusiness(getBusiness());
    });
    return unsub;
  }, []);

  const formatMoney = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;
  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;

  // =================================================================
  // SECTION 43B(h) STATUTORY COMPLIANCE CALCULATIONS
  // =================================================================
  // Under Section 43B(h) of the Income Tax Act, buyers MUST pay registered
  // MSME vendors within 45 days (with agreement) or 15 days (without agreement).
  // Delay beyond 45 days attracts compound interest at 3x the RBI Bank Rate (MSMED Act Sec 16).
  const RBI_BANK_RATE = 6.5; // Current RBI bank repo benchmark
  const STATUTORY_INTEREST_RATE = RBI_BANK_RATE * 3; // 19.5% p.a.

  const pendingInvoices = invoices.filter((i) => String(i.status || "").toLowerCase() !== "paid");
  const pendingOrders = purchaseOrders.filter((p) => String(p.paymentStatus || "").toLowerCase() !== "paid");

  // Compute 43B(h) compliance items
  const now = new Date();
  const complianceItems = pendingInvoices.map((inv) => {
    const invDate = new Date(inv.invoiceDate || now);
    const ageDays = Math.max(0, Math.floor((now - invDate) / (1000 * 60 * 60 * 24)));
    const daysRemaining = 45 - ageDays;
    const isOverdue45 = ageDays > 45;
    const isWarning = ageDays >= 30 && ageDays <= 45;

    // Compound interest with monthly rests at 3x RBI bank rate
    const overdueDays = Math.max(0, ageDays - 45);
    const monthsDelayed = overdueDays / 30;
    const monthlyRate = STATUTORY_INTEREST_RATE / 100 / 12;
    const amt = Number(inv.amount || 0);
    const penalInterest = isOverdue45 ? amt * (Math.pow(1 + monthlyRate, Math.max(1, monthsDelayed)) - 1) : 0;

    return {
      ...inv,
      ageDays,
      daysRemaining,
      isOverdue45,
      isWarning,
      penalInterest: Math.round(penalInterest),
    };
  });

  const totalPayableOrders = pendingOrders.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const total43BhProtected = complianceItems.filter((c) => c.isOverdue45 || c.isWarning).length;
  const totalAccruedInterest = complianceItems.reduce((sum, c) => sum + Number(c.penalInterest || 0), 0);

  // Dynamic Discounting formula
  // APR % = (Discount % / (100 - Discount %)) * (365 / Days Early) * 100
  const discountCashSavings = (calcInvoiceAmount * calcDiscountPercent) / 100;
  const netPaidEarly = calcInvoiceAmount - discountCashSavings;
  const annualizedDiscountRate =
    calcDaysEarly > 0
      ? ((calcDiscountPercent / (100 - calcDiscountPercent)) * (365 / calcDaysEarly) * 100).toFixed(1)
      : 0;

  // Handlers
  const handleCreateVendor = (e) => {
    e.preventDefault();
    if (!newVendorForm.name) return;
    addVendor(newVendorForm);
    setNewVendorForm({
      name: "",
      category: "Raw Materials",
      gstin: "",
      isMsmeRegistered: true,
      msmeRegNo: "",
      contactPerson: "",
      phone: "",
      email: "",
      paymentTermsDays: 30,
      earlyDiscountPercent: 1.5,
      earlyDiscountDays: 7,
    });
    setShowAddVendorModal(false);
  };

  const handleCreatePo = (e) => {
    e.preventDefault();
    if (!newPoForm.vendorId || !newPoForm.amount) return;
    const matchedVendor = vendors.find((v) => v.id === newPoForm.vendorId);
    addPurchaseOrder({
      ...newPoForm,
      vendorName: matchedVendor ? matchedVendor.name : "Supplier",
    });
    setNewPoForm({
      vendorId: "",
      itemDescription: "",
      amount: "",
      orderDate: new Date().toISOString().slice(0, 10),
      deliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
      invoiceNumber: "",
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      isMsme43BhApplicable: true,
      earlyDiscountEligible: true,
    });
    setShowAddPoModal(false);
  };

  const handleOpenNotice = (item) => {
    setSelectedNoticeRecord(item);
    setShowNoticeModal(true);
    setCopiedNotice(false);
  };

  const getNoticeText = () => {
    if (!selectedNoticeRecord) return "";
    return `DEMAND NOTICE FOR STATUTORY COMPLIANCE UNDER SECTION 43B(h) OF THE INCOME TAX ACT, 1961
AND SECTION 15 & 16 OF THE MSMED ACT, 2006

To:
The Finance & Accounts Department
${selectedNoticeRecord.customer || "Buyer Enterprise"}

Subject: Outstanding Payment of ₹${Number(selectedNoticeRecord.amount || 0).toLocaleString("en-IN")} against Invoice No. ${selectedNoticeRecord.id} - Statutory 45-Day Time Limit Exceeded

Dear Sir/Madam,

This is to bring to your urgent attention that Invoice No. ${selectedNoticeRecord.id} dated ${selectedNoticeRecord.invoiceDate || "N/A"} for ₹${Number(selectedNoticeRecord.amount || 0).toLocaleString("en-IN")} has exceeded the statutory 45-day payment limit prescribed under Section 43B(h) of the Income Tax Act, 1961.

STATUTORY LEGAL IMPLICATIONS:
1. Under Section 43B(h) of the Income Tax Act, 1961, your company will be disallowed from claiming business expenditure deduction for this invoice in your tax returns for the financial year.
2. Under Section 16 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, you are liable to pay compound interest with monthly rests at 3 times the RBI Bank Rate (currently 19.5% p.a.) amounting to accrued interest of ₹${(selectedNoticeRecord.penalInterest || 0).toLocaleString("en-IN")}.

We request you to remit the overdue amount of ₹${Number(selectedNoticeRecord.amount || 0).toLocaleString("en-IN")} immediately to prevent disallowance of tax deduction and escalation to the National MSME Samadhaan Facilitation Council.

Sincerely,
${business?.name || "Authorized MSME Vendor"}
GSTIN: ${business?.gstin || "27AABCA1234F1Z8"}
Udyam Registration: UDYAM-MH-01-0089124`;
  };

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(getNoticeText());
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const handleExportSamadhaanDossier = () => {
    const overdueRecords = complianceItems.filter((c) => c.isOverdue45);
    if (overdueRecords.length === 0) {
      alert("No invoices currently past 45 days. You are compliant!");
      return;
    }
    const headers = ["Invoice ID", "Customer", "Invoice Date", "Age Days", "Principal Overdue (INR)", "Accrued Penal Interest (19.5% p.a.)", "Total Claim (INR)"];
    const rows = overdueRecords.map((c) => [
      c.id,
      `"${c.customer}"`,
      c.invoiceDate,
      c.ageDays,
      c.amount,
      c.penalInterest,
      Number(c.amount) + Number(c.penalInterest),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSME_Samadhaan_Filing_Dossier_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ModulePage
      title="Vendor & Supplier Hub"
      description="Protect your cash with Section 43B(h) 45-day payment tracking, MSME Samadhaan interest calculations, and Purchase Order management."
    >
      {/* =================================================================
          TOP PICTORIAL HERO & 4 CORE VENDOR KPIS
          ================================================================= */}
      <div className="pictorial-hero-card" style={{ padding: "26px 30px", marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <span className="pictorial-badge emerald" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <ShieldCheck size={13} />
                <span>Section 43B(h) Protected</span>
              </span>
              <span className="pictorial-badge cyan">MSMED Act 2006</span>
              <span className="pictorial-badge purple">Suppliers & Bills Hub</span>
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 8px" }}>
              Vendor Powerhouse: Protect Your Cash & Accelerate Payments
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: 13.8, lineHeight: 1.6, margin: 0 }}>
              Use government statutory rules like <strong>Section 43B(h) (45-Day Mandatory Payment)</strong> and <strong>MSME Samadhaan (3x RBI Bank Rate Penal Interest)</strong> to ensure buyers pay you on time, while managing supplier bills and early payment discounts.
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddPoModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={14} />
                <span>New Purchase Order / Bill</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddVendorModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Building2 size={14} />
                <span>Register Supplier</span>
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleExportSamadhaanDossier}
                style={{ display: "flex", alignItems: "center", gap: 6, borderColor: "rgba(225,29,72,0.3)", color: "var(--accent-rose)" }}
              >
                <Download size={14} />
                <span>Export Samadhaan Dossier</span>
              </button>
            </div>
          </div>

          {/* Quick Compliance Badge Card */}
          <div
            style={{
              padding: "18px 22px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-card)",
              border: "1px solid var(--border-medium)",
              boxShadow: "var(--shadow-sm)",
              minWidth: 230,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Statutory Penal Interest Accrued
            </span>
            <div style={{ fontSize: 24, fontWeight: 800, color: totalAccruedInterest > 0 ? "var(--accent-rose)" : "var(--accent-emerald)", margin: "4px 0" }}>
              {formatMoney(totalAccruedInterest)}
            </div>
            <span style={{ fontSize: 11.5, color: "var(--text-secondary)" }}>
              At 3x RBI Bank Rate ({STATUTORY_INTEREST_RATE}% p.a.)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">📦 Active Suppliers / Vendors</span>
            <div className="card-icon-wrap blue">
              <Building2 size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-blue)" }}>
              {vendors.length}
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>{vendors.filter((v) => v.isMsmeRegistered).length} Registered MSMEs</span>
          </div>
        </div>

        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">💸 Supplier Bills & POs Payable</span>
            <div className="card-icon-wrap amber">
              <Package size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-amber)" }}>
              {formatLakhs(totalPayableOrders)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>{pendingOrders.length} active purchase orders</span>
          </div>
        </div>

        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">⚖️ Section 43B(h) Actionable</span>
            <div className="card-icon-wrap rose">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: total43BhProtected > 0 ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
              {total43BhProtected}
            </span>
          </div>
          <div className="kpi-trend negative">
            <span>Invoices nearing or past 45 days</span>
          </div>
        </div>

        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">⚡ Early Payment Discount ROI</span>
            <div className="card-icon-wrap emerald">
              <Percent size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-emerald)" }}>
              {annualizedDiscountRate}%
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Annualized return on prompt payment</span>
          </div>
        </div>
      </div>

      {/* =================================================================
          INTERACTIVE SUB-VIEW TABS
          ================================================================= */}
      <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 24 }}>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 10, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("msme_43b")}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === "msme_43b" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "msme_43b" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
            }}
          >
            <ShieldAlert size={15} />
            <span>1. Section 43B(h) & Samadhaan Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === "orders" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "orders" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
            }}
          >
            <Package size={15} />
            <span>2. Purchase Orders & Bills Payable</span>
          </button>

          <button
            onClick={() => setActiveTab("discounting")}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === "discounting" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "discounting" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
            }}
          >
            <Percent size={15} />
            <span>3. Dynamic Early Payment Discounting</span>
          </button>

          <button
            onClick={() => setActiveTab("directory")}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 700,
              background: activeTab === "directory" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "directory" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
            }}
          >
            <Building2 size={15} />
            <span>4. Supplier Directory & ITC Reconciler</span>
          </button>
        </div>

        {/* =================================================================
            TAB 1: SECTION 43B(h) & MSME SAMADHAAN TRACKER
            ================================================================= */}
        {activeTab === "msme_43b" && (
          <div>
            <div style={{ padding: "14px 18px", borderRadius: "var(--radius-md)", background: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.2)", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShieldCheck size={20} style={{ color: "var(--accent-blue)" }} />
                <div>
                  <strong style={{ fontSize: 13.5, color: "var(--text-primary)" }}>
                    Section 43B(h) Indian Income Tax Act & MSMED Act Enforcement
                  </strong>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                    Buyers who fail to pay within 45 days face <strong>disallowed tax deductions</strong> and <strong>19.5% statutory compound penal interest</strong>.
                  </p>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleExportSamadhaanDossier}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Download size={13} />
                <span>Export Samadhaan Dossier</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Invoice / Counterparty</th>
                    <th>Invoice Date</th>
                    <th>Age</th>
                    <th>45-Day Statutory Countdown</th>
                    <th>Principal Amount</th>
                    <th>Accrued Penal Interest (19.5% p.a.)</th>
                    <th>Risk Analysis Attributes</th>
                    <th>Cash Recovery & Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complianceItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: 24, color: "var(--text-muted)" }}>
                        No open invoices found. All payments settled!
                      </td>
                    </tr>
                  ) : (
                    complianceItems.map((item) => {
                      const risk = calculateInvoiceRiskAnalysis(item);
                      return (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.customer}</strong>
                            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.id}</div>
                          </td>
                          <td>{item.invoiceDate}</td>
                          <td>
                            <span style={{ fontWeight: 700 }}>{item.ageDays} Days</span>
                          </td>
                          <td>
                            {item.isOverdue45 ? (
                              <span style={{ color: "var(--accent-rose)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                <AlertTriangle size={13} />
                                <span>{Math.abs(item.daysRemaining)}d Past 45-Day Limit</span>
                              </span>
                            ) : item.isWarning ? (
                              <span style={{ color: "var(--accent-amber)", fontWeight: 700 }}>
                                {item.daysRemaining} days left (Warning)
                              </span>
                            ) : (
                              <span style={{ color: "var(--accent-emerald)" }}>
                                {item.daysRemaining} days left (Safe)
                              </span>
                            )}
                          </td>
                          <td>
                            <strong>{formatMoney(item.amount)}</strong>
                          </td>
                          <td>
                            {item.penalInterest > 0 ? (
                              <strong style={{ color: "var(--accent-rose)" }}>
                                +{formatMoney(item.penalInterest)}
                              </strong>
                            ) : (
                              <span style={{ color: "var(--text-muted)" }}>₹0</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 800,
                                  padding: "2px 7px",
                                  borderRadius: "var(--radius-full)",
                                  background: risk.riskBg,
                                  color: risk.riskBadgeColor,
                                  border: `1px solid ${risk.riskBadgeColor}33`,
                                }}
                              >
                                {risk.riskTier}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 800, color: risk.riskBadgeColor }}>
                                {risk.riskScoreIndex}/100
                              </span>
                            </div>
                            <div style={{ fontSize: 10.5, color: "var(--text-secondary)", marginTop: 2 }}>
                              Default Risk: {risk.defaultProbability}%
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm"
                              onClick={() => handleOpenNotice(item)}
                              style={{
                                fontSize: 11,
                                padding: "4px 10px",
                                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))",
                                borderColor: item.isOverdue45 ? "rgba(225,29,72,0.4)" : "rgba(34, 197, 94, 0.4)",
                                color: item.isOverdue45 ? "var(--accent-rose)" : "#22c55e",
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                borderRadius: 6,
                              }}
                            >
                              <Zap size={11} />
                              <span>{item.isOverdue45 ? "⚡ Cash Recovery" : "Send Notice"}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 2: PURCHASE ORDERS & BILLS PAYABLE
            ================================================================= */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Supplier Purchase Orders & Delivery Tracker</h3>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                  Track incoming raw material shipments, delivery statuses, and cash commitments.
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddPoModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={14} />
                <span>New Purchase Order</span>
              </button>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>Supplier / Vendor</th>
                    <th>Item Description</th>
                    <th>Order Date</th>
                    <th>Delivery Status</th>
                    <th>Bill Amount</th>
                    <th>Payment Due</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((po) => (
                    <tr key={po.id}>
                      <td>
                        <strong>{po.id}</strong>
                        {po.invoiceNumber && (
                          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Inv: {po.invoiceNumber}</div>
                        )}
                      </td>
                      <td>
                        <strong>{po.vendorName}</strong>
                      </td>
                      <td style={{ maxWidth: 220, fontSize: 12.5 }}>{po.itemDescription}</td>
                      <td>{po.orderDate}</td>
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            background:
                              po.status === "Delivered"
                                ? "rgba(5,150,105,0.1)"
                                : po.status === "In Transit"
                                ? "rgba(59,130,246,0.1)"
                                : "rgba(245,158,11,0.1)",
                            color:
                              po.status === "Delivered"
                                ? "var(--accent-emerald)"
                                : po.status === "In Transit"
                                ? "var(--accent-blue)"
                                : "var(--accent-amber)",
                          }}
                        >
                          <Truck size={12} />
                          <span>{po.status}</span>
                        </span>
                      </td>
                      <td>
                        <strong>{formatMoney(po.amount)}</strong>
                      </td>
                      <td>
                        <div style={{ fontSize: 12.5 }}>{po.dueDate}</div>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: po.paymentStatus === "Paid" ? "var(--accent-emerald)" : "var(--accent-rose)",
                          }}
                        >
                          {po.paymentStatus === "Paid" ? "✓ Paid" : "⏳ Due Soon"}
                        </span>
                      </td>
                      <td>
                        {po.paymentStatus === "Paid" ? (
                          <span style={{ fontSize: 11.5, color: "var(--accent-emerald)" }}>Settled</span>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => payPurchaseOrder(po.id)}
                            style={{ fontSize: 11, padding: "4px 8px" }}
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 3: DYNAMIC EARLY PAYMENT DISCOUNTING CALCULATOR
            ================================================================= */}
        {activeTab === "discounting" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {/* Interactive Calculator Controls */}
              <div style={{ padding: 20, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Percent size={16} style={{ color: "var(--accent-emerald)" }} />
                  <span>Dynamic Prompt Discount Simulator</span>
                </h3>

                <div className="form-group">
                  <label className="form-label">Invoice / Bill Value (₹ INR)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={calcInvoiceAmount}
                    onChange={(e) => setCalcInvoiceAmount(Number(e.target.value))}
                  />
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label className="form-label">Prompt Payment Discount (%)</label>
                    <strong style={{ color: "var(--accent-emerald)" }}>{calcDiscountPercent}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={calcDiscountPercent}
                    onChange={(e) => setCalcDiscountPercent(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-emerald)" }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    {[1, 1.5, 2, 3].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setCalcDiscountPercent(rate)}
                        style={{
                          fontSize: 10.5,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: calcDiscountPercent === rate ? "var(--accent-emerald)" : "var(--bg-card)",
                          color: calcDiscountPercent === rate ? "#fff" : "var(--text-secondary)",
                          border: "1px solid var(--border-subtle)",
                          cursor: "pointer",
                        }}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label className="form-label">Paid Days Before Due Date</label>
                    <strong style={{ color: "var(--accent-blue)" }}>{calcDaysEarly} Days Early</strong>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="5"
                    value={calcDaysEarly}
                    onChange={(e) => setCalcDaysEarly(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-blue)" }}
                  />
                </div>
              </div>

              {/* Real-time Financial Analysis Output */}
              <div style={{ padding: 20, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>
                    Dual-Perspective Financial Outcome
                  </h3>

                  <div style={{ padding: 14, borderRadius: "var(--radius-sm)", background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.25)", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-emerald)", textTransform: "uppercase" }}>
                      Instant Cash Discount Value
                    </span>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-emerald)", margin: "4px 0" }}>
                      {formatMoney(discountCashSavings)}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      Net settlement amount: <strong>{formatMoney(netPaidEarly)}</strong>
                    </span>
                  </div>

                  <div style={{ padding: 14, borderRadius: "var(--radius-sm)", background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.25)" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-blue)", textTransform: "uppercase" }}>
                      Annualized Return on Capital (APR)
                    </span>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-blue)", margin: "4px 0" }}>
                      {annualizedDiscountRate}% APR
                    </div>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      Paying early yields returns superior to commercial fixed deposits or debt arbitrage.
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  💡 <strong>Tip for Vendors:</strong> Offering a 1.5% discount for settlement within 7 days releases working capital without incurring high interest on bank overdrafts.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            TAB 4: SUPPLIER DIRECTORY & GSTR-2B ITC MATCHING
            ================================================================= */}
        {activeTab === "directory" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by vendor name or GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 240, height: 36 }}
                />
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddVendorModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={14} />
                <span>Register Supplier</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {vendors
                .filter((v) => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((vendor) => (
                  <div
                    key={vendor.id}
                    style={{
                      padding: "16px 18px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>{vendor.name}</strong>
                          <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{vendor.category}</div>
                        </div>
                        {vendor.isMsmeRegistered ? (
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "rgba(5,150,105,0.1)", color: "var(--accent-emerald)" }}>
                            UDYAM VERIFIED
                          </span>
                        ) : (
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "rgba(100,116,139,0.1)", color: "var(--text-muted)" }}>
                            CORPORATE
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                        <strong>GSTIN:</strong> {vendor.gstin || "Unregistered"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                        <strong>Contact:</strong> {vendor.contactPerson} ({vendor.phone})
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                        <strong>Payment Terms:</strong> Net {vendor.paymentTermsDays} Days
                      </div>
                    </div>

                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>GSTR-2B Match:</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 3 }}>
                          <CheckCircle2 size={12} />
                          <span>ITC Active</span>
                        </span>
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent-blue)" }}>
                        {vendor.reliabilityScore}% Reliability
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* =================================================================
          MODAL: OFFICIAL SECTION 43B(h) & CASH RECOVERY DISPATCH
          ================================================================= */}
      {showNoticeModal && selectedNoticeRecord && (
        <CashRecoveryModal
          invoice={selectedNoticeRecord}
          customer={{
            name: selectedNoticeRecord.customer,
            phone: selectedNoticeRecord.phone || "+91 98201 44521",
            contactEmail: selectedNoticeRecord.email || "accounts@counterparty.com",
          }}
          onClose={() => {
            setShowNoticeModal(false);
            setSelectedNoticeRecord(null);
          }}
        />
      )}

      {/* =================================================================
          MODAL: ADD NEW VENDOR / SUPPLIER
          ================================================================= */}
      {showAddVendorModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-lg)",
              maxWidth: 520,
              width: "100%",
              padding: 24,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Register New Supplier / Vendor</h3>
              <button
                onClick={() => setShowAddVendorModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVendor}>
              <div className="form-group">
                <label className="form-label">Vendor Business Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Apex Industrial Supplies"
                  value={newVendorForm.name}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newVendorForm.category}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, category: e.target.value })}
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Tooling & Spares">Tooling & Spares</option>
                    <option value="Logistics & Freight">Logistics & Freight</option>
                    <option value="Professional Services">Professional Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">GSTIN</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="27AABCA1234F1Z8"
                    value={newVendorForm.gstin}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, gstin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Name"
                    value={newVendorForm.contactPerson}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, contactPerson: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91..."
                    value={newVendorForm.phone}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Credit Terms (Days)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newVendorForm.paymentTermsDays}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, paymentTermsDays: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Early Discount (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={newVendorForm.earlyDiscountPercent}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, earlyDiscountPercent: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddVendorModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL: ADD NEW PURCHASE ORDER / BILL
          ================================================================= */}
      {showAddPoModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-medium)",
              borderRadius: "var(--radius-lg)",
              maxWidth: 520,
              width: "100%",
              padding: 24,
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Record Purchase Order / Vendor Bill</h3>
              <button
                onClick={() => setShowAddPoModal(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePo}>
              <div className="form-group">
                <label className="form-label">Select Vendor</label>
                <select
                  required
                  className="form-select"
                  value={newPoForm.vendorId}
                  onChange={(e) => setNewPoForm({ ...newPoForm, vendorId: e.target.value })}
                >
                  <option value="">Select a registered supplier...</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Item / Service Description</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Steel Rods 20mm (5 Tons)"
                  value={newPoForm.itemDescription}
                  onChange={(e) => setNewPoForm({ ...newPoForm, itemDescription: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Amount (₹ INR)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="e.g. 150000"
                    value={newPoForm.amount}
                    onChange={(e) => setNewPoForm({ ...newPoForm, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Invoice Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. INV-881"
                    value={newPoForm.invoiceNumber}
                    onChange={(e) => setNewPoForm({ ...newPoForm, invoiceNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Order Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newPoForm.orderDate}
                    onChange={(e) => setNewPoForm({ ...newPoForm, orderDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newPoForm.dueDate}
                    onChange={(e) => setNewPoForm({ ...newPoForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddPoModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Record Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ModulePage>
  );
}
