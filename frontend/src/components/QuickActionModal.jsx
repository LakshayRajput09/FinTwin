import React, { useState } from "react";
import {
  X,
  FileText,
  CreditCard,
  Plus,
  Calendar,
  IndianRupee,
  Building,
  User,
} from "lucide-react";

import {
  addInvoice,
  addExpense,
  getCustomers,
} from "../data/financialStore";

export default function QuickActionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("invoice");
  const customers = getCustomers();

  // Invoice form state
  const [invCustomer, setInvCustomer] = useState(customers[0]?.name || "Customer A (Auto Corp)");
  const [invAmount, setInvAmount] = useState("");
  const [invDueDate, setInvDueDate] = useState("");
  const [invStatus, setInvStatus] = useState("Pending");

  // Expense form state
  const [expCategory, setExpCategory] = useState("Payroll & Salaries");
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expRecurring, setExpRecurring] = useState(false);

  if (!isOpen) return null;

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!invAmount) return;

    addInvoice({
      customer: invCustomer,
      amount: Number(invAmount),
      dueDate: invDueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      status: invStatus,
      source: "manual",
    });

    onClose();
  };

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!expAmount) return;

    addExpense({
      category: expCategory,
      description: expDesc || expCategory,
      amount: Number(expAmount),
      recurring: expRecurring,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="card-title-group">
            <div className="card-icon-wrap emerald">
              <Plus size={18} />
            </div>
            <div>
              <div className="modal-title">Quick Action Generator</div>
              <div className="card-subtitle">
                Add an invoice or log a new operational expense
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="tabs-container" style={{ marginBottom: 20 }}>
          <button
            className={`tab-btn ${activeTab === "invoice" ? "active" : ""}`}
            onClick={() => setActiveTab("invoice")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <FileText size={14} /> New Invoice
          </button>
          <button
            className={`tab-btn ${activeTab === "expense" ? "active" : ""}`}
            onClick={() => setActiveTab("expense")}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <CreditCard size={14} /> Log Expense
          </button>
        </div>

        {activeTab === "invoice" ? (
          <form onSubmit={handleCreateInvoice}>
            <div className="form-group">
              <label className="form-label">Client / Customer</label>
              <select
                className="form-select"
                value={invCustomer}
                onChange={(e) => setInvCustomer(e.target.value)}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.industry})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Invoice Amount (₹ INR)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 250000"
                value={invAmount}
                onChange={(e) => setInvAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select
                  className="form-select"
                  value={invStatus}
                  onChange={(e) => setInvStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create & Synchronize Invoice
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateExpense}>
            <div className="form-group">
              <label className="form-label">Expense Category</label>
              <select
                className="form-select"
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value)}
              >
                <option value="Payroll & Salaries">Payroll & Salaries</option>
                <option value="Raw Materials">Raw Materials & Inventory</option>
                <option value="Facility & Rent">Facility & Warehouse Rent</option>
                <option value="Utilities & Power">Utilities & Power</option>
                <option value="Logistics & Freight">Logistics & Freight</option>
                <option value="Software & SaaS">Software & Cloud Subscriptions</option>
                <option value="Equipment Maintenance">Equipment Maintenance</option>
                <option value="General & Misc">General & Miscellaneous</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Steel Batch #502 procurement"
                value={expDesc}
                onChange={(e) => setExpDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹ INR)</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 75000"
                value={expAmount}
                onChange={(e) => setExpAmount(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
              <input
                type="checkbox"
                id="recurringCheck"
                checked={expRecurring}
                onChange={(e) => setExpRecurring(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--accent-blue)" }}
              />
              <label htmlFor="recurringCheck" style={{ fontSize: 13, cursor: "pointer", color: "var(--text-primary)" }}>
                Monthly recurring liability (burn rate)
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-emerald">
                Record Expense
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
