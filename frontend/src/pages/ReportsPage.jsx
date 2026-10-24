import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import ReportsSection from "../components/sections/ReportsSection";

export default function ReportsPage({ user, onLogout }) {
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
      <ReportsSection dateRange={dateRange} />
    </DashboardLayout>
  );
}
