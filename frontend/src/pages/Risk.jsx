import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Users,
  Wallet,
  Clock,
  Receipt,
  Brain,
} from "lucide-react";

import ModulePage from "../components/ModulePage";

import {
  getFinancialData,
} from "../data/financialStore";


function Risk() {
  const [risk, setRisk] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD RISK ANALYSIS
  // ==========================================

  useEffect(() => {
    loadRisk();
  }, []);


  async function loadRisk() {

    try {

      setLoading(true);
      setError("");


      const data =
        getFinancialData();


      // --------------------------------------
      // First generate the latest forecast
      // --------------------------------------

      const forecastResponse =
        await fetch(
          "http://127.0.0.1:8000/api/forecast",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              current_cash:
                data.business.openingCash,

              invoices:
                data.invoices,

              payments:
                data.payments,

              recurring_expenses:
                data.recurringExpenses,

              one_time_expenses:
                data.expenses,

            }),
          }
        );


      if (!forecastResponse.ok) {

        throw new Error(
          `Forecast API returned ${forecastResponse.status}`
        );

      }


      const forecastResult =
        await forecastResponse.json();


      if (!forecastResult.success) {

        throw new Error(
          "Unable to generate forecast"
        );

      }


      // --------------------------------------
      // Send forecast to Risk Engine
      // --------------------------------------

      const riskResponse =
        await fetch(
          "http://127.0.0.1:8000/api/risk",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              current_cash:
                data.business.openingCash,

              invoices:
                data.invoices,

              recurring_expenses:
                data.recurringExpenses,

              one_time_expenses:
                data.expenses,

              forecast:
                forecastResult.forecast,

            }),
          }
        );


      if (!riskResponse.ok) {

        throw new Error(
          `Risk API returned ${riskResponse.status}`
        );

      }


      const riskResult =
        await riskResponse.json();


      if (!riskResult.success) {

        throw new Error(
          "Risk analysis failed"
        );

      }


      setRisk(
        riskResult.risk
      );

    } catch (err) {

      console.error(
        "Risk analysis error:",
        err
      );

      setError(
        err.message ||
        "Unable to generate risk analysis."
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // FORMAT MONEY
  // ==========================================

  function formatMoney(amount) {

    const value =
      Number(amount || 0);


    if (
      Math.abs(value) >= 10000000
    ) {

      return `₹${(
        value / 10000000
      ).toFixed(2)} Cr`;

    }


    if (
      Math.abs(value) >= 100000
    ) {

      return `₹${(
        value / 100000
      ).toFixed(2)} L`;

    }


    return `₹${(
      value / 1000
    ).toFixed(1)}K`;
  }


  // ==========================================
  // RISK CLASS
  // ==========================================

  function getRiskClass(riskLevel) {

    const value =
      String(
        riskLevel || "LOW"
      ).toUpperCase();


    if (value === "HIGH") {
      return "risk-high";
    }


    if (value === "MEDIUM") {
      return "risk-medium";
    }


    return "risk-low";
  }


  // ==========================================
  // RISK ICON
  // ==========================================

  function getRiskIcon(type) {

    if (
      type === "PAYMENT_DELAY"
    ) {

      return <Clock size={19} />;

    }


    if (
      type === "CONCENTRATION"
    ) {

      return <Users size={19} />;

    }


    if (
      type === "LIQUIDITY"
    ) {

      return <Wallet size={19} />;

    }


    if (
      type === "EXPENSE_PRESSURE"
    ) {

      return <Receipt size={19} />;

    }


    return <ShieldAlert size={19} />;
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <ModulePage
        title="Risk Analysis"
        description="AI-powered analysis of financial risks."
      >

        <div className="module-card">

          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >

            <Brain
              size={36}
              style={{
                marginBottom: "12px",
              }}
            />

            <h2>
              AI is analyzing financial risk...
            </h2>

            <p>
              FinTwin is analyzing payment behavior,
              liquidity and customer concentration.
            </p>

          </div>

        </div>

      </ModulePage>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <ModulePage
        title="Risk Analysis"
        description="AI-powered financial risk analysis."
      >

        <div className="module-alert">

          <AlertTriangle size={22} />

          <div>

            <strong>
              Risk analysis could not be generated
            </strong>

            <p>
              {error}
            </p>

            <button
              onClick={loadRisk}
              style={{
                marginTop: "10px",
                padding: "8px 14px",
                border: "none",
                borderRadius: "7px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>

          </div>

        </div>

      </ModulePage>
    );
  }


  if (!risk) {
    return null;
  }


  // ==========================================
  // EXTRACT RISK DATA
  // ==========================================

  const overall =
    risk.overall || {};

  const payment =
    risk.payment_delay || {};

  const concentration =
    risk.customer_concentration || {};

  const liquidity =
    risk.liquidity || {};

  const expenses =
    risk.expense_pressure || {};

  const explanations =
    risk.explanations || [];


  return (
    <ModulePage
      title="Risk Analysis"
      description="Understand the financial risks identified by the FinTwin AI engine."
    >

      {/* =====================================
          OVERALL RISK
      ====================================== */}

      <div className="module-card">

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >

          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                overall.risk === "HIGH"
                  ? "#fee2e2"
                  : overall.risk === "MEDIUM"
                    ? "#fef3c7"
                    : "#dcfce7",
              color:
                overall.risk === "HIGH"
                  ? "#dc2626"
                  : overall.risk === "MEDIUM"
                    ? "#a16207"
                    : "#15803d",
            }}
          >

            {overall.risk === "LOW" ? (
              <CheckCircle size={30} />
            ) : (
              <ShieldAlert size={30} />
            )}

          </div>


          <div style={{ flex: 1 }}>

            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#6b7280",
                letterSpacing: ".5px",
              }}
            >
              OVERALL FINANCIAL RISK
            </span>

            <h2
              style={{
                margin: "5px 0",
              }}
            >
              {overall.risk || "LOW"}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "11px",
              }}
            >
              Composite risk score:{" "}
              {Number(
                overall.score || 0
              ).toFixed(0)}
              /100
            </p>

          </div>


          <div
            className={
              getRiskClass(
                overall.risk
              )
            }
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "10px",
            }}
          >
            {overall.risk}
          </div>

        </div>

      </div>


      {/* =====================================
          RISK CATEGORIES
      ====================================== */}

      <div className="module-grid">

        <RiskCard
          icon={<Clock size={20} />}
          title="Payment Delay"
          risk={payment.risk}
          score={payment.score}
          subtitle={
            `${Number(
              payment.average_predicted_delay_days || 0
            ).toFixed(1)} days average predicted delay`
          }
        />


        <RiskCard
          icon={<Users size={20} />}
          title="Customer Concentration"
          risk={concentration.risk}
          score={concentration.score}
          subtitle={
            `${Number(
              concentration.concentration_percentage || 0
            ).toFixed(1)}% from largest customer`
          }
        />


        <RiskCard
          icon={<Wallet size={20} />}
          title="Liquidity"
          risk={liquidity.risk}
          score={liquidity.score}
          subtitle={
            `Minimum projected cash: ${formatMoney(
              liquidity.minimum_projected_cash
            )}`
          }
        />


        <RiskCard
          icon={<Receipt size={20} />}
          title="Expense Pressure"
          risk={expenses.risk}
          score={expenses.score}
          subtitle={
            `${Number(
              expenses.cash_coverage_months || 0
            ).toFixed(1)} months cash coverage`
          }
        />

      </div>


      {/* =====================================
          RISK EXPLANATIONS
      ====================================== */}

      <div
        className="module-card"
        style={{
          marginTop: "18px",
        }}
      >

        <div className="section-heading">

          <div
            className="section-heading-icon"
          >
            <Brain size={19} />
          </div>

          <div>

            <h2>
              Why FinTwin identified these risks
            </h2>

            <p>
              AI-generated explanations based on
              your financial data.
            </p>

          </div>

        </div>


        <div
          style={{
            marginTop: "18px",
          }}
        >

          {explanations.map(
            (explanation, index) => (

              <div
                key={`${explanation.type}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "13px",
                  padding: "15px 0",
                  borderBottom:
                    "1px solid #f0f0f0",
                }}
              >

                <div
                  className={
                    getRiskClass(
                      explanation.severity
                    )
                  }
                  style={{
                    width: "38px",
                    height: "38px",
                    minWidth: "38px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getRiskIcon(
                    explanation.type
                  )}
                </div>


                <div>

                  <strong
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {explanation.title}
                  </strong>

                  <p
                    style={{
                      margin:
                        "5px 0 0",
                      fontSize: "10px",
                      lineHeight: "1.5",
                      color: "#6b7280",
                    }}
                  >
                    {explanation.message}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* =====================================
          HIGH RISK INVOICES
      ====================================== */}

      {payment.high_risk_invoices?.length > 0 && (

        <div
          className="module-card"
          style={{
            marginTop: "18px",
          }}
        >

          <div className="section-heading">

            <div
              className="section-heading-icon"
            >
              <AlertTriangle size={19} />
            </div>

            <div>

              <h2>
                High-Risk Receivables
              </h2>

              <p>
                Outstanding invoices with high
                predicted payment-delay risk.
              </p>

            </div>

          </div>


          <div
            style={{
              marginTop: "18px",
            }}
          >

            {payment.high_risk_invoices.map(
              (invoice) => (

                <div
                  key={
                    invoice.invoice_id
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "14px 0",
                    borderBottom:
                      "1px solid #f0f0f0",
                  }}
                >

                  <div style={{ flex: 1 }}>

                    <strong
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {invoice.customer}
                    </strong>

                    <p
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize: "10px",
                        color: "#6b7280",
                      }}
                    >
                      {invoice.invoice_id}
                    </p>

                  </div>


                  <strong>
                    {formatMoney(
                      invoice.amount
                    )}
                  </strong>


                  <span
                    className="risk-high"
                    style={{
                      padding: "5px 8px",
                      borderRadius: "6px",
                      fontSize: "9px",
                      fontWeight: "700",
                    }}
                  >
                    {Number(
                      invoice.predicted_delay_days || 0
                    ).toFixed(1)}
                    {" "}DAYS
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* =====================================
          DISCLAIMER
      ====================================== */}

      <div
        style={{
          marginTop: "18px",
          padding: "14px",
          borderRadius: "10px",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          fontSize: "9px",
          color: "#6b7280",
          lineHeight: "1.5",
        }}
      >

        <strong>
          Important:
        </strong>{" "}
        FinTwin's risk indicators are analytical
        predictions based on available financial
        data. They are not credit decisions,
        lending approvals, or financial advice.

      </div>

    </ModulePage>
  );
}


/* =========================================
   RISK CARD
========================================= */

function RiskCard({
  icon,
  title,
  risk,
  score,
  subtitle,
}) {

  return (
    <div className="module-stat">

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >

        <div
          style={{
            color:
              risk === "HIGH"
                ? "#dc2626"
                : risk === "MEDIUM"
                  ? "#a16207"
                  : "#15803d",
          }}
        >
          {icon}
        </div>

        <span>
          {title}
        </span>

      </div>


      <strong
        style={{
          marginTop: "8px",
          display: "block",
        }}
      >
        {risk}
      </strong>


      <small
        style={{
          display: "block",
          marginTop: "5px",
          color: "#6b7280",
        }}
      >
        Score:{" "}
        {Number(score || 0).toFixed(0)}
        /100
      </small>


      <small
        style={{
          display: "block",
          marginTop: "7px",
          color: "#9ca3af",
          lineHeight: "1.4",
        }}
      >
        {subtitle}
      </small>

    </div>
  );
}


export default Risk;