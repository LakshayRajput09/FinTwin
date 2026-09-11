import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Brain,
  TrendingDown,
  TrendingUp,
  Clock,
  RotateCcw,
  BarChart3,
  LineChart as LineChartIcon,
  Layers,
  Sparkles,
  ShieldAlert,
  Users,
  Building,
  Landmark,
  CreditCard,
  Zap,
  Percent,
  CheckCircle2,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

import ModulePage from "../components/ModulePage";
import { getFinancialData, subscribeFinancialData } from "../data/financialStore";
import { API_URL } from "../config";
import { useTheme } from "../context/ThemeContext";

// ==========================================
// LOCAL DIGITAL TWIN SIMULATION ENGINE
// ==========================================
function buildLocalSimulation(
  data,
  revenueChange,
  expenseChange,
  paymentDelay,
  customerDefault,
  rawMaterialInflation,
  payrollHike,
  taxOutflow,
  loanEmi,
  tredsDiscount,
  govtSubsidy,
  sec43bOverdue = 0,
  repoRateHike = 0,
  capexOutflow = 0,
  itcReversal = 0,
  cashRecoveryRelief = 0,
  supplierDiscount = 0,
  exportSurge = 0
) {
  const currentCash = Number(data.business?.openingCash || 0);
  const receivables = (data.invoices || [])
    .filter((inv) => String(inv.status || "").toLowerCase() !== "paid")
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const recurring = (data.recurringExpenses || []).reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const oneTime = (data.expenses || []).reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const totalExpenses = recurring + oneTime;
  const netPosition = currentCash + receivables - totalExpenses;

  const base = {
    current_cash: currentCash,
    receivables,
    recurring_expenses: recurring,
    one_time_expenses: oneTime,
    total_expenses: totalExpenses,
    net_position: netPosition,
  };

  const classify = (cash, gap) => (gap > 0 || cash <= 0 ? "HIGH" : cash < 150000 ? "MEDIUM" : "LOW");

  // 1. Revenue Shock
  const adjRev = receivables * (1 + revenueChange / 100);
  const revImpact = adjRev - receivables;
  const revCash = currentCash + adjRev - totalExpenses;

  // 2. Operating Expense Shock
  const adjExp = totalExpenses * (1 + expenseChange / 100);
  const expImpact = totalExpenses - adjExp;
  const expCash = currentCash + receivables - adjExp;

  // 3. Payment Delay Shock
  const delayPct = paymentDelay <= 0 ? 0 : paymentDelay <= 15 ? 25 : paymentDelay <= 30 ? 50 : paymentDelay <= 60 ? 75 : 100;
  const delayedAmt = (receivables * delayPct) / 100;
  const delayCash = currentCash + (receivables - delayedAmt) - totalExpenses;

  // 4. Customer Default Shock
  const defaultedAmt = (receivables * (customerDefault || 0)) / 100;
  const defaultCash = currentCash + (receivables - defaultedAmt) - totalExpenses;

  // 5. Raw Material Inflation Shock
  const rawMaterialBase = totalExpenses * 0.45;
  const rawMaterialSurge = (rawMaterialBase * (rawMaterialInflation || 0)) / 100;
  const rawMaterialCash = currentCash + receivables - (totalExpenses + rawMaterialSurge);

  // 6. Payroll Hike Shock
  const payrollBase = recurring * 0.40;
  const payrollSurge = (payrollBase * (payrollHike || 0)) / 100;
  const payrollCash = currentCash + receivables - (totalExpenses + payrollSurge);

  // 7. Tax Outflow Shock
  const taxCash = netPosition - Number(taxOutflow || 0);

  // 8. Bank Loan EMI Burden (3 months)
  const emiQuarterly = Number(loanEmi || 0) * 3;
  const loanCash = netPosition - emiQuarterly;

  // 9. Section 43B(h) Delay & 3x RBI Penal Compound Interest Shock
  const overdueRatio = sec43bOverdue <= 0 ? 0 : Math.min(1.0, 0.35 + (sec43bOverdue / 100));
  const overdue43bAmt = receivables * overdueRatio;
  const sec43bPenalInterest = Math.round(overdue43bAmt * 0.195 * (Math.max(15, sec43bOverdue) / 365));
  const sec43bTaxDisallowance = sec43bOverdue > 45 ? Math.round(overdue43bAmt * 0.30 * 0.25) : 0;
  const sec43bTotalHit = sec43bOverdue > 0 ? (sec43bPenalInterest + sec43bTaxDisallowance) : 0;
  const sec43bCash = netPosition - sec43bTotalHit;

  // 10. RBI Repo Rate Hike on Bank OD/CC (+bps)
  const repoQuarterlySurge = Math.round(2000000 * ((repoRateHike || 0) / 10000) * (3 / 12));
  const repoRateCash = netPosition - repoQuarterlySurge;

  // 11. Capex Machinery & Tooling Outflow
  const capexCash = netPosition - Number(capexOutflow || 0);

  // 12. GST ITC Reversal & GSTR-2B Lockup
  const itcCash = netPosition - Number(itcReversal || 0);

  // 13. Export Bulk Order Working Capital Strain
  const exportUpfrontCost = Math.round((totalExpenses * 0.45) * ((exportSurge || 0) / 100));
  const exportNetCash = netPosition - exportUpfrontCost;

  // 14. Autonomous WhatsApp & Email Cash Recovery (Relief)
  const trappedForRecovery = delayedAmt > 0 ? delayedAmt : (receivables * 0.65);
  const recoveredCash = Math.round((trappedForRecovery * (cashRecoveryRelief || 0)) / 100);
  const recoveryCash = netPosition + recoveredCash;

  // 15. Early Supplier Cash Discount (2/10 Net 30 Relief)
  const discountSavings = Math.round((totalExpenses * 0.45) * ((supplierDiscount || 0) / 100));
  const discountCash = netPosition + discountSavings;

  // 16. TReDS Early Invoice Discounting (Relief)
  const tredsVol = (receivables * Math.min(85, Number(tredsDiscount || 0))) / 100;
  const tredsFee = tredsVol * 0.015;
  const tredsInflow = tredsVol - tredsFee;
  const tredsCash = currentCash + tredsInflow + (receivables - tredsVol) - totalExpenses;

  // 17. Government Subsidy Grant (Relief)
  const subsidyCash = netPosition + Number(govtSubsidy || 0);

  // 18. Integrated Combined Reality
  const combAdjRev = receivables * (1 + revenueChange / 100);
  const combDefaultLoss = (combAdjRev * (customerDefault || 0)) / 100;
  const combPostDefault = Math.max(0, combAdjRev - combDefaultLoss);
  const combTrapped = (combPostDefault * delayPct) / 100;
  const combAvailRev = combPostDefault - combTrapped;

  const combTredsVol = (combTrapped * Math.min(85, Number(tredsDiscount || 0))) / 100;
  const combTredsInflow = combTredsVol * 0.985;

  const combGeneralExp = totalExpenses * (1 + expenseChange / 100);
  const combRawMaterialSurge = (totalExpenses * 0.45 * (rawMaterialInflation || 0)) / 100;
  const combPayrollSurge = (recurring * 0.40 * (payrollHike || 0)) / 100;
  const combExpenses = combGeneralExp + combRawMaterialSurge + combPayrollSurge + emiQuarterly;

  const combinedCash =
    currentCash +
    combAvailRev +
    combTredsInflow +
    recoveredCash +
    discountSavings +
    Number(govtSubsidy || 0) -
    combExpenses -
    Number(taxOutflow || 0) -
    sec43bTotalHit -
    repoQuarterlySurge -
    Number(capexOutflow || 0) -
    Number(itcReversal || 0) -
    exportUpfrontCost;

  return {
    base,
    assumptions: {
      revenue_change_percent: revenueChange,
      expense_change_percent: expenseChange,
      payment_delay_days: paymentDelay,
      customer_default_percent: customerDefault,
      raw_material_inflation_percent: rawMaterialInflation,
      payroll_hike_percent: payrollHike,
      tax_outflow_amount: taxOutflow,
      loan_emi_amount: loanEmi,
      treds_discount_percent: tredsDiscount,
      govt_subsidy_amount: govtSubsidy,
      sec43b_overdue_days: sec43bOverdue,
      repo_rate_hike_bps: repoRateHike,
      capex_outflow_amount: capexOutflow,
      itc_reversal_amount: itcReversal,
      cash_recovery_percent: cashRecoveryRelief,
      supplier_discount_percent: supplierDiscount,
      export_surge_percent: exportSurge,
    },
    scenarios: [
      {
        scenario: "Base Case (Current)",
        parameter: "Normal Operations",
        projected_cash: netPosition,
        cash_impact: 0,
        liquidity_gap: Math.max(0, -netPosition),
        risk: classify(netPosition, Math.max(0, -netPosition)),
        explanation: "Current financial baseline without external shocks.",
      },
      {
        scenario: "Combined Reality",
        parameter: "All Shocks & Reliefs Integrated",
        projected_cash: combinedCash,
        cash_impact: combinedCash - netPosition,
        liquidity_gap: Math.max(0, -combinedCash),
        risk: classify(combinedCash, Math.max(0, -combinedCash)),
        explanation: combinedCash <= 0
          ? "Combined multi-factor stress triggers a liquidity deficit. Implement relief levers immediately."
          : "Combined stress absorbed with remaining positive cash buffer.",
      },
      {
        scenario: "Revenue Shock",
        parameter: `${revenueChange > 0 ? "+" : ""}${revenueChange}% Demand`,
        projected_cash: revCash,
        cash_impact: revImpact,
        liquidity_gap: Math.max(0, -revCash),
        risk: classify(revCash, Math.max(0, -revCash)),
        explanation: revCash <= 0 ? "Revenue contraction creates an operating shortfall." : "Sales shift sustained within liquid reserves.",
      },
      {
        scenario: "Payment Delay Shock",
        parameter: `${paymentDelay}d Delay (${delayPct}% trapped)`,
        projected_cash: delayCash,
        cash_impact: -delayedAmt,
        liquidity_gap: Math.max(0, -delayCash),
        risk: classify(delayCash, Math.max(0, -delayCash)),
        explanation: `Customer lag locks ₹${delayedAmt.toLocaleString("en-IN")} in overdue credit.`,
      },
      {
        scenario: "Top Client Default",
        parameter: `${customerDefault}% Bad Debt Write-off`,
        projected_cash: defaultCash,
        cash_impact: -defaultedAmt,
        liquidity_gap: Math.max(0, -defaultCash),
        risk: classify(defaultCash, Math.max(0, -defaultCash)),
        explanation: `Permanent loss of ₹${defaultedAmt.toLocaleString("en-IN")} in written-off invoices.`,
      },
      {
        scenario: "Raw Material Inflation",
        parameter: `+${rawMaterialInflation}% Procurement Cost`,
        projected_cash: rawMaterialCash,
        cash_impact: -rawMaterialSurge,
        liquidity_gap: Math.max(0, -rawMaterialCash),
        risk: classify(rawMaterialCash, Math.max(0, -rawMaterialCash)),
        explanation: `Supply chain inflation adds ₹${rawMaterialSurge.toLocaleString("en-IN")} to monthly manufacturing costs.`,
      },
      {
        scenario: "Section 43B(h) Delay & Penal Shock",
        parameter: `${sec43bOverdue}d Overdue (3x RBI Interest)`,
        projected_cash: sec43bCash,
        cash_impact: -sec43bTotalHit,
        liquidity_gap: Math.max(0, -sec43bCash),
        risk: classify(sec43bCash, Math.max(0, -sec43bCash)),
        explanation: `MSE payments past 45 days incur 3x RBI bank rate (~19.5%) compound interest and statutory income tax disallowances.`,
      },
      {
        scenario: "RBI Repo Rate Hike on Bank OD/CC",
        parameter: `+${repoRateHike} bps Floating Rate Hike`,
        projected_cash: repoRateCash,
        cash_impact: -repoQuarterlySurge,
        liquidity_gap: Math.max(0, -repoRateCash),
        risk: classify(repoRateCash, Math.max(0, -repoRateCash)),
        explanation: `Higher repo rate increases quarterly borrowing costs by ₹${repoQuarterlySurge.toLocaleString("en-IN")} on bank credit lines.`,
      },
      {
        scenario: "GST ITC Reversal & Supplier Freeze",
        parameter: `₹${Number(itcReversal || 0).toLocaleString("en-IN")} ITC Reversal`,
        projected_cash: itcCash,
        cash_impact: -Number(itcReversal || 0),
        liquidity_gap: Math.max(0, -itcCash),
        risk: classify(itcCash, Math.max(0, -itcCash)),
        explanation: `GSTR-2B non-compliance by suppliers triggers Input Tax Credit reversal liability.`,
      },
      {
        scenario: "Capex Machinery Acquisition",
        parameter: `₹${Number(capexOutflow || 0).toLocaleString("en-IN")} Down-payment`,
        projected_cash: capexCash,
        cash_impact: -Number(capexOutflow || 0),
        liquidity_gap: Math.max(0, -capexCash),
        risk: classify(capexCash, Math.max(0, -capexCash)),
        explanation: `Direct capital expenditure for plant automation and capacity expansion.`,
      },
      {
        scenario: "Team Payroll Expansion",
        parameter: `+${payrollHike}% Wage / Hiring Surge`,
        projected_cash: payrollCash,
        cash_impact: -payrollSurge,
        liquidity_gap: Math.max(0, -payrollCash),
        risk: classify(payrollCash, Math.max(0, -payrollCash)),
        explanation: `Payroll increment or new hires add ₹${payrollSurge.toLocaleString("en-IN")} in recurring monthly liabilities.`,
      },
      {
        scenario: "GST & Tax Settlement",
        parameter: `₹${Number(taxOutflow || 0).toLocaleString("en-IN")} Tax Due`,
        projected_cash: taxCash,
        cash_impact: -Number(taxOutflow || 0),
        liquidity_gap: Math.max(0, -taxCash),
        risk: classify(taxCash, Math.max(0, -taxCash)),
        explanation: `Statutory GST and Advance Tax settlement requires lump-sum outflow of ₹${Number(taxOutflow || 0).toLocaleString("en-IN")}.`,
      },
      {
        scenario: "Bank Loan EMI Servicing",
        parameter: `₹${Number(loanEmi || 0).toLocaleString("en-IN")} / mo EMI`,
        projected_cash: loanCash,
        cash_impact: -emiQuarterly,
        liquidity_gap: Math.max(0, -loanCash),
        risk: classify(loanCash, Math.max(0, -loanCash)),
        explanation: `3 months of principal & interest installments consume ₹${emiQuarterly.toLocaleString("en-IN")}.`,
      },
      {
        scenario: "Operating Expense Surge",
        parameter: `${expenseChange > 0 ? "+" : ""}${expenseChange}% General Opex`,
        projected_cash: expCash,
        cash_impact: expImpact,
        liquidity_gap: Math.max(0, -expCash),
        risk: classify(expCash, Math.max(0, -expCash)),
        explanation: "General operational expenditure increase across utilities and administration.",
      },
      {
        scenario: "Export Order Working Capital Strain",
        parameter: `+${exportSurge}% Order Volume Stretch`,
        projected_cash: exportNetCash,
        cash_impact: -exportUpfrontCost,
        liquidity_gap: Math.max(0, -exportNetCash),
        risk: classify(exportNetCash, Math.max(0, -exportNetCash)),
        explanation: `High-volume export order requires upfront raw material procurement 60 days before LC payment realization.`,
      },
      {
        scenario: "⚡ Autonomous Cash Recovery Blitz",
        parameter: `${cashRecoveryRelief}% Trapped Cash Recovered`,
        projected_cash: recoveryCash,
        cash_impact: recoveredCash,
        liquidity_gap: Math.max(0, -recoveryCash),
        risk: classify(recoveryCash, Math.max(0, -recoveryCash)),
        is_relief: true,
        explanation: `Pre-litigation MSME statutory notices recover ₹${recoveredCash.toLocaleString("en-IN")} via WhatsApp & Email dispatch.`,
      },
      {
        scenario: "⚡ TReDS Early Discounting",
        parameter: `${tredsDiscount}% Receivables Discounted`,
        projected_cash: tredsCash,
        cash_impact: tredsInflow - (receivables * (tredsDiscount || 0)) / 100,
        liquidity_gap: Math.max(0, -tredsCash),
        risk: classify(tredsCash, Math.max(0, -tredsCash)),
        is_relief: true,
        explanation: `Unlocks ₹${tredsInflow.toLocaleString("en-IN")} in instant liquid cash within 24h at 1.5% institutional fee.`,
      },
      {
        scenario: "🤝 Early Supplier Cash Discount (2/10 Net 30)",
        parameter: `${supplierDiscount}% Prompt Payment Savings`,
        projected_cash: discountCash,
        cash_impact: discountSavings,
        liquidity_gap: Math.max(0, -discountCash),
        risk: classify(discountCash, Math.max(0, -discountCash)),
        is_relief: true,
        explanation: `Paying vendors within 10 days captures ₹${discountSavings.toLocaleString("en-IN")} in prompt payment discounts.`,
      },
      {
        scenario: "🇮🇳 Govt MSME Capital Grant",
        parameter: `₹${Number(govtSubsidy || 0).toLocaleString("en-IN")} Capital Subsidy`,
        projected_cash: subsidyCash,
        cash_impact: Number(govtSubsidy || 0),
        liquidity_gap: Math.max(0, -subsidyCash),
        risk: classify(subsidyCash, Math.max(0, -subsidyCash)),
        is_relief: true,
        explanation: `Non-repayable PMEGP / PM Vishwakarma capital subsidy directly crediting ₹${Number(govtSubsidy || 0).toLocaleString("en-IN")}.`,
      },
    ],
  };
}

export default function Simulator() {
  const { currentTheme } = useTheme();

  // Core Parameters
  const [revenueChange, setRevenueChange] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);
  const [paymentDelay, setPaymentDelay] = useState(0);

  // New Aspects
  const [customerDefault, setCustomerDefault] = useState(0); // 0 to 50%
  const [rawMaterialInflation, setRawMaterialInflation] = useState(0); // 0 to 40%
  const [payrollHike, setPayrollHike] = useState(0); // 0 to 30%
  const [taxOutflow, setTaxOutflow] = useState(0); // 0 to 10L
  const [loanEmi, setLoanEmi] = useState(0); // 0 to 2L/mo
  const [tredsDiscount, setTredsDiscount] = useState(0); // 0 to 80% (relief)
  const [govtSubsidy, setGovtSubsidy] = useState(0); // 0 to 10L (relief)

  // Additional Real-World MSME Stress & Relief Levers
  const [sec43bOverdue, setSec43bOverdue] = useState(0); // 0 to 60 days (3x RBI interest)
  const [repoRateHike, setRepoRateHike] = useState(0); // 0 to 300 bps (+0.5% to +3.0%)
  const [capexOutflow, setCapexOutflow] = useState(0); // 0 to 10L
  const [itcReversal, setItcReversal] = useState(0); // 0 to 2.5L
  const [cashRecoveryRelief, setCashRecoveryRelief] = useState(0); // 0 to 100% (Relief)
  const [supplierDiscount, setSupplierDiscount] = useState(0); // 0 to 5% (Relief)
  const [exportSurge, setExportSurge] = useState(0); // 0 to 60%

  // UI state
  const [activeTab, setActiveTab] = useState("sales"); // "sales" | "operations" | "statutory" | "capex" | "relief"
  const [activeChartTab, setActiveChartTab] = useState("bar"); // "bar" | "trajectory" | "matrix"
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // AUTO-SYNC WITH STORE & PARAMETERS
  // ==========================================
  useEffect(() => {
    runSimulation();
    const unsub = subscribeFinancialData(() => {
      runSimulation();
    });
    return unsub;
  }, [
    revenueChange,
    expenseChange,
    paymentDelay,
    customerDefault,
    rawMaterialInflation,
    payrollHike,
    taxOutflow,
    loanEmi,
    tredsDiscount,
    govtSubsidy,
    sec43bOverdue,
    repoRateHike,
    capexOutflow,
    itcReversal,
    cashRecoveryRelief,
    supplierDiscount,
    exportSurge,
  ]);

  function formatMoney(amount) {
    const value = Number(amount || 0);
    const absolute = Math.abs(value);

    if (absolute >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (absolute >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    if (absolute >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value.toFixed(0)}`;
  }

  function getRiskClass(risk) {
    const value = String(risk || "LOW").toUpperCase();
    if (value === "HIGH") return "risk-high";
    if (value === "MEDIUM") return "risk-medium";
    return "risk-low";
  }

  async function runSimulation() {
    try {
      setLoading(true);
      setError("");

      const data = getFinancialData();

      try {
        const response = await fetch(`${API_URL}/api/simulator`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current_cash: Number(data.business?.openingCash || 0),
            invoices: data.invoices || [],
            recurring_expenses: data.recurringExpenses || [],
            one_time_expenses: data.expenses || [],
            revenue_change_percent: Number(revenueChange || 0),
            expense_change_percent: Number(expenseChange || 0),
            payment_delay_days: Number(paymentDelay || 0),
            customer_default_percent: Number(customerDefault || 0),
            raw_material_inflation_percent: Number(rawMaterialInflation || 0),
            payroll_hike_percent: Number(payrollHike || 0),
            tax_outflow_amount: Number(taxOutflow || 0),
            loan_emi_amount: Number(loanEmi || 0),
            treds_discount_percent: Number(tredsDiscount || 0),
            govt_subsidy_amount: Number(govtSubsidy || 0),
            sec43b_overdue_days: Number(sec43bOverdue || 0),
            repo_rate_hike_bps: Number(repoRateHike || 0),
            capex_outflow_amount: Number(capexOutflow || 0),
            itc_reversal_amount: Number(itcReversal || 0),
            cash_recovery_percent: Number(cashRecoveryRelief || 0),
            supplier_discount_percent: Number(supplierDiscount || 0),
            export_surge_percent: Number(exportSurge || 0),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.simulation) {
            setSimulation(result.simulation);
            return;
          }
        }
      } catch (networkErr) {
        console.warn("Backend simulator unavailable, falling back to local engine:", networkErr);
      }

      // Local Digital Twin Engine Fallback
      const localSim = buildLocalSimulation(
        data,
        revenueChange,
        expenseChange,
        paymentDelay,
        customerDefault,
        rawMaterialInflation,
        payrollHike,
        taxOutflow,
        loanEmi,
        tredsDiscount,
        govtSubsidy,
        sec43bOverdue,
        repoRateHike,
        capexOutflow,
        itcReversal,
        cashRecoveryRelief,
        supplierDiscount,
        exportSurge
      );
      setSimulation(localSim);
    } catch (err) {
      console.error("Simulator error:", err);
      setError(err.message || "Unable to run simulation.");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // 1-CLICK PRESETS
  // ==========================================
  function applyPreset(presetName) {
    if (presetName === "black_swan") {
      setRevenueChange(-30);
      setExpenseChange(15);
      setPaymentDelay(45);
      setCustomerDefault(20);
      setRawMaterialInflation(25);
      setPayrollHike(10);
      setTaxOutflow(200000);
      setLoanEmi(35000);
      setSec43bOverdue(45);
      setRepoRateHike(200);
      setCapexOutflow(0);
      setItcReversal(120000);
      setCashRecoveryRelief(0);
      setSupplierDiscount(0);
      setExportSurge(0);
      setTredsDiscount(0);
      setGovtSubsidy(0);
    } else if (presetName === "sec43b_squeeze") {
      setRevenueChange(-10);
      setExpenseChange(5);
      setPaymentDelay(50);
      setCustomerDefault(10);
      setRawMaterialInflation(10);
      setPayrollHike(0);
      setTaxOutflow(180000);
      setLoanEmi(20000);
      setSec43bOverdue(55);
      setRepoRateHike(100);
      setCapexOutflow(0);
      setItcReversal(80000);
      setCashRecoveryRelief(0);
      setSupplierDiscount(0);
      setExportSurge(0);
      setTredsDiscount(0);
      setGovtSubsidy(0);
    } else if (presetName === "repo_hike") {
      setRevenueChange(0);
      setExpenseChange(12);
      setPaymentDelay(15);
      setCustomerDefault(0);
      setRawMaterialInflation(15);
      setPayrollHike(5);
      setTaxOutflow(50000);
      setLoanEmi(65000);
      setSec43bOverdue(10);
      setRepoRateHike(250);
      setCapexOutflow(0);
      setItcReversal(0);
      setCashRecoveryRelief(0);
      setSupplierDiscount(0);
      setExportSurge(0);
      setTredsDiscount(20);
      setGovtSubsidy(0);
    } else if (presetName === "capex_expansion") {
      setRevenueChange(35);
      setExpenseChange(15);
      setPaymentDelay(10);
      setCustomerDefault(0);
      setRawMaterialInflation(10);
      setPayrollHike(25);
      setTaxOutflow(100000);
      setLoanEmi(50000);
      setSec43bOverdue(0);
      setRepoRateHike(100);
      setCapexOutflow(500000);
      setItcReversal(0);
      setCashRecoveryRelief(40);
      setSupplierDiscount(2.5);
      setExportSurge(25);
      setTredsDiscount(40);
      setGovtSubsidy(250000);
    } else if (presetName === "itc_lockup") {
      setRevenueChange(0);
      setExpenseChange(8);
      setPaymentDelay(25);
      setCustomerDefault(5);
      setRawMaterialInflation(10);
      setPayrollHike(0);
      setTaxOutflow(150000);
      setLoanEmi(15000);
      setSec43bOverdue(20);
      setRepoRateHike(0);
      setCapexOutflow(0);
      setItcReversal(180000);
      setCashRecoveryRelief(20);
      setSupplierDiscount(0);
      setExportSurge(0);
      setTredsDiscount(15);
      setGovtSubsidy(0);
    } else if (presetName === "cash_recovery_blitz") {
      setRevenueChange(5);
      setExpenseChange(0);
      setPaymentDelay(45);
      setCustomerDefault(0);
      setRawMaterialInflation(5);
      setPayrollHike(0);
      setTaxOutflow(50000);
      setLoanEmi(15000);
      setSec43bOverdue(40);
      setRepoRateHike(0);
      setCapexOutflow(0);
      setItcReversal(0);
      setCashRecoveryRelief(90);
      setSupplierDiscount(2);
      setExportSurge(10);
      setTredsDiscount(60);
      setGovtSubsidy(150000);
    } else if (presetName === "export_surge") {
      setRevenueChange(55);
      setExpenseChange(20);
      setPaymentDelay(45);
      setCustomerDefault(0);
      setRawMaterialInflation(30);
      setPayrollHike(20);
      setTaxOutflow(120000);
      setLoanEmi(30000);
      setSec43bOverdue(0);
      setRepoRateHike(150);
      setCapexOutflow(200000);
      setItcReversal(0);
      setCashRecoveryRelief(50);
      setSupplierDiscount(3);
      setExportSurge(50);
      setTredsDiscount(70);
      setGovtSubsidy(200000);
    } else if (presetName === "treds_relief") {
      // Mitigated version of crisis
      setRevenueChange(-20);
      setExpenseChange(10);
      setPaymentDelay(30);
      setCustomerDefault(10);
      setRawMaterialInflation(15);
      setPayrollHike(5);
      setTaxOutflow(100000);
      setLoanEmi(25000);
      setSec43bOverdue(20);
      setRepoRateHike(100);
      setCapexOutflow(0);
      setItcReversal(50000);
      setCashRecoveryRelief(60);
      setSupplierDiscount(2);
      setExportSurge(0);
      setTredsDiscount(75);
      setGovtSubsidy(300000);
    } else if (presetName === "supply_chain") {
      setRevenueChange(0);
      setExpenseChange(10);
      setPaymentDelay(20);
      setCustomerDefault(0);
      setRawMaterialInflation(35);
      setPayrollHike(0);
      setTaxOutflow(50000);
      setLoanEmi(0);
      setSec43bOverdue(0);
      setRepoRateHike(50);
      setCapexOutflow(0);
      setItcReversal(40000);
      setCashRecoveryRelief(30);
      setSupplierDiscount(1);
      setExportSurge(0);
      setTredsDiscount(30);
      setGovtSubsidy(0);
    } else if (presetName === "expansion") {
      setRevenueChange(35);
      setExpenseChange(10);
      setPaymentDelay(10);
      setCustomerDefault(0);
      setRawMaterialInflation(10);
      setPayrollHike(25);
      setTaxOutflow(150000);
      setLoanEmi(60000);
      setSec43bOverdue(0);
      setRepoRateHike(100);
      setCapexOutflow(300000);
      setItcReversal(0);
      setCashRecoveryRelief(40);
      setSupplierDiscount(2);
      setExportSurge(20);
      setTredsDiscount(40);
      setGovtSubsidy(200000);
    } else {
      // Reset
      setRevenueChange(0);
      setExpenseChange(0);
      setPaymentDelay(0);
      setCustomerDefault(0);
      setRawMaterialInflation(0);
      setPayrollHike(0);
      setTaxOutflow(0);
      setLoanEmi(0);
      setSec43bOverdue(0);
      setRepoRateHike(0);
      setCapexOutflow(0);
      setItcReversal(0);
      setCashRecoveryRelief(0);
      setSupplierDiscount(0);
      setExportSurge(0);
      setTredsDiscount(0);
      setGovtSubsidy(0);
    }
  }

  // Bar Chart Data
  const comparisonChartData =
    simulation?.scenarios?.map((s) => ({
      name: s.scenario.length > 18 ? s.scenario.slice(0, 16) + "..." : s.scenario,
      fullName: s.scenario,
      parameter: s.parameter,
      projectedCash: Math.round(s.projected_cash || 0),
      liquidityGap: Math.round(s.liquidity_gap || 0),
      cashImpact: Math.round(s.cash_impact || 0),
      risk: s.risk,
      isRelief: s.is_relief || false,
    })) || [];

  // Generate 90-Day Trajectory Curve
  const trajectoryData = [];
  if (simulation) {
    const data = getFinancialData();
    const currentCash = Number(simulation.base?.current_cash || 0);
    const pendingInvoices = (data.invoices || []).filter((i) => i.status !== "Paid");
    const totalExpenses = Number(simulation.base?.total_expenses || 0);
    const dailyBaseBurn = totalExpenses / 30;

    const stressedExp = totalExpenses * (1 + expenseChange / 100) + (totalExpenses * 0.45 * rawMaterialInflation) / 100 + (simulation.base?.recurring_expenses * 0.4 * payrollHike) / 100 + loanEmi;
    const dailyStressedBurn = stressedExp / 30;
    const now = new Date();

    const invoiceSchedules = pendingInvoices.map((inv) => {
      const amt = Number(inv.amount || 0);
      const due = new Date(inv.dueDate || now);
      const daysUntilDue = Math.max(0, Math.round((due - now) / (1000 * 60 * 60 * 24)));
      const delay = Number(inv.predictedDelayDays || 5);
      return {
        amount: amt,
        baseArrivalDay: daysUntilDue + delay,
        stressedArrivalDay: daysUntilDue + delay + Number(paymentDelay || 0),
      };
    });

    for (let d = 0; d <= 90; d += 5) {
      const baseInflow = invoiceSchedules
        .filter((s) => s.baseArrivalDay <= d)
        .reduce((sum, s) => sum + s.amount, 0);

      const stressedInflow = invoiceSchedules
        .filter((s) => s.stressedArrivalDay <= d)
        .reduce((sum, s) => sum + Math.round(s.amount * (1 + revenueChange / 100) * (1 - customerDefault / 100)), 0);

      const baseCash = Math.round(currentCash + baseInflow - dailyBaseBurn * d);
      const stressedCash = Math.round(currentCash + stressedInflow - dailyStressedBurn * d - (d >= 30 ? taxOutflow : 0));
      const reliefBoost = d >= 5 ? ((simulation.base?.receivables || 0) * (tredsDiscount / 100) * 0.985 + (govtSubsidy || 0)) : 0;
      const reliefCash = Math.round(stressedCash + reliefBoost);

      trajectoryData.push({
        day: `Day ${d}`,
        dayNum: d,
        baseline: baseCash,
        stressed: stressedCash,
        withRelief: reliefCash,
        zeroLine: 0,
      });
    }
  }

  const combinedScenario = simulation?.scenarios?.find((s) => s.scenario.includes("Combined")) || simulation?.scenarios?.[1];

  return (
    <ModulePage
      title="What-If Scenario Planner"
      description="Simulate real-world business shocks, debt burdens, and liquidity relief levers before making major decisions."
    >
      {/* =================================================================
          TOP INTRO HERO & 1-CLICK PRESET BUTTONS
          ================================================================= */}
      <div className="pictorial-hero-card" style={{ padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span className="pictorial-badge purple" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Brain size={13} />
                <span>Multi-Factor Digital Twin</span>
              </span>
              <span className="pictorial-badge cyan">9 Financial Aspects</span>
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "4px 0 8px" }}>
              Test Any Business Scenario With Complete Peace of Mind
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>
              Adjust sales demand, customer defaults, raw material inflation, GST payments, and test how <strong>TReDS early invoice discounting</strong> or <strong>government grants</strong> protect your bank balance.
            </p>

            {/* Quick 1-Click Presets */}
            <div className="mobile-scroll-x" style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 4 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("black_swan")}
                title="Simulate sudden sales drop, 45d delay, and raw material inflation"
                style={{ background: "rgba(225,29,72,0.08)", borderColor: "rgba(225,29,72,0.25)", color: "var(--accent-rose)", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                🌪️ Black Swan Crisis
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("sec43b_squeeze")}
                title="Simulate 55d overdue buyer delay, 3x RBI penal compound interest, and 30% tax disallowance"
                style={{ background: "rgba(244,63,94,0.08)", borderColor: "rgba(244,63,94,0.3)", color: "var(--accent-rose)", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                ⚖️ Sec 43B(h) Squeeze
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("repo_hike")}
                title="Simulate +250 bps RBI repo rate hike on floating bank overdraft/CC"
                style={{ fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                🏛️ Repo Rate Hike (+250 bps)
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("itc_lockup")}
                title="Simulate ₹1.8L Input Tax Credit reversal due to non-compliant GSTR-2B vendors"
                style={{ fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                📋 ITC Reversal Freeze
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("export_surge")}
                title="Simulate +55% export demand with high upfront raw material investment"
                style={{ fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                🚢 Export Order Stretch
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("capex_expansion")}
                title="Simulate ₹5L plant machinery downpayment with growth scaling"
                style={{ fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                🏭 Capex Scaling
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("supply_chain")}
                title="Simulate severe raw material cost inflation"
                style={{ fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                📦 Supply Chain Squeeze
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("cash_recovery_blitz")}
                title="Simulate recovering 90% trapped receivables via WhatsApp/Email legal notices"
                style={{ background: "rgba(5,150,105,0.08)", borderColor: "rgba(5,150,105,0.3)", color: "var(--accent-emerald)", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                ⚡ Recovery Hub Blitz
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("treds_relief")}
                title="Apply 75% TReDS Discounting & ₹3L Govt Grant"
                style={{ background: "rgba(5,150,105,0.08)", borderColor: "rgba(5,150,105,0.25)", color: "var(--accent-emerald)", fontWeight: 700, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                🛡️ TReDS & Grant Relief
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("expansion")}
                style={{ fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                🚀 Expansion & Hiring
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => applyPreset("reset")}
                style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, whiteSpace: "nowrap" }}
              >
                <RotateCcw size={13} />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          {/* Quick Net Combined Status Card */}
          {combinedScenario && (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-medium)",
                minWidth: 230,
                textAlign: "center",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                Projected Cash Under Stress
              </span>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 750,
                  fontVariantNumeric: "tabular-nums",
                  margin: "4px 0",
                  color: combinedScenario.projected_cash >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)",
                }}
              >
                {formatMoney(combinedScenario.projected_cash)}
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span className={`status-badge ${getRiskClass(combinedScenario.risk)}`} style={{ fontSize: 11 }}>
                  {combinedScenario.risk} RISK
                </span>
                {combinedScenario.liquidity_gap > 0 && (
                  <span style={{ fontSize: 11, color: "var(--accent-rose)", fontWeight: 700 }}>
                    Gap: {formatMoney(combinedScenario.liquidity_gap)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================
          MULTI-ASPECT INTERACTIVE CONTROLS TABS
          ================================================================= */}
      <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 20 }}>
        {/* Navigation Category Tabs */}
        <div className="mobile-scroll-x" style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 20, flexWrap: "nowrap", overflowX: "auto" }}>
          <button
            onClick={() => setActiveTab("sales")}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12.5,
              fontWeight: 700,
              background: activeTab === "sales" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "sales" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <TrendingUp size={14} />
            <span>1. Sales & Customer Risk</span>
          </button>

          <button
            onClick={() => setActiveTab("operations")}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12.5,
              fontWeight: 700,
              background: activeTab === "operations" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "operations" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Building size={14} />
            <span>2. Operations & Supply Chain</span>
          </button>

          <button
            onClick={() => setActiveTab("statutory")}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12.5,
              fontWeight: 700,
              background: activeTab === "statutory" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "statutory" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Landmark size={14} />
            <span>3. Statutory & Banking Stress</span>
          </button>

          <button
            onClick={() => setActiveTab("capex")}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12.5,
              fontWeight: 700,
              background: activeTab === "capex" ? "var(--accent-blue)" : "var(--bg-secondary)",
              color: activeTab === "capex" ? "#fff" : "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Layers size={14} />
            <span>4. Capex & Capacity Growth</span>
          </button>

          <button
            onClick={() => setActiveTab("relief")}
            style={{
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              fontSize: 12.5,
              fontWeight: 700,
              background: activeTab === "relief" ? "var(--accent-emerald)" : "var(--bg-secondary)",
              color: activeTab === "relief" ? "#fff" : "var(--accent-emerald)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Zap size={14} />
            <span>5. Liquidity Relief & Grants (Solutions)</span>
          </button>
        </div>

        {/* Tab 1: Sales & Customers */}
        {activeTab === "sales" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Revenue Slider */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Revenue / Demand Shock</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: revenueChange < 0 ? "var(--accent-rose)" : revenueChange > 0 ? "var(--accent-emerald)" : "var(--text-muted)" }}>
                  {revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={revenueChange}
                onChange={(e) => setRevenueChange(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-blue)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Simulate drop in orders, customer cancellations, or market slowdown.
              </p>
            </div>

            {/* Payment Delay */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Customer Payment Delay</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: paymentDelay > 0 ? "var(--accent-amber)" : "var(--text-muted)" }}>
                  {paymentDelay} Days Delay
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={paymentDelay}
                onChange={(e) => setPaymentDelay(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-amber)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Buyers take longer to pay overdue invoices past agreed credit periods.
              </p>
            </div>

            {/* Top Customer Default */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Top Client Bad Debt Default</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: customerDefault > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                  {customerDefault}% Written Off
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={customerDefault}
                onChange={(e) => setCustomerDefault(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-rose)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Simulate a major customer going bankrupt or disputing payment entirely.
              </p>
            </div>

            {/* Export Order Stretch */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>🚢 Export Bulk Order Strain</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: exportSurge > 0 ? "var(--accent-blue)" : "var(--text-muted)" }}>
                  +{exportSurge}% Order Volume
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={exportSurge}
                onChange={(e) => setExportSurge(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-blue)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                High-volume order requires heavy upfront inventory before 60-day Letter of Credit matures.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Operations & Team */}
        {activeTab === "operations" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* General Opex */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>General OpEx Surge</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: expenseChange > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                  +{expenseChange}%
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="5"
                value={expenseChange}
                onChange={(e) => setExpenseChange(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-rose)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Increase in utility bills, factory power charges, office rent, and administrative costs.
              </p>
            </div>

            {/* Raw Material Inflation */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Raw Material & Supplier Price Surge</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: rawMaterialInflation > 0 ? "var(--accent-amber)" : "var(--text-muted)" }}>
                  +{rawMaterialInflation}% Vendor Inflation
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={rawMaterialInflation}
                onChange={(e) => setRawMaterialInflation(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-amber)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Models commodity price inflation, steel/plastic cost hikes, and shipping spikes.
              </p>
            </div>

            {/* Payroll Hike & Hiring */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Team Expansion / Salary Increment</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: payrollHike > 0 ? "var(--accent-blue)" : "var(--text-muted)" }}>
                  +{payrollHike}% Payroll Surge
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={payrollHike}
                onChange={(e) => setPayrollHike(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-blue)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Models annual appraisals, Diwali/festive bonuses, or hiring 2-5 technical specialists.
              </p>
            </div>

            {/* Early Supplier Cash Discount */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--accent-emerald)" }}>🤝 Supplier Early Payment Discount (2/10 Net 30)</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-emerald)" }}>
                  {supplierDiscount}% Procurement Discount
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={supplierDiscount}
                onChange={(e) => setSupplierDiscount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-emerald)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-secondary)" }}>
                Negotiate 1%–3% cash discounts on raw material purchase invoices by settling within 10 days.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Taxes & Debt */}
        {activeTab === "statutory" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Section 43B(h) Penal Interest */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>⚖️ Section 43B(h) Delay (3x RBI Interest)</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: sec43bOverdue > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                  {sec43bOverdue} Days Past 45d
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={sec43bOverdue}
                onChange={(e) => setSec43bOverdue(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-rose)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Delays past 45 days incur 3x RBI bank rate (~19.5% p.a.) compound interest + 30% tax disallowance.
              </p>
            </div>

            {/* RBI Repo Rate Hike */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>🏛️ RBI Repo Rate Hike on Bank OD/CC</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: repoRateHike > 0 ? "var(--accent-amber)" : "var(--text-muted)" }}>
                  +{repoRateHike} bps (+{(repoRateHike / 100).toFixed(2)}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="25"
                value={repoRateHike}
                onChange={(e) => setRepoRateHike(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-amber)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Simulate floating rate benchmark hikes across working capital cash credit & overdraft facilities.
              </p>
            </div>

            {/* GST ITC Reversal */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>📋 GST ITC Reversal (GSTR-2B Mismatch)</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: itcReversal > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                  {formatMoney(itcReversal)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="250000"
                step="25000"
                value={itcReversal}
                onChange={(e) => setItcReversal(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-rose)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Non-filing by suppliers forces temporary cash blockage and statutory tax clawback.
              </p>
            </div>

            {/* GST Outflow */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Quarterly GST & Advance Tax Due</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: taxOutflow > 0 ? "var(--accent-rose)" : "var(--text-muted)" }}>
                  {formatMoney(taxOutflow)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="25000"
                value={taxOutflow}
                onChange={(e) => setTaxOutflow(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-rose)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Lump-sum statutory tax liability settlement and advance tax installments.
              </p>
            </div>

            {/* Bank Loan EMI */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>Monthly Bank Loan EMI Burden</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: loanEmi > 0 ? "var(--accent-amber)" : "var(--text-muted)" }}>
                  {formatMoney(loanEmi)} / mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={loanEmi}
                onChange={(e) => setLoanEmi(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-amber)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Principal & interest outflow on business term loans, CGTMSE facilities, or equipment debt.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Capex & Growth Investment */}
        {activeTab === "capex" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Capex Outflow */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>🏭 Plant Machinery & Tooling Downpayment</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: capexOutflow > 0 ? "var(--accent-blue)" : "var(--text-muted)" }}>
                  {formatMoney(capexOutflow)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={capexOutflow}
                onChange={(e) => setCapexOutflow(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-blue)" }}
              />
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {[0, 200000, 500000, 800000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCapexOutflow(amt)}
                    style={{
                      fontSize: 10.5,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: capexOutflow === amt ? "var(--accent-blue)" : "var(--bg-card)",
                      color: capexOutflow === amt ? "#fff" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                    }}
                  >
                    {amt === 0 ? "₹0" : formatMoney(amt)}
                  </button>
                ))}
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>
                Models CNC lathe purchases, warehouse automation, or tooling upgrades before revenue begins.
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Liquidity Relief & Grants */}
        {activeTab === "relief" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Autonomous WhatsApp & Email Cash Recovery */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--accent-emerald)" }}>⚡ Autonomous WhatsApp & Email Cash Recovery Blitz</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-emerald)" }}>
                  {cashRecoveryRelief}% Trapped Cash Cleared
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={cashRecoveryRelief}
                onChange={(e) => setCashRecoveryRelief(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-emerald)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-secondary)" }}>
                Dispatches formal MSME Samadhaan pre-litigation WhatsApp notices and account payable emails to unlock 50%–90% of overdue debt without taking loans!
              </p>
            </div>

            {/* TReDS Discounting */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--accent-emerald)" }}>⚡ TReDS Institutional Invoice Discounting</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-emerald)" }}>
                  {tredsDiscount}% Discounted
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="10"
                value={tredsDiscount}
                onChange={(e) => setTredsDiscount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-emerald)" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-secondary)" }}>
                Converts up to 80% of verified corporate invoices into instant liquid cash within 24 hours at a 1.5% institutional discount fee.
              </p>
            </div>

            {/* Government Subsidy Grant */}
            <div style={{ padding: 16, borderRadius: "var(--radius-md)", background: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ fontSize: 13, color: "var(--accent-blue)" }}>🇮🇳 Government MSME Capital Subsidy (PMEGP / Vishwakarma)</strong>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-blue)" }}>
                  {formatMoney(govtSubsidy)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={govtSubsidy}
                onChange={(e) => setGovtSubsidy(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent-blue)" }}
              />
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {[0, 100000, 250000, 500000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setGovtSubsidy(amt)}
                    style={{
                      fontSize: 10.5,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: govtSubsidy === amt ? "var(--accent-blue)" : "var(--bg-card)",
                      color: govtSubsidy === amt ? "#fff" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                    }}
                  >
                    {amt === 0 ? "₹0" : formatMoney(amt)}
                  </button>
                ))}
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--text-secondary)" }}>
                Non-repayable government capital credit directly into current account under MSME priority schemes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================
          DYNAMIC GRAPHICAL VIEW MODES
          ================================================================= */}
      <div className="glass-card" style={{ padding: "20px 24px", marginBottom: 20 }}>
        <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="card-title-group">
            <div className="card-icon-wrap blue">
              <BarChart3 size={18} />
            </div>
            <div>
              <div className="card-title">Live Visual Simulation Output</div>
              <div className="card-subtitle">
                Compare cash positions across all individual and combined stress scenarios
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: 8, padding: 3, border: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => setActiveChartTab("bar")}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                background: activeChartTab === "bar" ? "var(--bg-card)" : "transparent",
                color: activeChartTab === "bar" ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: activeChartTab === "bar" ? "var(--shadow-sm)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <BarChart3 size={14} />
              <span>Scenario Comparison</span>
            </button>

            <button
              onClick={() => setActiveChartTab("trajectory")}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                background: activeChartTab === "trajectory" ? "var(--bg-card)" : "transparent",
                color: activeChartTab === "trajectory" ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: activeChartTab === "trajectory" ? "var(--shadow-sm)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <LineChartIcon size={14} />
              <span>90-Day Trajectory Curve</span>
            </button>

            <button
              onClick={() => setActiveChartTab("matrix")}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                background: activeChartTab === "matrix" ? "var(--bg-card)" : "transparent",
                color: activeChartTab === "matrix" ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: activeChartTab === "matrix" ? "var(--shadow-sm)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Layers size={14} />
              <span>Impact Matrix</span>
            </button>
          </div>
        </div>

        {/* View 1: Comparative Bar Chart */}
        {activeChartTab === "bar" && (
          <div style={{ height: 360, width: "100%", marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 20, right: 20, left: 15, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10.5} angle={-25} textAnchor="end" height={60} interval={0} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "var(--shadow-md)",
                    color: "var(--text-primary)",
                  }}
                  formatter={(val, _, props) => [
                    formatMoney(val),
                    `Projected Cash (${props.payload.parameter || props.payload.risk})`,
                  ]}
                />
                <ReferenceLine y={0} stroke="#B54747" strokeDasharray="3 3" />
                <Bar dataKey="projectedCash" radius={[4, 4, 0, 0]}>
                  {comparisonChartData.map((entry, index) => {
                    let fill = "#1F5A4A";
                    if (entry.isRelief) fill = "#2E7D5B";
                    else if (entry.risk === "HIGH") fill = "#B54747";
                    else if (entry.risk === "MEDIUM") fill = "#B7791F";
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* View 2: 90-Day Trajectory Curve */}
        {activeChartTab === "trajectory" && (
          <div style={{ height: 360, width: "100%", marginTop: 14 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData} margin={{ top: 20, right: 20, left: 15, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F5A4A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1F5A4A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorStressed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B54747" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B54747" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRelief" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D5B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2E7D5B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "var(--shadow-md)",
                    color: "var(--text-primary)",
                  }}
                  formatter={(val) => [formatMoney(val)]}
                />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={0} stroke="#B54747" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="baseline" name="Base Operations" stroke="#1F5A4A" strokeWidth={2} fill="url(#colorBaseline)" />
                <Area type="monotone" dataKey="stressed" name="Stressed (No Relief)" stroke="#B54747" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorStressed)" />
                {(tredsDiscount > 0 || govtSubsidy > 0) && (
                  <Area type="monotone" dataKey="withRelief" name="With TReDS & Grant Relief" stroke="#2E7D5B" strokeWidth={2.5} fill="url(#colorRelief)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* View 3: Detailed Matrix */}
        {activeChartTab === "matrix" && (
          <div className="table-responsive" style={{ marginTop: 14 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Shock / Relief Parameter</th>
                  <th>Projected Cash</th>
                  <th>Cash Impact</th>
                  <th>Liquidity Shortfall</th>
                  <th>Risk Rating</th>
                  <th>Actionable Assessment</th>
                </tr>
              </thead>
              <tbody>
                {simulation?.scenarios?.map((s, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong style={{ color: s.is_relief ? "var(--accent-emerald)" : "var(--text-primary)" }}>
                        {s.scenario}
                      </strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.parameter}</span>
                    </td>
                    <td>
                      <strong style={{ color: s.projected_cash >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)" }}>
                        {formatMoney(s.projected_cash)}
                      </strong>
                    </td>
                    <td>
                      <span style={{ color: s.cash_impact >= 0 ? "var(--accent-emerald)" : "var(--accent-rose)", fontSize: 12 }}>
                        {s.cash_impact >= 0 ? `+${formatMoney(s.cash_impact)}` : formatMoney(s.cash_impact)}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: s.liquidity_gap > 0 ? "var(--accent-rose)" : "var(--accent-emerald)", fontWeight: s.liquidity_gap > 0 ? 700 : 400 }}>
                        {s.liquidity_gap > 0 ? formatMoney(s.liquidity_gap) : "None"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getRiskClass(s.risk)}`}>{s.risk}</span>
                    </td>
                    <td style={{ fontSize: 12, maxWidth: 300, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                      {s.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModulePage>
  );
}