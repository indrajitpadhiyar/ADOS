import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  Layers,
  Target,
  Eye,
  MousePointer,
  CreditCard,
  TrendingUp,
  Receipt,
  Filter,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  MoreHorizontal,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function DashboardOverviewSection({ user, dateRange = "LAST_30_DAYS", searchQuery = "" }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAnalyticsOverview(dateRange);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to load analytics overview:", err);
      setError(err.message || "Failed to load advertising analytics.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper formatters
  const formatCurrency = (val, symbol = "₹") => {
    if (val === undefined || val === null) return `${symbol}0`;
    return `${symbol}${Number(val).toLocaleString("en-IN")}`;
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return "0";
    return Number(val).toLocaleString("en-IN");
  };

  // Pure real metrics strictly from API
  const isConnected = Boolean(analyticsData?.isConnected);
  const currencySymbol = analyticsData?.currencySymbol || "₹";

  const googleData = analyticsData?.platforms?.google || {
    connected: false,
    spend: 0,
    percentage: 0,
    accountName: null,
    accountId: null,
    error: null,
  };

  const metaData = analyticsData?.platforms?.meta || {
    connected: false,
    spend: 0,
    percentage: 0,
    accountName: null,
    accountId: null,
    error: null,
  };

  const totals = analyticsData?.totals || {
    totalSpend: 0,
    totalConversions: 0,
    totalImpressions: 0,
    totalClicks: 0,
    avgCpc: 0,
    ctr: 0,
    cpm: 0,
    conversionRate: 0,
    roas: null,
  };

  const timeSeries = Array.isArray(analyticsData?.timeSeries) ? analyticsData.timeSeries : [];

  let topCampaigns = Array.isArray(analyticsData?.topCampaigns) ? analyticsData.topCampaigns : [];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    topCampaigns = topCampaigns.filter((c) => (c.name || "").toLowerCase().includes(q));
  }

  // Determine if there is real activity in the time series
  const hasChartActivity = timeSeries.some(
    (t) => (t.spend || 0) > 0 || (t.clicks || 0) > 0 || (t.conversions || 0) > 0
  );

  // Calculate SVG dimensions and bezier paths for the Line Chart (Memoized)
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const { spendPoints, clicksPoints, convPoints, spendPath, clicksPath, convPath } = useMemo(() => {
    if (timeSeries.length === 0) {
      return {
        spendPoints: [],
        clicksPoints: [],
        convPoints: [],
        spendPath: "",
        clicksPath: "",
        convPath: "",
      };
    }

    let maxSpend = 100;
    let maxClicks = 10;
    let maxConv = 5;

    for (let i = 0; i < timeSeries.length; i++) {
      const s = timeSeries[i].spend || 0;
      const c = timeSeries[i].clicks || 0;
      const cv = timeSeries[i].conversions || 0;
      if (s > maxSpend) maxSpend = s;
      if (c > maxClicks) maxClicks = c;
      if (cv > maxConv) maxConv = cv;
    }

    const getPoints = (accessor, maxVal) => {
      const divisor = timeSeries.length > 1 ? timeSeries.length - 1 : 1;
      return timeSeries.map((d, i) => {
        const x = paddingX + (i / divisor) * (svgWidth - paddingX * 2);
        const val = accessor(d) || 0;
        const y = svgHeight - paddingY - (val / (maxVal || 1)) * (svgHeight - paddingY * 2);
        return { x, y, data: d, val };
      });
    };

    const spPoints = getPoints((d) => d.spend, maxSpend);
    const clPoints = getPoints((d) => d.clicks, maxClicks);
    const coPoints = getPoints((d) => d.conversions, maxConv);

    const createSmoothPath = (points) => {
      if (points.length < 2) return "";
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? 0 : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }
      return d;
    };

    return {
      spendPoints: spPoints,
      clicksPoints: clPoints,
      convPoints: coPoints,
      spendPath: createSmoothPath(spPoints),
      clicksPath: createSmoothPath(clPoints),
      convPath: createSmoothPath(coPoints),
    };
  }, [timeSeries]);

  // Platform performance donut calculation (Strictly proportional to real spend)
  const totalSpendNum = totals.totalSpend || 0;
  const gSpendNum = googleData.spend || 0;
  const mSpendNum = metaData.spend || 0;
  const gPercent = totalSpendNum > 0 ? (gSpendNum / totalSpendNum) * 100 : 0;
  const mPercent = totalSpendNum > 0 ? (mSpendNum / totalSpendNum) * 100 : 0;

  // Donut SVG circumference with r=54
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const gOffset = circumference * (1 - gPercent / 100);
  const mOffset = circumference * (1 - mPercent / 100);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] select-none animate-fadeIn">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time advertising performance across your connected Google & Meta accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAnalytics}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            title="Refresh analytics from ad networks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : "text-slate-500"}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            onClick={() => navigate("/ad-accounts")}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Manage Ad Accounts</span>
          </button>
        </div>
      </div>

      {/* Disconnected Accounts Banner */}
      {!isLoading && !isConnected && (
        <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border border-blue-200/70 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Connect your Google Ads or Meta Ads account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
                ADOS connects directly to official advertising APIs via OAuth 2.0. Connect your accounts to stream live impressions, real spend, clicks, and verified conversions.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/ad-accounts")}
            className="px-4 py-2 rounded-xl bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 font-bold text-xs cursor-pointer transition-colors shadow-2xs self-start md:self-auto shrink-0"
          >
            Connect Ad Accounts →
          </button>
        </div>
      )}

      {/* 2. TOP ROW - PLATFORM & TOTAL CARDS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Google Ads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformLogo platform="google" size="xs" />
              <span className="text-xs font-bold text-slate-800">Google Ads</span>
            </div>
            {googleData.connected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Not Connected</span>
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatCurrency(googleData.spend, currencySymbol)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
              {googleData.accountName
                ? `${googleData.accountName} (${googleData.accountId || ""})`
                : "Total Platform Spend"}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            {googleData.connected ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live API Sync Active</span>
              </span>
            ) : (
              <button
                onClick={() => navigate("/ad-accounts")}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Connect Google Ads →</span>
              </button>
            )}
            <span className="text-slate-400 font-mono text-[10px]">
              {googleData.percentage || 0}% share
            </span>
          </div>
        </div>

        {/* Card 2: Meta Ads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformLogo platform="meta" size="xs" />
              <span className="text-xs font-bold text-slate-800">Meta Ads</span>
            </div>
            {metaData.connected ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Connected</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Not Connected</span>
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatCurrency(metaData.spend, currencySymbol)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
              {metaData.accountName
                ? `${metaData.accountName} (${metaData.accountId || ""})`
                : "Total Platform Spend"}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            {metaData.connected ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live API Sync Active</span>
              </span>
            ) : (
              <button
                onClick={() => navigate("/ad-accounts")}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Connect Meta Ads →</span>
              </button>
            )}
            <span className="text-slate-400 font-mono text-[10px]">
              {metaData.percentage || 0}% share
            </span>
          </div>
        </div>

        {/* Card 3: Total Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-800">Total Spend</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" title="Sum of real spend across connected networks" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatCurrency(totals.totalSpend, currencySymbol)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Unified Campaign Expenditure
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] font-medium text-slate-500">
            {totals.totalSpend > 0 ? (
              <span className="text-emerald-600 font-semibold">Active spend recorded</span>
            ) : (
              <span className="text-slate-400">No spend recorded in this period</span>
            )}
          </div>
        </div>

        {/* Card 4: Total Conversions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-800">Total Conversions</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" title="Verified conversions attributed by ad networks" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatNumber(totals.totalConversions)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Attributed Actions / Leads
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] font-medium text-slate-500">
            {totals.totalConversions > 0 ? (
              <span className="text-emerald-600 font-semibold">Verified network conversions</span>
            ) : (
              <span className="text-slate-400">0 conversions recorded in this period</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. SECONDARY ROW - 7 METRIC CARDS (Strictly real data) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Impressions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Impressions</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {formatNumber(totals.totalImpressions)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Total Views
          </div>
        </div>

        {/* Clicks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <MousePointer className="w-3.5 h-3.5 text-slate-400" />
            <span>Clicks</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {formatNumber(totals.totalClicks)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Traffic Generated
          </div>
        </div>

        {/* Avg. CPC */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <span>Avg. CPC</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {currencySymbol}{totals.avgCpc}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Cost Per Click
          </div>
        </div>

        {/* CTR */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
            <span>CTR</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {totals.ctr}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Click-Through Rate
          </div>
        </div>

        {/* CPM */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <span>CPM</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {currencySymbol}{totals.cpm}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Cost / 1K Views
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Conversion Rate</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {totals.conversionRate}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Clicks to Action
          </div>
        </div>

        {/* ROAS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <LineChart className="w-3.5 h-3.5 text-slate-400" />
            <span>ROAS</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {totals.roas !== null && totals.roas !== undefined ? `${totals.roas}x` : "—"}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Return on Ad Spend
          </div>
        </div>
      </div>

      {/* 4. CHARTS SECTION (2 COLUMNS: 65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart: Performance Overview (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">
                Performance Overview
              </h3>
              <p className="text-[11px] text-slate-400">
                Continuous telemetry across connected ad platforms
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                <span>Spend</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span>Clicks</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                <span>Conversions</span>
              </span>
            </div>
          </div>

          {/* SVG Line Chart OR Clean Empty State */}
          <div className="relative w-full pt-4 min-h-[16rem] flex items-center justify-center">
            {hasChartActivity ? (
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = svgHeight - paddingY - ratio * (svgHeight - paddingY * 2);
                  const val = Math.round(maxSpend * ratio);
                  return (
                    <g key={ratio}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {formatNumber(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Area fills */}
                {spendPoints.length > 1 && (
                  <path
                    d={`${spendPath} L ${spendPoints[spendPoints.length - 1].x} ${svgHeight - paddingY} L ${spendPoints[0].x} ${svgHeight - paddingY} Z`}
                    fill="url(#spendGrad)"
                  />
                )}

                {/* Stroke Lines */}
                {spendPoints.length > 1 && (
                  <path
                    d={spendPath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {clicksPoints.length > 1 && (
                  <path
                    d={clicksPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {convPoints.length > 1 && (
                  <path
                    d={convPath}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points */}
                {spendPoints.map((pt, i) => (
                  <circle
                    key={`sp-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-5 transition-all"
                    onMouseEnter={() => setActiveTooltip(pt.data)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  />
                ))}

                {/* X Axis Date labels */}
                {timeSeries.map((d, i) => {
                  const divisor = timeSeries.length > 1 ? timeSeries.length - 1 : 1;
                  const x = paddingX + (i / divisor) * (svgWidth - paddingX * 2);
                  return (
                    <text
                      key={`label-${i}`}
                      x={x}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {d.date}
                    </text>
                  );
                })}
              </svg>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    No Campaign Activity Recorded in this Period
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    {isConnected
                      ? "Your connected advertising accounts have 0 spend or impressions for this date range."
                      : "Connect your Google Ads or Meta Ads account to visualize live performance."}
                  </p>
                </div>
                {!isConnected && (
                  <button
                    onClick={() => navigate("/ad-accounts")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Connect Ad Account
                  </button>
                )}
              </div>
            )}

            {/* Hover Tooltip display */}
            {activeTooltip && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-3 z-10">
                <span className="font-bold">{activeTooltip.date}:</span>
                <span className="text-blue-300">Spend: {formatCurrency(activeTooltip.spend, currencySymbol)}</span>
                <span className="text-emerald-300">Clicks: {formatNumber(activeTooltip.clicks)}</span>
                <span className="text-purple-300">Conv: {activeTooltip.conversions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Platform Performance Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Platform Spend Distribution
            </h3>
            <p className="text-[11px] text-slate-400">
              Proportional media allocation
            </p>
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                {/* Background track */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="16"
                />
                {/* Google Ads Segment (Blue) */}
                {gPercent > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={gOffset}
                    strokeLinecap="round"
                  />
                )}
                {/* Meta Ads Segment (Purple/Violet) */}
                {mPercent > 0 && (
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke="#8b5cf6"
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={mOffset}
                    transform={`rotate(${(gPercent / 100) * 360} 70 70)`}
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                <span className="text-sm font-black text-[#0f172a] truncate w-full">
                  {formatCurrency(totals.totalSpend, currencySymbol)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Total Spend
                </span>
              </div>
            </div>

            {/* Platform Legend */}
            <div className="space-y-4 w-full">
              {/* Google Ads */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <PlatformLogo platform="google" size="xs" />
                  <span className="text-xs font-semibold text-slate-700">Google Ads</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0f172a]">
                    {formatCurrency(googleData.spend, currencySymbol)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {googleData.percentage || 0}%
                  </div>
                </div>
              </div>

              {/* Meta Ads */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
                  <PlatformLogo platform="meta" size="xs" />
                  <span className="text-xs font-semibold text-slate-700">Meta Ads</span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0f172a]">
                    {formatCurrency(metaData.spend, currencySymbol)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {metaData.percentage || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Pacing Status</span>
            {totals.totalSpend > 0 ? (
              <span className="text-emerald-600 font-bold">Active Pacing</span>
            ) : (
              <span className="text-slate-400 font-semibold">Standby ({currencySymbol}0 Spend)</span>
            )}
          </div>
        </div>
      </div>

      {/* 5. TOP CAMPAIGNS TABLE (Strictly Real Campaigns) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">
              Active Campaigns
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Live campaign records fetched from Google Ads & Meta Ads
            </p>
          </div>
          <button
            onClick={() => navigate("/campaigns")}
            className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all campaigns</span>
            <span>→</span>
          </button>
        </div>

        {topCampaigns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Campaign Name</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Spend</th>
                  <th className="py-3 px-4 text-right">Impressions</th>
                  <th className="py-3 px-4 text-right">Clicks</th>
                  <th className="py-3 px-4 text-right">CTR</th>
                  <th className="py-3 px-4 text-right">Conversions</th>
                  <th className="py-3 px-4 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {topCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Campaign Name */}
                    <td className="py-3.5 px-4 font-semibold text-[#0f172a]">
                      <div className="flex items-center gap-2.5">
                        <PlatformLogo platform={camp.platform} size="xs" />
                        <span className="truncate max-w-[200px]">{camp.name}</span>
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                        <PlatformLogo platform={camp.platform} size="xs" />
                        <span>{camp.platformName || (camp.platform === "google" ? "Google Ads" : "Meta Ads")}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          camp.status === "Active" || camp.status === "ENABLED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            camp.status === "Active" || camp.status === "ENABLED" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{camp.status}</span>
                      </span>
                    </td>

                    {/* Spend */}
                    <td className="py-3.5 px-4 text-right font-bold text-[#0f172a]">
                      {formatCurrency(camp.spend, currencySymbol)}
                    </td>

                    {/* Impressions */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatNumber(camp.impressions)}
                    </td>

                    {/* Clicks */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatNumber(camp.clicks)}
                    </td>

                    {/* CTR */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {camp.ctr}%
                    </td>

                    {/* Conversions */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatNumber(camp.conversions)}
                    </td>

                    {/* ROAS */}
                    <td className="py-3.5 px-4 text-right font-semibold text-[#0f172a]">
                      {camp.roas !== null && camp.roas !== undefined ? `${camp.roas}x` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                No Real Campaigns Found
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {isConnected
                  ? "No advertising campaigns were returned for this date range from your connected ad accounts."
                  : "Connect your Google Ads or Meta Ads account in Ad Accounts to synchronize live campaigns and performance metrics."}
              </p>
            </div>
            {!isConnected && (
              <button
                onClick={() => navigate("/ad-accounts")}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Go to Ad Accounts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
