import ModulePage from "../components/ModulePage";

function Expenses() {
  return (
    <ModulePage
      title="Expenses"
      description="Track recurring and one-time business expenses."
      type="expenses"
    >

      <div className="module-grid">

        <div className="module-stat">
          <span>Monthly Expenses</span>
          <strong>₹8.00 L</strong>
        </div>

        <div className="module-stat">
          <span>Recurring</span>
          <strong>₹5.40 L</strong>
        </div>

        <div className="module-stat">
          <span>Variable</span>
          <strong>₹2.60 L</strong>
        </div>

      </div>

      <div className="module-card">
        <h2>Expense Management</h2>

        <p>
          Recurring expenses will feed directly into the
          cash-flow digital twin and future liquidity
          forecasts.
        </p>
      </div>

    </ModulePage>
  );
}

export default Expenses;