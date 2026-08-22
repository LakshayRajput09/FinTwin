import React, { useState, useEffect } from "react";
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Database,
  Save,
  Trash2,
} from "lucide-react";

import {
  getBusiness,
  updateBusinessProfile,
  clearAllData,
  subscribeFinancialData,
} from "../data/financialStore";
import { INDUSTRY_SECTORS } from "../data/sampleData";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [business, setBusiness] = useState(getBusiness());
  const [name, setName] = useState(business.name || user?.company || "My Enterprise");
  const [industry, setIndustry] = useState(business.industry || "Manufacturing & Trade");
  const [gstin, setGstin] = useState(business.gstin || user?.gstin || "");
  const [currency, setCurrency] = useState(business.currency || "INR");
  const [openingCash, setOpeningCash] = useState(business.openingCash || 0);
  const [minCashReserve, setMinCashReserve] = useState(business.minCashReserve || 0);
  const [targetRunwayDays, setTargetRunwayDays] = useState(business.targetRunwayDays || 60);

  const [notification, setNotification] = useState("");

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      const b = getBusiness();
      setBusiness(b);
      setName(b.name || user?.company || "My Enterprise");
      setIndustry(b.industry || "Manufacturing & Trade");
      setGstin(b.gstin || user?.gstin || "");
      setOpeningCash(b.openingCash || 0);
      setMinCashReserve(b.minCashReserve || 0);
      setTargetRunwayDays(b.targetRunwayDays || 60);
    });
    return unsub;
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateBusinessProfile({
      name,
      industry,
      gstin,
      currency,
      openingCash: Number(openingCash),
      minCashReserve: Number(minCashReserve),
      targetRunwayDays: Number(targetRunwayDays),
    });

    setNotification("Business parameters saved and synchronized with Database!");
    setTimeout(() => setNotification(""), 3500);
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your financial records and start fresh?")) {
      clearAllData();
      setNotification("All financial records cleared. Ready for your live data!");
      setTimeout(() => setNotification(""), 3500);
    }
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

      {/* Main Settings Form */}
      <div className="grid-12">
        <div className="col-span-8 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap emerald">
                <Building size={18} />
              </div>
              <div>
                <div className="card-title">Company Profile & Financial Targets</div>
                <div className="card-subtitle">
                  Configure digital twin baseline parameters
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Legal Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Precision Technologies"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry Sector</label>
                <select
                  className="form-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  {INDUSTRY_SECTORS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">GSTIN (GST Identification Number)</label>
                <input
                  type="text"
                  className="form-input"
                  value={gstin}
                  placeholder="e.g. 27AABCA1234F1Z8"
                  onChange={(e) => setGstin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Base Currency</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">INR (₹ - Indian Rupee)</option>
                  <option value="USD">USD ($ - US Dollar)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                </select>
              </div>
            </div>

            <div className="grid-3" style={{ marginTop: 12 }}>
              <div className="form-group">
                <label className="form-label">Opening Cash Balance (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={openingCash}
                  placeholder="0"
                  onChange={(e) => setOpeningCash(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min. Safety Reserve Target (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={minCashReserve}
                  placeholder="0"
                  onChange={(e) => setMinCashReserve(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Runway (Days)</label>
                <input
                  type="number"
                  className="form-input"
                  value={targetRunwayDays}
                  placeholder="60"
                  onChange={(e) => setTargetRunwayDays(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 14 }}>
              <button type="submit" className="btn btn-primary">
                <Save size={15} />
                <span>Save Business Parameters</span>
              </button>
            </div>
          </form>
        </div>

        {/* Data Administration & State Management */}
        <div className="col-span-4 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap rose">
                <Database size={18} />
              </div>
              <div>
                <div className="card-title">Data Administration</div>
                <div className="card-subtitle">Manage stored invoices & ledger</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: 14, borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#fff", marginBottom: 4 }}>
                Purge Account Data
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.5 }}>
                Clear all your uploaded invoices, expenses, and customer records to start completely fresh.
              </div>
              <button
                className="btn btn-danger btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleClearData}
              >
                <Trash2 size={14} />
                <span>Clear All Data</span>
              </button>
            </div>

            <div style={{ padding: 14, borderRadius: "var(--radius-md)", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#34d399", marginBottom: 4 }}>
                Account Security & Storage
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Your data is encrypted and synced with the persistent database. When you log out, your session is saved securely.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}