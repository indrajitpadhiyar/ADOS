import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  RefreshCw,
  Cpu,
  Check,
  Sliders,
  DollarSign,
  Activity,
  ChevronRight,
  Lock,
  Flame,
} from "lucide-react";
import PlatformLogo from "../common/PlatformLogo";

export default function DeviceShowcaseSection({ onOpenContact }) {
  const [activeTab, setActiveTab] = useState("insights"); // 'insights' | 'ai' | 'integration'
  const [selectedNetwork, setSelectedNetwork] = useState("all");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedRoas, setSimulatedRoas] = useState(4.82);
  const [simulationStep, setSimulationStep] = useState(0);

  const features = [
    {
      id: "insights",
      title: "Instant Insights",
      subtitle: "Sub-14ms cross-network attribution feed",
      desc: "Unify Meta, Google, TikTok and Amazon into one verified single source of truth with zero discrepancy.",
      icon: TrendingUp,
      stat: "+18.4% ROAS",
      color: "blue",
    },
    {
      id: "ai",
      title: "AI Technology",
      subtitle: "Autonomous capital reallocation & stop-loss",
      desc: "Algorithmic decision loops detect creative fatigue and rebalance liquidity into top-performing sets in real time.",
      icon: Cpu,
      stat: "32ms Execution",
      color: "indigo",
    },
    {
      id: "integration",
      title: "Easy Integration",
      subtitle: "1-Click OAuth connectors with zero pixel code",
      desc: "Connect your ad accounts directly through official server Conversions APIs in under 60 seconds.",
      icon: Layers,
      stat: "60s Setup",
      color: "emerald",
    },
  ];

  // Simulation handler for the AI tab
  const handleTriggerSim = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    setTimeout(() => {
      setSimulationStep(2);
    }, 450);

    setTimeout(() => {
      setSimulatedRoas((prev) =>
        prev >= 5.2 ? 4.82 : Number((prev + 0.38).toFixed(2)),
      );
      setSimulationStep(3);
      setIsSimulating(false);
    }, 900);
  };

  return (
    <section className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#fafbfc] overflow-hidden border-t border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Lighting & Fine Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-transparent blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 lg:space-y-16">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-blue-700 text-[11px] font-extrabold tracking-wider uppercase">
              Autonomous Intelligence
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 text-[11px] font-medium">
              Real-Time Growth
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111113] tracking-tight leading-[1.12]">
            Turning data into real{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              actions and ideas.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Raw ad metrics mean nothing without rapid execution. ADOS eliminates
            manual analysis by turning live omnichannel signals into
            self-executing budget optimizations and creative rotations.
          </p>
        </div>

        {/* ================= 2-COLUMN COMMAND SHOWCASE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT COLUMN: INTERACTIVE FEATURE PILLARS (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-5">
            <div className="space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select a capability to inspect
              </span>

              {features.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    type="button"
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer border relative overflow-hidden ${
                      isActive
                        ? "bg-white border-blue-500/40 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.12)] ring-1 ring-blue-500/20"
                        : "bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600" />
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                              {item.title}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200/70"
                              }`}
                            >
                              {item.stat}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 mt-1 ${
                          isActive
                            ? "text-blue-600 translate-x-0.5"
                            : "text-slate-400"
                        }`}
                      />
                    </div>

                    <p
                      className={`text-xs leading-relaxed mt-3 pl-[3.25rem] transition-colors ${
                        isActive
                          ? "text-slate-700 font-medium"
                          : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quick Micro Value Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Latency
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 mt-0.5 block">
                  &lt;14 ms
                </span>
              </div>
              <div className="border-x border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Accuracy
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 mt-0.5 block">
                  99.98%
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Waste Saved
                </span>
                <span className="text-sm sm:text-base font-black text-emerald-600 mt-0.5 block">
                  ₹2.8M+
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HIGH-IMPACT COMMAND CONSOLE (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="h-full bg-white rounded-3xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
              {/* Studio Canvas OS Header */}
              <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-slate-300 mx-1">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 tracking-tight">
                      ADOS Intelligence Engine
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      v2.4 Live
                    </span>
                  </div>
                </div>

                {/* Network Ticker */}
                <div className="hidden sm:flex items-center gap-1">
                  {["all", "meta", "google", "amazon"].map((net) => (
                    <button
                      key={net}
                      onClick={() => setSelectedNetwork(net)}
                      type="button"
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold uppercase transition-all cursor-pointer ${
                        selectedNetwork === net
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Tab Body */}
              <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {/* ================= VIEW 1: INSTANT INSIGHTS ================= */}
                  {activeTab === "insights" && (
                    <motion.div
                      key="insights-view"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Metric Trio Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            Blended ROAS
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                            4.82x
                          </div>
                          <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
                            <span>↑</span> <span>+18.4% this week</span>
                          </span>
                        </div>

                        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            Attributed Revenue
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                            ₹13,42,567
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 mt-1 block">
                            Verified CAPI Stream
                          </span>
                        </div>

                        <div className="col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            Ad Spend Protected
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight mt-0.5">
                            ₹2,84,100
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 mt-1 block">
                            Zero budget fatigue
                          </span>
                        </div>
                      </div>

                      {/* Interactive Visual ROAS Curve */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-50/90 to-white border border-slate-200/90 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              Real-Time Performance Trajectory
                            </span>
                            <span className="hidden sm:inline-block text-[10px] font-medium text-slate-400">
                              (Hourly vs 3.0x Baseline)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span className="text-[11px] font-bold text-blue-700">
                              Live ROAS
                            </span>
                          </div>
                        </div>

                        {/* Responsive SVG Area Chart */}
                        <div className="relative h-32 sm:h-40 w-full pt-2">
                          <svg
                            viewBox="0 0 500 120"
                            preserveAspectRatio="none"
                            className="w-full h-full overflow-visible"
                          >
                            <defs>
                              <linearGradient
                                id="chartGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#2563eb"
                                  stopOpacity="0.22"
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#2563eb"
                                  stopOpacity="0.0"
                                />
                              </linearGradient>
                            </defs>
                            {/* Baseline Dashed Line */}
                            <line
                              x1="0"
                              y1="75"
                              x2="500"
                              y2="75"
                              stroke="#cbd5e1"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                            />
                            {/* Area Fill */}
                            <path
                              d="M 0,95 Q 60,82 120,62 T 240,44 T 360,26 T 480,12 L 500,10 L 500,120 L 0,120 Z"
                              fill="url(#chartGradient)"
                            />
                            {/* Curve Line */}
                            <path
                              d="M 0,95 Q 60,82 120,62 T 240,44 T 360,26 T 480,12 L 500,10"
                              fill="none"
                              stroke="#2563eb"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            {/* Data points */}
                            <circle
                              cx="120"
                              cy="62"
                              r="4"
                              fill="#2563eb"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                            <circle
                              cx="240"
                              cy="44"
                              r="4"
                              fill="#2563eb"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                            <circle
                              cx="360"
                              cy="26"
                              r="4.5"
                              fill="#10b981"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                            <circle
                              cx="480"
                              cy="12"
                              r="5"
                              fill="#10b981"
                              stroke="#ffffff"
                              strokeWidth="2.5"
                            />
                          </svg>

                          {/* Float Pin at Peak */}
                          <div className="absolute top-0 right-4 sm:right-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md border border-slate-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>Peak ROAS: 5.2x</span>
                          </div>
                        </div>
                      </div>

                      {/* 3 Active Channel Feeds */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                          <PlatformLogo platform="meta" size="xs" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              Meta Advantage+
                            </div>
                            <div className="text-[10.5px] text-emerald-600 font-semibold">
                              ROAS: 4.92x · Scaled
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                          <PlatformLogo platform="google" size="xs" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              Google Search
                            </div>
                            <div className="text-[10.5px] text-blue-600 font-semibold">
                              CPA: ₹24.5 · In Target
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
                          <PlatformLogo platform="amazon" size="xs" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              Amazon DSP
                            </div>
                            <div className="text-[10.5px] text-amber-600 font-semibold">
                              ACoS: 16% · Buy Box Won
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Autonomous Action Ticker Footer */}
                      <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between text-xs text-blue-900">
                        <div className="flex items-center gap-2 min-w-0">
                          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="truncate">
                            <strong>Live Action:</strong> Scaled Meta top ad set
                            by +₹15,000 based on conversion speed.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 shrink-0 ml-2">
                          Just now
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* ================= VIEW 2: AI TECHNOLOGY ================= */}
                  {activeTab === "ai" && (
                    <motion.div
                      key="ai-view"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Top Strategy Bar */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-slate-900">
                            Closed-Loop Autonomous Routing
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Zero Manual Touch
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          ADOS monitors creative wear-out and automatically
                          reallocates liquidity into high-converting variants
                          before CPMs spike.
                        </p>
                      </div>

                      {/* 3-Step Decision Flow */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                            1
                          </div>
                          <div className="text-xs font-bold text-slate-900">
                            14ms Telemetry
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Ingests conversion velocity & CPA drift
                            continuously.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                            2
                          </div>
                          <div className="text-xs font-bold text-slate-900">
                            Fatigue Breaker
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Stops underperforming ad variants within 32ms.
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center mb-2">
                            3
                          </div>
                          <div className="text-xs font-bold text-slate-900">
                            Liquidity Scale
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            Routes freed capital into top 5% converting
                            campaigns.
                          </p>
                        </div>
                      </div>

                      {/* Interactive Simulation Sandbox */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10.5px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Live Simulation Stage</span>
                            </div>
                            <div className="text-xl sm:text-2xl font-black mt-1.5">
                              Projected ROAS:{" "}
                              <span className="text-emerald-400">
                                {simulatedRoas}x
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={handleTriggerSim}
                            disabled={isSimulating}
                            type="button"
                            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isSimulating ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Zap className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {isSimulating
                                ? "Rebalancing Liquidity..."
                                : "Simulate Budget Optimization"}
                            </span>
                          </button>
                        </div>

                        {/* Real-Time Action Log */}
                        <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span>Autonomous Activity Log</span>
                            <span className="text-emerald-400 font-mono">
                              Status: Armed
                            </span>
                          </div>

                          <div className="space-y-1.5 font-mono text-[11px]">
                            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                              <span className="text-emerald-400">
                                ✓ Reallocated ₹45,000 from Meta AdSet #104 →
                                Scaled AdSet #8
                              </span>
                              <span className="text-slate-500 text-[10px]">
                                3m ago
                              </span>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
                              <span className="text-amber-400">
                                ⚠ Paused TikTok Creative Variant D (CPA exceeded
                                ₹42 guardrail)
                              </span>
                              <span className="text-slate-500 text-[10px]">
                                12m ago
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ================= VIEW 3: EASY INTEGRATION ================= */}
                  {activeTab === "integration" && (
                    <motion.div
                      key="integration-view"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-slate-900">
                            Zero-Code Official API Connectors
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Enterprise OAuth 2.0
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          No developer work required. Connect all your ad
                          networks directly through official server APIs in one
                          click.
                        </p>
                      </div>

                      {/* 6 Network Badges */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            net: "meta",
                            name: "Meta Ads",
                            sub: "Graph API v21.0 · CAPI",
                            ping: "38ms",
                          },
                          {
                            net: "google",
                            name: "Google Ads",
                            sub: "Ads API v18 · Search & PMax",
                            ping: "41ms",
                          },
                          {
                            net: "amazon",
                            name: "Amazon Ads",
                            sub: "REST API & DSP",
                            ping: "52ms",
                          },
                          {
                            net: "youtube",
                            name: "YouTube Ads",
                            sub: "Shorts & Video Action",
                            ping: "46ms",
                          },
                          {
                            net: "linkedin",
                            name: "LinkedIn Ads",
                            sub: "Marketing Solutions API",
                            ping: "64ms",
                          },
                          {
                            net: "snapchat",
                            name: "Snapchat Ads",
                            sub: "Snap Marketing API",
                            ping: "49ms",
                          },
                        ].map((p) => (
                          <div
                            key={p.net}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <PlatformLogo platform={p.net} size="xs" />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {p.sub}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-600 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                              ● {p.ping}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Security Guarantee Box */}
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Encrypted Token Vault:</strong> Tokens
                            encrypted at rest with AES-256-GCM. 100% first-party
                            cookies with zero reliance on third-party tracking
                            scripts.
                          </span>
                        </div>

                        <button
                          onClick={onOpenContact}
                          type="button"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide transition-all shadow-xs shrink-0 cursor-pointer text-center"
                        >
                          Connect Accounts
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
