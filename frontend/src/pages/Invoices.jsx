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

export default function Invoices() {
  const [invoices, setInvoices] = useState(getInvoices());
  const [customers, setCustomers] = useState(getCustomers());
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
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
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + Number(i.amount || 0), 0);

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

      {/* Filter, Search & Actions Bar */}
      <div className="glass-card" style={{ padding: "18px 24px" }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          {/* Tabs */}
          <div className="tabs-container">
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
              className={`tab-btn ${activeTab === "paid" ? "active" : ""}`}
              onClick={() => setActiveTab("paid")}
            >
              Paid ({invoices.filter((i) => i.status === "Paid").length})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: "relative", minWidth: 260 }}>
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
              style={{ paddingLeft: 34, height: 38, fontSize: 13 }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                <th>Amount</th>
                <th>Due Date</th>
                <th>AI Delay Prediction</th>
                <th>Risk Profile</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>
                    {inv.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#f8fafc" }}>{inv.customer}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Issued: {inv.invoiceDate || "2026-08-01"}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: "#60a5fa", fontSize: 14 }}>
                    {formatLakhs(inv.amount)}
                  </td>
                  <td>{inv.dueDate}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Sparkles size={13} style={{ color: "#a78bfa" }} />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color:
                            inv.predictedDelayDays > 15
                              ? "#fb7185"
                              : inv.predictedDelayDays > 5
                              ? "#fbbf24"
                              : "#34d399",
                        }}
                      >
                        +{inv.predictedDelayDays || 4} Days Delay
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background:
                          inv.riskScore === "High"
                            ? "rgba(244,63,94,0.15)"
                            : inv.riskScore === "Low"
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(245,158,11,0.15)",
                        color:
                          inv.riskScore === "High"
                            ? "#fb7185"
                            : inv.riskScore === "Low"
                            ? "#34d399"
                            : "#fbbf24",
                      }}
                    >
                      {inv.riskScore || "Medium"} Risk
                    </span>
                  </td>
                  <td>
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
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
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
              ))}
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
                    <Cpu size={36} className="spin-animation" style={{ color: "#a78bfa" }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                      AI OCR Engine Scanning Document...
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Extracting invoice metadata, buyer GSTIN, line totals & due dates
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={38} style={{ color: "var(--accent-blue)", margin: "0 auto 12px" }} />
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
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
                    <CheckCircle2 size={16} style={{ color: "#34d399" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
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
                          <td style={{ fontWeight: 600, color: "#fff", fontFamily: "var(--font-mono)" }}>
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
    </div>
  );
}