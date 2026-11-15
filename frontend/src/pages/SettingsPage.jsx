import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import SettingsSection from "../components/sections/SettingsSection";

export default function SettingsPage({ user, onUpdateUser, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <SettingsSection user={user} onUpdateUser={onUpdateUser} />
    </DashboardLayout>
  );
}
