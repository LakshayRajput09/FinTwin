import {
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Wallet,
  TrendingUp,
  Receipt,
} from "lucide-react";

import ModulePage from "../components/ModulePage";

import {
  getCashFlowSummary,
} from "../engines/digitalTwin";

function CashFlow() {
  const cashFlow = getCashFlowSummary();

  const formatMoney = (amount) => {
    return `₹${(amount / 100000).toFixed(2)} L`;
  };

  const isHealthy =
    cashFlow.projectedCash >= 0;

  return (
    <ModulePage
      title="Cash Flow"
      description="Track your current and projected business cash position."
      type="cash"
    >

      {/* ================================
          SUMMARY CARDS
      ================================= */}

      <div className="module-grid">

        <div className="module-stat">

          <span>
            Current Cash
          </span>

          <strong>
            {formatMoney(
              cashFlow.currentCash
            )}
          </strong>

        </div>


        <div className="module-stat">

          <span>
            Expected Receivables
          </span>

          <strong>
            {formatMoney(
              cashFlow.receivables
            )}
          </strong>

        </div>


        <div className="module-stat">

          <span>
            Expected Expenses
          </span>

          <strong>
            {formatMoney(
              cashFlow.expenses
            )}
          </strong>

        </div>

      </div>


      {/* ================================
          PROJECTED CASH
      ================================= */}

      <div className="cash-position-card">

        <div className="cash-position-icon">
          <Wallet size={25} />
        </div>

        <div className="cash-position-content">

          <span>
            PROJECTED CASH POSITION
          </span>

          <h2>
            {formatMoney(
              cashFlow.projectedCash
            )}
          </h2>

          <p>
            Current cash + expected receivables
            − expected expenses
          </p>

        </div>

        <div
          className={
            isHealthy
              ? "cash-status healthy"
              : "cash-status danger"
          }
        >

          {isHealthy ? (
            <>
              <CheckCircle size={18} />
              Healthy
            </>
          ) : (
            <>
              <AlertTriangle size={18} />
              Liquidity Gap
            </>
          )}

        </div>

      </div>


      {/* ================================
          NET CASH FLOW
      ================================= */}

      <div className="module-grid">

        <div className="module-stat">

          <span>
            Net Cash Flow
          </span>

          <strong
            className={
              cashFlow.netCashFlow >= 0
                ? "positive-number"
                : "negative-number"
            }
          >
            {formatMoney(
              cashFlow.netCashFlow
            )}
          </strong>

        </div>


        <div className="module-stat">

          <span>
            Liquidity Gap
          </span>

          <strong
            className={
              cashFlow.liquidityGap > 0
                ? "negative-number"
                : "positive-number"
            }
          >
            {formatMoney(
              cashFlow.liquidityGap
            )}
          </strong>

        </div>


        <div className="module-stat">

          <span>
            Model Status
          </span>

          <strong>
            Live
          </strong>

        </div>

      </div>


      {/* ================================
          EXPLANATION
      ================================= */}

      <div className="module-card">

        <div className="section-heading">

          <div className="section-heading-icon">
            <TrendingUp size={19} />
          </div>

          <div>

            <h2>
              How the Digital Twin calculated this
            </h2>

            <p>
              Every number below is calculated from
              the centralized FinTwin financial store.
            </p>

          </div>

        </div>


        <div className="calculation-flow">

          <CalculationItem
            icon={<Wallet size={18} />}
            label="Current Cash"
            value={formatMoney(
              cashFlow.currentCash
            )}
          />

          <span className="calculation-symbol">
            +
          </span>

          <CalculationItem
            icon={<ArrowUpRight size={18} />}
            label="Receivables"
            value={formatMoney(
              cashFlow.receivables
            )}
          />

          <span className="calculation-symbol">
            −
          </span>

          <CalculationItem
            icon={<Receipt size={18} />}
            label="Expenses"
            value={formatMoney(
              cashFlow.expenses
            )}
          />

          <span className="calculation-symbol">
            =
          </span>

          <CalculationItem
            icon={<Wallet size={18} />}
            label="Projected Cash"
            value={formatMoney(
              cashFlow.projectedCash
            )}
            highlight
          />

        </div>

      </div>


      {/* ================================
          LIQUIDITY ALERT
      ================================= */}

      {cashFlow.liquidityGap > 0 ? (

        <div className="module-alert">

          <AlertTriangle size={20} />

          <div>

            <strong>
              Potential liquidity gap detected
            </strong>

            <p>
              The Digital Twin estimates a
              {` ${formatMoney(
                cashFlow.liquidityGap
              )}`} shortfall based on the
              current financial data.
            </p>

          </div>

        </div>

      ) : (

        <div className="cash-success">

          <CheckCircle size={20} />

          <div>

            <strong>
              No immediate liquidity gap
            </strong>

            <p>
              Based on the currently available
              financial data, projected cash remains
              positive.
            </p>

          </div>

        </div>

      )}

    </ModulePage>
  );
}


/* =========================================
   CALCULATION ITEM
========================================= */

function CalculationItem({
  icon,
  label,
  value,
  highlight = false,
}) {
  return (
    <div
      className={
        highlight
          ? "calculation-item highlight"
          : "calculation-item"
      }
    >

      <div className="calculation-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default CashFlow;