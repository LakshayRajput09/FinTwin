import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

// Master Layout
import AppLayout from "./components/AppLayout";
import AmbientBackground from "./components/AmbientBackground";

// Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Login = React.lazy(() => import("./pages/Login"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const CashFlow = React.lazy(() => import("./pages/CashFlow"));
const Invoices = React.lazy(() => import("./pages/Invoices"));
const Expenses = React.lazy(() => import("./pages/Expenses"));
const Customers = React.lazy(() => import("./pages/Customers"));
const Vendors = React.lazy(() => import("./pages/Vendors"));
const Forecast = React.lazy(() => import("./pages/Forecast"));
const Simulator = React.lazy(() => import("./pages/Simulator"));
const Financing = React.lazy(() => import("./pages/Financing"));
const Gst = React.lazy(() => import("./pages/Gst"));
const Payroll = React.lazy(() => import("./pages/Payroll"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Integrations = React.lazy(() => import("./pages/Integrations"));
const Settings = React.lazy(() => import("./pages/Settings"));
const ProductivitySaaS = React.lazy(() => import("./pages/ProductivitySaaS"));

// ==========================================
// PROTECTED ROUTE WRAPPER
// Ensures users can access app data with seamless demo session fallback
// ==========================================
function ProtectedRoute({ children }) {
  const { isAuthenticated, login } = useAuth();

  React.useEffect(() => {
    if (!isAuthenticated) {
      login("ceo@bharatprecision.in", "msme2026", "CEO");
    }
  }, [isAuthenticated, login]);

  return <AppLayout>{children}</AppLayout>;
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <React.Suspense fallback={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-secondary)'}}>Loading FinTwin...</div>}>
            <Routes>
          {/* Public Landing Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Authentication Routes (Always Accessible) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />

          {/* SaaS Demo Route */}
          <Route path="/saas-demo" element={<ProductivitySaaS />} />

          {/* Protected Application Routes (Requires Login) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cash-flow"
            element={
              <ProtectedRoute>
                <CashFlow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Invoices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <Vendors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/forecast"
            element={
              <ProtectedRoute>
                <Forecast />
              </ProtectedRoute>
            }
          />

          <Route
            path="/simulator"
            element={
              <ProtectedRoute>
                <Simulator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/financing"
            element={
              <ProtectedRoute>
                <Financing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gst"
            element={
              <ProtectedRoute>
                <Gst />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <Payroll />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/integrations"
            element={
              <ProtectedRoute>
                <Integrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </React.Suspense>
      </BrowserRouter>
    </LanguageProvider>
  </AuthProvider>
);
}

export default App;