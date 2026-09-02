import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  FileText,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  getFinancialData,
  getBusiness,
  getInvoices,
  getExpenses,
  getRecurringExpenses,
  subscribeFinancialData,
} from "../data/financialStore";
import {
  getCashFlowSummary,
  calculateRevenue,
  calculateRecurringExpenses,
  calculateOneTimeExpenses,
  calculateAgingBreakdown,
} from "../engines/digitalTwin";

export default function Reports() {
  const [data, setData] = useState(getFinancialData());
  const [summary, setSummary] = useState(getCashFlowSummary());
  const [activeReport, setActiveReport] = useState("pl"); // pl, cashflow, aging

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setData(getFinancialData());
      setSummary(getCashFlowSummary());
    });
    return unsub;
  }, []);

  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;

  const revenue = calculateRevenue();
  const fixedBurn = calculateRecurringExpenses();
  const variableBurn = calculateOneTimeExpenses();
  const grossBurn = fixedBurn + variableBurn;
  const netMargin = revenue - grossBurn;
  const aging = calculateAgingBreakdown();

  // Chart series for P&L Breakdown
  const plChartData = [
    { name: "Invoiced Revenue", amount: revenue, fill: "#34d399" },
    { name: "Fixed Burn", amount: fixedBurn, fill: "#fbbf24" },
    { name: "Variable Spend", amount: variableBurn, fill: "#f87171" },
    { name: "Net Cash Margin", amount: netMargin, fill: netMargin >= 0 ? "#60a5fa" : "#f43f5e" },
  ];

  // Chart series for Aging Breakdown
  const agingChartData = [
    { name: "0-30 Days", amount: aging["0-30 Days"] || 0, fill: "#38bdf8" },
    { name: "31-60 Days", amount: aging["31-60 Days"] || 0, fill: "#fbbf24" },
    { name: "61-90 Days", amount: aging["61-90 Days"] || 0, fill: "#fb923c" },
    { name: "90+ Days", amount: aging["90+ Days"] || 0, fill: "#f43f5e" },
  ];

  // Chart series for Cash Flow Direct Method
  const cashflowChartData = [
    { name: "Opening Cash", amount: summary.currentCash, fill: "#38bdf8" },
    { name: "+ Receivables", amount: summary.receivables, fill: "#34d399" },
    { name: "- Total Outflows", amount: -summary.totalExpenses, fill: "#f87171" },
    { name: "= Closing Cash", amount: summary.projectedCash, fill: summary.projectedCash >= 0 ? "#818cf8" : "#f43f5e" },
  ];

  const handleExportCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeReport === "pl") {
      csvContent += "Category,Amount (INR)\n";
      csvContent += `Gross Revenue Invoiced,${revenue}\n`;
      csvContent += `Fixed Operating Expenses,${fixedBurn}\n`;
      csvContent += `Variable Operating Expenses,${variableBurn}\n`;
      csvContent += `Net Operating Cash Margin,${netMargin}\n`;
    } else if (activeReport === "cashflow") {
      csvContent += "Item,Amount (INR)\n";
      csvContent += `Opening Cash Balance,${summary.currentCash}\n`;
      csvContent += `Expected Collections,${summary.receivables}\n`;
      csvContent += `Total Cash Outflows,${summary.totalExpenses}\n`;
      csvContent += `Projected Closing Balance,${summary.projectedCash}\n`;
    } else {
      csvContent += "Aging Bracket,Amount (INR)\n";
      csvContent += `0-30 Days,${aging["0-30 Days"]}\n`;
      csvContent += `31-60 Days,${aging["31-60 Days"]}\n`;
      csvContent += `61-90 Days,${aging["61-90 Days"]}\n`;
      csvContent += `90+ Days,${aging["90+ Days"]}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NexFin_${activeReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Header Card */}
      <div className="glass-card" style={{ padding: "20px 24px" }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeReport === "pl" ? "active" : ""}`}
              onClick={() => setActiveReport("pl")}
            >
              P&L Operating Statement
            </button>
            <button
              className={`tab-btn ${activeReport === "cashflow" ? "active" : ""}`}
              onClick={() => setActiveReport("cashflow")}
            >
              Cash Flow Statement
            </button>
            <button
              className={`tab-btn ${activeReport === "aging" ? "active" : ""}`}
              onClick={() => setActiveReport("aging")}
            >
              Receivables Aging Report
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-secondary" onClick={handlePrint}>
              <Printer size={14} />
              <span>Print Statement</span>
            </button>
            <button className="btn btn-primary" onClick={handleExportCsv}>
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* P&L Statement View */}
      {activeReport === "pl" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* P&L Visual Bar Graph */}
          <div className="glass-card" style={{ padding: "22px 24px" }}>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div className="card-title-group">
                <div className="card-icon-wrap emerald">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div className="card-title">P&L Operating Inflow vs Outflow Visual Graph</div>
                  <div className="card-subtitle">
                    Live revenue realization vs fixed & variable operational disbursements
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 260, width: "100%", marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plChartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
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
                    formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Amount"]}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {plChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <div>
                <div className="card-title">Monthly Operating Profit & Loss Summary</div>
                <div className="card-subtitle">
                  Business: {data.business.name} • GSTIN: {data.business.gstin || "27AABCA1234F1Z8"}
                </div>
              </div>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Live Digital Twin Ledger
              </span>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Financial Line Item</th>
                    <th>Category</th>
                    <th style={{ textAlign: "right" }}>Amount (₹ INR)</th>
                    <th style={{ textAlign: "right" }}>% of Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>Gross Invoiced Revenue</td>
                    <td>Operating Inflow</td>
                    <td style={{ textAlign: "right", fontWeight: 800, color: "#34d399", fontSize: 15 }}>
                      {formatLakhs(revenue)}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--text-muted)" }}>100.0%</td>
                  </tr>

                  <tr style={{ background: "rgba(255,255,255,0.01)" }}>
                    <td style={{ paddingLeft: 28, color: "var(--text-secondary)" }}>
                      - Fixed Operating Liabilities (Payroll, Rent, SaaS)
                    </td>
                    <td>Fixed Burn</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fbbf24" }}>
                      - {formatLakhs(fixedBurn)}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--text-muted)" }}>
                      {revenue > 0 ? `${((fixedBurn / revenue) * 100).toFixed(1)}%` : "0%"}
                    </td>
                  </tr>

                  <tr style={{ background: "rgba(255,255,255,0.01)" }}>
                    <td style={{ paddingLeft: 28, color: "var(--text-secondary)" }}>
                      - Variable Direct Expenses (Raw Materials, Freight, Repairs)
                    </td>
                    <td>Variable Spend</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fbbf24" }}>
                      - {formatLakhs(variableBurn)}
                    </td>
                    <td style={{ textAlign: "right", color: "var(--text-muted)" }}>
                      {revenue > 0 ? `${((variableBurn / revenue) * 100).toFixed(1)}%` : "0%"}
                    </td>
                  </tr>

                  <tr style={{ borderTop: "2px solid var(--border-medium)" }}>
                    <td style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 15 }}>
                      Net Operating Cash Margin (EBITDA approx.)
                    </td>
                    <td>Net Retained Buffer</td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 800,
                        color: netMargin >= 0 ? "#34d399" : "#fb7185",
                        fontSize: 16,
                      }}
                    >
                      {formatLakhs(netMargin)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "#60a5fa" }}>
                      {revenue > 0 ? `${((netMargin / revenue) * 100).toFixed(1)}%` : "0%"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Statement View */}
      {activeReport === "cashflow" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Cash Flow Visual Waterfall Graph */}
          <div className="glass-card" style={{ padding: "22px 24px" }}>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div className="card-title-group">
                <div className="card-icon-wrap purple">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="card-title">Cash Flow Dynamics & Waterfall Visual Graph</div>
                  <div className="card-subtitle">
                    Step-by-step liquidity bridging from opening reserves to net closing position
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 260, width: "100%", marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowChartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
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
                    formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Amount"]}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {cashflowChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <div>
                <div className="card-title">Cash Flow Statement (Direct Method)</div>
                <div className="card-subtitle">
                  Business: {data.business.name} • Currency: INR (₹)
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Cash Activity</th>
                    <th>Classification</th>
                    <th style={{ textAlign: "right" }}>Amount (₹ INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, color: "var(--text-primary)" }}>Opening Liquid Cash</td>
                    <td>Bank Current Account & Cash Equivalent</td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "#60a5fa" }}>
                      {formatLakhs(summary.currentCash)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text-secondary)" }}>+ Inflows from Customer Invoices</td>
                    <td>Operating Receivables</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#34d399" }}>
                      + {formatLakhs(summary.receivables)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "var(--text-secondary)" }}>- Outflows for Operational Burn</td>
                    <td>Operating Payables</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: "#fb7185" }}>
                      - {formatLakhs(summary.totalExpenses)}
                    </td>
                  </tr>
                  <tr style={{ borderTop: "2px solid var(--border-medium)" }}>
                    <td style={{ fontWeight: 800, color: "var(--text-primary)" }}>Projected Closing Cash Balance</td>
                    <td>Net Month-End Position</td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 800,
                        color: summary.projectedCash >= 0 ? "#34d399" : "#fb7185",
                        fontSize: 16,
                      }}
                    >
                      {formatLakhs(summary.projectedCash)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Receivables Aging View */}
      {activeReport === "aging" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Aging Visual Bar Graph */}
          <div className="glass-card" style={{ padding: "22px 24px" }}>
            <div className="card-header" style={{ marginBottom: 12 }}>
              <div className="card-title-group">
                <div className="card-icon-wrap amber">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <div className="card-title">Receivables Aging Portfolio Distribution Graph</div>
                  <div className="card-subtitle">
                    Risk classification by invoice maturity and overdue duration
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 260, width: "100%", marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingChartData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11.5} tickLine={false} />
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
                      color: "var(--text-primary)",
                    }}
                    formatter={(val) => [`₹${Number(val).toLocaleString("en-IN")}`, "Outstanding Amount"]}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {agingChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <div className="card-header">
              <div>
                <div className="card-title">Accounts Receivable Aging Schedule</div>
                <div className="card-subtitle">Liquidity risk distribution by maturity</div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Aging Bucket</th>
                    <th>Amount</th>
                    <th>% of Total Portfolio</th>
                    <th>Risk Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>Current (0 - 30 Days)</td>
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>{formatLakhs(aging["0-30 Days"])}</td>
                    <td>{aging.total > 0 ? `${((aging["0-30 Days"] / aging.total) * 100).toFixed(1)}%` : "0%"}</td>
                    <td>
                      <span className="status-badge paid">Normal Collection</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>31 - 60 Days</td>
                    <td style={{ fontWeight: 700, color: "#fbbf24" }}>{formatLakhs(aging["31-60 Days"])}</td>
                    <td>{aging.total > 0 ? `${((aging["31-60 Days"] / aging.total) * 100).toFixed(1)}%` : "0%"}</td>
                    <td>
                      <span className="status-badge pending">Moderate Followup</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>61 - 90 Days</td>
                    <td style={{ fontWeight: 700, color: "#fb7185" }}>{formatLakhs(aging["61-90 Days"])}</td>
                    <td>{aging.total > 0 ? `${((aging["61-90 Days"] / aging.total) * 100).toFixed(1)}%` : "0%"}</td>
                    <td>
                      <span className="status-badge overdue">Elevated Risk</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>90+ Days (Severe Overdue)</td>
                    <td style={{ fontWeight: 700, color: "#f43f5e" }}>{formatLakhs(aging["90+ Days"])}</td>
                    <td>{aging.total > 0 ? `${((aging["90+ Days"] / aging.total) * 100).toFixed(1)}%` : "0%"}</td>
                    <td>
                      <span className="status-badge overdue">Default / Action Req.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
