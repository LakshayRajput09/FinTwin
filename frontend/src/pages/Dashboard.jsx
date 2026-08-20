import {
  LayoutDashboard,
  Wallet,
  FileText,
  Receipt,
  Users,
  TrendingUp,
  AlertTriangle,
  FlaskConical,
  Settings,
  Bell,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Activity,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import "../index.css";

function Dashboard() {
  const location = useLocation();

  const menu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "Cash Flow",
      icon: Wallet,
      path: "/cash-flow",
    },
    {
      title: "Invoices",
      icon: FileText,
      path: "/invoices",
    },
    {
      title: "Expenses",
      icon: Receipt,
      path: "/expenses",
    },
    {
      title: "Customers",
      icon: Users,
      path: "/customers",
    },
  ];

  const analysisMenu = [
    {
      title: "Forecast",
      icon: TrendingUp,
      path: "/forecast",
    },
    {
      title: "Risk Analysis",
      icon: AlertTriangle,
      path: "/risk-analysis",
    },
    {
      title: "What-If Simulator",
      icon: FlaskConical,
      path: "/simulator",
    },
  ];

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo-section">
          <div className="logo-icon">
            FT
          </div>

          <div>
            <h2>FinTwin</h2>
            <span>MSME Finance</span>
          </div>
        </div>

        <div className="business-selector">
          <div className="business-avatar">
            A
          </div>

          <div className="business-info">
            <strong>ABC Manufacturing</strong>
            <span>Business Account</span>
          </div>

          <ChevronDown size={16} />
        </div>

        <nav className="navigation">

          <p className="nav-title">
            MAIN
          </p>

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path
                    ? "active"
                    : ""
                }`}
              >
                <Icon size={19} />
                {item.title}
              </Link>
            );
          })}

          <p className="nav-title">
            ANALYSIS
          </p>

          {analysisMenu.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path
                    ? "active"
                    : ""
                }`}
              >
                <Icon size={19} />
                {item.title}
              </Link>
            );
          })}

          <p className="nav-title">
            SYSTEM
          </p>

          <Link
            to="/settings"
            className={`nav-item ${
              location.pathname === "/settings"
                ? "active"
                : ""
            }`}
          >
            <Settings size={19} />
            Settings
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <div className="help-box">
            <Activity size={20} />

            <div>
              <strong>
                Financial Health
              </strong>

              <span>
                Good condition
              </span>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">

          <div>
            <h1>
              Financial Overview
            </h1>

            <p>
              Here's what's happening with your business today.
            </p>
          </div>

          <div className="topbar-actions">

            <button className="notification-btn">
              <Bell size={20} />
              <span></span>
            </button>

            <div className="profile">

              <div className="profile-avatar">
                BO
              </div>

              <div className="profile-info">
                <strong>
                  Business Owner
                </strong>

                <span>
                  Administrator
                </span>
              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </header>

        <section className="dashboard">

          {/* HEALTH BANNER */}
          <div className="health-banner">

            <div className="health-left">

              <div className="health-icon">
                <Activity size={22} />
              </div>

              <div>
                <span className="health-label">
                  FINANCIAL HEALTH
                </span>

                <h3>
                  Your business is in a healthy position
                </h3>

                <p>
                  Cash flow is stable, but receivables
                  concentration needs attention.
                </p>
              </div>

            </div>

            <div className="health-score">
              <strong>78</strong>
              <span>/100</span>
            </div>

          </div>

          {/* STATS */}
          <div className="stats-grid">

            <StatCard
              title="Current Cash"
              value="₹8.40 L"
              change="8.4% from last month"
              icon={<Wallet size={19} />}
              type="green"
              positive
            />

            <StatCard
              title="Receivables"
              value="₹17.20 L"
              change="5.2% from last month"
              icon={<IndianRupee size={19} />}
              type="blue"
              positive
            />

            <StatCard
              title="Monthly Revenue"
              value="₹12.00 L"
              change="11.8% from last month"
              icon={<TrendingUp size={19} />}
              type="purple"
              positive
            />

            <StatCard
              title="Monthly Expenses"
              value="₹8.00 L"
              change="3.1% from last month"
              icon={<Receipt size={19} />}
              type="orange"
              positive={false}
            />

          </div>

          {/* MAIN GRID */}
          <div className="content-grid">

            <CashFlowChart />

            <RiskAlerts />

          </div>

          {/* BOTTOM */}
          <div className="bottom-grid">

            <Receivables />

            <QuickActions />

          </div>

        </section>

      </main>

    </div>
  );
}


/* ================================
   STAT CARD
================================ */

function StatCard({
  title,
  value,
  change,
  icon,
  type,
  positive,
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <span>
          {title}
        </span>

        <div className={`stat-icon ${type}`}>
          {icon}
        </div>

      </div>

      <h2>
        {value}
      </h2>

      <div
        className={`stat-change ${
          positive ? "positive" : "negative"
        }`}
      >
        {positive ? (
          <ArrowUpRight size={15} />
        ) : (
          <ArrowDownRight size={15} />
        )}

        {change}
      </div>

    </div>
  );
}


/* ================================
   CASH FLOW CHART
================================ */

function CashFlowChart() {
  return (
    <div className="card cash-card">

      <div className="card-header">

        <div>
          <h3>
            Cash Flow Forecast
          </h3>

          <p>
            Projected cash position for the next 6 months
          </p>
        </div>

        <select>
          <option>
            6 Months
          </option>

          <option>
            3 Months
          </option>

          <option>
            12 Months
          </option>
        </select>

      </div>

      <div className="chart-area">

        <div className="y-axis">
          <span>₹12L</span>
          <span>₹9L</span>
          <span>₹6L</span>
          <span>₹3L</span>
          <span>₹0</span>
        </div>

        <div className="chart">

          <div className="grid-line line1" />
          <div className="grid-line line2" />
          <div className="grid-line line3" />
          <div className="grid-line line4" />
          <div className="grid-line line5" />

          <svg
            viewBox="0 0 600 220"
            preserveAspectRatio="none"
          >

            <defs>

              <linearGradient
                id="cashGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#2563eb"
                  stopOpacity="0.22"
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity="0"
                />

              </linearGradient>

            </defs>

            <path
              d="
                M0,80
                C50,75 70,90 110,78
                C150,65 165,95 210,88
                C250,82 270,70 310,78
                C350,88 370,115 410,108
                C450,100 470,135 505,145
                C540,155 560,150 600,170
                L600,220
                L0,220
                Z
              "
              fill="url(#cashGradient)"
            />

            <path
              d="
                M0,80
                C50,75 70,90 110,78
                C150,65 165,95 210,88
                C250,82 270,70 310,78
                C350,88 370,115 410,108
                C450,100 470,135 505,145
                C540,155 560,150 600,170
              "
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
            />

          </svg>

          <div className="warning-point">
            <AlertTriangle size={15} />
          </div>

        </div>

      </div>

      <div className="chart-labels">
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
        <span>Jan</span>
      </div>

    </div>
  );
}


/* ================================
   RISK ALERTS
================================ */

function RiskAlerts() {
  return (
    <div className="card risk-card">

      <div className="card-header">

        <div>
          <h3>
            Risk Alerts
          </h3>

          <p>
            Issues that need your attention
          </p>
        </div>

        <Link
          to="/risk-analysis"
          className="view-btn"
        >
          View all
        </Link>

      </div>

      <div className="risk-list">

        <RiskItem
          type="high"
          title="Customer Concentration"
          description="Customer A represents 58.8% of total receivables."
          label="HIGH RISK"
        />

        <RiskItem
          type="medium"
          title="Delayed Payments"
          description="Average payment delay increased by 12 days."
          label="MEDIUM RISK"
        />

        <RiskItem
          type="low"
          title="Expense Growth"
          description="Operating expenses remain within expected range."
          label="LOW RISK"
        />

      </div>

    </div>
  );
}


function RiskItem({
  type,
  title,
  description,
  label,
}) {
  return (
    <div className={`risk-item ${type}`}>

      <div className="risk-symbol">
        <AlertTriangle size={18} />
      </div>

      <div className="risk-content">

        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>

        <span>
          {label}
        </span>

      </div>

    </div>
  );
}


/* ================================
   RECEIVABLES
================================ */

function Receivables() {
  return (
    <div className="card">

      <div className="card-header">

        <div>
          <h3>
            Receivables Overview
          </h3>

          <p>
            Outstanding customer payments
          </p>
        </div>

        <Link
          to="/invoices"
          className="view-btn"
        >
          View invoices
        </Link>

      </div>

      <div className="receivable-list">

        <Customer
          letter="A"
          name="Customer A"
          invoices="8 invoices outstanding"
          amount="₹10.10 L"
          status="High"
          statusClass="danger"
        />

        <Customer
          letter="B"
          name="Customer B"
          invoices="4 invoices outstanding"
          amount="₹4.20 L"
          status="Medium"
          statusClass="warning"
        />

        <Customer
          letter="C"
          name="Customer C"
          invoices="2 invoices outstanding"
          amount="₹2.10 L"
          status="Low"
          statusClass="safe"
        />

      </div>

    </div>
  );
}


function Customer({
  letter,
  name,
  invoices,
  amount,
  status,
  statusClass,
}) {
  return (
    <div className="customer-row">

      <div className="customer-avatar">
        {letter}
      </div>

      <div className="customer-details">

        <strong>
          {name}
        </strong>

        <span>
          {invoices}
        </span>

      </div>

      <strong>
        {amount}
      </strong>

      <span className={`status ${statusClass}`}>
        {status}
      </span>

    </div>
  );
}


/* ================================
   QUICK ACTIONS
================================ */

function QuickActions() {
  return (
    <div className="card quick-card">

      <div className="card-header">

        <div>
          <h3>
            Quick Actions
          </h3>

          <p>
            Manage your financial data
          </p>
        </div>

      </div>

      <div className="quick-actions">

        <Link to="/invoices">
          <FileText size={20} />

          <span>
            <strong>
              Add Invoice
            </strong>

            <small>
              Record a new invoice
            </small>
          </span>

          <ArrowUpRight size={17} />
        </Link>

        <Link to="/expenses">
          <Receipt size={20} />

          <span>
            <strong>
              Add Expense
            </strong>

            <small>
              Record a business expense
            </small>
          </span>

          <ArrowUpRight size={17} />
        </Link>

        <Link to="/simulator">
          <FlaskConical size={20} />

          <span>
            <strong>
              Run Simulation
            </strong>

            <small>
              Test a financial scenario
            </small>
          </span>

          <ArrowUpRight size={17} />
        </Link>

      </div>

    </div>
  );
}

export default Dashboard;