import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AiCopilotModal from "./AiCopilotModal";
import QuickActionModal from "./QuickActionModal";
import CommandSearchModal from "./CommandSearchModal";
import { Sparkles } from "lucide-react";

export default function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`main-content-wrapper ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <Topbar
          onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="page-container">{children}</main>
      </div>

      {/* Floating AI Copilot Trigger (when closed) */}
      {!isAiCopilotOpen && (
        <button
          className="floating-copilot-btn"
          onClick={() => setIsAiCopilotOpen(true)}
          title="Open FinTwin AI Financial Copilot"
        >
          <Sparkles size={18} />
          <span>Ask FinTwin</span>
        </button>
      )}

      {/* Floating AI Copilot Drawer */}
      <AiCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
      />

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
      />

      {/* Command Search Modal */}
      <CommandSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
