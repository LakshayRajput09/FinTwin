import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useEffect } from "react";

import {
  loadFinancialData,
} from "./data/financialStore";

import Dashboard from "./pages/Dashboard";
import CashFlow from "./pages/CashFlow";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Customers from "./pages/Customers";
import Forecast from "./pages/Forecast";
import RiskAnalysis from "./pages/RiskAnalysis";
import Risk from "./pages/Risk";
import Simulator from "./pages/Simulator";
import Financing from "./pages/Financing";
import Settings from "./pages/Settings";


function App() {

  // ==========================================
  // LOAD DATABASE DATA
  // ==========================================

  useEffect(() => {

    loadFinancialData();

  }, []);


  return (
    <BrowserRouter>

      <Routes>

        {/* =================================
            DASHBOARD
        ================================= */}

        <Route
          path="/"
          element={<Dashboard />}
        />


        {/* =================================
            CASH FLOW
        ================================= */}

        <Route
          path="/cash-flow"
          element={<CashFlow />}
        />


        {/* =================================
            INVOICES
        ================================= */}

        <Route
          path="/invoices"
          element={<Invoices />}
        />


        {/* =================================
            EXPENSES
        ================================= */}

        <Route
          path="/expenses"
          element={<Expenses />}
        />


        {/* =================================
            CUSTOMERS
        ================================= */}

        <Route
          path="/customers"
          element={<Customers />}
        />


        {/* =================================
            FORECAST
        ================================= */}

        <Route
          path="/forecast"
          element={<Forecast />}
        />


        {/* =================================
            RISK ANALYSIS
        ================================= */}

        <Route
          path="/risk-analysis"
          element={<RiskAnalysis />}
        />


        {/* =================================
            AI RISK DASHBOARD
        ================================= */}

        <Route
          path="/risk"
          element={<Risk />}
        />


        {/* =================================
            SHOCK SIMULATOR
        ================================= */}

        <Route
          path="/simulator"
          element={<Simulator />}
        />


        {/* =================================
            FINANCING OPTIONS
        ================================= */}

        <Route
          path="/financing"
          element={<Financing />}
        />


        {/* =================================
            SETTINGS
        ================================= */}

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;