import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { loadFinancialData } from "./data/financialStore";

// Master Layout
import AppLayout from "./components/AppLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CashFlow from "./pages/CashFlow";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Customers from "./pages/Customers";
import Forecast from "./pages/Forecast";
import Simulator from "./pages/Simulator";
import Financing from "./pages/Financing";
import Reports from "./pages/Reports";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";

function App() {
  useEffect(() => {
    // Initiate background sync with backend / local store
    loadFinancialData();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />

          {/* Cash Flow */}
          <Route
            path="/cash-flow"
            element={
              <AppLayout>
                <CashFlow />
              </AppLayout>
            }
          />

          {/* Invoices */}
          <Route
            path="/invoices"
            element={
              <AppLayout>
                <Invoices />
              </AppLayout>
            }
          />

          {/* Expenses */}
          <Route
            path="/expenses"
            element={
              <AppLayout>
                <Expenses />
              </AppLayout>
            }
          />

          {/* Customers */}
          <Route
            path="/customers"
            element={
              <AppLayout>
                <Customers />
              </AppLayout>
            }
          />

          {/* Forecast */}
          <Route
            path="/forecast"
            element={
              <AppLayout>
                <Forecast />
              </AppLayout>
            }
          />

          {/* Simulator */}
          <Route
            path="/simulator"
            element={
              <AppLayout>
                <Simulator />
              </AppLayout>
            }
          />

          {/* Financing */}
          <Route
            path="/financing"
            element={
              <AppLayout>
                <Financing />
              </AppLayout>
            }
          />

          {/* Financial Reports */}
          <Route
            path="/reports"
            element={
              <AppLayout>
                <Reports />
              </AppLayout>
            }
          />

          {/* Accounting Integrations */}
          <Route
            path="/integrations"
            element={
              <AppLayout>
                <Integrations />
              </AppLayout>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <AppLayout>
                <Settings />
              </AppLayout>
            }
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;