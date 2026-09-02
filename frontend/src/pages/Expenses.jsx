import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  TrendingDown,
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck,
  Zap,
  BarChart3,
  RefreshCw,
  FolderPlus,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  getFinancialData,
  getRecurringExpenses,
  getExpenses,
  addExpense,
  deleteExpense,
  subscribeFinancialData,
} from "../data/financialStore";
import {
  calculateRecurringExpenses,
  calculateOneTimeExpenses,
  calculateTotalMonthlyBurn,
} from "../engines/digitalTwin";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#64748b",
];

const DEFAULT_EXPENSE_PRESETS = [
  { category: "Payroll & Salaries", description: "Monthly Core Team Payroll", amount: 240000, recurring: true, dayOfMonth: 1 },
  { category: "Facility & Rent", description: "Office & Warehouse Facility Lease", amount: 75000, recurring: true, dayOfMonth: 5 },
  { category: "Raw Materials", description: "Production Batch Consumables", amount: 120000, recurring: false, date: new Date().toISOString().slice(0, 10) },
  { category: "Software & SaaS", description: "ERP, Cloud Infrastructure & Tools", amount: 35000, recurring: true, dayOfMonth: 10 },
  { category: "Logistics & Freight", description: "Interstate Freight Shipments", amount: 45000, recurring: false, date: new Date().toISOString().slice(0, 10) },
];

export default function Expenses() {
  const [data, setData] = useState(getFinancialData());
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [chartViewMode, setChartViewMode] = useState("pie"); // "pie" | "bar"

  // Form State
  const [category, setCategory] = useState("Payroll & Salaries");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [dayOfMonth, setDayOfMonth] = useState(1);

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setData(getFinancialData());
    });
    return unsub;
  }, []);

  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;
  const formatMoney = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;

  const totalRecurring = calculateRecurringExpenses();
  const totalOneTime = calculateOneTimeExpenses();
  const totalBurn = calculateTotalMonthlyBurn();

  // Category breakdown data for charts
  const categoryMap = {};
  (data.recurringExpenses || []).forEach((r) => {
    const cat = r.category || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(r.amount || 0);
  });
  (data.expenses || []).forEach((e) => {
    const cat = e.category || "General";
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
  });

  const chartData = Object.keys(categoryMap)
    .filter((k) => categoryMap[k] > 0)
    .map((k) => ({
      name: k,
      value: categoryMap[k],
      amount: categoryMap[k],
    }));

  const totalExpensesSum = chartData.reduce((s, c) => s + c.value, 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount) return;

    addExpense({
      category,
      description: description || category,
      amount: Number(amount),
      recurring,
      dayOfMonth: Number(dayOfMonth),
    });

    setDescription("");
    setAmount("");
    setShowAddModal(false);
  };

  const handleLoadSamplePresets = () => {
    DEFAULT_EXPENSE_PRESETS.forEach((item) => {
      addExpense(item);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Metric Cards */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Monthly Burn</span>
            <div className="card-icon-wrap rose">
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fb7185" }}>
              {formatLakhs(totalBurn)}
            </span>
          </div>
          <div className="kpi-trend negative">
            <span>₹{(totalBurn / 30 / 1000).toFixed(1)}k Daily Burn Rate</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Fixed Recurring Liabilities</span>
            <div className="card-icon-wrap amber">
              <CreditCard size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fbbf24" }}>
              {formatLakhs(totalRecurring)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>{data.recurringExpenses.length} Fixed Subscriptions / Payroll</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Variable & One-Time Spend</span>
            <div className="card-icon-wrap">
              <Layers size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#60a5fa" }}>
              {formatLakhs(totalOneTime)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>{data.expenses.length} Logged Variable Invoices</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Active Cost Centers</span>
            <div className="card-icon-wrap emerald">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#34d399" }}>
              {chartData.length} Categories
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>{chartData.length > 0 ? "Categorized & Tracked" : "Awaiting Data Entry"}</span>
          </div>
        </div>
      </div>

      {/* Expense Analytics & Category Breakdown */}
      <div className="grid-12">
        {/* Pie / Donut Breakdown */}
        <div className="col-span-6 glass-card" style={{ display: "flex", flexDirection: "column" }}>
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap purple">
                <PieIcon size={18} />
              </div>
              <div>
                <div className="card-title">Expense Distribution by Category</div>
                <div className="card-subtitle">Aggregated fixed & variable operational expenditure</div>
              </div>
            </div>

            {/* View Mode Toggle */}
            {chartData.length > 0 && (
              <div style={{ display: "flex", gap: 4, background: "rgba(15,23,42,0.6)", padding: 2, borderRadius: 6 }}>
                <button
                  onClick={() => setChartViewMode("pie")}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    border: "none",
                    background: chartViewMode === "pie" ? "#3b82f6" : "transparent",
                    color: chartViewMode === "pie" ? "#fff" : "var(--text-muted)",
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  title="Donut Chart View"
                >
                  <PieIcon size={13} style={{ verticalAlign: "middle" }} />
                </button>
                <button
                  onClick={() => setChartViewMode("bar")}
                  style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    border: "none",
                    background: chartViewMode === "bar" ? "#3b82f6" : "transparent",
                    color: chartViewMode === "bar" ? "#fff" : "var(--text-muted)",
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                  title="Bar Chart View"
                >
                  <BarChart3 size={13} style={{ verticalAlign: "middle" }} />
                </button>
              </div>
            )}
          </div>

          {/* Render Active Chart or Empty State */}
          {chartData.length > 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 300 }}>
              {chartViewMode === "pie" ? (
                <div style={{ height: 220, width: "100%", position: "relative" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        animationDuration={600}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(15, 23, 42, 0.95)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(val) => [`${formatMoney(val)} (${totalExpensesSum > 0 ? ((Number(val) / totalExpensesSum) * 100).toFixed(1) : 0}%)`, "Expenditure"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: 220, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 25, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis
                        type="number"
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                      />
                      <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={11} tickLine={false} width={90} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border-medium)",
                          borderRadius: 8,
                          fontSize: 12,
                          boxShadow: "var(--shadow-md)",
                          color: "var(--text-primary)",
                        }}
                        formatter={(val) => [formatMoney(val), "Amount"]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Categorical Color Legend Grid */}
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "8px 12px",
                }}
              >
                {chartData.map((entry, index) => {
                  const pct = totalExpensesSum > 0 ? ((entry.value / totalExpensesSum) * 100).toFixed(1) : 0;
                  return (
                    <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: COLORS[index % COLORS.length],
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {entry.name}
                      </span>
                      <strong style={{ color: "var(--text-primary)", marginLeft: "auto" }}>
                        {pct}%
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Informative Zero State */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "36px 20px",
                textAlign: "center",
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "rgba(139,92,246,0.12)",
                  border: "2px dashed rgba(139,92,246,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a78bfa",
                  marginBottom: 14,
                }}
              >
                <PieIcon size={24} />
              </div>
              <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>No Itemized Expenses Logged Yet</strong>
              <p style={{ color: "var(--text-muted)", fontSize: 12, maxWidth: 300, margin: "6px 0 16px" }}>
                Log your recurring liabilities (payroll, rent, SaaS) to visualize your cost centers.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddModal(true)}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={14} />
                  <span>Log First Expense</span>
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleLoadSamplePresets}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <FolderPlus size={14} />
                  <span>Load MSME Preset Categories</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* AI Cost Optimization Insights */}
        <div className="col-span-6 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap emerald">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="card-title">AI Burn Optimization Insights</div>
                <div className="card-subtitle">Actionable cost rationalization</div>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
              <Plus size={14} /> Log Expense
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
            <div style={{ padding: 14, borderRadius: "var(--radius-md)", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#60a5fa" }}>
                💡 Vendor Term Renegotiation
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                Raw material supplier invoicing on 15-day cycles. Switching to standard 30-day net terms retains ₹1.80L cash buffer for 2 extra weeks.
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: "var(--radius-md)", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#34d399" }}>
                ⚡ Software & SaaS Rationalization
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                Annualized cloud licenses save ₹35,000 compared to month-to-month billing cycles.
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: "var(--radius-md)", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#fbbf24" }}>
                🚛 Freight Consolidation
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                Consolidating bi-weekly carrier dispatches into weekly batches can trim 12% in logistics freight surcharges.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Listings Table */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-wrap">
              <CreditCard size={18} />
            </div>
            <div>
              <div className="card-title">Expense Itemization</div>
              <div className="card-subtitle">Active recurring & one-time operational costs</div>
            </div>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Items
            </button>
            <button
              className={`tab-btn ${activeTab === "recurring" ? "active" : ""}`}
              onClick={() => setActiveTab("recurring")}
            >
              Recurring ({data.recurringExpenses.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "variable" ? "active" : ""}`}
              onClick={() => setActiveTab("variable")}
            >
              One-Time ({data.expenses.length})
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Cadence / Date</th>
                <th>Classification</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "all" || activeTab === "recurring") &&
                data.recurringExpenses.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{rec.category}</td>
                    <td>{rec.description}</td>
                    <td style={{ fontWeight: 700, color: "#fbbf24" }}>
                      {formatLakhs(rec.amount)}
                    </td>
                    <td>Monthly (Day {rec.dayOfMonth})</td>
                    <td>
                      <span className="status-badge" style={{ background: "rgba(139,92,246,0.15)", color: "#c4b5fd" }}>
                        Fixed Recurring
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px" }}
                        onClick={() => deleteExpense(rec.id, true)}
                        title="Remove Expense"
                      >
                        <Trash2 size={13} style={{ color: "#fb7185" }} />
                      </button>
                    </td>
                  </tr>
                ))}

              {(activeTab === "all" || activeTab === "variable") &&
                data.expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                      {formatLakhs(exp.amount)}
                    </td>
                    <td>{exp.date || "2026-08-10"}</td>
                    <td>
                      <span className="status-badge" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>
                        One-Time
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 8px" }}
                        onClick={() => deleteExpense(exp.id, false)}
                        title="Remove Expense"
                      >
                        <Trash2 size={13} style={{ color: "#fb7185" }} />
                      </button>
                    </td>
                  </tr>
                ))}

              {data.recurringExpenses.length === 0 && data.expenses.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "28px", color: "var(--text-muted)" }}>
                    No expenses recorded. Click "Log Expense" or "Load MSME Preset Categories" above to initialize.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Record Expense</div>
            </div>
            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Payroll & Salaries">Payroll & Salaries</option>
                  <option value="Raw Materials">Raw Materials & Supplies</option>
                  <option value="Facility & Rent">Facility & Warehouse Rent</option>
                  <option value="Utilities & Power">Utilities & Power</option>
                  <option value="Logistics & Freight">Logistics & Freight</option>
                  <option value="Software & SaaS">Software & Cloud Subscriptions</option>
                  <option value="Equipment Maintenance">Equipment Maintenance</option>
                  <option value="General & Misc">General & Misc</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Monthly CNC Tooling purchase"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹ INR)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 120000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
                <input
                  type="checkbox"
                  id="recCheck"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: "var(--accent-blue)" }}
                />
                <label htmlFor="recCheck" style={{ fontSize: 13, cursor: "pointer", color: "var(--text-primary)" }}>
                  Monthly recurring liability
                </label>
              </div>

              {recurring && (
                <div className="form-group">
                  <label className="form-label">Billing Day of Month (1-28)</label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    className="form-input"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}