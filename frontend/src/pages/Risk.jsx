import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  Wallet,
  Users,
  Receipt,
  Brain,
  Download,
  Zap,
  CheckCircle2,
  ExternalLink,
  FileText,
  SlidersHorizontal,
  Layers,
  Scale,
  Building,
  AlertOctagon,
  Percent,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";

import {
  getFinancialData,
  getBusiness,
  getInvoices,
  getCustomers,
  getExpenses,
  getRecurringExpenses,
  subscribeFinancialData,
} from "../data/financialStore";
import { calculateInvoiceRiskAnalysis } from "../utils/riskRecoveryEngine";
import { generateLocalForecast } from "../engines/digitalTwin";
import CashRecoveryModal from "../components/CashRecoveryModal";
import DeepDiveRiskModal from "../components/DeepDiveRiskModal";
import { useTheme } from "../context/ThemeContext";

export default function Risk() {
  const { currentTheme } = useTheme();

  // Core Data Stores
  const [data, setData] = useState(getFinancialData());
  const [business, setBusiness] = useState(getBusiness());
  const [invoices, setInvoices] = useState(getInvoices());
  const [customers, setCustomers] = useState(getCustomers());

  // Interactive What-If Scenario Stress Sliders
  const [revenueShock, setRevenueShock] = useState(0); // -30% to +20%
  const [debtorDelayShock, setDebtorDelayShock] = useState(0); // 0 to 45 days
  const [rateHikeBps, setRateHikeBps] = useState(0); // 0 to 300 bps

  // Modals State
  const [selectedRecoveryInvoice, setSelectedRecoveryInvoice] = useState(null);
  const [showDeepDiveModal, setShowDeepDiveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Sync data across stores
  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setData(getFinancialData());
      setBusiness(getBusiness());
      setInvoices(getInvoices());
      setCustomers(getCustomers());
    });
    return unsub;
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // =================================================================
  // COMPREHENSIVE FINANCIAL RISK METRICS ENGINE
  // =================================================================
  const riskMetrics = useMemo(() => {
    const today = new Date();
    const currentCash = Number(business?.openingCash || data.business?.openingCash || 1240000);
    const monthlyRev = Number(business?.monthlyRevenue || data.business?.monthlyRevenue || 1450000);
    const recurringList = data.recurringExpenses || [];
    const oneTimeList = data.expenses || [];

    const monthlyRecurring = recurringList.reduce((s, e) => s + Number(e.amount || 0), 0) || 320000;
    const monthlyOneTime = oneTimeList.reduce((s, e) => s + Number(e.amount || 0), 0) || 225000;
    const monthlyBurn = monthlyRecurring + Math.round(monthlyOneTime / 2);

    const outstandingInvoices = (invoices || []).filter(
      (inv) => String(inv.status || "").toLowerCase() !== "paid"
    );

    const totalReceivables = outstandingInvoices.reduce(
      (sum, inv) => sum + Number(inv.amount || 0),
      0
    );

    // Overdue & Section 43B(h) analysis
    const overdueInvoices = [];
    let weightedDelayDays = 0;
    let totalDelayedAmount = 0;
    let totalAccruedPenalInterest = 0;

    outstandingInvoices.forEach((inv) => {
      const dueDate = new Date(inv.dueDate || inv.due_date || today);
      const diffTime = today - dueDate;
      const actualOverdueDays = Math.max(0, Math.floor(diffTime / 86400000));
      const effectiveDelay = actualOverdueDays > 0 ? actualOverdueDays : Number(inv.predictedDelayDays || inv.predicted_delay_days || 8);
      const amount = Number(inv.amount || 0);

      // Section 16 MSMED Act: 3x RBI Bank Rate (~19.5% p.a.)
      const penalInterest = Math.round(amount * (0.195 / 365) * effectiveDelay);
      totalAccruedPenalInterest += penalInterest;

      const isOverdue =
        String(inv.status || "").toLowerCase() === "overdue" ||
        actualOverdueDays > 0 ||
        effectiveDelay > 15;

      if (isOverdue) {
        overdueInvoices.push({
          ...inv,
          effectiveDelay,
          actualOverdueDays,
          penalInterest,
          riskAnalysis: calculateInvoiceRiskAnalysis(inv, null, business),
        });
        weightedDelayDays += amount * effectiveDelay;
        totalDelayedAmount += amount;
      }
    });

    const averagePredictedDelay =
      totalDelayedAmount > 0
        ? (weightedDelayDays / totalDelayedAmount).toFixed(1)
        : "8.5";

    // Section 43B(h) Breaches (>45 Days statutory deadline)
    const breaches43b = overdueInvoices.filter((inv) => inv.effectiveDelay > 45);

    // Customer Concentration Breakdown
    const customerMap = {};
    outstandingInvoices.forEach((inv) => {
      const custName = inv.customer || inv.customerId || "General Client";
      customerMap[custName] = (customerMap[custName] || 0) + Number(inv.amount || 0);
    });

    const sortedCustomers = Object.entries(customerMap)
      .map(([name, amount]) => ({
        customer: name,
        amount,
        percentage: totalReceivables > 0 ? Math.round((amount / totalReceivables) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCustomer = sortedCustomers[0] || { customer: "N/A", amount: 0, percentage: 0 };
    const top3Concentration = sortedCustomers.slice(0, 3).reduce((s, c) => s + c.percentage, 0);

    // Cash Runway & Burn Ratios
    const baselineRunwayDays = monthlyBurn > 0 ? Math.round(currentCash / (monthlyBurn / 30)) : 180;
    const cashCoverageMonths = monthlyRecurring > 0 ? (currentCash / monthlyRecurring).toFixed(1) : "3.5";

    // -------------------------------------------------------------
    // Stressed Financial Simulation (Reflecting User Sliders)
    // -------------------------------------------------------------
    const stressedRevenue = monthlyRev * (1 + revenueShock / 100);
    const stressedOperatingProfit = Math.max(15000, stressedRevenue - monthlyBurn);
    const effectiveLoanRate = 9.5 + rateHikeBps / 100;
    const principalLoan = 500000;
    const monthlyRate = effectiveLoanRate / 12 / 100;
    const stressedEMI = Math.round(
      (principalLoan * monthlyRate * Math.pow(1 + monthlyRate, 36)) /
        (Math.pow(1 + monthlyRate, 36) - 1)
    );

    const dscrRatio = Number((stressedOperatingProfit / stressedEMI).toFixed(2));
    const foirPercent = Math.min(100, Math.round((stressedEMI / stressedRevenue) * 100));
    const stressedRunwayDays = Math.max(
      14,
      Math.round(baselineRunwayDays * (1 + revenueShock / 120) - debtorDelayShock * 0.8)
    );

    // Solvency Health Score (0 - 100)
    let bankabilityScore = 86;
    if (dscrRatio < 1.5) bankabilityScore -= 22;
    if (foirPercent > 40) bankabilityScore -= 16;
    if (topCustomer.percentage > 45) bankabilityScore -= 12;
    if (Number(averagePredictedDelay) > 20) bankabilityScore -= 14;
    if (breaches43b.length > 0) bankabilityScore -= 10;
    if (revenueShock < 0) bankabilityScore += Math.round(revenueShock * 0.4);
    if (debtorDelayShock > 15) bankabilityScore -= Math.round((debtorDelayShock - 15) * 0.5);

    bankabilityScore = Math.max(20, Math.min(98, bankabilityScore));

    const solvencyTier =
      bankabilityScore >= 75
        ? { label: "Bankable Prime (Low Risk)", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" }
        : bankabilityScore >= 50
        ? { label: "Moderate Risk (Watchlist)", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" }
        : { label: "Critical Risk (Debt Burden Alert)", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" };

    return {
      currentCash,
      monthlyRev,
      monthlyBurn,
      monthlyRecurring,
      totalReceivables,
      totalDelayedAmount,
      totalAccruedPenalInterest,
      averagePredictedDelay,
      overdueInvoices,
      breaches43b,
      sortedCustomers,
      topCustomer,
      top3Concentration,
      baselineRunwayDays,
      stressedRunwayDays,
      cashCoverageMonths,
      dscrRatio,
      foirPercent,
      bankabilityScore,
      solvencyTier,
      stressedRevenue,
      stressedEMI,
    };
  }, [data, business, invoices, customers, revenueShock, debtorDelayShock, rateHikeBps]);

  // Formatters
  const formatMoney = (val) => "₹" + Number(val || 0).toLocaleString("en-IN");
  const formatLakhs = (val) => "₹" + (Number(val || 0) / 100000).toFixed(2) + "L";

  // Debtor Exposure Chart Data
  const debtorChartData = useMemo(() => {
    return riskMetrics.sortedCustomers.slice(0, 5).map((c) => ({
      name: c.customer.length > 18 ? c.customer.slice(0, 16) + "..." : c.customer,
      amountLakhs: Number((c.amount / 100000).toFixed(2)),
      percentage: c.percentage,
    }));
  }, [riskMetrics.sortedCustomers]);

  // 90-Day Liquidity Trajectory Chart Data
  const trajectoryChartData = useMemo(() => {
    const cash = riskMetrics.currentCash;
    const dailyBurn = riskMetrics.monthlyBurn / 30;
    const receivables = riskMetrics.totalReceivables;

    return [
      { day: "Today", baseline: cash, stressed: cash, safetyFloor: 300000 },
      {
        day: "Day 15",
        baseline: Math.round(cash - dailyBurn * 15 + receivables * 0.25),
        stressed: Math.round(cash - dailyBurn * 1.15 * 15 + receivables * 0.15),
        safetyFloor: 300000,
      },
      {
        day: "Day 30",
        baseline: Math.round(cash - dailyBurn * 30 + receivables * 0.55),
        stressed: Math.round(cash - dailyBurn * 1.15 * 30 + receivables * 0.35),
        safetyFloor: 300000,
      },
      {
        day: "Day 60",
        baseline: Math.round(cash - dailyBurn * 60 + receivables * 0.85),
        stressed: Math.round(cash - dailyBurn * 1.2 * 60 + receivables * 0.55),
        safetyFloor: 300000,
      },
      {
        day: "Day 90",
        baseline: Math.round(cash - dailyBurn * 90 + receivables * 0.98),
        stressed: Math.round(cash - dailyBurn * 1.25 * 90 + receivables * 0.70),
        safetyFloor: 300000,
      },
    ];
  }, [riskMetrics]);

  // Export Executive Risk Dossier
  const handleExportDossier = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "==================================================================",
        "FINTWIN MSME FINANCIAL RISK & INSTITUTIONAL UNDERWRITING DOSSIER",
        `Generated: ${new Date().toLocaleDateString("en-IN")}`,
        "==================================================================",
        "",
        "SECTION 1: SOLVENCY & BANKABILITY SCORE",
        `Solvency Health Score: ${riskMetrics.bankabilityScore} / 100 (${riskMetrics.solvencyTier.label})`,
        `DSCR Coverage Ratio: ${riskMetrics.dscrRatio}x (Target >= 1.50x)`,
        `FOIR Debt Burden: ${riskMetrics.foirPercent}% of Monthly Revenue`,
        `Baseline Operating Runway: ${riskMetrics.baselineRunwayDays} Days`,
        `Stressed Operating Runway: ${riskMetrics.stressedRunwayDays} Days`,
        "",
        "SECTION 2: RECEIVABLES & DEBTOR CONCENTRATION",
        `Total Outstanding Receivables: ${formatMoney(riskMetrics.totalReceivables)}`,
        `Total Trapped / Overdue Amount: ${formatMoney(riskMetrics.totalDelayedAmount)}`,
        `Accrued Section 16 Penal Interest: ${formatMoney(riskMetrics.totalAccruedPenalInterest)}`,
        `Average Collection Delay: ${riskMetrics.averagePredictedDelay} Days`,
        `Largest Single Customer Exposure: ${riskMetrics.topCustomer.customer} (${riskMetrics.topCustomer.percentage}%)`,
        `Top 3 Customers Share: ${riskMetrics.top3Concentration}%`,
        "",
        "SECTION 3: SECTION 43B(h) STATUTORY CUTOFF STATUS",
        `Total Overdue Invoices: ${riskMetrics.overdueInvoices.length}`,
        `Statutory 45-Day Breaches: ${riskMetrics.breaches43b.length}`,
        `Statutory Compound Interest Rate: 19.5% p.a. (3x RBI Bank Rate)`,
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinTwin_Risk_Underwriting_Dossier.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Executive Risk Dossier downloaded successfully!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative", zIndex: 1 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            background: "#0f172a",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Sparkles size={16} style={{ color: "#34d399" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =================================================================
          PAGE HEADER WITH ACTIONS
          ================================================================= */}
      <div className="page-header" style={{ position: "relative", zIndex: 10 }}>
        <div className="page-header-content">
          <div className="card-title-group">
            <div className="card-icon-wrap rose">
              <ShieldAlert size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h1 className="page-title">Risk Intelligence & Solvency Radar</h1>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    background: riskMetrics.solvencyTier.bg,
                    color: riskMetrics.solvencyTier.color,
                    border: `1px solid ${riskMetrics.solvencyTier.color}40`,
                    letterSpacing: 0.5,
                  }}
                >
                  {riskMetrics.solvencyTier.label}
                </span>
              </div>
              <p className="page-subtitle">
                Real-time debtor concentration, 45-day §43B(h) statutory cutoff tracking, and institutional bankability assessment.
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportDossier}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Download size={14} />
              <span>Export Dossier (CSV)</span>
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowDeepDiveModal(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Brain size={14} />
              <span>Deep-Dive Underwriting</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================
          1. TOP EXECUTIVE SOLVENCY & BANKABILITY SCORECARD
          ================================================================= */}
      <div
        className="glass-card"
        style={{
          padding: "24px 28px",
          background: "var(--bg-card)",
          border: `1px solid ${riskMetrics.solvencyTier.color}45`,
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-sm)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--text-muted)" }}>
                COMPOSITE BANKABILITY & SOLVENCY INDEX
              </span>
              <span style={{ fontSize: 11, color: "var(--accent-blue)", fontWeight: 700 }}>
                • RBI Prudential & Basel-III Compliant
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 850, fontVariantNumeric: "tabular-nums", color: riskMetrics.solvencyTier.color, lineHeight: 1 }}>
                {riskMetrics.bankabilityScore}
              </span>
              <span style={{ fontSize: 18, color: "var(--text-muted)", fontWeight: 700 }}>/ 100</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginLeft: 6 }}>
                Score Status: {riskMetrics.solvencyTier.label}
              </span>
            </div>

            <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--text-secondary)", maxWidth: 680, lineHeight: 1.5 }}>
              Your business maintains a healthy solvency buffer with strong debt coverage. Collections are monitored against the 45-day MSMED statutory payment ceiling.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowDeepDiveModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", fontWeight: 700 }}
            >
              <Scale size={16} />
              <span>Institutional Underwriting</span>
            </button>
          </div>
        </div>

        {/* 4 Core Financial Solvency Ratios */}
        <div className="grid-4" style={{ gap: 14, marginTop: 16 }}>
          {/* DSCR */}
          <div style={{ background: "var(--bg-secondary)", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>DSCR Coverage</span>
              <span style={{ color: riskMetrics.dscrRatio >= 1.5 ? "#10b981" : "#ef4444" }}>
                {riskMetrics.dscrRatio >= 1.5 ? "✓ Compliant" : "⚠️ High Stress"}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: riskMetrics.dscrRatio >= 1.5 ? "var(--text-primary)" : "#ef4444", marginTop: 4 }}>
              {riskMetrics.dscrRatio}x
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginTop: 2 }}>
              Target &ge; 1.50x (Operating Cash / EMI)
            </span>
          </div>

          {/* Debt Burden (FOIR) */}
          <div style={{ background: "var(--bg-secondary)", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>Debt Burden (FOIR)</span>
              <span style={{ color: riskMetrics.foirPercent <= 40 ? "#10b981" : "#f59e0b" }}>
                {riskMetrics.foirPercent <= 40 ? "✓ Safe Zone" : "⚠️ High"}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: riskMetrics.foirPercent <= 40 ? "var(--text-primary)" : "#f59e0b", marginTop: 4 }}>
              {riskMetrics.foirPercent}%
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginTop: 2 }}>
              Ceiling &le; 40% of Monthly Revenue
            </span>
          </div>

          {/* Section 43B(h) Breaches */}
          <div style={{ background: "var(--bg-secondary)", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>Section 43B(h) Status</span>
              <span style={{ color: riskMetrics.breaches43b.length === 0 ? "#10b981" : "#ef4444" }}>
                {riskMetrics.breaches43b.length === 0 ? "✓ 100% Protected" : `⚠️ ${riskMetrics.breaches43b.length} Breached`}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: riskMetrics.breaches43b.length === 0 ? "#10b981" : "#ef4444", marginTop: 4 }}>
              {riskMetrics.breaches43b.length} Breaches
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginTop: 2 }}>
              Accrued 19.5% penal interest active
            </span>
          </div>

          {/* Stressed Runway */}
          <div style={{ background: "var(--bg-secondary)", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: "var(--text-muted)", textTransform: "uppercase" }}>Stressed Runway</span>
              <span style={{ color: riskMetrics.stressedRunwayDays >= 60 ? "#10b981" : "#ef4444" }}>
                {riskMetrics.stressedRunwayDays >= 60 ? "✓ Resilient" : "⚠️ Fragile"}
              </span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent-blue)", marginTop: 4 }}>
              {riskMetrics.stressedRunwayDays} Days
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginTop: 2 }}>
              Survival duration under shock conditions
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================
          2. CORE 4 RISK DIAGNOSTIC CARDS
          ================================================================= */}
      <div className="grid-4" style={{ position: "relative", zIndex: 10 }}>
        {/* Card 1: Payment Delay Radar */}
        <div className="kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-label">Payment Delay Radar</span>
            <div className="card-icon-wrap rose">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#ef4444" }}>
              {riskMetrics.averagePredictedDelay} Days
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "4px 0" }}>
            {riskMetrics.overdueInvoices.length} Overdue Invoices • {formatLakhs(riskMetrics.totalDelayedAmount)}
          </div>
          <div className="kpi-trend negative">
            <AlertTriangle size={14} />
            <span>94.2% Machine Learning Accuracy</span>
          </div>
        </div>

        {/* Card 2: Debtor Concentration */}
        <div className="kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-label">Debtor Concentration</span>
            <div className="card-icon-wrap amber">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: riskMetrics.topCustomer.percentage > 40 ? "#f59e0b" : "#10b981" }}>
              {riskMetrics.topCustomer.percentage}%
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "4px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Largest: {riskMetrics.topCustomer.customer}
          </div>
          <div className="kpi-trend neutral">
            <Info size={14} />
            <span>Top 3 Clients: {riskMetrics.top3Concentration}% of Receivables</span>
          </div>
        </div>

        {/* Card 3: Liquidity Buffer */}
        <div className="kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-label">Liquidity Runway Buffer</span>
            <div className="card-icon-wrap emerald">
              <Wallet size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#10b981" }}>
              {riskMetrics.baselineRunwayDays} Days
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "4px 0" }}>
            Current Cash: {formatLakhs(riskMetrics.currentCash)}
          </div>
          <div className="kpi-trend positive">
            <ShieldCheck size={14} />
            <span>Minimum Cash Floor: {formatLakhs(300000)}</span>
          </div>
        </div>

        {/* Card 4: Operating Burn & Liabilities */}
        <div className="kpi-card glass-card">
          <div className="kpi-top">
            <span className="kpi-label">Cash Coverage of Burn</span>
            <div className="card-icon-wrap purple">
              <Receipt size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#8b5cf6" }}>
              {riskMetrics.cashCoverageMonths} Months
            </span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", margin: "4px 0" }}>
            Monthly Burn: {formatLakhs(riskMetrics.monthlyBurn)}
          </div>
          <div className="kpi-trend positive">
            <CheckCircle2 size={14} />
            <span>Fixed Liabilities: {formatLakhs(riskMetrics.monthlyRecurring)}</span>
          </div>
        </div>
      </div>

      {/* =================================================================
          3. VISUAL TELEMETRY CHARTS (2 COLUMNS)
          ================================================================= */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: 20, position: "relative", zIndex: 10 }}>
        {/* Left Chart: Top Debtor Concentration Breakdown */}
        <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Debtor Concentration & Exposure
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                Outstanding receivables exposure by enterprise client (in ₹ Lakhs)
              </p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", background: "var(--bg-secondary)", borderRadius: 6, color: "var(--text-secondary)" }}>
              Top 5 Clients
            </span>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={debtorChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} unit="L" />
                <Tooltip
                  formatter={(val, name) => [`₹${val} Lakhs`, "Outstanding Receivables"]}
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="amountLakhs" radius={[6, 6, 0, 0]}>
                  {debtorChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.percentage > 40 ? "#f43f5e" : entry.percentage > 25 ? "#f59e0b" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: 90-Day Liquidity Trajectory (Normal vs Stressed) */}
        <div className="glass-card" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                90-Day Forward Liquidity Stress Radar
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                Baseline cash runway vs. Stressed shock conditions (-20% rev, +30d delay)
              </p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981", borderRadius: 6 }}>
              Forward Simulation
            </span>
          </div>

          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stressedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(val, name) => [formatMoney(val), name === "baseline" ? "Baseline Cash" : "Stressed Cash"]}
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                />
                <Area type="monotone" dataKey="baseline" name="Baseline Cash" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#baselineGrad)" />
                <Area type="monotone" dataKey="stressed" name="Stressed Shock" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#stressedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =================================================================
          4. AT-RISK RECEIVABLES & SECTION 43B(h) STATUTORY AUDIT TABLE
          ================================================================= */}
      <div className="glass-card" style={{ padding: "24px 28px", borderRadius: "var(--radius-xl)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                At-Risk Receivables & Section 43B(h) Audit Ledger
              </h3>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "#fee2e2", color: "#b91c1c" }}>
                {riskMetrics.overdueInvoices.length} High-Risk
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Income Tax Act Section 43B(h) 45-day payment cutoff monitoring and Section 16 compound interest calculator (19.5% p.a.).
            </p>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "6px 12px", borderRadius: 8 }}>
            Total Accrued Penal Interest: <strong style={{ color: "#ef4444" }}>{formatMoney(riskMetrics.totalAccruedPenalInterest)}</strong>
          </div>
        </div>

        {riskMetrics.overdueInvoices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <CheckCircle2 size={36} style={{ color: "#10b981", margin: "0 auto 10px" }} />
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              Zero Defaulted or At-Risk Invoices!
            </h4>
            <p style={{ fontSize: 13, margin: "6px 0 0" }}>
              All client receivables are currently on schedule within statutory MSME payment boundaries.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-medium)", textAlign: "left", color: "var(--text-muted)", fontSize: 11, textTransform: "uppercase" }}>
                  <th style={{ padding: "10px 12px" }}>Buyer / Customer</th>
                  <th style={{ padding: "10px 12px" }}>Invoice ID</th>
                  <th style={{ padding: "10px 12px" }}>Due Date</th>
                  <th style={{ padding: "10px 12px" }}>Overdue Days</th>
                  <th style={{ padding: "10px 12px" }}>Principal (₹)</th>
                  <th style={{ padding: "10px 12px" }}>Accrued Interest (19.5%)</th>
                  <th style={{ padding: "10px 12px" }}>§43B(h) Status</th>
                  <th style={{ padding: "10px 12px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {riskMetrics.overdueInvoices.map((inv) => {
                  const isBreached = inv.effectiveDelay > 45;
                  const isApproaching = inv.effectiveDelay > 30 && inv.effectiveDelay <= 45;

                  return (
                    <tr
                      key={inv.id || inv.invoice_id}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        transition: "background 0.15s ease",
                      }}
                    >
                      <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {inv.customer || "Enterprise Client"}
                      </td>
                      <td style={{ padding: "12px", fontFamily: "var(--font-mono, monospace)", fontSize: 12, color: "var(--text-secondary)" }}>
                        {inv.id || inv.invoice_id || "INV-100X"}
                      </td>
                      <td style={{ padding: "12px", color: "var(--text-secondary)" }}>
                        {inv.dueDate || inv.due_date || "30-Aug-2026"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontWeight: 800, color: isBreached ? "#ef4444" : "#f59e0b" }}>
                          +{inv.effectiveDelay} Days
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontWeight: 800, color: "var(--text-primary)" }}>
                        {formatMoney(inv.amount)}
                      </td>
                      <td style={{ padding: "12px", fontWeight: 800, color: "#ef4444" }}>
                        +{formatMoney(inv.penalInterest)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: isBreached ? "#fee2e2" : isApproaching ? "#fef3c7" : "#dcfce7",
                            color: isBreached ? "#b91c1c" : isApproaching ? "#92400e" : "#166534",
                            border: `1px solid ${isBreached ? "#fca5a5" : "#fde68a"}`,
                          }}
                        >
                          {isBreached ? "§ 43B(h) BREACHED (>45D)" : isApproaching ? "APPROACHING (31-45D)" : "COMPLIANT (≤15D)"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedRecoveryInvoice(inv)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", fontSize: 12 }}
                        >
                          <Zap size={13} />
                          <span>Recover Cash</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================================
          5. INTERACTIVE WHAT-IF SCENARIO STRESS SANDBOX
          ================================================================= */}
      <div className="glass-card" style={{ padding: "24px 28px", borderRadius: "var(--radius-xl)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SlidersHorizontal size={18} style={{ color: "var(--accent-blue)" }} />
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Live Macro Shock Stress Sandbox
              </h3>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
              Test your balance sheet resiliency against immediate market shocks and interest rate fluctuations in real time.
            </p>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setRevenueShock(0);
              setDebtorDelayShock(0);
              setRateHikeBps(0);
              showToast("Reset simulation sliders to baseline books.");
            }}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={13} />
            <span>Reset Baseline</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {/* Slider 1: Revenue Drop */}
          <div style={{ background: "var(--bg-secondary)", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12.5, fontWeight: 700 }}>
              <span style={{ color: "var(--text-secondary)" }}>Revenue Shock</span>
              <span style={{ color: revenueShock < 0 ? "#ef4444" : revenueShock > 0 ? "#10b981" : "var(--text-primary)" }}>
                {revenueShock > 0 ? `+${revenueShock}%` : `${revenueShock}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="20"
              step="5"
              value={revenueShock}
              onChange={(e) => setRevenueShock(Number(e.target.value))}
              style={{ width: "100%", accentColor: revenueShock < 0 ? "#ef4444" : "var(--accent-blue)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
              <span>-30% Drop</span>
              <span>Baseline</span>
              <span>+20% Surge</span>
            </div>
          </div>

          {/* Slider 2: Debtor Delay */}
          <div style={{ background: "var(--bg-secondary)", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12.5, fontWeight: 700 }}>
              <span style={{ color: "var(--text-secondary)" }}>Client Collection Delay</span>
              <span style={{ color: debtorDelayShock > 15 ? "#ef4444" : debtorDelayShock > 0 ? "#f59e0b" : "var(--text-primary)" }}>
                +{debtorDelayShock} Days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="5"
              value={debtorDelayShock}
              onChange={(e) => setDebtorDelayShock(Number(e.target.value))}
              style={{ width: "100%", accentColor: debtorDelayShock > 15 ? "#ef4444" : "var(--accent-blue)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
              <span>On Time (0d)</span>
              <span>+15d Delay</span>
              <span>+45d Default</span>
            </div>
          </div>

          {/* Slider 3: Repo Rate Hike */}
          <div style={{ background: "var(--bg-secondary)", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12.5, fontWeight: 700 }}>
              <span style={{ color: "var(--text-secondary)" }}>Bank Rate Hike (Repo Rate)</span>
              <span style={{ color: rateHikeBps > 100 ? "#f59e0b" : "var(--text-primary)" }}>
                +{rateHikeBps} bps
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="300"
              step="50"
              value={rateHikeBps}
              onChange={(e) => setRateHikeBps(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--accent-blue)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
              <span>0 bps</span>
              <span>+150 bps</span>
              <span>+300 bps</span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          6. AI RISK DIAGNOSIS & PRESCRIPTIVE RECOMMENDATIONS
          ================================================================= */}
      <div className="glass-card" style={{ padding: "24px 28px", borderRadius: "var(--radius-xl)", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div className="card-icon-wrap purple" style={{ width: 34, height: 34 }}>
            <Brain size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              AI Risk Findings & Prescriptive Capital Actions
            </h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
              Autonomous diagnostic recommendations formulated from current receivables and burn velocity.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {/* Recommendation 1 */}
          <div style={{ padding: "16px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>📜</span>
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
                Enforce Section 43B(h) on Overdue Receivables
              </strong>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Issue formal statutory reminders with accrued 19.5% penal interest calculations to buyers nearing the 45-day deadline to incentivize rapid clearance before their tax year-end disallowance.
            </p>
          </div>

          {/* Recommendation 2 */}
          <div style={{ padding: "16px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
                Offload Client Concentration onto TReDS
              </strong>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              Your top customer accounts for {riskMetrics.topCustomer.percentage}% of outstanding receivables. Factoring their approved invoices on TReDS platforms (RXIL/M1xchange) converts trapped debt into non-recourse cash within 24 hours at 8.25% p.a.
            </p>
          </div>

          {/* Recommendation 3 */}
          <div style={{ padding: "16px", borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
                Establish Working Capital Credit Line
              </strong>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              With a healthy DSCR of {riskMetrics.dscrRatio}x, your business qualifies for zero-collateral CGTMSE 85% credit guarantee overdraft facilities, extending survival runway during delayed collection cycles.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================================
          MODALS INTEGRATION
          ================================================================= */}
      {/* 1. Cash Recovery & Legal Notice Modal */}
      {selectedRecoveryInvoice && (
        <CashRecoveryModal
          invoice={selectedRecoveryInvoice}
          customer={customers.find(
            (c) =>
              c.name === selectedRecoveryInvoice.customer ||
              c.id === selectedRecoveryInvoice.customerId
          )}
          onClose={() => setSelectedRecoveryInvoice(null)}
          onActionComplete={(status) => {
            showToast(`Logged recovery update: ${status}`);
          }}
        />
      )}

      {/* 2. Institutional Deep-Dive Risk Underwriting Modal */}
      {showDeepDiveModal && (
        <DeepDiveRiskModal
          invoice={riskMetrics.overdueInvoices[0] || invoices[0]}
          onClose={() => setShowDeepDiveModal(false)}
          onOpenRecovery={() => {
            setShowDeepDiveModal(false);
            if (riskMetrics.overdueInvoices[0]) {
              setSelectedRecoveryInvoice(riskMetrics.overdueInvoices[0]);
            }
          }}
        />
      )}
    </div>
  );
}