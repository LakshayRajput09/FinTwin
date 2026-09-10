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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Hero3DScene from "../components/Hero3DScene";

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

// Thermal Printer Invoices
const THERMAL_INVOICES = [
  {
    buyer: "TATA MOTORS CV HUB",
    invNo: "09/26-27/0891",
    date: "28-AUG-2026",
    dueDate: "12-OCT-2026",
    item: "CNC Engine Bracket",
    qty: "450",
    itemAmount: "33,82,500",
    taxableValue: "+3,52,560.00",
    totalInvoice: "44,51,350.00",
    statutoryNotice: "MSMED ACT 2006 (SEC 06-15 NOTICE): Buyer required to clear payment within 45 days.",
    twinSyncStatus: "NEXFIN TWIN SYNC: VERIFIED & TReDS ELIGIBLE",
    feedPercent: "82% FEED",
  },
  {
    buyer: "LARSEN & TOUBRO LTD",
    invNo: "09/26-27/0942",
    date: "01-SEP-2026",
    dueDate: "15-OCT-2026",
    item: "High-Tensile Flange Assemblies",
    qty: "120",
    itemAmount: "18,40,000",
    taxableValue: "+3,31,200.00",
    totalInvoice: "21,71,200.00",
    statutoryNotice: "SECTION 43B(h) INCOME TAX ACT: Buyer tax deduction conditional on 45-day payment.",
    twinSyncStatus: "NEXFIN TWIN SYNC: E-INVOICE IRN MATCHED",
    feedPercent: "94% FEED",
  },
  {
    buyer: "BHARAT HEAVY ELECTRICALS",
    invNo: "09/26-27/0784",
    date: "24-AUG-2026",
    dueDate: "08-OCT-2026",
    item: "Precision Stamping Rotors",
    qty: "800",
    itemAmount: "29,60,000",
    taxableValue: "+5,32,800.00",
    totalInvoice: "34,92,800.00",
    statutoryNotice: "MSMED STATUTORY COMPLIANCE: Compound penal interest applicable at 19.5% p.a.",
    twinSyncStatus: "NEXFIN TWIN SYNC: DISCOUNTABLE ON TReDS",
    feedPercent: "76% FEED",
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

  // Thermal printer invoice index
  const [invIndex, setInvIndex] = useState(0);
  const activeInvoice = THERMAL_INVOICES[invIndex];

  // Auto rotate invoice receipt every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setInvIndex((prev) => (prev + 1) % THERMAL_INVOICES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Ref and scroll tracking for dynamic thermal receipt feed (continuous 1:1 scroll synchronization)
  // Ref and scroll tracking for dynamic thermal receipt feed (pure automatic scroll feed & auto-retract)
  const realitySectionRef = useRef(null);
  const [feedProgress, setFeedProgress] = useState(0); // 0 to 100%
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const lastTickRef = useRef(0);
  const rafRef = useRef(null);

  // Synthesized mechanical thermal printer stepper-motor tick sound (zero external assets)
  const playPrintTick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(95, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  };

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!realitySectionRef.current) return;
        const rect = realitySectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // 1. Auto-feed: as user scrolls down into the reality section
        const entryStart = windowHeight * 0.85; // starts opening when section enters bottom 85% of screen
        const entryDistance = windowHeight * 0.55; // takes ~450px of scroll to fully feed out
        const entryProgress = Math.min(100, Math.max(0, Math.round(((entryStart - rect.top) / entryDistance) * 100)));

        // 2. Auto-retract: as user scrolls past the section towards the bottom of the page
        const exitThreshold = windowHeight * 0.45; // starts retracting when section bottom reaches mid-screen
        const exitProgress = Math.min(100, Math.max(0, Math.round((rect.bottom / exitThreshold) * 100)));

        // Effective progress: feeds on scroll down into section, auto-retracts on scroll past
        const progress = Math.min(entryProgress, exitProgress);

        // Play stepper tick if progress changed by >= 4%
        if (Math.abs(progress - lastTickRef.current) >= 4 && progress > 0 && progress < 100) {
          playPrintTick();
          lastTickRef.current = progress;
        }

        setFeedProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [soundEnabled]);

  // Smooth scroll down to reality section
  const scrollToReality = () => {
    if (realitySectionRef.current) {
      realitySectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Calculated feed status (purely automatic scroll-driven)
  const effectiveProgress = feedProgress;
  const isPrinting = effectiveProgress > 0 && effectiveProgress < 95;
  const isComplete = effectiveProgress >= 95;
  const isClosed = effectiveProgress <= 5;

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
      a: "A Digital Twin is a real-time mathematical simulation of your business finances. By linking your bank accounts, invoices, and operating bills, NexFin projects your exact cash balance into the future, warning you about cash deficits weeks before they happen.",
    },
    {
      q: "How does the Section 43B(h) 45-Day Tracker help my business?",
      a: "Under Section 43B(h) of the Income Tax Act, buyers must pay registered MSMEs within 45 days. If delayed, buyers lose their tax deduction. NexFin tracks every invoice countdown and generates legally binding demand notices with statutory compound interest calculated at 3x the RBI Bank Rate.",
    },
    {
      q: "Is my bank statement data private and secure?",
      a: "Yes. NexFin integrates with the official RBI Account Aggregator network using ReBIT Curve25519 end-to-end cryptography. Data is encrypted between your bank and NexFin—neither the Account Aggregator nor any third party can see your statements.",
    },
    {
      q: "How does NexFin help me secure working capital loans?",
      a: "NexFin matches your financial health with government-backed credit schemes (such as CGTMSE 85% sovereign collateral-free guarantees, MUDRA loans, and PMEGP) and enables 1-click invoice discounting through TReDS platforms.",
    },
  ];

  return (
    <div style={{ background: "var(--bg-canvas)", color: "var(--text-primary)", minHeight: "100vh" }}>
      {/* =================================================================
          1. TOP NAVBAR (MATCHING REFERENCE EXACTLY)
          ================================================================= */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(12px)",
          background: "var(--bg-card-glass)",
          borderBottom: "1px solid var(--border-subtle)",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* Brand & MSME TWIN Badge */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          {/* Logo icon */}
          <div
            style={{
              width: 32,
              height: 32,
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
                width: 17,
                height: 17,
                border: "2px solid #38bdf8",
                borderRadius: 4,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 5, height: 5, background: "#10b981", borderRadius: "50%" }} />
            </div>
          </div>

          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -0.5 }}>
            NexFin
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
        <nav className="desktop-only" style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13, fontWeight: 600 }}>
          <a href="#reality" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Ground Reality</a>
          <a href="#features" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Features</a>
          <a href="#simulator" style={{ textDecoration: "none", color: "var(--text-secondary)" }}>Live Simulator</a>
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
      <section style={{ padding: "64px 24px 32px", maxWidth: 1080, margin: "0 auto", textAlign: "center" }}>
        {/* Compliance Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: "var(--radius-full)",
            background: "rgba(79,70,229,0.08)",
            border: "1px solid rgba(79,70,229,0.2)",
            marginBottom: 20,
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--accent-blue)",
          }}
        >
          <Sparkles size={14} />
          <span>RBI Account Aggregator & MSME Section 43B(h) Ready</span>
        </div>

        {/* Dynamic Rotating Headline */}
        <h1
          style={{
            fontSize: "clamp(32px, 5.2vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: -1,
            color: "var(--text-primary)",
            margin: "0 auto 16px",
            maxWidth: 880,
          }}
        >
          The Financial Digital Twin for{" "}
          <br />
          <span
            key={textIndex}
            className="sliding-text-anim"
            style={{
              color: "var(--accent-blue)",
              background: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-emerald) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {ROTATING_PHRASES[textIndex]}
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 17.5px)",
            color: "var(--text-secondary)",
            maxWidth: 640,
            margin: "0 auto 30px",
            lineHeight: 1.6,
          }}
        >
          Eliminate surprise cash deficits. NexFin continuously forecasts your bank balance, enforces 45-day MSME client payments, and unlocks non-dilutive working capital.
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
                className="btn btn-lg"
                style={{
                  gap: 8,
                  padding: "12px 24px",
                  fontSize: 14.5,
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  color: "#22c55e",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Zap size={16} style={{ color: "#22c55e" }} />
                <span>⚡ Cash Recovery Hub</span>
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
                className="btn btn-lg"
                style={{
                  gap: 8,
                  padding: "12px 24px",
                  fontSize: 14.5,
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(59, 130, 246, 0.15))",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  color: "#22c55e",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Zap size={16} style={{ color: "#22c55e" }} />
                <span>⚡ Cash Recovery Hub</span>
              </Link>
              <button
                type="button"
                onClick={scrollToReality}
                className="btn btn-secondary btn-lg"
                style={{ padding: "12px 22px", fontSize: 14.5, cursor: "pointer" }}
              >
                <span>View Ground Reality ↓</span>
              </button>
              <button
                type="button"
                onClick={triggerAutoPrintDemo}
                className="btn btn-secondary btn-lg"
                style={{
                  padding: "12px 20px",
                  fontSize: 14,
                  cursor: "pointer",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  background: "rgba(56, 189, 248, 0.06)",
                  color: "var(--text-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
                title="Scroll down and watch live thermal feed"
              >
                <span>🖨️ Scroll & Live Feed FX</span>
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
          3. SCROLL-DOWN SECTION: THE GROUND REALITY & PROBLEM STATEMENT
             (MATCHING USER'S SCREENSHOT PIXEL-FOR-PIXEL)
          ================================================================= */}
      <section
        id="reality"
        ref={realitySectionRef}
        style={{
          borderTop: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-primary)",
          backgroundImage: "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          padding: "48px 20px 60px",
          position: "relative",
          overflow: "visible",
          overflowX: "clip",
        }}
      >
        {/* Section Title with Red Pulsing Dot */}
        <div style={{ maxWidth: 1280, margin: "0 auto 24px", padding: "0 10px", display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: 14,
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

        {/* 3-Column Whiteboard Canvas */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr minmax(360px, 440px) 1fr",
            gap: 24,
            alignItems: "start",
            position: "relative",
          }}
        >
          {/* -------------------------------------------------------------
              LEFT COLUMN: THE GROUND REALITY & PAIN POINTS
              ------------------------------------------------------------- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
            {/* Row 1: Note 1 (Yellow) & Note 2 (Pink) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
              {/* Note 1: Big Institutional Guys */}
              <div
                className="sticky-note note-yellow"
                style={{
                  transform: "rotate(-3deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Avatar sticker */}
                <div
                  className="note-sticker"
                  style={{
                    position: "absolute",
                    top: -8,
                    right: 10,
                    width: 26,
                    height: 26,
                    borderRadius: 3,
                    background: "#3b82f6",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    transform: "rotate(4deg)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #f59e0b, #ef4444)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>
                    👨‍💼
                  </div>
                </div>

                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  Big Institutional guys delay payments (60+ days)! My cash flow is dead.
                </div>
              </div>

              {/* Note 2: Forced into 36% debt trap */}
              <div
                className="sticky-note note-pink"
                style={{
                  transform: "rotate(2deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Exclamation & Card Stickers */}
                <div style={{ position: "absolute", top: -8, left: -6, fontSize: 18, color: "#dc2626", fontWeight: 800 }}>
                  ❗
                </div>
                <div style={{ position: "absolute", bottom: -6, right: 10, fontSize: 16 }}>
                  💳
                </div>

                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>
                  Forced into 36% p.a. debt trap! This loan-shark debt is killer.
                </div>
              </div>
            </div>

            {/* Row 2: Note 3 (Peach) & Note 4 (Yellow) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 4 }}>
              {/* Note 3: Working capital evaporates */}
              <div
                className="sticky-note note-peach"
                style={{
                  transform: "rotate(-1.5deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Question mark sticker */}
                <div style={{ position: "absolute", top: 10, left: -18, fontSize: 24, color: "#94a3b8", fontWeight: 800 }}>
                  ?
                </div>

                <div style={{ fontSize: 17.5, fontWeight: 700, padding: "4px 2px" }}>
                  Working capital... just evaporates.
                </div>
              </div>

              {/* Note 4: Suppliers and rent won't wait */}
              <div
                className="sticky-note note-yellow"
                style={{
                  transform: "rotate(2deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Mini avatar sticker */}
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: 12,
                    width: 24,
                    height: 24,
                    borderRadius: 3,
                    background: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  🏭
                </div>

                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  Suppliers and rent won't wait.
                </div>
              </div>
            </div>

            {/* Row 3: Note 5 (Yellow) & Note 6 (Peach) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr", gap: 16, marginTop: 4 }}>
              {/* Note 5: Suppliers and zero predictability */}
              <div
                className="sticky-note note-yellow"
                style={{
                  transform: "rotate(-2deg)",
                }}
              >
                <div className="sticky-tape" />
                <div style={{ fontSize: 17.5, fontWeight: 700 }}>
                  Suppliers and zero predictability.
                </div>
              </div>

              {/* Note 6: Banks demand high collateral */}
              <div
                className="sticky-note note-peach"
                style={{
                  transform: "rotate(1.5deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Lock sticker */}
                <div style={{ position: "absolute", bottom: 10, right: 10, fontSize: 15 }}>
                  🔒
                </div>

                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  Banks demand high property collateral.
                </div>
              </div>
            </div>

            {/* Row 4: Bottom 3 Notes (Red, Pink, Peach) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 4 }}>
              {/* Note 7: Unmonitored 45-day statutory delays */}
              <div
                className="sticky-note note-pink"
                style={{
                  transform: "rotate(-2.5deg)",
                  padding: "14px 12px",
                }}
              >
                <div className="sticky-tape" />
                <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>
                  Unmonitored 45-day statutory payment delays.
                </div>
              </div>

              {/* Note 8: Black-box credit rejections */}
              <div
                className="sticky-note note-pink"
                style={{
                  transform: "rotate(1deg)",
                  padding: "14px 12px",
                }}
              >
                <div className="sticky-tape" />
                <div style={{ position: "absolute", top: 8, left: -14, fontSize: 20, color: "#ef4444", fontWeight: 800 }}>
                  !
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>
                  Black-box credit rejections.
                </div>
              </div>

              {/* Note 9: Vendor GST filing mismatches */}
              <div
                className="sticky-note note-peach"
                style={{
                  transform: "rotate(-1.5deg)",
                  padding: "14px 12px",
                }}
              >
                <div className="sticky-tape" />
                <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>
                  Vendor GST filing mismatches.
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------
              CENTER COLUMN: THE LIVE DYNAMIC THERMAL RECEIPT PRINTER FEED
              (Sticky in Center, Continuously Synchronized with Scroll)
              ------------------------------------------------------------- */}
          <div
            style={{
              position: "sticky",
              top: 85,
              alignSelf: "flex-start",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Thermal Printer Hardware Bezel with Stepper Motor Vibration FX */}
            <div className={`thermal-printer-bezel ${isPrinting ? "printer-vibrating" : ""}`}>
              {/* Bezel Status Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontFamily: "'Space Mono', monospace" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: isComplete ? "#10b981" : isPrinting ? "#38bdf8" : "#fbbf24" }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: isComplete ? "#10b981" : isPrinting ? "#38bdf8" : "#f59e0b",
                      boxShadow: isComplete ? "0 0 8px #10b981" : isPrinting ? "0 0 8px #38bdf8" : "none",
                      animation: isPrinting ? "twinPulse 1.2s infinite ease-out" : "none",
                    }}
                  />
                  <span style={{ letterSpacing: 1, fontWeight: 700 }}>
                    {isComplete ? "PRINT COMPLETE ✓" : isPrinting ? "PRINTING FEED..." : "FEED READY (SCROLL)"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: isComplete ? "#10b981" : "#94a3b8", fontWeight: 700 }}>
                    {effectiveProgress}% FEED
                  </span>
                  {/* Sound FX Toggle Button */}
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      try {
                        if (!audioCtxRef.current) {
                          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
                        }
                        audioCtxRef.current.resume();
                      } catch (e) {}
                    }}
                    style={{
                      background: soundEnabled ? "rgba(56, 189, 248, 0.22)" : "rgba(255,255,255,0.08)",
                      border: soundEnabled ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.18)",
                      color: soundEnabled ? "#38bdf8" : "#94a3b8",
                      fontSize: 9.5,
                      fontFamily: "'Space Mono', monospace",
                      padding: "2px 7px",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    title="Toggle mechanical thermal printer sound FX"
                  >
                    {soundEnabled ? "🔊 Sound ON" : "🔇 Sound"}
                  </button>
                  {/* Automatic Scroll Indicator Badge */}
                  <span
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#94a3b8",
                      fontSize: 9,
                      fontFamily: "'Space Mono', monospace",
                      padding: "2px 7px",
                      borderRadius: 4,
                      letterSpacing: 0.5,
                    }}
                  >
                    AUTO-SCROLL
                  </span>
                </div>
              </div>

              {/* Narrow Slit where paper emerges with Glowing Thermal Laser Head */}
              <div className="thermal-slit">
                {isPrinting && <div className="thermal-laser-active" />}
              </div>
            </div>

            {/* Scroll-Driven Dynamic Paper Feed Container (Auto-feeds on enter, auto-retracts on scroll past) */}
            <div
              style={{
                width: "100%",
                maxWidth: 416,
                maxHeight: isClosed ? "0px" : `${Math.max(10, (effectiveProgress / 100) * 620)}px`,
                opacity: effectiveProgress > 1 ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.12s ease-out, opacity 0.14s ease",
                transformOrigin: "top center",
                willChange: "max-height, opacity",
              }}
            >
              {/* Continuous Thermal Paper */}
              <div className="thermal-receipt-paper" style={{ width: "100%" }}>
              {/* Header: Buyer & Date */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <span style={{ color: "#64748b", fontSize: 10, display: "block" }}>BUYER:</span>
                  <strong style={{ fontSize: 12, color: "#0f172a" }}>{activeInvoice.buyer}</strong>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 11 }}>
                <div>
                  <span style={{ color: "#64748b" }}>INV NO: </span>
                  <strong style={{ color: "#0f172a" }}>{activeInvoice.invNo}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b" }}>DATE: </span>
                  <strong style={{ color: "#0f172a" }}>{activeInvoice.date}</strong>
                </div>
              </div>

              {/* Red 45-Day Statutory Due Date Banner */}
              <div
                style={{
                  color: "#dc2626",
                  fontWeight: 700,
                  fontSize: 11.5,
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px dashed #cbd5e1",
                  paddingBottom: 10,
                  marginBottom: 12,
                }}
              >
                <span>DUE (45-DAY MSME):</span>
                <span>{activeInvoice.dueDate}</span>
              </div>

              {/* Item Table */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr", color: "#64748b", fontSize: 10.5, fontWeight: 700, marginBottom: 6 }}>
                  <span>ITEM</span>
                  <span style={{ textAlign: "center" }}>QTY</span>
                  <span style={{ textAlign: "right" }}>AMOUNT</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr", fontSize: 11, color: "#0f172a", marginBottom: 10 }}>
                  <span>{activeInvoice.item}</span>
                  <span style={{ textAlign: "center" }}>{activeInvoice.qty}</span>
                  <span style={{ textAlign: "right", fontWeight: 700 }}>{activeInvoice.itemAmount}</span>
                </div>
              </div>

              <div style={{ borderBottom: "1px dashed #cbd5e1", margin: "10px 0" }} />

              {/* Totals Breakdown */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginBottom: 6 }}>
                <span>TAXABLE VALUE:</span>
                <span>{activeInvoice.taxableValue}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 14px" }}>
                <div>
                  <span style={{ fontSize: 10, color: "#64748b", display: "block" }}>TOTAL INVOICE:</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{activeInvoice.totalInvoice}</span>
                </div>
                <div className="statutory-stamp">
                  🏛️ § 43B(h) VERIFIED
                </div>
              </div>

              <div style={{ borderBottom: "1px dashed #cbd5e1", margin: "10px 0" }} />

              {/* MSMED Notice */}
              <p style={{ fontSize: 9.5, color: "#64748b", margin: "10px 0 14px", lineHeight: 1.4 }}>
                {activeInvoice.statutoryNotice}
              </p>

              {/* NexFin Twin Sync Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 11, fontWeight: 700, margin: "12px 0 16px" }}>
                <Check size={14} />
                <span>{activeInvoice.twinSyncStatus}</span>
              </div>

              {/* Realistic Barcode SVG */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <svg width="260" height="38" viewBox="0 0 260 38" fill="none">
                  <rect x="0" y="0" width="3" height="38" fill="#0f172a" />
                  <rect x="5" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="9" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="16" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="21" y="0" width="6" height="38" fill="#0f172a" />
                  <rect x="30" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="35" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="42" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="46" y="0" width="5" height="38" fill="#0f172a" />
                  <rect x="54" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="59" y="0" width="7" height="38" fill="#0f172a" />
                  <rect x="69" y="0" width="3" height="38" fill="#0f172a" />
                  <rect x="75" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="80" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="87" y="0" width="6" height="38" fill="#0f172a" />
                  <rect x="96" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="101" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="108" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="112" y="0" width="5" height="38" fill="#0f172a" />
                  <rect x="120" y="0" width="3" height="38" fill="#0f172a" />
                  <rect x="126" y="0" width="6" height="38" fill="#0f172a" />
                  <rect x="135" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="140" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="147" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="151" y="0" width="5" height="38" fill="#0f172a" />
                  <rect x="159" y="0" width="7" height="38" fill="#0f172a" />
                  <rect x="169" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="174" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="181" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="185" y="0" width="5" height="38" fill="#0f172a" />
                  <rect x="193" y="0" width="3" height="38" fill="#0f172a" />
                  <rect x="199" y="0" width="6" height="38" fill="#0f172a" />
                  <rect x="208" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="213" y="0" width="4" height="38" fill="#0f172a" />
                  <rect x="220" y="0" width="1.5" height="38" fill="#0f172a" />
                  <rect x="224" y="0" width="5" height="38" fill="#0f172a" />
                  <rect x="232" y="0" width="3" height="38" fill="#0f172a" />
                  <rect x="238" y="0" width="6" height="38" fill="#0f172a" />
                  <rect x="247" y="0" width="3" height="38" fill="#0f172a" />
                  <rect x="253" y="0" width="2" height="38" fill="#0f172a" />
                  <rect x="258" y="0" width="2" height="38" fill="#0f172a" />
                </svg>
              </div>

              {/* Interactive Switch Invoice Button */}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={() => setInvIndex((prev) => (prev + 1) % THERMAL_INVOICES.length)}
                  style={{
                    background: "transparent",
                    border: "1px dashed #94a3b8",
                    padding: "4px 12px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontFamily: "'Space Mono', monospace",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  ↻ Feed Next Invoice ({invIndex + 1}/{THERMAL_INVOICES.length})
                </button>
              </div>
            </div>
          </div>

          {/* Hint when paper is closed */}
          {isClosed && (
            <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-muted)", fontFamily: "'Space Mono', monospace" }}>
              ↓ Scroll into view to feed live invoice
            </div>
          )}
        </div>
          {/* Close center column */}

          {/* -------------------------------------------------------------
              RIGHT COLUMN: THE NEXFIN TWIN SOLUTIONS
              ------------------------------------------------------------- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
            {/* Row 1: Note 1 (Mint) & Note 2 (Yellow) */}
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
              {/* Note 1: Seamlessly ingest GST */}
              <div
                className="sticky-note note-mint"
                style={{
                  transform: "rotate(-1.5deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Chart sticker */}
                <div style={{ position: "absolute", top: -8, right: 10, fontSize: 16 }}>
                  📈
                </div>
                <div style={{ position: "absolute", bottom: -8, left: 10, fontSize: 15 }}>
                  👨‍💻
                </div>

                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  Seamlessly ingest consented GST e-invoices & bank streams.
                </div>
              </div>

              {/* Note 2: Finally a live cash flow twin */}
              <div
                className="sticky-note note-yellow"
                style={{
                  transform: "rotate(1deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Smiley sticker */}
                <div style={{ position: "absolute", top: 12, right: 10, fontSize: 16 }}>
                  😊
                </div>

                <div style={{ fontSize: 17.5, fontWeight: 700 }}>
                  Finally, a live cash flow digital twin for my business!
                </div>
              </div>
            </div>

            {/* Row 2: Note 3 (Sky Blue) & Note 4 (Mint) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 16, marginTop: 4 }}>
              {/* Note 3: Forecasts liquidity dips 3 weeks ahead */}
              <div
                className="sticky-note note-blue"
                style={{
                  transform: "rotate(-1.5deg)",
                  background: "#ffffff",
                  border: "2px solid #38bdf8",
                }}
              >
                <div className="sticky-tape" />
                {/* Green check sticker */}
                <div style={{ position: "absolute", top: 10, left: -22, fontSize: 20, color: "#10b981", fontWeight: 800 }}>
                  ✔
                </div>

                <div style={{ fontSize: 17.5, fontWeight: 700, color: "#0369a1" }}>
                  Forecasts liquidity dips 3 weeks ahead. Life saver.
                </div>
              </div>

              {/* Note 4: Runs what-if delay shocks automatically */}
              <div
                className="sticky-note note-mint"
                style={{
                  transform: "rotate(2deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Photo sticker */}
                <div style={{ position: "absolute", top: -8, right: 10, fontSize: 14 }}>
                  🖼️
                </div>

                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  Runs what-if delay shocks automatically.
                </div>
              </div>
            </div>

            {/* Row 3: Card 5 (Transparent Working Capital Options Card) */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "16px 18px",
                boxShadow: "2px 6px 16px rgba(0,0,0,0.06)",
                position: "relative",
                transform: "rotate(-0.5deg)",
                marginTop: 4,
              }}
            >
              <div className="sticky-tape" />
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 12px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Transparent Working Capital Options:
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div
                  style={{
                    border: "1.5px dashed #10b981",
                    borderRadius: 4,
                    padding: "8px 10px",
                    textAlign: "center",
                    background: "rgba(16,185,129,0.04)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#166534" }}>Non-Debt</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginTop: 2 }}>0% APR</div>
                </div>

                <div
                  style={{
                    border: "1.5px dashed #3b82f6",
                    borderRadius: 4,
                    padding: "8px 10px",
                    textAlign: "center",
                    background: "rgba(59,130,246,0.04)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#1e40af" }}>TReDS 24H</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb", marginTop: 2 }}>8.1% p.a.</div>
                </div>

                <div
                  style={{
                    border: "1.5px dashed #94a3b8",
                    borderRadius: 4,
                    padding: "8px 10px",
                    textAlign: "center",
                    background: "rgba(148,163,184,0.04)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>Credit Line</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#334155", marginTop: 2 }}>11.5% p.a.</div>
                </div>
              </div>
            </div>

            {/* Row 4: Note 6 (Mint) & Note 7 (Yellow Explainable AI) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16, marginTop: 4 }}>
              {/* Note 6: Zero hidden costs */}
              <div
                className="sticky-note note-mint"
                style={{
                  transform: "rotate(-1.5deg)",
                }}
              >
                <div className="sticky-tape" />
                {/* Lightning sticker */}
                <div style={{ position: "absolute", top: 12, right: -16, fontSize: 18, color: "#f59e0b" }}>
                  ⚡
                </div>

                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  Zero Hidden Costs. Clear upfront!
                </div>
              </div>

              {/* Note 7: Explainable AI & User Control */}
              <div
                className="sticky-note note-yellow"
                style={{
                  transform: "rotate(1deg)",
                  padding: "16px 14px",
                }}
              >
                <div className="sticky-tape" />
                {/* Smiley and pencil stickers */}
                <div style={{ position: "absolute", top: -8, left: 10, fontSize: 16 }}>
                  😊
                </div>
                <div style={{ position: "absolute", bottom: 6, right: 10, fontSize: 16 }}>
                  ✍️
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35 }}>
                  Explainable AI (Transparent Decisions). User Control: Inspect & Override Ledger Data.
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
          5. MINIMALIST 3 CORE PILLARS
          ================================================================= */}
      <section id="features" style={{ padding: "40px 24px 70px", maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: "var(--accent-emerald)" }}>
            Autonomous MSME Liquidity
          </span>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, margin: "6px 0 0", color: "var(--text-primary)" }}>
            Everything You Need to Protect Cash
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          <div className="glass-card graphical-card-interactive" style={{ padding: 24, borderRadius: "var(--radius-lg)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(79,70,229,0.1)", color: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Activity size={20} />
            </div>
            <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              90-Day Cash Flow Mirror
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Forecasts your bank balance daily based on customer payment habits, recurring expenses, and payroll. Get alerted to cash shortfalls weeks before they occur.
            </p>
          </div>

          <div className="glass-card graphical-card-interactive" style={{ padding: 24, borderRadius: "var(--radius-lg)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(5,150,105,0.1)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              Section 43B(h) & MSME Armor
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Automatically tracks the 45-day statutory payment window. If enterprise buyers delay payment, generates official legal demand notices with 3x RBI compound penal interest.
            </p>
          </div>

          <div className="glass-card graphical-card-interactive" style={{ padding: 24, borderRadius: "var(--radius-lg)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(245,158,11,0.1)", color: "var(--accent-amber)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Landmark size={20} />
            </div>
            <h3 style={{ fontSize: 16.5, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
              RBI Account Aggregator & Capital
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              Connect SBI, HDFC, and ICICI bank accounts with Curve25519 encrypted consent. Unlock collateral-free credit through CGTMSE and instant TReDS bill discounting.
            </p>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. MINIMALIST FAQ ACCORDION
          ================================================================= */}
      <section id="faq" style={{ padding: "40px 24px 70px", maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
            Frequently Asked Questions
          </h2>
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
          7. BOTTOM CALL TO ACTION
          ================================================================= */}
      <section style={{ padding: "70px 24px 80px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid var(--border-subtle)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800, color: "var(--text-primary)", margin: "0 0 12px" }}>
            Ready to Protect Your Working Capital?
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: "0 auto 28px", lineHeight: 1.6 }}>
            Join forward-thinking Indian MSMEs using NexFin to prevent cash deficits and enforce statutory payment rights.
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
          8. MINIMALIST CLEAN FOOTER
          ================================================================= */}
      <footer style={{ padding: "24px 28px", borderTop: "1px solid var(--border-subtle)", maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--text-muted)" }}>
        <div>
          © 2026 NexFin. Built for Indian MSMEs & Enterprise Suppliers.
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <span>ReBIT 1.1.2 Certified</span>
          <span>Section 43B(h) Compliant</span>
          <span>End-to-End Encrypted</span>
        </div>
      </footer>
    </div>
  );
}
