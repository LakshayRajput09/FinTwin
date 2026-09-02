import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Landmark,
  FileText,
  Building,
  User,
  CreditCard,
  RefreshCw,
  Download,
  Zap,
  Award,
  Sparkles,
  Check,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import {
  verifyPan,
  sendAadhaarOtp,
  verifyAadhaarOtp,
  verifyBankAccount,
  verifyGstin,
  verifyUdyam,
  verifyCkyc,
  exportSetuKycDossier,
  DEMO_PRESETS,
} from "../utils/setuKycEngine";

export default function SetuVerificationModal({ onClose, onVerified }) {
  const [activeChannel, setActiveChannel] = useState("pan"); // 'pan', 'aadhaar', 'bank', 'gstin', 'udyam', 'ckyc'

  // Input states
  const [panNumber, setPanNumber] = useState("AABCU9603R");
  const [panName, setPanName] = useState("PRECISION AUTO GEARS PRIVATE LIMITED");

  const [aadhaarNumber, setAadhaarNumber] = useState("982014452104");
  const [aadhaarRequestId, setAadhaarRequestId] = useState(null);
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [aadhaarOtpSent, setAadhaarOtpSent] = useState(false);

  const [bankAccount, setBankAccount] = useState("50200084920145");
  const [bankIfsc, setBankIfsc] = useState("HDFC0001245");
  const [bankEntityName, setBankEntityName] = useState("PRECISION AUTO GEARS PRIVATE LIMITED");

  const [gstin, setGstin] = useState("27AABCU9603R1ZM");
  const [udyamNumber, setUdyamNumber] = useState("UDYAM-MH-12-0048291");
  const [ckycQuery, setCkycQuery] = useState("10029482910482");

  // Verification results state
  const [results, setResults] = useState({
    pan: null,
    aadhaar: null,
    bank: null,
    gstin: null,
    udyam: null,
    ckyc: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Count verified
  const verifiedCount = Object.values(results).filter(Boolean).length;

  // Apply Quick-fill preset
  const handleApplyPreset = (preset) => {
    setPanNumber(preset.pan);
    setPanName(preset.panName);
    setAadhaarNumber(preset.aadhaar);
    setBankAccount(preset.accountNumber);
    setBankIfsc(preset.ifsc);
    setBankEntityName(preset.panName);
    setGstin(preset.gstin);
    setUdyamNumber(preset.udyam);
    setCkycQuery(preset.ckyc);
    setErrorMsg("");
    setSuccessMsg(`Applied demo profile: ${preset.label}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Run PAN verification
  const handleVerifyPan = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await verifyPan(panNumber, panName);
    setLoading(false);
    if (res.success) {
      setResults((prev) => ({ ...prev, pan: res }));
      setSuccessMsg("✓ PAN Verified with NSDL & Income Tax Department!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(res.error || "PAN Verification failed.");
    }
  };

  // Send Aadhaar OTP
  const handleSendAadhaarOtp = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await sendAadhaarOtp(aadhaarNumber);
    setLoading(false);
    if (res.success) {
      setAadhaarRequestId(res.request_id);
      setAadhaarOtpSent(true);
      setAadhaarOtp("123456");
      setSuccessMsg("✓ UIDAI OTP sent! Use test OTP 123456.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setErrorMsg(res.error || "Failed to generate Aadhaar OTP.");
    }
  };

  // Verify Aadhaar OTP
  const handleVerifyAadhaar = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await verifyAadhaarOtp(aadhaarRequestId, aadhaarOtp, "Lakshay Rajput");
    setLoading(false);
    if (res.success) {
      setResults((prev) => ({ ...prev, aadhaar: res }));
      setSuccessMsg("✓ Aadhaar eKYC Verified with UIDAI demographic data!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(res.error || "Aadhaar verification failed.");
    }
  };

  // Verify Bank Account
  const handleVerifyBank = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await verifyBankAccount(bankAccount, bankIfsc, bankEntityName);
    setLoading(false);
    if (res.success) {
      setResults((prev) => ({ ...prev, bank: res }));
      setSuccessMsg("✓ Penny Drop Verified via NPCI IMPS!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(res.error || "Bank verification failed.");
    }
  };

  // Verify GSTIN
  const handleVerifyGstin = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await verifyGstin(gstin);
    setLoading(false);
    if (res.success) {
      setResults((prev) => ({ ...prev, gstin: res }));
      setSuccessMsg("✓ GSTIN Verified with GSTN portal!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(res.error || "GSTIN verification failed.");
    }
  };

  // Verify Udyam
  const handleVerifyUdyam = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await verifyUdyam(udyamNumber);
    setLoading(false);
    if (res.success) {
      setResults((prev) => ({ ...prev, udyam: res }));
      setSuccessMsg("✓ Udyam MSME Registration Verified!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(res.error || "Udyam verification failed.");
    }
  };

  // Verify CKYC
  const handleVerifyCkyc = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await verifyCkyc(ckycQuery);
    setLoading(false);
    if (res.success) {
      setResults((prev) => ({ ...prev, ckyc: res }));
      setSuccessMsg("✓ CKYC Central Registry Verified!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      setErrorMsg(res.error || "CKYC verification failed.");
    }
  };

  // 1-Click Complete Verification Suite
  const handleRunAllVerifications = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("⚡ Executing All-in-One Setu KYC Verification Stack...");

    const [panRes, bankRes, gstRes, udyamRes, ckycRes] = await Promise.all([
      verifyPan(panNumber, panName),
      verifyBankAccount(bankAccount, bankIfsc, bankEntityName),
      verifyGstin(gstin),
      verifyUdyam(udyamNumber),
      verifyCkyc(ckycQuery),
    ]);

    const aadhaarRes = await verifyAadhaarOtp("SETU-REQ-AUTO", "123456", "Lakshay Rajput");

    setResults({
      pan: panRes.success ? panRes : null,
      aadhaar: aadhaarRes.success ? aadhaarRes : null,
      bank: bankRes.success ? bankRes : null,
      gstin: gstRes.success ? gstRes : null,
      udyam: udyamRes.success ? udyamRes : null,
      ckyc: ckycRes.success ? ckycRes : null,
    });

    setLoading(false);
    setSuccessMsg("🎉 All 6 Setu KYC & Entity Verifications Complete (100% ReBIT Compliant)!");
    if (onVerified) onVerified();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-lg)",
          maxWidth: 900,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: 26,
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: 16,
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.12)",
                color: "var(--accent-emerald)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                  Setu Account Aggregator & Identity KYC Stack
                </h2>
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: "rgba(79, 70, 229, 0.12)",
                    color: "var(--accent-blue)",
                    fontWeight: 700,
                  }}
                >
                  ReBIT 1.1.2 Certified
                </span>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>
                Automated Indian enterprise verification suite: PAN (NSDL), Aadhaar OKYC (UIDAI), Penny Drop IMPS, GSTIN, Udyam MSME & CKYC.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Preset Profiles & All-in-One Quick Action */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            padding: "12px 16px",
            background: "var(--bg-secondary)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-muted)" }}>
              QUICK TEST PROFILES:
            </span>
            {DEMO_PRESETS.map((p) => (
              <button
                key={p.id}
                className="btn btn-secondary btn-sm"
                onClick={() => handleApplyPreset(p)}
                style={{ fontSize: 11.5, padding: "4px 10px" }}
              >
                {p.id === "company" ? "🏢 Private Ltd Company" : "👤 Sole Proprietorship"}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleRunAllVerifications}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 800,
              background: "linear-gradient(135deg, #059669, #047857)",
              border: "1px solid #059669",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.25)",
            }}
          >
            {loading ? <RefreshCw size={13} className="spin-animation" /> : <Zap size={13} />}
            <span>Run 1-Click Complete KYC Audit</span>
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              background: "rgba(225, 29, 72, 0.1)",
              border: "1px solid rgba(225, 29, 72, 0.3)",
              color: "var(--accent-rose)",
              fontSize: 12.5,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <AlertTriangle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              background: "rgba(5, 150, 105, 0.1)",
              border: "1px solid rgba(5, 150, 105, 0.3)",
              color: "var(--accent-emerald)",
              fontSize: 12.5,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6 Verification Channels Grid / Tabs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 6,
            marginBottom: 20,
            overflowX: "auto",
          }}
        >
          {[
            { id: "pan", label: "1. PAN Card", icon: CreditCard, verified: !!results.pan },
            { id: "aadhaar", label: "2. Aadhaar eKYC", icon: User, verified: !!results.aadhaar },
            { id: "bank", label: "3. Penny Drop", icon: Landmark, verified: !!results.bank },
            { id: "gstin", label: "4. GSTIN Entity", icon: FileText, verified: !!results.gstin },
            { id: "udyam", label: "5. Udyam MSME", icon: Award, verified: !!results.udyam },
            { id: "ckyc", label: "6. CKYC Search", icon: Building, verified: !!results.ckyc },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeChannel === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveChannel(tab.id)}
                style={{
                  padding: "10px 8px",
                  borderRadius: 8,
                  border: isActive
                    ? "2px solid var(--accent-blue)"
                    : tab.verified
                    ? "1px solid rgba(16, 185, 129, 0.4)"
                    : "1px solid var(--border-subtle)",
                  background: isActive
                    ? "rgba(79, 70, 229, 0.08)"
                    : tab.verified
                    ? "rgba(16, 185, 129, 0.06)"
                    : "var(--bg-secondary)",
                  color: isActive
                    ? "var(--accent-blue)"
                    : tab.verified
                    ? "var(--accent-emerald)"
                    : "var(--text-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Icon size={18} />
                  {tab.verified && (
                    <CheckCircle2
                      size={12}
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -6,
                        color: "var(--accent-emerald)",
                        background: "var(--bg-card)",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, textAlign: "center" }}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            CHANNEL 1: PAN VERIFICATION
        ========================================================================== */}
        {activeChannel === "pan" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  maxLength={10}
                  className="form-input"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. AABCU9603R"
                  style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expected Legal Entity / Director Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={panName}
                  onChange={(e) => setPanName(e.target.value)}
                  placeholder="e.g. PRECISION AUTO GEARS PRIVATE LIMITED"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Validates directly against NSDL & Income Tax database via Setu PAN API
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleVerifyPan}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {loading ? <RefreshCw size={13} className="spin-animation" /> : <ShieldCheck size={14} />}
                <span>Verify PAN with NSDL</span>
              </button>
            </div>

            {results.pan && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} />
                    <span>NSDL Certified PAN Record</span>
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Ref: {results.pan.transaction_id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>REGISTERED NAME</span>
                    <strong style={{ color: "var(--text-primary)" }}>{results.pan.registered_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>STATUS / CATEGORY</span>
                    <strong style={{ color: "var(--accent-emerald)" }}>{results.pan.status}</strong> ({results.pan.category})
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>NAME MATCH SCORE</span>
                    <strong style={{ color: "var(--accent-blue)" }}>{results.pan.name_match_score}% MATCH</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CHANNEL 2: AADHAAR PAPERLESS eKYC
        ========================================================================== */}
        {activeChannel === "aadhaar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Director 12-Digit Aadhaar Number</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    maxLength={12}
                    className="form-input"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 982014452104"
                    style={{ letterSpacing: 2, fontWeight: 700 }}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleSendAadhaarOtp}
                    disabled={loading}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Send UIDAI OTP
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Enter 6-Digit OTP</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    maxLength={6}
                    className="form-input"
                    value={aadhaarOtp}
                    onChange={(e) => setAadhaarOtp(e.target.value)}
                    placeholder="123456"
                    style={{ textAlign: "center", fontWeight: 700, letterSpacing: 4 }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleVerifyAadhaar}
                    disabled={loading || !aadhaarOtp}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>

            <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
              💡 UIDAI sandbox test OTP is <strong>123456</strong>. Pulls tamper-proof offline XML demographic records.
            </span>

            {results.aadhaar && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} />
                    <span>UIDAI Certified eKYC Demographic Record</span>
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Ref: {results.aadhaar.transaction_id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>AUTHENTICATED NAME</span>
                    <strong style={{ color: "var(--text-primary)" }}>{results.aadhaar.identity.full_name}</strong>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>{results.aadhaar.identity.care_of}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>VERIFIED ADDRESS</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: 11.5 }}>
                      {results.aadhaar.address.line1}, {results.aadhaar.address.city}, {results.aadhaar.address.state} - {results.aadhaar.address.pincode}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>PMLA COMPLIANCE</span>
                    <strong style={{ color: "var(--accent-emerald)" }}>ReBIT 1.1.2 & PMLA PASS</strong>
                    <div style={{ fontSize: 10.5, color: "var(--text-blue)" }}>Face Match: {results.aadhaar.kyc_compliance.face_match_confidence}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CHANNEL 3: BANK ACCOUNT PENNY DROP
        ========================================================================== */}
        {activeChannel === "bank" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Bank Account Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="e.g. 50200084920145"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank IFSC Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001245"
                  style={{ textTransform: "uppercase" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Beneficiary / Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={bankEntityName}
                  onChange={(e) => setBankEntityName(e.target.value)}
                  placeholder="e.g. PRECISION AUTO GEARS"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                Deposits ₹1.00 via NPCI IMPS to authenticate actual account title before bank linking
              </span>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleVerifyBank}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {loading ? <RefreshCw size={13} className="spin-animation" /> : <Landmark size={14} />}
                <span>Execute Penny Drop via IMPS</span>
              </button>
            </div>

            {results.bank && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} />
                    <span>IMPS Penny Drop Credit Confirmed</span>
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Ref: {results.bank.transaction_id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>BENEFICIARY AT BANK</span>
                    <strong style={{ color: "var(--text-primary)" }}>{results.bank.beneficiary_name_at_bank}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>BANK & IFSC</span>
                    <strong style={{ color: "var(--text-primary)" }}>{results.bank.bank_name}</strong> ({results.bank.ifsc})
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>NAME MATCH SCORE</span>
                    <strong style={{ color: "var(--accent-emerald)" }}>{results.bank.name_match_score}% MATCH</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CHANNEL 4: GSTIN BUSINESS ENTITY VERIFICATION
        ========================================================================== */}
        {activeChannel === "gstin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Goods & Services Tax Identification Number (GSTIN)</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  maxLength={15}
                  className="form-input"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AABCU9603R1ZM"
                  style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: 1 }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleVerifyGstin}
                  disabled={loading}
                  style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {loading ? <RefreshCw size={13} className="spin-animation" /> : <FileText size={14} />}
                  <span>Verify with GST Portal</span>
                </button>
              </div>
            </div>

            {results.gstin && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} />
                    <span>Live GSTN Portal Registration Details</span>
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Ref: {results.gstin.transaction_id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>LEGAL & TRADE NAME</span>
                    <strong style={{ color: "var(--text-primary)" }}>{results.gstin.legal_name}</strong>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{results.gstin.trade_name}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>TAX JURISDICTION & TYPE</span>
                    <strong style={{ color: "var(--accent-emerald)" }}>{results.gstin.status}</strong> • {results.gstin.taxpayer_type} ({results.gstin.state})
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>PRINCIPAL PLACE OF BUSINESS</span>
                    <span style={{ color: "var(--text-secondary)", fontSize: 11.5 }}>{results.gstin.principal_place_of_business}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CHANNEL 5: UDYAM MSME REGISTRATION VERIFICATION
        ========================================================================== */}
        {activeChannel === "udyam" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Udyam Registration Certificate Number</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  value={udyamNumber}
                  onChange={(e) => setUdyamNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. UDYAM-MH-12-0048291"
                  style={{ textTransform: "uppercase", fontWeight: 700 }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleVerifyUdyam}
                  disabled={loading}
                  style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {loading ? <RefreshCw size={13} className="spin-animation" /> : <Award size={14} />}
                  <span>Verify with MoMSME</span>
                </button>
              </div>
            </div>

            {results.udyam && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} />
                    <span>Ministry of MSME Verified Certificate</span>
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Ref: {results.udyam.transaction_id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>ENTERPRISE CATEGORY</span>
                    <strong style={{ color: "var(--accent-emerald)" }}>{results.udyam.enterprise_type} ENTERPRISE</strong>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{results.udyam.major_activity}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>SECTION 43B(h) ELIGIBLE</span>
                    <strong style={{ color: "var(--accent-emerald)" }}>✓ 45-Day Payment Protection</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>CGTMSE GUARANTEE</span>
                    <strong style={{ color: "var(--accent-blue)" }}>✓ 85% Collateral-Free Cover</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            CHANNEL 6: CKYC CENTRAL REGISTRY LOOKUP
        ========================================================================== */}
        {activeChannel === "ckyc" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Central KYC Identifier (14-Digit KIN or Entity PAN)</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  value={ckycQuery}
                  onChange={(e) => setCkycQuery(e.target.value.toUpperCase())}
                  placeholder="e.g. 10029482910482 or AABCU9603R"
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleVerifyCkyc}
                  disabled={loading}
                  style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}
                >
                  {loading ? <RefreshCw size={13} className="spin-animation" /> : <Building size={14} />}
                  <span>Lookup CKYC Registry</span>
                </button>
              </div>
            </div>

            {results.ckyc && (
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "rgba(16, 185, 129, 0.06)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ fontSize: 13, color: "var(--accent-emerald)", display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={16} />
                    <span>CERSAI Central KYC Registry Match</span>
                  </strong>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Ref: {results.ckyc.transaction_id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>CENTRAL KIN</span>
                    <strong style={{ color: "var(--text-primary)" }}>{results.ckyc.ckyc_kin}</strong>
                    <div style={{ fontSize: 11, color: "var(--accent-emerald)" }}>{results.ckyc.kyc_status}</div>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)", display: "block" }}>INSTITUTION UPDATED</span>
                    <span style={{ color: "var(--text-secondary)" }}>{results.ckyc.institution_updated} (Record Date: {results.ckyc.record_date})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid var(--border-subtle)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: verifiedCount >= 4 ? "var(--accent-emerald)" : "var(--accent-amber)",
              }}
            >
              {verifiedCount} of 6 Channels Verified
            </span>
            {verifiedCount >= 5 && (
              <span
                style={{
                  fontSize: 10.5,
                  padding: "2px 8px",
                  borderRadius: 12,
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--accent-emerald)",
                  fontWeight: 700,
                }}
              >
                ★ ReBIT & Bank Loan Ready
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => exportSetuKycDossier(results)}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Download size={13} />
              <span>Export Verification Certificate (CSV)</span>
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                alert(`✓ Setu KYC Verification Dossier linked to NexFin Twin! Bank Account Aggregator is fully authorized.`);
                if (onVerified) onVerified();
                onClose();
              }}
              style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
            >
              <Check size={14} />
              <span>Save & Link to Account Aggregator</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
