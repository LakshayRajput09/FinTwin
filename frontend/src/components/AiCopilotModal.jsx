import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Maximize2,
  Minimize2,
  Trash2,
  Copy,
  Check,
  Key,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Landmark,
  Sliders,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  Clock,
  RefreshCw,
} from "lucide-react";

import {
  getFinancialData,
  getBusiness,
  getInvoices,
  getVendors,
} from "../data/financialStore";
import {
  getCashFlowSummary,
  calculateShockSimulation,
} from "../engines/digitalTwin";
import { API_URL } from "../config";

// Categorized Prompt Library
const PROMPT_CATEGORIES = [
  { id: "all", label: "🔥 Popular" },
  { id: "cash", label: "💸 Cash Traps" },
  { id: "law", label: "⚖️ 43B(h) Law" },
  { id: "schemes", label: "🏛️ Govt Schemes" },
  { id: "stress", label: "🔮 Stress Tests" },
];

const SUGGESTED_PROMPTS = [
  {
    category: "cash",
    text: "What is our biggest cash trap this month?",
    icon: AlertTriangle,
  },
  {
    category: "stress",
    text: "What if our largest customer delays payment by 30 days?",
    icon: Sliders,
  },
  {
    category: "law",
    text: "Which buyers are violating Section 43B(h) 45-day payment rules?",
    icon: ShieldCheck,
  },
  {
    category: "cash",
    text: "Can we afford a ₹2.5L machine purchase next week?",
    icon: TrendingUp,
  },
  {
    category: "schemes",
    text: "Which government subsidy gives 35% capital support?",
    icon: Landmark,
  },
  {
    category: "cash",
    text: "How can we extend our runway past 90 days?",
    icon: Sparkles,
  },
];

export default function AiCopilotModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Mode & Display States
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  // Gemini API Key & Model Configuration
  const [geminiApiKey, setGeminiApiKey] = useState(
    () =>
      localStorage.getItem("nexfin_gemini_api_key") ||
      import.meta.env.VITE_GEMINI_API_KEY ||
      ""
  );
  const [tempApiKey, setTempApiKey] = useState("");
  const [keyStatus, setKeyStatus] = useState(null); // 'verifying', 'valid', 'error'
  const [keyMessage, setKeyMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3.6-flash");

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "assistant",
      text: "👋 Welcome! I am your **NexFin Copilot**, powered by live financial twin telemetry and Google Gemini.\n\nI continuously monitor your **₹12.40L cash buffer**, forecast 45-day **Section 43B(h)** customer payment limits, and detect cash deficits before they happen.\n\nWhat scenario would you like to explore today?",
      actions: [
        { type: "simulate", label: "Simulate 30d Payment Delay", params: { delayDays: 30 } },
        { type: "navigate", label: "Check 43B(h) Violations", path: "/vendors" },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastLatency, setLastLatency] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [noticeToast, setNoticeToast] = useState(null);

  // Speech-to-Text Voice Recognition
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Synchronize Live Business Context
  const summary = getCashFlowSummary();
  const biz = getBusiness();
  const invoices = getInvoices();
  const vendors = getVendors();

  // Calculate Section 43B(h) Trapped Capital
  const overdue43b = invoices
    .filter((inv) => inv.status !== "paid" && (inv.daysOverdue || 0) > 45)
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Verify and Save Gemini API Key
  const handleSaveApiKey = async () => {
    const key = tempApiKey.trim();
    if (!key) {
      setGeminiApiKey("");
      localStorage.removeItem("nexfin_gemini_api_key");
      setKeyStatus(null);
      setKeyMessage("Key cleared. Switched to offline Twin Engine.");
      return;
    }

    setKeyStatus("verifying");
    setKeyMessage("Verifying Gemini API Key with Google AI Studio...");

    try {
      // Test directly with Google Gemini REST endpoint
      const cleanKey = key.trim().replace(/\.+$/, "");
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${cleanKey}`;
      const res = await fetch(testUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Ping test" }] }],
          generationConfig: { maxOutputTokens: 5 },
        }),
      });

      if (res.ok) {
        setGeminiApiKey(cleanKey);
        localStorage.setItem("nexfin_gemini_api_key", cleanKey);
        setKeyStatus("valid");
        setKeyMessage("✅ Gemini API Key verified and active!");
        setTimeout(() => setShowSettings(false), 1200);
      } else {
        const errData = await res.json().catch(() => ({}));
        setKeyStatus("error");
        setKeyMessage(
          `Verification failed (${res.status}): ${
            errData?.error?.message || "Invalid API key or quota exceeded"
          }`
        );
      }
    } catch (err) {
      // If direct browser request was blocked by CORS, try backend verification
      try {
        const beRes = await fetch(`${API_URL}/api/ai/verify-key`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: key }),
        });
        const beData = await beRes.json();
        if (beData.valid) {
          setGeminiApiKey(key);
          localStorage.setItem("nexfin_gemini_api_key", key);
          setKeyStatus("valid");
          setKeyMessage("✅ Gemini API Key verified via backend!");
          setTimeout(() => setShowSettings(false), 1200);
        } else {
          setKeyStatus("error");
          setKeyMessage(`Verification error: ${beData.message}`);
        }
      } catch (beErr) {
        setKeyStatus("error");
        setKeyMessage("Could not verify key. Check network connection.");
      }
    }
  };

  // Execute Interactive Action
  const handleAction = (act) => {
    if (act.type === "config_key") {
      setShowSettings(true);
      setTempApiKey(geminiApiKey);
    } else if (act.type === "simulate") {
      onClose();
      navigate("/simulator", { state: act.params || {} });
    } else if (act.type === "navigate") {
      onClose();
      navigate(act.path || "/dashboard");
    } else if (act.type === "notice") {
      const noticeText = `FORMAL STATUTORY DEMAND NOTICE UNDER SECTION 43B(h) OF THE INCOME TAX ACT & MSMED ACT 2006\n\nDate: ${new Date().toLocaleDateString("en-IN")}\nTo: Finance Controller / Accounts Payable\nCustomer Account: ${act.customer || "Enterprise Buyer"}\n\nSubject: Outstanding Invoices Delayed Beyond 45 Days - Statutory Interest & Deduction Disallowance\n\nDear Sir/Madam,\n\nWe hereby notify you that outstanding invoices totaling ₹${(overdue43b || 420000).toLocaleString("en-IN")} remain unpaid beyond the statutory 45-day limit prescribed under Section 15 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006.\n\nIn accordance with Section 43B(h) of the Income Tax Act, 1961, failure to settle these amounts within the prescribed period will result in:\n1. Permanent disallowance of these expenses from your taxable income during tax audit.\n2. Mandatory liability to pay compound penal interest at 3x the RBI Bank Rate (~19.5% p.a.) compounded monthly.\n\nPlease remit the overdue payment immediately to avoid escalation to the MSME Samadhaan Facilitation Council.\n\nSincerely,\nAuthorized Signatory\n${biz?.name || "NexFin Enterprise Supplier"}`;

      navigator.clipboard.writeText(noticeText);
      setNoticeToast("📋 Statutory Section 43B(h) Notice copied to clipboard!");
      setTimeout(() => setNoticeToast(null), 3500);
    }
  };

  // Handle Query Submission
  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const startTime = performance.now();
    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Build Live Financial Twin Payload for Context Grounding
    const contextPayload = {
      business_name: biz?.name || "Precision Auto Gears Ltd",
      current_cash: summary?.currentCash || 1240000,
      runway_days: summary?.runwayDays || 38,
      receivables: summary?.receivables || 1850000,
      overdue_amount: summary?.overdueInvoices || 540000,
      overdue_count: summary?.overdueCount || 3,
      trapped_43b_amount: overdue43b || 420000,
      total_expenses: summary?.totalExpenses || 620000,
      top_debtors: invoices
        .filter((i) => i.status !== "paid")
        .slice(0, 5)
        .map((i) => ({
          name: i.customer,
          amount: i.amount,
          delay_days: i.daysOverdue || 12,
          status: i.status,
        })),
    };

    let replyText = "";
    let actionsList = [];
    let modelName = "NexFin Twin Engine";

    try {
      let geminiSuccess = false;

      // 1. DIRECT BROWSER GEMINI REST API (Unrestricted by local backend sandbox)
      if (geminiApiKey) {
        try {
          const systemInstruction = `You are NexFin Copilot, an elite CFO and financial intelligence advisor for Indian MSMEs.
Enterprise Name: ${biz?.name || "Precision Auto Gears Ltd"}
Liquid Bank Cash: ₹${((summary?.currentCash || 1240000) / 100000).toFixed(2)} Lakhs
Safe Runway: ${summary?.runwayDays || 38} Days
Monthly Burn Rate: ₹${((summary?.totalExpenses || 620000) / 100000).toFixed(2)} Lakhs
Total Receivables: ₹${((summary?.receivables || 1850000) / 100000).toFixed(2)} Lakhs
Section 43B(h) Trapped (>45d): ₹${((overdue43b || 420000) / 100000).toFixed(2)} Lakhs
Overdue Debtors Count: ${summary?.overdueCount || 3}

Guidelines:
- Provide sharp, mathematically accurate, and practical business advice tailored to Indian MSME financial realities (RBI norms, Section 43B(h), CGTMSE, TReDS, GST).
- Use clear bullet points and bold financial metrics in ₹ Lakhs or ₹ Crores.
- If relevant, recommend proactive actions (e.g. factoring on TReDS, issuing 43B(h) notices, requesting debt moratorium).`;

          const contents = [
            ...messages.slice(-4).map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.text }],
            })),
            { role: "user", parts: [{ text: query }] },
          ];

          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${geminiApiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemInstruction }],
                },
                contents,
                generationConfig: {
                  temperature: 0.4,
                  topP: 0.95,
                  maxOutputTokens: 1024,
                },
              }),
            }
          );

          if (directRes.ok) {
            const dData = await directRes.json();
            const rawText = dData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              replyText = rawText;
              modelName = `Google ${selectedModel} (Live API)`;
              geminiSuccess = true;
            }
          } else {
            const errData = await directRes.json().catch(() => ({}));
            const errMsg = errData?.error?.message || "Invalid API key or quota exceeded";
            console.warn("Direct Gemini API error:", directRes.status, errMsg);
            setNoticeToast(`⚠️ Gemini API: ${errMsg.slice(0, 50)}...`);
            setTimeout(() => setNoticeToast(null), 5000);
          }
        } catch (directErr) {
          console.warn("Direct Gemini request failed:", directErr);
        }
      }

      // 2. BACKEND AI PROXY (if direct Gemini wasn't used or failed)
      if (!geminiSuccess) {
        try {
          const backendRes = await fetch(`${API_URL}/api/ai/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: query,
              context: contextPayload,
              api_key: geminiApiKey || null,
              history: messages.slice(-4).map((m) => ({ role: m.role, text: m.text })),
              model: selectedModel,
            }),
          });
          if (backendRes.ok) {
            const data = await backendRes.json();
            if (data.answer) {
              replyText = data.answer;
              actionsList = data.suggested_actions || [];
              modelName = data.is_gemini ? data.model_used : "NexFin Twin Engine";
            }
          }
        } catch (beErr) {
          console.warn("Backend AI call failed:", beErr);
        }
      }

      // 3. ROBUST DIGITAL TWIN ANALYTICAL ENGINE FALLBACK
      if (!replyText) {
        const q = query.toLowerCase();
        if (
          q.includes("not responding") ||
          (q.includes("gemini") &&
            (q.includes("why") || q.includes("key") || q.includes("error") || q.includes("connect") || q.includes("work")))
        ) {
          replyText = `### 🔌 How to Activate Google Gemini AI in NexFin\n\nGoogle Gemini requires a free API key from Google AI Studio to generate live responses.\n\n**To connect Gemini in 30 seconds:**\n1. Get your free key from **[Google AI Studio ↗](https://aistudio.google.com/app/apikey)**.\n2. Click **'Configure Gemini Key'** below or the key icon (🔑) in the header.\n3. Paste your key (starts with \`AIzaSy...\`) and click **Verify & Save**.\n\n*Once connected, all answers will be generated live by Google Gemini 1.5 Flash grounded in your financial twin metrics!*`;
          actionsList = [
            { type: "config_key", label: "Configure Gemini Key 🔑" },
            { type: "navigate", label: "Inspect Financial Dashboard", path: "/dashboard" },
          ];
        } else if (q.includes("trap") || q.includes("vulnerability") || q.includes("delay")) {
          replyText = `Based on your digital twin simulation, your primary cash flow vulnerability is **₹${((overdue43b || 420000) / 100000).toFixed(2)} Lakhs** in Section 43B(h) overdue payments past the 45-day statutory window.\n\n• **Liquid Buffer**: ₹${((summary?.currentCash || 1240000) / 100000).toFixed(2)}L (${summary?.runwayDays || 38} days safe runway)\n• **Risk**: If customer payment delays slip by another 14 days, your liquid cash will dip below operational payroll reserves.\n\n**Recommended Actions**:`;
          actionsList = [
            { type: "notice", label: "Draft Section 43B(h) Notice", customer: "Auto Corp Ltd" },
            { type: "simulate", label: "Simulate 30d Delay Impact", params: { delayDays: 30 } },
            { type: "navigate", label: "Inspect Overdue Debtors", path: "/invoices" },
          ];
        } else if (q.includes("30 days") || q.includes("largest customer")) {
          const shock = calculateShockSimulation({ paymentDelayDays: 30 });
          replyText = `Simulating a 30-day payment delay from major customer accounts:\n\n• **Projected Cash**: drops to **₹${(shock.stressedCash / 100000).toFixed(2)}L** (deficit of ₹${Math.abs(shock.cashVariance / 100000).toFixed(2)}L)\n• **Runway**: contracts from **${shock.baselineRunway} days** to **${shock.stressedRunway} days** (Red Alert Zone).\n• **Statutory Recourse**: Demand 3x RBI bank rate compound penal interest (~19.5% p.a.).`;
          actionsList = [
            { type: "simulate", label: "Launch Scenario Planner", params: { delayDays: 30 } },
            { type: "navigate", label: "Discount on TReDS", path: "/financing" },
          ];
        } else if (q.includes("afford") || q.includes("machine") || q.includes("purchase")) {
          replyText = `Evaluating a ₹2.50L machinery purchase against current liquid buffer:\n\n• **Current Liquid Cash**: ₹${((summary?.currentCash || 1240000) / 100000).toFixed(2)}L\n• **Monthly Expense Burn**: ₹${((summary?.totalExpenses || 620000) / 100000).toFixed(2)}L\n\n**Verdict**: Full upfront cash purchase will compress runway below 25 days. We recommend applying for a **CGTMSE 8.5% term loan** or the **PMEGP 35% capital subsidy** to protect operating liquidity.`;
          actionsList = [
            { type: "navigate", label: "Explore CGTMSE & PMEGP", path: "/financing" },
            { type: "navigate", label: "Review Cash Outflows", path: "/cash-flow" },
          ];
        } else if (q.includes("runway") || q.includes("extend")) {
          replyText = `Here is your 3-step action roadmap to extend runway to **90+ Days**:\n\n1. **TReDS Invoice Discounting**: Unlock ₹5.00L liquidity within 24 hours against corporate invoices.\n2. **Section 43B(h) Demand Notice**: Enforce the statutory 45-day payment cutoff on enterprise buyers.\n3. **Early Settlement Rebate**: Offer 2% discount for payments cleared within 7 business days.`;
          actionsList = [
            { type: "navigate", label: "Open Financing Hub", path: "/financing" },
            { type: "simulate", label: "Simulate 90d Runway Plan", params: { delayDays: 0, revenueChange: 15 } },
          ];
        } else {
          replyText = `Analysis for **${biz?.name || "Your MSME"}**:\n• **Current Liquid Cash**: ₹${((summary?.currentCash || 1240000) / 100000).toFixed(2)}L\n• **Total Receivables**: ₹${((summary?.receivables || 1850000) / 100000).toFixed(2)}L\n• **Safe Runway**: **${summary?.runwayDays || 38} Days**\n• **Trapped 43B(h) Capital**: ₹${((overdue43b || 420000) / 100000).toFixed(2)}L\n\nAsk me any question about your cash flow, what-if stress testing, customer payment delays, or government funding schemes.\n\n*(To connect Google Gemini 1.5 Flash for live generative reasoning, enter your free API key via the key icon above.)*`;
          actionsList = [
            { type: "config_key", label: "Connect Gemini Key 🔑" },
            { type: "simulate", label: "Run Stress Scenario", params: { delayDays: 20 } },
            { type: "navigate", label: "View Banking Schemes", path: "/financing" },
          ];
        }
        modelName = "NexFin Twin Engine";
      }
    } catch (err) {
      console.error("AI Copilot submission error:", err);
      replyText = "An error occurred while analyzing financial data. Please try again.";
    }

    const elapsed = Math.round(performance.now() - startTime);
    setLastLatency(elapsed);

    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: replyText,
        actions: actionsList,
        model: modelName,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setIsTyping(false);
  };

  // Copy message text
  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render Formatted Message Text
  const renderMessageContent = (text) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} style={{ margin: "8px 0 4px", fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)" }}>
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        const bulletText = line.replace(/^[•-]\s*/, "");
        return (
          <div key={idx} style={{ display: "flex", gap: 6, margin: "3px 0", fontSize: 13, lineHeight: 1.55 }}>
            <span style={{ color: "var(--accent-blue)", fontWeight: 700 }}>•</span>
            <span>{parseInlineMarkdown(bulletText)}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} style={{ margin: "4px 0", fontSize: 13, lineHeight: 1.55 }}>
            {parseInlineMarkdown(line)}
          </div>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} style={{ height: 6 }} />;
      }
      return (
        <p key={idx} style={{ margin: "4px 0", fontSize: 13, lineHeight: 1.6, color: "var(--text-primary)" }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Simple Inline Markdown Parser (Bolds, Code)
  const parseInlineMarkdown = (content) => {
    const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "var(--text-primary)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} style={{ background: "var(--bg-tertiary)", padding: "1px 5px", borderRadius: 4, fontSize: 12, fontFamily: "var(--font-mono)" }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  if (!isOpen) return null;

  const filteredPrompts =
    activeCategory === "all"
      ? SUGGESTED_PROMPTS
      : SUGGESTED_PROMPTS.filter((p) => p.category === activeCategory);

  return (
    <>
      <div className="copilot-backdrop" onClick={onClose} />

      {/* Floating or Expanded Ask AI Drawer */}
      <div className={`ai-copilot-drawer ${isExpanded ? "expanded-canvas" : ""}`}>
        {/* Notice Success Toast */}
        {noticeToast && (
          <div className="copilot-toast-banner">
            <Check size={14} />
            <span>{noticeToast}</span>
          </div>
        )}

        {/* 1. Header Bar */}
        <div className="copilot-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="copilot-avatar-icon">
              <Sparkles size={16} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", letterSpacing: -0.3 }}>
                  NexFin AI Copilot
                </span>
                <span className="copilot-engine-pill" onClick={() => setShowSettings(!showSettings)} title="Click to configure Gemini API Key">
                  {geminiApiKey ? (
                    <>
                      <Sparkles size={11} style={{ color: "#8b5cf6" }} />
                      <span>Gemini 3.6 Flash</span>
                    </>
                  ) : (
                    <>
                      <Bot size={11} style={{ color: "var(--accent-emerald)" }} />
                      <span>Fast Twin Engine</span>
                    </>
                  )}
                </span>
              </div>
              <div style={{ fontSize: 10.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                <span>Autonomous MSME Financial Advisor</span>
                {lastLatency && (
                  <span style={{ color: "var(--accent-emerald)", fontWeight: 600 }}>• {lastLatency}ms</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Key Settings Toggle */}
            <button
              className={`copilot-action-btn ${showSettings ? "active" : ""}`}
              onClick={() => {
                setShowSettings(!showSettings);
                setTempApiKey(geminiApiKey);
              }}
              title="Configure Gemini API Key"
            >
              <Key size={15} />
            </button>

            {/* Clear Chat */}
            <button
              className="copilot-action-btn"
              onClick={() => {
                if (window.confirm("Clear consultation history?")) {
                  setMessages([
                    {
                      id: `m-${Date.now()}`,
                      role: "assistant",
                      text: "Consultation history cleared. How can I assist with your financial twin today?",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ]);
                }
              }}
              title="Clear Conversation"
            >
              <Trash2 size={15} />
            </button>

            {/* Expand / Minimize Toggle */}
            <button
              className="copilot-action-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse to Drawer" : "Expand to Full Modal"}
            >
              {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Close */}
            <button className="copilot-action-btn" onClick={onClose} title="Close AI Copilot">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. Gemini API Key Settings Panel (Collapsible) */}
        {showSettings && (
          <div className="copilot-settings-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                <Key size={13} style={{ color: "var(--accent-purple)" }} />
                <span>Google Gemini API Configuration</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 11, color: "var(--accent-blue)", display: "flex", alignItems: "center", gap: 3, textDecoration: "none", fontWeight: 600 }}
              >
                <span>Get Free Key</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input
                type="password"
                className="form-input"
                style={{ height: 34, fontSize: 12 }}
                placeholder="Paste Gemini API Key (AIzaSy...)"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <button
                className="btn btn-primary"
                style={{ height: 34, padding: "0 12px", fontSize: 12, whiteSpace: "nowrap" }}
                onClick={handleSaveApiKey}
                disabled={keyStatus === "verifying"}
              >
                {keyStatus === "verifying" ? <RefreshCw size={12} className="spin-icon" /> : "Verify & Save"}
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600 }}>Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="form-select"
                  style={{ height: 26, fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-medium)" }}
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, Recommended)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                </select>
              </div>

              {keyMessage && (
                <div style={{ fontSize: 11, color: keyStatus === "valid" ? "var(--accent-emerald)" : keyStatus === "error" ? "var(--accent-rose)" : "var(--text-muted)", fontWeight: 600 }}>
                  {keyMessage}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gemini API Key Alert Banner if not configured */}
        {!geminiApiKey && (
          <div
            style={{
              padding: "8px 14px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08))",
              borderBottom: "1px solid rgba(139, 92, 246, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              fontSize: 11.5,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} style={{ color: "var(--accent-purple)", flexShrink: 0 }} />
              <span style={{ color: "var(--text-secondary)" }}>
                <strong>Activate Gemini AI:</strong> Connect your free Google AI Studio key to enable live generative responses.
              </span>
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ fontSize: 10.5, padding: "2px 10px", height: 24, whiteSpace: "nowrap" }}
              onClick={() => {
                setShowSettings(true);
                setTempApiKey(geminiApiKey);
              }}
            >
              <Key size={10} style={{ marginRight: 4 }} />
              Add Key
            </button>
          </div>
        )}

        {/* 3. Live Business Context Ribbon */}
        <div className="copilot-context-ribbon">
          <div className="context-chip">
            <span className="context-label">Twin</span>
            <span className="context-val">{biz?.name?.split(" ")[0] || "Active"}</span>
          </div>
          <div className="context-divider" />
          <div className="context-chip">
            <span className="context-label">Cash</span>
            <span className="context-val" style={{ color: "var(--accent-blue)" }}>
              ₹{((summary?.currentCash || 1240000) / 100000).toFixed(2)}L
            </span>
          </div>
          <div className="context-divider" />
          <div className="context-chip">
            <span className="context-label">Runway</span>
            <span className="context-val" style={{ color: (summary?.runwayDays || 38) > 35 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
              {summary?.runwayDays || 38} Days
            </span>
          </div>
          <div className="context-divider" />
          <div className="context-chip">
            <span className="context-label">43B(h) Trapped</span>
            <span className="context-val" style={{ color: "var(--accent-amber)" }}>
              ₹{((overdue43b || 420000) / 100000).toFixed(2)}L
            </span>
          </div>
        </div>

        {/* 4. Messages Feed */}
        <div className="copilot-messages">
          {messages.map((m) => (
            <div key={m.id} className={`copilot-msg-row ${m.role}`}>
              <div className="copilot-msg-bubble">
                {/* Message Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: m.role === "assistant" ? "var(--accent-purple)" : "var(--accent-blue)" }}>
                      {m.role === "assistant" ? (m.model ? `NexFin AI (${m.model.replace("Google ", "")})` : "NexFin AI") : "You"}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--text-dim)" }}>{m.timestamp}</span>
                  </div>

                  {m.role === "assistant" && (
                    <button
                      className="copilot-copy-btn"
                      onClick={() => copyMessage(m.id, m.text)}
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check size={12} style={{ color: "var(--accent-emerald)" }} /> : <Copy size={12} />}
                    </button>
                  )}
                </div>

                {/* Formatted Content */}
                <div className="copilot-msg-content">
                  {renderMessageContent(m.text)}
                </div>

                {/* Embedded Interactive Action Buttons */}
                {m.actions && m.actions.length > 0 && (
                  <div className="copilot-actions-bar">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        className="copilot-action-trigger"
                        onClick={() => handleAction(act)}
                      >
                        {act.type === "simulate" && <Sliders size={12} style={{ color: "var(--accent-blue)" }} />}
                        {act.type === "notice" && <FileText size={12} style={{ color: "var(--accent-amber)" }} />}
                        {act.type === "navigate" && <ExternalLink size={12} style={{ color: "var(--accent-emerald)" }} />}
                        <span>{act.label}</span>
                        <ChevronRight size={11} style={{ opacity: 0.6 }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="copilot-msg-row assistant">
              <div className="copilot-msg-bubble typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
                <span style={{ fontSize: 11.5, color: "var(--text-muted)", marginLeft: 6 }}>
                  {geminiApiKey ? "Gemini 1.5 Flash is analyzing your financial twin..." : "NexFin Twin Engine is computing calculations..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 5. Categorized One-Click Suggestion Chips */}
        <div className="copilot-prompts-section">
          {/* Category Tabs */}
          <div className="copilot-category-tabs">
            {PROMPT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-tab-btn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Prompt Chips */}
          <div className="copilot-prompt-chips">
            {filteredPrompts.map((p, idx) => {
              const Icon = p.icon;
              return (
                <button
                  key={idx}
                  className="quick-prompt-pill"
                  onClick={() => handleSend(p.text)}
                >
                  <Icon size={12} style={{ flexShrink: 0, color: "var(--accent-blue)" }} />
                  <span>{p.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Smart Input Bar */}
        <div className="copilot-input-container">
          {isListening && (
            <div className="voice-recording-banner">
              <span className="voice-pulse-circle" />
              <span>Listening... Speak your financial query</span>
            </div>
          )}

          <div className="copilot-input-wrapper">
            <textarea
              className="copilot-textarea"
              rows={1}
              placeholder={isListening ? "Listening..." : "Ask anything about cash flow, 43B(h), loans, runway..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* Voice Input Button */}
            <button
              type="button"
              className={`copilot-mic-btn ${isListening ? "recording" : ""}`}
              onClick={toggleVoiceInput}
              title={isListening ? "Stop listening" : "Speak your query (Speech-to-Text)"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Send Button */}
            <button
              type="button"
              className="copilot-send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              title="Send message (Enter)"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
