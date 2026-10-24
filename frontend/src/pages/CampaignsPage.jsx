import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CampaignsSection from "../components/sections/CampaignsSection";

export default function CampaignsPage({ user, onLogout }) {
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
      <CampaignsSection dateRange={dateRange} searchQuery={searchQuery} />
    </DashboardLayout>
  );
}
