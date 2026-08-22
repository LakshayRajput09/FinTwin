import React, { useState, useEffect } from "react";
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Percent,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  FileText,
  IndianRupee,
  Lock,
} from "lucide-react";

import {
  getFinancialData,
  getInvoices,
  updateInvoiceStatus,
  subscribeFinancialData,
} from "../data/financialStore";
import {
  calculateReceivables,
  getCashFlowSummary,
} from "../engines/digitalTwin";

const financingPartners = [
  {
    name: "TReDS Invoice Discounting (RXIL/M1x)",
    type: "Factoring",
    rate: "8.5% - 11.0% p.a.",
    turnaround: "24-48 Hours",
    collateral: "Zero Collateral (Invoice-backed)",
    bestFor: "Enterprise & Tier-1 Supplier Invoices",
  },
  {
    name: "MSME Working Capital Line (SIDBI / Banks)",
    type: "Overdraft",
    rate: "9.25% - 12.5% p.a.",
    turnaround: "3-5 Days",
    collateral: "CGTMSE Covered (No hard pledge)",
    bestFor: "Inventory & Recurring Payroll Gaps",
  },
  {
    name: "Revenue-Based Growth Line (Fintech Partners)",
    type: "Revolving Credit",
    rate: "1.2% - 1.6% / month",
    turnaround: "Instant (12 Hours)",
    collateral: "100% Digital / Zero Hard Assets",
    bestFor: "Emergency Capex & Sudden Orders",
  },
];

export default function Financing() {
  const [invoices, setInvoices] = useState(getInvoices());
  const [summary, setSummary] = useState(getCashFlowSummary());
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [notification, setNotification] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(financingPartners[0]);

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setInvoices(getInvoices());
      setSummary(getCashFlowSummary());
    });
    return unsub;
  }, []);

  const eligibleInvoices = invoices.filter((i) => i.status === "Pending");
  const formatLakhs = (amt) => `₹${(Number(amt || 0) / 100000).toFixed(2)}L`;

  const toggleSelectInvoice = (id) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((i) => i !== id));
    } else {
      setSelectedInvoices([...selectedInvoices, id]);
    }
  };

  const selectedTotal = eligibleInvoices
    .filter((i) => selectedInvoices.includes(i.id))
    .reduce((s, i) => s + Number(i.amount || 0), 0);

  const netDisbursement = Math.round(selectedTotal * 0.985); // 1.5% fee / discount
  const discountFee = selectedTotal - netDisbursement;

  const handleExecuteDiscounting = () => {
    selectedInvoices.forEach((invId) => {
      updateInvoiceStatus(invId, "Paid");
    });
    setSelectedInvoices([]);
    setShowApplyModal(false);
    setNotification(
      `Discounting executed! ₹${(netDisbursement / 100000).toFixed(2)}L credited to your bank account.`
    );
    setTimeout(() => setNotification(""), 4000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Toast Notice */}
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

      {/* Working Capital Gap Summary */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Unlockable Receivables</span>
            <div className="card-icon-wrap emerald">
              <Landmark size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#34d399" }}>
              {formatLakhs(summary.receivables)}
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>{eligibleInvoices.length} Eligible Invoices for TReDS</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Estimated Liquidity Gap</span>
            <div className="card-icon-wrap amber">
              <Zap size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#fbbf24" }}>
              {summary.projectedCash < 0 ? formatLakhs(Math.abs(summary.projectedCash)) : "₹0.00L"}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>{summary.projectedCash < 0 ? "Deficit to bridge" : "Surplus Buffer"}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Pre-Approved Credit Limit</span>
            <div className="card-icon-wrap purple">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#c4b5fd" }}>
              ₹15.00L
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>CGTMSE Collateral-Free Tier</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Disbursement Speed</span>
            <div className="card-icon-wrap">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "#60a5fa" }}>
              24-48 Hrs
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Direct Bank RTGS / Escrow</span>
          </div>
        </div>
      </div>

      {/* Invoice Discounting Selector */}
      <div className="grid-12">
        {/* Invoices Selection List */}
        <div className="col-span-7 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap emerald">
                <FileText size={18} />
              </div>
              <div>
                <div className="card-title">Select Invoices to Discount</div>
                <div className="card-subtitle">
                  Choose pending customer invoices to unlock immediate cash
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {eligibleInvoices.map((inv) => {
              const isSelected = selectedInvoices.includes(inv.id);
              return (
                <div
                  key={inv.id}
                  onClick={() => toggleSelectInvoice(inv.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderRadius: "var(--radius-md)",
                    background: isSelected ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "rgba(59,130,246,0.4)" : "var(--border-subtle)"}`,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      style={{ width: 17, height: 17, accentColor: "var(--accent-blue)" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: "#fff" }}>
                        {inv.id} — {inv.customer}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 2 }}>
                        Due: {inv.dueDate} • Delay Risk: +{inv.predictedDelayDays || 3}d
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#60a5fa" }}>
                      {formatLakhs(inv.amount)}
                    </div>
                    <span
                      style={{
                        fontSize: 10.5,
                        color: "#34d399",
                        fontWeight: 600,
                      }}
                    >
                      Eligible 98.5%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instant Settlement Breakdown */}
        <div className="col-span-5 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap purple">
                <Percent size={18} />
              </div>
              <div>
                <div className="card-title">Financing Settlement Estimate</div>
                <div className="card-subtitle">Net cash realization</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--text-secondary)" }}>Selected Invoices ({selectedInvoices.length})</span>
              <span style={{ fontWeight: 700, color: "#fff" }}>{formatLakhs(selectedTotal)}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "var(--text-secondary)" }}>Discounting Cost (1.5% fee)</span>
              <span style={{ color: "#fb7185", fontWeight: 600 }}>- {formatLakhs(discountFee)}</span>
            </div>

            <div style={{ height: 1, background: "var(--border-subtle)", margin: "4px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800 }}>
              <span style={{ color: "#fff" }}>Net Liquid Credit to Bank</span>
              <span style={{ color: "#34d399", fontSize: 20 }}>{formatLakhs(netDisbursement)}</span>
            </div>

            <div
              style={{
                padding: 12,
                borderRadius: "var(--radius-md)",
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.25)",
                fontSize: 12,
                lineHeight: 1.5,
                color: "var(--text-secondary)",
              }}
            >
              <strong style={{ color: "#34d399" }}>Immediate Impact: </strong>
              Unlocking this liquidity eliminates all collection waiting periods and extends your cash runway by{" "}
              <strong>+{Math.round((netDisbursement / (summary.totalExpenses / 30)))} days</strong>.
            </div>

            <button
              className="btn btn-emerald btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
              disabled={selectedInvoices.length === 0}
              onClick={() => setShowApplyModal(true)}
            >
              <Sparkles size={16} />
              <span>Apply for Instant Settlement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financing Partners Matrix */}
      <div className="glass-card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-wrap">
              <Landmark size={18} />
            </div>
            <div>
              <div className="card-title">Verified MSME Financing Programs</div>
              <div className="card-subtitle">Direct institutional liquidity channels</div>
            </div>
          </div>
        </div>

        <div className="grid-3" style={{ gap: 20 }}>
          {financingPartners.map((partner, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{ padding: 20, background: "rgba(255,255,255,0.02)" }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 6 }}>
                {partner.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 14 }}>
                {partner.bestFor}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Interest / Discount:</span>
                  <span style={{ fontWeight: 600, color: "#60a5fa" }}>{partner.rate}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Disbursement:</span>
                  <span style={{ fontWeight: 600, color: "#34d399" }}>{partner.turnaround}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Security:</span>
                  <span style={{ color: "var(--text-primary)" }}>{partner.collateral}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="modal-backdrop" onClick={() => setShowApplyModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Confirm Invoice Factoring Application</div>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
              You are discounting <strong>{selectedInvoices.length} invoices</strong> worth{" "}
              <strong>{formatLakhs(selectedTotal)}</strong>.
              <div
                style={{
                  marginTop: 14,
                  padding: 14,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.3)",
                }}
              >
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Estimated Net Payout</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#34d399", marginTop: 4 }}>
                  {formatLakhs(netDisbursement)}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-secondary)", marginTop: 2 }}>
                  Will be credited to your verified MSME Current Account via TReDS gateway.
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowApplyModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-emerald"
                onClick={handleExecuteDiscounting}
              >
                Confirm & Disburse Funds
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}