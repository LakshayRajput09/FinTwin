import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  FileText,
  CreditCard,
  Users,
  TrendingUp,
  FlaskConical,
  Landmark,
  FileSpreadsheet,
  Layers,
  Settings,
  Percent,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  User,
  UserCheck,
  LogOut,
  X,
  Activity,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Package,
} from "lucide-react";

import {
  getBusiness,
  subscribeFinancialData,
  isDatabaseConnected,
} from "../data/financialStore";
import { calculateRunwayDays } from "../engines/digitalTwin";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const navGroups = [
  {
    title: "Overview & Cash Health",
    icon: Activity,
    items: [
      { key: "dashboard", name: "Overview & Health", path: "/dashboard", icon: LayoutDashboard },
      { key: "cashFlow", name: "Cash Flow Mirror", path: "/cash-flow", icon: Wallet },
      { key: "forecast", name: "Future Cash Forecast", path: "/forecast", icon: TrendingUp },
      { key: "simulator", name: "Scenario Planner", path: "/simulator", icon: FlaskConical },
    ],
  },
  {
    title: "Money & Partners",
    icon: Landmark,
    items: [
      { key: "financing", name: "Financing & Risk Analysis", path: "/financing", icon: Landmark, badge: "Risk Radar" },
      { key: "invoices", name: "Invoices & Cash Recovery", path: "/invoices", icon: FileText, badge: "⚡ Recovery" },
      { key: "customers", name: "Customer Insights", path: "/customers", icon: Users },
      { key: "vendors", name: "Vendors & Suppliers", path: "/vendors", icon: Package, badge: "43B(h)" },
    ],
  },
  {
    title: "Bills, Taxes & Team",
    icon: ShieldCheck,
    items: [
      { key: "expenses", name: "Bills & Expenses", path: "/expenses", icon: CreditCard },
      { key: "gst", name: "GST & Tax Filing", path: "/gst", icon: Percent, badge: "Tax" },
      { key: "payroll", name: "Team & Payroll", path: "/payroll", icon: UserCheck, badge: "Staff" },
      { key: "reports", name: "Profit & Loss Reports", path: "/reports", icon: FileSpreadsheet },
    ],
  },
  {
    title: "Account",
    icon: Layers,
    items: [
      { key: "integrations", name: "Bank & App Sync", path: "/integrations", icon: Layers },
      { key: "settings", name: "Business Settings", path: "/settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, onCloseMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const [business, setBusiness] = useState(getBusiness());
  const [dbConnected, setDbConnected] = useState(isDatabaseConnected());
  const [runway, setRunway] = useState(calculateRunwayDays());

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setBusiness(getBusiness());
      setDbConnected(isDatabaseConnected());
      setRunway(calculateRunwayDays());
    });
    return unsub;
  }, []);

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={`app-sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link to="/landing" className="brand-logo-wrap" onClick={handleNavClick}>
          <div className="brand-logo-icon">
            NF
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>NexFin</span>
                <span style={{ fontSize: 9.5, padding: "1px 6px", borderRadius: 4, background: "rgba(79,70,229,0.1)", color: "var(--accent-blue)", fontWeight: 700 }}>
                  Companion
                </span>
              </span>
              <span className="brand-subtitle">
                <Sparkles size={11} /> Smart Finance
              </span>
            </div>
          )}
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Desktop collapse toggle */}
          <button
            className="sidebar-collapse-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close toggle */}
          <button
            className="sidebar-collapse-btn mobile-close-btn"
            onClick={onCloseMobile}
            title="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Logged in User Profile Card */}
      {!collapsed && (
        <div style={{ padding: "0 14px", marginBottom: 10 }}>
          <div
            className="sidebar-business-card"
            onClick={() => {
              navigate("/settings");
              handleNavClick();
            }}
            title="Manage Company Settings"
          >
            <div className="biz-avatar">
              {user?.company ? user.company.charAt(0) : "B"}
            </div>
            <div className="biz-details">
              <div className="biz-name">{user?.company || business.name || "My Enterprise"}</div>
              <div className="biz-type" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span>{user?.name || "Partner"}</span>
                {user?.role && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(79,70,229,0.1)",
                      color: "var(--accent-blue)",
                    }}
                  >
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Groupings */}
      <nav className="sidebar-nav" style={{ overflowY: "auto", flex: 1, paddingBottom: 16 }}>
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div key={group.title} style={{ marginBottom: 6 }}>
              {!collapsed && (
                <div className="nav-group-title">
                  <GroupIcon size={12} />
                  <span>{group.title}</span>
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? "active" : ""}`}
                    onClick={handleNavClick}
                    title={collapsed ? item.name : undefined}
                  >
                    <div className="nav-item-icon">
                      <Icon size={17} />
                    </div>
                    {!collapsed && <span style={{ flex: 1 }}>{t(item.key, item.name)}</span>}
                    {!collapsed && item.badge && (
                      <span
                        className="nav-badge"
                        style={{
                          background: item.badge === "Live" ? "rgba(5, 150, 105, 0.1)" : "rgba(79, 70, 229, 0.1)",
                          color: item.badge === "Live" ? "var(--accent-emerald)" : "var(--accent-blue)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Human Companion Widget Footer */}
      {!collapsed && (
        <div className="sidebar-footer" style={{ borderTop: "1px solid var(--border-subtle)", padding: 14 }}>
          {/* Friendly Status Card */}
          <div
            style={{
              padding: "11px 13px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(5,150,105,0.12)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <HeartHandshake size={15} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 4 }}>
                <span>SAFE BUFFER</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {runway} Days of Cash Runway
              </div>
            </div>
          </div>

          <div className="sidebar-db-status" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="status-indicator" style={{ fontSize: 11, color: "var(--text-muted)" }}>
              <span className={dbConnected ? "dot-connected" : "dot-offline"} />
              {dbConnected ? t("Database Synced", "All Data Saved") : t("Local Twin Mode", "Local Mode")}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
                handleNavClick();
                navigate("/login");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: "var(--accent-rose)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontWeight: 600,
              }}
            >
              <LogOut size={11} /> {t("logout", "Logout")}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
