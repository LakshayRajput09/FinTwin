import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Users,
  CreditCard,
  Layers,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  Cpu,
  BarChart3,
  Lock,
  ExternalLink,
  Flame,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Interactive sandbox state in Hero
  const [sandboxRev, setSandboxRev] = useState(15); // in Lakhs
  const [sandboxBurn, setSandboxBurn] = useState(10); // in Lakhs
  const [sandboxDelay, setSandboxDelay] = useState(25); // days

  // FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  // Pricing toggle state
  const [annualBilling, setAnnualBilling] = useState(true);

  // Calculate live sandbox metrics
  const monthlyCashInflow = sandboxRev * (1 - (sandboxDelay / 90) * 0.4);
  const netMonthlyCashflow = monthlyCashInflow - sandboxBurn;
  const simulatedRunway = sandboxBurn > 0 ? Math.max(0, Math.round((12 / sandboxBurn) * 30)) : 120;
  const cashTrapped = (sandboxRev * (sandboxDelay / 30)).toFixed(1);

  return (
    <div className="landing-wrapper">
      {/* =================================================================
          NAVBAR
          ================================================================= */}
      <header className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="brand-logo-icon" style={{ width: 36, height: 36, fontSize: 15 }}>
            FT
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: -0.5 }}>
            FinTwin
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              background: "rgba(16,185,129,0.15)",
              color: "#34d399",
              border: "1px solid rgba(16,185,129,0.3)",
              marginLeft: 4,
            }}
          >
            AI Digital Twin
          </span>
        </div>

        <nav className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#sandbox" className="landing-nav-link">Live Simulator</a>
          <a href="#calculator" className="landing-nav-link">ROI Calculator</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
          <a href="#faq" className="landing-nav-link">FAQ</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="btn btn-secondary btn-sm"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <UserCheck size={14} style={{ color: "#34d399" }} />
                <span>Dashboard ({user?.name?.split(" ")[0] || "Account"})</span>
              </Link>
              <button
                onClick={() => logout()}
                className="btn btn-secondary btn-sm"
                style={{ color: "#fb7185", padding: "6px 12px" }}
                title="Log out"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{ padding: "7px 16px" }}
              >
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm"
                style={{ padding: "7px 18px" }}
              >
                <span>Get Started Free</span>
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* =================================================================
          HERO SECTION
          ================================================================= */}
      <section className="landing-hero">
        <div className="landing-badge">
          <Sparkles size={14} style={{ color: "#60a5fa" }} />
          <span>Next-Gen Financial Intelligence for Growing MSMEs</span>
        </div>

        <h1 className="landing-hero-title">
          The AI Digital Twin for <br />
          <span
            style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #3b82f6 50%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MSME Cash Flow & Runway
          </span>
        </h1>

        <p className="landing-hero-subtitle">
          Eliminate surprise cash deficits. FinTwin builds an AI replica of your business finances —
          predicting customer payment delays, stress-testing shocks, and unlocking instant working capital.
        </p>

        <div className="landing-cta-group">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="btn btn-primary btn-lg"
              style={{ gap: 10, fontSize: 16 }}
            >
              <Sparkles size={18} />
              <span>Go to Executive Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="btn btn-primary btn-lg"
                style={{ gap: 10, fontSize: 16 }}
              >
                <Sparkles size={18} />
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary btn-lg"
                style={{ gap: 8, fontSize: 15 }}
              >
                <span>Log In to Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Hero Stats */}
        <div className="landing-stats-row">
          <div className="landing-stat-item">
            <h3>94.8%</h3>
            <p>AI Delay Prediction Accuracy</p>
          </div>
          <div className="landing-stat-item">
            <h3>₹18.4L</h3>
            <p>Avg. Working Capital Unlocked</p>
          </div>
          <div className="landing-stat-item">
            <h3>42 Days</h3>
            <p>Avg. Cash Runway Visibility</p>
          </div>
          <div className="landing-stat-item">
            <h3>Universal</h3>
            <p>CSV, Excel, PDF & JSON Invoices</p>
          </div>
        </div>
      </section>

      {/* =================================================================
          INTERACTIVE LIVE SANDBOX (HERO FEATURE)
          ================================================================= */}
      <section id="sandbox" className="landing-sandbox">
        <div className="sandbox-card">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: "#60a5fa",
              }}
            >
              Interactive Preview
            </span>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
              Simulate Your Cash Flow In Real-Time
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 600, margin: "6px auto 0" }}>
              Slide parameters below to watch how payment delays and burn rate immediately impact your cash runway.
            </p>
          </div>

          <div className="grid-12" style={{ alignItems: "center" }}>
            {/* Sliders Column */}
            <div className="col-span-6" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "18px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Monthly Revenue Invoiced</span>
                  <span style={{ color: "#60a5fa", fontWeight: 700 }}>₹{sandboxRev}.00 Lakhs</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={sandboxRev}
                  onChange={(e) => setSandboxRev(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "18px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Monthly Operating Burn</span>
                  <span style={{ color: "#fb7185", fontWeight: 700 }}>₹{sandboxBurn}.00 Lakhs</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="40"
                  value={sandboxBurn}
                  onChange={(e) => setSandboxBurn(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", padding: "18px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Customer Payment Delay</span>
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>{sandboxDelay} Days Average</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={sandboxDelay}
                  onChange={(e) => setSandboxDelay(Number(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>

            {/* Live Twin Telemetry Result */}
            <div className="col-span-6">
              <div
                style={{
                  background: "linear-gradient(145deg, #111827 0%, #0a0f1d 100%)",
                  border: "1px solid rgba(59,130,246,0.35)",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
                    <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                      Twin Telemetry
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "var(--radius-full)",
                      background: netMonthlyCashflow >= 0 ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)",
                      color: netMonthlyCashflow >= 0 ? "#34d399" : "#fb7185",
                    }}
                  >
                    {netMonthlyCashflow >= 0 ? "Cash Positive" : "Liquidity Trap"}
                  </span>
                </div>

                <div className="grid-2" style={{ gap: 14, marginBottom: 20 }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Estimated Runway</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginTop: 4 }}>
                      {simulatedRunway} Days
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: 14, borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Cash Trapped in Invoices</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fbbf24", marginTop: 4 }}>
                      ₹{cashTrapped} Lakhs
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(139,92,246,0.12)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    marginBottom: 20,
                  }}
                >
                  <strong style={{ color: "#c4b5fd" }}>Twin Diagnostic: </strong>
                  {sandboxDelay > 20 ? (
                    <span>
                      Customer collection delays of {sandboxDelay} days are trapping ₹{cashTrapped}L in working capital. Discounting these invoices could instantly restore your cash buffer.
                    </span>
                  ) : (
                    <span>
                      Collection health is strong. Your business generates healthy net cash flow with strong liquidity reserves.
                    </span>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => navigate("/simulator")}
                >
                  <span>Open Full What-If Simulator</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          CORE FEATURE SHOWCASE
          ================================================================= */}
      <section id="features" style={{ padding: "80px 24px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#10b981" }}>
            Autonomous MSME Finance
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>
            Engineered for High-Growth Businesses
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 640, margin: "8px auto 0" }}>
            From predictive invoices to scenario stress tests, FinTwin delivers end-to-end liquidity control.
          </p>
        </div>

        <div className="feature-grid" style={{ padding: 0 }}>
          <div className="feature-box">
            <div className="card-icon-wrap" style={{ width: 42, height: 42, marginBottom: 18 }}>
              <Activity size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Digital Twin Simulation</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6 }}>
              A continuous, real-time mirror of your receivables, payables, and burn velocity that forecasts insolvency before it happens.
            </p>
          </div>

          <div className="feature-box">
            <div className="card-icon-wrap purple" style={{ width: 42, height: 42, marginBottom: 18 }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Universal Invoice Importer</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6 }}>
              Import invoices in any format: CSV, Excel (.xlsx/.xls), JSON, PDF with AI OCR scanning, and plain text.
            </p>
          </div>

          <div className="feature-box">
            <div className="card-icon-wrap emerald" style={{ width: 42, height: 42, marginBottom: 18 }}>
              <TrendingUp size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>90-Day Probabilistic Forecast</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6 }}>
              View best-case, expected, and worst-case cash runway boundaries with precise breach date warnings.
            </p>
          </div>

          <div className="feature-box">
            <div className="card-icon-wrap amber" style={{ width: 42, height: 42, marginBottom: 18 }}>
              <Flame size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>What-If Shock Simulator</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6 }}>
              Simulate 25% revenue drops, key client defaults, raw material inflation, or emergency capex expansions in seconds.
            </p>
          </div>

          <div className="feature-box">
            <div className="card-icon-wrap emerald" style={{ width: 42, height: 42, marginBottom: 18 }}>
              <CreditCard size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Working Capital Marketplace</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6 }}>
              Instantly calculate liquidity gaps and match eligible invoices with TReDS and NBFC discounting partners.
            </p>
          </div>

          <div className="feature-box">
            <div className="card-icon-wrap" style={{ width: 42, height: 42, marginBottom: 18 }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Tally, Zoho & GSTN Sync</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6 }}>
              Zero manual data entry. FinTwin connects to your existing accounting stack and e-invoice registries seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================
          ROI CALCULATOR SECTION
          ================================================================= */}
      <section id="calculator" style={{ padding: "80px 24px", background: "rgba(13,18,31,0.5)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#60a5fa" }}>
              Financial ROI Estimator
            </span>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>
              How Much Working Capital Can FinTwin Unlock?
            </h2>
          </div>

          <div className="glass-card" style={{ padding: "36px" }}>
            <div className="grid-3" style={{ gap: 24, textAlign: "center" }}>
              <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Average Overdraft Penalty Avoidance</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#34d399", marginTop: 8 }}>₹1.85 Lakhs / yr</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Saved via early warning alerts</div>
              </div>
              <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>DSO (Days Sales Outstanding) Reduction</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#60a5fa", marginTop: 8 }}>-16.4 Days</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Faster cash collections</div>
              </div>
              <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-md)" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Cash Flow Visibility Horizon</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#c4b5fd", marginTop: 8 }}>90 Days</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Full forward liquidity radar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          PRICING PLANS
          ================================================================= */}
      <section id="pricing" style={{ padding: "80px 24px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#10b981" }}>
            Transparent Pricing
          </span>
          <h2 style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>
            Predictable Plans for MSMEs
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 18 }}>
            <span style={{ fontSize: 13, color: !annualBilling ? "#fff" : "var(--text-muted)" }}>Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: annualBilling ? "#3b82f6" : "rgba(255,255,255,0.2)",
                position: "relative",
                transition: "background 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: annualBilling ? 23 : 3,
                  transition: "left 0.2s ease",
                }}
              />
            </button>
            <span style={{ fontSize: 13, color: annualBilling ? "#fff" : "var(--text-muted)" }}>
              Annual <span style={{ color: "#34d399", fontWeight: 700 }}>(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="pricing-grid">
          {/* Starter */}
          <div className="pricing-card">
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Starter Twin</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, margin: "4px 0 18px" }}>
              For early-stage MSMEs needing cash visibility.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
              ₹{annualBilling ? "1,999" : "2,499"}
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}> / mo</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-secondary)", marginBottom: 30, flex: 1 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> 30-Day Cash Flow Forecasting
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Up to 100 Monthly Invoices
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Basic What-If Simulator
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> CSV, Excel & PDF Import
              </li>
            </ul>
            <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}>
              Get Started
            </button>
          </div>

          {/* Growth Twin (Featured) */}
          <div className="pricing-card featured">
            <div
              style={{
                position: "absolute",
                top: -12,
                right: 20,
                background: "linear-gradient(135deg, #3b82f6, #10b981)",
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 800,
                padding: "3px 12px",
                borderRadius: "var(--radius-full)",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Most Popular
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Growth Twin Pro</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, margin: "4px 0 18px" }}>
              For growing manufacturers, traders & service MSMEs.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#60a5fa", marginBottom: 20 }}>
              ₹{annualBilling ? "4,799" : "5,999"}
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}> / mo</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-primary)", marginBottom: 30, flex: 1 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> 90-Day AI Probabilistic Runway
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> ML Payment Delay Prediction
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Full Shock Simulator & Capex Testing
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Multi-Format Invoices (Excel, PDF, CSV)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> FinTwin AI Copilot Assistant
              </li>
            </ul>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}>
              Launch Pro Twin
            </button>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Enterprise MSME</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, margin: "4px 0 18px" }}>
              Multi-entity corporations & supply chain networks.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 20 }}>
              ₹{annualBilling ? "9,999" : "12,499"}
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}> / mo</span>
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-secondary)", marginBottom: 30, flex: 1 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Unlimited Entities & Invoices
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Automated TReDS Factoring API
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Custom ERP & SAP Connector
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={15} style={{ color: "#34d399" }} /> Dedicated Fractional CFO Advisory
              </li>
            </ul>
            <button className="btn btn-secondary" style={{ width: "100%" }} onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================
          FAQ SECTION
          ================================================================= */}
      <section id="faq" style={{ padding: "80px 24px", maxWidth: 880, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800 }}>Frequently Asked Questions</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6 }}>
            Everything you need to know about FinTwin and financial digital twins.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            {
              q: "What exactly is a Financial Digital Twin?",
              a: "A Financial Digital Twin is a real-time mathematical replica of your company's cash flow, receivables, payables, and recurring burn. It runs Monte Carlo simulations to test how delays, revenue fluctuations, and expenses will affect your future bank balance.",
            },
            {
              q: "What file formats are supported for adding invoices?",
              a: "FinTwin supports CSV, Microsoft Excel (.xlsx and .xls), JSON (including GST e-invoice formats), PDF invoices with automated AI OCR extraction, and plain text/TSV files.",
            },
            {
              q: "How does FinTwin predict customer payment delays?",
              a: "Our machine learning models analyze historical customer payment habits, invoice amounts, invoice due dates, and macro industry patterns to forecast the expected collection date with over 94% accuracy.",
            },
            {
              q: "Is our financial data secure and private?",
              a: "Absolutely. All financial data is encrypted in transit and at rest using 256-bit AES encryption, complying with ISO 27001 and RBI Account Aggregator security standards.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{ padding: 20, cursor: "pointer" }}
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{item.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
              {openFaq === idx && (
                <p style={{ color: "var(--text-secondary)", fontSize: 13.5, marginTop: 12, lineHeight: 1.6 }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================
          FOOTER
          ================================================================= */}
      <footer className="landing-footer">
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="brand-logo-icon" style={{ width: 30, height: 30, fontSize: 13 }}>
              FT
            </div>
            <span style={{ fontSize: 16, fontWeight: 800 }}>FinTwin</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 12 }}>
              © 2026 FinTwin Technologies Inc. All rights reserved.
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 12.5, color: "var(--text-muted)" }}>
            <Link to="/login" style={{ color: "#60a5fa" }}>Sign In</Link>
            <span>•</span>
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>256-bit AES Encryption</span>
            <span>•</span>
            <span>RBI AA Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
