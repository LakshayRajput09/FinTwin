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

const primaryNavItems = [
  { key: "dashboard", name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { key: "invoices", name: "Invoices", path: "/invoices", icon: FileText },
  { key: "customers", name: "Customers", path: "/customers", icon: Users },
  { key: "expenses", name: "Expenses", path: "/expenses", icon: CreditCard },
  { key: "cashFlow", name: "Cash Flow", path: "/cash-flow", icon: Wallet },
  { key: "forecast", name: "Forecast", path: "/forecast", icon: TrendingUp },
  { key: "risk", name: "Risk", path: "/financing", icon: ShieldCheck },
  { key: "simulator", name: "Simulator", path: "/simulator", icon: FlaskConical },
  { key: "financing", name: "Financing", path: "/financing", icon: Landmark },
  { key: "reports", name: "Reports", path: "/reports", icon: FileSpreadsheet },
  { key: "integrations", name: "Integrations", path: "/integrations", icon: Layers },
  { key: "settings", name: "Settings", path: "/settings", icon: Settings },
];

const secondaryNavItems = [
  { key: "vendors", name: "Vendors (43B)", path: "/vendors", icon: Package },
  { key: "gst", name: "GST Tax", path: "/gst", icon: Percent },
  { key: "payroll", name: "Payroll", path: "/payroll", icon: UserCheck },
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
        <Link to="/landing" className="brand-logo-wrap" onClick={handleNavClick} style={{ textDecoration: 'none' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "rgba(31, 90, 74, 0.1)",
            color: "#1F5A4A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 14,
            border: "1px solid rgba(31, 90, 74, 0.15)"
          }}>
            FT
          </div>
          {!collapsed && (
            <div className="brand-text" style={{ marginLeft: 12 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                FinTwin
              </span>
              <span style={{ fontSize: 11, color: "var(--text-secondary)", display: "block" }}>
                Your Financial Twin
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

      {/* Navigation List */}
      <nav className="sidebar-nav" style={{ overflowY: "auto", flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key + item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={handleNavClick}
              title={collapsed ? item.name : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderRadius: "0 10px 10px 0",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 650 : 500,
                color: isActive ? "#1F5A4A" : "#2D3748",
                background: isActive ? "rgba(31, 90, 74, 0.10)" : "transparent",
                borderLeft: isActive ? "3px solid #1F5A4A" : "3px solid transparent",
                transition: "all 0.15s ease"
              }}
            >
              <div
                className="nav-item-icon"
                style={{
                  color: isActive ? "#1F5A4A" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon size={18} />
              </div>
              {!collapsed && (
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}

        {/* Secondary modules divider if uncollapsed */}
        {!collapsed && (
          <div style={{ margin: "10px 0 4px", padding: "0 12px" }}>
            <div style={{ height: 1, background: "rgba(0,0,0,0.05)" }} />
          </div>
        )}

        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={handleNavClick}
              title={collapsed ? item.name : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "7px 12px",
                borderRadius: "0 10px 10px 0",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: isActive ? 650 : 500,
                color: isActive ? "#1F5A4A" : "#64748B",
                background: isActive ? "rgba(31, 90, 74, 0.08)" : "transparent",
                borderLeft: isActive ? "3px solid #1F5A4A" : "3px solid transparent",
              }}
            >
              <div style={{ color: isActive ? "#1F5A4A" : "#64748B" }}>
                <Icon size={16} />
              </div>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Human Software Widget Footer */}
      <div style={{ padding: "8px 10px 12px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <div
          className="sidebar-user-pill"
          onClick={() => {
            navigate("/settings");
            handleNavClick();
          }}
          title="Account Settings"
        >
          <div className="sidebar-user-avatar">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "CE"}
          </div>
          {!collapsed && (
            <>
              <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name">{user?.name || "Ceo"}</div>
                <div className="sidebar-user-role">{user?.role || "CEO"}</div>
              </div>
              <ChevronRight size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            </>
          )}
        </div>
      </div>
</aside>
  );
}
