import ModulePage from "../components/ModulePage";

function RiskAnalysis() {
  return (
    <ModulePage
      title="Risk Analysis"
      description="Identify concentration and delayed-payment risks."
      type="risk"
    >

      <div className="module-grid">

        <div className="module-stat">
          <span>Overall Risk</span>
          <strong>Medium</strong>
        </div>

        <div className="module-stat">
          <span>Concentration</span>
          <strong>58.8%</strong>
        </div>

        <div className="module-stat">
          <span>Avg. Payment Delay</span>
          <strong>18 Days</strong>
        </div>

      </div>

      <div className="module-card">

        <h2>⚠ Customer Concentration</h2>

        <p>
          Customer A represents 58.8% of outstanding
          receivables. A significant delay from this
          customer could create liquidity pressure.
        </p>

      </div>

      <div className="module-card">

        <h2>⚠ Delayed Payments</h2>

        <p>
          Payment history indicates that some customers
          are consistently paying after their agreed
          payment terms.
        </p>

      </div>

    </ModulePage>
  );
}

export default RiskAnalysis;