import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  TrendingUp,
  AlertTriangle,
  FileText,
  Receipt,
  Users,
  FlaskConical,
  Wallet,
  Settings as SettingsIcon,
} from "lucide-react";

const icons = {
  cash: Wallet,
  invoices: FileText,
  expenses: Receipt,
  customers: Users,
  forecast: TrendingUp,
  risk: AlertTriangle,
  simulator: FlaskConical,
  settings: SettingsIcon,
};

function ModulePage({
  title,
  description,
  type,
  children,
}) {
  const Icon = icons[type] || Activity;

  return (
    <div className="module-page">

      {/* HEADER */}
      <div className="module-header">

        <div>
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="module-title">
            <div className="module-icon">
              <Icon size={24} />
            </div>

            <div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
          </div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="module-content">
        {children}
      </div>

    </div>
  );
}

export default ModulePage;