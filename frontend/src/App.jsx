import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AdAccountsPage from "./pages/AdAccountsPage";
import CampaignsPage from "./pages/CampaignsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import { api } from "./services/api";

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

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
