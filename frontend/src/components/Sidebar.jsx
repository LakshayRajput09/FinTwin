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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  RefreshCw,
  ExternalLink,
  User,
  LogOut,
} from "lucide-react";

import {
  getBusiness,
  subscribeFinancialData,
  isDatabaseConnected,
  switchBusinessProfile,
} from "../data/financialStore";
import { calculateRunwayDays } from "../engines/digitalTwin";
import { useAuth } from "../context/AuthContext";

const primaryNav = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Cash Flow Twin", path: "/cash-flow", icon: Wallet },
  { name: "Invoices", path: "/invoices", icon: FileText, badge: "Live" },
  { name: "Expenses & Burn", path: "/expenses", icon: CreditCard },
  { name: "Customers & Risk", path: "/customers", icon: Users },
  { name: "90-Day Forecast", path: "/forecast", icon: TrendingUp },
  { name: "What-If Simulator", path: "/simulator", icon: FlaskConical },
  { name: "MSME Financing", path: "/financing", icon: Landmark, badge: "New" },
  { name: "Reports & P&L", path: "/reports", icon: FileSpreadsheet },
  { name: "Integrations", path: "/integrations", icon: Layers },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();

  const [business, setBusiness] = useState(getBusiness());
  const [dbConnected, setDbConnected] = useState(isDatabaseConnected());
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const [runway, setRunway] = useState(calculateRunwayDays());

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setBusiness(getBusiness());
      setDbConnected(isDatabaseConnected());
      setRunway(calculateRunwayDays());
    });
    return unsub;
  }, []);

  const handleProfileSelect = (id, roleKey) => {
    switchBusinessProfile(id);
    if (roleKey) switchDemoRole(roleKey);
    setShowProfileSwitcher(false);
  };

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <Link to="/landing" className="brand-logo-wrap">
          <div className="brand-logo-icon">FT</div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">FinTwin</span>
              <span className="brand-subtitle">
                <Sparkles size={11} /> AI Digital Twin
              </span>
            </div>
          )}
        </Link>
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Business & Role Switcher */}
      {!collapsed && (
        <div style={{ position: "relative" }}>
          <div
            className="sidebar-business-card"
            onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
          >
            <div className="biz-avatar">
              {business.name ? business.name.charAt(0) : "F"}
            </div>
            <div className="biz-details">
              <div className="biz-name">{business.name || "My Business"}</div>
              <div className="biz-type">
                {user ? `${user.role?.split(" ")[0]} Mode` : (business.industry || "MSME Account")}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          </div>

          {showProfileSwitcher && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 14,
                right: 14,
                background: "var(--bg-card-solid)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 200,
                padding: "6px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  padding: "6px 8px",
                }}
              >
                Switch MSME Role Profile
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: business.id === "BUS-001" ? 600 : 400,
                  color: business.id === "BUS-001" ? "#60a5fa" : "var(--text-secondary)",
                  background: business.id === "BUS-001" ? "rgba(59,130,246,0.12)" : "transparent",
                }}
                onClick={() => handleProfileSelect("BUS-001", "founder")}
              >
                👑 Founder / CEO (ABC Mfg)
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: business.id === "BUS-002" ? 600 : 400,
                  color: business.id === "BUS-002" ? "#60a5fa" : "var(--text-secondary)",
                  background: business.id === "BUS-002" ? "rgba(59,130,246,0.12)" : "transparent",
                }}
                onClick={() => handleProfileSelect("BUS-002", "cfo")}
              >
                💼 CFO (Zenith Logistics)
              </div>
              <div
                style={{
                  padding: "8px 10px",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontWeight: business.id === "BUS-003" ? 600 : 400,
                  color: business.id === "BUS-003" ? "#60a5fa" : "var(--text-secondary)",
                  background: business.id === "BUS-003" ? "rgba(59,130,246,0.12)" : "transparent",
                }}
                onClick={() => handleProfileSelect("BUS-003", "accountant")}
              >
                📊 Controller (Apex Engg)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-title">Operations</div>}
        {primaryNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              title={collapsed ? item.name : undefined}
            >
              <div className="nav-item-icon">
                <Icon size={18} />
              </div>
              {!collapsed && <span>{item.name}</span>}
              {!collapsed && item.badge && (
                <span className={`nav-badge ${item.badge === "Live" ? "success" : ""}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Area */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-runway-chip">
            <div className="runway-pulse"></div>
            <div>
              <div className="runway-label">Estimated Runway</div>
              <div className="runway-val">{runway} Days Buffer</div>
            </div>
          </div>

          <div className="sidebar-db-status">
            <span className="status-indicator">
              <span className={dbConnected ? "dot-connected" : "dot-offline"} />
              {dbConnected ? "Cloud Sync Active" : "Local Twin Mode"}
            </span>
            <Link
              to="/landing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 10.5,
                color: "var(--accent-blue)",
              }}
            >
              Landing <ExternalLink size={10} />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
