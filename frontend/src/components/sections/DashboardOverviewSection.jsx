import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Users,
  Search,
  SlidersHorizontal,
  Bell,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
  ArrowUpRight,
  Filter,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Zap,
} from "lucide-react";

// Platform Config & Colors inspired by clean editorial design
const PLATFORMS = [
  { id: "all", label: "All Networks", short: "All", color: "#0f766e" },
  { id: "facebook", label: "Facebook & Instagram (Meta)", short: "Facebook", color: "#1877F2" },
  { id: "google", label: "Google Ads & PMax", short: "Google", color: "#0F9D58" },
  { id: "linkedin", label: "LinkedIn Marketing", short: "LinkedIn", color: "#0A66C2" },
  { id: "amazon", label: "Amazon DSP & Ads", short: "Amazon", color: "#d97706" },
];

export default function DashboardOverviewSection({ user, onNavigate }) {
  // Platform filter
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  // Timeframe period toggle: 'daily' | 'weekly' | 'monthly'
  const [period, setPeriod] = useState("monthly");
  // Table search
  const [searchQuery, setSearchQuery] = useState("");
  // Table status filter
  const [tableStatus, setTableStatus] = useState("all");
  // Hover index for chart
  const [hoverIndex, setHoverIndex] = useState(null);

  // Live campaigns fetched from backend MongoDB
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalSpend: "₹35,960",
    blendedRoas: "4.85x",
    totalConversions: "6,979",
    activeAds: 0,
  });

  // Fetch real ads from backend
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const adsData = await api.getAds();
        if (Array.isArray(adsData)) {
          const mapped = adsData.map((ad) => ({
            id: ad._id,
            name: ad.name,
            platform: ad.platform === "meta" ? "facebook" : ad.platform,
            category: ad.category || `${ad.platform} Ads`,
            price: ad.spend ? ad.spend.replace("$", "₹") : "₹0",
            pacingPercent: ad.pacingPercent || 75,
            pacingColor: ad.pacingColor || "bg-[#0f766e]",
            stockVal: ad.budget || 100,
            status: ad.status === "active" ? "Active" : "Paused",
            statusType: ad.status,
            sales: ad.conversions || "0",
            roas: ad.roas || "4.50x",
            lastUpdated: new Date(ad.updatedAt || ad.createdAt || Date.now()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            avatar: ad.thumbnail || "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=120&auto=format&fit=crop&q=80",
          }));
          setCampaigns(mapped);
        }

        const statsData = await api.getAdStats();
        if (statsData) {
          setStats({
            ...statsData,
            totalSpend: statsData.totalSpend ? statsData.totalSpend.replace("$", "₹") : "₹35,960",
          });
        }
      } catch (err) {
        console.warn("Telemetry fetch notice:", err.message);
      }
    };

    fetchRealData();
  }, []);

  // Toggle status between Active and Paused via real backend
  const handleToggleStatus = async (id) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === "Active" ? "Paused" : "Active";
          return {
            ...c,
            status: next,
            statusType: next === "Active" ? "active" : "paused",
          };
        }
        return c;
      })
    );

    try {
      await api.toggleAdStatus(id);
    } catch (err) {
      console.error("Failed to toggle status on backend:", err);
    }
  };

  // Filtered campaigns based on platform and search
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchPlatform =
        selectedPlatform === "all" || c.platform === selectedPlatform;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        tableStatus === "all" ||
        (tableStatus === "active" && c.status === "Active") ||
        (tableStatus === "paused" && c.status === "Paused");
      return matchPlatform && matchSearch && matchStatus;
    });
  }, [campaigns, selectedPlatform, searchQuery, tableStatus]);

  // Dynamic KPI values based on selected platform
  const kpiData = useMemo(() => {
    if (selectedPlatform === "facebook") {
      return {
        campaignsCount: "482",
        campaignsBadge: "+18% this month",
        activeAds: "184",
        activeAdsBadge: "+12% this week",
        revenue: "₹48,200",
        revenueBadge: "+24% this month",
        roas: "5.18x",
        roasBadge: "+14% growth",
        subtitle: "Showing verified Facebook & Instagram (Meta) ads telemetry",
      };
    }
    if (selectedPlatform === "google") {
      return {
        campaignsCount: "340",
        campaignsBadge: "+10% this month",
        activeAds: "112",
        activeAdsBadge: "+6% this week",
        revenue: "₹32,800",
        revenueBadge: "+15% this month",
        roas: "4.65x",
        roasBadge: "+8% growth",
        subtitle: "Showing Google Search, Shopping & Performance Max telemetry",
      };
    }
    if (selectedPlatform === "linkedin") {
      return {
        campaignsCount: "195",
        campaignsBadge: "+25% this month",
        activeAds: "68",
        activeAdsBadge: "+9% this week",
        revenue: "₹18,400",
        revenueBadge: "+31% this month",
        roas: "4.10x",
        roasBadge: "+11% growth",
        subtitle: "Showing LinkedIn Sponsored Content & Lead Gen telemetry",
      };
    }
    if (selectedPlatform === "amazon") {
      return {
        campaignsCount: "124",
        campaignsBadge: "+8% this month",
        activeAds: "42",
        activeAdsBadge: "+4% this week",
        revenue: "₹14,650",
        revenueBadge: "+19% this month",
        roas: "5.85x",
        roasBadge: "+16% growth",
        subtitle: "Showing Amazon Sponsored Brands & DSP telemetry",
      };
    }
    // Default All
    return {
      campaignsCount: "1,248",
      campaignsBadge: "+12% this month",
      activeAds: "356",
      activeAdsBadge: "+8% this week",
      revenue: "₹124,450",
      revenueBadge: "+18% this month",
      roas: "4.82x",
      roasBadge: "+9% growth",
      subtitle: "Consolidated omnichannel telemetry across all active networks",
    };
  }, [selectedPlatform]);

  // Donut chart shares based on platform filter
  const donutShares = useMemo(() => {
    if (selectedPlatform === "facebook") {
      return [
        { name: "Instagram Reels UGC", percent: 48, color: "#1e564d" },
        { name: "Advantage+ Shopping", percent: 30, color: "#3d8272" },
        { name: "Facebook Feed Carousel", percent: 15, color: "#e8a867" },
        { name: "Stories & Messenger", percent: 7, color: "#4f7b94" },
      ];
    }
    if (selectedPlatform === "google") {
      return [
        { name: "Performance Max (Omni)", percent: 52, color: "#1e564d" },
        { name: "Search Exact Match", percent: 28, color: "#3d8272" },
        { name: "Shopping Smart Bidding", percent: 14, color: "#e8a867" },
        { name: "YouTube TrueView", percent: 6, color: "#4f7b94" },
      ];
    }
    return [
      { name: "Meta (Facebook & IG)", percent: 48, color: "#1e564d" },
      { name: "Google Ads (PMax)", percent: 30, color: "#3d8272" },
      { name: "LinkedIn Ads", percent: 15, color: "#0A66C2" },
      { name: "Amazon DSP & Other", percent: 7, color: "#4f7b94" },
    ];
  }, [selectedPlatform]);

  // 3-Month Performance Overview Subcards & Bar Chart Data
  const monthlyCards = useMemo(() => {
    if (selectedPlatform === "facebook") {
      return [
        { month: "January", shortMonth: "Jan", val: "₹12,400", rawVal: 12400, sub: "Baseline", isUp: false },
        { month: "February", shortMonth: "Feb", val: "₹18,200", rawVal: 18200, sub: "+46.7%", isUp: true },
        { month: "March", shortMonth: "Mar", val: "₹24,800", rawVal: 24800, sub: "+36.2%", isUp: true },
      ];
    }
    return [
      { month: "January", shortMonth: "Jan", val: "₹8,200", rawVal: 8200, sub: "Baseline", isUp: false },
      { month: "February", shortMonth: "Feb", val: "₹9,100", rawVal: 9100, sub: "+11.0%", isUp: true },
      { month: "March", shortMonth: "Mar", val: "₹12,450", rawVal: 12450, sub: "+36.8%", isUp: true },
    ];
  }, [selectedPlatform]);

  // Chart configuration matching the second image (Combo Bar + Trendline)
  const chartConfig = useMemo(() => {
    const isFacebook = selectedPlatform === "facebook";
    const maxVal = isFacebook ? 28000 : 14000;
    const ticks = isFacebook
      ? [
          { val: 28000, label: "₹28k" },
          { val: 24000, label: "₹24k" },
          { val: 20000, label: "₹20k" },
          { val: 16000, label: "₹16k" },
          { val: 12000, label: "₹12k" },
          { val: 8000, label: "₹8k" },
          { val: 4000, label: "₹4k" },
          { val: 0, label: "0" },
        ]
      : [
          { val: 14000, label: "₹14k" },
          { val: 12000, label: "₹12k" },
          { val: 10000, label: "₹10k" },
          { val: 8000, label: "₹8k" },
          { val: 6000, label: "₹6k" },
          { val: 4000, label: "₹4k" },
          { val: 2000, label: "₹2k" },
          { val: 0, label: "0" },
        ];

    const topY = 26;
    const baseY = 194;
    const plotH = baseY - topY;

    const getY = (val) => baseY - (val / maxVal) * plotH;

    const xCoords = [140, 315, 490];
    const bars = monthlyCards.map((item, idx) => {
      const x = xCoords[idx];
      const y = getY(item.rawVal);
      const h = baseY - y;
      return {
        ...item,
        x,
        y,
        h,
        barW: 46,
      };
    });

    // Smooth subtle trendline spline passing through top center of each bar
    const trendPath = `M ${bars[0].x} ${bars[0].y} C ${bars[0].x + 70} ${bars[0].y - 3}, ${bars[1].x - 60} ${bars[1].y + 2}, ${bars[1].x} ${bars[1].y} C ${bars[1].x + 60} ${bars[1].y - 2}, ${bars[2].x - 60} ${bars[2].y + 10}, ${bars[2].x} ${bars[2].y}`;

    return { ticks, bars, getY, baseY, trendPath };
  }, [monthlyCards, selectedPlatform]);

  return (
    <div className="w-full space-y-7 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 pb-12">
      {/* ================= 1. HEADER TITLE & SEARCH ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Welcome back, {user?.name || "Marouane"} — here's what's growing today
          </p>
        </div>

        {/* Top search & quick filter pill */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns, ads, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200/80 rounded-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20 focus:border-[#0f766e] shadow-2xs"
            />
          </div>

          <button
            onClick={() => onNavigate("create-ads")}
            className="px-4 py-2 rounded-full bg-[#0f766e] hover:bg-[#0d655f] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+ Create Ad</span>
          </button>
        </div>
      </div>

      {/* ================= 2. PLATFORM INTELLIGENCE FILTER PILL BAR ================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-[24px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pl-2">
            Filter View:
          </span>
          {PLATFORMS.map((plat) => {
            const isSelected = selectedPlatform === plat.id;
            return (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0f766e] text-white shadow-xs scale-102"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {plat.id !== "all" ? (
                  <PlatformLogo platform={plat.id === "facebook" ? "meta" : plat.id} size="xs" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                )}
                <span>{plat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Filter Indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pr-2">
          {selectedPlatform !== "all" && (
            <button
              onClick={() => setSelectedPlatform("all")}
              className="text-[#0f766e] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to All</span>
            </button>
          )}
          <span className="text-[11px] text-slate-400">● {kpiData.subtitle}</span>
        </div>
      </div>

      {/* ================= 3. TOP 4 WHITE KPI CARDS (MATCHING REFERENCE IMAGE) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Campaigns */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="w-4 h-4 text-slate-400 flex items-center justify-center">🌱</span>
            <span>Total Campaigns</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {kpiData.campaignsCount}
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <span>{kpiData.campaignsBadge}</span>
          </div>
        </div>

        {/* Card 2: Active Ads */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="w-4 h-4 text-slate-400 flex items-center justify-center">📦</span>
            <span>Active Ad Sets</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {kpiData.activeAds}
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <span>{kpiData.activeAdsBadge}</span>
          </div>
        </div>

        {/* Card 3: Revenue / Value */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="w-4 h-4 text-slate-400 flex items-center justify-center">💵</span>
            <span>Attributed Revenue</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {kpiData.revenue}
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <span>{kpiData.revenueBadge}</span>
          </div>
        </div>

        {/* Card 4: Blended ROAS */}
        <div className="bg-white p-6 rounded-[28px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="w-4 h-4 text-slate-400 flex items-center justify-center">👥</span>
            <span>Blended ROAS</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {kpiData.roas}
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <span>{kpiData.roasBadge}</span>
          </div>
        </div>
      </div>

      {/* ================= 4. MIDDLE SECTION: PERFORMANCE OVERVIEW + CATEGORIES + ALERTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* LEFT COLUMN: PERFORMANCE OVERVIEW (7 COLS) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-6">
          {/* Header & Daily/Weekly/Monthly Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Revenue 2026
              </span>
              <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Performance Overview
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f8f0] text-[#1ea56e] text-[11px] font-bold">
                  <span>↗</span>
                  <span>+16% growth this quarter</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Track your monthly revenue and growth at a glance.
              </p>
            </div>

            {/* Segmented Pill Control: Daily | Weekly | Monthly */}
            <div className="flex items-center bg-slate-50 p-1 rounded-full border border-slate-200/60 text-xs font-bold shrink-0 self-start">
              {["Daily", "Weekly", "Monthly"].map((p) => {
                const lower = p.toLowerCase();
                const isAct = period === lower;
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(lower)}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      isAct
                        ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Monthly Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {monthlyCards.map((m, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-1.5"
              >
                <div className="text-xs font-semibold text-slate-400">{m.month}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {m.val}
                </div>
                <div
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    m.isUp ? "text-[#1ea56e]" : "text-slate-400"
                  }`}
                >
                  {m.isUp && <span>↑</span>}
                  <span>{m.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Revenue Graph Card (Matching Image 2 Combo Bar + Trendline) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            {/* Inner Header & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Monthly Revenue</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your revenue is growing steadily over the last 3 months.
                </p>
              </div>

              {/* Legend: Revenue (INR / ₹) pill & Trend line */}
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600 self-start sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-[4px] bg-[#22a36b] inline-block" />
                  <span>Revenue (INR / ₹)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[#22a36b] inline-block" />
                  <span>Trend</span>
                </div>
              </div>
            </div>

            {/* SVG Combo Chart */}
            <div className="relative w-full select-none pt-2">
              <svg
                viewBox="0 0 600 240"
                className="w-full h-auto overflow-visible"
              >
                {/* Horizontal Dashed Grid Lines & Y-axis labels */}
                {chartConfig.ticks.map((t, idx) => {
                  const y = chartConfig.getY(t.val);
                  return (
                    <g key={idx}>
                      <text
                        x="34"
                        y={y + 3.5}
                        textAnchor="end"
                        fill="#94a3b8"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {t.label}
                      </text>
                      <line
                        x1="45"
                        y1={y}
                        x2="585"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    </g>
                  );
                })}

                {/* Bars (Column Chart with Top-Rounded Corners) */}
                {chartConfig.bars.map((bar, idx) => {
                  const isHovered = hoverIndex === idx;
                  const barX = bar.x - bar.barW / 2;
                  const barY = bar.y;
                  const r = 6;
                  // SVG Path for top-rounded rectangle with flat bottom at baseline
                  const barPath = `
                    M ${barX} ${chartConfig.baseY}
                    L ${barX} ${barY + r}
                    Q ${barX} ${barY} ${barX + r} ${barY}
                    L ${barX + bar.barW - r} ${barY}
                    Q ${barX + bar.barW} ${barY} ${barX + bar.barW} ${barY + r}
                    L ${barX + bar.barW} ${chartConfig.baseY}
                    Z
                  `;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoverIndex(idx)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <path
                        d={barPath}
                        fill={isHovered ? "#1ea56e" : "#22a36b"}
                        className="transition-colors duration-200"
                      />
                      {/* Bar Value text above bar */}
                      <text
                        x={bar.x}
                        y={bar.y - 10}
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize="12"
                        fontWeight="700"
                      >
                        {bar.val}
                      </text>
                    </g>
                  );
                })}

                {/* Trend Line connecting the dots */}
                <path
                  d={chartConfig.trendPath}
                  fill="none"
                  stroke="#22a36b"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />

                {/* Dots on top center of bars */}
                {chartConfig.bars.map((bar, idx) => {
                  const isHovered = hoverIndex === idx;
                  return (
                    <circle
                      key={idx}
                      cx={bar.x}
                      cy={bar.y}
                      r={isHovered ? "5" : "3.5"}
                      fill="#ffffff"
                      stroke="#22a36b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoverIndex(idx)}
                      onMouseLeave={() => setHoverIndex(null)}
                    />
                  );
                })}

                {/* X-Axis Month Labels */}
                {chartConfig.bars.map((bar, idx) => (
                  <text
                    key={idx}
                    x={bar.x}
                    y="226"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="12"
                    fontWeight="500"
                  >
                    {bar.shortMonth}
                  </text>
                ))}
              </svg>
            </div>

            {/* Bottom-left updated timestamp */}
            <div className="pt-2 text-[11px] text-slate-400">
              Updated Apr 30, 2026
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CATEGORIES DONUT + ALERTS (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. CATEGORIES DONUT CHART CARD */}
          <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              {selectedPlatform === "facebook" ? "Facebook Placements" : "Network Share"}
            </h3>

            <div className="flex items-center justify-between gap-6">
              {/* Clean SVG Donut Chart */}
              <div className="relative w-32 h-32 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Segment 1: 48% (stroke-dasharray 120 251) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#1e564d"
                    strokeWidth="15"
                    strokeDasharray="115 238"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: 30% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#4ea18d"
                    strokeWidth="15"
                    strokeDasharray="72 238"
                    strokeDashoffset="-118"
                  />
                  {/* Segment 3: 15% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#e8a867"
                    strokeWidth="15"
                    strokeDasharray="36 238"
                    strokeDashoffset="-193"
                  />
                  {/* Segment 4: 7% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#648ba2"
                    strokeWidth="15"
                    strokeDasharray="17 238"
                    strokeDashoffset="-231"
                  />
                </svg>
              </div>

              {/* Legend with colored dots + percentages */}
              <div className="flex-1 space-y-2 text-xs">
                {donutShares.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600 font-medium truncate max-w-[130px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-800 text-[11px]">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. ALERTS LIST CARD MATCHING IMAGE */}
          <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Alerts</h3>

            <div className="space-y-3">
              {/* Alert 1: Red/Pink square */}
              <div className="flex items-center justify-between gap-3 p-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">
                      High ROAS Spike — Meta Reels
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Scaling budget +₹450 recommended
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  10 Février 2026 à 09:00
                </span>
              </div>

              {/* Alert 2: Amber square */}
              <div className="flex items-center justify-between gap-3 p-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">
                      3 pending ad approvals
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Awaiting network review
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  10 Février 2026 à 09:00
                </span>
              </div>

              {/* Alert 3: Blue square */}
              <div className="flex items-center justify-between gap-3 p-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-800">
                      New audience cohort synced
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Awaiting your approval
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  10 Février 2026 à 09:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 5. POPULAR CAMPAIGNS & ADS TABLE (MATCHING REFERENCE IMAGE) ================= */}
      <div className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">🌱</span>
            <h3 className="text-base font-extrabold text-slate-900">
              {selectedPlatform === "all"
                ? "Popular Campaigns & Ads"
                : `${PLATFORMS.find((p) => p.id === selectedPlatform)?.label} Campaigns`}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              ({filteredCampaigns.length})
            </span>
          </div>

          {/* Secondary status filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold bg-slate-50 p-1 rounded-full border border-slate-200/60">
            {["all", "active", "paused"].map((st) => (
              <button
                key={st}
                onClick={() => setTableStatus(st)}
                className={`px-3 py-1 rounded-full capitalize transition-all cursor-pointer ${
                  tableStatus === st
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Table with horizontal stock/pacing progress bars */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                <th className="py-3 px-3">Campaign name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Daily budget</th>
                <th className="py-3 px-3">Budget pacing</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Sales / Clicks</th>
                <th className="py-3 px-3 text-right">Last updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {filteredCampaigns.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Campaign Name + Avatar */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                      <span className="font-extrabold text-slate-900 text-xs truncate max-w-[220px]">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Category Pill (mint/indoor pastel style) */}
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs">
                      <PlatformLogo platform={row.platform === "facebook" ? "meta" : row.platform} size="xs" />
                      <span className="text-[10px] font-extrabold text-slate-800">
                        {row.category}
                      </span>
                    </div>
                  </td>

                  {/* Price / Budget */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-800">
                    {row.price}
                  </td>

                  {/* Stock / Budget Pacing Progress Bar (Matching Image) */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.pacingColor}`}
                          style={{ width: `${row.pacingPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600">
                        {row.stockVal}
                      </span>
                    </div>
                  </td>

                  {/* Status Pill (+ In stock / Low stock / Out of stock style) */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => handleToggleStatus(row.id)}
                      title="Click to toggle status"
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-1 ${
                        row.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : row.status === "Optimizing"
                          ? "bg-amber-50 text-amber-700 border border-amber-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      <span>
                        {row.status === "Active"
                          ? "+ In stock"
                          : row.status === "Optimizing"
                          ? "• Low stock"
                          : "• Out of stock"}
                      </span>
                    </button>
                  </td>

                  {/* Sales / Clicks */}
                  <td className="py-3.5 px-3 font-bold text-slate-800">
                    {row.sales}
                  </td>

                  {/* Last updated */}
                  <td className="py-3.5 px-3 text-right text-[11px] text-slate-400 font-medium">
                    {row.lastUpdated}
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
