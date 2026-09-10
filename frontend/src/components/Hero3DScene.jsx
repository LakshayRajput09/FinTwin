import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Zap, TrendingUp, BarChart3, Clock, ArrowRight } from "lucide-react";

export default function Hero3DScene() {
  const [rotation, setRotation] = useState({ x: 15, y: -15 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Base rotation is x: 15 (tilted back slightly), y: -15 (turned right)
      // Mouse movement adds/subtracts a bit of parallax
      const rotateX = 15 - (y / (rect.height / 2)) * 10;
      const rotateY = -15 + (x / (rect.width / 2)) * 15;

      setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
      // Smoothly return to default isometric tilt
      setRotation({ x: 15, y: -15 });
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
        maxWidth: 900,
        margin: "60px auto 40px",
        height: 380,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "1200px",
        overflow: "visible"
      }}
    >
      <div
        style={{
          position: "relative",
          width: 580,
          height: 340,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Shadow Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            borderRadius: 16,
            transform: "translateZ(-80px) translateY(30px) scale(0.95)",
            filter: "blur(20px)",
            opacity: 0.6
          }}
        />

        {/* Base App Layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--bg-card)",
            borderRadius: 16,
            border: "1px solid var(--border-medium)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 40px rgba(56, 189, 248, 0.15)",
            transform: "translateZ(0px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Mock Topbar */}
          <div style={{ height: 44, borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
              <div style={{ width: 60, height: 6, borderRadius: 3, background: "var(--border-strong)" }} />
              <div style={{ width: 40, height: 6, borderRadius: 3, background: "var(--border-strong)" }} />
            </div>
          </div>
          
          {/* Mock Layout */}
          <div style={{ display: "flex", flex: 1, padding: 16, gap: 16 }}>
            {/* Sidebar */}
            <div style={{ width: 120, display: "flex", flexDirection: "column", gap: 10 }}>
               <div style={{ height: 24, borderRadius: 6, background: "var(--accent-blue)", opacity: 0.2 }} />
               <div style={{ height: 24, borderRadius: 6, background: "var(--border-subtle)" }} />
               <div style={{ height: 24, borderRadius: 6, background: "var(--border-subtle)" }} />
               <div style={{ height: 24, borderRadius: 6, background: "var(--border-subtle)" }} />
            </div>
            {/* Main Area */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1, height: 80, borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }} />
                <div style={{ flex: 1, height: 80, borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }} />
                <div style={{ flex: 1, height: 80, borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }} />
              </div>
              <div style={{ flex: 1, borderRadius: 8, background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)", padding: 16, position: "relative" }}>
                {/* Fake Chart Lines */}
                <div style={{ width: "100%", height: 2, background: "var(--border-strong)", marginTop: 40, position: "relative" }}>
                   <div style={{ position: "absolute", top: -20, left: 20, width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)", boxShadow: "0 0 10px var(--accent-blue)" }} />
                   <div style={{ position: "absolute", top: -40, left: 100, width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)", boxShadow: "0 0 10px var(--accent-blue)" }} />
                   <div style={{ position: "absolute", top: -10, left: 180, width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)", boxShadow: "0 0 10px var(--accent-blue)" }} />
                   <div style={{ position: "absolute", top: -60, left: 260, width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)", boxShadow: "0 0 10px var(--accent-blue)" }} />
                   <svg style={{ position: "absolute", top: -60, left: -20, width: "120%", height: 60, overflow: "visible" }}>
                     <path d="M 0 60 L 40 40 L 120 20 L 200 50 L 280 0 L 350 0" fill="none" stroke="var(--accent-blue)" strokeWidth="3" />
                   </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating 3D Cards */}
        {/* Analytics Card */}
        <div
          style={{
            position: "absolute",
            top: 50,
            left: -50,
            width: 220,
            padding: 18,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: 14,
            transform: "translateZ(80px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1) inset"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(56, 189, 248, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
              <TrendingUp size={16} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-secondary)", letterSpacing: 0.5 }}>AI TWIN FORECAST</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>+32.5% Cash</div>
            </div>
          </div>
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
             <div style={{ width: "75%", height: "100%", background: "linear-gradient(90deg, #0284c7, #38bdf8)" }} />
          </div>
        </div>

        {/* Protection Card */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: -60,
            width: 240,
            padding: 16,
            background: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: 14,
            transform: "translateZ(110px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1) inset"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-secondary)", letterSpacing: 0.5 }}>SECTION 43B(H)</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>100% Protected</div>
            </div>
          </div>
        </div>

        {/* Floating Notification */}
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 20,
            padding: "8px 16px",
            background: "var(--accent-rose)",
            color: "#fff",
            borderRadius: 20,
            fontWeight: 800,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transform: "translateZ(140px)",
            boxShadow: "0 8px 25px rgba(225, 29, 72, 0.5)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}
        >
          <Zap size={14} fill="currentColor" />
          <span>TReDS Connected</span>
        </div>
        
        {/* Floating Mini Chart */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: 20,
            width: 140,
            padding: 12,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: 12,
            transform: "translateZ(90px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset"
          }}
        >
           <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, letterSpacing: 0.5 }}>RUNWAY</div>
           <div style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b" }}>90 Days</div>
        </div>
      </div>
    </div>
  );
}
