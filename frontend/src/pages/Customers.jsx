import ModulePage from "../components/ModulePage";

function Customers() {
  return (
    <ModulePage
      title="Customers"
      description="Analyze customer payment behavior and concentration."
      type="customers"
    >

      <div className="module-grid">

        <div className="module-stat">
          <span>Total Customers</span>
          <strong>18</strong>
        </div>

        <div className="module-stat">
          <span>Receivables</span>
          <strong>₹17.20 L</strong>
        </div>

        <div className="module-stat">
          <span>Avg. Delay</span>
          <strong>18 days</strong>
        </div>

      </div>

      <div className="module-card">
        <h2>Customer Risk</h2>

        <p>
          Customer payment history will be analyzed to
          identify concentration and delayed-payment risks.
        </p>
      </div>

    </ModulePage>
  );
}

export default Customers;