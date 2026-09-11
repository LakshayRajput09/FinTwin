import React, { useState, useEffect, useRef } from "react";
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
  Lock,
  Landmark,
  FileText,
  UserCheck,
  Check,
  Package,
  Calendar,
  Percent,
  Search,
  Moon,
  Sun,
  Cpu,
  Flame,
  Clock,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Hero3DScene from "../components/Hero3DScene";
import AmbientBackground from "../components/AmbientBackground";

// Dynamic Rotating Headline Phrases
const ROTATING_PHRASES = [
  "Predictable Cash Runways",
  "Section 43B(h) MSME Protections",
  "90-Day Digital Twin Forecasts",
  "Zero-Collateral Bank Financing",
  "Live RBI Account Aggregator Sync",
];

// Continuous Marquee Ribbon Items
const MARQUEE_ITEMS = [
  { icon: Landmark, text: "RBI Account Aggregator (Setu / Sahamati)" },
  { icon: ShieldCheck, text: "Section 43B(h) 45-Day Payment Rule" },
  { icon: Zap, text: "TReDS Early Invoice Discounting" },
  { icon: TrendingUp, text: "90-Day Digital Twin Cash Forecast" },
  { icon: Lock, text: "Curve25519 End-to-End Encryption" },
  { icon: CreditCard, text: "CGTMSE & MUDRA Govt Schemes" },
  { icon: FileText, text: "GSTR-2B Input Tax Credit Reconciliation" },
  { icon: Package, text: "MSME Samadhaan 3x RBI Interest Calculator" },
];

// Physical Invoices for Scroll-Driven Viewport Stack
const INVOICE_STACK = [
  {
    id: 1,
    buyer: "TATA MOTORS LTD",
    invNo: "09/26-27/1185",
    date: "28-AUG-2026",
    dueDate: "12-OCT-2026",
    item: "CNC Precision Engine Bracket",
    qty: "450",
    amount: "33,82,500.00",
    taxableValue: "+6,08,850.00",
    totalInvoice: "39,91,350.00",
    status: "§ 43B(h) VERIFIED",
  },
  {
    id: 2,
    buyer: "LARSEN & TOUBRO LTD",
    invNo: "09/26-27/0942",
    date: "01-SEP-2026",
    dueDate: "15-OCT-2026",
    item: "High-Tensile Flange Assemblies",
    qty: "120",
    amount: "18,40,000.00",
    taxableValue: "+3,31,200.00",
    totalInvoice: "21,71,200.00",
    status: "§ 43B(h) VERIFIED",
  },
  {
    id: 3,
    buyer: "HINDALCO INDUSTRIES",
    invNo: "09/26-27/0673",
    date: "25-AUG-2026",
    dueDate: "09-OCT-2026",
    item: "Heavy Forged Smelt Anode",
    qty: "85",
    amount: "15,60,000.00",
    taxableValue: "+2,80,800.00",
    totalInvoice: "18,40,800.00",
    status: "§ 43B(h) VERIFIED",
  },
  {
    id: 4,
    buyer: "BHARAT HEAVY ELECTRICALS LTD",
    invNo: "09/26-27/0784",
    date: "18-AUG-2026",
    dueDate: "02-OCT-2026",
    item: "Precision Stamping Rotors",
    qty: "310",
    amount: "29,60,000.00",
    taxableValue: "+5,32,800.00",
    totalInvoice: "34,92,800.00",
    status: "§ 43B(h) VERIFIED",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentTheme, cycleTheme, theme } = useTheme();

  // Sliding dynamic text in hero
  const [textIndex, setTextIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const realitySectionRef = useRef(null);

  // Smooth scroll down to ground reality section
  const scrollToReality = () => {
    if (realitySectionRef.current) {
      realitySectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Middle vertical scrolling invoice live feed counter
  const displayCount = "3 / 12";

  // Annual / Monthly Pricing State
  const [annualBilling, setAnnualBilling] = useState(true);

  // Minimal interactive sandbox state
  const [monthlyRev, setMonthlyRev] = useState(18); // in Lakhs
  const [delayDays, setDelayDays] = useState(25); // in Days
  const cashTrapped = ((monthlyRev * (delayDays / 30)) * 0.85).toFixed(1);
  const estimatedRunway = Math.max(14, Math.round(75 - delayDays * 0.9));

  // Minimal FAQ state
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    {
      q: "What is a Financial Digital Twin?",
      a: "A Digital Twin is a real-time mathematical simulation of your business finances. By linking your bank accounts, invoices, and operating bills, FinTwin projects your exact cash balance into the future, warning you about cash deficits weeks before they happen.",
    },
    {
      q: "How does the Section 43B(h) 45-Day Tracker help my business?",
      a: "Under Section 43B(h) of the Income Tax Act, buyers must pay registered MSMEs within 45 days. If delayed, buyers lose their tax deduction. FinTwin tracks every invoice countdown and generates legally binding demand notices with statutory compound interest calculated at 3x the RBI Bank Rate.",
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
      q: "Is my bank statement data private and secure?",
      a: "Yes. FinTwin integrates with the official RBI Account Aggregator network using ReBIT Curve25519 end-to-end cryptography. Data is encrypted between your bank and FinTwin—neither the Account Aggregator nor any third party can see your statements.",
    },
    {
      q: "How does FinTwin help me secure working capital loans?",
      a: "FinTwin matches your financial health with government-backed credit schemes (such as CGTMSE 85% sovereign collateral-free guarantees, MUDRA loans, and PMEGP) and enables 1-click invoice discounting through TReDS platforms.",
    },
  ];

  return (
    <div style={{ position: "relative", background: "transparent", color: "var(--text-primary)", minHeight: "100vh" }}>
      {/* Ambient Apple-inspired Liquid Glass Wallpaper Background */}
      <AmbientBackground />

      {/* Foreground Content Layer (z-index: 2 ensures all texts sit cleanly in front of the background) */}
      <div className="landing-content-layer" style={{ position: "relative", zIndex: 2 }}>
        {/* =================================================================
            1. TOP NAVBAR (MATCHING REFERENCE EXACTLY)
            ================================================================= */}
        <header
        className=""
        style={{
          position: "sticky",
          top: 16,
          zIndex: 100,
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1320,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          borderRadius: "var(--radius-full)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        {/* Brand & MSME TWIN Badge */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          {/* Logo icon */}
          <img
            src="/fintwin_logo.jpg"
            alt="FinTwin"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              objectFit: "contain",
              border: "1px solid var(--border-subtle)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          />

          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -0.5 }}>
            FinTwin
          </span>

          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "var(--radius-full)",
              background: "#dcfce7",
              color: "#166534",
              border: "1px solid #bbf7d0",
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            MSME TWIN
          </span>
        </Link>

        {/* Minimal Nav Links */}
        <nav className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, fontWeight: 600 }}>
          <a href="#reality" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Ground Reality</a>
          <a href="#features" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Features</a>
          <a href="#simulator" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Live Simulator</a>
          <a href="#calculator" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>ROI Estimator</a>
          <a href="#pricing" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Pricing</a>
          <a href="#faq" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>FAQ</a>
        </nav>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Theme Toggle Button */}
          <button
            onClick={cycleTheme}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-medium)",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Cycle theme (Alt + T)"
          >
            {theme === "dusk" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Quick Search ⌘K Pill */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-medium)",
              color: "var(--text-muted)",
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            <Search size={14} />
            <span style={{ fontWeight: 600, fontSize: 11 }}>⌘K</span>
          </button>

          {/* Sign In Link */}
          {/* Sign In Link */}
          <Link
            to="/login"
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--text-primary)",
              textDecoration: "none",
              padding: "4px 8px",
            }}
          >
            {isAuthenticated ? (user?.name?.split(" ")[0] ? `Hi, ${user.name.split(" ")[0]}` : "Account") : "Sign In"}
          </Link>

          {/* Deploy Twin → Button */}
          <Link
            to="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 18px",
              borderRadius: "var(--radius-full)",
              background: "#09090b",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            }}
          >
            <span>Deploy Twin</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* =================================================================
          2. MINIMALIST HERO SECTION WITH SLIDING ROTATING TEXT
          ================================================================= */}
      <section className="hero-scroll-animate" style={{ padding: "80px 24px 40px", maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
        {/* Compliance Badge */}
        <div
          className=""
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            marginBottom: 24,
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--text-primary)",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <Sparkles size={14} style={{ color: "var(--accent-blue)" }} />
          <span>RBI Account Aggregator & MSME Section 43B(h) Ready</span>
        </div>

        {/* Dynamic Rotating Headline */}
        <h1
          style={{
            fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: -1.5,
            color: "var(--text-primary)",
            margin: "0 auto 20px",
            maxWidth: 900,
          }}
        >
          The Financial Digital Twin for{" "}
          <br />
          <span
            key={textIndex}
            className="sliding-text-anim"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {ROTATING_PHRASES[textIndex]}
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(16px, 2vw, 18px)",
            color: "var(--text-secondary)",
            maxWidth: 680,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Eliminate surprise cash deficits. FinTwin continuously forecasts your bank balance, enforces 45-day MSME client payments, and unlocks non-dilutive working capital.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
          {isAuthenticated ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ gap: 8, padding: "12px 28px", fontSize: 15 }}>
                <Sparkles size={16} />
                <span>Launch Your Digital Twin</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/invoices"
                className="btn btn-lg "
                style={{
                  gap: 8,
                  padding: "12px 24px",
                  fontSize: 14.5,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Zap size={16} style={{ color: "var(--text-primary)" }} />
                <span>Cash Recovery Hub</span>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ gap: 8, padding: "12px 28px", fontSize: 15 }}>
                <Sparkles size={16} />
                <span>Start Free Digital Twin</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/invoices"
                className="btn btn-lg "
                style={{
                  gap: 8,
                  padding: "12px 24px",
                  fontSize: 14.5,
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <Zap size={16} style={{ color: "var(--text-primary)" }} />
                <span>Cash Recovery Hub</span>
              </Link>
              <button
                type="button"
                onClick={scrollToReality}
                className="btn btn-secondary btn-lg"
                style={{
                  padding: "12px 24px",
                  fontSize: 14.5,
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FileText size={16} />
                <span>See Invoices Unfold ↓</span>
              </button>
            </>
          )}
        </div>

        <Hero3DScene />

        {/* Continuous Horizontal Sliding Marquee Ribbon */}
        <div className="sliding-marquee-container" style={{ margin: "40px 0 10px" }}>
          <div className="sliding-marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="marquee-chip">
                  <Icon size={14} style={{ color: "var(--accent-blue)" }} />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================================
          3. THE GROUND REALITY & SCROLLING INVOICE VIEWPORT
             (MATCHING REFERENCE IMAGE PIXEL-FOR-PIXEL)
          ================================================================= */}
      <section
        id="reality"
        ref={realitySectionRef}
        className="reality-scroll-track"
        style={{
          position: "relative",
          padding: "50px 20px 60px",
          maxWidth: 1360,
          margin: "0 auto",
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "transparent",
          overflow: "visible",
        }}
      >
        <div
          className="reality-sticky-frame"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            boxSizing: "border-box",
            overflow: "visible",
          }}
        >
          {/* Section Title with Red Pulsing Dot */}
          <div style={{ margin: "0 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
              }}
            />
            <h2
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#dc2626",
                fontFamily: "var(--font-sans)",
              }}
            >
              THE GROUND REALITY & PROBLEM STATEMENT
            </h2>
          </div>

          {/* 5-Element Whiteboard Layout */}
          <div
            className="reality-grid-layout"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 412px auto 1fr",
              gap: 12,
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* -------------------------------------------------------------
                LEFT COLUMN: 9 STICKY NOTES (PAIN POINTS)
                Fixed & Stationary
                ------------------------------------------------------------- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Row 1: Note 1 (Yellow) & Note 2 (Pink) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
                {/* Note 1: Big Institutional Guys */}
                <div className="sticky-note note-yellow" style={{ transform: "rotate(-2deg)" }}>
                  <div className="sticky-tape" />
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: "#38bdf8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                  >
                    🏛️
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal" }}>
                    Big Institutional guys delay payments (60+ days)! My cash flow is dead.
                  </div>
                </div>

                {/* Note 2: Forced into 36% debt trap */}
                <div className="sticky-note note-pink" style={{ transform: "rotate(1.5deg)" }}>
                  <div className="sticky-tape" />
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: 8,
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      background: "#ef4444",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    }}
                  >
                    !
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal" }}>
                    Forced into 36% p.a. debt trap! This loan-shark debt is killer.
                  </div>
                </div>
              </div>

              {/* Row 2: Note 3 (Peach) & Note 4 (Yellow) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 14 }}>
                {/* Note 3: Working capital evaporates */}
                <div className="sticky-note note-peach" style={{ transform: "rotate(0deg)" }}>
                  <div className="sticky-tape" />
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      left: 8,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                    }}
                  >
                    ⚙️
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal", paddingTop: 4 }}>
                    Working capital... just evaporates.
                  </div>
                </div>

                {/* Note 4: Suppliers and rent */}
                <div className="sticky-note note-yellow" style={{ transform: "rotate(-1deg)" }}>
                  <div className="sticky-tape" />
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: 8,
                      width: 24,
                      height: 24,
                      borderRadius: 4,
                      background: "#fef08a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                    }}
                  >
                    👥
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal" }}>
                    Suppliers and rent won't wait.
                  </div>
                </div>
              </div>

              {/* Row 3: Note 5 (Mint) & Note 6 (Pink) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
                {/* Note 5: Suppliers and zero predictability */}
                <div className="sticky-note note-mint" style={{ transform: "rotate(1deg)" }}>
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, left: 8, fontSize: 15 }}>
                    📈
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 20px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal", paddingTop: 4 }}>
                    Suppliers and zero predictability.
                  </div>
                </div>

                {/* Note 6: Banks demand high collateral */}
                <div className="sticky-note note-pink" style={{ transform: "rotate(-1.5deg)" }}>
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, left: 8, fontSize: 14 }}>
                    🏛️
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 20px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal", paddingTop: 4 }}>
                    Banks demand high property collateral.
                  </div>
                </div>
              </div>

              {/* Row 4: Note 7 (Pink), Note 8 (Peach), Note 9 (Yellow) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {/* Note 7: Unmonitored 45-day statutory payment delays */}
                <div
                  className="sticky-note note-pink sticky-note-sm"
                  style={{
                    transform: "rotate(1deg)",
                    padding: "12px 10px",
                  }}
                >
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -5, left: 6, fontSize: 13 }}>
                    ⏱️
                  </div>
                  <div style={{ fontSize: "clamp(16px, 1.2vw, 18.5px)", fontWeight: 650, lineHeight: 1.28, letterSpacing: "normal", paddingTop: 6 }}>
                    Unmonitored 45-day statutory payment delays.
                  </div>
                </div>

                {/* Note 8: Black-box credit rejections */}
                <div
                  className="sticky-note note-peach sticky-note-sm"
                  style={{
                    transform: "rotate(-1deg)",
                    padding: "12px 10px",
                  }}
                >
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -5, right: 6, fontSize: 13 }}>
                    ⚠️
                  </div>
                  <div style={{ fontSize: "clamp(16px, 1.2vw, 18.5px)", fontWeight: 650, lineHeight: 1.28, letterSpacing: "normal", paddingTop: 6 }}>
                    Black-box credit rejections.
                  </div>
                </div>

                {/* Note 9: Vendor GST filing mismatches */}
                <div
                  className="sticky-note note-yellow sticky-note-sm"
                  style={{
                    transform: "rotate(0.5deg)",
                    padding: "12px 10px",
                  }}
                >
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -5, left: 6, fontSize: 13 }}>
                    📋
                  </div>
                  <div style={{ fontSize: "clamp(16px, 1.2vw, 18.5px)", fontWeight: 650, lineHeight: 1.28, letterSpacing: "normal", paddingTop: 6 }}>
                    Vendor GST filing mismatches.
                  </div>
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                LEFT CONNECTOR: "Real Invoices" with Upward Curved Arrow
                Fixed & Stationary
                ------------------------------------------------------------- */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "0 4px",
                userSelect: "none",
              }}
            >
              {/* Upward curved arrow */}
              <svg width="28" height="42" viewBox="0 0 28 42" fill="none">
                <path
                  d="M 14 38 C 14 24, 18 10, 18 4 M 11 11 L 18 4 L 25 11"
                  stroke="#475569"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Real Invoices Text */}
              <div
                style={{
                  fontFamily: "var(--font-handwriting)",
                  fontSize: "clamp(19px, 1.5vw, 22px)",
                  fontWeight: 700,
                  color: "#1e293b",
                  textAlign: "center",
                  lineHeight: 1.15,
                  letterSpacing: "normal",
                  whiteSpace: "nowrap",
                }}
              >
                Real<br />Invoices
              </div>

              {/* Curved arrow pointing right/into viewport */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <path
                  d="M 6 8 C 14 20, 22 24, 28 24 M 22 18 L 28 24 L 22 30"
                  stroke="#475569"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* -------------------------------------------------------------
                CENTER COLUMN: THE VERTICAL SCROLLING INVOICE VIEWPORT
                Fixed Window, Scroll-Driven Upward Track Translation
                ------------------------------------------------------------- */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 412,
                maxWidth: "100%",
                position: "relative",
                zIndex: 10,
              }}
            >
              {/* Bezel Header */}
              <div
                style={{
                  background: "#0d1527",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #1e293b",
                  borderBottom: "none",
                  boxShadow: "0 -2px 10px rgba(0,0,0,0.06)",
                }}
              >
                {/* Left: Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#22c55e",
                      boxShadow: "0 0 8px #22c55e",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      color: "#22c55e",
                      textTransform: "uppercase",
                    }}
                  >
                    SCROLLING INVOICES
                  </span>
                </div>

                {/* Center: Counter */}
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: 0.5,
                  }}
                >
                  {displayCount}
                </div>

                {/* Right: Live Feed */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#38bdf8" }}>📊</span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.8,
                      color: "#38bdf8",
                    }}
                  >
                    LIVE FEED
                  </span>
                </div>
              </div>

              {/* Viewport (Clipping Window) */}
              <div
                className="invoice-viewport"
                style={{
                  height: 480,
                  overflow: "hidden",
                  position: "relative",
                  background: "#f8fafc",
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  border: "1px solid #cbd5e1",
                  borderTop: "none",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                }}
              >
                {/* Top fade gradient mask */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 24,
                    background: "linear-gradient(to bottom, rgba(248,250,252,0.95), transparent)",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                />

                {/* Bottom fade gradient mask */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 24,
                    background: "linear-gradient(to top, rgba(248,250,252,0.95), transparent)",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                />

                {/* Continuous Seamless Auto-Scrolling Invoice Track */}
                <div
                  className="invoice-track-autoscroll"
                  style={{
                    padding: "14px 16px",
                  }}
                >
                  {[...INVOICE_STACK, ...INVOICE_STACK].map((inv, idx) => (
                    <div
                      key={`${inv.id}-${idx}`}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "16px 18px",
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        lineHeight: 1.45,
                        color: "#0f172a",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        letterSpacing: "-0.01em",
                        transformOrigin: "center center",
                      }}
                    >
                        {/* Buyer */}
                        <div style={{ marginBottom: 8 }}>
                          <span style={{ color: "#64748b", fontSize: 9.5, letterSpacing: 0.5, display: "block" }}>
                            BUYER:
                          </span>
                          <strong style={{ fontSize: 13, color: "#0f172a", fontWeight: 700 }}>
                            {inv.buyer}
                          </strong>
                        </div>

                        {/* Inv No & Date */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11 }}>
                          <div>
                            <span style={{ color: "#64748b" }}>INV NO: </span>
                            <strong style={{ color: "#0f172a", fontVariantNumeric: "tabular-nums", fontWeight: 650 }}>{inv.invNo}</strong>
                          </div>
                          <div>
                            <span style={{ color: "#64748b" }}>DATE: </span>
                            <strong style={{ color: "#0f172a", fontVariantNumeric: "tabular-nums", fontWeight: 650 }}>{inv.date}</strong>
                          </div>
                        </div>

                        {/* Due (45-Day MSME) */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11, color: "#dc2626", fontWeight: 700 }}>
                          <span>DUE (45-DAY MSME) :</span>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>{inv.dueDate}</span>
                        </div>

                        {/* Dashed line */}
                        <div style={{ borderTop: "1px dashed #cbd5e1", margin: "6px 0 8px" }} />

                        {/* Item Table Header */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 85px", fontSize: 10, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>
                          <span>ITEM</span>
                          <span style={{ textAlign: "center" }}>QTY</span>
                          <span style={{ textAlign: "right" }}>AMOUNT</span>
                        </div>

                        {/* Item Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 50px 85px", fontSize: 11, fontWeight: 550, color: "#1e293b", marginBottom: 6 }}>
                          <span style={{ lineHeight: 1.25 }}>{inv.item}</span>
                          <span style={{ textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{inv.qty}</span>
                          <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 650 }}>{inv.amount}</span>
                        </div>

                        {/* Dashed line */}
                        <div style={{ borderTop: "1px dashed #cbd5e1", margin: "6px 0 6px" }} />

                        {/* Taxable Value */}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#64748b", marginBottom: 4 }}>
                          <span>TAXABLE VALUE:</span>
                          <span style={{ fontWeight: 650, color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{inv.taxableValue}</span>
                        </div>

                        {/* Total Invoice & Stamp */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0 6px" }}>
                          <div>
                            <span style={{ fontSize: 9.5, color: "#64748b", display: "block" }}>TOTAL INVOICE:</span>
                            <strong style={{ fontSize: 17, fontWeight: 750, color: "#0f172a", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
                              {inv.totalInvoice}
                            </strong>
                          </div>

                          {/* Red Stamp */}
                          <div
                            style={{
                              border: "1.5px dashed #dc2626",
                              borderRadius: 4,
                              padding: "3px 8px",
                              color: "#dc2626",
                              fontSize: 10,
                              fontWeight: 800,
                              letterSpacing: 0.8,
                              transform: "rotate(-2deg)",
                              background: "rgba(220, 38, 38, 0.04)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span>§ 43B(h) VERIFIED</span>
                          </div>
                        </div>

                        {/* Dashed line */}
                        <div style={{ borderTop: "1px dashed #cbd5e1", margin: "6px 0 6px" }} />

                        {/* Statutory Note */}
                        <div style={{ fontSize: 9, color: "#64748b", lineHeight: 1.3, marginBottom: 5 }}>
                          SECTION 43B(h) INCOME TAX ACT: Buyer tax deduction conditional on 45-day payment.
                        </div>

                        {/* Sync Match */}
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9.5, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>
                          <span>✓</span>
                          <span>NEXFIN TWIN SYNC: E-INVOICE IRN MATCHED</span>
                        </div>

                        {/* Barcode SVG */}
                        <svg width="100%" height="30" viewBox="0 0 265 34" style={{ display: "block", margin: "2px auto 0" }}>
                          <rect x="6" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="14" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="19" y="0" width="6" height="34" fill="#0f172a" />
                          <rect x="28" y="0" width="3" height="34" fill="#0f172a" />
                          <rect x="34" y="0" width="1.5" height="34" fill="#0f172a" />
                          <rect x="39" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="46" y="0" width="5" height="34" fill="#0f172a" />
                          <rect x="54" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="59" y="0" width="7" height="34" fill="#0f172a" />
                          <rect x="69" y="0" width="3" height="34" fill="#0f172a" />
                          <rect x="75" y="0" width="1.5" height="34" fill="#0f172a" />
                          <rect x="80" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="87" y="0" width="6" height="34" fill="#0f172a" />
                          <rect x="96" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="101" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="108" y="0" width="1.5" height="34" fill="#0f172a" />
                          <rect x="112" y="0" width="5" height="34" fill="#0f172a" />
                          <rect x="120" y="0" width="3" height="34" fill="#0f172a" />
                          <rect x="126" y="0" width="6" height="34" fill="#0f172a" />
                          <rect x="135" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="140" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="147" y="0" width="1.5" height="34" fill="#0f172a" />
                          <rect x="151" y="0" width="5" height="34" fill="#0f172a" />
                          <rect x="159" y="0" width="7" height="34" fill="#0f172a" />
                          <rect x="169" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="174" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="181" y="0" width="1.5" height="34" fill="#0f172a" />
                          <rect x="185" y="0" width="5" height="34" fill="#0f172a" />
                          <rect x="193" y="0" width="3" height="34" fill="#0f172a" />
                          <rect x="199" y="0" width="6" height="34" fill="#0f172a" />
                          <rect x="208" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="213" y="0" width="4" height="34" fill="#0f172a" />
                          <rect x="220" y="0" width="1.5" height="34" fill="#0f172a" />
                          <rect x="224" y="0" width="5" height="34" fill="#0f172a" />
                          <rect x="232" y="0" width="3" height="34" fill="#0f172a" />
                          <rect x="238" y="0" width="6" height="34" fill="#0f172a" />
                          <rect x="247" y="0" width="3" height="34" fill="#0f172a" />
                          <rect x="253" y="0" width="2" height="34" fill="#0f172a" />
                          <rect x="258" y="0" width="2" height="34" fill="#0f172a" />
                        </svg>
                      </div>
                  ))}
                </div>
              </div>
            </div>

            {/* -------------------------------------------------------------
                RIGHT CONNECTOR: "Auto Scrolling" with Downward Curved Arrow
                Fixed & Stationary
                ------------------------------------------------------------- */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "0 4px",
                userSelect: "none",
              }}
            >
              {/* Auto Scrolling Text */}
              <div
                style={{
                  fontFamily: "var(--font-handwriting)",
                  fontSize: "clamp(19px, 1.5vw, 22px)",
                  fontWeight: 700,
                  color: "#1e293b",
                  textAlign: "center",
                  lineHeight: 1.15,
                  letterSpacing: "normal",
                  whiteSpace: "nowrap",
                }}
              >
                Auto<br />Scrolling
              </div>

              {/* Downward curved arrow pointing down */}
              <svg width="32" height="44" viewBox="0 0 32 44" fill="none">
                <path
                  d="M 22 4 C 14 14, 10 24, 10 38 M 4 32 L 10 39 L 16 32"
                  stroke="#475569"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: 6 STICKY NOTES + WORKING CAPITAL OPTIONS CARD
                Fixed & Stationary
                ------------------------------------------------------------- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Row 1: Note 1 (Mint) & Note 2 (Yellow) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 14 }}>
                {/* Note 1: Ingest GST */}
                <div className="sticky-note note-mint" style={{ transform: "rotate(-1.5deg)" }}>
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, left: 8, fontSize: 14 }}>
                    🛡️
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal", paddingTop: 4 }}>
                    Seamlessly ingest consented GST e-invoices & bank streams.
                  </div>
                </div>

                {/* Note 2: Live cash flow digital twin */}
                <div className="sticky-note note-yellow" style={{ transform: "rotate(1deg)" }}>
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, right: 8, fontSize: 15 }}>
                    😊
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal" }}>
                    Finally, a live cash flow digital twin for my business!
                  </div>
                </div>
              </div>

              {/* Row 2: Note 3 (Sky Blue) & Note 4 (Mint) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 14 }}>
                {/* Note 3: Forecasts liquidity dips */}
                <div
                  className="sticky-note note-blue"
                  style={{
                    transform: "rotate(-1.5deg)",
                    background: "#ffffff",
                    border: "2px solid #38bdf8",
                  }}
                >
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, left: 8, fontSize: 14 }}>
                    📊
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, color: "#0369a1", lineHeight: 1.32, letterSpacing: "normal", paddingTop: 4 }}>
                    Forecasts liquidity dips 3 weeks ahead. Life saver.
                  </div>
                </div>

                {/* Note 4: Runs what-if delay shocks */}
                <div className="sticky-note note-mint" style={{ transform: "rotate(2deg)" }}>
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, right: 8, fontSize: 14 }}>
                    ⚡
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal" }}>
                    Runs what-if delay shocks automatically.
                  </div>
                </div>
              </div>

              {/* Row 3: Card: Transparent Working Capital Options */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "14px 16px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                  position: "relative",
                  transform: "rotate(-0.5deg)",
                }}
              >
                <div className="sticky-tape" />
                <h4
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 10px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Transparent Working Capital Options:
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div
                    style={{
                      border: "1.5px dashed #10b981",
                      borderRadius: 4,
                      padding: "6px 8px",
                      textAlign: "center",
                      background: "rgba(16,185,129,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: "#166534" }}>Non-Debt</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#059669", marginTop: 2 }}>0% APR</div>
                  </div>

                  <div
                    style={{
                      border: "1.5px dashed #3b82f6",
                      borderRadius: 4,
                      padding: "6px 8px",
                      textAlign: "center",
                      background: "rgba(59,130,246,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: "#1e40af" }}>TReDS 24H</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#2563eb", marginTop: 2 }}>8.1% p.a.</div>
                  </div>

                  <div
                    style={{
                      border: "1.5px dashed #94a3b8",
                      borderRadius: 4,
                      padding: "6px 8px",
                      textAlign: "center",
                      background: "rgba(148,163,184,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: "#475569" }}>Credit Line</div>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#334155", marginTop: 2 }}>11.5% p.a.</div>
                  </div>
                </div>
              </div>

              {/* Row 4: Note 5 (Mint) & Note 6 (Yellow) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 14 }}>
                {/* Note 5: Zero Hidden Costs */}
                <div className="sticky-note note-mint" style={{ transform: "rotate(-1.5deg)" }}>
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, left: 8, fontSize: 14 }}>
                    ✅
                  </div>
                  <div style={{ fontSize: "clamp(18px, 1.4vw, 21px)", fontWeight: 650, lineHeight: 1.32, letterSpacing: "normal", paddingTop: 4 }}>
                    Zero Hidden Costs. Clear upfront!
                  </div>
                </div>

                {/* Note 6: Explainable AI */}
                <div
                  className="sticky-note note-yellow sticky-note-sm"
                  style={{
                    transform: "rotate(1deg)",
                    padding: "14px 12px",
                  }}
                >
                  <div className="sticky-tape" />
                  <div style={{ position: "absolute", top: -6, left: 8, fontSize: 14 }}>
                    💬
                  </div>
                  <div style={{ position: "absolute", bottom: 6, right: 8, fontSize: 14 }}>
                    ✍️
                  </div>
                  <div style={{ fontSize: "clamp(16.5px, 1.25vw, 19px)", fontWeight: 650, lineHeight: 1.3, letterSpacing: "normal", paddingTop: 4 }}>
                    Explainable AI (Transparent Decisions). User Control: Inspect & Override Ledger Data.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


            {/* =================================================================
          4. MINIMALIST INTERACTIVE CASH SIMULATOR
          ================================================================= */}
      <section id="simulator" style={{ padding: "70px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-xl)",
            padding: "36px 32px",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--accent-blue)" }}>
              Interactive Sandbox
            </span>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "6px 0 0", color: "var(--text-primary)" }}>
              Test Your Cash Runway in Seconds
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", margin: "4px auto 0", maxWidth: 500 }}>
              Adjust monthly billing and collection delay to see working capital trapped in receivables.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, alignItems: "center" }}>
            {/* Sliders */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ padding: "14px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Monthly Revenue</span>
                  <strong style={{ color: "var(--accent-blue)" }}>₹{monthlyRev} Lakhs</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={monthlyRev}
                  onChange={(e) => setMonthlyRev(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-blue)" }}
                />
              </div>

              <div style={{ padding: "14px 16px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Customer Payment Delay</span>
                  <strong style={{ color: delayDays > 45 ? "var(--accent-rose)" : "var(--accent-amber)" }}>
                    {delayDays} Days
                  </strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="75"
                  value={delayDays}
                  onChange={(e) => setDelayDays(Number(e.target.value))}
                  style={{ width: "100%", accentColor: delayDays > 45 ? "var(--accent-rose)" : "var(--accent-amber)" }}
                />
              </div>
            </div>

            {/* Live Twin Impact Display */}
            <div
              style={{
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-medium)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Cash Trapped</span>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent-amber)", marginTop: 2 }}>
                    ₹{cashTrapped}L
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Estimated Runway</span>
                  <div style={{ fontSize: 26, fontWeight: 800, color: estimatedRunway > 40 ? "var(--accent-emerald)" : "var(--accent-rose)", marginTop: 2 }}>
                    {estimatedRunway} Days
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {delayDays > 45 ? (
                  <span style={{ color: "var(--accent-rose)", fontWeight: 600 }}>
                    ⚠️ Delayed beyond 45 days. Buyer violates Section 43B(h) and incurs 19.5% statutory compound interest!
                  </span>
                ) : (
                  <span>
                    ✅ Collections are within safe limits. TReDS discounting could unlock ₹{cashTrapped}L early for business expansion.
                  </span>
                )}
              </div>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/simulator")}
                style={{ width: "100%", justifyContent: "center", gap: 6 }}
              >
                <span>Launch Full 9-Aspect Scenario Planner</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. CORE MSME LIQUIDITY FEATURES
          ================================================================= */}
      <section id="features" style={{ padding: "60px 24px 70px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--accent-emerald)" }}>
            Autonomous MSME Liquidity
          </span>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, margin: "8px 0 0", color: "var(--text-primary)" }}>
            Engineered for Resilient MSME Growth
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14.5, maxWidth: 640, margin: "8px auto 0", lineHeight: 1.6 }}>
            From continuous balance simulations to statutory Section 43B(h) enforcement, FinTwin delivers end-to-end liquidity control.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {/* Card 1 */}
          <div className="glass-card graphical-card-interactive" style={{ padding: 26, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(59,130,246,0.1)", color: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Activity size={22} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              Digital Twin Simulation
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              A continuous, real-time mirror of your receivables, payables, and burn velocity that calculates daily balances and forecasts insolvency before it happens.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card graphical-card-interactive" style={{ padding: 26, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(139,92,246,0.1)", color: "var(--accent-purple, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              Universal Invoice Importer
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Import invoices in any format: CSV, Excel (.xlsx/.xls), JSON (GST e-invoices), PDF with AI OCR scanning, and plain text with automatic field mapping.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card graphical-card-interactive" style={{ padding: 26, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(16,185,129,0.1)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <TrendingUp size={22} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              90-Day Probabilistic Forecast
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              View best-case, expected, and worst-case cash runway boundaries with ML payment delay estimations and precise breach date warnings.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card graphical-card-interactive" style={{ padding: 26, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(245,158,11,0.1)", color: "var(--accent-amber)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Flame size={22} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              What-If Shock Simulator
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Stress test your liquidity against 25% revenue drops, key client defaults, raw material inflation, bank rate changes, or emergency capex expansions in seconds.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card graphical-card-interactive" style={{ padding: 26, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(239,68,68,0.1)", color: "var(--accent-rose)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              Section 43B(h) & MSME Armor
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Automatically tracks the 45-day statutory payment window. If enterprise buyers delay payment, generates official legal demand notices with 3x RBI compound penal interest.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card graphical-card-interactive" style={{ padding: 26, borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
            <div style={{ width: 42, height: 42, borderRadius: "12px", background: "rgba(6,182,212,0.1)", color: "var(--accent-cyan, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              Tally, Zoho, GSTN & RBI AA Sync
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Zero manual data entry. Connect SBI, HDFC, and ICICI bank accounts via Curve25519 encrypted AA consent, plus direct sync with TallyPrime, Zoho Books, and GSTN.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. ROI ESTIMATOR SECTION
          ================================================================= */}
      <section id="calculator" style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--accent-blue)" }}>
            Financial ROI Estimator
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, marginTop: 6, color: "var(--text-primary)" }}>
            How Much Working Capital Can FinTwin Unlock?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 540, margin: "8px auto 0" }}>
            Real measurable liquidity improvements reported by Indian MSME suppliers and manufacturing units.
          </p>
        </div>

        <div className="glass-card" style={{ padding: "36px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-medium)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, textAlign: "center" }}>
            <div style={{ padding: "24px 20px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>Average Overdraft Penalty Avoidance</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-emerald)", marginTop: 8 }}>₹1.85 Lakhs / yr</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>Saved via early shortfall warning alerts & automated sweep</div>
            </div>
            <div style={{ padding: "24px 20px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>DSO (Days Sales Outstanding) Reduction</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-blue)", marginTop: 8 }}>-16.4 Days</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>Faster collections using Section 43B(h) statutory notices</div>
            </div>
            <div style={{ padding: "24px 20px", background: "var(--bg-secondary)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontWeight: 600 }}>Cash Flow Visibility Horizon</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-indigo, #6366f1)", marginTop: 8 }}>90 Days</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>Probabilistic forward liquidity radar across all accounts</div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          7. TRANSPARENT PRICING PLANS
          ================================================================= */}
      <section id="pricing" style={{ padding: "60px 24px 80px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--accent-emerald)" }}>
            Transparent Pricing Plans
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, marginTop: 6, color: "var(--text-primary)" }}>
            Predictable, High-ROI Plans for Growing MSMEs
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 18 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: !annualBilling ? "var(--text-primary)" : "var(--text-muted)" }}>Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              style={{
                width: 46,
                height: 26,
                borderRadius: 13,
                background: annualBilling ? "var(--accent-blue)" : "var(--border-medium)",
                position: "relative",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              title="Toggle annual/monthly billing"
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: annualBilling ? 23 : 3,
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: annualBilling ? "var(--text-primary)" : "var(--text-muted)" }}>
              Annual <span style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="pricing-grid">
          {/* Starter */}
          <div className="pricing-card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Starter Twin</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, margin: "4px 0 18px" }}>
              For early-stage MSMEs needing cash visibility.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 20, color: "var(--text-primary)" }}>
              ₹{annualBilling ? "1,999" : "2,499"}
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}> / mo</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> 30-Day Cash Flow Forecasting
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Up to 100 Monthly Invoices
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Basic What-If Simulator
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> CSV, Excel & PDF Import
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> RBI Account Aggregator (1 Bank)
              </li>
            </ul>
            <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}>
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
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Growth Twin Pro</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, margin: "4px 0 18px" }}>
              For growing manufacturers, traders & service MSMEs.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-blue)", marginBottom: 20 }}>
              ₹{annualBilling ? "4,799" : "5,999"}
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}> / mo</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-primary)", flex: 1 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> 90-Day AI Probabilistic Runway
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> ML Payment Delay Prediction
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Full Shock Simulator & Capex Testing
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Multi-Format Invoices (Excel, PDF, CSV)
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Section 43B(h) Legal Demand Generator
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> FinTwin AI Copilot Assistant
              </li>
            </ul>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}>
              Launch Pro Twin
            </button>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Enterprise MSME</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 12.5, margin: "4px 0 18px" }}>
              Multi-entity corporations & supply chain networks.
            </p>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 20, color: "var(--text-primary)" }}>
              ₹{annualBilling ? "9,999" : "12,499"}
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}> / mo</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 30px 0", display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "var(--text-secondary)", flex: 1 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Unlimited Entities & Invoices
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Automated TReDS Factoring API
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Custom ERP & Tally / Zoho Direct Sync
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Multi-Bank Curve25519 Consent Feeds
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: "var(--accent-emerald)", flexShrink: 0 }} /> Dedicated Fractional CFO Advisory
              </li>
            </ul>
            <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================
          8. MINIMALIST FAQ ACCORDION
          ================================================================= */}
      <section id="faq" style={{ padding: "40px 24px 70px", maxWidth: 840, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 13.5, marginTop: 6 }}>
            Everything you need to know about FinTwin and financial digital twins.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: "0 20px 16px", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================
          9. BOTTOM CALL TO ACTION
          ================================================================= */}
      <section style={{ padding: "70px 24px 80px", textAlign: "center", background: "rgba(255, 255, 255, 0.55)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 12px" }}>
            Ready to Protect Your Working Capital?
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 auto 28px", lineHeight: 1.6 }}>
            Join forward-thinking Indian MSMEs using FinTwin to prevent cash deficits and enforce statutory payment rights.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ gap: 8, padding: "12px 28px" }}>
              <Sparkles size={16} />
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =================================================================
          10. MINIMALIST CLEAN FOOTER
          ================================================================= */}
      <footer style={{ padding: "32px 28px", borderTop: "1px solid var(--border-subtle)", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontSize: 12, color: "var(--text-muted)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/fintwin_logo.jpg"
            alt="FinTwin"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              objectFit: "contain",
              border: "1px solid var(--border-subtle)",
            }}
          />
          <span style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)" }}>FinTwin</span>
          <span style={{ color: "var(--text-dim)", marginLeft: 6 }}>
            © 2026 FinTwin Technologies. Built for Indian MSMEs & Enterprise Suppliers.
          </span>
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <span>ReBIT 1.1.2 Certified</span>
          <span>•</span>
          <span>Section 43B(h) Compliant</span>
          <span>•</span>
          <span>Curve25519 Encrypted</span>
          <span>•</span>
          <span>ISO 27001 Certified</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
