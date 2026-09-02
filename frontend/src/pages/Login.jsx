import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Phone,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  IndianRupee,
  Briefcase,
  Eye,
  EyeOff,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { updateBusinessProfile } from "../data/financialStore";
import { INDUSTRY_SECTORS, EXECUTIVE_ROLES } from "../data/sampleData";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { currentTheme, cycleTheme, theme } = useTheme();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loginMethod, setLoginMethod] = useState("email"); // 'email' | 'phone'
  const [selectedRole, setSelectedRole] = useState("CEO"); // 'CEO' | 'CFO' | 'Accountant'
  const [identifier, setIdentifier] = useState("ceo@bharatprecision.in");
  const [password, setPassword] = useState("msme2026");
  const [showPassword, setShowPassword] = useState(false);

  // Registration State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regGstin, setRegGstin] = useState("");
  const [regIndustry, setRegIndustry] = useState(INDUSTRY_SECTORS[0]);
  const [regOpeningCash, setRegOpeningCash] = useState("840000");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick Demo Auto-Fill
  const fillDemoAccount = (role = "CEO") => {
    setSelectedRole(role);
    setMode("login");
    setLoginMethod("email");
    if (role === "CEO") {
      setIdentifier("ceo@bharatprecision.in");
    } else if (role === "CFO") {
      setIdentifier("cfo@bharatprecision.in");
    } else {
      setIdentifier("accountant@bharatprecision.in");
    }
    setPassword("msme2026");
    setError("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!identifier) {
      setError(`Please enter your ${loginMethod === "email" ? "work email address" : "mobile phone number"}.`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = login(identifier, password, selectedRole);
      setLoading(false);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.error || "Invalid credentials.");
      }
    }, 400);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if ((!regEmail && !regPhone) || !regName || !regCompany) {
      setError("Please provide your name, company, and either an email or phone number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = register({
        name: regName,
        email: regEmail,
        phone: regPhone,
        company: regCompany,
        industry: regIndustry,
        gstin: regGstin,
        role: selectedRole,
      });

      setLoading(false);
      if (res.success) {
        updateBusinessProfile({
          name: regCompany,
          industry: regIndustry,
          gstin: regGstin,
          openingCash: Number(regOpeningCash) || 0,
        });
        navigate("/dashboard");
      } else {
        setError(res.error || "Registration failed.");
      }
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-canvas)",
        backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Subtle Background Glow Orbs */}
      <div
        className="auth-orb"
        style={{
          top: "15%",
          left: "20%",
          width: 320,
          height: 320,
          background: `${currentTheme.primaryAccent}15`,
        }}
      />
      <div
        className="auth-orb"
        style={{
          bottom: "10%",
          right: "20%",
          width: 380,
          height: 380,
          background: "rgba(16, 185, 129, 0.12)",
          animationDelay: "-4s",
        }}
      />

      {/* Top Floating Controls Bar */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 24,
          right: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: "#090d16",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                border: "2.5px solid #38bdf8",
                borderRadius: 4,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%" }} />
            </div>
          </div>
          <span style={{ fontSize: 19, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -0.5 }}>
            NexFin
          </span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={cycleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
          title="Cycle theme (Alt + T)"
        >
          {theme === "dusk" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>

      {/* Floating Trust Chips (Animated subtle float) */}
      <div
        className="desktop-only floating-card-subtle"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 22,
          zIndex: 2,
        }}
      >
        <span
          style={{
            padding: "5px 14px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            boxShadow: "var(--shadow-sm)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981" }} />
          ReBIT 1.1.2 Curve25519 Encrypted
        </span>
        <span
          style={{
            padding: "5px 14px",
            borderRadius: "var(--radius-full)",
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            boxShadow: "var(--shadow-sm)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ShieldCheck size={14} style={{ color: "var(--accent-blue)" }} />
          MSME Section 43B(h) Ready
        </span>
      </div>

      {/* Main Authentication Card */}
      <div
        className="glass-card auth-card-animated"
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--bg-card)",
          border: "1px solid var(--border-medium)",
          boxShadow: "0 24px 60px -12px rgba(0, 0, 0, 0.12), 0 0 20px rgba(79, 70, 229, 0.06)",
          padding: "32px 30px",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* Animated Tab Toggle: Sign In vs Register */}
        <div
          style={{
            display: "flex",
            background: "var(--bg-secondary)",
            padding: 4,
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            marginBottom: 20,
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: "9px",
              borderRadius: "calc(var(--radius-md) - 3px)",
              border: "none",
              background: mode === "login" ? "var(--bg-card)" : "transparent",
              color: mode === "login" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: mode === "login" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: mode === "login" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "9px",
              borderRadius: "calc(var(--radius-md) - 3px)",
              border: "none",
              background: mode === "register" ? "var(--bg-card)" : "transparent",
              color: mode === "register" ? "var(--text-primary)" : "var(--text-muted)",
              fontWeight: mode === "register" ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: mode === "register" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s ease",
            }}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Create Business Account
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(225, 29, 72, 0.1)",
              border: "1px solid rgba(225, 29, 72, 0.3)",
              color: "var(--accent-rose)",
              fontSize: 12.5,
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* 3 Executive Role Selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label className="form-label" style={{ margin: 0 }}>Executive Role Perspective</label>
            <span style={{ fontSize: 11, color: "var(--accent-blue)", fontWeight: 700 }}>
              {selectedRole} Mode
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {EXECUTIVE_ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px 8px",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                    borderRadius: "var(--radius-md)",
                    background: isSelected ? "var(--bg-secondary)" : "transparent",
                    border: isSelected ? "2px solid var(--accent-blue)" : "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                  }}
                  onClick={() => setSelectedRole(r.id)}
                >
                  <span style={{ fontSize: 18 }}>{r.icon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)" }}>{r.id}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.2 }}>
                    {r.id === "CEO" ? "Solvency & Growth" : r.id === "CFO" ? "Cash & Forecast" : "Payroll & Bills"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================
            1. SIGN IN FORM
            ================================================================= */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit}>
            {/* Email vs Phone Toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                type="button"
                className={`btn btn-sm ${loginMethod === "email" ? "btn-primary" : "btn-secondary"}`}
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => {
                  setLoginMethod("email");
                  setIdentifier("ceo@bharatprecision.in");
                  setError("");
                }}
              >
                <Mail size={13} />
                <span>Work Email</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${loginMethod === "phone" ? "btn-primary" : "btn-secondary"}`}
                style={{ flex: 1, justifyContent: "center" }}
                onClick={() => {
                  setLoginMethod("phone");
                  setIdentifier("+91 98201 44521");
                  setError("");
                }}
              >
                <Phone size={13} />
                <span>Mobile Phone</span>
              </button>
            </div>

            {loginMethod === "email" ? (
              <div className="form-group">
                <label className="form-label">Work Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={15}
                    style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }}
                  />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="name@company.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Mobile Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone
                    size={15}
                    style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }}
                  />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="+91 98201 44521"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  style={{ paddingLeft: 36, paddingRight: 36 }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 10,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div style={{ display: "flex", gap: 8, margin: "14px 0 18px", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                <Sparkles size={12} style={{ color: "var(--accent-amber)" }} />
                Quick demo:
              </span>
              <button
                type="button"
                onClick={() => fillDemoAccount("CEO")}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                CEO Login
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("CFO")}
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 4,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                }}
              >
                CFO Login
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", gap: 8 }}
            >
              <span>{loading ? "Authenticating..." : `Sign In as ${selectedRole}`}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        ) : (
          /* =================================================================
              2. REGISTRATION FORM
              ================================================================= */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Your Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Work Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="rahul@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="+91 98201 44521"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Business / Enterprise Name</label>
              <div style={{ position: "relative" }}>
                <Building size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="e.g. Bharat Precision Engineering"
                  value={regCompany}
                  onChange={(e) => setRegCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Industry Sector</label>
              <select
                className="form-select"
                value={regIndustry}
                onChange={(e) => setRegIndustry(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                {INDUSTRY_SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">GSTIN (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 27AABCA1234F1Z8"
                  value={regGstin}
                  onChange={(e) => setRegGstin(e.target.value.toUpperCase())}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Opening Cash Balance (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 840000"
                  value={regOpeningCash}
                  onChange={(e) => setRegOpeningCash(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-muted)" }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-emerald btn-lg"
              style={{ width: "100%", justifyContent: "center", gap: 8, marginTop: 10 }}
            >
              <span>{loading ? "Creating Account..." : `Initialize as ${selectedRole}`}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>

      {/* Trust & Security Footnote */}
      <div
        style={{
          marginTop: 24,
          fontSize: 12,
          color: "var(--text-muted)",
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <span>ReBIT Curve25519 Encrypted</span>
        <span>•</span>
        <span>MSME Section 43B(h)</span>
        <span>•</span>
        <Link to="/" style={{ color: "var(--accent-blue)", textDecoration: "none", fontWeight: 600 }}>
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}
