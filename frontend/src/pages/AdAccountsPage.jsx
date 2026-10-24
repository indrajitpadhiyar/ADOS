import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AdAccountsSection from "../components/sections/AdAccountsSection";

export default function AdAccountsPage({ user, onLogout }) {
  const [dateRange, setDateRange] = useState("LAST_30_DAYS");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <AdAccountsSection />
    </DashboardLayout>
  );
}
