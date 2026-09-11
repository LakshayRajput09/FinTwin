import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Wallet,
  FileText,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Zap,
  Users,
  FlaskConical,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Upload,
  Plus,
  Building,
  Save,
  ShieldCheck,
  Landmark,
  Activity,
  Layers,
  ChevronRight,
  HelpCircle,
  BarChart3,
  LineChart as LineChartIcon,
  Sliders,
  Filter,
  Heart,
  Smile,
  Check,
  Calendar,
  Send,
  Copy,
  RefreshCw,
  SlidersHorizontal,
  Bot,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import {
  getFinancialData,
  getBusiness,
  getInvoices,
  getCustomers,
  getVendors,
  updateBusinessProfile,
  updateInvoiceStatus,
  subscribeFinancialData,
} from "../data/financialStore";
import {
  getCashFlowSummary,
  calculateAgingBreakdown,
  generateLocalForecast,
  calculateRunwayDays,
  calculateShockSimulation,
} from "../engines/digitalTwin";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { calculateInvoiceRiskAnalysis } from "../utils/riskRecoveryEngine";
import CashRecoveryModal from "../components/CashRecoveryModal";
import DeepDiveRiskModal from "../components/DeepDiveRiskModal";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { currentTheme } = useTheme();

  // Core Financial Data State
  const [data, setData] = useState(getFinancialData());
  const [summary, setSummary] = useState(getCashFlowSummary());
  const [aging, setAging] = useState(calculateAgingBreakdown());
  const [runway, setRunway] = useState(calculateRunwayDays());

  // Interactive Digital Twin Simulation Mode (Stressed Twin vs Live Books)
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Dynamic Chart Controls
  const [forecastDays, setForecastDays] = useState(30);
  const [forecast, setForecast] = useState(() => generateLocalForecast(30));
  const [chartViewMode, setChartViewMode] = useState("area");
  const [showBestCase, setShowBestCase] = useState(true);
  const [showExpected, setShowExpected] = useState(true);
  const [showWorstCase, setShowWorstCase] = useState(true);
  const [agingMode, setAgingMode] = useState("amount");

  // On-Dashboard Scenario Sandbox Sliders
  const [sandboxDelay, setSandboxDelay] = useState(0);
  const [sandboxRevenueShock, setSandboxRevenueShock] = useState(0);

  // Activity Ledger Filter
  const [activityFilter, setActivityFilter] = useState("all"); // 'all' | 'inflow' | 'outflow' | '43b'
  const [toastMessage, setToastMessage] = useState(null);
  const [dashboardRecoveryInvoice, setDashboardRecoveryInvoice] = useState(null);
  const [dashboardDeepDiveInvoice, setDashboardDeepDiveInvoice] = useState(null);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setData(getFinancialData());
      setSummary(getCashFlowSummary());
      setAging(calculateAgingBreakdown());
      setForecast(generateLocalForecast(forecastDays));
      setRunway(calculateRunwayDays());
    });
    return unsub;
  }, [forecastDays]);

  const handleHorizonChange = (days) => {
    setForecastDays(days);
    setForecast(generateLocalForecast(days));
  };

  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;
  const formatMoney = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;

  // Section 43B(h) Calculations
  const pendingInvoices = data.invoices.filter((i) => i.status !== "Paid");
  const overdue43bInvoices = data.invoices.filter(
    (i) => i.status !== "Paid" && (i.daysOverdue || 0) > 45
  );
  const trapped43bAmount = overdue43bInvoices.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );

  // 3x RBI Bank Rate Compound Penal Interest (~19.5% p.a.)
  const penalRateAnnual = 0.195;
  const penalInterestAccumulated = overdue43bInvoices.reduce((sum, inv) => {
    const daysLate = Math.max(1, (inv.daysOverdue || 46) - 45);
    const principal = Number(inv.amount || 0);
    // Compound monthly interest approximation
    const interest = principal * (Math.pow(1 + penalRateAnnual / 12, daysLate / 30) - 1);
    return sum + interest;
  }, 0);

  // Dynamic Solvency Health Score (0-100)
  const calculateSolvencyScore = () => {
    let score = 0;
    // 1. Runway points (up to 40)
    if (runway >= 60) score += 40;
    else if (runway >= 45) score += 34;
    else if (runway >= 30) score += 24;
    else if (runway >= 15) score += 14;
    else score += 5;

    // 2. 43B(h) compliance ratio (up to 30)
    const totalRec = summary.receivables || 1;
    const safeRatio = Math.max(0, 1 - trapped43bAmount / totalRec);
    score += Math.round(safeRatio * 30);

    // 3. DSO turn velocity (up to 20)
    const dso = summary.dso || 45;
    if (dso <= 35) score += 20;
    else if (dso <= 45) score += 15;
    else if (dso <= 60) score += 10;
    else score += 5;

    // 4. Working Capital Ratio (up to 10)
    if (summary.currentCash > (summary.totalExpenses * 1.5)) score += 10;
    else if (summary.currentCash >= summary.totalExpenses) score += 7;
    else score += 3;

    return Math.min(100, Math.max(10, score));
  };

  const solvencyScore = calculateSolvencyScore();

  // On-Dashboard Scenario Sandbox Calculations
  const sandboxSimulation = calculateShockSimulation({
    paymentDelayDays: sandboxDelay,
    revenueChangePercent: sandboxRevenueShock,
  });

  // Stressed Simulation Shock when Twin Mode is active
  const twinStressedData = calculateShockSimulation({
    paymentDelayDays: 20,
    revenueChangePercent: -10,
  });

  // Display values adapting to Twin Simulation Mode
  const displayCash = isSimulationActive ? twinStressedData.stressedCash : summary.currentCash;
  const displayRunway = isSimulationActive ? twinStressedData.stressedRunway : runway;
  const displayReceivables = summary.receivables;
  const cashVariance = twinStressedData.cashVariance;
  const runwayVariance = twinStressedData.runwayVariance;

  // Copy 43B(h) Statutory Demand Notice
  const copyLegalNotice = (targetInvoice = null) => {
    const inv = targetInvoice || overdue43bInvoices[0] || {
      id: "INV-1002",
      customer: "Auto Corp Ltd",
      amount: trapped43bAmount || 420000,
      daysOverdue: 52,
    };

    const text = `FORMAL STATUTORY DEMAND NOTICE UNDER SECTION 43B(h) OF THE INCOME TAX ACT & MSMED ACT 2006\n\nDate: ${new Date().toLocaleDateString(
      "en-IN"
    )}\nTo: Finance Controller / Accounts Payable Department\nBuyer Entity: ${inv.customer}\n\nSubject: DEMAND FOR PAYMENT - INVOICE ${
      inv.id
    } EXCEEDING 45-DAY STATUTORY TIMELINE\n\nDear Sir/Madam,\n\nThis is an official notice regarding Invoice #${
      inv.id
    } for the sum of ₹${Number(inv.amount || 0).toLocaleString(
      "en-IN"
    )}, which has reached ${
      inv.daysOverdue || 48
    } days since delivery/invoice date.\n\nPlease be advised that under Section 15 & 16 of the MSMED Act 2006 and Section 43B(h) of the Income Tax Act, 1961:\n1. The maximum permissible credit period for MSME suppliers is strictly 45 days.\n2. Any amount remaining unpaid is DISALLOWED as a deductible business expense in your Tax Audit, directly inflating your taxable income.\n3. You are statutorily liable to pay compound penal interest at THREE TIMES THE RBI REPO RATE (~19.5% p.a.) compounded monthly until settlement.\n\nCurrent calculated compound penal interest: ₹${Math.round(
      penalInterestAccumulated || 18450
    ).toLocaleString("en-IN")}.\n\nPlease remit the payment of ₹${(
      Number(inv.amount || 0) + Math.round(penalInterestAccumulated || 18450)
    ).toLocaleString(
      "en-IN"
    )} within 5 business days to avoid filing on the MSME Samadhaan Facilitation Council portal.\n\nSincerely,\nAuthorized Signatory\n${
      user?.company || data.business?.name || "Precision Auto Gears Ltd"
    }`;

    navigator.clipboard.writeText(text);
    setToastMessage("📋 Formal Section 43B(h) Demand Notice copied to clipboard!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick invoice mark as paid
  const handleMarkPaid = (invId) => {
    updateInvoiceStatus(invId, "Paid");
    setToastMessage(`✅ Invoice #${invId} marked as settled!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Activity feed items
  const activityItems = [
    ...data.invoices.map((inv) => ({
      id: inv.id,
      title: `Invoice #${inv.id} - ${inv.customer}`,
      type: "inflow",
      amount: inv.amount,
      status: inv.status,
      date: inv.dueDate,
      daysOverdue: inv.daysOverdue || 0,
      is43b: (inv.daysOverdue || 0) > 45,
      raw: inv,
    })),
    ...data.recurringExpenses.map((rec) => ({
      id: rec.id,
      title: `Committed Outflow - ${rec.category}`,
      type: "outflow",
      amount: rec.amount,
      status: "Scheduled",
      date: `Monthly (${rec.interval || "Fixed"})`,
      daysOverdue: 0,
      is43b: false,
    })),
  ].sort((a, b) => {
    if (a.is43b && !b.is43b) return -1;
    if (!a.is43b && b.is43b) return 1;
    return (b.amount || 0) - (a.amount || 0);
  });

  const filteredActivity = activityItems.filter((item) => {
    if (activityFilter === "inflow") return item.type === "inflow";
    if (activityFilter === "outflow") return item.type === "outflow";
    if (activityFilter === "43b") return item.is43b;
    return true;
  });

  // Chart data for Aging Breakdown
  const totalAgingAmount =
    Object.values(aging).reduce((sum, val) => sum + Number(val || 0), 0) || 1;
  const agingData = [
    {
      name: "0-30 Days",
      value:
        agingMode === "percentage"
          ? Math.round(((aging["0-30 Days"] || 0) / totalAgingAmount) * 100)
          : aging["0-30 Days"] || 0,
      raw: aging["0-30 Days"] || 0,
    },
    {
      name: "31-45 Days",
      value:
        agingMode === "percentage"
          ? Math.round(((aging["31-60 Days"] || 0) * 0.6 / totalAgingAmount) * 100)
          : (aging["31-60 Days"] || 0) * 0.6,
      raw: (aging["31-60 Days"] || 0) * 0.6,
    },
    {
      name: "45-90d ⚠️",
      value:
        agingMode === "percentage"
          ? Math.round(((aging["61-90 Days"] || 0) / totalAgingAmount) * 100)
          : aging["61-90 Days"] || 0,
      raw: aging["61-90 Days"] || 0,
    },
    {
      name: "90d+ 🚨",
      value:
        agingMode === "percentage"
          ? Math.round(((aging["90+ Days"] || 0) / totalAgingAmount) * 100)
          : aging["90+ Days"] || 0,
      raw: aging["90+ Days"] || 0,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="dashboard-floating-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}


      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-1px" }}>Dashboard</h1>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: 14 }}>Liquidity, receivables & cash runway telemetry</p>
      </div>

      {/* =================================================================
          1. DIGITAL TWIN TELEMETRY HERO BANNER

          ================================================================= */}
      <div className={`pictorial-hero-card ${isSimulationActive ? "simulation-active-border" : ""}`} style={{ padding: "26px 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ maxWidth: 740 }}>
            {/* Top Telemetry Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span className="pictorial-badge emerald">
                <Activity size={12} className="spin-slow" />
                <span>Twin Synced (Live Books)</span>
              </span>

              <span className="pictorial-badge cyan">
                <ShieldCheck size={12} />
                <span>ReBIT 1.1.2 AA Linked</span>
              </span>

              <span className="pictorial-badge purple">
                <Building size={12} />
                <span>{user?.company || data.business?.name || "Precision Auto Gears Ltd"}</span>
              </span>

              {/* Simulation Mode Toggle Button */}
              <button
                onClick={() => setIsSimulationActive(!isSimulationActive)}
                className={`dashboard-mode-toggle ${isSimulationActive ? "active" : ""}`}
                title="Toggle Stressed Digital Twin Mode (+20d customer payment delay)"
              >
                <SlidersHorizontal size={13} />
                <span>{isSimulationActive ? "⚡ Stressed Twin Mode" : "Normal Books Mode"}</span>
              </button>
            </div>

            <h1 style={{ fontSize: "clamp(24px, 2.5vw, 30px)", fontWeight: 700, color: "var(--text-primary)", margin: "4px 0 8px", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
              {getGreeting()}, {user?.name?.split(" ")[0] || "Ceo"}! 👋
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: 14.5, lineHeight: 1.6, margin: 0, fontWeight: 450 }}>
              {isSimulationActive ? (
                <span style={{ color: "var(--accent-amber)", fontWeight: 600 }}>
                  ⚠️ Stressed Simulation active: Simulating a 20-day customer collection freeze. Liquid cash compresses by ₹2.80L, reducing runway to {displayRunway} days.
                </span>
              ) : displayRunway > 40 ? (
                <span>
                  Your financial twin is in a <strong>healthy operating state</strong> with <strong>{displayRunway} days of cash buffer</strong>. You have {formatLakhs(summary.receivables)} in receivables flowing in.
                </span>
              ) : (
                <span>
                  Heads up: Your liquid cash buffer stands at <strong>{displayRunway} days</strong>. Resolving {formatLakhs(trapped43bAmount)} trapped past the 45-day MSME window will restore optimal runway.
                </span>
              )}
            </p>

            {/* Quick Action Navigation Bar */}
            <div className="mobile-scroll-x" style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "nowrap" }}>
              
              <div className="quick-action-item" onClick={() => navigate("/invoices")}>
                <div className="quick-action-icon" style={{ background: "#e8f5e9", color: "#2e7d5b" }}><Zap size={18} /></div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Cash Recovery Hub</span>
                  <span className="quick-action-sub">Identify & collect dues</span>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => navigate("/invoices")}>
                <div className="quick-action-icon" style={{ background: "#e3f2fd", color: "#1976d2" }}><Plus size={18} /></div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Upload Invoice</span>
                  <span className="quick-action-sub">CSV, Excel or PDF</span>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => setDashboardDeepDiveInvoice(data.invoices[0] || true)}>
                <div className="quick-action-icon" style={{ background: "#ffebee", color: "#c62828" }}><ShieldAlert size={18} /></div>
                <div className="quick-action-text">
                  <span className="quick-action-title">Deep-Dive Risk Analysis</span>
                  <span className="quick-action-sub">Find hidden risks</span>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => navigate("/vendors")}>
                <div className="quick-action-icon" style={{ background: "#f5f5f5", color: "#424242" }}><Grid size={18} /></div>
                <div className="quick-action-text">
                  <span className="quick-action-title">MSME 43B(h) Radar</span>
                  <span className="quick-action-sub">Check eligibility</span>
                </div>
              </div>

              <div className="quick-action-item" onClick={() => navigate("/financing")}>
                <div className="quick-action-icon" style={{ background: "#e8f5e9", color: "#2e7d5b" }}><Landmark size={18} /></div>
                <div className="quick-action-text">
                  <span className="quick-action-title">TReDS & CGTMSE Loans</span>
                  <span className="quick-action-sub">Explore options</span>
                </div>
              </div>

            </div>
          </div>

          {/* Solvency Health Score Radar Gauge */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="96" height="96" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="transparent" stroke="rgba(0,0,0,0.05)" strokeWidth="6" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="transparent"
                  stroke={solvencyScore >= 75 ? "#1F5A4A" : solvencyScore >= 50 ? "var(--accent-amber)" : "var(--accent-rose)"}
                  strokeWidth={6}
                  strokeDasharray={251}
                  strokeDashoffset={251 - (solvencyScore / 100) * 251}
                  strokeLinecap="round"
                  transform="rotate(-90 48 48)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                  {solvencyScore}
                </span>
                <span style={{ fontSize: 8, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, marginTop: 4, letterSpacing: 0.5 }}>
                  Health Score
                </span>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1F5A4A", marginBottom: 4 }}>
                {solvencyScore >= 75 ? "Excellent Solvency" : solvencyScore >= 50 ? "Moderate Liquidity" : "High Risk Exposure"}
              </span>
              <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>
                <span>Buffer: {displayRunway}d</span>
                <span>•</span>
                <span>DSO: {summary.dso || 42}d</span>
              </div>
              <button style={{ background: "white", border: "1px solid rgba(0,0,0,0.08)", padding: "4px 12px", borderRadius: 12, fontSize: 11, fontWeight: 600, color: "var(--text-primary)", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
                View Details →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          2. PROACTIVE GEMINI COPILOT INTELLIGENCE BANNER
          ================================================================= */}
      <div className="insight-card">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e8f5e9", color: "#1F5A4A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Sparkles size={16} fill="currentColor" />
          </div>

          <div style={{ flex: 1, zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                FinTwin Insight
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: "#4f5a6b", background: "#e2e8f0", padding: "2px 8px", borderRadius: 12, textTransform: "uppercase" }}>
                AUTOMATED FINANCIAL TWIN TELEMETRY
              </span>
            </div>

            <p style={{ margin: "0 0 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: "80%" }}>
              {trapped43bAmount > 0 ? (
                <span>
                  Detected <strong>₹{formatLakhs(trapped43bAmount)}</strong> in pending payments exceeding the statutory 45-day limit. Buyers owe an estimated <strong>₹{Math.round(penalInterestAccumulated).toLocaleString("en-IN")}</strong> in compound penal interest. Discounting via TReDS or issuing legal demand notices will inject immediate cash before month-end obligations.
                </span>
              ) : (
                <span>
                  Collections are disciplined with zero 45-day defaults. You qualify for <strong>CGTMSE 85% government collateral-free credit</strong> to fund plant upgrades with zero property mortgage.
                </span>
              )}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => navigate("/financing")}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#1F5A4A", color: "white", border: "none", padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 10px rgba(31,90,74,0.2)" }}
              >
                <Landmark size={14} />
                <span>Auction Invoices on TReDS</span>
              </button>

              <button 
                onClick={() => navigate("/simulator")}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.8)", color: "var(--text-primary)", border: "1px solid rgba(0,0,0,0.1)", padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)" }}
              >
                <Sliders size={14} />
                <span>Simulate Runway Shocks</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* =================================================================
          3. DYNAMIC 4 PRIMARY KPI SUMMARY CARDS
          ================================================================= */}
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
          <span>Financial Position</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent-emerald)" }}>
             <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></span> Live
          </span>
        </h2>
        <div style={{ height: 1, background: "var(--border-subtle)", marginTop: 8, marginBottom: 20 }}></div>
      </div>
      <div className="metric-row">
        <div className="metric-col">
          <div className="metric-icon" style={{ background: "#e8f5e9", color: "#2e7d5b" }}>
            <Wallet size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 750, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                {formatLakhs(displayCash)}
              </span>
              {isSimulationActive && (
                <span style={{ fontSize: 11, background: "#ffebee", color: "#c62828", padding: "2px 6px", borderRadius: 12, fontWeight: 650, fontVariantNumeric: "tabular-nums" }}>
                  -₹{Math.abs(cashVariance / 100000).toFixed(2)}L
                </span>
              )}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Money in the Bank</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2e7d5b", fontWeight: 500 }}>
              <ArrowUpRight size={12} />
              <span>{displayRunway} days of operational burn</span>
            </div>
          </div>
        </div>

        <div className="metric-col">
          <div className="metric-icon" style={{ background: "#e3f2fd", color: "#1976d2" }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 750, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                {formatLakhs(displayReceivables)}
              </span>
              {trapped43bAmount > 0 && (
                <span style={{ fontSize: 11, background: "#fff3e0", color: "#ef6c00", padding: "2px 6px", borderRadius: 12, fontWeight: 650 }}>
                  {overdue43bInvoices.length} in 43B(h)
                </span>
              )}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Receivables Pipeline</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
              <Clock size={12} />
              <span>{pendingInvoices.length} invoices ({summary.dso}d avg)</span>
            </div>
          </div>
        </div>

        <div className="metric-col">
          <div className="metric-icon" style={{ background: "#fff3e0", color: "#e65100" }}>
            <CreditCard size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 750, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                {formatLakhs(summary.totalExpenses)}
              </span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Monthly Expense Burn</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c62828", fontWeight: 500 }}>
              <ArrowDownRight size={12} />
              <span>{formatLakhs(summary.recurringExpenses)} fixed staff & rent</span>
            </div>
          </div>
        </div>

        <div className="metric-col">
          <div className="metric-icon" style={{ background: "#e8f5e9", color: "#2e7d5b" }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 750, color: summary.projectedCash >= 0 ? "var(--text-primary)" : "#c62828", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                {formatLakhs(isSimulationActive ? twinStressedData.stressedCash : summary.projectedCash)}
              </span>
              {isSimulationActive && (
                <span style={{ fontSize: 11, background: "#ffebee", color: "#c62828", padding: "2px 6px", borderRadius: 12, fontWeight: 650 }}>
                  Stressed
                </span>
              )}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Projected Stand in {forecastDays}d</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2e7d5b", fontWeight: 500 }}>
              <Zap size={12} />
              <span>Net position after collections</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          4. 90-DAY CASH FLOW TELEMETRY & AGING BREAKDOWN
          ================================================================= */}
      <div className="grid-12">
        {/* Dynamic Cash Flow Forecast */}
        <div className="col-span-8 solid-card">
          <div className="card-header" style={{ flexWrap: "wrap", gap: 14 }}>
            <div className="card-title-group">
              <div className="card-icon-wrap blue">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="card-title">90-Day Digital Twin Cash Trajectory</div>
                <div className="card-subtitle">
                  Visual projection of money coming in vs money going out
                </div>
              </div>
            </div>

            {/* Dynamic Controls */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {/* Horizon Selector */}
              <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: 8, padding: 2, border: "1px solid var(--border-subtle)" }}>
                {[7, 15, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => handleHorizonChange(days)}
                    style={{
                      padding: "4px 9px",
                      borderRadius: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: forecastDays === days ? currentTheme.primaryAccent : "transparent",
                      color: forecastDays === days ? "#fff" : "var(--text-secondary)",
                      transition: "all 0.15s ease",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {days}D
                  </button>
                ))}
              </div>

              {/* View Selector */}
              <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: 8, padding: 2, border: "1px solid var(--border-subtle)" }}>
                <button
                  onClick={() => setChartViewMode("area")}
                  className={`tab-btn ${chartViewMode === "area" ? "active" : ""}`}
                  style={{ padding: "4px 8px", fontSize: 11.5 }}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartViewMode("line")}
                  className={`tab-btn ${chartViewMode === "line" ? "active" : ""}`}
                  style={{ padding: "4px 8px", fontSize: 11.5 }}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartViewMode("bar")}
                  className={`tab-btn ${chartViewMode === "bar" ? "active" : ""}`}
                  style={{ padding: "4px 8px", fontSize: 11.5 }}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>

          {/* Series Toggle Buttons */}
          <div className="mobile-scroll-x" style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 12px", background: "var(--bg-secondary)", borderRadius: 8, marginBottom: 10, flexWrap: "nowrap", border: "1px solid var(--border-subtle)", overflowX: "auto" }}>
            <span style={{ fontSize: 11.5, color: "var(--text-muted)", marginRight: 4, flexShrink: 0 }}>Layers:</span>
            <button
              onClick={() => setShowExpected(!showExpected)}
              style={{
                fontSize: 11.5,
                padding: "2px 8px",
                borderRadius: 12,
                background: showExpected ? "rgba(79,70,229,0.12)" : "transparent",
                color: showExpected ? "var(--accent-blue)" : "var(--text-muted)",
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              Expected Cash
            </button>
            <button
              onClick={() => setShowBestCase(!showBestCase)}
              style={{
                fontSize: 11.5,
                padding: "2px 8px",
                borderRadius: 12,
                background: showBestCase ? "rgba(5,150,105,0.12)" : "transparent",
                color: showBestCase ? "var(--accent-emerald)" : "var(--text-muted)",
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              Early Settlements
            </button>
            <button
              onClick={() => setShowWorstCase(!showWorstCase)}
              style={{
                fontSize: 11.5,
                padding: "2px 8px",
                borderRadius: 12,
                background: showWorstCase ? "rgba(225,29,72,0.12)" : "transparent",
                color: showWorstCase ? "var(--accent-rose)" : "var(--text-muted)",
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              30d Late Shock
            </button>
          </div>

          <div style={{ height: 280, width: "100%", marginTop: 4 }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartViewMode === "area" ? (
                <AreaChart data={forecast.timeline} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="forecastExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentTheme.primaryAccent} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={currentTheme.primaryAccent} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="forecastBest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D5B" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2E7D5B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "var(--shadow-md)",
                      color: "var(--text-primary)",
                    }}
                    formatter={(val, name) => [
                      formatMoney(val),
                      name === "expectedCash" ? "Expected Balance" : name === "bestCase" ? "Best Case (Early)" : "Late Collections",
                    ]}
                  />
                  {showBestCase && (
                    <Area
                      type="monotone"
                      dataKey="bestCase"
                      stroke="#2E7D5B"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="url(#forecastBest)"
                      animationDuration={400}
                    />
                  )}
                  {showExpected && (
                    <Area
                      type="monotone"
                      dataKey="expectedCash"
                      stroke={currentTheme.primaryAccent}
                      strokeWidth={2.5}
                      fill="url(#forecastExpected)"
                      animationDuration={400}
                    />
                  )}
                  {showWorstCase && (
                    <Area
                      type="monotone"
                      dataKey="worstCase"
                      stroke="#B54747"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="transparent"
                      animationDuration={400}
                    />
                  )}
                </AreaChart>
              ) : chartViewMode === "line" ? (
                <LineChart data={forecast.timeline} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "var(--shadow-md)",
                      color: "var(--text-primary)",
                    }}
                    formatter={(val) => [formatMoney(val)]}
                  />
                  {showBestCase && (
                    <Line type="monotone" dataKey="bestCase" stroke="#2E7D5B" strokeWidth={2} dot={false} animationDuration={400} />
                  )}
                  {showExpected && (
                    <Line type="monotone" dataKey="expectedCash" stroke={currentTheme.primaryAccent} strokeWidth={2.5} dot={false} animationDuration={400} />
                  )}
                  {showWorstCase && (
                    <Line type="monotone" dataKey="worstCase" stroke="#B54747" strokeWidth={2} strokeDasharray="3 3" dot={false} animationDuration={400} />
                  )}
                </LineChart>
              ) : (
                <BarChart data={forecast.timeline.filter((_, idx) => idx % Math.max(1, Math.floor(forecastDays / 10)) === 0)} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "var(--shadow-md)",
                      color: "var(--text-primary)",
                    }}
                    formatter={(val) => [formatMoney(val)]}
                  />
                  <Bar dataKey="expectedCash" fill={currentTheme.primaryAccent} radius={[4, 4, 0, 0]} animationDuration={400} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 43B(h) & Receivables Aging Breakdown */}
        <div className="col-span-4 solid-card">
          <div className="card-header" style={{ flexWrap: "wrap", gap: 10 }}>
            <div className="card-title-group">
              <div className="card-icon-wrap amber">
                <Clock size={18} />
              </div>
              <div>
                <div className="card-title">Pending Invoices by Age</div>
                <div className="card-subtitle">45-day statutory MSME windows</div>
              </div>
            </div>

            {/* Metric Mode Switcher */}
            <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: 6, padding: 2, border: "1px solid var(--border-subtle)" }}>
              <button
                onClick={() => setAgingMode("amount")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  background: agingMode === "amount" ? "var(--bg-card)" : "transparent",
                  color: agingMode === "amount" ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ₹ Value
              </button>
              <button
                onClick={() => setAgingMode("percentage")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  background: agingMode === "percentage" ? "var(--bg-card)" : "transparent",
                  color: agingMode === "percentage" ? "var(--text-primary)" : "var(--text-muted)",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                % Share
              </button>
            </div>
          </div>

          <div style={{ height: 280, width: "100%", marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10.5} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={10.5}
                  tickLine={false}
                  tickFormatter={(val) => (agingMode === "percentage" ? `${val}%` : `₹${(val / 100000).toFixed(1)}L`)}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "var(--shadow-md)",
                    color: "var(--text-primary)",
                  }}
                  formatter={(val, _, props) => [
                    agingMode === "percentage" ? `${val}% (${formatMoney(props.payload.raw)})` : formatMoney(val),
                    "Amount",
                  ]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36} animationDuration={400}>
                  {agingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#1F5A4A" : index === 1 ? "#2E7D5B" : index === 2 ? "#B7791F" : "#B54747"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =================================================================
          5. ON-DASHBOARD SCENARIO SANDBOX & SECTION 43B(h) RADAR
          ================================================================= */}
      <div className="grid-12">
        {/* On-Dashboard Scenario Sandbox */}
        <div className="col-span-6 solid-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap purple">
                <Sliders size={18} />
              </div>
              <div>
                <div className="card-title">Live What-If Scenario Sandbox</div>
                <div className="card-subtitle">Drag sliders to test cash flow resilience in real-time</div>
              </div>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() =>
                navigate("/simulator", {
                  state: { delayDays: sandboxDelay, revenueShock: sandboxRevenueShock },
                })
              }
            >
              <span>Full Simulator</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
            {/* Slider 1: Payment Delay */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Customer Payment Delay</span>
                <span style={{ fontWeight: 800, color: sandboxDelay > 30 ? "var(--accent-rose)" : "var(--accent-blue)" }}>
                  +{sandboxDelay} Days
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={sandboxDelay}
                onChange={(e) => setSandboxDelay(Number(e.target.value))}
                className="range-slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)" }}>
                <span>On-time (0d)</span>
                <span>Section 43B(h) Limit (45d)</span>
                <span>Severe Freeze (+60d)</span>
              </div>
            </div>

            {/* Slider 2: Revenue Shock */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Monthly Revenue Shift</span>
                <span style={{ fontWeight: 800, color: sandboxRevenueShock < 0 ? "var(--accent-rose)" : "var(--accent-emerald)" }}>
                  {sandboxRevenueShock > 0 ? `+${sandboxRevenueShock}%` : `${sandboxRevenueShock}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="5"
                value={sandboxRevenueShock}
                onChange={(e) => setSandboxRevenueShock(Number(e.target.value))}
                className="range-slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)" }}>
                <span>-30% Demand Slump</span>
                <span>Baseline (0%)</span>
                <span>+30% Boom</span>
              </div>
            </div>

            {/* Live Reactive Results Box */}
            <div className="sandbox-results-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                    Simulated Runway
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 750, fontVariantNumeric: "tabular-nums", color: sandboxSimulation.stressedRunway > 35 ? "var(--accent-emerald)" : "var(--accent-rose)", marginTop: 2 }}>
                    {sandboxSimulation.stressedRunway} Days
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                    Simulated Liquid Cash
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 750, fontVariantNumeric: "tabular-nums", color: "var(--text-primary)", marginTop: 2 }}>
                    ₹{(sandboxSimulation.stressedCash / 100000).toFixed(2)}L
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, borderTop: "1px solid var(--border-subtle)", paddingTop: 8 }}>
                {sandboxDelay > 45 ? (
                  <span style={{ color: "var(--accent-rose)", fontWeight: 600 }}>
                    ⚠️ Section 43B(h) triggered: Buyers legally incur 19.5% compound interest. Issue statutory legal demand notice now.
                  </span>
                ) : (
                  <span>
                    💡 Runway buffer is safe. Factoring pending accounts on TReDS will unlock immediate liquid capital without collateral.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 43B(h) Trapped Capital Radar */}
        <div className="col-span-6 solid-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap rose">
                <ShieldAlert size={18} />
              </div>
              <div>
                <div className="card-title">Section 43B(h) MSME Trapped Capital</div>
                <div className="card-subtitle">45-day statutory payment enforcement & interest</div>
              </div>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/vendors")}>
              <span>Compliance Matrix</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            {/* Metric Banner */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderRadius: "var(--radius-md)", background: "rgba(225,29,72,0.06)", border: "1px solid rgba(225,29,72,0.2)" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Statutory 45-Day Violations
                </div>
                <div style={{ fontSize: 24, fontWeight: 750, fontVariantNumeric: "tabular-nums", color: "var(--accent-rose)", marginTop: 2 }}>
                  ₹{(trapped43bAmount / 100000).toFixed(2)}L
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                  Across {overdue43bInvoices.length} enterprise buyer accounts
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Accumulated Penal Interest
                </div>
                <div style={{ fontSize: 22, fontWeight: 750, fontVariantNumeric: "tabular-nums", color: "var(--accent-amber)", marginTop: 2 }}>
                  ₹{Math.round(penalInterestAccumulated).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                  3x RBI repo rate (~19.5% p.a.)
                </div>
              </div>
            </div>

            {/* Overdue Debtors Breakdown List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {overdue43bInvoices.slice(0, 3).map((inv) => (
                <div key={inv.id} className="debtor-row-card">
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      {inv.customer}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Invoice #{inv.id} • {inv.daysOverdue} days open ({inv.daysOverdue - 45}d past statutory cutoff)
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--accent-rose)" }}>
                      ₹{Number(inv.amount || 0).toLocaleString("en-IN")}
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "4px 8px", fontSize: 11 }}
                      onClick={() => copyLegalNotice(inv)}
                      title="Copy legal notice for this invoice"
                    >
                      <Copy size={12} />
                      <span>Notice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 1-Click Action */}
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", gap: 8 }}
              onClick={() => copyLegalNotice()}
            >
              <FileText size={15} />
              <span>Copy Formal Section 43B(h) Demand Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================
          6. RECENT FINANCIAL ACTIVITY & INFLOW LEDGER
          ================================================================= */}
      <div className="solid-card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap emerald">
              <Activity size={18} />
            </div>
            <div>
              <div className="card-title">Live Transaction Pulse & Inflow Stream</div>
              <div className="card-subtitle">Real-time status of client invoices and scheduled outflows</div>
            </div>
          </div>

          {/* Activity Filters */}
          <div style={{ display: "flex", gap: 6, background: "var(--bg-secondary)", borderRadius: 8, padding: 3, border: "1px solid var(--border-subtle)" }}>
            <button
              className={`category-tab-btn ${activityFilter === "all" ? "active" : ""}`}
              onClick={() => setActivityFilter("all")}
            >
              All Items ({activityItems.length})
            </button>
            <button
              className={`category-tab-btn ${activityFilter === "inflow" ? "active" : ""}`}
              onClick={() => setActivityFilter("inflow")}
            >
              Inflows
            </button>
            <button
              className={`category-tab-btn ${activityFilter === "outflow" ? "active" : ""}`}
              onClick={() => setActivityFilter("outflow")}
            >
              Bills & Salaries
            </button>
            <button
              className={`category-tab-btn ${activityFilter === "43b" ? "active" : ""}`}
              onClick={() => setActivityFilter("43b")}
            >
              43B(h) Breaches
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive" style={{ marginTop: 8 }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Type</th>
                <th>Due / Schedule</th>
                <th>Amount</th>
                <th>Risk Analysis & Sec 43B(h)</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Cash Recovery & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivity.slice(0, 6).map((item, idx) => {
                const isInvoice = item.type === "inflow" && item.raw;
                const cust = isInvoice
                  ? data.customers.find((c) => c.name === item.raw.customer || c.id === item.raw.customerId)
                  : null;
                const risk = isInvoice ? calculateInvoiceRiskAnalysis(item.raw, cust) : null;

                return (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{item.title}</div>
                      {item.is43b && (
                        <span style={{ fontSize: 10.5, color: "var(--accent-rose)", fontWeight: 600 }}>
                          ⚠️ Exceeds 45-day MSME window ({item.daysOverdue}d)
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, color: item.type === "inflow" ? "var(--accent-blue)" : "var(--accent-amber)" }}>
                        {item.type === "inflow" ? "Incoming Receivables" : "Outgoing Liability"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.date}</td>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: 13.5, color: item.type === "inflow" ? "var(--accent-emerald)" : "var(--text-primary)" }}>
                        {item.type === "inflow" ? `+${formatMoney(item.amount)}` : `-${formatMoney(item.amount)}`}
                      </div>
                      {isInvoice && item.status !== "Paid" && risk && risk.accruedPenalInterest > 0 && (
                        <div style={{ fontSize: 10.5, color: "var(--accent-purple)", fontWeight: 700 }}>
                          +₹{risk.accruedPenalInterest.toLocaleString("en-IN")} penal int.
                        </div>
                      )}
                    </td>
                    <td>
                      {isInvoice && risk ? (
                        <div
                          onClick={() => setDashboardDeepDiveInvoice(item)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            cursor: "pointer",
                            padding: "3px 6px",
                            borderRadius: 6,
                            background: "var(--bg-secondary)",
                            border: "1px dashed var(--border-medium)",
                            transition: "all 0.15s ease",
                          }}
                          title="Click to view Deep-Dive Risk Analysis"
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                padding: "2px 6px",
                                borderRadius: "var(--radius-full)",
                                background: risk.riskBg,
                                color: risk.riskBadgeColor,
                                border: `1px solid ${risk.riskBadgeColor}33`,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 3,
                              }}
                            >
                              <ShieldAlert size={9} />
                              {risk.riskTier}
                            </span>
                            <span style={{ fontSize: 10.5, fontWeight: 800, color: risk.riskBadgeColor }}>
                              {risk.riskScoreIndex}/100
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: 9.5,
                              fontWeight: 600,
                              color: risk.section43bSeverity === "critical" ? "var(--accent-rose)" : "var(--text-muted)",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>43B(h): {risk.section43bStatus}</span>
                            <span style={{ color: "var(--accent-blue)", fontWeight: 700 }}>🔍 Deep Dive</span>
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "Paid"
                            ? "paid"
                            : item.is43b
                            ? "overdue"
                            : item.status === "Overdue"
                            ? "overdue"
                            : "pending"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        {item.type === "inflow" && item.status !== "Paid" && (
                          <button
                            className="btn btn-sm"
                            style={{
                              background: "var(--bg-tertiary)",
                              border: "1px solid rgba(34, 197, 94, 0.4)",
                              color: "#2E7D5B",
                              padding: "4px 8px",
                              fontSize: 11,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                            onClick={() => setDashboardRecoveryInvoice(item.raw)}
                            title="Send WhatsApp & Email Cash Recovery Notice"
                          >
                            <Zap size={12} style={{ color: "#2E7D5B" }} />
                            <span>⚡ Cash Recovery</span>
                          </button>
                        )}

                        {item.type === "inflow" && item.status !== "Paid" ? (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px", fontSize: 11 }}
                            onClick={() => handleMarkPaid(item.id)}
                            title="Mark Settled"
                          >
                            <Check size={12} />
                          </button>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>On Schedule</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================================
          7. GAMIFIED MSME MILESTONES & COMPLIANCE BADGES
          ================================================================= */}
      <div className="dashboard-milestones-row">
        <div className="milestone-badge-card">
          <div className="milestone-icon-wrap emerald">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
              Section 43B(h) Protected
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Automated 45-day calculation & 19.5% penal notices active
            </div>
          </div>
        </div>

        <div className="milestone-badge-card">
          <div className="milestone-icon-wrap cyan">
            <Landmark size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
              TReDS Pre-Qualified
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Eligible for 24-hr bill discounting across RXIL & M1xchange
            </div>
          </div>
        </div>

        <div className="milestone-badge-card">
          <div className="milestone-icon-wrap purple">
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
              ReBIT 1.1.2 AA Consent
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              End-to-end Curve25519 encrypted banking statements
            </div>
          </div>
        </div>

        <div className="milestone-badge-card">
          <div className="milestone-icon-wrap amber">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
              CGTMSE Credit Ready
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
              Pre-scored for ₹5Cr collateral-free government credit
            </div>
          </div>
        </div>
      </div>

      {/* Cash Recovery & WhatsApp/Email Dispatch Modal */}
      {dashboardRecoveryInvoice && (
        <CashRecoveryModal
          invoice={dashboardRecoveryInvoice}
          customer={data.customers.find(
            (c) =>
              c.name === dashboardRecoveryInvoice.customer ||
              c.id === dashboardRecoveryInvoice.customerId
          )}
          onClose={() => setDashboardRecoveryInvoice(null)}
          onActionComplete={(status) => {
            setToastMessage(`Recovery update logged: ${status}`);
            setTimeout(() => setToastMessage(null), 4000);
          }}
        />
      )}

      {/* Deep-Dive Institutional Risk Underwriting Modal */}
      {dashboardDeepDiveInvoice && (
        <DeepDiveRiskModal
          invoice={dashboardDeepDiveInvoice === true ? data.invoices[0] : dashboardDeepDiveInvoice}
          onClose={() => setDashboardDeepDiveInvoice(null)}
          onOpenRecovery={() => {
            const inv = dashboardDeepDiveInvoice === true ? data.invoices[0] : dashboardDeepDiveInvoice;
            setDashboardRecoveryInvoice(inv);
            setDashboardDeepDiveInvoice(null);
          }}
        />
      )}
    </div>
  );
}