import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Brain,
  TrendingUp,
  CalendarDays,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import ModulePage from "../components/ModulePage";

import {
  getFinancialData,
} from "../data/financialStore";


function Forecast() {
  const [forecast, setForecast] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD AI FORECAST
  // ==========================================

  useEffect(() => {

    loadForecast();

  }, []);


  async function loadForecast() {

    try {

      setLoading(true);

      setError("");


      const data =
        getFinancialData();


      const response =
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


      if (!response.ok) {

        throw new Error(
          `Forecast API returned ${response.status}`
        );

      }


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          "Forecast generation failed"
        );

      }


      setForecast(
        result.forecast
      );

    } catch (err) {

      console.error(
        "Forecast error:",
        err
      );

      setError(
        err.message ||
        "Unable to generate forecast."
      );

    } finally {

      setLoading(false);

    }
  }


  // ==========================================
  // FORMAT MONEY
  // ==========================================

  function formatMoney(amount) {

    if (
      amount === undefined ||
      amount === null
    ) {
      return "₹0";
    }


    const value =
      Number(amount);


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
  // FORMAT DATE
  // ==========================================

  function formatDate(dateString) {

    if (!dateString) {
      return "-";
    }


    return new Date(
      dateString
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }


  // ==========================================
  // RISK CLASS
  // ==========================================

  function getRiskClass(risk) {

    if (risk === "HIGH") {
      return "risk-high";
    }

    if (risk === "MEDIUM") {
      return "risk-medium";
    }

    return "risk-low";
  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <ModulePage
        title="AI Forecast"
        description="Generating your financial forecast using the FinTwin ML engine."
      >

        <div className="module-card">

          <div
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >

            <Brain
              size={35}
              style={{
                marginBottom: "12px",
              }}
            />

            <h2>
              AI is analyzing your finances...
            </h2>

            <p>
              Predicting payment delays and
              future cash positions.
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
        title="AI Forecast"
        description="Financial forecasting powered by the FinTwin ML engine."
      >

        <div
          className="module-alert"
        >

          <AlertTriangle size={22} />

          <div>

            <strong>
              Forecast could not be generated
            </strong>

            <p>
              {error}
            </p>

            <button
              onClick={loadForecast}
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


  if (!forecast) {
    return null;
  }


  // ==========================================
  // FORECAST DATA
  // ==========================================

  const periods =
    forecast.forecast || [];


  const predictions =
    forecast.payment_predictions || [];


  return (
    <ModulePage
      title="AI Forecast"
      description="30, 60 and 90-day cash-flow projections powered by machine learning."
    >

      {/* =====================================
          AI STATUS
      ====================================== */}

      <div
        className="cash-success"
        style={{
          marginBottom: "18px",
        }}
      >

        <Brain size={21} />

        <div>

          <strong>
            AI Forecast Active
          </strong>

          <p>
            Payment timing is predicted using
            historical customer payment behavior.
          </p>

        </div>

      </div>


      {/* =====================================
          FORECAST CARDS
      ====================================== */}

      <div className="module-grid">

        {periods.map(
          (period) => (

            <div
              className="module-stat"
              key={
                period.period_days
              }
            >

              <span>
                {period.period_days}-DAY
                FORECAST
              </span>

              <strong>
                {formatMoney(
                  period.projected_cash
                )}
              </strong>

              <small
                style={{
                  display: "block",
                  marginTop: "7px",
                  color: "#6b7280",
                }}
              >
                Projected Cash
              </small>

              <div
                className={
                  getRiskClass(
                    period.risk
                  )
                }
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "9px",
                  fontWeight: "700",
                }}
              >
                {period.risk} RISK
              </div>

            </div>

          )
        )}

      </div>


      {/* =====================================
          FORECAST BREAKDOWN
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
            <TrendingUp size={19} />
          </div>

          <div>

            <h2>
              AI Cash-Flow Forecast
            </h2>

            <p>
              Expected inflows and outflows
              calculated by the forecasting engine.
            </p>

          </div>

        </div>


        <div
          style={{
            overflowX: "auto",
            marginTop: "20px",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "11px",
            }}
          >

            <thead>

              <tr>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    color: "#6b7280",
                  }}
                >
                  Period
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "10px",
                    color: "#6b7280",
                  }}
                >
                  Inflows
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "10px",
                    color: "#6b7280",
                  }}
                >
                  Outflows
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "10px",
                    color: "#6b7280",
                  }}
                >
                  Projected Cash
                </th>

                <th
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    color: "#6b7280",
                  }}
                >
                  Risk
                </th>

              </tr>

            </thead>


            <tbody>

              {periods.map(
                (period) => (

                  <tr
                    key={
                      period.period_days
                    }
                  >

                    <td
                      style={{
                        padding: "12px 10px",
                        fontWeight: "600",
                      }}
                    >
                      {period.period_days} days
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          color: "#16a34a",
                        }}
                      >
                        <ArrowUpRight
                          size={13}
                        />{" "}
                        {formatMoney(
                          period.expected_inflows
                        )}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{
                          color: "#dc2626",
                        }}
                      >
                        <ArrowDownRight
                          size={13}
                        />{" "}
                        {formatMoney(
                          period.expected_outflows
                        )}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        textAlign: "right",
                        fontWeight: "700",
                      }}
                    >
                      {formatMoney(
                        period.projected_cash
                      )}
                    </td>

                    <td
                      style={{
                        padding: "12px 10px",
                        textAlign: "center",
                      }}
                    >
                      <span
                        className={
                          getRiskClass(
                            period.risk
                          )
                        }
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "9px",
                          fontWeight: "700",
                        }}
                      >
                        {period.risk}
                      </span>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================
          PAYMENT PREDICTIONS
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
            <CalendarDays size={19} />
          </div>

          <div>

            <h2>
              AI Payment Predictions
            </h2>

            <p>
              Predicted collection timing for
              outstanding invoices.
            </p>

          </div>

        </div>


        <div
          style={{
            marginTop: "18px",
          }}
        >

          {predictions.length === 0 ? (

            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              No outstanding invoices
              available for prediction.
            </div>

          ) : (

            predictions.map(
              (prediction) => (

                <div
                  key={
                    prediction.invoice_id
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

                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <strong
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {prediction.customer}
                    </strong>

                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "10px",
                        color: "#6b7280",
                      }}
                    >
                      Invoice{" "}
                      {prediction.invoice_id}
                    </p>

                  </div>


                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >

                    <strong>
                      {formatMoney(
                        prediction.amount
                      )}
                    </strong>

                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "9px",
                        color: "#6b7280",
                      }}
                    >
                      Expected:{" "}
                      {formatDate(
                        prediction.expected_payment_date
                      )}
                    </p>

                  </div>


                  <div
                    className={
                      getRiskClass(
                        prediction.payment_risk
                      )
                    }
                    style={{
                      padding: "5px 8px",
                      borderRadius: "6px",
                      fontSize: "9px",
                      fontWeight: "700",
                    }}
                  >
                    {prediction.payment_risk}
                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>


      {/* =====================================
          EXPLANATION
      ====================================== */}

      <div
        className="module-alert"
        style={{
          marginTop: "18px",
        }}
      >

        <CheckCircle size={20} />

        <div>

          <strong>
            How FinTwin forecasts cash
          </strong>

          <p>
            The ML model predicts payment delays
            using historical payment behavior,
            invoice amount, customer history and
            days until the invoice is due. These
            predictions are then used to estimate
            future cash availability.
          </p>

        </div>

      </div>

    </ModulePage>
  );
}


export default Forecast;