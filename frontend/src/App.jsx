import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { api } from "./services/api";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import PlatformsPage from "./pages/PlatformsPage";
import ResultsPage from "./pages/ResultsPage";
import AboutPage from "./pages/AboutPage";

import DashboardPage from "./pages/DashboardPage";
import AdAccountsPage from "./pages/AdAccountsPage";
import CampaignsPage from "./pages/CampaignsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

// Lazy-loaded route components for high-speed initial page loads & code splitting
const AuthPage = lazy(() => import("./pages/AuthPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const DataDeletionPage = lazy(() => import("./pages/DataDeletionPage"));
const AgentPage = lazy(() => import("./pages/AgentPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const SupportPage = lazy(() => import("./pages/SupportPage"));

// Instant scroll to top on client-side route change without reloading
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Persistent Public Layout to preserve continuous Navbar & smooth layoutId transitions
function PublicLayout({ user }) {
  return (
    <div className="w-full min-h-screen">
      <ScrollToTop />
      <Navbar user={user} />
      <Outlet />
    </div>
  );
}

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
        {/* Main Website Pages with Continuous Persistent Navbar */}
        <Route element={<PublicLayout user={user} />}>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/platforms" element={<PlatformsPage user={user} />} />
          <Route path="/platform" element={<Navigate to="/platforms" replace />} />
          <Route path="/results" element={<ResultsPage user={user} />} />
          <Route path="/result" element={<Navigate to="/results" replace />} />
          <Route path="/about" element={<AboutPage user={user} />} />
          <Route path="/about-us" element={<Navigate to="/about" replace />} />
          <Route path="/product" element={<Navigate to="/" replace />} />
          <Route path="/solutions" element={<Navigate to="/" replace />} />
          <Route path="/solution" element={<Navigate to="/" replace />} />
        </Route>

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
              <SettingsPage user={user} onUpdateUser={setUser} onLogout={handleLogout} />
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
        <Route path="/privacy-policy" element={<PrivacyPolicyPage user={user} />} />
        <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
        <Route path="/terms" element={<TermsPage user={user} />} />
        <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
        <Route path="/data-deletion" element={<DataDeletionPage user={user} />} />
        <Route path="/data-deletion-instructions" element={<Navigate to="/data-deletion" replace />} />

        {/* AI Agent Coming Soon Page */}
        <Route path="/agent" element={<AgentPage user={user} />} />
        <Route path="/ai-agent" element={<Navigate to="/agent" replace />} />

        {/* Dedicated Contact Us Page */}
        <Route path="/contact" element={<ContactPage user={user} />} />
        <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
        <Route path="/contect" element={<ContactPage user={user} />} />
        <Route path="/contect-us" element={<Navigate to="/contact" replace />} />

        {/* Support & Help Center Page */}
        <Route path="/support" element={<SupportPage user={user} />} />
        <Route path="/help" element={<Navigate to="/support" replace />} />
        <Route path="/support-center" element={<Navigate to="/support" replace />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
  );
}
