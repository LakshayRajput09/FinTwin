import React, { useState } from "react";
import {
  X,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  Activity,
  Percent,
  Layers,
  Landmark,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Square,
  Zap,
  Download,
  AlertOctagon,
  Flame,
  Check,
  Building,
} from "lucide-react";
import { getFinancialData, getBusiness, getInvoices } from "../data/financialStore";
import { calculateInvoiceRiskAnalysis } from "../utils/riskRecoveryEngine";

export default function DeepDiveRiskModal({ invoice, onClose, onOpenRecovery }) {
  const data = getFinancialData();
  const business = getBusiness();
  const invoices = getInvoices();

  // User interactive scenario shocks
  const [riskRevenueShock, setRiskRevenueShock] = useState(0); // 0 | -10 | -20 | -30 %
  const [riskDebtorDelay, setRiskDebtorDelay] = useState(0); // 0 | 15 | 30 | 45 days
  const [riskInterestHike, setRiskInterestHike] = useState(0); // 0 | 100 | 200 | 300 bps
  const [riskChecklist, setRiskChecklist] = useState({
    udyam: true,
    gstRecon: true,
    treds: false,
    moratorium: false,
    debtorInsurance: false,
    escrowAccount: true,
  });

  const baseMonthlyRevenue = business?.monthlyRevenue || 1450000;
  const baseMonthlyExpenses = business?.monthlyExpenses || 620000;
  const targetLoanAmount = 500000;
  const baseRate = 9.5;
  const tenureMonths = 36;

  // Stressed calculations based on shock sliders
  const stressedRevenue = baseMonthlyRevenue * (1 + riskRevenueShock / 100);
  const effectiveStressRate = baseRate + riskInterestHike / 100;

  const calculateEMI = (principal, annualRate, months) => {
    if (!principal || !months) return 0;
    const monthlyRate = annualRate / 12 / 100;
    return Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const stressedEMI = calculateEMI(targetLoanAmount, effectiveStressRate, tenureMonths);
  const stressedOperatingProfit = Math.max(15000, stressedRevenue - baseMonthlyExpenses);
  const dscrRatio = Math.max(0.2, Number((stressedOperatingProfit / stressedEMI).toFixed(2)));
  const foirPercent = Math.min(100, Math.round((stressedEMI / stressedRevenue) * 100));
  const stressedRunwayDays = Math.max(
    14,
    Math.round(180 * (1 + riskRevenueShock / 120) - riskDebtorDelay * 0.8)
  );

  // Overdue receivables & 43B(h) statutory breaches
  const overdueInvoices = invoices.filter((i) => i.status !== "Paid" && (i.daysOverdue || 0) > 0);
  const trappedAmount = overdueInvoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const breaches43b = invoices.filter(
    (i) => i.status !== "Paid" && (i.daysOverdue || 0) > 45
  );

  // Solvency Bankability Health Score (0-100)
  let riskScore = 84;
  if (dscrRatio < 1.5) riskScore -= 24;
  if (foirPercent > 40) riskScore -= 18;
  if (riskDebtorDelay > 20) riskScore -= 15;
  if (riskInterestHike >= 200) riskScore -= 10;
  if (breaches43b.length > 0) riskScore -= 12;
  riskScore = Math.max(22, Math.min(98, riskScore));

  const riskTier =
    riskScore >= 75
      ? { label: "Low Risk (Bankable Prime)", color: "var(--accent-emerald)", bg: "rgba(16,185,129,0.12)" }
      : riskScore >= 50
      ? { label: "Moderate Risk (Watchlist)", color: "var(--accent-amber)", bg: "rgba(245,158,11,0.12)" }
      : { label: "High Risk (Debt Burden Alert)", color: "var(--accent-rose)", bg: "rgba(244,63,94,0.12)" };

  const formatMoney = (val) => "₹" + Number(val || 0).toLocaleString("en-IN");
  const formatLakhs = (val) => "₹" + (Number(val || 0) / 100000).toFixed(2) + "L";

  // Export Dossier
  const handleExportDossier = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "==================================================================",
        "FINTWIN MSME INSTITUTIONAL RISK & SOLVENCY UNDERWRITING REPORT",
        `Enterprise: Precision Auto Gears Ltd`,
        `Generated: ${new Date().toLocaleDateString("en-IN")}`,
        "==================================================================",
        "",
        "SECTION 1: SOLVENCY & BANKABILITY SCORE",
        `Bankability Score: ${riskScore} / 100 (${riskTier.label})`,
        `DSCR Coverage Ratio: ${dscrRatio}x (Target >= 1.50x)`,
        `Debt Burden (FOIR): ${foirPercent}% of Monthly Revenue (Ceiling <= 40%)`,
        `Stressed Operating Runway: ${stressedRunwayDays} Days`,
        "",
        "SECTION 2: SECTION 43B(h) STATUTORY COMPLIANCE",
        `Overdue Invoices: ${overdueInvoices.length} (${formatMoney(trappedAmount)})`,
        `45-Day Statutory Cutoff Breaches: ${breaches43b.length}`,
        `Mandatory Compound Interest Rate: 19.5% p.a. (3x RBI Bank Rate)`,
        "",
        "SECTION 3: WHAT-IF SCENARIO STRESS TEST",
        `Simulated Revenue Shock: ${riskRevenueShock}%`,
        `Simulated Debtor Collection Delay: +${riskDebtorDelay} Days`,
        `Simulated Rate Shock: +${riskInterestHike} bps`,
        `Stressed Revenue: ${formatMoney(stressedRevenue)} / mo`,
        `Stressed EMI: ${formatMoney(stressedEMI)} / mo`,
        `Stressed Net Cash Buffer: ${formatMoney(stressedOperatingProfit - stressedEMI)} / mo`,
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinTwin_Risk_Underwriting_Dossier.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 920,
          width: "95%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: 24,
        }}
      >
        {/* Mobile drag handle */}
        <div className="modal-drag-handle" />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: riskTier.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: riskTier.color,
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              <ShieldAlert size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  Institutional Deep-Dive Risk Analysis
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: "var(--radius-full)",
                    background: riskTier.bg,
                    color: riskTier.color,
                    border: `1px solid ${riskTier.color}40`,
                  }}
                >
                  {riskTier.label}
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                RBI Master Circular Prudential Guidelines • Income Tax Act Section 43B(h) • Debtor Contagion Stress-Testing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. Top Solvency Radar & Key Metrics */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: `1px solid ${riskTier.color}40`,
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 14 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
                COMPOSITE BANKABILITY & SOLVENCY INDEX
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
                <span style={{ fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: riskTier.color }}>
                  {riskScore}
                </span>
                <span style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 600 }}>/ 100</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 8 }}>
                  • Assessed against Tier-1 PSU & Private Bank underwriting criteria
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {onOpenRecovery && (
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    onClose();
                    onOpenRecovery();
                  }}
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid rgba(34, 197, 94, 0.5)",
                    color: "#2E7D5B",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 14px",
                  }}
                >
                  <Zap size={13} style={{ color: "#2E7D5B" }} />
                  <span>⚡ Cash Recovery Hub</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Core Financial Solvency Ratios */}
          <div className="grid-4" style={{ gap: 10 }}>
            <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>DSCR COVERAGE</span>
                <span style={{ color: dscrRatio >= 1.5 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                  {dscrRatio >= 1.5 ? "✓ Compliant" : "⚠️ High Stress"}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: dscrRatio >= 1.5 ? "var(--accent-emerald)" : "var(--accent-rose)", marginTop: 2 }}>
                {dscrRatio}x
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Target &ge; 1.50x (Cash / EMI)</span>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>DEBT BURDEN (FOIR)</span>
                <span style={{ color: foirPercent <= 40 ? "var(--accent-emerald)" : "var(--accent-amber)", fontWeight: 700 }}>
                  {foirPercent <= 40 ? "✓ Safe Zone" : "⚠️ Heavy"}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: foirPercent <= 40 ? "var(--accent-emerald)" : "var(--accent-amber)", marginTop: 2 }}>
                {foirPercent}%
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Ceiling &le; 40% of Revenue</span>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>SECTION 43B(h)</span>
                <span style={{ color: breaches43b.length === 0 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                  {breaches43b.length === 0 ? "✓ Compliant" : `⚠️ ${breaches43b.length} Breaches`}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: breaches43b.length === 0 ? "var(--accent-emerald)" : "var(--accent-rose)", marginTop: 2 }}>
                {breaches43b.length} Penalties
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Mandatory 45d cutoff rule</span>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "10px 12px", borderRadius: 6, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>STRESSED RUNWAY</span>
                <span style={{ color: stressedRunwayDays >= 90 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                  {stressedRunwayDays >= 90 ? "✓ Safe" : "⚠️ Alert"}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent-blue)", marginTop: 2 }}>
                {stressedRunwayDays} Days
              </div>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Survival under stress</span>
            </div>
          </div>
        </div>

        {/* 2. Interactive What-If Scenario Stress Sandbox */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "16px 20px",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Interactive What-If Solvency Shock Simulator
              </h4>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Simulate macro shocks to see how revenue loss, customer delays, and rate hikes impact solvency
              </span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setRiskRevenueShock(0);
                setRiskDebtorDelay(0);
                setRiskInterestHike(0);
              }}
              style={{ fontSize: 11, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}
            >
              <RotateCcw size={11} />
              <span>Reset Shocks</span>
            </button>
          </div>

          <div className="grid-12" style={{ gap: 14 }}>
            {/* Revenue Contraction */}
            <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Revenue Contraction</span>
                <strong style={{ color: riskRevenueShock === 0 ? "var(--text-primary)" : "var(--accent-rose)" }}>
                  {riskRevenueShock}%
                </strong>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, -10, -20, -30].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRiskRevenueShock(val)}
                    style={{
                      flex: 1,
                      padding: "5px 3px",
                      borderRadius: 5,
                      border: riskRevenueShock === val ? "1px solid var(--accent-rose)" : "1px solid var(--border-medium)",
                      background: riskRevenueShock === val ? "var(--accent-rose)" : "var(--bg-secondary)",
                      color: riskRevenueShock === val ? "#ffffff" : "var(--text-primary)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {val === 0 ? "0%" : `${val}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Debtor Delay */}
            <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Buyer Collection Delay</span>
                <strong style={{ color: riskDebtorDelay === 0 ? "var(--text-primary)" : "var(--accent-amber)" }}>
                  +{riskDebtorDelay} Days
                </strong>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 15, 30, 45].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRiskDebtorDelay(val)}
                    style={{
                      flex: 1,
                      padding: "5px 3px",
                      borderRadius: 5,
                      border: riskDebtorDelay === val ? "1px solid var(--accent-amber)" : "1px solid var(--border-medium)",
                      background: riskDebtorDelay === val ? "var(--accent-amber)" : "var(--bg-secondary)",
                      color: riskDebtorDelay === val ? "#ffffff" : "var(--text-primary)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {val === 0 ? "0d" : `+${val}d`}
                  </button>
                ))}
              </div>
            </div>

            {/* Rate Hike */}
            <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Repo / Rate Hike</span>
                <strong style={{ color: riskInterestHike === 0 ? "var(--text-primary)" : "var(--accent-purple)" }}>
                  +{riskInterestHike} bps
                </strong>
              </div>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 100, 200, 300].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRiskInterestHike(val)}
                    style={{
                      flex: 1,
                      padding: "5px 3px",
                      borderRadius: 5,
                      border: riskInterestHike === val ? "1px solid var(--accent-purple)" : "1px solid var(--border-medium)",
                      background: riskInterestHike === val ? "var(--accent-purple)" : "var(--bg-secondary)",
                      color: riskInterestHike === val ? "#ffffff" : "var(--text-primary)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {val === 0 ? "0 bps" : `+${val}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stressed Outcome Bar */}
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "var(--bg-secondary)",
              borderRadius: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              fontSize: 11.5,
            }}
          >
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span>Stressed Revenue: <strong>{formatMoney(stressedRevenue)}/mo</strong></span>
              <span>Stressed EMI: <strong style={{ color: "var(--accent-rose)" }}>{formatMoney(stressedEMI)}/mo</strong></span>
              <span>Buffer: <strong style={{ color: stressedOperatingProfit > stressedEMI ? "var(--accent-emerald)" : "var(--accent-rose)" }}>{formatMoney(stressedOperatingProfit - stressedEMI)}/mo</strong></span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                background: dscrRatio >= 1.5 ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
                color: dscrRatio >= 1.5 ? "var(--accent-emerald)" : "var(--accent-rose)",
              }}
            >
              {dscrRatio >= 1.5 ? "✓ Solvency Preserved" : "⚠️ Debt Restructure Needed"}
            </span>
          </div>
        </div>

        {/* 3. The 6 Major Risk Pillars (All Major Points Addressed) */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
            The 6 Major Institutional Credit & Risk Pillars
          </h4>

          <div className="grid-12" style={{ gap: 12 }}>
            {/* Pillar 1: Debt Burden */}
            <div className="col-span-6 glass-card" style={{ padding: 14, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>1. Default & Repayment Burden Risk</strong>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(244,63,94,0.12)", color: "var(--accent-rose)" }}>
                  DSCR: {dscrRatio}x
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.4 }}>
                Taking debt beyond debt-servicing limits risks insolvency if monthly cash collections drop. Scheduled EMI of {formatMoney(stressedEMI)} must remain below 35% of operating profit.
              </p>
              <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                💡 <strong>Mitigation:</strong> Request 6–12 month moratorium on principal; match debt maturity to asset life.
              </div>
            </div>

            {/* Pillar 2: Section 43B(h) */}
            <div className="col-span-6 glass-card" style={{ padding: 14, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>2. Section 43B(h) & MSMED Statutory Penalty</strong>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "var(--accent-amber)" }}>
                  3x RBI Penal Int.
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.4 }}>
                Payments delayed past 45 days face permanent income tax deduction disallowance for the buyer + mandatory monthly compound interest at 3x RBI Bank Rate (~19.5% p.a.).
              </p>
              <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                💡 <strong>Mitigation:</strong> Issue statutory demand notices over WhatsApp/Email; file on MSME Samadhaan portal.
              </div>
            </div>

            {/* Pillar 3: Concentration */}
            <div className="col-span-6 glass-card" style={{ padding: 14, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>3. Customer Concentration & Contagion</strong>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(59,130,246,0.12)", color: "var(--accent-blue)" }}>
                  Single Buyer Risk
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.4 }}>
                When top 2–3 buyers control &gt;50% of revenue, payment delays by one client immediately freeze operating liquidity and trigger bank overdraft breaches.
              </p>
              <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                💡 <strong>Mitigation:</strong> Factoring invoices on TReDS; obtain trade credit insurance for exposure exceeding ₹10L.
              </div>
            </div>

            {/* Pillar 4: Floating Rate Risk */}
            <div className="col-span-6 glass-card" style={{ padding: 14, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>4. Floating Interest Rate & Margin Call Risk</strong>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(139,92,246,0.12)", color: "var(--accent-purple)" }}>
                  Rate: {effectiveStressRate.toFixed(2)}%
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.4 }}>
                Floating bank Cash Credit (CC) / Overdrafts linked to external benchmark rates (EBLR) rise automatically during monetary tightening cycles, eating operating margins.
              </p>
              <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                💡 <strong>Mitigation:</strong> Prioritize fixed-rate subsidized government credit (PM Vishwakarma 5%, CGTMSE).
              </div>
            </div>

            {/* Pillar 5: GST ITC Risk */}
            <div className="col-span-6 glass-card" style={{ padding: 14, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>5. Input Tax Credit (ITC) Reversal Risk</strong>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "var(--accent-emerald)" }}>
                  GSTR-2B Lock
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.4 }}>
                Under Section 16(2)(aa) of CGST Act, if vendor invoices are not reflected in GSTR-2B or unpaid within 180 days, ITC must be reversed with 18% p.a. interest.
              </p>
              <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                💡 <strong>Mitigation:</strong> Real-time automated 2B reconciliation; withhold GST component until vendor files GSTR-1.
              </div>
            </div>

            {/* Pillar 6: Capex Misallocation */}
            <div className="col-span-6 glass-card" style={{ padding: 14, borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>6. Capital Misallocation & Runway Burn Risk</strong>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: "rgba(59,130,246,0.12)", color: "var(--accent-blue)" }}>
                  Runway: {stressedRunwayDays}d
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "var(--text-secondary)", margin: "0 0 6px", lineHeight: 1.4 }}>
                Using long-term term loan proceeds to cover temporary operating cash burn rather than yield-generating equipment quickly exhausts runway and guarantees insolvency.
              </p>
              <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                💡 <strong>Mitigation:</strong> Ring-fence capex funds in escrow; enforce minimum 18% ROCE hurdle on funded assets.
              </div>
            </div>
          </div>
        </div>

        {/* 4. Action Checklist */}
        <div
          style={{
            background: "var(--bg-secondary)",
            borderRadius: 8,
            padding: 14,
            marginBottom: 20,
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Institutional Compliance & Risk Mitigation Checklist
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-blue)" }}>
              {Object.values(riskChecklist).filter(Boolean).length} / 6 Verified
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { key: "udyam", title: "Active Udyam Certificate", desc: "Priority sector credit & interest concessions" },
              { key: "gstRecon", title: "GSTR-2B vs 3B Reconciliation", desc: "Prevents tax audit penalties & credit lock" },
              { key: "treds", title: "TReDS Digital Factoring", desc: "Liquidate corporate bills in 48h without debt" },
              { key: "moratorium", title: "6-Month Moratorium Protocol", desc: "Preserves liquidity during capacity expansion" },
              { key: "debtorInsurance", title: "Trade Credit Insurance", desc: "Protects against catastrophic client default" },
              { key: "escrowAccount", title: "Ring-Fenced Capex Escrow", desc: "Guarantees capital isn't diverted into opex" },
            ].map((item) => (
              <div
                key={item.key}
                onClick={() => setRiskChecklist({ ...riskChecklist, [item.key]: !riskChecklist[item.key] })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: riskChecklist[item.key] ? "rgba(16,185,129,0.08)" : "var(--bg-card)",
                  border: riskChecklist[item.key] ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  fontSize: 11.5,
                }}
              >
                <div style={{ color: riskChecklist[item.key] ? "var(--accent-emerald)" : "var(--text-muted)" }}>
                  {riskChecklist[item.key] ? <CheckCircle2 size={14} /> : <Square size={14} />}
                </div>
                <div>
                  <strong style={{ color: "var(--text-primary)", display: "block" }}>{item.title}</strong>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleExportDossier}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}
          >
            <Download size={13} />
            <span>Download Risk Underwriting Dossier (CSV)</span>
          </button>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
            {onOpenRecovery && (
              <button
                className="btn btn-emerald btn-sm"
                onClick={() => {
                  onClose();
                  onOpenRecovery();
                }}
                style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}
              >
                <Zap size={13} />
                <span>Launch Cash Recovery</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
