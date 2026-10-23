import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import UpgradePlanSection from "../components/sections/UpgradePlanSection";

export default function UpgradePlanPage({ user, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <UpgradePlanSection user={user} />
    </DashboardLayout>
  );
}
