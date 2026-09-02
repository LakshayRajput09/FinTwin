import React, { useState } from "react";
import {
  X,
  Send,
  Mail,
  Phone,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Copy,
  ExternalLink,
  Sparkles,
  FileText,
  Building2,
  Check,
  Zap,
} from "lucide-react";
import {
  calculateInvoiceRiskAnalysis,
  generateRecoveryTemplates,
} from "../utils/riskRecoveryEngine";
import { updateInvoiceRecovery, updateInvoiceStatus, getBusiness } from "../data/financialStore";

export default function CashRecoveryModal({ invoice, customer, onClose, onActionComplete }) {
  if (!invoice) return null;

  const business = getBusiness();
  const risk = calculateInvoiceRiskAnalysis(invoice, customer, business);
  const templates = generateRecoveryTemplates({ invoice, riskAnalysis: risk, business });

  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || "legal_43b");
  const [recipientPhone, setRecipientPhone] = useState(risk.contactPhone);
  const [recipientEmail, setRecipientEmail] = useState(risk.contactEmail);
  const [copiedType, setCopiedType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("whatsapp"); // "whatsapp" | "email"
  const [recoveryLogStatus, setRecoveryLogStatus] = useState(
    invoice.recoveryStatus || "Notice Dispatched"
  );

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit or international phone number.");
      return;
    }

    updateInvoiceRecovery(invoice.id, {
      recoveryStatus: "Notice Sent via WhatsApp",
      lastChannel: "whatsapp",
      contactPhone: recipientPhone,
      contactEmail: recipientEmail,
      lastTemplateUsed: activeTemplate.name,
    });

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(activeTemplate.whatsappText)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    showToast("🟢 Opened WhatsApp Web! Notice logged in cash recovery ledger.");
    if (onActionComplete) onActionComplete("Notice Sent via WhatsApp");
  };

  const handleSendEmail = () => {
    if (!recipientEmail || !recipientEmail.includes("@")) {
      alert("Please enter a valid recipient email address.");
      return;
    }

    updateInvoiceRecovery(invoice.id, {
      recoveryStatus: "Notice Sent via Email",
      lastChannel: "email",
      contactPhone: recipientPhone,
      contactEmail: recipientEmail,
      lastTemplateUsed: activeTemplate.name,
    });

    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
      activeTemplate.subject
    )}&body=${encodeURIComponent(activeTemplate.emailBody)}`;
    window.location.href = mailtoUrl;

    showToast("🔵 Opened Email Client! Notice logged in cash recovery ledger.");
    if (onActionComplete) onActionComplete("Notice Sent via Email");
  };

  const handleUpdateStatus = (newStatus) => {
    setRecoveryLogStatus(newStatus);
    if (newStatus === "Paid") {
      updateInvoiceStatus(invoice.id, "Paid");
    }
    updateInvoiceRecovery(invoice.id, {
      recoveryStatus: newStatus,
      contactPhone: recipientPhone,
      contactEmail: recipientEmail,
    });
    showToast(`Updated recovery status to: ${newStatus}`);
    if (onActionComplete) onActionComplete(newStatus);
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="modal-card glass-card"
        style={{
          width: "100%",
          maxWidth: 820,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--border-medium)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-emerald)",
              }}
            >
              <Zap size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  MSME Cash Recovery & Dispatch
                </h3>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: risk.riskBg,
                    color: risk.riskBadgeColor,
                    border: `1px solid ${risk.riskBadgeColor}33`,
                  }}
                >
                  {risk.riskTier}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Counterparty: <strong style={{ color: "var(--text-primary)" }}>{invoice.customer}</strong> • Invoice:{" "}
                <strong style={{ color: "var(--accent-blue)" }}>{invoice.id}</strong> • Principal:{" "}
                <strong style={{ color: "var(--text-primary)" }}>₹{Number(invoice.amount || 0).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="copilot-action-btn"
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 6,
              borderRadius: 8,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              borderBottom: "1px solid rgba(16, 185, 129, 0.3)",
              color: "var(--accent-emerald)",
              padding: "10px 24px",
              fontSize: 12.5,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* 1. Risk Analysis Attribute Card */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            {/* Risk Index */}
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Risk Analysis Score
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: risk.riskBadgeColor }}>
                  {risk.riskScoreIndex}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>/ 100</span>
              </div>
              <div style={{ fontSize: 11, color: risk.riskBadgeColor, fontWeight: 600, marginTop: 2 }}>
                {risk.recoveryPriority}
              </div>
            </div>

            {/* Default Probability */}
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Default Probability
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: risk.defaultProbability > 50 ? "var(--accent-rose)" : "var(--accent-amber)", marginTop: 4 }}>
                {risk.defaultProbability}%
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                {risk.daysOverdue > 0 ? `+${risk.daysOverdue} days overdue` : `Est delay: +${risk.effectiveDelay}d`}
              </div>
            </div>

            {/* Section 43B(h) Status */}
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Section 43B(h) Audit Risk
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: risk.section43bSeverity === "critical" ? "var(--accent-rose)" : risk.section43bSeverity === "warning" ? "var(--accent-amber)" : "var(--accent-emerald)",
                  marginTop: 6,
                }}
              >
                {risk.section43bStatus}
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.3 }}>
                {risk.section43bMessage}
              </div>
            </div>

            {/* Accrued Penal Interest */}
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Accrued 3x RBI Penal Interest
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-purple)", marginTop: 4 }}>
                ₹{risk.accruedPenalInterest.toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                Mandatory under Sec 16 MSMED
              </div>
            </div>
          </div>

          {/* 2. Recipient Contact Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Phone size={13} style={{ color: "#22c55e" }} />
                <span>Seller / Buyer WhatsApp Phone</span>
              </label>
              <input
                type="text"
                className="form-input"
                style={{ height: 38, fontSize: 13, background: "var(--bg-secondary)" }}
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+91 98201 44521"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Mail size={13} style={{ color: "#38bdf8" }} />
                <span>Finance / Accounts Payable Email</span>
              </label>
              <input
                type="email"
                className="form-input"
                style={{ height: 38, fontSize: 13, background: "var(--bg-secondary)" }}
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="accounts@buyer.com"
              />
            </div>
          </div>

          {/* 3. Notice Template Selector */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>
              Select Demand Notice Template:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {templates.map((tmpl) => {
                const isSelected = tmpl.id === selectedTemplateId;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: isSelected ? `2px solid var(--accent-blue)` : "1px solid var(--border-medium)",
                      background: isSelected ? "rgba(59, 130, 246, 0.1)" : "var(--bg-secondary)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: isSelected ? "var(--accent-blue)" : "var(--text-primary)" }}>
                        {tmpl.name}
                      </span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 8,
                          background: `${tmpl.tagColor}22`,
                          color: tmpl.tagColor,
                        }}
                      >
                        {tmpl.tag}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {tmpl.id === "legal_43b"
                        ? "Invokes MSMED Act & tax disallowance"
                        : tmpl.id === "executive_urgent"
                        ? "Quick UPI & immediate bank clearing"
                        : "Courteous upcoming payment confirmation"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Preview & Dispatch Channels (Tabs: WhatsApp vs Email) */}
          <div
            style={{
              borderRadius: 12,
              border: "1px solid var(--border-subtle)",
              background: "var(--bg-secondary)",
              overflow: "hidden",
            }}
          >
            {/* Channel Tabs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 16px",
                borderBottom: "1px solid var(--border-subtle)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("whatsapp")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: activeTab === "whatsapp" ? "#22c55e" : "transparent",
                    color: activeTab === "whatsapp" ? "#fff" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>WhatsApp Template</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("email")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: activeTab === "email" ? "var(--accent-blue)" : "transparent",
                    color: activeTab === "email" ? "#fff" : "var(--text-secondary)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>Email Template</span>
                </button>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11, padding: "3px 10px" }}
                onClick={() =>
                  handleCopyText(
                    activeTab === "whatsapp" ? activeTemplate.whatsappText : activeTemplate.emailBody,
                    activeTab === "whatsapp" ? "WhatsApp Message" : "Email Body"
                  )
                }
              >
                {copiedType ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedType ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>

            {/* Rendered Text Preview */}
            <div style={{ padding: "16px 20px" }}>
              {activeTab === "email" && (
                <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px dashed var(--border-subtle)" }}>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>Subject: </span>
                  <span style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 700 }}>
                    {activeTemplate.subject}
                  </span>
                </div>
              )}
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  maxHeight: 180,
                  overflowY: "auto",
                }}
              >
                {activeTab === "whatsapp" ? activeTemplate.whatsappText : activeTemplate.emailBody}
              </pre>
            </div>

            {/* Fast Dispatch Action Footer */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid var(--border-subtle)",
                background: "rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>
                  Mark Recovery Status:
                </span>
                <select
                  value={recoveryLogStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className="form-select"
                  style={{
                    height: 30,
                    fontSize: 11.5,
                    padding: "2px 10px",
                    borderRadius: 6,
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="Notice Dispatched">Notice Dispatched</option>
                  <option value="Notice Sent via WhatsApp">Notice Sent via WhatsApp</option>
                  <option value="Notice Sent via Email">Notice Sent via Email</option>
                  <option value="Payment Promised">Payment Promised (Next 7 Days)</option>
                  <option value="Escalated to MSME Samadhaan">Escalated to MSME Samadhaan</option>
                  <option value="Disputed by Buyer">Disputed by Buyer</option>
                  <option value="Paid">Settled / Paid in Full</option>
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {activeTab === "whatsapp" ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      border: "none",
                      height: 36,
                      padding: "0 18px",
                      fontSize: 12.5,
                      fontWeight: 700,
                      gap: 8,
                    }}
                    onClick={handleSendWhatsApp}
                  >
                    <Send size={14} />
                    <span>Send Message on WhatsApp</span>
                    <ExternalLink size={12} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      border: "none",
                      height: 36,
                      padding: "0 18px",
                      fontSize: 12.5,
                      fontWeight: 700,
                      gap: 8,
                    }}
                    onClick={handleSendEmail}
                  >
                    <Mail size={14} />
                    <span>Open in Email Client</span>
                    <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
