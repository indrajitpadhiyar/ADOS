import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { api } from "./services/api";

// Lazy-loaded route components for high-speed initial page loads & code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdAccountsPage = lazy(() => import("./pages/AdAccountsPage"));
const CampaignsPage = lazy(() => import("./pages/CampaignsPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const DataDeletionPage = lazy(() => import("./pages/DataDeletionPage"));
const AgentPage = lazy(() => import("./pages/AgentPage"));

function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-[#2563eb] rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400 tracking-wide">Loading ADOS...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ados_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Verify backend session on mount (supports 7-day cookies & automatic sliding refresh)
  useEffect(() => {
    api
      .getMe()
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("ados_user", JSON.stringify(res.user));
        }
      })
      .catch(() => {
        localStorage.removeItem("ados_token");
        localStorage.removeItem("ados_user");
        setUser(null);
      });
  }, []);

  const handleLoginSuccess = (userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem("ados_user", JSON.stringify(userData));
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage user={user} />} />

        {/* Authentication Page */}
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Main Dashboard / Overview */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <DashboardPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="/overview" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/overview" element={<Navigate to="/dashboard" replace />} />

        {/* Ad Accounts Hub */}
        <Route
          path="/ad-accounts"
          element={
            user ? (
              <AdAccountsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="/dashboard/ad-accounts" element={<Navigate to="/ad-accounts" replace />} />
        <Route path="/manage-account" element={<Navigate to="/ad-accounts" replace />} />
        <Route path="/dashboard/manage-account" element={<Navigate to="/ad-accounts" replace />} />

        {/* Campaigns Analytics Page */}
        <Route
          path="/campaigns"
          element={
            user ? (
              <CampaignsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="/dashboard/campaigns" element={<Navigate to="/campaigns" replace />} />

        {/* Reports Analytics Page */}
        <Route
          path="/reports"
          element={
            user ? (
              <ReportsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="/dashboard/reports" element={<Navigate to="/reports" replace />} />

        {/* Settings Page */}
        <Route
          path="/settings"
          element={
            user ? (
              <SettingsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="/dashboard/settings" element={<Navigate to="/settings" replace />} />

        {/* Clean redirects for removed obsolete routes */}
        <Route path="/manage-ads" element={<Navigate to="/campaigns" replace />} />
        <Route path="/dashboard/manage-ads" element={<Navigate to="/campaigns" replace />} />
        <Route path="/create-ads" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/create-ads" element={<Navigate to="/dashboard" replace />} />
        <Route path="/generate-poster" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/generate-poster" element={<Navigate to="/dashboard" replace />} />
        <Route path="/generate-video" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/generate-video" element={<Navigate to="/dashboard" replace />} />
        <Route path="/publish-ads" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/publish-ads" element={<Navigate to="/dashboard" replace />} />
        <Route path="/create-campaign" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/create-campaign" element={<Navigate to="/dashboard" replace />} />
        <Route path="/add-balance" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/add-balance" element={<Navigate to="/dashboard" replace />} />
        <Route path="/upgrade-plan" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/upgrade-plan" element={<Navigate to="/dashboard" replace />} />

        {/* Legal & Compliance Pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
        <Route path="/data-deletion" element={<DataDeletionPage />} />
        <Route path="/data-deletion-instructions" element={<Navigate to="/data-deletion" replace />} />

        {/* AI Agent Coming Soon Page */}
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/ai-agent" element={<Navigate to="/agent" replace />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
  );
}
