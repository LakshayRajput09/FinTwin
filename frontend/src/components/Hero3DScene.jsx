import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Zap, TrendingUp, BarChart3, Clock, ArrowRight, Layers, Lock, Sparkles } from "lucide-react";

export default function Hero3DScene() {
  const [rotation, setRotation] = useState({ x: 12, y: -12 });
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'integrations'
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      // Disable parallax on mobile/narrow screens for stable viewing
      if (window.innerWidth < 768) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Base rotation is x: 12 (tilted back slightly), y: -12 (turned right)
      // Gentle parallax response
      const rotateX = 12 - (y / (rect.height / 2)) * 8;
      const rotateY = -12 + (x / (rect.width / 2)) * 12;

      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      // Smoothly return to default isometric tilt
      setRotation({ x: 12, y: -12 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 960,
        margin: "48px auto 36px",
        minHeight: 440,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1400px",
        overflow: "visible",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(92vw, 760px)",
          height: 440,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Soft Ambient Shadow Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.35) 50%, transparent 80%)",
            borderRadius: 20,
            transform: "translateZ(-70px) translateY(36px) scale(0.96)",
            filter: "blur(28px)",
            opacity: 0.85,
            pointerEvents: "none",
          }}
        />

        {/* Base App Window Layer (Featuring our Real FinTwin Website Data Picture) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 18,
            border: "1px solid rgba(255, 255, 255, 0.9)",
            boxShadow:
              "0 24px 60px -12px rgba(15, 23, 42, 0.16), 0 8px 24px -4px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)",
            transform: "translateZ(0px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* macOS Style Glass Topbar with Interactive Tab Switching */}
          <div
            style={{
              height: 42,
              borderBottom: "1px solid rgba(0, 0, 0, 0.07)",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: 12,
              background: "rgba(248, 250, 252, 0.85)",
              backdropFilter: "blur(12px)",
              flexShrink: 0,
              zIndex: 3,
            }}
          >
            {/* Mac Traffic Lights */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56", boxShadow: "0 0 1px rgba(0,0,0,0.2)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", boxShadow: "0 0 1px rgba(0,0,0,0.2)" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f", boxShadow: "0 0 1px rgba(0,0,0,0.2)" }} />
            </div>

            {/* View Tabs */}
            <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                style={{
                  background: activeTab === "dashboard" ? "rgba(255, 255, 255, 0.95)" : "transparent",
                  border: activeTab === "dashboard" ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid transparent",
                  borderRadius: 6,
                  padding: "3px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: activeTab === "dashboard" ? "#0f172a" : "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: activeTab === "dashboard" ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <BarChart3 size={11} color={activeTab === "dashboard" ? "#059669" : "#64748b"} />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("integrations")}
                style={{
                  background: activeTab === "integrations" ? "rgba(255, 255, 255, 0.95)" : "transparent",
                  border: activeTab === "integrations" ? "1px solid rgba(0, 0, 0, 0.08)" : "1px solid transparent",
                  borderRadius: 6,
                  padding: "3px 9px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: activeTab === "integrations" ? "#0f172a" : "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: activeTab === "integrations" ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Layers size={11} color={activeTab === "integrations" ? "#2563eb" : "#64748b"} />
                <span>Integrations</span>
              </button>
            </div>

            {/* URL Bar */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 6,
                background: "rgba(0, 0, 0, 0.04)",
                fontSize: 10.5,
                color: "#475569",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              <Lock size={9.5} color="#10b981" />
              <span>app.fintwin.in/{activeTab}</span>
            </div>

            {/* Live Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: "#166534", background: "rgba(16, 185, 129, 0.12)", padding: "2px 7px", borderRadius: 10 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
              <span>LIVE TWIN</span>
            </div>
          </div>

          {/* Actual FinTwin Website Picture / Data Display Area */}
          <div
            style={{
              position: "relative",
              flex: 1,
              overflow: "hidden",
              background: "#f6f7f5",
            }}
          >
            <img
              src={activeTab === "dashboard" ? "/dashboard_preview.jpg" : "/integrations_preview.jpg"}
              alt={activeTab === "dashboard" ? "FinTwin Real-time Dashboard" : "FinTwin Banking Integrations"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top left",
                display: "block",
                transition: "opacity 0.25s ease",
              }}
            />

            {/* Subtle Glass Specular Reflection Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.06) 35%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* =================================================================
            FLOATING 3D LIQUID GLASS TELEMETRY CARDS (Hovering in Z-Space)
            Grounded in Real FinTwin Data from the Dashboard Screenshot:
            - Solvency Score: 85 (180 Days Buffer)
            - Receivables Pipeline: ₹179.74L (35 Invoices • 100% §43B(h) Protected)
            - 30-Day Projected Stand: ₹188.14L
            ================================================================= */}

        {/* 1. Health Score Card (Top-Left / translateZ: 85px) */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: -38,
            width: 220,
            padding: "14px 16px",
            background: "rgba(255, 255, 255, 0.86)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            borderRadius: 14,
            transform: "translateZ(85px)",
            boxShadow: "0 18px 40px -10px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#059669",
              }}
            >
              <TrendingUp size={18} />
            </div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 650, color: "#64748b", letterSpacing: 0.6, textTransform: "uppercase" }}>
                SOLVENCY HEALTH
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#0f172a", lineHeight: 1.1 }}>
                85<span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>/100</span>
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "#059669", display: "flex", alignItems: "center", gap: 4 }}>
            <span>180 Days Buffer • Excellent Solvency</span>
          </div>
          <div style={{ width: "100%", height: 4, background: "rgba(0, 0, 0, 0.06)", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
            <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, #10b981, #059669)" }} />
          </div>
        </div>

        {/* 2. Receivables & 43B(h) Card (Bottom-Right / translateZ: 105px) */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: -42,
            width: 240,
            padding: "14px 16px",
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            borderRadius: 14,
            transform: "translateZ(105px)",
            boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04)",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "rgba(59, 130, 246, 0.12)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563eb",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 9.5, fontWeight: 650, color: "#64748b", letterSpacing: 0.6, textTransform: "uppercase" }}>
                RECEIVABLES PIPELINE
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "#0f172a", lineHeight: 1.1 }}>
                ₹179.74L
              </div>
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: "#475569", lineHeight: 1.4 }}>
            <strong style={{ color: "#0f172a" }}>35 invoices</strong> • 100% §43B(h) Protected
          </div>
          <div style={{ fontSize: 9.5, color: "#059669", fontWeight: 700, marginTop: 3 }}>
            30d Projected: ₹188.14L ✓
          </div>
        </div>

        {/* 3. TReDS & CGTMSE Active Floating Tag (Top-Right / translateZ: 130px) */}
        <div
          style={{
            position: "absolute",
            top: -16,
            right: 18,
            padding: "7px 14px",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            color: "#0f172a",
            borderRadius: 24,
            fontWeight: 700,
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transform: "translateZ(130px)",
            boxShadow: "0 12px 28px -6px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.3)",
            pointerEvents: "none",
          }}
        >
          <Zap size={13} fill="#10b981" color="#10b981" />
          <span>TReDS & CGTMSE Live</span>
        </div>

        {/* 4. Statutory MSME Armor Badge (Bottom-Left / translateZ: 90px) */}
        <div
          style={{
            position: "absolute",
            bottom: -22,
            left: 28,
            padding: "8px 14px",
            background: "rgba(255, 255, 255, 0.90)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            borderRadius: 12,
            transform: "translateZ(90px)",
            boxShadow: "0 12px 30px -8px rgba(245, 158, 11, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 8px #f59e0b" }} />
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 650, color: "#92400e", letterSpacing: 0.5, textTransform: "uppercase" }}>
              MSME 45-DAY ARMOR
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              Zero Default Tolerance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
