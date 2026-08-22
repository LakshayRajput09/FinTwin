import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Lock,
  Mail,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, register, switchDemoRole, DEMO_USERS, user } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("lakshay@abcmfg.in");
  const [password, setPassword] = useState("••••••••");

  // Registration State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regGstin, setRegGstin] = useState("");
  const [regIndustry, setRegIndustry] = useState("Manufacturing");

  const [error, setError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your work email.");
      return;
    }
    login(email, password);
    navigate("/dashboard");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regEmail || !regName || !regCompany) {
      setError("Please complete all required fields.");
      return;
    }
    register({
      name: regName,
      email: regEmail,
      company: regCompany,
      gstin: regGstin,
      role: "Managing Director",
    });
    navigate("/dashboard");
  };

  const handleDemoClick = (roleKey) => {
    switchDemoRole(roleKey);
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 15% 25%, rgba(59, 130, 246, 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.06) 0%, transparent 45%), #07090e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 20px",
      }}
    >
      {/* Brand Header */}
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div className="brand-logo-icon" style={{ width: 42, height: 42, fontSize: 18 }}>
          FT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: "#fff" }}>
            FinTwin
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#34d399", letterSpacing: 1, textTransform: "uppercase" }}>
            AI Financial Digital Twin
          </span>
        </div>
      </Link>

      {/* Main Authentication Card */}
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "34px 32px",
          background: "rgba(13, 18, 31, 0.9)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.15)",
        }}
      >
        {/* Tab Toggle */}
        <div className="tabs-container" style={{ marginBottom: 24 }}>
          <button
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            style={{ flex: 1, textAlign: "center", padding: "9px" }}
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            className={`tab-btn ${mode === "register" ? "active" : ""}`}
            style={{ flex: 1, textAlign: "center", padding: "9px" }}
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register Business
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: "rgba(244, 63, 94, 0.15)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fb7185",
              fontSize: 12.5,
              marginBottom: 18,
            }}
          >
            {error}
          </div>
        )}

        {/* 1-Click Fast Demo Login */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              color: "var(--text-dim)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Sparkles size={12} style={{ color: "#a78bfa" }} />
            <span>Instant Demo Access (No Password Required)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                justifyContent: "space-between",
                padding: "9px 14px",
                background: "rgba(59, 130, 246, 0.08)",
                borderColor: "rgba(59, 130, 246, 0.25)",
              }}
              onClick={() => handleDemoClick("founder")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>👑</span>
                <span style={{ fontWeight: 600, color: "#fff" }}>Founder / CEO</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>• ABC Manufacturing</span>
              </div>
              <ArrowRight size={13} style={{ color: "#60a5fa" }} />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                justifyContent: "space-between",
                padding: "9px 14px",
                background: "rgba(16, 185, 129, 0.08)",
                borderColor: "rgba(16, 185, 129, 0.25)",
              }}
              onClick={() => handleDemoClick("cfo")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>💼</span>
                <span style={{ fontWeight: 600, color: "#fff" }}>Chief Financial Officer (CFO)</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>• Zenith Logistics</span>
              </div>
              <ArrowRight size={13} style={{ color: "#34d399" }} />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                justifyContent: "space-between",
                padding: "9px 14px",
                background: "rgba(139, 92, 246, 0.08)",
                borderColor: "rgba(139, 92, 246, 0.25)",
              }}
              onClick={() => handleDemoClick("accountant")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14 }}>📊</span>
                <span style={{ fontWeight: 600, color: "#fff" }}>Financial Controller</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>• Apex Engineering</span>
              </div>
              <ArrowRight size={13} style={{ color: "#c4b5fd" }} />
            </button>
          </div>
        </div>

        <div style={{ position: "relative", textAlign: "center", margin: "20px 0" }}>
          <div style={{ height: 1, background: "var(--border-subtle)" }} />
          <span
            style={{
              position: "absolute",
              top: -9,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#0d121f",
              padding: "0 10px",
              fontSize: 11,
              color: "var(--text-dim)",
              fontWeight: 600,
            }}
          >
            OR WITH CREDENTIALS
          </span>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Work Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{ position: "absolute", left: 12, top: 13, color: "var(--text-muted)" }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Password</label>
                <span style={{ fontSize: 11.5, color: "#60a5fa", cursor: "pointer" }}>
                  Forgot?
                </span>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{ position: "absolute", left: 12, top: 13, color: "var(--text-muted)" }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            >
              <span>Sign In to Digital Twin</span>
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Rajesh Kumar"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company / Entity Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Horizon Precision Works Pvt Ltd"
                value={regCompany}
                onChange={(e) => setRegCompany(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">GSTIN (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="27AABCA1234F1Z8"
                  value={regGstin}
                  onChange={(e) => setRegGstin(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry</label>
                <select
                  className="form-select"
                  value={regIndustry}
                  onChange={(e) => setRegIndustry(e.target.value)}
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail & Logistics">Retail & Logistics</option>
                  <option value="Wholesale">Wholesale Trade</option>
                  <option value="Tech & Services">Tech & IT Services</option>
                  <option value="Construction">Construction</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="rajesh@horizonprecision.in"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-emerald btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: 18 }}
            >
              <span>Initialize Business Twin</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", display: "flex", gap: 16 }}>
        <span>256-Bit SSL Encrypted</span>
        <span>•</span>
        <span>ISO 27001 Certified</span>
        <span>•</span>
        <Link to="/" style={{ color: "#60a5fa" }}>Return to Home</Link>
      </div>
    </div>
  );
}
