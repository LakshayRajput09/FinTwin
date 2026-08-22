import React, { useState } from "react";
import {
  FlaskConical,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Zap,
  ArrowRight,
  Sparkles,
  IndianRupee,
  Clock,
} from "lucide-react";

import { getFinancialData } from "../data/financialStore";
import {
  getCashFlowSummary,
  calculateShockSimulation,
} from "../engines/digitalTwin";

const presetShocks = [
  {
    title: "Major Client 45-Day Delay",
    desc: "Simulate a severe payment stall on your highest-value receivables.",
    params: { rev: 0, exp: 0, delay: 45 },
  },
  {
    title: "25% Demand Contraction",
    desc: "Market slowdown reduces top-line monthly revenue by 25%.",
    params: { rev: -25, exp: 0, delay: 10 },
  },
  {
    title: "15% Raw Material Inflation",
    desc: "Supply chain cost surge increases overall operational burn by 15%.",
    params: { rev: 0, exp: 15, delay: 5 },
  },
  {
    title: "Triple Shock Scenario",
    desc: "Concurrent 20% revenue drop, 15% cost inflation, and 30-day collection delay.",
    params: { rev: -20, exp: 15, delay: 30 },
  },
];

export default function Simulator() {
  const [revenueChange, setRevenueChange] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);
  const [paymentDelay, setPaymentDelay] = useState(0);

  const baseline = getCashFlowSummary();
  const simulation = calculateShockSimulation({
    revenueChangePercent: revenueChange,
    expenseChangePercent: expenseChange,
    paymentDelayDays: paymentDelay,
  });

  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;

  const handleApplyPreset = (p) => {
    setRevenueChange(p.rev);
    setExpenseChange(p.exp);
    setPaymentDelay(p.delay);
  };

  const handleReset = () => {
    setRevenueChange(0);
    setExpenseChange(0);
    setPaymentDelay(0);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Preset Stress Cards */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--text-muted)", marginBottom: 12 }}>
          One-Click Stress Test Presets
        </div>
        <div className="grid-4">
          {presetShocks.map((shock, idx) => (
            <div
              key={idx}
              className="glass-card interactive"
              style={{ padding: 18 }}
              onClick={() => handleApplyPreset(shock.params)}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 6 }}>
                {shock.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {shock.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Simulation Workspace */}
      <div className="grid-12">
        {/* Sliders Control Panel */}
        <div className="col-span-6 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap purple">
                <FlaskConical size={18} />
              </div>
              <div>
                <div className="card-title">Stress Parameters</div>
                <div className="card-subtitle">Adjust variables to test financial elasticity</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 10 }}>
            {/* Revenue Slump Slider */}
            <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: "var(--text-secondary)" }}>Revenue Variance</span>
                <span style={{ color: revenueChange < 0 ? "#fb7185" : revenueChange > 0 ? "#34d399" : "#60a5fa", fontWeight: 700 }}>
                  {revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={revenueChange}
                onChange={(e) => setRevenueChange(Number(e.target.value))}
                className="range-slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)" }}>
                <span>-50% (Severe slump)</span>
                <span>0% (Baseline)</span>
                <span>+50% (Surge)</span>
              </div>
            </div>

            {/* Expense Inflation Slider */}
            <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: "var(--text-secondary)" }}>Cost / Burn Inflation</span>
                <span style={{ color: expenseChange > 0 ? "#fb7185" : "#60a5fa", fontWeight: 700 }}>
                  {expenseChange > 0 ? `+${expenseChange}%` : `${expenseChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                value={expenseChange}
                onChange={(e) => setExpenseChange(Number(e.target.value))}
                className="range-slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)" }}>
                <span>-30% (Cost cut)</span>
                <span>0% (Baseline)</span>
                <span>+50% (Surge)</span>
              </div>
            </div>

            {/* Payment Delay Slider */}
            <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                <span style={{ color: "var(--text-secondary)" }}>Additional Client Delay</span>
                <span style={{ color: paymentDelay > 0 ? "#fbbf24" : "#60a5fa", fontWeight: 700 }}>
                  +{paymentDelay} Days Delay
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={paymentDelay}
                onChange={(e) => setPaymentDelay(Number(e.target.value))}
                className="range-slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-dim)" }}>
                <span>0 Days</span>
                <span>30 Days</span>
                <span>60 Days (Prolonged stall)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Outcomes */}
        <div className="col-span-6 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap emerald">
                <Zap size={18} />
              </div>
              <div>
                <div className="card-title">Stress Test Outcome</div>
                <div className="card-subtitle">Digital twin projected resilience</div>
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                background:
                  simulation.riskLevel === "Critical Deficit"
                    ? "rgba(244,63,94,0.2)"
                    : simulation.riskLevel === "High Warning"
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(16,185,129,0.2)",
                color:
                  simulation.riskLevel === "Critical Deficit"
                    ? "#fb7185"
                    : simulation.riskLevel === "High Warning"
                    ? "#fbbf24"
                    : "#34d399",
              }}
            >
              {simulation.riskLevel}
            </span>
          </div>

          <div className="grid-2" style={{ gap: 14, margin: "14px 0" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Projected Stressed Cash</div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: simulation.stressedCash >= 0 ? "#60a5fa" : "#fb7185",
                  marginTop: 4,
                }}
              >
                {formatLakhs(simulation.stressedCash)}
              </div>
              <div style={{ fontSize: 11.5, color: simulation.cashVariance < 0 ? "#fb7185" : "#34d399", marginTop: 4 }}>
                {simulation.cashVariance < 0 ? "-" : "+"}{formatLakhs(Math.abs(simulation.cashVariance))} vs Baseline
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: "var(--radius-md)" }}>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Stressed Cash Runway</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 4 }}>
                {simulation.stressedRunway} Days
              </div>
              <div style={{ fontSize: 11.5, color: simulation.runwayDiff < 0 ? "#fb7185" : "#34d399", marginTop: 4 }}>
                {simulation.runwayDiff} Days vs Baseline ({baseline.runwayDays}d)
              </div>
            </div>
          </div>

          {/* Actionable Playbook */}
          <div
            style={{
              padding: 16,
              borderRadius: "var(--radius-md)",
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.25)",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: "#c4b5fd", display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={14} /> AI Recommended Mitigation Playbook
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, marginTop: 8, lineHeight: 1.6 }}>
              {simulation.stressedCash < 0
                ? "Liquidity alert: In this stress scenario, your business faces an immediate cash crunch. We recommend establishing a ₹4.00L invoice discounting line now before collections stall."
                : "Resilience confirmed: Your current cash reserves absorb this shock while maintaining a positive liquidity buffer."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}