import React, { useState, useEffect } from "react";
import {
  Brain,
  Wallet,
  FileText,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  IndianRupee,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  ArrowRight,
  Landmark,
  Percent,
  Clock,
  Banknote,
  RotateCcw,
  Sliders,
  ChevronRight,
  Download,
  Info,
  Layers,
  Zap,
  Check,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import ModulePage from "../components/ModulePage";
import { getFinancialData, subscribeFinancialData } from "../data/financialStore";
import { API_URL } from "../config";

const FINANCING_COLORS = {
  funding: "#38bdf8",
  cost: "#fb7185",
  net: "#34d399",
  balanceWith: "#10b981",
  balanceWithout: "#f43f5e",
};

export default function Financing() {
  const [data, setData] = useState(getFinancialData());
  const [liquidityGap, setLiquidityGap] = useState(300000);
  const [fundingPurpose, setFundingPurpose] = useState("working_capital");
  const [horizonMonths, setHorizonMonths] = useState(3);
  const [activeTab, setActiveTab] = useState("comparison"); // "comparison" | "cash_impact" | "amortization"
  const [selectedOptionModal, setSelectedOptionModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setData(getFinancialData());
    });
    return unsub;
  }, []);

  const formatMoney = (amount) => {
    const val = Number(amount || 0);
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const formatLakhs = (amount) => {
    const val = Number(amount || 0);
    const abs = Math.abs(val);
    if (abs >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (abs >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toFixed(0)}`;
  };

  // Calculations derived from live data & user input
  const currentCash = Number(data.business?.openingCash || 0);
  const eligibleReceivables = (data.invoices || [])
    .filter((inv) => String(inv.status || "").toLowerCase() !== "paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const fundingNeeded = Math.max(0, Number(liquidityGap || 0));
  const invoiceCap = Math.min(fundingNeeded, Math.round(eligibleReceivables * 0.85));

  // Instrument 1: Customer Advance / Dynamic Discounting (Non-Debt)
  const optionEarlyDiscount = {
    id: "early_discount",
    type: "NON_DEBT",
    title: "Customer Early Discounting",
    tagline: "Accelerate invoice collections by offering 1.0 - 1.5% prompt-pay discount",
    badge: "Non-Debt",
    badgeColor: "emerald",
    maxFunding: fundingNeeded,
    fundingDisbursed: fundingNeeded,
    estimatedCost: Math.round(fundingNeeded * 0.012),
    netFundsReceived: Math.round(fundingNeeded * 0.988),
    costRate: "1.2% Total Discount",
    timeline: "1 - 2 Business Days",
    repaymentPeriod: `${horizonMonths} Months`,
    riskLevel: "LOW",
    impact: "Zero Balance Sheet Debt",
    collateral: "None required",
    suitabilityScore: 96,
    suitabilityBadge: "Highest Capital Efficiency",
    features: [
      "Zero interest or long-term debt liabilities",
      "Improves customer relationship and liquidity turnaround",
      "No credit checks, personal guarantees, or collateral",
    ],
  };

  // Instrument 2: Invoice Discounting / TReDS Factoring
  const optionInvoiceFactoring = {
    id: "invoice_discounting",
    type: "INVOICE_FINANCING",
    title: "TReDS / Invoice Factoring",
    tagline: "Auction verified customer invoices to institutional financiers for instant liquidity",
    badge: "Off-Balance Sheet",
    badgeColor: "blue",
    maxFunding: invoiceCap > 0 ? invoiceCap : fundingNeeded,
    fundingDisbursed: invoiceCap > 0 ? invoiceCap : fundingNeeded,
    estimatedCost: Math.round((invoiceCap > 0 ? invoiceCap : fundingNeeded) * 0.015 * horizonMonths),
    netFundsReceived: Math.round(
      (invoiceCap > 0 ? invoiceCap : fundingNeeded) -
        (invoiceCap > 0 ? invoiceCap : fundingNeeded) * 0.015 * horizonMonths
    ),
    costRate: "1.2% - 1.6% per month",
    timeline: "24 - 48 Hours",
    repaymentPeriod: `${horizonMonths} Months (Upon Invoice Clearance)`,
    riskLevel: "LOW",
    impact: "Working Capital Asset Conversion",
    collateral: "Verified Invoices (No Asset Hypothecation)",
    suitabilityScore: invoiceCap >= fundingNeeded ? 92 : 82,
    suitabilityBadge: invoiceCap >= fundingNeeded ? "Optimal Match" : "Eligible",
    features: [
      "Regulated multi-financier bidding ensures lowest market interest",
      "Converts trapped receivables to usable cash in under 48 hours",
      "Non-recourse / limited recourse options available for MSMEs",
    ],
  };

  // Instrument 3: Revolving Working Capital Line of Credit
  const optionCreditLine = {
    id: "working_capital",
    type: "WORKING_CAPITAL",
    title: "Revolving Line of Credit",
    tagline: "Pre-approved MSME credit line with interest payable only on drawn amount",
    badge: "Flexible Credit",
    badgeColor: "purple",
    maxFunding: fundingNeeded,
    fundingDisbursed: fundingNeeded,
    estimatedCost: Math.round(fundingNeeded * (0.125 / 12) * horizonMonths),
    netFundsReceived: Math.round(fundingNeeded),
    costRate: "11.5% - 13.5% p.a. APR",
    timeline: "3 - 5 Business Days",
    repaymentPeriod: `${horizonMonths} - 12 Months`,
    riskLevel: "MEDIUM",
    impact: "Short-Term Balance Sheet Liability",
    collateral: "Business Cash Flow / GST Validation",
    suitabilityScore: 78,
    suitabilityBadge: "High Flexibility",
    features: [
      "Drawdown anytime; pay interest only on utilized capital",
      "Revolving limit refreshes automatically upon repayment",
      "Ideal for recurring seasonal payroll or inventory cycles",
    ],
  };

  // Instrument 4: Supply Chain / Vendor Financing
  const optionVendorFinancing = {
    id: "vendor_financing",
    type: "SUPPLY_CHAIN",
    title: "Supply Chain Vendor Financing",
    tagline: "Financier pays your suppliers directly, extending your payable runway up to 90 days",
    badge: "Trade Credit",
    badgeColor: "amber",
    maxFunding: Math.round(fundingNeeded * 0.9),
    fundingDisbursed: Math.round(fundingNeeded * 0.9),
    estimatedCost: Math.round(fundingNeeded * 0.9 * 0.014 * horizonMonths),
    netFundsReceived: Math.round(fundingNeeded * 0.9),
    costRate: "1.3% - 1.5% per month",
    timeline: "2 - 3 Days",
    repaymentPeriod: "60 - 90 Days",
    riskLevel: "LOW",
    impact: "Accounts Payable Extension",
    collateral: "Purchase Orders / Invoices",
    suitabilityScore: 84,
    suitabilityBadge: "Direct Supplier Payout",
    features: [
      "Preserves cash by letting lenders settle raw material invoices",
      "Enables early payment discounts from key vendor partners",
      "Strengthens supply chain stability without cash strain",
    ],
  };

  const financingOptions = [
    optionEarlyDiscount,
    optionInvoiceFactoring,
    optionCreditLine,
    optionVendorFinancing,
  ];

  // Best recommendation determination
  const bestOption =
    invoiceCap >= fundingNeeded && fundingNeeded > 0
      ? optionInvoiceFactoring
      : fundingNeeded > 0
      ? optionEarlyDiscount
      : optionCreditLine;

  // Comparison Bar Chart Data
  const comparisonChartData = financingOptions.map((opt) => ({
    name: opt.title.split(" ")[0] + " " + (opt.title.split(" ")[1] || ""),
    funding: opt.fundingDisbursed,
    cost: opt.estimatedCost,
    net: opt.netFundsReceived,
  }));

  // Cash Trajectory Projection (90 Days)
  const trajectoryData = Array.from({ length: 12 }, (_, i) => {
    const week = `Wk ${i + 1}`;
    const baseBurn = (data.business?.monthlyExpenses || 250000) / 4;
    const expectedInflow = (eligibleReceivables / 12) * (i > 3 ? 1.4 : 0.8);
    
    // Without financing
    const cashWithout = Math.max(
      -150000,
      currentCash + (expectedInflow - baseBurn) * (i + 1)
    );

    // With financing injection in week 1
    const cashWith = Math.max(
      0,
      currentCash +
        fundingNeeded +
        (expectedInflow - baseBurn) * (i + 1) -
        (i > 8 ? (fundingNeeded + bestOption.estimatedCost) / 3 : 0)
    );

    return {
      week,
      "Without Financing": Math.round(cashWithout),
      "With NexFin Capital": Math.round(cashWith),
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Header Banner */}
      <div
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.25)",
          padding: "24px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                }}
              >
                <Sparkles size={13} />
                <span>Autonomous MSME Working Capital Optimizer</span>
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 8px",
                  borderRadius: 20,
                  fontSize: 11,
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#34d399",
                }}
              >
                <ShieldCheck size={13} />
                <span>TReDS & RBI Approved Portals</span>
              </span>
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "4px 0 8px" }}>
              MSME Decision-Support Financing Engine
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
              Simulate funding options against your live receivables ledger. Compare non-debt prompt discounting, TReDS invoice auctioning, and revolving credit facilities to solve liquidity deficits with minimal cost of capital.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setLiquidityGap(250000);
                setHorizonMonths(3);
              }}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Target Funding Requirement</span>
            <div className="card-icon-wrap rose">
              <Banknote size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fb7185" }}>
              {formatLakhs(fundingNeeded)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>{horizonMonths}-Month Target Bridge</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Discounting Capacity</span>
            <div className="card-icon-wrap emerald">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#34d399" }}>
              {formatLakhs(eligibleReceivables * 0.85)}
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>85% Loan-to-Value on Live Invoices</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Current Cash Reserve</span>
            <div className="card-icon-wrap">
              <Wallet size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#60a5fa" }}>
              {formatLakhs(currentCash)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>Unencumbered Liquid Buffer</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Best Cost of Capital</span>
            <div className="card-icon-wrap amber">
              <Percent size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fbbf24" }}>
              {bestOption.costRate.split(" ")[0]}
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Via {bestOption.title.split(" ")[0]}</span>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Controls & Purpose */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap blue">
              <Sliders size={18} />
            </div>
            <div>
              <div className="card-title">Financing Parameter Simulator</div>
              <div className="card-subtitle">Adjust required capital amount, purpose, and repayment horizon</div>
            </div>
          </div>
        </div>

        <div className="grid-12" style={{ gap: 20 }}>
          {/* Amount Slider & Presets */}
          <div className="col-span-6" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc" }}>
                Required Capital Amount
              </label>
              <strong style={{ fontSize: 16, color: "#38bdf8", fontWeight: 700 }}>
                {formatMoney(liquidityGap)}
              </strong>
            </div>

            <input
              type="range"
              min="50000"
              max="2500000"
              step="25000"
              value={liquidityGap}
              onChange={(e) => setLiquidityGap(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#3b82f6",
                cursor: "pointer",
                height: 6,
              }}
            />

            {/* Quick Preset Chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[100000, 250000, 500000, 1000000, 1500000, 2500000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setLiquidityGap(amt)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: liquidityGap === amt ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                    background: liquidityGap === amt ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                    color: liquidityGap === amt ? "#38bdf8" : "var(--text-secondary)",
                    fontSize: 11.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {formatLakhs(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon & Purpose Selectors */}
          <div className="col-span-6" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#f8fafc", display: "block", marginBottom: 6 }}>
                Repayment Horizon
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    onClick={() => setHorizonMonths(m)}
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      border: horizonMonths === m ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.1)",
                      background: horizonMonths === m ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                      color: horizonMonths === m ? "#fff" : "var(--text-secondary)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    {m} {m === 1 ? "Month" : "Months"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#f8fafc", display: "block", marginBottom: 6 }}>
                Primary Capital Use
              </label>
              <select
                value={fundingPurpose}
                onChange={(e) => setFundingPurpose(e.target.value)}
                className="form-select"
                style={{ fontSize: 12, padding: "8px 10px" }}
              >
                <option value="working_capital">Working Capital Gap</option>
                <option value="raw_materials">Bulk Raw Materials</option>
                <option value="payroll_buffer">Payroll Reserve Buffer</option>
                <option value="gst_compliance">GST / Advance Tax Payout</option>
                <option value="equipment_capex">Machinery & Capex</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* AI Optimal Recommendation Banner */}
      <div
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.35)",
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.25)",
                  color: "#34d399",
                  fontSize: 10.5,
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.5px",
                }}
              >
                AI RECOMMENDED MATCH ({bestOption.suitabilityScore}% SUITABILITY)
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "4px 0 6px" }}>
              {bestOption.title} — {bestOption.badge}
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, maxWidth: 640, margin: 0, lineHeight: 1.5 }}>
              {bestOption.tagline}. Based on your ₹{formatLakhs(eligibleReceivables)} live receivables ledger, this route maximizes available liquidity while keeping interest burden to just {formatMoney(bestOption.estimatedCost)}.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setSelectedOptionModal(bestOption)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}
          >
            <span>View Execution Blueprint</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            marginTop: 18,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {bestOption.features.map((feat, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#e2e8f0" }}>
              <CheckCircle size={15} style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparative Analytics & Cash Trajectory Tabs */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap purple">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="card-title">Comparative Financing Analytics</div>
              <div className="card-subtitle">Visual cost-benefit and 90-day cash trajectory models</div>
            </div>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "comparison" ? "active" : ""}`}
              onClick={() => setActiveTab("comparison")}
            >
              Capital vs. Cost Matrix
            </button>
            <button
              className={`tab-btn ${activeTab === "cash_impact" ? "active" : ""}`}
              onClick={() => setActiveTab("cash_impact")}
            >
              90-Day Cash Trajectory Simulation
            </button>
          </div>
        </div>

        {activeTab === "comparison" ? (
          <div style={{ height: 280, width: "100%", marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11.5} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val, name) => [
                    formatMoney(val),
                    name === "funding"
                      ? "Gross Funding Capacity"
                      : name === "cost"
                      ? "Estimated Cost of Capital"
                      : "Net Liquid Disbursed",
                  ]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => (
                    <span style={{ color: "#cbd5e1", fontSize: "12px" }}>
                      {val === "funding"
                        ? "Gross Funding Capacity"
                        : val === "cost"
                        ? "Estimated Cost of Capital"
                        : "Net Disbursed Funds"}
                    </span>
                  )}
                />
                <Bar dataKey="funding" name="funding" fill={FINANCING_COLORS.funding} radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="cost" name="cost" fill={FINANCING_COLORS.cost} radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="net" name="net" fill={FINANCING_COLORS.net} radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: 280, width: "100%", marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={FINANCING_COLORS.balanceWith} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={FINANCING_COLORS.balanceWith} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={FINANCING_COLORS.balanceWithout} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={FINANCING_COLORS.balanceWithout} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11.5} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val) => [formatMoney(val), ""]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => (
                    <span style={{ color: "#cbd5e1", fontSize: "12px" }}>{val}</span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="With NexFin Capital"
                  stroke={FINANCING_COLORS.balanceWith}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWith)"
                />
                <Area
                  type="monotone"
                  dataKey="Without Financing"
                  stroke={FINANCING_COLORS.balanceWithout}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWithout)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 4 Financing Option Product Cards Grid */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>
              Available Financing Instruments Matrix
            </h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Detailed terms, speed, and cost breakdown per instrument
            </span>
          </div>
        </div>

        <div className="grid-12" style={{ gap: 16 }}>
          {financingOptions.map((opt) => (
            <div
              key={opt.id}
              className="col-span-6 glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                border:
                  opt.id === bestOption.id
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                background:
                  opt.id === bestOption.id
                    ? "rgba(16, 185, 129, 0.03)"
                    : "var(--bg-card)",
                padding: 20,
              }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className={`card-icon-wrap ${
                      opt.badgeColor === "emerald"
                        ? "emerald"
                        : opt.badgeColor === "purple"
                        ? "purple"
                        : opt.badgeColor === "amber"
                        ? "amber"
                        : "blue"
                    }`}
                  >
                    {opt.type === "NON_DEBT" ? (
                      <Wallet size={18} />
                    ) : opt.type === "INVOICE_FINANCING" ? (
                      <FileText size={18} />
                    ) : opt.type === "SUPPLY_CHAIN" ? (
                      <Layers size={18} />
                    ) : (
                      <CreditCard size={18} />
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>
                      {opt.title}
                    </h4>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{opt.badge}</span>
                  </div>
                </div>

                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontSize: 10.5,
                    fontWeight: 700,
                    background:
                      opt.id === bestOption.id
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(255,255,255,0.06)",
                    color: opt.id === bestOption.id ? "#34d399" : "var(--text-secondary)",
                    border:
                      opt.id === bestOption.id
                        ? "1px solid rgba(16,185,129,0.3)"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {opt.suitabilityBadge}
                </span>
              </div>

              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "12px 0 16px", lineHeight: 1.5 }}>
                {opt.tagline}
              </p>

              {/* Financial Metrics Strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  background: "rgba(15,23,42,0.6)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block" }}>FUNDING LIMIT</span>
                  <strong style={{ fontSize: 14, color: "#38bdf8" }}>{formatLakhs(opt.fundingDisbursed)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block" }}>ESTIMATED COST</span>
                  <strong style={{ fontSize: 14, color: "#fb7185" }}>{formatMoney(opt.estimatedCost)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block" }}>DISBURSAL SPEED</span>
                  <strong style={{ fontSize: 13, color: "#34d399" }}>{opt.timeline.split(" ")[0]} {opt.timeline.split(" ")[1]}</strong>
                </div>
              </div>

              {/* Meta Tags */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11.5, color: "var(--text-secondary)", marginTop: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Cost of Capital:</span>
                  <strong style={{ color: "#fff" }}>{opt.costRate}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Collateral / Security:</span>
                  <span style={{ color: "#cbd5e1" }}>{opt.collateral}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Balance Sheet Impact:</span>
                  <span style={{ color: "#cbd5e1" }}>{opt.impact}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedOptionModal(opt)}
                style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <span>Examine Terms & Schedule</span>
                <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Regulated Institutional Partners & Compliance Bar */}
      <div
        className="glass-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          background: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Landmark size={20} style={{ color: "#60a5fa" }} />
          <div>
            <strong style={{ fontSize: 13, color: "#fff" }}>RBI-Regulated MSME Financing Integration</strong>
            <p style={{ margin: 0, fontSize: 11.5, color: "var(--text-muted)" }}>
              Compatible with M1xchange, RXIL, Invoicemart, and leading MSME Non-Banking Financial Corporations.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Decision-Support Engine v2.4</span>
        </div>
      </div>

      {/* Modal: Amortization & Execution Blueprint */}
      {selectedOptionModal && (
        <div className="modal-backdrop" onClick={() => setSelectedOptionModal(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 640 }}
          >
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedOptionModal.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {selectedOptionModal.tagline}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "14px 0" }}>
              {/* Summary Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>GROSS CAPITAL</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#38bdf8", marginTop: 2 }}>
                    {formatMoney(selectedOptionModal.fundingDisbursed)}
                  </div>
                </div>
                <div style={{ padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>FINANCING COST</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fb7185", marginTop: 2 }}>
                    {formatMoney(selectedOptionModal.estimatedCost)}
                  </div>
                </div>
                <div style={{ padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>NET ADVANCE</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#34d399", marginTop: 2 }}>
                    {formatMoney(selectedOptionModal.netFundsReceived)}
                  </div>
                </div>
              </div>

              {/* Execution Steps */}
              <div>
                <strong style={{ fontSize: 13, color: "#fff", display: "block", marginBottom: 8 }}>
                  Facility Onboarding & Execution Steps
                </strong>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ padding: "10px 12px", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 6, fontSize: 12, color: "#cbd5e1" }}>
                    <strong>Step 1 — Ledger Verification:</strong> Export verified GST & e-invoice XMLs from NexFin.
                  </div>
                  <div style={{ padding: "10px 12px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, fontSize: 12, color: "#cbd5e1" }}>
                    <strong>Step 2 — Financier Bidding:</strong> Upload invoice factoring batch to TReDS / NBFC partner portal.
                  </div>
                  <div style={{ padding: "10px 12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, fontSize: 12, color: "#cbd5e1" }}>
                    <strong>Step 3 — Same-Day Disbursal:</strong> Funds credited directly to operating bank account in 24-48 hours.
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5, background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 6 }}>
                <strong>Decision Support Notice:</strong> All figures are calculated based on simulated market factoring rates. NexFin provides analytical matching and does not act as a direct lending originator.
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedOptionModal(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert(`Facility blueprint for ${selectedOptionModal.title} saved to your company dashboard!`);
                  setSelectedOptionModal(null);
                }}
              >
                Proceed with Execution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}