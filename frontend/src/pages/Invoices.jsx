import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Upload,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Trash2,
  Check,
  Send,
  Sparkles,
  Filter,
  FileSpreadsheet,
  FileCode,
  File,
  Cpu,
  Zap,
  Mail,
  Phone,
  ShieldAlert,
  ExternalLink,
} from "lucide-react";

import {
  getInvoices,
  getCustomers,
  addInvoice,
  createInvoices,
  updateInvoiceStatus,
  deleteInvoice,
  subscribeFinancialData,
} from "../data/financialStore";
import { parseInvoiceFile } from "../utils/invoiceParser";
import { calculateInvoiceRiskAnalysis } from "../utils/riskRecoveryEngine";
import CashRecoveryModal from "../components/CashRecoveryModal";
import DeepDiveRiskModal from "../components/DeepDiveRiskModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

export default function Invoices() {
  const [invoices, setInvoices] = useState(getInvoices());
  const [customers, setCustomers] = useState(getCustomers());
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recoveryInvoice, setRecoveryInvoice] = useState(null);
  const [selectedDeepDiveInvoice, setSelectedDeepDiveInvoice] = useState(null);
  const [notification, setNotification] = useState("");

  // Multi-Format Upload State
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState("all");

  // New Invoice Form
  const [newCustomer, setNewCustomer] = useState(customers[0]?.name || "Customer A (Auto Corp)");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setInvoices(getInvoices());
      setCustomers(getCustomers());
    });
    return unsub;
  }, []);

  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;

  // Filter and search
  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === "pending" && inv.status !== "Pending") return false;
    if (activeTab === "overdue" && inv.status !== "Overdue") return false;
    if (activeTab === "paid" && inv.status !== "Paid") return false;
    if (activeTab === "at_risk") {
      if (inv.status === "Paid") return false;
      const risk = calculateInvoiceRiskAnalysis(inv);
      if (risk.riskScoreIndex < 40 && inv.status !== "Overdue") return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q) ||
        (inv.recoveryStatus && inv.recoveryStatus.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + Number(i.amount || 0), 0);

  // Risk Analysis Totals
  const totalPenalInterestAccrued = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, inv) => {
      const r = calculateInvoiceRiskAnalysis(inv);
      return sum + r.accruedPenalInterest;
    }, 0);

  const totalAtRiskCount = invoices.filter((i) => {
    if (i.status === "Paid") return false;
    const r = calculateInvoiceRiskAnalysis(i);
    return r.riskScoreIndex >= 40 || i.status === "Overdue";
  }).length;

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newAmount) return;

    addInvoice({
      customer: newCustomer,
      amount: Number(newAmount),
      dueDate: newDueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      status: newStatus,
    });

    setNewAmount("");
    setShowCreateModal(false);
    showNotice("Invoice created successfully!");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      const result = await parseInvoiceFile(file);
      setParsedPreview(result);
    } catch (err) {
      showNotice("Failed to parse invoice file. Please check file formatting.");
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedPreview || !parsedPreview.invoices.length) return;
    createInvoices(parsedPreview.invoices);
    const count = parsedPreview.invoices.length;
    const formatName = parsedPreview.format;
    setParsedPreview(null);
    setShowUploadModal(false);
    showNotice(`Successfully imported ${count} invoice(s) from ${formatName}!`);
  };

  const showNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: 85,
            right: 36,
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: 13.5,
            boxShadow: "var(--shadow-lg)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Metric Row */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Invoiced</span>
            <FileText size={18} style={{ color: "#60a5fa" }} />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#60a5fa" }}>
              {formatLakhs(totalInvoiced)}
            </span>
          </div>
          <div className="kpi-trend neutral">{invoices.length} Total Invoices</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Pending Collection</span>
            <Clock size={18} style={{ color: "#fbbf24" }} />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fbbf24" }}>
              {formatLakhs(totalPending)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            {invoices.filter((i) => i.status === "Pending").length} Pending Invoices
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Overdue Trapped Cash</span>
            <AlertTriangle size={18} style={{ color: "#fb7185" }} />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fb7185" }}>
              {formatLakhs(totalOverdue)}
            </span>
          </div>
          <div className="kpi-trend negative">
            {invoices.filter((i) => i.status === "Overdue").length} Overdue Accounts
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Settled / Collected</span>
            <CheckCircle2 size={18} style={{ color: "#34d399" }} />
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#34d399" }}>
              {formatLakhs(totalPaid)}
            </span>
          </div>
          <div className="kpi-trend positive">
            {invoices.filter((i) => i.status === "Paid").length} Paid Invoices
          </div>
        </div>
      </div>

      {/* Risk Analysis & Cash Recovery Action Hub */}
      <div
        style={{
          padding: "16px 22px",
          borderRadius: 14,
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.08))",
          border: "1px solid rgba(34, 197, 94, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#22c55e",
              flexShrink: 0,
            }}
          >
            <Zap size={22} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: "var(--text-primary)" }}>
                Autonomous Cash Recovery & Section 43B(h) Dispatch
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 10,
                  background: "rgba(244, 63, 94, 0.15)",
                  color: "#fb7185",
                  border: "1px solid rgba(244, 63, 94, 0.3)",
                }}
              >
                {totalAtRiskCount} Invoices at Default Risk
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 3 }}>
              Trapped Overdue: <strong style={{ color: "#fb7185" }}>{formatLakhs(totalOverdue)}</strong> • Accrued 3x RBI Penal Interest (19.5% p.a.):{" "}
              <strong style={{ color: "var(--accent-purple)" }}>₹{totalPenalInterestAccrued.toLocaleString("en-IN")}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{
              height: 36,
              padding: "0 14px",
              fontWeight: 700,
              fontSize: 12,
              gap: 6,
              display: "flex",
              alignItems: "center",
              borderColor: "rgba(244, 63, 94, 0.4)",
              color: "var(--accent-rose)",
            }}
            onClick={() => {
              const firstDue = invoices.find((i) => i.status === "Overdue") || invoices[0];
              setSelectedDeepDiveInvoice(firstDue);
            }}
          >
            <ShieldAlert size={14} />
            <span>Deep-Dive Risk Analysis</span>
          </button>

          <button
            className="btn btn-sm"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              border: "none",
              height: 36,
              padding: "0 16px",
              fontWeight: 700,
              fontSize: 12,
              gap: 6,
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.25)",
            }}
            onClick={() => {
              const firstDue = invoices.find((i) => i.status === "Overdue") || invoices.find((i) => i.status !== "Paid");
              if (firstDue) setRecoveryInvoice(firstDue);
            }}
          >
            <Send size={13} />
            <span>1-Click WhatsApp / Email Recovery</span>
          </button>
        </div>
      </div>

      {/* Visual Invoices Status Chart */}
      {invoices.length > 0 && (
        <div className="glass-card" style={{ padding: "20px 24px" }}>
          <div className="card-header" style={{ marginBottom: 10 }}>
            <div className="card-title-group">
              <div className="card-icon-wrap emerald">
                <FileText size={18} />
              </div>
              <div>
                <div className="card-title">Live Receivables Portfolio Breakdown</div>
                <div className="card-subtitle">
                  Synchronized with uploaded invoices — Pending, Overdue, and Settled Cash
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 160, width: "100%", marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={[
                  { name: "Pending", amount: totalPending, count: invoices.filter((i) => i.status === "Pending").length, fill: "#fbbf24" },
                  { name: "Overdue", amount: totalOverdue, count: invoices.filter((i) => i.status === "Overdue").length, fill: "#fb7185" },
                  { name: "Collected", amount: totalPaid, count: invoices.filter((i) => i.status === "Paid").length, fill: "#34d399" },
                ]}
                margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  type="number"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" fontSize={12} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "var(--shadow-md)",
                    color: "var(--text-primary)",
                  }}
                  formatter={(val, name, props) => [
                    `₹${Number(val).toLocaleString("en-IN")} (${props.payload.count} invoices)`,
                    "Total Amount",
                  ]}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {[
                    { fill: "#fbbf24" },
                    { fill: "#fb7185" },
                    { fill: "#34d399" },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter, Search & Actions Bar */}
      <div className="glass-card" style={{ padding: "18px 24px" }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          {/* Tabs */}
          <div className="tabs-container mobile-scroll-x">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Invoices ({invoices.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Pending ({invoices.filter((i) => i.status === "Pending").length})
            </button>
            <button
              className={`tab-btn ${activeTab === "overdue" ? "active" : ""}`}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue ({invoices.filter((i) => i.status === "Overdue").length})
            </button>
            <button
              className={`tab-btn ${activeTab === "at_risk" ? "active" : ""}`}
              onClick={() => setActiveTab("at_risk")}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <Zap size={12} style={{ color: "var(--accent-rose)" }} />
              <span>At-Risk / Recovery ({totalAtRiskCount})</span>
            </button>
            <button
              className={`tab-btn ${activeTab === "paid" ? "active" : ""}`}
              onClick={() => setActiveTab("paid")}
            >
              Paid ({invoices.filter((i) => i.status === "Paid").length})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", flex: "1 1 240px", minWidth: 0, width: "100%" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Search by invoice ID or client..."
              style={{ paddingLeft: 34, height: 38, fontSize: 13, width: "100%" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setParsedPreview(null);
                setShowUploadModal(true);
              }}
            >
              <Upload size={14} />
              <span>Import Invoices (CSV / Excel / PDF / JSON)</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={14} />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="glass-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer / Client</th>
                <th>Principal & Penal Int.</th>
                <th>Due Date</th>
                <th>AI Delay & 43B(h) Audit</th>
                <th>Risk Analysis Attributes</th>
                <th>Recovery Status</th>
                <th style={{ textAlign: "right" }}>Cash Recovery & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const cust = customers.find((c) => c.name === inv.customer || c.id === inv.customerId);
                const risk = calculateInvoiceRiskAnalysis(inv, cust);

                return (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                      {inv.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{inv.customer}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                        <span>Issued: {inv.invoiceDate || "2026-08-01"}</span>
                        {(inv.phone || cust?.phone) && (
                          <span style={{ color: "#22c55e", fontWeight: 600 }}>• 📱 {inv.phone || cust?.phone}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: "#60a5fa", fontSize: 14 }}>
                        {formatLakhs(inv.amount)}
                      </div>
                      {inv.status !== "Paid" && risk.accruedPenalInterest > 0 && (
                        <div
                          style={{ fontSize: 10.5, color: "var(--accent-purple)", fontWeight: 700 }}
                          title="Accrued compound interest at 3x RBI Bank Rate (~19.5% p.a.) under Section 16 MSMED Act"
                        >
                          +₹{risk.accruedPenalInterest.toLocaleString("en-IN")} penal int.
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{inv.dueDate}</div>
                      {risk.daysOverdue > 0 && (
                        <div style={{ fontSize: 10.5, color: "var(--accent-rose)", fontWeight: 700 }}>
                          +{risk.daysOverdue}d overdue
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Sparkles size={12} style={{ color: "#a78bfa" }} />
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              color:
                                inv.predictedDelayDays > 15
                                  ? "var(--accent-rose)"
                                  : inv.predictedDelayDays > 5
                                  ? "var(--accent-amber)"
                                  : "var(--accent-emerald)",
                            }}
                          >
                            +{inv.predictedDelayDays || 4}d predicted delay
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 4,
                            width: "fit-content",
                            background:
                              risk.section43bSeverity === "critical"
                                ? "rgba(244,63,94,0.15)"
                                : risk.section43bSeverity === "warning"
                                ? "rgba(245,158,11,0.15)"
                                : "rgba(16,185,129,0.12)",
                            color:
                              risk.section43bSeverity === "critical"
                                ? "var(--accent-rose)"
                                : risk.section43bSeverity === "warning"
                                ? "var(--accent-amber)"
                                : "var(--accent-emerald)",
                          }}
                          title={risk.section43bMessage}
                        >
                          Sec 43B(h): {risk.section43bStatus}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        onClick={() => setSelectedDeepDiveInvoice(inv)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          cursor: "pointer",
                          padding: "4px 8px",
                          borderRadius: 6,
                          background: "var(--bg-secondary)",
                          border: "1px dashed var(--border-medium)",
                          transition: "all 0.15s ease",
                        }}
                        title="Click for Deep-Dive Risk Analysis on this invoice"
                      >
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
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <ShieldAlert size={10} />
                            {risk.riskTier}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 900, color: risk.riskBadgeColor }}>
                            {risk.riskScoreIndex}/100
                          </span>
                        </div>
                        <div style={{ fontSize: 10.5, color: "var(--text-secondary)", display: "flex", justifyContent: "space-between" }}>
                          <span>
                            Risk:{" "}
                            <strong style={{ color: risk.defaultProbability > 50 ? "var(--accent-rose)" : "var(--text-primary)" }}>
                              {risk.defaultProbability}%
                            </strong>
                          </span>
                          <span style={{ color: "var(--accent-blue)", fontWeight: 700 }}>🔍 Deep Dive</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span
                          className={`status-badge ${
                            inv.status === "Paid"
                              ? "paid"
                              : inv.status === "Overdue"
                              ? "overdue"
                              : "pending"
                          }`}
                        >
                          {inv.status}
                        </span>
                        {inv.recoveryStatus && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: inv.lastChannel === "whatsapp" ? "#22c55e" : "#38bdf8",
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            {inv.lastChannel === "whatsapp" ? "🟢" : "🔵"} {inv.recoveryStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        {inv.status !== "Paid" && (
                          <button
                            className="btn btn-sm"
                            style={{
                              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))",
                              border: "1px solid rgba(34, 197, 94, 0.4)",
                              color: "#22c55e",
                              padding: "4px 10px",
                              fontWeight: 700,
                              fontSize: 11.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                              borderRadius: 6,
                            }}
                            onClick={() => setRecoveryInvoice(inv)}
                            title="Open MSME Cash Recovery Hub (WhatsApp & Email Dispatch)"
                          >
                            <Zap size={13} style={{ color: "#22c55e" }} />
                            <span>Cash Recovery</span>
                          </button>
                        )}

                        {inv.status !== "Paid" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "4px 8px" }}
                            onClick={() => {
                              updateInvoiceStatus(inv.id, "Paid");
                              showNotice(`Invoice ${inv.id} marked as Paid!`);
                            }}
                            title="Mark as Paid"
                          >
                            <Check size={13} style={{ color: "#34d399" }} />
                          </button>
                        )}

                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px" }}
                          onClick={() => {
                            deleteInvoice(inv.id);
                            showNotice(`Invoice ${inv.id} deleted.`);
                          }}
                          title="Delete Invoice"
                        >
                          <Trash2 size={13} style={{ color: "#fb7185" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create New Invoice</div>
            </div>
            <form onSubmit={handleCreateInvoice}>
              <div className="form-group">
                <label className="form-label">Client / Customer</label>
                <select
                  className="form-select"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Invoice Amount (₹ INR)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 350000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Format Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Universal Invoice Importer</div>
                <div className="card-subtitle">
                  Upload CSV, Excel (.xlsx/.xls), JSON, PDF Invoices, or Text statements
                </div>
              </div>
            </div>

            {/* Supported Format Chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <span className="status-badge" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                <FileSpreadsheet size={13} /> .CSV / .TSV
              </span>
              <span className="status-badge" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                <FileSpreadsheet size={13} /> .XLSX / .XLS (Excel)
              </span>
              <span className="status-badge" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                <FileCode size={13} /> .JSON / GST e-Invoice
              </span>
              <span className="status-badge" style={{ background: "rgba(244,63,94,0.15)", color: "#fb7185" }}>
                <File size={13} /> .PDF (AI OCR Scan)
              </span>
              <span className="status-badge" style={{ background: "rgba(139,92,246,0.15)", color: "#c4b5fd" }}>
                <FileText size={13} /> .TXT / Delimited
              </span>
            </div>

            {!parsedPreview ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "36px 24px",
                  border: "2px dashed rgba(59,130,246,0.4)",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(59,130,246,0.03)",
                  marginBottom: 20,
                  position: "relative",
                }}
              >
                {isProcessingFile ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <Cpu size={36} className="spin-animation" style={{ color: "var(--accent-purple)" }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                      AI OCR Engine Scanning Document...
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Extracting invoice metadata, buyer GSTIN, line totals & due dates
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={38} style={{ color: "var(--accent-blue)", margin: "0 auto 12px" }} />
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                      Drag & Drop Invoice File Here
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6 }}>
                      Supports <strong>.csv, .xlsx, .xls, .json, .pdf, .txt</strong>
                    </div>

                    <input
                      type="file"
                      accept=".csv, .xlsx, .xls, .json, .pdf, .txt, .tsv"
                      onChange={handleFileUpload}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0,
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </>
                )}
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      Detected {parsedPreview.invoices.length} invoice(s) from <strong>{parsedPreview.fileName}</strong> ({parsedPreview.format})
                    </span>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setParsedPreview(null)}
                  >
                    Select Different File
                  </button>
                </div>

                <div className="table-responsive" style={{ maxHeight: 240, overflowY: "auto" }}>
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Extracted ID</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Predicted Delay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedPreview.invoices.map((inv, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>
                            {inv.id}
                          </td>
                          <td>{inv.customer}</td>
                          <td style={{ fontWeight: 700, color: "#60a5fa" }}>
                            {formatLakhs(inv.amount)}
                          </td>
                          <td>{inv.dueDate}</td>
                          <td>+{inv.predictedDelayDays || 3}d</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setParsedPreview(null);
                  setShowUploadModal(false);
                }}
              >
                Close
              </button>
              {parsedPreview && (
                <button
                  type="button"
                  className="btn btn-emerald"
                  onClick={handleConfirmImport}
                >
                  <Sparkles size={15} />
                  <span>Commit {parsedPreview.invoices.length} Invoices to Digital Twin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cash Recovery & WhatsApp/Email Dispatch Modal */}
      {recoveryInvoice && (
        <CashRecoveryModal
          invoice={recoveryInvoice}
          customer={customers.find(
            (c) => c.name === recoveryInvoice.customer || c.id === recoveryInvoice.customerId
          )}
          onClose={() => setRecoveryInvoice(null)}
          onActionComplete={(status) => {
            showNotice(`Cash Recovery Update: ${status} for ${recoveryInvoice.id}`);
          }}
        />
      )}

      {/* Deep-Dive Institutional Risk Underwriting Modal */}
      {selectedDeepDiveInvoice && (
        <DeepDiveRiskModal
          invoice={selectedDeepDiveInvoice === true ? filteredInvoices[0] : selectedDeepDiveInvoice}
          onClose={() => setSelectedDeepDiveInvoice(null)}
          onOpenRecovery={() => {
            const inv = selectedDeepDiveInvoice === true ? filteredInvoices[0] : selectedDeepDiveInvoice;
            setRecoveryInvoice(inv);
            setSelectedDeepDiveInvoice(null);
          }}
        />
      )}
    </div>
  );
}