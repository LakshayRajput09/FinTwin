import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  FileText,
  Users,
  CreditCard,
  TrendingUp,
  FlaskConical,
  Landmark,
  ArrowRight,
} from "lucide-react";

import { getInvoices, getCustomers, getExpenses } from "../data/financialStore";

export default function CommandSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle search modal
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const invoices = getInvoices();
  const customers = getCustomers();
  const expenses = getExpenses();

  const q = query.toLowerCase().trim();

  const matchedInvoices = q
    ? invoices.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.customer.toLowerCase().includes(q) ||
          i.status.toLowerCase().includes(q)
      )
    : [];

  const matchedCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
      )
    : [];

  const quickPages = [
    { title: "Cash Flow Digital Twin", path: "/cash-flow", icon: TrendingUp },
    { title: "What-If Shock Simulator", path: "/simulator", icon: FlaskConical },
    { title: "Invoices & Receivables", path: "/invoices", icon: FileText },
    { title: "MSME Financing Options", path: "/financing", icon: Landmark },
    { title: "Expense Management", path: "/expenses", icon: CreditCard },
  ].filter((p) => !q || p.title.toLowerCase().includes(q));

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 580, padding: 0, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <Search size={18} style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search invoices, clients, scenarios, or modules..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: 15,
            }}
          />
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ maxHeight: 360, overflowY: "auto", padding: "12px 16px" }}>
          {matchedInvoices.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>
                Invoices
              </div>
              {matchedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => handleSelect("/invoices")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <FileText size={15} style={{ color: "#60a5fa" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.id} — {inv.customer}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>₹{(inv.amount / 100000).toFixed(2)}L • {inv.status}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: "var(--text-dim)" }} />
                </div>
              ))}
            </div>
          )}

          {matchedCustomers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>
                Customers
              </div>
              {matchedCustomers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => handleSelect("/customers")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Users size={15} style={{ color: "#34d399" }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{cust.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{cust.industry} • {cust.creditScore}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: "var(--text-dim)" }} />
                </div>
              ))}
            </div>
          )}

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text-dim)", marginBottom: 6 }}>
              Navigation & Modules
            </div>
            {quickPages.map((page) => {
              const Icon = page.icon;
              return (
                <div
                  key={page.path}
                  onClick={() => handleSelect(page.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={15} style={{ color: "#a78bfa" }} />
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{page.title}</div>
                  </div>
                  <ArrowRight size={14} style={{ color: "var(--text-dim)" }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
