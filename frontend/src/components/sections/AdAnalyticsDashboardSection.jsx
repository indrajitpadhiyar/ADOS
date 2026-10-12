import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Eye,
  MousePointerClick,
  ShoppingCart,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Plus,
  Search,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Sliders,
  BarChart2,
  PieChart,
  ShieldCheck,
  Zap,
  ChevronDown,
  Activity,
  Layers,
} from "lucide-react";
import PlatformLogo from "../common/PlatformLogo";

export default function AdAnalyticsDashboardSection({ onOpenContact, onOpenAuth, onNavigate, isEmbedded = false }) {
  // Selected metric for the Big Overall Chart: 'views' | 'clicks' | 'spend' | 'conversions' | 'roas'
  const [selectedMetric, setSelectedMetric] = useState("clicks");

  // Selected timeframe: '7D' | '14D' | '30D' | '90D'
  const [timeframe, setTimeframe] = useState("30D");

  // Filter active channels in the big chart
  const [activeChannels, setActiveChannels] = useState({
    meta: true,
    google: true,
    linkedin: true,
    youtube: true,
    amazon: true,
  });

  // Hover point on chart for tooltip
  const [hoverIndex, setHoverIndex] = useState(null);

  // Table platform filter
  const [tableFilter, setTableFilter] = useState("all");
  const [tableSearch, setTableSearch] = useState("");

  // Toggle channel visibility in chart
  const toggleChannel = (channel) => {
    setActiveChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  // 30 Days synthetic cross-channel data for realistic visualization
  const chartData = useMemo(() => {
    const days = 30;
    const data = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - days);

    for (let i = 0; i < days; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      // Daily curves with organic volatility and weekend spikes
      const dayFactor = 1 + Math.sin(i / 3.5) * 0.28 + (i % 7 === 5 || i % 7 === 6 ? 0.22 : 0);

      const meta = {
        views: Math.round((140000 + i * 2800) * dayFactor),
        clicks: Math.round((5800 + i * 140) * dayFactor),
        spend: Math.round((1900 + i * 38) * dayFactor),
        conversions: Math.round((420 + i * 9) * dayFactor),
        roas: +(4.3 + Math.sin(i / 2) * 0.45).toFixed(2),
      };

      const google = {
        views: Math.round((110000 + i * 2200) * dayFactor),
        clicks: Math.round((4600 + i * 95) * dayFactor),
        spend: Math.round((1750 + i * 32) * dayFactor),
        conversions: Math.round((310 + i * 7) * dayFactor),
        roas: +(3.95 + Math.cos(i / 2.5) * 0.35).toFixed(2),
      };

      const linkedin = {
        views: Math.round((95000 + i * 2900) * dayFactor),
        clicks: Math.round((3100 + i * 85) * dayFactor),
        spend: Math.round((980 + i * 22) * dayFactor),
        conversions: Math.round((145 + i * 5) * dayFactor),
        roas: +(3.7 + Math.sin(i / 1.8) * 0.4).toFixed(2),
      };

      const youtube = {
        views: Math.round((38000 + i * 900) * dayFactor),
        clicks: Math.round((1350 + i * 32) * dayFactor),
        spend: Math.round((580 + i * 14) * dayFactor),
        conversions: Math.round((62 + i * 2) * dayFactor),
        roas: +(3.4 + Math.sin(i / 3) * 0.3).toFixed(2),
      };

      const amazon = {
        views: Math.round((10500 + i * 250) * dayFactor),
        clicks: Math.round((620 + i * 18) * dayFactor),
        spend: Math.round((340 + i * 9) * dayFactor),
        conversions: Math.round((31 + i * 1) * dayFactor),
        roas: +(5.4 + Math.sin(i / 2.2) * 0.5).toFixed(2),
      };

      const totalViews =
        (activeChannels.meta ? meta.views : 0) +
        (activeChannels.google ? google.views : 0) +
        (activeChannels.linkedin ? linkedin.views : 0) +
        (activeChannels.youtube ? youtube.views : 0) +
        (activeChannels.amazon ? amazon.views : 0);

      const totalClicks =
        (activeChannels.meta ? meta.clicks : 0) +
        (activeChannels.google ? google.clicks : 0) +
        (activeChannels.linkedin ? linkedin.clicks : 0) +
        (activeChannels.youtube ? youtube.clicks : 0) +
        (activeChannels.amazon ? amazon.clicks : 0);

      const totalSpend =
        (activeChannels.meta ? meta.spend : 0) +
        (activeChannels.google ? google.spend : 0) +
        (activeChannels.linkedin ? linkedin.spend : 0) +
        (activeChannels.youtube ? youtube.spend : 0) +
        (activeChannels.amazon ? amazon.spend : 0);

      const totalConversions =
        (activeChannels.meta ? meta.conversions : 0) +
        (activeChannels.google ? google.conversions : 0) +
        (activeChannels.linkedin ? linkedin.conversions : 0) +
        (activeChannels.youtube ? youtube.conversions : 0) +
        (activeChannels.amazon ? amazon.conversions : 0);

      const blendedRoas = +(
        ((activeChannels.meta ? meta.roas * meta.spend : 0) +
          (activeChannels.google ? google.roas * google.spend : 0) +
          (activeChannels.linkedin ? linkedin.roas * linkedin.spend : 0) +
          (activeChannels.youtube ? youtube.roas * youtube.spend : 0) +
          (activeChannels.amazon ? amazon.roas * amazon.spend : 0)) /
        (totalSpend || 1)
      ).toFixed(2);

      data.push({
        date: dateLabel,
        index: i,
        meta,
        google,
        linkedin,
        youtube,
        amazon,
        total: {
          views: totalViews,
          clicks: totalClicks,
          spend: totalSpend,
          conversions: totalConversions,
          roas: blendedRoas,
        },
      });
    }

    return data;
  }, [activeChannels]);

  // Compute SVG Points for the Chart
  const svgMetrics = useMemo(() => {
    const values = chartData.map((d) => d.total[selectedMetric]);
    const maxVal = Math.max(...values, 1) * 1.12;
    const minVal = 0;
    const width = 800;
    const height = 280;

    const points = chartData.map((d, idx) => {
      const x = (idx / (chartData.length - 1)) * width;
      const y = height - ((d.total[selectedMetric] - minVal) / (maxVal - minVal)) * height;
      return { x, y, data: d };
    });

    const dPath = points.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[i - 1];
      const cx = (prev.x + pt.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
    }, "");

    const areaPath = `${dPath} L ${width} ${height} L 0 ${height} Z`;

    return {
      points,
      dPath,
      areaPath,
      maxVal,
      width,
      height,
    };
  }, [chartData, selectedMetric]);

  // Platform Cards Details
  const platformCards = [
    {
      id: "meta",
      name: "Meta Ads",
      sub: "Facebook & Instagram",
      iconBg: "bg-blue-50 text-blue-600",
      accent: "#3b82f6",
      spend: "₹64,200",
      spendPct: "34.8%",
      views: "4,820,000",
      clicks: "198,400",
      ctr: "4.11%",
      cpc: "₹0.32",
      conversions: "14,200",
      cpa: "₹4.52",
      roas: "4.65x",
      topAsset: "UGC_Hook_Variant_04",
      status: "Autonomous Scaling (+22%)",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "google",
      name: "Google Ads",
      sub: "Search & PMax Network",
      iconBg: "bg-rose-50 text-rose-600",
      accent: "#ea4335",
      spend: "₹58,900",
      spendPct: "31.9%",
      views: "3,410,000",
      clicks: "146,200",
      ctr: "4.28%",
      cpc: "₹0.40",
      conversions: "9,850",
      cpa: "₹5.98",
      roas: "4.12x",
      topAsset: "PMax_HighIntent_US_v3",
      status: "Search Impression Share 89%",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "linkedin",
      name: "LinkedIn Ads",
      sub: "Sponsored Content & InMail",
      iconBg: "bg-blue-50 text-[#0A66C2]",
      accent: "#0A66C2",
      spend: "₹32,100",
      spendPct: "17.4%",
      views: "3,120,000",
      clicks: "92,400",
      ctr: "2.96%",
      cpc: "₹0.34",
      conversions: "4,620",
      cpa: "₹6.94",
      roas: "3.78x",
      topAsset: "Executive_ThoughtLeadership_v2",
      status: "Fatigue Protected • 0 Decayed",
      statusColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "youtube",
      name: "YouTube Ads",
      sub: "TrueView & Shorts",
      iconBg: "bg-red-50 text-red-600",
      accent: "#ef4444",
      spend: "₹18,400",
      spendPct: "10.0%",
      views: "1,180,000",
      clicks: "42,100",
      ctr: "3.56%",
      cpc: "₹0.43",
      conversions: "1,890",
      cpa: "₹9.73",
      roas: "3.45x",
      topAsset: "Brand_Story_60s_4K",
      status: "78% Avg Watch Retention",
      statusColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      id: "amazon",
      name: "Amazon DSP",
      sub: "Sponsored Products & Display",
      iconBg: "bg-amber-50 text-amber-600",
      accent: "#f59e0b",
      spend: "₹10,920",
      spendPct: "5.9%",
      views: "310,500",
      clicks: "19,140",
      ctr: "6.16%",
      cpc: "₹0.57",
      conversions: "890",
      cpa: "₹12.26",
      roas: "5.62x",
      topAsset: "Direct_Checkout_ASIN_B08",
      status: "Buy Box Win Rate 99.4%",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  // Campaign table rows
  const allCampaigns = [
    {
      id: "c1",
      name: "Meta_Advantage_Scale_US_Broad",
      platform: "meta",
      status: "Autonomous Scaling",
      spend: "₹24,500",
      views: "1,820,000",
      clicks: "78,200",
      ctr: "4.29%",
      cpa: "₹4.12",
      roas: "4.82x",
    },
    {
      id: "c2",
      name: "Google_PMax_Top_Sellers_AssetGroup",
      platform: "google",
      status: "Active Optimal",
      spend: "₹28,400",
      views: "1,640,000",
      clicks: "68,900",
      ctr: "4.20%",
      cpa: "₹5.60",
      roas: "4.35x",
    },
    {
      id: "c3",
      name: "LinkedIn_B2B_Executive_Demo_01",
      platform: "linkedin",
      status: "Fatigue Protected",
      spend: "₹14,800",
      views: "1,420,000",
      clicks: "44,100",
      ctr: "3.10%",
      cpa: "₹6.45",
      roas: "3.90x",
    },
    {
      id: "c4",
      name: "YouTube_Shorts_Direct_Conversion",
      platform: "youtube",
      status: "Active Optimal",
      spend: "₹10,200",
      views: "680,000",
      clicks: "22,400",
      ctr: "3.29%",
      cpa: "₹9.10",
      roas: "3.60x",
    },
    {
      id: "c5",
      name: "Amazon_Sponsored_Brands_HeroPack",
      platform: "amazon",
      status: "Autonomous Scaling",
      spend: "₹6,800",
      views: "195,000",
      clicks: "12,400",
      ctr: "6.35%",
      cpa: "₹11.80",
      roas: "5.80x",
    },
    {
      id: "c6",
      name: "Meta_Retargeting_Catalog_Sales_DPA",
      platform: "meta",
      status: "Active Optimal",
      spend: "₹18,400",
      views: "1,240,000",
      clicks: "58,200",
      ctr: "4.69%",
      cpa: "₹3.90",
      roas: "5.15x",
    },
  ];

  const filteredCampaigns = allCampaigns.filter((c) => {
    const matchPlatform = tableFilter === "all" || c.platform === tableFilter;
    const matchSearch = c.name.toLowerCase().includes(tableSearch.toLowerCase());
    return matchPlatform && matchSearch;
  });

  const activePoint = hoverIndex !== null ? svgMetrics.points[hoverIndex] : null;

  return (
    <section
      id="dashboard"
      className={
        isEmbedded
          ? "relative w-full py-4 text-[#111113] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
          : "relative w-full py-24 sm:py-32 bg-[#fafbfc] text-[#111113] overflow-hidden border-t border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif]"
      }
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-orange-100/20 to-cyan-100/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-purple-100/30 to-rose-100/20 rounded-full blur-[130px] pointer-events-none" />

      <div className={isEmbedded ? "w-full relative z-10 space-y-10" : "max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10 space-y-12"}>
        {/* ================= 1. HEADER & CONTROLS ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-slate-200/70">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-800 shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <Activity className="w-3.5 h-3.5 text-[#ff4a22]" />
              <span>Real-Time Omnichannel Ad Intelligence</span>
            </div>
            <h2 className={isEmbedded ? "text-2xl sm:text-4xl font-extrabold text-[#111113] tracking-tight" : "text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111113] tracking-tight"}>
              Cross-Platform Ad Analytics
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl font-normal">
              Consolidated real-time ad performance across Meta, Google Ads, LinkedIn, YouTube, and
              Amazon DSP with unified attribution and sub-second bid telemetry.
            </p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Selectors */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80 text-xs font-bold">
              {["7D", "14D", "30D", "90D"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    timeframe === t
                      ? "bg-[#111113] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Live Sync Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>14ms Live Feed</span>
            </div>

            {/* In embedded dashboard: Quick Action to Create Campaign */}
            {onNavigate && (
              <button
                onClick={() => onNavigate("create-ads")}
                className="px-4 py-2 rounded-full bg-[#ff4a22] hover:bg-[#e03d17] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Ad</span>
              </button>
            )}

            {/* Demo CTAs */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-5 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Connect Ad Accounts</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= 2. EXECUTIVE METRIC CARDS (KPI RIBBON) ================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Spend */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Total Ad Spend</span>
              <IndianRupee className="w-4 h-4 text-[#ff4a22]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111113] tracking-tight">
              ₹184,520
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2% MoM pacing</span>
            </div>
          </div>

          {/* Views & Impressions */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Total Ad Views</span>
              <Eye className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111113] tracking-tight">
              12,840,500
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.8% impressions</span>
            </div>
          </div>

          {/* Clicks */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Total Ad Clicks</span>
              <MousePointerClick className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111113] tracking-tight">
              498,240
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1.5">
              Avg CTR: <span className="text-slate-900 font-extrabold">3.88%</span> • CPC ₹0.37
            </div>
          </div>

          {/* Conversions */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Total Purchases</span>
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111113] tracking-tight">
              31,450
            </div>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Blended CPA: ₹5.86</span>
            </div>
          </div>

          {/* Blended ROAS */}
          <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-[#111113] to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-md border border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Blended ROAS</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              4.28<span className="text-[#ff4a22]">x</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+38.4% above target</span>
            </div>
          </div>
        </div>

        {/* ================= 3. THE BIG OVERALL COMBINED CROSS-PLATFORM CHART ================= */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm space-y-6">
          {/* Chart Header & Metric Selectors */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-[#111113] tracking-tight">
                  Cross-Platform Unified Performance Curve
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Daily Aggregate
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Hover over any point on the chart to inspect instant channel attribution breakdown.
              </p>
            </div>

            {/* Metric Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/70 text-xs font-bold">
              {[
                { id: "clicks", label: "Ad Clicks" },
                { id: "views", label: "Views / Impressions" },
                { id: "spend", label: "Spend (₹)" },
                { id: "conversions", label: "Conversions" },
                { id: "roas", label: "Blended ROAS" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMetric(m.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedMetric === m.id
                      ? "bg-[#111113] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Checkbox Toggles (Multi-channel filter) */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs font-bold text-slate-400">Included Networks:</span>

            {[
              { id: "meta", label: "Meta Ads" },
              { id: "google", label: "Google Ads" },
              { id: "linkedin", label: "LinkedIn Ads" },
              { id: "youtube", label: "YouTube Ads" },
              { id: "amazon", label: "Amazon DSP" },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => toggleChannel(c.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  activeChannels[c.id]
                    ? "bg-slate-50 border-slate-300 text-slate-900 shadow-2xs"
                    : "bg-slate-100/50 border-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <PlatformLogo platform={c.id} size="xs" />
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* SVG Main Chart Canvas */}
          <div className="relative pt-4 pb-2">
            <div className="relative w-full h-[320px] sm:h-[360px]">
              {/* Floating Interactive Tooltip */}
              {activePoint && (
                <div
                  className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75"
                  style={{
                    left: `${(activePoint.x / svgMetrics.width) * 100}%`,
                    top: `${(activePoint.y / svgMetrics.height) * 100 - 8}%`,
                  }}
                >
                  <div className="bg-[#111113] text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 text-xs w-60 space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                      <span className="font-extrabold text-amber-400">
                        {activePoint.data.date}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {selectedMetric.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-blue-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          Meta
                        </span>
                        <span className="font-bold">
                          {selectedMetric === "roas"
                            ? `${activePoint.data.meta.roas}x`
                            : selectedMetric === "spend"
                            ? `₹${activePoint.data.meta.spend.toLocaleString()}`
                            : activePoint.data.meta[selectedMetric].toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Google
                        </span>
                        <span className="font-bold">
                          {selectedMetric === "roas"
                            ? `${activePoint.data.google.roas}x`
                            : selectedMetric === "spend"
                            ? `₹${activePoint.data.google.spend.toLocaleString()}`
                            : activePoint.data.google[selectedMetric].toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-blue-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          LinkedIn
                        </span>
                        <span className="font-bold">
                          {selectedMetric === "roas"
                            ? `${activePoint.data.linkedin.roas}x`
                            : selectedMetric === "spend"
                            ? `₹${activePoint.data.linkedin.spend.toLocaleString()}`
                            : activePoint.data.linkedin[selectedMetric].toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-red-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          YouTube
                        </span>
                        <span className="font-bold">
                          {selectedMetric === "roas"
                            ? `${activePoint.data.youtube.roas}x`
                            : selectedMetric === "spend"
                            ? `₹${activePoint.data.youtube.spend.toLocaleString()}`
                            : activePoint.data.youtube[selectedMetric].toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Amazon
                        </span>
                        <span className="font-bold">
                          {selectedMetric === "roas"
                            ? `${activePoint.data.amazon.roas}x`
                            : selectedMetric === "spend"
                            ? `₹${activePoint.data.amazon.spend.toLocaleString()}`
                            : activePoint.data.amazon[selectedMetric].toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-white/10 flex justify-between items-center font-extrabold text-[#ff4a22]">
                      <span>Combined Total</span>
                      <span>
                        {selectedMetric === "roas"
                          ? `${activePoint.data.total.roas}x`
                          : selectedMetric === "spend"
                          ? `₹${activePoint.data.total.spend.toLocaleString()}`
                          : activePoint.data.total[selectedMetric].toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Responsive SVG Graphic */}
              <svg
                viewBox={`0 0 ${svgMetrics.width} ${svgMetrics.height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Gradient Area Fill */}
                  <linearGradient id="adosChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff4a22" stopOpacity="0.28" />
                    <stop offset="60%" stopColor="#ff4a22" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#ff4a22" stopOpacity="0.00" />
                  </linearGradient>

                  {/* Line Gradient */}
                  <linearGradient id="adosLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ff4a22" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={svgMetrics.height * pct}
                    x2={svgMetrics.width}
                    y2={svgMetrics.height * pct}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Shaded Area */}
                <path d={svgMetrics.areaPath} fill="url(#adosChartGrad)" />

                {/* Primary Spline Line */}
                <path
                  d={svgMetrics.dPath}
                  fill="none"
                  stroke="url(#adosLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Vertical Cursor Guide when hovering */}
                {activePoint && (
                  <>
                    <line
                      x1={activePoint.x}
                      y1="0"
                      x2={activePoint.x}
                      y2={svgMetrics.height}
                      stroke="#ff4a22"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <circle
                      cx={activePoint.x}
                      cy={activePoint.y}
                      r="6"
                      fill="#ff4a22"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                  </>
                )}

                {/* Invisible hover triggers over each point */}
                {svgMetrics.points.map((pt, i) => (
                  <rect
                    key={i}
                    x={pt.x - svgMetrics.width / (chartData.length * 2)}
                    y="0"
                    width={svgMetrics.width / chartData.length}
                    height={svgMetrics.height}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                ))}
              </svg>
            </div>

            {/* X-Axis Date Labels */}
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 pt-3 px-1">
              <span>{chartData[0]?.date}</span>
              <span className="hidden sm:inline">{chartData[7]?.date}</span>
              <span>{chartData[15]?.date}</span>
              <span className="hidden sm:inline">{chartData[22]?.date}</span>
              <span>{chartData[chartData.length - 1]?.date}</span>
            </div>
          </div>
        </div>

        {/* ================= 4. EVERY AD PLATFORM ANALYTICS BREAKDOWN CARDS ================= */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#111113] tracking-tight">
                Channel-by-Channel Ad Performance
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Detailed breakdowns for each ad platform currently generating active conversions.
              </p>
            </div>

            <span className="text-xs font-bold text-slate-400">
              5 Connected Ad Platforms • All Systems Nominal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {platformCards.map((platform) => (
              <div
                key={platform.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top: Icon + Platform Name */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 group-hover:text-[#ff4a22] transition-colors">
                        {platform.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {platform.sub}
                      </span>
                    </div>

                    <PlatformLogo platform={platform.id} size="md" />
                  </div>

                  {/* Spend & ROAS Hero Block */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Spend</span>
                      <span className="text-sm font-black text-slate-900">{platform.spend}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">ROAS</span>
                      <span className="text-sm font-black text-[#ff4a22]">{platform.roas}</span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Views</span>
                      <span className="font-extrabold text-slate-800">{platform.views}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">Clicks</span>
                      <span className="font-extrabold text-slate-800">{platform.clicks}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">CTR / CPC</span>
                      <span className="font-extrabold text-slate-800">
                        {platform.ctr} <span className="text-slate-400 font-normal">• {platform.cpc}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">CPA</span>
                      <span className="font-extrabold text-emerald-600">{platform.cpa}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom: Status Pill & Top Asset */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-[10px] text-slate-500 font-medium truncate">
                    Top Hook: <strong className="text-slate-800">{platform.topAsset}</strong>
                  </div>

                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${platform.statusColor}`}
                  >
                    {platform.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 5. LIVE CAMPAIGN TELEMETRY TABLE ================= */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#111113]">
                Active Ad Campaigns Telemetry
              </h3>
              <p className="text-xs text-slate-500">
                Live campaign performance ranking across all active ad networks.
              </p>
            </div>

            {/* Platform Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["all", "meta", "google", "linkedin", "youtube", "amazon"].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setTableFilter(plat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    tableFilter === plat
                      ? "bg-[#111113] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {plat !== "all" && <PlatformLogo platform={plat} size="xs" />}
                  <span>{plat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Campaign Name</th>
                  <th className="py-3 px-3">Network</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Total Spend</th>
                  <th className="py-3 px-3">Views / Impr</th>
                  <th className="py-3 px-3">Clicks & CTR</th>
                  <th className="py-3 px-3">CPA</th>
                  <th className="py-3 px-3 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {filteredCampaigns.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-[#111113]">{row.name}</td>
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs">
                        <PlatformLogo platform={row.platform} size="xs" />
                        <span className="uppercase text-[10px] font-black text-slate-700">
                          {row.platform}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-black">{row.spend}</td>
                    <td className="py-3.5 px-3">{row.views}</td>
                    <td className="py-3.5 px-3">
                      {row.clicks}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">({row.ctr})</span>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">{row.cpa}</td>
                    <td className="py-3.5 px-3 text-right font-black text-[#ff4a22]">
                      {row.roas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
