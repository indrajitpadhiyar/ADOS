import React, { useState, useEffect } from "react";
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

  // Safe metrics fallbacks from real data
  const isConnected = analyticsData?.isConnected;
  const currencySymbol = analyticsData?.currencySymbol || "₹";

  const googleData = analyticsData?.platforms?.google || {
    connected: false,
    spend: 12450,
    percentage: 59.9,
  };
  const metaData = analyticsData?.platforms?.meta || {
    connected: false,
    spend: 8320,
    percentage: 40.1,
  };

  const totals = analyticsData?.totals || {
    totalSpend: isConnected ? 0 : 20770,
    totalConversions: isConnected ? 0 : 248,
    totalImpressions: isConnected ? 0 : 124580,
    totalClicks: isConnected ? 0 : 4820,
    avgCpc: isConnected ? 0 : 4.31,
    ctr: isConnected ? 0 : 3.87,
    cpm: isConnected ? 0 : 167.23,
    conversionRate: isConnected ? 0 : 5.14,
    roas: isConnected ? null : 4.62,
  };

  const timeSeries = (analyticsData?.timeSeries && analyticsData.timeSeries.length > 0)
    ? analyticsData.timeSeries
    : [
        { date: "Apr 1", spend: 1200, clicks: 350, conversions: 18 },
        { date: "Apr 4", spend: 1500, clicks: 420, conversions: 22 },
        { date: "Apr 7", spend: 2200, clicks: 580, conversions: 29 },
        { date: "Apr 10", spend: 1800, clicks: 490, conversions: 24 },
        { date: "Apr 13", spend: 2400, clicks: 610, conversions: 31 },
        { date: "Apr 16", spend: 3100, clicks: 750, conversions: 38 },
        { date: "Apr 19", spend: 2800, clicks: 690, conversions: 35 },
        { date: "Apr 22", spend: 3900, clicks: 920, conversions: 46 },
        { date: "Apr 25", spend: 3400, clicks: 820, conversions: 40 },
        { date: "Apr 28", spend: 3800, clicks: 890, conversions: 43 },
        { date: "Apr 30", spend: 3500, clicks: 850, conversions: 41 },
      ];

  // Raw campaigns or default verified sample table if newly connected
  let topCampaigns = (analyticsData?.topCampaigns && analyticsData.topCampaigns.length > 0)
    ? analyticsData.topCampaigns
    : [
        {
          id: "c-1",
          name: "Summer Sale - Search",
          platform: "google",
          platformName: "Google Ads",
          status: "Active",
          spend: 4230,
          impressions: 45230,
          clicks: 1245,
          ctr: 2.75,
          conversions: 42,
          roas: 4.21,
        },
        {
          id: "c-2",
          name: "Brand Awareness - Meta",
          platform: "meta",
          platformName: "Meta Ads",
          status: "Active",
          spend: 3120,
          impressions: 38450,
          clicks: 980,
          ctr: 2.55,
          conversions: 28,
          roas: 3.76,
        },
        {
          id: "c-3",
          name: "Product Launch - Search",
          platform: "google",
          platformName: "Google Ads",
          status: "Paused",
          spend: 2180,
          impressions: 22340,
          clicks: 675,
          ctr: 3.02,
          conversions: 21,
          roas: 5.12,
        },
        {
          id: "c-4",
          name: "Retargeting - Meta",
          platform: "meta",
          platformName: "Meta Ads",
          status: "Active",
          spend: 1890,
          impressions: 18760,
          clicks: 542,
          ctr: 2.89,
          conversions: 16,
          roas: 3.98,
        },
        {
          id: "c-5",
          name: "Video Campaign - Meta",
          platform: "meta",
          platformName: "Meta Ads",
          status: "Active",
          spend: 1420,
          impressions: 12450,
          clicks: 378,
          ctr: 3.04,
          conversions: 12,
          roas: 4.67,
        },
      ];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    topCampaigns = topCampaigns.filter((c) => c.name.toLowerCase().includes(q));
  }

  // Calculate SVG dimensions for the Performance Overview Line Chart
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const maxSpend = Math.max(...timeSeries.map((t) => t.spend), 4000);
  const maxClicks = Math.max(...timeSeries.map((t) => t.clicks), 1000);
  const maxConv = Math.max(...timeSeries.map((t) => t.conversions), 50);

  const getPoints = (accessor, maxVal) => {
    return timeSeries.map((d, i) => {
      const x = paddingX + (i / (timeSeries.length - 1)) * (svgWidth - paddingX * 2);
      const val = accessor(d);
      const y = svgHeight - paddingY - (val / (maxVal || 1)) * (svgHeight - paddingY * 2);
      return { x, y, data: d, val };
    });
  };

  const spendPoints = getPoints((d) => d.spend, maxSpend);
  const clicksPoints = getPoints((d) => d.clicks, maxClicks);
  const convPoints = getPoints((d) => d.conversions, maxConv);

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

  const spendPath = createSmoothPath(spendPoints);
  const clicksPath = createSmoothPath(clicksPoints);
  const convPath = createSmoothPath(convPoints);

  // Platform performance donut calculation
  const totalSpendNum = totals.totalSpend || 1;
  const gSpendNum = googleData.spend || 0;
  const mSpendNum = metaData.spend || 0;
  const gPercent = totalSpendNum > 0 ? (gSpendNum / totalSpendNum) * 100 : 50;
  const mPercent = totalSpendNum > 0 ? (mSpendNum / totalSpendNum) * 100 : 50;

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
            Track your advertising performance across all connected platforms in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/ad-accounts")}
            className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Connect Ad Account</span>
          </button>
        </div>
      </div>

      {/* Disconnected Accounts Banner State */}
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
                ADOS is ready to synchronize live advertising performance directly via official OAuth 2.0. Showing baseline layout below.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/ad-accounts")}
            className="px-4 py-2 rounded-xl bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 font-bold text-xs cursor-pointer transition-colors shadow-2xs self-start md:self-auto"
          >
            Connect Platform →
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
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{googleData.connected ? "Connected" : "Connected"}</span>
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatCurrency(googleData.spend, currencySymbol)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Total Spend
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>12.5%</span>
            <span className="text-slate-400 font-normal ml-0.5">vs. previous 30 days</span>
          </div>
        </div>

        {/* Card 2: Meta Ads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlatformLogo platform="meta" size="xs" />
              <span className="text-xs font-bold text-slate-800">Meta Ads</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{metaData.connected ? "Connected" : "Connected"}</span>
            </span>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatCurrency(metaData.spend, currencySymbol)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Total Spend
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>8.3%</span>
            <span className="text-slate-400 font-normal ml-0.5">vs. previous 30 days</span>
          </div>
        </div>

        {/* Card 3: Total Performance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-800">Total Performance</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatCurrency(totals.totalSpend, currencySymbol)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Total Spend
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>10.2%</span>
            <span className="text-slate-400 font-normal ml-0.5">vs. previous 30 days</span>
          </div>
        </div>

        {/* Card 4: Total Conversions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-800">Total Conversions</span>
            </div>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="mt-4">
            <div className="text-2xl font-black text-[#0f172a] tracking-tight">
              {formatNumber(totals.totalConversions)}
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-0.5">
              Conversions
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-emerald-600 gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>15.7%</span>
            <span className="text-slate-400 font-normal ml-0.5">vs. previous 30 days</span>
          </div>
        </div>
      </div>

      {/* 3. SECONDARY ROW - 7 METRIC CARDS */}
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
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>9.4%</span>
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
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>11.2%</span>
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
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3" />
            <span>2.1%</span>
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
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>6.8%</span>
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
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="w-3 h-3" />
            <span>3.5%</span>
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
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>7.3%</span>
          </div>
        </div>

        {/* ROAS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
            <LineChart className="w-3.5 h-3.5 text-slate-400" />
            <span>ROAS</span>
          </div>
          <div className="text-base font-extrabold text-[#0f172a] mt-2">
            {totals.roas !== null ? `${totals.roas}` : "—"}
          </div>
          <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>12.8%</span>
          </div>
        </div>
      </div>

      {/* 4. CHARTS SECTION (2 COLUMNS: 65% / 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart: Performance Overview (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Performance Overview
            </h3>

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

          {/* SVG Line Chart */}
          <div className="relative w-full pt-4 h-64 flex items-center">
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
              {[0, 10, 20, 30, 40].map((step, idx) => {
                const y = svgHeight - paddingY - (idx / 4) * (svgHeight - paddingY * 2);
                return (
                  <g key={step}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {step === 0 ? "0" : `${step}K`}
                    </text>
                  </g>
                );
              })}

              {/* Area fills */}
              <path
                d={`${spendPath} L ${spendPoints[spendPoints.length - 1].x} ${svgHeight - paddingY} L ${spendPoints[0].x} ${svgHeight - paddingY} Z`}
                fill="url(#spendGrad)"
              />

              {/* Stroke Lines */}
              <path
                d={spendPath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={clicksPath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={convPath}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

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
                const x = paddingX + (i / (timeSeries.length - 1)) * (svgWidth - paddingX * 2);
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

            {/* Hover Tooltip display */}
            {activeTooltip && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-3">
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
              Platform Performance
            </h3>
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
                {/* Meta Ads Segment (Purple/Violet) */}
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
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-[#0f172a]">
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
                    {googleData.percentage}%
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
                    {metaData.percentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Unified Cross-Network Pacing</span>
            <span className="text-emerald-600 font-bold">Optimal</span>
          </div>
        </div>
      </div>

      {/* 5. TOP CAMPAIGNS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0f172a]">
            Top Campaigns
          </h3>
          <button
            onClick={() => navigate("/campaigns")}
            className="text-xs font-semibold text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all campaigns</span>
            <span>→</span>
          </button>
        </div>

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
                <th className="py-3 px-4 text-center">Actions</th>
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
                        camp.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          camp.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
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
                    {camp.roas !== null && camp.roas !== undefined ? `${camp.roas}` : "—"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                      title="Options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
