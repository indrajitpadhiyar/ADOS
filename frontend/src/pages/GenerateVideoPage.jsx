import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import GenerateVideoSection from "../components/sections/GenerateVideoSection";

export default function GenerateVideoPage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <GenerateVideoSection user={user} onNavigateBack={() => navigate(-1)} />
    </DashboardLayout>
  );
}
