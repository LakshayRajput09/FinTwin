import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  ArrowLeft,
  Search,
  Sparkles,
  Sliders,
  Wallet,
  FileText,
  ShieldAlert,
  Percent,
  Receipt,
  RotateCcw,
  Compass,
  AlertTriangle,
} from "lucide-react";
import AmbientBackground from "../components/AmbientBackground";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, cycleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const suggestedRoutes = [
    { name: "Executive Dashboard", path: "/dashboard", icon: LayoutDashboard, category: "Overview" },
    { name: "90-Day Cash Flow Radar", path: "/cash-flow", icon: Wallet, category: "Cash & Liquidity" },
    { name: "Invoices & MSME 43B(h)", path: "/invoices", icon: FileText, category: "Receivables" },
    { name: "Runway Stress Simulator", path: "/simulator", icon: Sliders, category: "Scenarios" },
    { name: "Deep-Dive Risk Analysis", path: "/risk", icon: ShieldAlert, category: "Compliance" },
    { name: "GST ITC Reconciler", path: "/gst", icon: Percent, category: "Taxation" },
    { name: "Payroll & Compliance", path: "/payroll", icon: Receipt, category: "Operations" },
    { name: "Public Landing Page", path: "/", icon: Home, category: "Home" },
  ];

  const filteredRoutes = searchQuery.trim()
    ? suggestedRoutes.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestedRoutes.slice(0, 4);

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? "/dashboard" : "/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: "var(--bg-canvas)",
        color: "var(--text-primary)",
        overflowX: "hidden",
      }}
    >
      {/* Dynamic Ambient Background */}
      <AmbientBackground />

      {/* Top Floating Navigation Header */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "var(--accent-blue-glow, rgba(31, 90, 74, 0.12))",
              color: "var(--accent-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            FT
          </div>
          <div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 750,
                color: "var(--text-primary)",
                letterSpacing: "-0.5px",
                display: "block",
                lineHeight: 1.1,
              }}
            >
              FinTwin
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "var(--text-secondary)",
              }}
            >
              Financial Digital Twin
            </span>
          </div>
        </Link>

        {/* Header Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Theme Switcher Toggle */}
          <button
            onClick={cycleTheme}
            className="btn-secondary"
            title={`Current Theme: ${currentTheme.name} (Click to change)`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>{currentTheme.emoji}</span>
            <span className="desktop-only">{currentTheme.name}</span>
          </button>

          <button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Home size={15} />
            <span>{isAuthenticated ? t("dashboard", "Dashboard") : t("home", "Home")}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 20px 60px",
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: 780,
            width: "100%",
            borderRadius: 24,
            padding: "48px 40px",
            textAlign: "center",
            boxShadow: "var(--shadow-lg), 0 24px 60px rgba(0,0,0,0.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Top Glowing Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: 2,
              background: `linear-gradient(90deg, transparent, ${currentTheme.primaryAccent}, transparent)`,
              opacity: 0.8,
            }}
          />

          {/* Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              color: "var(--accent-amber, #f59e0b)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <AlertTriangle size={14} />
            <span>404 • Ledger Entry Out Of Range</span>
          </div>

          {/* Stylized Giant 404 Headline */}
          <div
            style={{
              fontSize: "clamp(72px, 12vw, 120px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              marginBottom: 16,
              background: `linear-gradient(135deg, var(--text-primary) 30%, ${currentTheme.primaryAccent} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.06))",
              userSelect: "none",
            }}
          >
            404
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(20px, 3.2vw, 28px)",
              fontWeight: 750,
              color: "var(--text-primary)",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Financial Route Not Found
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 15,
              color: "var(--text-secondary)",
              maxWidth: 580,
              margin: "0 auto 20px",
              lineHeight: 1.6,
            }}
          >
            The telemetry endpoint or scenario URL you requested doesn't exist on our ledger.
            It may have been re-indexed, or is outside your company's active fiscal models.
          </p>

          {/* Requested URL Display */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 8,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 32,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span>Requested Path:</span>
            <code style={{ color: "var(--accent-blue)", fontWeight: 600 }}>
              {location.pathname}
            </code>
          </div>

          {/* Main Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 36,
            }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 650,
                cursor: "pointer",
                boxShadow: "0 6px 20px var(--accent-blue-glow, rgba(31,90,74,0.25))",
              }}
            >
              <LayoutDashboard size={18} />
              <span>Go to Live Dashboard</span>
            </button>

            <button
              onClick={handleGoBack}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <ArrowLeft size={16} />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Home size={16} />
              <span>Homepage</span>
            </button>
          </div>

          {/* Quick Route Search & Recommendations */}
          <div
            style={{
              background: "var(--bg-secondary)",
              borderRadius: 16,
              padding: "20px 24px",
              border: "1px solid var(--border-subtle)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Compass size={16} style={{ color: "var(--accent-blue)" }} />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  Quick Destination Navigator
                </span>
              </div>

              {/* In-page Route Search */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: 10,
                  padding: "4px 10px",
                  width: "min(240px, 100%)",
                }}
              >
                <Search size={14} style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Filter destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Suggested Destination Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {filteredRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: 10,
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      textDecoration: "none",
                      color: "var(--text-primary)",
                      transition: "all 0.15s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-focus)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border-subtle)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: "var(--accent-blue-glow, rgba(31, 90, 74, 0.1))",
                        color: "var(--accent-blue)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={15} />
                    </div>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <div
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {route.name}
                      </div>
                      <div
                        style={{
                          fontSize: 10.5,
                          color: "var(--text-muted)",
                        }}
                      >
                        {route.category}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Micro Telemetry Status Footer */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 11.5,
              color: "var(--text-muted)",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--accent-emerald, #10b981)",
                  display: "inline-block",
                  boxShadow: "0 0 6px var(--accent-emerald)",
                }}
              />
              <span>FinTwin Financial Engine Online</span>
            </div>

            <div>
              <span>Need help? Open </span>
              <kbd
                style={{
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-medium)",
                  fontSize: 10.5,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                ⌘ + J
              </kbd>
              <span> for AI Copilot</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
