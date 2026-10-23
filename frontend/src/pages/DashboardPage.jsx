import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardOverviewSection from "../components/sections/DashboardOverviewSection";

export default function DashboardPage({ user, onLogout }) {
  const navigate = useNavigate();

  // If accidentally loaded inside a popup window, redirect opener to full browser dashboard and close popup
  useEffect(() => {
    if (window.opener && window.opener !== window) {
      try {
        window.opener.location.href = "/dashboard";
      } catch (e) {}
      window.close();
    }
  }, []);

  const handleNavigate = (tab) => {
    switch (tab) {
      case "dashboard":
        navigate("/dashboard");
        break;
      case "manage-ads":
        navigate("/manage-ads");
        break;
      case "create-ads":
      case "create-campaign":
        navigate("/create-ads");
        break;
      case "publish-ads":
        navigate("/publish-ads");
        break;
      case "upgrade-plan":
        navigate("/upgrade-plan");
        break;
      case "reports":
        navigate("/reports");
        break;
      case "manage-account":
        navigate("/manage-account");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <DashboardOverviewSection user={user} onNavigate={handleNavigate} />
    </DashboardLayout>
  );
}
