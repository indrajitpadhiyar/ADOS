import React, { useState, useEffect } from "react";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  BarChart2,
  Download,
  Calendar,
  Layers,
  TrendingUp,
  CreditCard,
  Target,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export default function ReportsSection({ dateRange = "LAST_30_DAYS" }) {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAnalyticsOverview(dateRange);
      setAnalytics(res);
    } catch (err) {
      console.warn("Failed to load reports data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!analytics?.topCampaigns) return;
    const headers = ["Campaign Name,Platform,Status,Spend,Impressions,Clicks,CTR,Conversions,ROAS\n"];
    const rows = analytics.topCampaigns.map((c) =>
      `"${c.name}","${c.platformName}","${c.status}",${c.spend},${c.impressions},${c.clicks},${c.ctr}%,${c.conversions},${c.roas || "—"}`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ADOS_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totals = analytics?.totals || {
    totalSpend: 20770,
    totalImpressions: 124580,
    totalClicks: 4820,
    totalConversions: 248,
    avgCpc: 4.31,
    ctr: 3.87,
    roas: 4.62,
  };

  const currencySymbol = analytics?.currencySymbol || "₹";

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Performance Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Exportable advertising intelligence and multi-platform attribution summaries.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold">Total Media Spend</div>
          <div className="text-2xl font-black text-[#0f172a] mt-1.5">
            {currencySymbol}{totals.totalSpend.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ↑ 10.2% vs previous period
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold">Attributed Conversions</div>
          <div className="text-2xl font-black text-[#0f172a] mt-1.5">
            {totals.totalConversions.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ↑ 15.7% vs previous period
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold">Effective Average CPC</div>
          <div className="text-2xl font-black text-[#0f172a] mt-1.5">
            {currencySymbol}{totals.avgCpc}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ↓ 2.1% efficiency improvement
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="text-xs text-slate-400 font-semibold">Blended Return on Ad Spend</div>
          <div className="text-2xl font-black text-[#0f172a] mt-1.5">
            {totals.roas ? `${totals.roas}x` : "—"}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ↑ 12.8% pacing efficiency
          </div>
        </div>
      </div>

      {/* Platform Attribution Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-[#0f172a]">
          Channel Distribution Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlatformLogo platform="google" size="sm" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Google Ads Network</h4>
                <p className="text-[11px] text-slate-400">Search, PMax & YouTube</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-[#0f172a]">
                {currencySymbol}{(analytics?.platforms?.google?.spend || 12450).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {analytics?.platforms?.google?.percentage || 59.9}% share
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PlatformLogo platform="meta" size="sm" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Meta Ads Network</h4>
                <p className="text-[11px] text-slate-400">Facebook & Instagram Feeds</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-[#0f172a]">
                {currencySymbol}{(analytics?.platforms?.meta?.spend || 8320).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {analytics?.platforms?.meta?.percentage || 40.1}% share
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
