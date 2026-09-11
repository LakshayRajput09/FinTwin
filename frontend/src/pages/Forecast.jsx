import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  getFinancialData,
  subscribeFinancialData,
} from "../data/financialStore";
import {
  generateLocalForecast,
  getCashFlowSummary,
} from "../engines/digitalTwin";
import { useTheme } from "../context/ThemeContext";

export default function Forecast() {
  const { currentTheme } = useTheme();
  const [horizonDays, setHorizonDays] = useState(90);
  const [forecast, setForecast] = useState(() => generateLocalForecast(90));
  const [summary, setSummary] = useState(getCashFlowSummary());
  const [chartView, setChartView] = useState("area"); // 'area' | 'line'
  const [showBest, setShowBest] = useState(true);
  const [showExpected, setShowExpected] = useState(true);
  const [showWorst, setShowWorst] = useState(true);

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setForecast(generateLocalForecast(horizonDays));
      setSummary(getCashFlowSummary());
    });
    return unsub;
  }, [horizonDays]);

  const handleHorizonChange = (days) => {
    setHorizonDays(days);
    setForecast(generateLocalForecast(days));
  };

  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Metric Row */}
      <div className="grid-4">
        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">Forecast Horizon</span>
            <div className="card-icon-wrap blue">
              <Calendar size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#60a5fa" }}>
              {horizonDays} Days
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Probabilistic Forward Model</span>
          </div>
        </div>

        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">Breach Risk Horizon</span>
            <div className="card-icon-wrap amber">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#B7791F" }}>
              {forecast.breachDay}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>Under Worst-Case Delay Stress</span>
          </div>
        </div>

        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">Lowest Projected Buffer</span>
            <div className="card-icon-wrap rose">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: forecast.lowestProjectedCash >= 0 ? "#34d399" : "#fb7185" }}>
              {formatLakhs(forecast.lowestProjectedCash)}
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Peak Working Capital Stress Point</span>
          </div>
        </div>

        <div className="kpi-card graphical-card-interactive">
          <div className="kpi-top">
            <span className="kpi-label">Twin AI Confidence Score</span>
            <div className="card-icon-wrap emerald">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#34d399" }}>
              94.8%
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Trained on MSME Payment Cycles</span>
          </div>
        </div>
      </div>

      {/* Main Forecast Chart with Dynamic Controls */}
      <div className="glass-card">
        <div className="card-header" style={{ flexWrap: "wrap", gap: 14 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap purple">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="card-title">{horizonDays}-Day Dynamic Cash Runway Simulation</div>
              <div className="card-subtitle">
                Confidence envelopes: P10 Worst-Case (Delayed Collections), P50 Expected, P90 Accelerated
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {/* Horizon Selector */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 2 }}>
              {[15, 30, 60, 90, 120].map((days) => (
                <button
                  key={days}
                  onClick={() => handleHorizonChange(days)}
                  style={{
                    padding: "4px 9px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    background: horizonDays === days ? currentTheme.primaryAccent : "transparent",
                    color: horizonDays === days ? "#000" : "var(--text-secondary)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {days}D
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 2 }}>
              <button
                onClick={() => setChartView("area")}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 11,
                  background: chartView === "area" ? "rgba(255,255,255,0.15)" : "transparent",
                  color: chartView === "area" ? "#fff" : "var(--text-muted)",
                }}
              >
                Area
              </button>
              <button
                onClick={() => setChartView("line")}
                style={{
                  padding: "4px 8px",
                  borderRadius: 6,
                  fontSize: 11,
                  background: chartView === "line" ? "rgba(255,255,255,0.15)" : "transparent",
                  color: chartView === "line" ? "#fff" : "var(--text-muted)",
                }}
              >
                Line
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Series Toggle Filters */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 6, margin: "0 16px 8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", marginRight: 4 }}>Filter Series:</span>
          <button
            onClick={() => setShowExpected(!showExpected)}
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 12,
              background: showExpected ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.05)",
              color: showExpected ? "#1F5A4A" : "var(--text-muted)",
              border: "1px solid rgba(56,189,248,0.3)",
            }}
          >
            P50 Expected
          </button>
          <button
            onClick={() => setShowBest(!showBest)}
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 12,
              background: showBest ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
              color: showBest ? "#34d399" : "var(--text-muted)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
          >
            P90 Best Case
          </button>
          <button
            onClick={() => setShowWorst(!showWorst)}
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 12,
              background: showWorst ? "rgba(244,63,94,0.2)" : "rgba(255,255,255,0.05)",
              color: showWorst ? "#fb7185" : "var(--text-muted)",
              border: "1px solid rgba(244,63,94,0.3)",
            }}
          >
            P10 Worst Case
          </button>
        </div>

        <div style={{ height: 340, width: "100%", padding: "0 10px 10px" }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "area" ? (
              <AreaChart data={forecast.timeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D5B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2E7D5B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentTheme.primaryAccent} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={currentTheme.primaryAccent} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B54747" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B54747" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 18, 31, 0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val) => [`₹${(Number(val) / 100000).toFixed(2)}L`, ""]}
                />
                {showBest && (
                  <Area
                    type="monotone"
                    dataKey="bestCase"
                    stroke="#2E7D5B"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#colorBest)"
                    animationDuration={500}
                  />
                )}
                {showExpected && (
                  <Area
                    type="monotone"
                    dataKey="expectedCash"
                    stroke={currentTheme.primaryAccent}
                    strokeWidth={2.5}
                    fill="url(#colorExpected)"
                    animationDuration={500}
                  />
                )}
                {showWorst && (
                  <Area
                    type="monotone"
                    dataKey="worstCase"
                    stroke="#B54747"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="url(#colorWorst)"
                    animationDuration={500}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={forecast.timeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 18, 31, 0.95)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(val) => [`₹${(Number(val) / 100000).toFixed(2)}L`, ""]}
                />
                {showBest && (
                  <Line type="monotone" dataKey="bestCase" stroke="#2E7D5B" strokeWidth={2} dot={false} animationDuration={500} />
                )}
                {showExpected && (
                  <Line type="monotone" dataKey="expectedCash" stroke={currentTheme.primaryAccent} strokeWidth={3} dot={false} animationDuration={500} />
                )}
                {showWorst && (
                  <Line type="monotone" dataKey="worstCase" stroke="#B54747" strokeWidth={2} strokeDasharray="4 4" dot={false} animationDuration={500} />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}