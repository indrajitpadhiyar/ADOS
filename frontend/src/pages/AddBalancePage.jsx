import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AddBalanceSection from "../components/sections/AddBalanceSection";

export default function AddBalancePage({ user, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <AddBalanceSection />
    </DashboardLayout>
  );
}
