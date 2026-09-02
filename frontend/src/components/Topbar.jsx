import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Sparkles,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CreditCard,
  X,
  ArrowRight,
  TrendingDown,
  User,
  LogOut,
  UserCheck,
  ChevronDown,
  Menu,
  Palette,
  Play,
  Pause,
  Activity,
  Check,
  Globe,
  Zap,
} from "lucide-react";

import { getInvoices, subscribeFinancialData } from "../data/financialStore";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme, THEMES } from "../context/ThemeContext";

const titles = {
  "/dashboard": { title: "Executive Dashboard", sub: "Real-time liquidity, receivables & cash runway telemetry" },
  "/cash-flow": { title: "Cash Flow Digital Twin", sub: "Visual cash waterfall, historical velocity & runway projection" },
  "/invoices": { title: "Invoices & Collections", sub: "Receivables tracker, multi-format importer (CSV/Excel/PDF/JSON) & AI delay radar" },
  "/expenses": { title: "Expenses & Monthly Burn", sub: "Recurring liabilities, categorized burn rate & cost optimization" },
  "/customers": { title: "Customer Intelligence & Risk", sub: "Credit risk scoring, payment delay tracking & concentration" },
  "/forecast": { title: "AI 90-Day Cash Forecast", sub: "Probabilistic runway simulation with confidence intervals" },
  "/simulator": { title: "What-If Shock Simulator", sub: "Interactive scenario stress-testing for MSME liquidity" },
  "/financing": { title: "MSME Financing Marketplace", sub: "Working capital gap solutions, bank loans & government schemes" },
  "/gst": { title: "GST Intelligence & Tax Calculator", sub: "Overall GST reconciliation (GSTR-1/2B/3B), transaction calculator & GSTIN lookup" },
  "/payroll": { title: "Workers & Salary Payroll Hub", sub: "Employee directory, 1-click salary disbursements, and payroll burn ledger" },
  "/reports": { title: "Financial Reports & P&L", sub: "Exportable statements, monthly burn & liquidity reconciliation" },
  "/integrations": { title: "Accounting Integrations", sub: "Seamless sync with Tally Prime, Zoho Books, GSTN & Banks" },
  "/settings": { title: "Business Settings & Profiles", sub: "Company parameters, GSTIN setup, targets & scenario presets" },
};

export default function Topbar({ onOpenAiCopilot, onOpenQuickAction, onOpenSearch, onToggleMobileMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, currentLang, changeLanguage, supportedLanguages, activeLanguageMeta } = useLanguage();
  const { theme, setTheme, currentTheme, allThemes } = useTheme();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLiveTicking, setIsLiveTicking] = useState(true);
  const [secondsTick, setSecondsTick] = useState(15);
  const [invoices, setInvoices] = useState(getInvoices());

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setInvoices(getInvoices());
    });
    return unsub;
  }, []);

  // Live simulation ticker countdown
  useEffect(() => {
    if (!isLiveTicking) return;
    const interval = setInterval(() => {
      setSecondsTick((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveTicking]);

  const currentInfo = titles[location.pathname] || {
    title: "NexFin MSME Platform",
    sub: "AI Financial Intelligence & Digital Twin",
  };

  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
  const highRiskCount = invoices.filter((i) => i.riskScore === "High" && i.status !== "Paid").length;

  return (
    <header className="app-topbar">
      {/* Page Title & Subtitle */}
      <div className="topbar-left">
        <button
          className="mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          title="Open Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="topbar-page-info">
          <h1 className="topbar-page-title">{t(currentInfo.title, currentInfo.title)}</h1>
          <span className="topbar-page-subtitle">{t(currentInfo.sub, currentInfo.sub)}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="topbar-right">
        {/* Live Simulation Ticker Pill */}
        <button
          onClick={() => setIsLiveTicking(!isLiveTicking)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 10px",
            borderRadius: 20,
            background: isLiveTicking ? "rgba(16,185,129,0.12)" : "var(--bg-secondary)",
            border: isLiveTicking ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border-subtle)",
            fontSize: 11,
            fontWeight: 700,
            color: isLiveTicking ? "var(--accent-emerald)" : "var(--text-muted)",
            cursor: "pointer",
          }}
          title={isLiveTicking ? "Telemetry Live (Updating every 15s) - Click to pause" : "Telemetry Paused - Click to resume"}
        >
          {isLiveTicking ? (
            <>
              <span className="twin-radar-pulse" style={{ width: 6, height: 6 }} />
              <span>Live: {secondsTick}s</span>
            </>
          ) : (
            <>
              <Pause size={11} />
              <span>Paused</span>
            </>
          )}
        </button>

        {/* Quick Cash Recovery Button on Topbar */}
        <button
          onClick={() => navigate("/invoices")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))",
            border: "1px solid rgba(34, 197, 94, 0.4)",
            fontSize: 12,
            fontWeight: 800,
            color: "#22c55e",
            cursor: "pointer",
          }}
          title="Open MSME Cash Recovery Hub (1-Click WhatsApp & Email Notices)"
        >
          <Zap size={13} style={{ color: "#22c55e" }} />
          <span>⚡ Cash Recovery</span>
          {overdueCount > 0 && (
            <span
              style={{
                fontSize: 10,
                padding: "1px 6px",
                borderRadius: 10,
                background: "var(--accent-rose)",
                color: "#fff",
                fontWeight: 900,
              }}
            >
              {overdueCount}
            </span>
          )}
        </button>

        {/* Dynamic Theme Switcher Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            className="topbar-btn"
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            title="Switch Dynamic Website Theme (Shortcut: Alt + T)"
            style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: "var(--radius-full)", background: "var(--bg-secondary)", border: "1px solid var(--border-medium)" }}
          >
            <span>{currentTheme.emoji}</span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: currentTheme.primaryAccent,
                boxShadow: `0 0 6px ${currentTheme.primaryAccent}`,
              }}
            />
            <span className="desktop-only" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
              {currentTheme.name.split(" ")[0]}
            </span>
            <ChevronDown size={12} style={{ opacity: 0.6 }} />
          </button>

          {showThemeDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                width: 230,
                background: "var(--bg-card)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 250,
                padding: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 8px" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)" }}>
                  Select Dynamic Theme
                </span>
                <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 4, background: "var(--bg-secondary)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Alt+T
                </span>
              </div>
              {Object.values(allThemes).map((tItem) => (
                <div
                  key={tItem.id}
                  onClick={() => {
                    setTheme(tItem.id);
                    setShowThemeDropdown(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 10px",
                    borderRadius: 6,
                    cursor: "pointer",
                    background: theme === tItem.id ? "var(--bg-secondary)" : "transparent",
                    fontSize: 12.5,
                    fontWeight: 600,
                    marginBottom: 2,
                    border: theme === tItem.id ? `1px solid ${tItem.primaryAccent}40` : "1px solid transparent",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{tItem.emoji}</span>
                    <div>
                      <div style={{ color: "var(--text-primary)", fontWeight: 700 }}>{tItem.name}</div>
                      <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 400 }}>{tItem.description}</div>
                    </div>
                  </div>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: tItem.primaryAccent,
                      flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regional Language Switcher Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            className="topbar-btn"
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowThemeDropdown(false);
            }}
            title="Switch Regional Language / भाषा बदलें"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 11px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-medium)",
              cursor: "pointer",
            }}
          >
            <Globe size={13} style={{ color: "var(--accent-purple)" }} />
            <span style={{ fontSize: 13 }}>{activeLanguageMeta.flag}</span>
            <span className="desktop-only" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
              {activeLanguageMeta.name}
            </span>
            <ChevronDown size={11} style={{ opacity: 0.6 }} />
          </button>

          {showLangDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 8,
                width: 250,
                maxHeight: 360,
                overflowY: "auto",
                background: "var(--bg-card)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 250,
                padding: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 8px" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text-muted)" }}>
                  Select Language / भाषा
                </span>
                <span style={{ fontSize: 9.5, padding: "1px 5px", borderRadius: 4, background: "var(--bg-secondary)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {supportedLanguages.length}
                </span>
              </div>
              {supportedLanguages.map((l) => {
                const isSelected = currentLang === l.id;
                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      changeLanguage(l.id);
                      setShowLangDropdown(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      background: isSelected ? "var(--bg-secondary)" : "transparent",
                      border: isSelected ? "1px solid rgba(139, 92, 246, 0.4)" : "1px solid transparent",
                      fontSize: 12.5,
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{l.flag}</span>
                      <div>
                        <div style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                          {l.name} <span style={{ fontSize: 11, fontWeight: 400, color: "var(--text-muted)" }}>({l.englishName})</span>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{l.region}</div>
                      </div>
                    </div>
                    {isSelected && <Check size={14} style={{ color: "var(--accent-purple)" }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Search button */}
        <button className="topbar-search-btn" onClick={onOpenSearch}>
          <Search size={15} />
          <span>{t("quickSearch", "Quick search...")}</span>
          <kbd className="search-kbd">⌘K</kbd>
        </button>

        {/* Ask AI Copilot button */}
        <button
          className="topbar-ai-btn"
          onClick={onOpenAiCopilot}
          title="Ask NexFin AI Financial Copilot (⌘J)"
        >
          <Sparkles size={14} style={{ color: "var(--accent-purple)" }} />
          <span>Ask AI</span>
          <kbd className="ai-kbd">⌘J</kbd>
        </button>

        {/* Quick Add Button */}
        <button
          className="topbar-btn primary-action"
          onClick={onOpenQuickAction}
          title="Create Invoice or Expense"
        >
          <Plus size={15} />
          <span>{t("quickAdd", "Quick Add")}</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            className="topbar-btn icon-only"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications & Alerts"
          >
            <Bell size={17} />
            {(overdueCount > 0 || highRiskCount > 0) && <div className="topbar-badge-dot" />}
          </button>

          {/* Notifications Drawer */}
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 10,
                width: "min(340px, calc(100vw - 32px))",
                background: "var(--bg-card-solid)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 200,
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>
                  Alerts & Notifications
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ color: "var(--text-muted)", fontSize: 12 }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {overdueCount > 0 && (
                  <div
                    style={{
                      padding: 10,
                      borderRadius: "var(--radius-md)",
                      background: "rgba(244,63,94,0.1)",
                      border: "1px solid rgba(244,63,94,0.25)",
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate("/invoices");
                      setShowNotifications(false);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#fb7185" }}>
                      <AlertTriangle size={14} /> {overdueCount} Overdue Invoices
                    </div>
                    <div style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 11.5 }}>
                      Review payment terms or trigger financing.
                    </div>
                  </div>
                )}

                {highRiskCount > 0 && (
                  <div
                    style={{
                      padding: 10,
                      borderRadius: "var(--radius-md)",
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.25)",
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate("/customers");
                      setShowNotifications(false);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#fbbf24" }}>
                      <TrendingDown size={14} /> {highRiskCount} High Risk Customer Invoices
                    </div>
                    <div style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 11.5 }}>
                      AI predicts high default probability.
                    </div>
                  </div>
                )}

                <div
                  style={{
                    padding: 10,
                    borderRadius: "var(--radius-md)",
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    fontSize: 12.5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#34d399" }}>
                    <ShieldCheck size={14} /> Digital Twin Engine Synchronized
                  </div>
                  <div style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 11.5 }}>
                    Cash runway baseline calculated with 94.8% confidence.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>          {/* User Authentication Profile Button */}
        <div style={{ position: "relative" }}>
          {isAuthenticated ? (
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-medium)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-blue), #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {user?.avatar || "NF"}
              </div>
              <div className="topbar-user-text" style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  {user?.name || "Partner"}
                </span>
                <span style={{ fontSize: 9.5, color: "var(--accent-emerald)", fontWeight: 600 }}>
                  {user?.role?.split(" ")[0] || "Owner"}
                </span>
              </div>
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/login")}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* User Profile Dropdown */}
          {isAuthenticated && showUserDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 10,
                width: "min(260px, calc(100vw - 32px))",
                background: "var(--bg-card)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 200,
                padding: "12px",
              }}
            >
              <div style={{ paddingBottom: 10, borderBottom: "1px solid var(--border-subtle)", marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text-primary)" }}>{user?.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{user?.email}</div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "var(--radius-full)",
                    background: "rgba(79,70,229,0.1)",
                    color: "var(--accent-blue)",
                    display: "inline-block",
                    marginTop: 6,
                  }}
                >
                  {user?.role}
                </div>
              </div>

              <div style={{ padding: "8px 10px", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: 12.5, display: "flex", alignItems: "center", gap: 8, color: "var(--text-primary)" }} onClick={() => { setShowUserDropdown(false); navigate("/settings"); }}>
                <span>🏢 Company Settings & Targets</span>
              </div>

              <div style={{ height: 1, background: "var(--border-subtle)", margin: "8px 0" }} />

              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 12.5,
                  color: "var(--accent-rose)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                }}
                onClick={() => {
                  logout();
                  setShowUserDropdown(false);
                  navigate("/login");
                }}
              >
                <LogOut size={13} />
                <span>Sign Out & Save</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
