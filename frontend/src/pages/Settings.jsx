import React, { useState, useEffect } from "react";
import {
  Building,
  ShieldCheck,
  CheckCircle2,
  Database,
  Save,
  Trash2,
  Globe,
  Languages,
  Check,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import {
  getBusiness,
  updateBusinessProfile,
  clearAllData,
  subscribeFinancialData,
} from "../data/financialStore";
import { INDUSTRY_SECTORS } from "../data/sampleData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Settings() {
  const { user } = useAuth();
  const { currentLang, changeLanguage, t, supportedLanguages, activeLanguageMeta } =
    useLanguage();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
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

  const handleLanguageSelect = (langId, langName) => {
    changeLanguage(langId);
    setNotification(`Language switched to ${langName}!`);
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
            background: "#1F5A4A",
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

      {/* =================================================================
          1. REGIONAL LANGUAGE & LOCALIZATION SETTINGS (NEW)
          ================================================================= */}
      <div className="glass-card" style={{ border: "1px solid rgba(139, 92, 246, 0.35)", background: "var(--bg-tertiary)" }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon-wrap purple">
              <Globe size={18} />
            </div>
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>{t("languageOption", "Regional Language & Localization")}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(139, 92, 246, 0.2)",
                    color: "#c4b5fd",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                  }}
                >
                  {supportedLanguages.length} Regional Languages
                </span>
              </div>
              <div className="card-subtitle">
                {t("languageSub", "Choose your preferred Indian regional language for financial dashboards & reports")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {t("currentLanguage", "Active")}:
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{activeLanguageMeta.flag}</span>
              <span>{activeLanguageMeta.name} ({activeLanguageMeta.englishName})</span>
            </span>
          </div>
        </div>

        {/* Regional Language Dropdown Selector */}
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {/* Custom Interactive Dropdown Menu */}
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                {t("selectLanguage", "Choose Regional Language (Interactive Dropdown)")}:
              </label>
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-card)",
                  border: showLangDropdown ? "1px solid var(--accent-purple)" : "1px solid var(--border-medium)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: "var(--shadow-sm)",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{activeLanguageMeta.flag}</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: 14 }}>
                      {activeLanguageMeta.name} <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>({activeLanguageMeta.englishName})</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--accent-purple)", fontWeight: 600 }}>
                      {activeLanguageMeta.region}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    color: "var(--text-muted)",
                    transform: showLangDropdown ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>

              {/* Dropdown Options Menu */}
              {showLangDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    marginTop: 6,
                    maxHeight: 340,
                    overflowY: "auto",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 200,
                    padding: 6,
                  }}
                >
                  <div style={{ padding: "4px 8px 8px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Available Indian Regional Languages ({supportedLanguages.length})
                  </div>
                  {supportedLanguages.map((lang) => {
                    const isSelected = currentLang === lang.id;
                    return (
                      <div
                        key={lang.id}
                        onClick={() => {
                          handleLanguageSelect(lang.id, lang.name);
                          setShowLangDropdown(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          background: isSelected ? "var(--bg-secondary)" : "transparent",
                          border: isSelected ? "1px solid var(--accent-purple)" : "1px solid transparent",
                          marginBottom: 4,
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = "var(--bg-secondary)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 20 }}>{lang.flag}</span>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-primary)" }}>
                              {lang.name} <span style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-muted)" }}>({lang.englishName})</span>
                            </div>
                            <div style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>
                              {lang.region} • {lang.sub}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div style={{ color: "var(--accent-purple)", display: "flex", alignItems: "center" }}>
                            <Check size={16} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Native Select (for standard form inputs & fast accessibility) */}
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                {t("quickSelectLanguage", "Quick Native Select Dropdown")}:
              </label>
              <select
                value={currentLang}
                onChange={(e) => {
                  const selectedObj = supportedLanguages.find((l) => l.id === e.target.value);
                  handleLanguageSelect(e.target.value, selectedObj?.name || e.target.value);
                }}
                className="form-select"
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  fontSize: 13.5,
                  fontWeight: 600,
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-medium)",
                  cursor: "pointer",
                }}
              >
                {supportedLanguages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.flag} {l.name} ({l.englishName}) — {l.region}
                  </option>
                ))}
              </select>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                Select instantly from standard system dropdown list.
              </span>
            </div>
          </div>

          {/* Active Language Telemetry Details Card */}
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{activeLanguageMeta.flag}</span>
              <div>
                <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                  Active Language: {activeLanguageMeta.name} ({activeLanguageMeta.englishName})
                </strong>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  Regional Jurisdiction: {activeLanguageMeta.region} — {activeLanguageMeta.sub}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle2 size={14} />
                <span>Live Translation Sync Active</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          2. COMPANY PROFILE & FINANCIAL PARAMETERS
          ================================================================= */}
      <div className="grid-12">
        <div className="col-span-8 glass-card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon-wrap emerald">
                <Building size={18} />
              </div>
              <div>
                <div className="card-title">{t("companyProfile", "Company Profile & Financial Targets")}</div>
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
                <span>{t("saveChanges", "Save Business Parameters")}</span>
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
            <div style={{ padding: 14, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)", marginBottom: 4 }}>
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
                <span>{t("resetData", "Clear All Data")}</span>
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