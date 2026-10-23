import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReportsSection from "../components/sections/ReportsSection";

export default function ReportsPage({ user, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <ReportsSection user={user} />
    </DashboardLayout>
  );
}
