import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import AdAnalyticsDashboardSection from "./AdAnalyticsDashboardSection";
import GoogleAdsIntegrationPanel from "../common/GoogleAdsIntegrationPanel";

export default function ReportsSection({ user }) {
  const [activeReportTab, setActiveReportTab] = useState("cross-channel"); // 'cross-channel' | 'google-ads'

  return (
    <div className="w-full space-y-8 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 pb-16">
      {/* 1. TOP HEADER & REPORT CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200">
            <Activity className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>Automated Performance Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Marketing Reports & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Real-time attribution, cross-channel spend efficiency, and Google Ads live telemetry.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200/90 shrink-0">
          <button
            onClick={() => setActiveReportTab("cross-channel")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeReportTab === "cross-channel"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>Omnichannel Cockpit</span>
          </button>

          <button
            onClick={() => setActiveReportTab("google-ads")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeReportTab === "google-ads"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Google Ads Live</span>
          </button>
        </div>
      </div>

      {/* 2. REPORT CONTENT BODY */}
      {activeReportTab === "cross-channel" ? (
        <div className="space-y-6">
          <AdAnalyticsDashboardSection isEmbedded={true} />
        </div>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Google Ads API connection and real-time campaign performance analytics.</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-md">
              OAuth 2.0 Secure
            </span>
          </div>

          <GoogleAdsIntegrationPanel />
        </div>
      )}
    </div>
  );
}
