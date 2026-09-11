// =================================================================
// FinTwin Risk Analysis & Cash Recovery Engine (MSME / B2B)
// =================================================================

/**
 * Calculates a comprehensive Risk Analysis Profile for an invoice.
 * Incorporates Section 43B(h) statutory cutoff, 3x RBI compound penal interest,
 * default probability, and composite risk index.
 */
export function calculateInvoiceRiskAnalysis(invoice, customer = null, business = null) {
  const today = new Date();
  const dueDate = new Date(invoice?.dueDate || today);
  const invoiceDate = new Date(invoice?.invoiceDate || today);

  // Overdue and Age calculations
  const diffTime = today - dueDate;
  const daysOverdue = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  const totalDaysSinceIssue = Math.max(0, Math.floor((today - invoiceDate) / (1000 * 60 * 60 * 24)));

  const isPaid = invoice?.status === "Paid";
  const isOverdue = invoice?.status === "Overdue" || daysOverdue > 0;
  const amount = Number(invoice?.amount || 0);

  // 1. Section 43B(h) Compliance Classification
  // MSMED Act statutory maximum: 45 days.
  let section43bStatus = "Compliant (≤15d)";
  let section43bSeverity = "safe"; // "safe" | "warning" | "critical"
  let section43bCode = "SEC-SAFE";
  let section43bMessage = "Payment window is safe within statutory 15/45-day norms.";

  if (totalDaysSinceIssue > 45 || daysOverdue > 15) {
    section43bStatus = "Breached (>45d Cutoff)";
    section43bSeverity = "critical";
    section43bCode = "SEC-BREACHED";
    section43bMessage = "Mandatory disallowance under Income Tax Act Sec 43B(h). Buyer loses business expense deduction.";
  } else if (totalDaysSinceIssue > 30 || daysOverdue > 0) {
    section43bStatus = "Approaching Cutoff (31-45d)";
    section43bSeverity = "warning";
    section43bCode = "SEC-APPROACHING";
    section43bMessage = "Approaching statutory 45-day deadline. Immediate notice required to avoid tax disallowance.";
  }

  // 2. Accrued Penal Interest Calculation (Section 16, MSMED Act 2006)
  // Mandates compound interest with monthly rests at 3 times RBI Bank Rate (~6.5% * 3 = 19.5% p.a.)
  const annualPenalRate = 0.195;
  const effectiveDelay = daysOverdue > 0 ? daysOverdue : Number(invoice?.predictedDelayDays || 4);
  const accruedPenalInterest = isPaid
    ? 0
    : Math.round(amount * (annualPenalRate / 365) * effectiveDelay);

  // 3. Probability of Default (%)
  let baseDefault = 12;
  const rawRisk = (invoice?.riskScore || "").toLowerCase();
  const custRisk = (customer?.creditScore || "").toLowerCase();

  if (rawRisk.includes("high") || custRisk.includes("high")) {
    baseDefault = 48;
  } else if (rawRisk.includes("medium") || custRisk.includes("medium")) {
    baseDefault = 24;
  }

  let defaultProbability = baseDefault + Math.floor(effectiveDelay * 1.3);
  if (isPaid) defaultProbability = 0;
  defaultProbability = Math.min(96, Math.max(5, defaultProbability));

  // 4. Composite Risk Score Index (0 - 100)
  let riskScoreIndex = Math.round(
    defaultProbability * 0.55 +
    Math.min(30, (effectiveDelay / 45) * 30) +
    (section43bSeverity === "critical" ? 15 : section43bSeverity === "warning" ? 8 : 0)
  );
  if (isPaid) riskScoreIndex = 0;
  riskScoreIndex = Math.min(100, Math.max(0, riskScoreIndex));

  // 5. Risk Tier & Recovery Priority
  let riskTier = "LOW RISK";
  let riskBadgeColor = "#34d399";
  let riskBg = "rgba(16, 185, 129, 0.15)";
  let recoveryPriority = "Priority 3: Standard Follow-Up";

  if (riskScoreIndex >= 75) {
    riskTier = "CRITICAL AT-RISK";
    riskBadgeColor = "#fb7185";
    riskBg = "rgba(244, 63, 94, 0.15)";
    recoveryPriority = "Priority 1: Immediate Legal Demand";
  } else if (riskScoreIndex >= 45) {
    riskTier = "MODERATE STRESS";
    riskBadgeColor = "#B7791F";
    riskBg = "rgba(245, 158, 11, 0.15)";
    recoveryPriority = "Priority 2: Prompt Cash Recovery";
  }

  // 6. Contact Information (Auto-resolved)
  const contactPhone = invoice?.phone || customer?.phone || "+91 98201 44521";
  const contactEmail = invoice?.email || customer?.contactEmail || `accounts@${(invoice?.customer || "client").toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  const contactPerson = customer?.contactPerson || "Accounts Payable Head / Finance Controller";

  return {
    daysOverdue,
    totalDaysSinceIssue,
    effectiveDelay,
    isOverdue,
    isPaid,
    section43bStatus,
    section43bSeverity,
    section43bCode,
    section43bMessage,
    accruedPenalInterest,
    defaultProbability,
    riskScoreIndex,
    riskTier,
    riskBadgeColor,
    riskBg,
    recoveryPriority,
    contactPhone,
    contactEmail,
    contactPerson,
  };
}

/**
 * Generates 3 customizable Cash Recovery templates for WhatsApp and Email.
 */
export function generateRecoveryTemplates({ invoice, riskAnalysis, business }) {
  const bizName = business?.name || "FinTwin Enterprise Solutions Ltd";
  const custName = invoice?.customer || "Enterprise Buyer / Counterparty";
  const invId = invoice?.id || "INV-1001";
  const amtFormatted = `₹${Number(invoice?.amount || 0).toLocaleString("en-IN")}`;
  const dueDate = invoice?.dueDate || "Immediately";
  const daysOverdue = riskAnalysis?.daysOverdue || 0;
  const penalInterest = `₹${(riskAnalysis?.accruedPenalInterest || 0).toLocaleString("en-IN")}`;
  const totalPayable = `₹${(Number(invoice?.amount || 0) + (riskAnalysis?.accruedPenalInterest || 0)).toLocaleString("en-IN")}`;
  const upiId = business?.upiId || "fintwin.pay@icici";
  const bankAcc = business?.bankAccount || "918273645012 (IFSC: ICIC0000024, ICICI Bank)";

  // Template 1: Statutory Section 43B(h) Demand Notice (Legal / High-Risk)
  const legalTemplate = {
    id: "legal_43b",
    name: "Section 43B(h) Statutory Legal Notice",
    tag: "Statutory Law",
    tagColor: "#fb7185",
    subject: `[STATUTORY DEMAND NOTICE] Urgent Settlement of Overdue Invoice ${invId} under Section 43B(h) - ${bizName}`,
    whatsappText: `*STATUTORY DEMAND NOTICE — Section 43B(h) Income Tax Act & MSMED Act 2006*\n\nDear *${custName}* (Attn: Accounts Payable / Finance Controller),\n\nThis is an urgent formal communication from *${bizName}* regarding overdue Invoice *#${invId}*.\n\n• *Invoice Amount*: ${amtFormatted}\n• *Due Date*: ${dueDate}\n• *Overdue Duration*: ${daysOverdue > 0 ? `${daysOverdue} Days` : "Maturing Immediately"}\n• *Accrued Compound Penal Interest (3x RBI Rate)*: ${penalInterest}\n• *Total Current Claim*: ${totalPayable}\n\n⚠️ *MANDATORY STATUTORY RAMIFICATIONS*:\nUnder Section 43B(h) of the Income Tax Act, 1961, failure to clear this MSME invoice within statutory limits disallows your business expense deduction in your annual Tax Audit and mandates payment of compound penal interest at ~19.5% p.a.\n\n*Direct Settlement Banking Coordinates*:\n• Bank: ${bankAcc}\n• UPI ID: ${upiId}\n\nPlease remit immediately and share the transaction UTR number to prevent escalation to the MSME Samadhaan Facilitation Council.\n\nSincerely,\n*Credit Recovery Cell, ${bizName}*`,
    emailBody: `To: Finance Controller / Accounts Payable Department\nCustomer Account: ${custName}\n\nSubject: Formal Statutory Notice under Section 43B(h) of the Income Tax Act, 1961 & MSMED Act 2006 - Invoice ${invId}\n\nDear Finance Team,\n\nWe hereby notify you that the following invoice remains outstanding beyond agreed statutory credit terms:\n\n- Invoice Number: ${invId}\n- Principal Due: ${amtFormatted}\n- Stipulated Due Date: ${dueDate}\n- Overdue Duration: ${daysOverdue > 0 ? `${daysOverdue} Days` : "Immediate"}\n- Statutory Penal Interest Accrued: ${penalInterest} (Calculated under Section 16 of the MSMED Act at 3x RBI Bank Rate ~19.5% p.a. compounded monthly)\n- Total Amount Due for Clearance: ${totalPayable}\n\nSTATUTORY WARNING UNDER SECTION 43B(h):\nAs a registered Micro/Small Enterprise, our supplies are governed by Section 15 of the MSMED Act, 2006. In accordance with Section 43B(h) of the Income Tax Act, 1961, any delayed payments beyond the 45-day threshold are permanently disallowed from your taxable income during tax audit, attracting higher taxable liability.\n\nPlease remit the payment immediately to our verified banking coordinates:\n\nBeneficiary Name: ${bizName}\nAccount Number & IFSC: ${bankAcc}\nUPI Payment ID: ${upiId}\n\nKindly acknowledge receipt of this demand notice and reply with the payment UTR number.\n\nYours faithfully,\nCredit Control & Recovery Department\n${bizName}`,
  };

  // Template 2: Urgent Executive Settlement Reminder (WhatsApp Fast Action)
  const executiveTemplate = {
    id: "executive_urgent",
    name: "Urgent Executive Settlement & UPI",
    tag: "Fast Settlement",
    tagColor: "#1F5A4A",
    subject: `Urgent Payment Follow-Up: Invoice ${invId} (${amtFormatted}) - ${bizName}`,
    whatsappText: `Hi *${custName}* Team, gentle reminder from *${bizName}* regarding Invoice *#${invId}* of *${amtFormatted}* which is currently overdue by *${daysOverdue} days*.\n\nWe request you to kindly process this payment today to keep our credit line active and avoid statutory 43B(h) tax disallowance.\n\n*Quick Pay Details*:\nUPI: *${upiId}*\nBank A/c: *${bankAcc}*\n\nPlease reply with the transaction UTR once processed. Thank you for your continued partnership! 🙏`,
    emailBody: `Dear Accounts Team at ${custName},\n\nHope this finds you well.\n\nThis is an urgent follow-up regarding Invoice ${invId} for ${amtFormatted}, which was due on ${dueDate} and is now overdue by ${daysOverdue} days.\n\nTo ensure uninterrupted supply schedules and maintain seamless Section 43B(h) tax compliance, we request your prompt clearance of this outstanding amount today.\n\nPayment Details:\n- Amount: ${amtFormatted}\n- UPI ID: ${upiId}\n- Bank Account: ${bankAcc}\n\nPlease share the transaction confirmation / UTR as soon as executed.\n\nBest regards,\n${bizName}`,
  };

  // Template 3: Friendly Courtesy Reminder
  const courtesyTemplate = {
    id: "courtesy_reminder",
    name: "Friendly Courtesy Milestone Check",
    tag: "Courtesy",
    tagColor: "#34d399",
    subject: `Friendly Payment Reminder: Invoice ${invId} from ${bizName}`,
    whatsappText: `Greetings from *${bizName}*! 😊\n\nJust a quick courtesy check regarding Invoice *#${invId}* for *${amtFormatted}* due on *${dueDate}*.\n\nIf the payment is already in transit, please disregard this note. Otherwise, we would appreciate it if you could confirm the expected settlement date.\n\nBank Account: *${bankAcc}*\nUPI ID: *${upiId}*\n\nThank you and have a wonderful day!`,
    emailBody: `Dear ${custName} Accounts Team,\n\nWe hope you are having a productive week.\n\nThis is a friendly reminder that Invoice ${invId} for the amount of ${amtFormatted} is scheduled for settlement on ${dueDate}.\n\nCould you please confirm if this invoice has been approved in your payment run this week? If you need another copy of the signed invoice or delivery challan, please let us know.\n\nThank you for your business,\n${bizName}`,
  };

  return [legalTemplate, executiveTemplate, courtesyTemplate];
}
