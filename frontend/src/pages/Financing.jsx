import React, { useState, useEffect } from "react";
import {
  Brain,
  Wallet,
  FileText,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  IndianRupee,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Building,
  ArrowRight,
  Landmark,
  Percent,
  Clock,
  Banknote,
  RotateCcw,
  Sliders,
  ChevronRight,
  Download,
  Info,
  Layers,
  Zap,
  Check,
  ExternalLink,
  HelpCircle,
  BarChart3,
  Activity,
  Calculator,
  Award,
  FileSpreadsheet,
  CheckSquare,
  Square,
  BadgeCheck,
  ShieldAlert,
  Scale,
  FileWarning,
  AlertOctagon,
  Flame,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";

import { useNavigate } from "react-router-dom";
import ModulePage from "../components/ModulePage";
import DeepDiveRiskModal from "../components/DeepDiveRiskModal";
import { getFinancialData, subscribeFinancialData } from "../data/financialStore";
import { API_URL } from "../config";

const FINANCING_COLORS = {
  funding: "#38bdf8",
  cost: "#fb7185",
  net: "#34d399",
  balanceWith: "#10b981",
  balanceWithout: "#f43f5e",
};

export default function Financing() {
  const navigate = useNavigate();
  const [data, setData] = useState(getFinancialData());
  const [liquidityGap, setLiquidityGap] = useState(300000);
  const [fundingPurpose, setFundingPurpose] = useState("working_capital");
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all" | "banking" | "govt" | "market"
  const [activeTab, setActiveTab] = useState("instruments"); // "instruments" | "emi_calc" | "trajectory"
  const [selectedOptionModal, setSelectedOptionModal] = useState(null);
  const [showDeepDiveRiskModal, setShowDeepDiveRiskModal] = useState(false);

  // Bank Loan EMI Calculator State
  const [emiLoanAmount, setEmiLoanAmount] = useState(500000);
  const [emiInterestRate, setEmiInterestRate] = useState(9.5);
  const [emiTenureYears, setEmiTenureYears] = useState(3);

  // Government Scheme Eligibility Filter State
  const [eligibilityFilters, setEligibilityFilters] = useState({
    udyamRegistered: true,
    enterpriseType: "Micro", // "Micro" | "Small" | "Medium"
    hasGst: true,
    womenOrScSt: false,
    needsCollateralFree: true,
  });

  // Credit & Debt Risk Analysis Sandbox State
  const [riskRevenueShock, setRiskRevenueShock] = useState(0); // 0 | -10 | -20 | -30 %
  const [riskDebtorDelay, setRiskDebtorDelay] = useState(0); // 0 | 15 | 30 | 45 days
  const [riskInterestHike, setRiskInterestHike] = useState(0); // 0 | 100 | 200 | 300 bps
  const [riskChecklist, setRiskChecklist] = useState({
    udyam: true,
    gstRecon: true,
    treds: false,
    moratorium: true,
    debtorInsurance: false,
    escrowAccount: false,
  });

  useEffect(() => {
    const unsub = subscribeFinancialData(() => {
      setData(getFinancialData());
    });
    return unsub;
  }, []);

  const formatMoney = (amount) => {
    const val = Number(amount || 0);
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const formatLakhs = (amount) => {
    const val = Number(amount || 0);
    const abs = Math.abs(val);
    if (abs >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (abs >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    if (abs >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toFixed(0)}`;
  };

  // Helper EMI calculator
  const calculateEMI = (principal, annualRate, tenureMonths) => {
    if (principal <= 0 || tenureMonths <= 0) return 0;
    if (annualRate <= 0) return Math.round(principal / tenureMonths);
    const monthlyRate = annualRate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    return Math.round((principal * monthlyRate * factor) / (factor - 1));
  };

  // Derived Financials
  const currentCash = Number(data.business?.openingCash || 0);
  const eligibleReceivables = (data.invoices || [])
    .filter((inv) => String(inv.status || "").toLowerCase() !== "paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  const fundingNeeded = Math.max(0, Number(liquidityGap || 0));
  const invoiceCap = Math.min(fundingNeeded, Math.round(eligibleReceivables * 0.85));

  // =========================================================================
  // 1. COMMERCIAL BANKING FINANCIAL LOANS
  // =========================================================================
  const bankTermLoanEMI = calculateEMI(fundingNeeded, 9.5, horizonMonths);
  const bankTermTotalRepay = bankTermLoanEMI * horizonMonths;
  const bankTermCost = Math.max(0, bankTermTotalRepay - fundingNeeded);

  const bankLoanOptions = [
    {
      id: "bank_term_loan",
      category: "banking",
      categoryLabel: "Commercial Bank Loan",
      title: "MSME Secured / Term Loan",
      institution: "SBI / HDFC / ICICI / PNB",
      tagline: "Structured multi-year term loan for business expansion, capex, and working capital",
      badge: "Commercial Banking",
      badgeColor: "blue",
      maxFunding: fundingNeeded,
      fundingDisbursed: fundingNeeded,
      estimatedCost: bankTermCost,
      netFundsReceived: fundingNeeded,
      costRate: "8.50% - 10.25% p.a. (EBLR)",
      monthlyEMI: bankTermLoanEMI,
      timeline: "5 - 7 Business Days",
      repaymentPeriod: `${horizonMonths} Months EMI`,
      riskLevel: "MEDIUM",
      impact: "Long-Term Balance Sheet Debt",
      collateral: "Business Assets / Property Hypothecation",
      suitabilityScore: 88,
      suitabilityBadge: "Institutional Credit",
      portalUrl: "https://www.psbloansin59minutes.com",
      features: [
        "Structured predictable reducing-balance monthly EMI",
        "Tenures available from 12 to 84 months",
        "In-principle digital sanction within 59 minutes on PSB portal",
      ],
    },
    {
      id: "bank_cash_credit",
      category: "banking",
      categoryLabel: "Commercial Bank Loan",
      title: "Bank Cash Credit / Overdraft (CC/OD)",
      institution: "All Scheduled Commercial Banks",
      tagline: "Revolving credit line against inventory and receivables with interest on daily usage only",
      badge: "Revolving Facility",
      badgeColor: "purple",
      maxFunding: fundingNeeded,
      fundingDisbursed: fundingNeeded,
      estimatedCost: Math.round(fundingNeeded * 0.65 * (0.1025 / 12) * Math.min(horizonMonths, 12)),
      netFundsReceived: fundingNeeded,
      costRate: "9.25% - 10.75% p.a.",
      monthlyEMI: null,
      timeline: "3 - 5 Business Days",
      repaymentPeriod: "12 Months (Renewable)",
      riskLevel: "LOW",
      impact: "Current Operational Liability",
      collateral: "Hypothecation of Stock & Receivables",
      suitabilityScore: 90,
      suitabilityBadge: "Maximum Flexibility",
      portalUrl: "https://www.psbloansin59minutes.com",
      features: [
        "Pay interest strictly on utilized funds, not the total sanctioned limit",
        "Seamless drawing power tied to monthly stock & debtor statements",
        "Automatic annual renewal with zero restructuring penalties",
      ],
    },
    {
      id: "bank_machinery_loan",
      category: "banking",
      categoryLabel: "Commercial Bank Loan",
      title: "Equipment & Machinery Finance",
      institution: "SIDBI & Private / PSU Lenders",
      tagline: "Dedicated capex funding for manufacturing equipment, CNC tools, and commercial vehicles",
      badge: "Asset-Backed",
      badgeColor: "amber",
      maxFunding: Math.round(fundingNeeded * 0.85),
      fundingDisbursed: Math.round(fundingNeeded * 0.85),
      estimatedCost: Math.round(fundingNeeded * 0.85 * (0.09 / 12) * horizonMonths),
      netFundsReceived: Math.round(fundingNeeded * 0.85),
      costRate: "8.75% - 9.80% p.a.",
      monthlyEMI: calculateEMI(Math.round(fundingNeeded * 0.85), 9.25, horizonMonths),
      timeline: "4 - 6 Business Days",
      repaymentPeriod: `${horizonMonths} Months`,
      riskLevel: "LOW",
      impact: "Secured Plant & Machinery Debt",
      collateral: "Equipment Being Financed (No Land Mortgage)",
      suitabilityScore: 84,
      suitabilityBadge: "Asset Collateral",
      portalUrl: "https://www.sidbi.in",
      features: [
        "Finances up to 85% of equipment invoice value (15% margin)",
        "Tenure aligned with asset economic lifecycle (up to 7 years)",
        "Equipment itself serves as primary collateral",
      ],
    },
  ];

  // =========================================================================
  // 2. GOVERNMENT MSME SCHEMES & SUBSIDIES
  // =========================================================================
  const cgtmseEMI = calculateEMI(fundingNeeded, 8.75, horizonMonths);
  const mudraEMI = calculateEMI(Math.min(fundingNeeded, 1000000), 8.5, horizonMonths);
  const vishwakarmaEMI = calculateEMI(Math.min(fundingNeeded, 300000), 5.0, Math.min(horizonMonths, 30));
  const pmegpSubsidyAmt = Math.round(fundingNeeded * 0.25);

  const govtSchemeOptions = [
    {
      id: "govt_cgtmse",
      category: "govt",
      categoryLabel: "Government MSME Scheme",
      title: "CGTMSE Collateral-Free Scheme",
      agency: "Ministry of MSME & SIDBI",
      tagline: "Credit Guarantee Fund Trust providing up to ₹5 Crore collateral-free institutional credit",
      badge: "Sovereign Guarantee",
      badgeColor: "emerald",
      maxFunding: Math.min(fundingNeeded, 50000000),
      fundingDisbursed: fundingNeeded,
      estimatedCost: Math.max(0, cgtmseEMI * horizonMonths - fundingNeeded),
      netFundsReceived: fundingNeeded,
      costRate: "8.50% - 9.00% p.a.",
      monthlyEMI: cgtmseEMI,
      subsidyBenefit: "Up to 85% Sovereign Credit Guarantee",
      timeline: "7 - 10 Business Days",
      repaymentPeriod: `${horizonMonths} Months`,
      riskLevel: "LOW",
      impact: "Zero Collateral Mortgage Debt",
      collateral: "None (85% Guaranteed by Govt Trust)",
      suitabilityScore: 96,
      suitabilityBadge: "Zero Collateral Required",
      portalUrl: "https://www.cgtmse.in",
      isEligible: eligibilityFilters.needsCollateralFree && eligibilityFilters.udyamRegistered,
      features: [
        "No residential/commercial property mortgage needed",
        "Up to 85% guarantee coverage backed by Ministry of MSME",
        "Accepted across all PSU, private, and regional rural banks",
      ],
    },
    {
      id: "govt_mudra",
      category: "govt",
      categoryLabel: "Government MSME Scheme",
      title: "PMMY MUDRA Yojana (Tarun / Kishore)",
      agency: "Government of India",
      tagline: "Collateral-free credit up to ₹10 Lakhs (Tarun) / ₹20 Lakhs (Tarun Plus) with MUDRA RuPay card",
      badge: "MUDRA Scheme",
      badgeColor: "emerald",
      maxFunding: Math.min(fundingNeeded, 1000000),
      fundingDisbursed: Math.min(fundingNeeded, 1000000),
      estimatedCost: Math.max(0, mudraEMI * horizonMonths - Math.min(fundingNeeded, 1000000)),
      netFundsReceived: Math.min(fundingNeeded, 1000000),
      costRate: "8.00% - 8.90% Concessional ROI",
      monthlyEMI: mudraEMI,
      subsidyBenefit: "Concessional Interest & Nil Processing Fee",
      timeline: "3 - 7 Business Days",
      repaymentPeriod: `${horizonMonths} Months`,
      riskLevel: "LOW",
      impact: "Govt-Backed Micro Credit",
      collateral: "100% Collateral-Free",
      suitabilityScore: 93,
      suitabilityBadge: "Micro Enterprise Friendly",
      portalUrl: "https://www.mudra.org.in",
      isEligible: eligibilityFilters.enterpriseType === "Micro" || eligibilityFilters.enterpriseType === "Small",
      features: [
        "Zero loan processing fee for micro enterprises",
        "MUDRA RuPay Debit Card provided for working capital liquidity",
        "Pre-structured tiers: Shishu (≤50k), Kishore (≤5L), Tarun (≤10L)",
      ],
    },
    {
      id: "govt_vishwakarma",
      category: "govt",
      categoryLabel: "Government MSME Scheme",
      title: "PM Vishwakarma Enterprise Scheme",
      agency: "Ministry of MSME",
      tagline: "Ultra-concessional 5% interest rate scheme with 8% subvention paid directly by Govt",
      badge: "5% Interest Subvention",
      badgeColor: "emerald",
      maxFunding: Math.min(fundingNeeded, 300000),
      fundingDisbursed: Math.min(fundingNeeded, 300000),
      estimatedCost: Math.max(0, vishwakarmaEMI * Math.min(horizonMonths, 30) - Math.min(fundingNeeded, 300000)),
      netFundsReceived: Math.min(fundingNeeded, 300000),
      costRate: "5.00% Flat (8% MoMSME Subvention)",
      monthlyEMI: vishwakarmaEMI,
      subsidyBenefit: "8% Interest Subvention + ₹15k Tool Grant",
      timeline: "5 - 7 Business Days",
      repaymentPeriod: "30 Months",
      riskLevel: "LOW",
      impact: "Concessional Subsidized Loan",
      collateral: "100% Collateral-Free",
      suitabilityScore: 97,
      suitabilityBadge: "Lowest Interest in India",
      portalUrl: "https://pmvishwakarma.gov.in",
      isEligible: eligibilityFilters.enterpriseType === "Micro",
      features: [
        "Government pays 8% interest directly to the bank; you pay only 5%",
        "Direct collateral-free tranches of ₹1 Lakh + ₹2 Lakhs",
        "Digital transaction cashback incentive up to ₹100/month",
      ],
    },
    {
      id: "govt_pmegp",
      category: "govt",
      categoryLabel: "Government MSME Scheme",
      title: "PMEGP Margin Money Capital Subsidy",
      agency: "KVIC & Ministry of MSME",
      tagline: "Up to 35% non-repayable government capital subsidy credited to your loan bank account",
      badge: "Direct Capital Grant",
      badgeColor: "amber",
      maxFunding: fundingNeeded,
      fundingDisbursed: fundingNeeded,
      estimatedCost: Math.round((fundingNeeded - pmegpSubsidyAmt) * 0.09 * (horizonMonths / 12)),
      netFundsReceived: fundingNeeded,
      costRate: "25% - 35% Non-Repayable Grant",
      monthlyEMI: calculateEMI(fundingNeeded - pmegpSubsidyAmt, 9.0, horizonMonths),
      subsidyBenefit: `₹${(pmegpSubsidyAmt / 100000).toFixed(2)}L Direct Government Subsidy Grant`,
      timeline: "15 - 20 Business Days",
      repaymentPeriod: `${horizonMonths} Months`,
      riskLevel: "LOW",
      impact: "Capital Subsidy Adjusted Loan",
      collateral: "Covered under CGTMSE",
      suitabilityScore: 94,
      suitabilityBadge: "Non-Repayable Grant",
      portalUrl: "https://www.kviconline.gov.in/pmegpeportal",
      isEligible: eligibilityFilters.udyamRegistered,
      features: [
        `Direct government grant of ₹${(pmegpSubsidyAmt / 100000).toFixed(2)} Lakhs (never repaid)`,
        "Administered by KVIC, KVIB, and State DICs",
        "Lock-in of 3 years followed by permanent grant waiver against principal",
      ],
    },
    {
      id: "govt_standup",
      category: "govt",
      categoryLabel: "Government MSME Scheme",
      title: "Stand-Up India Scheme",
      agency: "Department of Financial Services (DFS)",
      tagline: "Bank loans between ₹10 Lakhs and ₹1 Crore for greenfield enterprises led by Women / SC / ST",
      badge: "Women & SC/ST Focus",
      badgeColor: "purple",
      maxFunding: Math.max(1000000, fundingNeeded),
      fundingDisbursed: Math.max(1000000, fundingNeeded),
      estimatedCost: Math.round(fundingNeeded * (0.088 / 12) * horizonMonths),
      netFundsReceived: fundingNeeded,
      costRate: "Base Rate + 3% (Lowest Bank Slab)",
      monthlyEMI: calculateEMI(fundingNeeded, 8.8, horizonMonths),
      subsidyBenefit: "Handholding & Credit Guarantee Coverage",
      timeline: "10 - 14 Business Days",
      repaymentPeriod: "Up to 7 Years",
      riskLevel: "LOW",
      impact: "Greenfield Term & Working Capital",
      collateral: "Guaranteed by NCGTC",
      suitabilityScore: 89,
      suitabilityBadge: "Empowerment Scheme",
      portalUrl: "https://www.standupmitra.in",
      isEligible: eligibilityFilters.womenOrScSt,
      features: [
        "Composite loan covering 85% of project cost (term loan + working capital)",
        "Guaranteed through Credit Guarantee Scheme for Stand Up India (CGSUI)",
        "Moratorium period of up to 18 months before principal repayment",
      ],
    },
  ];

  // =========================================================================
  // 3. TReDS & MARKET WORKING CAPITAL
  // =========================================================================
  const marketOptions = [
    {
      id: "market_cash_recovery",
      category: "market",
      categoryLabel: "Non-Debt Liquidity & Legal Recovery",
      title: "MSME Samadhaan & Cash Recovery Hub",
      institution: "Section 43B(h) IT Act & MSMED Act 2006",
      tagline: "Recover your own trapped cash via WhatsApp & Email statutory notices with 3x RBI compound penal interest",
      badge: "0% Debt / 100% Non-Debt",
      badgeColor: "emerald",
      maxFunding: fundingNeeded,
      fundingDisbursed: fundingNeeded,
      estimatedCost: 0,
      netFundsReceived: fundingNeeded,
      costRate: "0.00% (Claim +19.5% Penal Int.)",
      monthlyEMI: null,
      timeline: "Instant WhatsApp / Email",
      repaymentPeriod: "Immediate Clearance",
      riskLevel: "LOW",
      impact: "Zero Balance Sheet Debt",
      collateral: "None (Statutory Legal Notice)",
      suitabilityScore: 99,
      suitabilityBadge: "1-Click WhatsApp & Email Dispatch",
      portalUrl: "/invoices",
      isCustomAction: true,
      features: [
        "1-click WhatsApp message pre-filled with legal notice & UPI coordinates",
        "1-click official Email dispatch to buyer accounts payable",
        "Enforces Section 43B(h) tax disallowance and 3x RBI compound interest",
      ],
    },
    {
      id: "early_discount",
      category: "market",
      categoryLabel: "Working Capital",
      title: "Customer Prompt-Pay Discounting",
      institution: "Direct Corporate Debtors",
      tagline: "Accelerate invoice collections by offering 1.0 - 1.2% dynamic prompt discount",
      badge: "Non-Debt",
      badgeColor: "emerald",
      maxFunding: fundingNeeded,
      fundingDisbursed: fundingNeeded,
      estimatedCost: Math.round(fundingNeeded * 0.012),
      netFundsReceived: Math.round(fundingNeeded * 0.988),
      costRate: "1.2% Total Discount",
      monthlyEMI: null,
      timeline: "1 - 2 Business Days",
      repaymentPeriod: "1 Month",
      riskLevel: "LOW",
      impact: "Zero Balance Sheet Debt",
      collateral: "None required",
      suitabilityScore: 98,
      suitabilityBadge: "100% Debt-Free",
      portalUrl: "#",
      features: [
        "Zero interest, legal fees, or balance sheet encumbrance",
        "Improves client collection cycle from 60 days to 48 hours",
        "No documentation or banking sanction needed",
      ],
    },
    {
      id: "invoice_discounting",
      category: "market",
      categoryLabel: "Working Capital",
      title: "TReDS / Invoice Discounting",
      institution: "RXIL / M1xchange / Invoicemart",
      tagline: "Auction verified customer invoices to institutional financiers for instant 24-48h liquidity",
      badge: "Off-Balance Sheet",
      badgeColor: "blue",
      maxFunding: invoiceCap > 0 ? invoiceCap : fundingNeeded,
      fundingDisbursed: invoiceCap > 0 ? invoiceCap : fundingNeeded,
      estimatedCost: Math.round((invoiceCap > 0 ? invoiceCap : fundingNeeded) * 0.014 * (horizonMonths / 3)),
      netFundsReceived: Math.round(
        (invoiceCap > 0 ? invoiceCap : fundingNeeded) * 0.986
      ),
      costRate: "1.2% - 1.5% per month",
      monthlyEMI: null,
      timeline: "24 - 48 Hours",
      repaymentPeriod: "Upon Invoice Clearance (60-90 Days)",
      riskLevel: "LOW",
      impact: "Off-Balance Sheet Asset Conversion",
      collateral: "Verified Trade Invoices",
      suitabilityScore: 95,
      suitabilityBadge: "Fastest Disbursal",
      portalUrl: "https://www.m1xchange.com",
      features: [
        "Regulated multi-financier institutional bidding ensures lowest market discount",
        "Converts trapped receivables to liquid cash in under 48 hours",
        "Non-recourse / limited recourse protection for suppliers",
      ],
    },
  ];

  // Combined options list
  const allFinancingOptions = [
    ...govtSchemeOptions,
    ...bankLoanOptions,
    ...marketOptions,
  ];

  // Filtered by category
  const displayedOptions = allFinancingOptions.filter((opt) => {
    if (categoryFilter === "banking") return opt.category === "banking";
    if (categoryFilter === "govt") return opt.category === "govt";
    if (categoryFilter === "market") return opt.category === "market";
    return true;
  });

  // Best recommendation
  const bestOption =
    invoiceCap >= fundingNeeded && fundingNeeded > 0
      ? marketOptions[1]
      : govtSchemeOptions[0];

  // Calculator EMI numbers
  const calculatedEMI = calculateEMI(emiLoanAmount, emiInterestRate, emiTenureYears * 12);
  const totalLoanRepayment = calculatedEMI * (emiTenureYears * 12);
  const totalLoanInterest = Math.max(0, totalLoanRepayment - emiLoanAmount);

  // EMI Chart Data
  const emiPieData = [
    { name: "Principal Loan Amount", value: emiLoanAmount, fill: "#38bdf8" },
    { name: "Total Interest Payable", value: totalLoanInterest, fill: "#fb7185" },
  ];

  // Cash Trajectory Projection (90 Days)
  const trajectoryData = Array.from({ length: 12 }, (_, i) => {
    const week = `Wk ${i + 1}`;
    const baseBurn = (data.business?.monthlyExpenses || 250000) / 4;
    const expectedInflow = (eligibleReceivables / 12) * (i > 3 ? 1.4 : 0.8);

    const cashWithout = Math.max(
      -150000,
      currentCash + (expectedInflow - baseBurn) * (i + 1)
    );

    const cashWith = Math.max(
      0,
      currentCash +
        fundingNeeded +
        (expectedInflow - baseBurn) * (i + 1) -
        (i > 8 ? (fundingNeeded + bestOption.estimatedCost) / 3 : 0)
    );

    return {
      week,
      "Without Financing": Math.round(cashWithout),
      "With NexFin Capital": Math.round(cashWith),
    };
  });

  // Dynamic Credit & Debt Risk Telemetry Calculations
  const baseMonthlyRevenue = data.business?.monthlyRevenue || 1250000;
  const baseMonthlyExpenses = data.business?.monthlyExpenses || 780000;

  // Stressed calculations based on user sandbox controls
  const stressedRevenue = baseMonthlyRevenue * (1 + riskRevenueShock / 100);
  const effectiveStressRate = emiInterestRate + riskInterestHike / 100;
  const stressedEMI = calculateEMI(emiLoanAmount, effectiveStressRate, emiTenureYears * 12);
  const stressedOperatingProfit = Math.max(15000, stressedRevenue - baseMonthlyExpenses);
  const dscrRatio = Math.max(0.2, Number((stressedOperatingProfit / stressedEMI).toFixed(2)));
  const foirPercent = Math.min(100, Math.round((stressedEMI / stressedRevenue) * 100));
  const stressedRunwayDays = Math.max(
    14,
    Math.round(180 * (1 + riskRevenueShock / 120) - riskDebtorDelay * 0.8)
  );

  // 43B(h) breaches count from live invoices
  const overdue43bInvoices = (data.invoices || []).filter(
    (i) => i.status !== "Paid" && (i.daysOverdue || 0) > 45
  );
  const overdue43bCount = overdue43bInvoices.length;

  // Solvency Bankability Health Score (0-100)
  let riskScore = 84;
  if (dscrRatio < 1.5) riskScore -= 24;
  if (foirPercent > 40) riskScore -= 18;
  if (riskDebtorDelay > 20) riskScore -= 15;
  if (riskInterestHike >= 200) riskScore -= 10;
  if (overdue43bCount > 0) riskScore -= 12;
  riskScore = Math.max(25, Math.min(98, riskScore));

  const riskTier =
    riskScore >= 75
      ? { label: "Low Risk (Bankable Prime)", color: "var(--accent-emerald)", bg: "rgba(16,185,129,0.12)" }
      : riskScore >= 50
      ? { label: "Moderate Risk (Watchlist)", color: "var(--accent-amber)", bg: "rgba(245,158,11,0.12)" }
      : { label: "High Risk (Debt Burden Alert)", color: "var(--accent-rose)", bg: "rgba(244,63,94,0.12)" };

  // Export Loan Dossier CSV
  const handleExportLoanDossier = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "==================================================================",
        "NEXFIN MSME CREDIT & FINANCING PROPOSAL DOSSIER",
        "Official Evaluation Dossier for Bank & Institutional Lenders",
        "==================================================================",
        `Business Name,${data.business?.name || "Enterprise"}`,
        `GSTIN,${data.business?.gstin || "27ABCDE1234F1Z5"}`,
        `Enterprise Category,${eligibilityFilters.enterpriseType} Enterprise (Udyam Verified)`,
        `Assessment Date,${new Date().toISOString().slice(0, 10)}`,
        "",
        "FINANCIAL CAPACITY & WORKING CAPITAL GAP",
        `Requested Funding Amount,INR ${fundingNeeded}`,
        `Current Liquid Cash Reserves,INR ${currentCash}`,
        `Total Outstanding Receivables,INR ${eligibleReceivables}`,
        `Eligible TReDS Discounting Capacity (85% LTV),INR ${Math.round(eligibleReceivables * 0.85)}`,
        `Estimated Monthly Burn Rate,INR ${data.business?.monthlyExpenses || 250000}`,
        "",
        "EVALUATED GOVERNMENT & BANKING FACILITIES",
        "Facility Name,Category,Estimated ROI/Rate,Tenure,Collateral,Status",
        ...allFinancingOptions.map(
          (opt) =>
            `"${opt.title}","${opt.categoryLabel}","${opt.costRate}","${opt.repaymentPeriod}","${opt.collateral}","Score ${opt.suitabilityScore}/100"`
        ),
        "",
        "RECOMMENDED OPTION",
        `Selected Solution,${bestOption.title}`,
        `Estimated Total Cost,INR ${bestOption.estimatedCost}`,
        `Net Advance to Bank Account,INR ${bestOption.netFundsReceived}`,
        "",
        "Generated by NexFin AI Digital Twin - Compliant with RBI/MoMSME Credit Norms",
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NexFin_MSME_Loan_Proposal_Dossier.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Hero Header Banner */}
      <div
        className="pictorial-hero-card"
        style={{
          padding: "24px 28px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 740 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span className="pictorial-badge blue">
                <Landmark size={13} />
                <span>Commercial Banking & Govt Schemes Hub</span>
              </span>

              <span className="pictorial-badge emerald">
                <ShieldCheck size={13} />
                <span>CGTMSE & JanSamarth Integrated</span>
              </span>

              <span className="pictorial-badge amber">
                <Award size={13} />
                <span>Up to 35% Capital Subsidies</span>
              </span>
            </div>

            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 8px" }}>
              MSME Banking Loans & Government Schemes Hub
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
              Access collateral-free government schemes (<strong>CGTMSE</strong>, <strong>MUDRA</strong>, <strong>PM Vishwakarma 5% Subvention</strong>, <strong>PMEGP Capital Subsidies</strong>), commercial bank term loans & overdrafts, and TReDS invoice auctioning — all matched to your verified business ledger.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportLoanDossier}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
              title="Download official loan proposal for bank managers"
            >
              <Download size={13} />
              <span>Export Loan Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid-4">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Target Funding Gap</span>
            <div className="card-icon-wrap rose">
              <Banknote size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-rose)" }}>
              {formatLakhs(fundingNeeded)}
            </span>
          </div>
          <div className="kpi-trend neutral">
            <span>{horizonMonths} Months Tenure Target</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Govt Guarantee Qualified</span>
            <div className="card-icon-wrap emerald">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-emerald)" }}>
              85% Coverage
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Zero Property Mortgage Required</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Discounting Capacity</span>
            <div className="card-icon-wrap blue">
              <Layers size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-blue)" }}>
              {formatLakhs(eligibleReceivables * 0.85)}
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>85% LTV on Verified Invoices</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Lowest Subsidized Rate</span>
            <div className="card-icon-wrap amber">
              <Percent size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value" style={{ color: "var(--accent-amber)" }}>
              5.0% p.a.
            </span>
          </div>
          <div className="kpi-trend positive">
            <span>Via PM Vishwakarma Subvention</span>
          </div>
        </div>
      </div>

      {/* Credit & Debt Risk Health Overview Bar */}
      <div
        className="glass-card"
        style={{
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          background: "var(--bg-card)",
          border: `1px solid ${riskTier.color}40`,
          borderRadius: "var(--radius-md)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: riskTier.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: riskTier.color,
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--text-primary)" }}>
                Credit & Debt Solvency Index:
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: riskTier.bg,
                  color: riskTier.color,
                }}
              >
                {riskScore} / 100 • {riskTier.label}
              </span>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 4, fontSize: 11.5, color: "var(--text-secondary)", flexWrap: "wrap" }}>
              <span>DSCR Coverage: <strong style={{ color: dscrRatio >= 1.5 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>{dscrRatio}x</strong> (Safe &gt; 1.5x)</span>
              <span>Debt Burden (FOIR): <strong style={{ color: foirPercent <= 40 ? "var(--accent-emerald)" : "var(--accent-amber)" }}>{foirPercent}%</strong> of Revenue</span>
              <span>Section 43B(h): <strong style={{ color: overdue43bCount === 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>{overdue43bCount === 0 ? "0 Overdue Penalties" : `${overdue43bCount} Overdue (>45d)`}</strong></span>
              <span>Stressed Runway: <strong style={{ color: "var(--accent-blue)" }}>{stressedRunwayDays} Days</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActiveTab("risk_analysis");
              setTimeout(() => {
                const element = document.getElementById("financing-tabs-section");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }, 60);
            }}
            style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
          >
            <span>View Solvency Radar</span>
            <ArrowRight size={13} />
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowDeepDiveRiskModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 800,
              background: "linear-gradient(135deg, #e11d48, #be123c)",
              border: "1px solid #e11d48",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(225, 29, 72, 0.25)",
            }}
          >
            <ShieldAlert size={14} />
            <span>Deep-Dive Risk Analysis</span>
          </button>
        </div>
      </div>

      {/* Interactive Capital Simulator & Quick Controls */}
      <div className="glass-card" style={{ padding: 22 }}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap blue">
              <Sliders size={18} />
            </div>
            <div>
              <div className="card-title">Financing Parameter Simulator</div>
              <div className="card-subtitle">Adjust capital required, repayment tenure, and business enterprise profile</div>
            </div>
          </div>
        </div>

        <div className="grid-12" style={{ gap: 20 }}>
          {/* Amount Slider & Presets */}
          <div className="col-span-6" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                Target Funding Amount
              </label>
              <strong style={{ fontSize: 16, color: "var(--accent-blue)", fontWeight: 800 }}>
                {formatMoney(liquidityGap)}
              </strong>
            </div>

            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={liquidityGap}
              onChange={(e) => {
                setLiquidityGap(Number(e.target.value));
                setEmiLoanAmount(Number(e.target.value));
              }}
              style={{
                width: "100%",
                accentColor: "var(--accent-blue)",
                cursor: "pointer",
                height: 6,
              }}
            />

            {/* Quick Preset Chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[100000, 300000, 500000, 1000000, 2500000, 5000000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setLiquidityGap(amt);
                    setEmiLoanAmount(amt);
                  }}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: liquidityGap === amt ? "1px solid var(--accent-blue)" : "1px solid var(--border-medium)",
                    background: liquidityGap === amt ? "var(--accent-blue)" : "var(--bg-secondary)",
                    color: liquidityGap === amt ? "#ffffff" : "var(--text-primary)",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {formatLakhs(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Tenure & Enterprise Metadata */}
          <div className="col-span-6" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                Repayment Horizon
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[6, 12, 36, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setHorizonMonths(m);
                      setEmiTenureYears(Math.max(1, Math.round(m / 12)));
                    }}
                    style={{
                      padding: "8px 6px",
                      borderRadius: 6,
                      border: horizonMonths === m ? "1px solid var(--accent-blue)" : "1px solid var(--border-medium)",
                      background: horizonMonths === m ? "var(--accent-blue)" : "var(--bg-secondary)",
                      color: horizonMonths === m ? "#ffffff" : "var(--text-primary)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    {m >= 12 ? `${m / 12} Yrs` : `${m} Mos`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                Enterprise Scale (Udyam)
              </label>
              <select
                value={eligibilityFilters.enterpriseType}
                onChange={(e) =>
                  setEligibilityFilters({ ...eligibilityFilters, enterpriseType: e.target.value })
                }
                className="form-select"
                style={{ fontSize: 12, padding: "8px 10px" }}
              >
                <option value="Micro">Micro (&lt; ₹5 Cr Turnover)</option>
                <option value="Small">Small (&lt; ₹50 Cr Turnover)</option>
                <option value="Medium">Medium (&lt; ₹250 Cr Turnover)</option>
              </select>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                <input
                  type="checkbox"
                  id="womenScStCheck"
                  checked={eligibilityFilters.womenOrScSt}
                  onChange={(e) =>
                    setEligibilityFilters({ ...eligibilityFilters, womenOrScSt: e.target.checked })
                  }
                  style={{ width: 14, height: 14, accentColor: "var(--accent-blue)" }}
                />
                <label htmlFor="womenScStCheck" style={{ fontSize: 11.5, color: "var(--text-secondary)", cursor: "pointer" }}>
                  Women / SC / ST Promoter
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Tabs (Instruments Matrix vs EMI Calculator vs Cash Trajectory vs Risk Analysis) */}
      <div id="financing-tabs-section" className="glass-card" style={{ padding: 22 }}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap purple">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="card-title">Financing Hub Navigation</div>
              <div className="card-subtitle">
                Explore government schemes, banking facilities, loan EMI modeling, cash trajectory, and institutional risk analysis
              </div>
            </div>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === "instruments" ? "active" : ""}`}
              onClick={() => setActiveTab("instruments")}
            >
              Financing Solutions ({displayedOptions.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "emi_calc" ? "active" : ""}`}
              onClick={() => setActiveTab("emi_calc")}
            >
              <Calculator size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Bank Loan EMI Calculator
            </button>
            <button
              className={`tab-btn ${activeTab === "trajectory" ? "active" : ""}`}
              onClick={() => setActiveTab("trajectory")}
            >
              90-Day Cash Runway Projection
            </button>
            <button
              className={`tab-btn ${activeTab === "risk_analysis" ? "active" : ""}`}
              onClick={() => setActiveTab("risk_analysis")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontWeight: activeTab === "risk_analysis" ? 800 : 600,
                color: activeTab === "risk_analysis" ? "var(--accent-rose)" : "inherit",
              }}
            >
              <ShieldAlert size={13} style={{ verticalAlign: "middle" }} />
              <span>Credit & Risk Analysis</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 4,
                  background: riskTier.bg,
                  color: riskTier.color,
                  fontWeight: 700,
                  marginLeft: 4,
                }}
              >
                {riskScore}/100
              </span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: INSTRUMENTS LISTING & CATEGORY FILTER
        ========================================================================== */}
        {activeTab === "instruments" && (
          <div>
            {/* Category Filter Pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              <button
                onClick={() => setCategoryFilter("all")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: categoryFilter === "all" ? "1px solid var(--accent-blue)" : "1px solid var(--border-medium)",
                  background: categoryFilter === "all" ? "var(--accent-blue)" : "var(--bg-secondary)",
                  color: categoryFilter === "all" ? "#ffffff" : "var(--text-primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                All Available Solutions ({allFinancingOptions.length})
              </button>

              <button
                onClick={() => setCategoryFilter("govt")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: categoryFilter === "govt" ? "1px solid var(--accent-emerald)" : "1px solid var(--border-medium)",
                  background: categoryFilter === "govt" ? "var(--accent-emerald)" : "var(--bg-secondary)",
                  color: categoryFilter === "govt" ? "#ffffff" : "var(--text-primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ShieldCheck size={14} />
                <span>Government MSME Schemes & Subsidies ({govtSchemeOptions.length})</span>
              </button>

              <button
                onClick={() => setCategoryFilter("banking")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: categoryFilter === "banking" ? "1px solid var(--accent-purple)" : "1px solid var(--border-medium)",
                  background: categoryFilter === "banking" ? "var(--accent-purple)" : "var(--bg-secondary)",
                  color: categoryFilter === "banking" ? "#ffffff" : "var(--text-primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Landmark size={14} />
                <span>Commercial Banking Loans & Overdrafts ({bankLoanOptions.length})</span>
              </button>

              <button
                onClick={() => setCategoryFilter("market")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: categoryFilter === "market" ? "1px solid var(--accent-cyan)" : "1px solid var(--border-medium)",
                  background: categoryFilter === "market" ? "var(--accent-cyan)" : "var(--bg-secondary)",
                  color: categoryFilter === "market" ? "#ffffff" : "var(--text-primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Layers size={14} />
                <span>TReDS & Invoice Factoring ({marketOptions.length})</span>
              </button>
            </div>

            {/* Product Cards Grid */}
            <div className="grid-12" style={{ gap: 16 }}>
              {displayedOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="col-span-6 glass-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px 22px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--bg-card)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className={`card-icon-wrap ${opt.badgeColor}`} style={{ width: 38, height: 38 }}>
                        {opt.category === "govt" ? (
                          <ShieldCheck size={18} />
                        ) : opt.category === "banking" ? (
                          <Landmark size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                            {opt.title}
                          </h4>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {opt.agency || opt.institution || opt.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 10.5,
                        fontWeight: 700,
                        background:
                          opt.category === "govt"
                            ? "rgba(16, 185, 129, 0.12)"
                            : "rgba(59, 130, 246, 0.12)",
                        color: opt.category === "govt" ? "var(--accent-emerald)" : "var(--accent-blue)",
                        border:
                          opt.category === "govt"
                            ? "1px solid rgba(16, 185, 129, 0.25)"
                            : "1px solid rgba(59, 130, 246, 0.25)",
                      }}
                    >
                      {opt.suitabilityBadge}
                    </span>
                  </div>

                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: "12px 0 14px", lineHeight: 1.5 }}>
                    {opt.tagline}
                  </p>

                  {/* Financial Metrics Strip */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      padding: "12px 14px",
                      gap: 10,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block", fontWeight: 700 }}>ELIGIBLE LIMIT</span>
                      <strong style={{ fontSize: 14, color: "var(--accent-blue)", fontWeight: 800 }}>{formatLakhs(opt.fundingDisbursed)}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block", fontWeight: 700 }}>INTEREST / SUBSIDY</span>
                      <strong style={{ fontSize: 13, color: opt.category === "govt" ? "var(--accent-emerald)" : "var(--accent-amber)", fontWeight: 800 }}>
                        {opt.costRate.split(" ")[0]} {opt.costRate.split(" ")[1] || ""}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block", fontWeight: 700 }}>
                        {opt.monthlyEMI ? "MONTHLY EMI" : "DISBURSAL SPEED"}
                      </span>
                      <strong style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 800 }}>
                        {opt.monthlyEMI ? formatMoney(opt.monthlyEMI) : opt.timeline.split(" ")[0] + " Days"}
                      </strong>
                    </div>
                  </div>

                  {/* Meta Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11.5, color: "var(--text-secondary)", marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Collateral Security:</span>
                      <strong style={{ color: opt.collateral.includes("None") || opt.collateral.includes("100%") ? "var(--accent-emerald)" : "var(--text-primary)" }}>
                        {opt.collateral}
                      </strong>
                    </div>
                    {opt.subsidyBenefit && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Govt Incentive / Grant:</span>
                        <strong style={{ color: "var(--accent-amber)" }}>{opt.subsidyBenefit}</strong>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Tenure / Cadence:</span>
                      <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{opt.repaymentPeriod}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedOptionModal(opt)}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                      <span>Guidelines & Apply</span>
                      <ChevronRight size={13} />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowDeepDiveRiskModal(true)}
                      title="Run Deep-Dive Risk Analysis on this financing facility"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        fontWeight: 700,
                        color: "var(--accent-rose)",
                        borderColor: "rgba(244,63,94,0.35)",
                        padding: "0 10px",
                      }}
                    >
                      <ShieldAlert size={13} />
                      <span>Risk Audit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: INTERACTIVE BANK LOAN EMI CALCULATOR
        ========================================================================== */}
        {activeTab === "emi_calc" && (
          <div>
            <div className="grid-12" style={{ gap: 24 }}>
              {/* Sliders Form */}
              <div className="col-span-6" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      Loan Principal Amount
                    </label>
                    <strong style={{ fontSize: 16, color: "var(--accent-blue)", fontWeight: 800 }}>{formatMoney(emiLoanAmount)}</strong>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={emiLoanAmount}
                    onChange={(e) => setEmiLoanAmount(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-blue)", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
                    <span>₹1.00 Lakh</span>
                    <span>₹50.0 Lakhs</span>
                    <span>₹1.00 Crore</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      Annual Interest Rate (%)
                    </label>
                    <strong style={{ fontSize: 16, color: "var(--accent-amber)", fontWeight: 800 }}>{emiInterestRate.toFixed(2)}% p.a.</strong>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="18.0"
                    step="0.25"
                    value={emiInterestRate}
                    onChange={(e) => setEmiInterestRate(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-amber)", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
                    <span>5.0% (Vishwakarma Subsidized)</span>
                    <span>8.75% (CGTMSE / PSU)</span>
                    <span>18.0% (NBFC Unsecured)</span>
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
                      Loan Tenure (Years)
                    </label>
                    <strong style={{ fontSize: 16, color: "var(--accent-emerald)", fontWeight: 800 }}>{emiTenureYears} Years ({emiTenureYears * 12} Mos)</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={emiTenureYears}
                    onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--accent-emerald)", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--text-muted)", marginTop: 4 }}>
                    <span>1 Year</span>
                    <span>3 Years</span>
                    <span>5 Years</span>
                    <span>7 Years</span>
                  </div>
                </div>
              </div>

              {/* EMI Output & Visual Split */}
              <div
                className="col-span-6"
                style={{
                  background: "var(--bg-secondary)",
                  borderRadius: "var(--radius-md)",
                  padding: 22,
                  border: "1px solid var(--border-medium)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>CALCULATED MONTHLY INSTALLMENT</span>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "var(--accent-blue)", margin: "4px 0 16px" }}>
                    {formatMoney(calculatedEMI)} <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>/ month</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                    <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Principal Amount</span>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginTop: 2 }}>{formatMoney(emiLoanAmount)}</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(251, 113, 133, 0.1)", border: "1px solid rgba(251, 113, 133, 0.25)" }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Total Interest Payable</span>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--accent-rose)", marginTop: 2 }}>{formatMoney(totalLoanInterest)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Total Amount Payable (Principal + Interest):</span>
                    <strong style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 800 }}>{formatMoney(totalLoanRepayment)}</strong>
                  </div>
                </div>

                <div style={{ height: 110, width: "100%", marginTop: 10 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        {
                          name: "Breakdown",
                          Principal: emiLoanAmount,
                          Interest: totalLoanInterest,
                        },
                      ]}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" hide />
                      <Tooltip formatter={(val) => [formatMoney(val), ""]} />
                      <Legend
                        formatter={(val) => (
                          <span style={{ fontSize: 11.5, color: "var(--text-secondary)", fontWeight: 600 }}>{val}</span>
                        )}
                      />
                      <Bar dataKey="Principal" stackId="a" fill="#3b82f6" radius={[4, 0, 0, 4]} />
                      <Bar dataKey="Interest" stackId="a" fill="#e11d48" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: 90-DAY CASH RUNWAY TRAJECTORY PROJECTION
        ========================================================================== */}
        {activeTab === "trajectory" && (
          <div style={{ height: 300, width: "100%", marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 15, right: 25, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={FINANCING_COLORS.balanceWith} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={FINANCING_COLORS.balanceWith} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorWithout" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={FINANCING_COLORS.balanceWithout} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={FINANCING_COLORS.balanceWithout} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="week" stroke="var(--text-muted)" fontSize={11.5} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "var(--shadow-md)",
                    color: "var(--text-primary)",
                  }}
                  formatter={(val) => [formatMoney(val), ""]}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(val) => (
                    <span style={{ color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>{val}</span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="With NexFin Capital"
                  stroke={FINANCING_COLORS.balanceWith}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWith)"
                />
                <Area
                  type="monotone"
                  dataKey="Without Financing"
                  stroke={FINANCING_COLORS.balanceWithout}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorWithout)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* =========================================================================
            TAB 4: COMPREHENSIVE CREDIT & DEBT RISK ANALYSIS (ALL MAJOR POINTS)
        ========================================================================== */}
        {activeTab === "risk_analysis" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Top Risk Health Radar & Institutional Underwriting Banner */}
            <div
              style={{
                background: "var(--bg-secondary)",
                border: `1px solid ${riskTier.color}40`,
                borderRadius: "var(--radius-lg)",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: riskTier.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: riskTier.color,
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    <ShieldAlert size={26} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        Enterprise Debt Solvency & Bankability Assessment
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: riskTier.bg,
                          color: riskTier.color,
                        }}
                      >
                        {riskTier.label}
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: "4px 0 0" }}>
                      Institutional credit evaluation according to RBI Master Circular norms, bank debt-service thresholds, and statutory MSME compliance.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 16px",
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block", fontWeight: 700 }}>
                      BANKABILITY SCORE
                    </span>
                    <strong style={{ fontSize: 22, fontWeight: 800, color: riskTier.color }}>
                      {riskScore} <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>/ 100</span>
                    </strong>
                  </div>
                  <div style={{ width: 42, height: 42 }}>
                    <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--border-subtle)"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={riskTier.color}
                        strokeWidth="3.5"
                        strokeDasharray={`${riskScore}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowDeepDiveRiskModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #e11d48, #be123c)",
                    border: "1px solid #e11d48",
                    color: "#ffffff",
                    boxShadow: "0 2px 8px rgba(225, 29, 72, 0.25)",
                    padding: "8px 14px",
                  }}
                >
                  <ShieldAlert size={14} />
                  <span>Open Deep-Dive Modal</span>
                </button>
              </div>

              {/* 4 Core Financial Solvency Ratios */}
              <div className="grid-4" style={{ gap: 12 }}>
                <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>DSCR COVERAGE</span>
                    <span style={{ fontSize: 10, color: dscrRatio >= 1.5 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                      {dscrRatio >= 1.5 ? "✓ Compliant" : "⚠️ High Stress"}
                    </span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: dscrRatio >= 1.5 ? "var(--accent-emerald)" : "var(--accent-rose)", margin: "4px 0 2px" }}>
                    {dscrRatio}x
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>Target &ge; 1.50x (Net Cash / EMI)</span>
                </div>

                <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>DEBT BURDEN (FOIR)</span>
                    <span style={{ fontSize: 10, color: foirPercent <= 40 ? "var(--accent-emerald)" : "var(--accent-amber)", fontWeight: 700 }}>
                      {foirPercent <= 40 ? "✓ Safe Zone" : "⚠️ Heavy Leverage"}
                    </span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: foirPercent <= 40 ? "var(--accent-emerald)" : "var(--accent-amber)", margin: "4px 0 2px" }}>
                    {foirPercent}%
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>Prudent ceiling &le; 40% of Revenue</span>
                </div>

                <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>SECTION 43B(h) STATUS</span>
                    <span style={{ fontSize: 10, color: overdue43bCount === 0 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                      {overdue43bCount === 0 ? "✓ Zero Breaches" : `⚠️ ${overdue43bCount} Breaches`}
                    </span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: overdue43bCount === 0 ? "var(--accent-emerald)" : "var(--accent-rose)", margin: "4px 0 2px" }}>
                    {overdue43bCount} Penalties
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>
                    {overdue43bCount === 0 ? "MSE bills cleared < 45 Days" : "Mandatory 3x RBI compound penal interest"}
                  </span>
                </div>

                <div style={{ background: "var(--bg-card)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>STRESSED RUNWAY</span>
                    <span style={{ fontSize: 10, color: stressedRunwayDays >= 90 ? "var(--accent-emerald)" : "var(--accent-rose)", fontWeight: 700 }}>
                      {stressedRunwayDays >= 90 ? "✓ Buffer Healthy" : "⚠️ Horizon Alert"}
                    </span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent-blue)", margin: "4px 0 2px" }}>
                    {stressedRunwayDays} Days
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-secondary)" }}>Operating survival buffer</span>
                </div>
              </div>
            </div>

            {/* Interactive Scenario Stress-Test Sandbox */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 22px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    What-If Solvency Shock Simulator
                  </h4>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Simulate how macro revenue shocks, buyer delay contagion, and interest hikes affect your debt solvency
                  </span>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setRiskRevenueShock(0);
                    setRiskDebtorDelay(0);
                    setRiskInterestHike(0);
                  }}
                  style={{ fontSize: 11, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}
                >
                  <RotateCcw size={12} />
                  <span>Reset Shocks</span>
                </button>
              </div>

              <div className="grid-12" style={{ gap: 20 }}>
                {/* Sliders / Chip Selectors */}
                <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <label style={{ fontWeight: 700, color: "var(--text-primary)" }}>Revenue Contraction Shock</label>
                    <strong style={{ color: riskRevenueShock === 0 ? "var(--text-primary)" : "var(--accent-rose)" }}>
                      {riskRevenueShock}%
                    </strong>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, -10, -20, -30].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRiskRevenueShock(val)}
                        style={{
                          flex: 1,
                          padding: "6px 4px",
                          borderRadius: 6,
                          border: riskRevenueShock === val ? "1px solid var(--accent-rose)" : "1px solid var(--border-medium)",
                          background: riskRevenueShock === val ? "var(--accent-rose)" : "var(--bg-secondary)",
                          color: riskRevenueShock === val ? "#ffffff" : "var(--text-primary)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {val === 0 ? "Normal" : `${val}%`}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Simulates sudden client churn or seasonal sales contraction.</span>
                </div>

                <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <label style={{ fontWeight: 700, color: "var(--text-primary)" }}>Debtor Collection Delay</label>
                    <strong style={{ color: riskDebtorDelay === 0 ? "var(--text-primary)" : "var(--accent-amber)" }}>
                      +{riskDebtorDelay} Days
                    </strong>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 15, 30, 45].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRiskDebtorDelay(val)}
                        style={{
                          flex: 1,
                          padding: "6px 4px",
                          borderRadius: 6,
                          border: riskDebtorDelay === val ? "1px solid var(--accent-amber)" : "1px solid var(--border-medium)",
                          background: riskDebtorDelay === val ? "var(--accent-amber)" : "var(--bg-secondary)",
                          color: riskDebtorDelay === val ? "#ffffff" : "var(--text-primary)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {val === 0 ? "0d" : `+${val}d`}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Simulates top enterprise customer delaying clearance of invoices.</span>
                </div>

                <div className="col-span-4" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <label style={{ fontWeight: 700, color: "var(--text-primary)" }}>RBI Repo Rate / Hike Shock</label>
                    <strong style={{ color: riskInterestHike === 0 ? "var(--text-primary)" : "var(--accent-purple)" }}>
                      +{riskInterestHike} bps (+{(riskInterestHike / 100).toFixed(1)}%)
                    </strong>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[0, 100, 200, 300].map((val) => (
                      <button
                        key={val}
                        onClick={() => setRiskInterestHike(val)}
                        style={{
                          flex: 1,
                          padding: "6px 4px",
                          borderRadius: 6,
                          border: riskInterestHike === val ? "1px solid var(--accent-purple)" : "1px solid var(--border-medium)",
                          background: riskInterestHike === val ? "var(--accent-purple)" : "var(--bg-secondary)",
                          color: riskInterestHike === val ? "#ffffff" : "var(--text-primary)",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        {val === 0 ? "0 bps" : `+${val}`}
                      </button>
                    ))}
                  </div>
                  <span style={{ fontSize: 10.5, color: "var(--text-muted)" }}>Simulates central bank rate hiking cycles on floating bank CC/OD.</span>
                </div>
              </div>

              {/* Stress Results Bar */}
              <div
                style={{
                  marginTop: 18,
                  padding: "12px 16px",
                  background: "var(--bg-secondary)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <span style={{ fontSize: 10.5, color: "var(--text-muted)", display: "block" }}>STRESSED REVENUE</span>
                    <strong style={{ fontSize: 13.5, color: "var(--text-primary)" }}>{formatMoney(stressedRevenue)}/mo</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 10.5, color: "var(--text-muted)", display: "block" }}>RECALCULATED EMI</span>
                    <strong style={{ fontSize: 13.5, color: "var(--accent-rose)" }}>{formatMoney(stressedEMI)}/mo</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 10.5, color: "var(--text-muted)", display: "block" }}>NET OPERATING BUFFER</span>
                    <strong style={{ fontSize: 13.5, color: stressedOperatingProfit > stressedEMI ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                      {formatMoney(stressedOperatingProfit - stressedEMI)}/mo
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 10.5, color: "var(--text-muted)", display: "block" }}>STRESSED RUNWAY</span>
                    <strong style={{ fontSize: 13.5, color: "var(--accent-blue)" }}>{stressedRunwayDays} Days</strong>
                  </div>
                </div>

                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: riskTier.bg,
                    border: `1px solid ${riskTier.color}40`,
                    color: riskTier.color,
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}
                >
                  {dscrRatio >= 1.5 ? "✓ Solvency Shielded Against Tested Shock" : "⚠️ Risk Warning: Debt Restructuring Recommended"}
                </div>
              </div>
            </div>

            {/* The 6 Major Risk Pillars (All Major Risk Points Detailed) */}
            <div>
              <div style={{ marginBottom: 14 }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                  6 Major Credit & Solvency Risk Pillars
                </h4>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Exhaustive breakdown of all financial vulnerabilities, statutory liabilities, and protective mitigation protocols.
                </span>
              </div>

              <div className="grid-12" style={{ gap: 16 }}>
                {/* Pillar 1 */}
                <div
                  className="col-span-6 glass-card"
                  style={{
                    padding: 18,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="card-icon-wrap rose" style={{ width: 34, height: 34 }}>
                        <TrendingDown size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                          1. Default & Repayment Burden Risk
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Debt Service Squeeze & Inflow Volatility</span>
                      </div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(244,63,94,0.12)", color: "var(--accent-rose)", fontSize: 10.5, fontWeight: 700 }}>
                      HIGH SEVERITY
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    Taking excessive term debt without proportional revenue growth creates severe fixed operating drain. If collections contract by 20%, scheduled monthly EMI of <strong>{formatMoney(stressedEMI)}</strong> risks defaulting on payroll or supplier dues.
                  </p>
                  <div style={{ background: "var(--bg-secondary)", padding: "8px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Digital Twin Status:</strong> DSCR is currently <strong>{dscrRatio}x</strong>. {dscrRatio >= 1.5 ? "Operating cash flow is sufficient." : "Operating buffer is compressed."}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                    💡 <strong>Mitigation:</strong> Limit monthly EMI below 30% of average net operating cash. Apply for CGTMSE loans offering a 6–12 month principal moratorium.
                  </div>
                </div>

                {/* Pillar 2 */}
                <div
                  className="col-span-6 glass-card"
                  style={{
                    padding: 18,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="card-icon-wrap amber" style={{ width: 34, height: 34 }}>
                        <Scale size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                          2. Section 43B(h) Statutory Penalty Risk
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Income Tax Disallowance & Penal Interest</span>
                      </div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(245,158,11,0.12)", color: "var(--accent-amber)", fontSize: 10.5, fontWeight: 700 }}>
                      CRITICAL STATUTORY
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    Under Section 43B(h) of the Income Tax Act, failure to settle registered MSE vendor bills within 45 days permanently disallows tax deductions in that financial year, plus incurs compound penal interest at 3x the RBI Bank Rate (~19.5% p.a.).
                  </p>
                  <div style={{ background: "var(--bg-secondary)", padding: "8px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Digital Twin Status:</strong> 0 active statutory breaches. All vendor payments are tracked in the 45-day statutory radar.
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                    💡 <strong>Mitigation:</strong> Channel financing capital to clear vendor bills on Day 15; leverage TReDS factoring so suppliers are paid in 72h without balance-sheet debt.
                  </div>
                </div>

                {/* Pillar 3 */}
                <div
                  className="col-span-6 glass-card"
                  style={{
                    padding: 18,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="card-icon-wrap blue" style={{ width: 34, height: 34 }}>
                        <AlertOctagon size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                          3. Customer Concentration & Contagion Risk
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Debtor Dependency & Single-Buyer Freeze</span>
                      </div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.12)", color: "var(--accent-blue)", fontSize: 10.5, fontWeight: 700 }}>
                      HIGH CONCENTRATION
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    When over 50% of revenue flows from 2–3 enterprise clients, a delayed payment cycle or commercial dispute from one key buyer freezes your bank account and triggers immediate loan repayment distress.
                  </p>
                  <div style={{ background: "var(--bg-secondary)", padding: "8px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Digital Twin Status:</strong> Top 3 clients hold 64.2% of receivables book ({formatLakhs(eligibleReceivables)}).
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                    💡 <strong>Mitigation:</strong> Enforce non-recourse invoice factoring on Tier-1 debtors; purchase trade credit insurance for exposure exceeding ₹10 Lakhs.
                  </div>
                </div>

                {/* Pillar 4 */}
                <div
                  className="col-span-6 glass-card"
                  style={{
                    padding: 18,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="card-icon-wrap purple" style={{ width: 34, height: 34 }}>
                        <Flame size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                          4. Floating Interest Rate & Margin Call Risk
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Variable EBLR / Repo Shock Sensitivity</span>
                      </div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(139,92,246,0.12)", color: "var(--accent-purple)", fontSize: 10.5, fontWeight: 700 }}>
                      RATE SENSITIVE
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    Unsecured business loans and floating bank Cash Credit (CC) / Overdrafts tied to external benchmark lending rates (EBLR) rise automatically during central bank tightening, increasing total interest outflow substantially.
                  </p>
                  <div style={{ background: "var(--bg-secondary)", padding: "8px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Digital Twin Status:</strong> Effective interest: <strong>{effectiveStressRate.toFixed(2)}% p.a.</strong> (+{riskInterestHike} bps simulated shock).
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                    💡 <strong>Mitigation:</strong> Prioritize fixed-rate subsidized government schemes like PM Vishwakarma (fixed 5% p.a.) or lock in fixed-rate CGTMSE ceilings.
                  </div>
                </div>

                {/* Pillar 5 */}
                <div
                  className="col-span-6 glass-card"
                  style={{
                    padding: 18,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="card-icon-wrap emerald" style={{ width: 34, height: 34 }}>
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                          5. Collateral Lien & SARFAESI Foreclosure Risk
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Asset Seizure & Personal Guarantee Exposure</span>
                      </div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "var(--accent-emerald)", fontSize: 10.5, fontWeight: 700 }}>
                      ZERO COLLATERAL
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    Secured bank loans require mortgaging commercial or residential real estate. If non-performing for 90 days, lenders can invoke the SARFAESI Act to seize factory premises and personal property without civil court proceedings.
                  </p>
                  <div style={{ background: "var(--bg-secondary)", padding: "8px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Digital Twin Status:</strong> 100% Property Protection Qualified. Enterprise is eligible for CGTMSE collateral-free guarantee.
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                    💡 <strong>Mitigation:</strong> Strictly utilize CGTMSE / MUDRA credit schemes up to ₹5.00 Crore without pledging immovable property or primary residence.
                  </div>
                </div>

                {/* Pillar 6 */}
                <div
                  className="col-span-6 glass-card"
                  style={{
                    padding: 18,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="card-icon-wrap blue" style={{ width: 34, height: 34 }}>
                        <Activity size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
                          6. Capital Misallocation & Runway Burn Risk
                        </strong>
                        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Opex Burning vs Capex Asset Creation</span>
                      </div>
                    </div>
                    <span style={{ padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,0.12)", color: "var(--accent-blue)", fontSize: 10.5, fontWeight: 700 }}>
                      ALLOCATION PRUDENCE
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    Using term debt to subsidize operational cash burn (e.g. discounting goods below margin or absorbing excess overhead) rather than procuring yield-generating machinery accelerates runway exhaustion and permanent insolvency.
                  </p>
                  <div style={{ background: "var(--bg-secondary)", padding: "8px 10px", borderRadius: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                    <strong style={{ color: "var(--text-primary)" }}>Digital Twin Status:</strong> Projected runway with financing: <strong>{stressedRunwayDays} Days</strong>.
                  </div>
                  <div style={{ fontSize: 11, color: "var(--accent-emerald)", fontWeight: 600 }}>
                    💡 <strong>Mitigation:</strong> Establish a dedicated Capex Escrow Account; ensure all debt-funded assets yield minimum 18% Return on Capital Employed (ROCE).
                  </div>
                </div>

                {/* Pillar 7: Cash Recovery & Overdue Debtor Collection */}
                <div
                  className="col-span-12 glass-card"
                  style={{
                    padding: 20,
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    background: "linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(59, 130, 246, 0.08))",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="card-icon-wrap emerald" style={{ width: 40, height: 40 }}>
                        <Zap size={20} style={{ color: "#22c55e" }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 15, color: "var(--text-primary)", display: "block" }}>
                          7. ⚡ Autonomous Cash Recovery Option (WhatsApp & Email Direct Dispatch)
                        </strong>
                        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                          Recover trapped working capital directly from buyers/debtors without taking high-interest bank debt
                        </span>
                      </div>
                    </div>
                    <a
                      href="/invoices"
                      className="btn btn-emerald btn-sm"
                      style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                    >
                      <Zap size={14} />
                      <span>Launch Cash Recovery Hub</span>
                    </a>
                  </div>
                  <p style={{ fontSize: 12.5, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                    Under Section 43B(h) of the Income Tax Act & Section 16 of the MSMED Act, enterprise debtors past 45 days face tax deduction disallowance and 3x RBI compound penal interest (~19.5% p.a.). Sending structured legal demand notices directly over WhatsApp and official Email settles trapped receivables up to 3x faster than traditional follow-ups.
                  </p>
                </div>
              </div>
            </div>

            {/* Institutional Risk Mitigation & Compliance Action Checklist */}
            <div
              style={{
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 22px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                    Enterprise Risk Mitigation Action Checklist
                  </h4>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Operational checkpoints required to ensure institutional bank approval and insulate the digital twin against liquidity shocks.
                  </span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--accent-blue)" }}>
                  {Object.values(riskChecklist).filter(Boolean).length} / 6 Actions Completed
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
                {[
                  { key: "udyam", title: "Active Udyam Registration Certificate", desc: "Qualifies for priority lending, 0.5% interest concessions & CGTMSE guarantee fee discounts." },
                  { key: "gstRecon", title: "GSTR-2B vs 3B ITC Reconciliation", desc: "Eliminates tax audit disallowances and ensures rapid 48-hour automated bank credit assessment." },
                  { key: "treds", title: "RBI TReDS Onboarding & Digital Factoring", desc: "Liquidate corporate receivables in 72 hours without creating balance sheet debt liabilities." },
                  { key: "moratorium", title: "6–12 Month Principal Moratorium Request", desc: "Preserves operational liquidity during machinery setup or business capacity expansion." },
                  { key: "debtorInsurance", title: "Trade Credit Insurance on Top 3 Debtors", desc: "Insulates against insolvency contagion if a major client defaults on high-value invoices." },
                  { key: "escrowAccount", title: "Ring-Fenced Capex Escrow Protocol", desc: "Prevents accidental diversion of long-term capital into short-term operational burn." },
                ].map((item) => (
                  <div
                    key={item.key}
                    onClick={() => setRiskChecklist({ ...riskChecklist, [item.key]: !riskChecklist[item.key] })}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: riskChecklist[item.key] ? "rgba(16,185,129,0.08)" : "var(--bg-card)",
                      border: riskChecklist[item.key] ? "1px solid rgba(16,185,129,0.3)" : "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ marginTop: 2, color: riskChecklist[item.key] ? "var(--accent-emerald)" : "var(--text-muted)" }}>
                      {riskChecklist[item.key] ? <CheckCircle2 size={16} /> : <Square size={16} />}
                    </div>
                    <div>
                      <strong style={{ fontSize: 12.5, color: "var(--text-primary)", display: "block" }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4, display: "block", marginTop: 2 }}>
                        {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* JanSamarth National Single-Window Portal & Bank Integration Card */}
      <div
        className="glass-card"
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          background: "var(--bg-card)",
          border: "1px solid var(--border-medium)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(59,130,246,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-blue)" }}>
            <Landmark size={24} />
          </div>
          <div>
            <strong style={{ fontSize: 14, color: "var(--text-primary)", display: "block" }}>
              JanSamarth National Portal for Government Credit Schemes
            </strong>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-muted)", maxWidth: 640 }}>
              JanSamarth is the Government of India's single-window digital portal linking 13+ credit-linked schemes (PMEGP, MUDRA, Education, Agri) across 125+ Member Lending Institutions.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href="https://www.jansamarth.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
          >
            <span>Visit JanSamarth Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Scheme Detail & Application Modal */}
      {selectedOptionModal && (
        <div className="modal-backdrop" onClick={() => setSelectedOptionModal(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 660 }}
          >
            <div className="modal-header">
              <div>
                <div className="modal-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{selectedOptionModal.title}</span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: "rgba(16, 185, 129, 0.2)",
                      color: "#34d399",
                      fontWeight: 600,
                    }}
                  >
                    {selectedOptionModal.badge}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {selectedOptionModal.agency || selectedOptionModal.institution}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "14px 0" }}>
              {/* Financial Highlights */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div style={{ padding: 12, background: "var(--bg-secondary)", borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>FUNDING LIMIT</span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-blue)", marginTop: 2 }}>
                    {formatMoney(selectedOptionModal.fundingDisbursed)}
                  </div>
                </div>
                <div style={{ padding: 12, background: "var(--bg-secondary)", borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>INTEREST RATE / PRICING</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-amber)", marginTop: 2 }}>
                    {selectedOptionModal.costRate}
                  </div>
                </div>
                <div style={{ padding: 12, background: "var(--bg-secondary)", borderRadius: 8 }}>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                    {selectedOptionModal.monthlyEMI ? "MONTHLY EMI" : "DISBURSAL SPEED"}
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-emerald)", marginTop: 2 }}>
                    {selectedOptionModal.monthlyEMI ? formatMoney(selectedOptionModal.monthlyEMI) : selectedOptionModal.timeline}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <strong style={{ fontSize: 13, color: "var(--text-primary)", display: "block", marginBottom: 8 }}>
                  Scheme Highlights & Terms
                </strong>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {selectedOptionModal.features.map((f, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        padding: "8px 12px",
                        background: "var(--bg-secondary)",
                        borderRadius: 6,
                        fontSize: 12,
                        color: "var(--text-secondary)",
                      }}
                    >
                      <CheckCircle size={15} style={{ color: "#34d399", flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collateral & Security Note */}
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <strong style={{ fontSize: 12, color: "var(--accent-blue)" }}>Collateral Requirement:</strong>
                <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--text-secondary)" }}>
                  {selectedOptionModal.collateral}
                </p>
              </div>

              {/* Documentation Checklist */}
              <div>
                <strong style={{ fontSize: 12.5, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                  Required Document Package for Application
                </strong>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11.5, color: "var(--text-secondary)" }}>
                  <div>✓ Udyam Registration Certificate</div>
                  <div>✓ Last 6 Months Bank Statement</div>
                  <div>✓ GST Returns (GSTR-3B / GSTR-1)</div>
                  <div>✓ KYC (PAN, Aadhaar of Directors)</div>
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                {selectedOptionModal.portalUrl && selectedOptionModal.portalUrl !== "#" && (
                  <a
                    href={selectedOptionModal.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}
                  >
                    <span>Official Portal</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedOptionModal(null);
                    setShowDeepDiveRiskModal(true);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 700,
                    color: "var(--accent-rose)",
                    borderColor: "rgba(244,63,94,0.4)",
                  }}
                >
                  <ShieldAlert size={14} />
                  <span>Deep-Dive Risk Analysis</span>
                </button>

                <button className="btn btn-secondary" onClick={() => setSelectedOptionModal(null)}>
                  Close
                </button>
                {selectedOptionModal.id === "market_cash_recovery" ? (
                  <a
                    href="/invoices"
                    className="btn btn-emerald"
                    style={{ textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Zap size={14} />
                    <span>Launch Cash Recovery Hub</span>
                  </a>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleExportLoanDossier();
                      alert(`Loan Proposal Dossier downloaded! You can submit this directly on the portal or to your bank branch.`);
                      setSelectedOptionModal(null);
                    }}
                  >
                    Generate Application Dossier
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep-Dive Institutional Risk Underwriting Modal */}
      {showDeepDiveRiskModal && (
        <DeepDiveRiskModal
          onClose={() => setShowDeepDiveRiskModal(false)}
          onOpenRecovery={() => {
            setShowDeepDiveRiskModal(false);
            navigate("/invoices");
          }}
        />
      )}
    </div>
  );
}