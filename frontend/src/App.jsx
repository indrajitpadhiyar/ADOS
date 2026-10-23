import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ManageAdsPage from "./pages/ManageAdsPage";
import CreateAdPage from "./pages/CreateAdPage";
import GenerateVideoPage from "./pages/GenerateVideoPage";
import PublishAdPage from "./pages/PublishAdPage";
import ManageAccountPage from "./pages/ManageAccountPage";
import SettingsPage from "./pages/SettingsPage";
import AddBalancePage from "./pages/AddBalancePage";
import UpgradePlanPage from "./pages/UpgradePlanPage";
import ReportsPage from "./pages/ReportsPage";
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
    api.getMe()
      .then((res) => {
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("ados_user", JSON.stringify(res.user));
        }
      })
      .catch(() => {
        // If 7 days have passed without visiting, auto-logout cleanly
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

        {/* Main Dashboard Overview */}
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

        {/* Manage Ads Page */}
        <Route
          path="/manage-ads"
          element={
            user ? (
              <ManageAdsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/manage-ads"
          element={
            user ? (
              <ManageAdsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Create Ad Page */}
        <Route
          path="/create-ads"
          element={
            user ? (
              <CreateAdPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/create-ads"
          element={
            user ? (
              <CreateAdPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/generate-poster"
          element={
            user ? (
              <CreateAdPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/generate-poster"
          element={
            user ? (
              <CreateAdPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/generate-video"
          element={
            user ? (
              <GenerateVideoPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/generate-video"
          element={
            user ? (
              <GenerateVideoPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Publish Ads Page */}
        <Route
          path="/publish-ads"
          element={
            user ? (
              <PublishAdPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/publish-ads"
          element={
            user ? (
              <PublishAdPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Redirect old campaign route to Create Ads */}
        <Route
          path="/create-campaign"
          element={<Navigate to="/create-ads" replace />}
        />
        <Route
          path="/dashboard/create-campaign"
          element={<Navigate to="/create-ads" replace />}
        />

        {/* Manage Connected Accounts & Team */}
        <Route
          path="/manage-account"
          element={
            user ? (
              <ManageAccountPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/manage-account"
          element={
            user ? (
              <ManageAccountPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* System Settings & API */}
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
        <Route
          path="/dashboard/settings"
          element={
            user ? (
              <SettingsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Add Account Balance Page */}
        <Route
          path="/add-balance"
          element={
            user ? (
              <AddBalancePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/add-balance"
          element={
            user ? (
              <AddBalancePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Upgrade Plan Page */}
        <Route
          path="/upgrade-plan"
          element={
            user ? (
              <UpgradePlanPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/dashboard/upgrade-plan"
          element={
            user ? (
              <UpgradePlanPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Reports Page */}
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
        <Route
          path="/dashboard/reports"
          element={
            user ? (
              <ReportsPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
