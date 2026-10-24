import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardOverviewSection from "../components/sections/DashboardOverviewSection";

export default function DashboardPage({ user, onLogout }) {
  const [dateRange, setDateRange] = useState("LAST_30_DAYS");
  const [searchQuery, setSearchQuery] = useState("");

  // If accidentally loaded inside a popup window, redirect opener and close popup
  useEffect(() => {
    if (window.opener && window.opener !== window) {
      try {
        window.opener.location.href = "/dashboard";
      } catch (e) {}
      window.close();
    }
  }, []);

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <DashboardOverviewSection
        user={user}
        dateRange={dateRange}
        searchQuery={searchQuery}
      />
    </DashboardLayout>
  );
}
