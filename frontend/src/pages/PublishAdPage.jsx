import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import PublishAdSection from "../components/sections/PublishAdSection";

export default function PublishAdPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <PublishAdSection
        onAdPublished={() => {}}
        onNavigateToManage={() => navigate("/manage-ads")}
      />
    </DashboardLayout>
  );
}
