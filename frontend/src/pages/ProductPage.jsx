import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Sliders,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  Eye,
  Activity,
  Play,
  Flame,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PlatformLogo from "../components/common/PlatformLogo";

export default function ProductPage({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("budget");
  const [liveLogIndex, setLiveLogIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulated live event feed
  const liveLogs = [
    {
      time: "Just now",
      badge: "SCALE",
      color: "emerald",
      text: "Meta Advantage+ set scaled +20% budget ($1,200/day) after ROAS hit 4.82x",
      platform: "meta",
    },
    {
      time: "14s ago",
      badge: "STOP-LOSS",
      color: "rose",
      text: "Paused Google Search ad variant #4: CPA exceeded threshold ($38 > $24)",
      platform: "google",
    },
    {
      time: "42s ago",
      badge: "CREATIVE",
      color: "blue",
      text: "Generated 3 new 9:16 vertical video hooks for TikTok and deployed to testing group",
      platform: "snapchat",
    },
    {
      time: "1m ago",
      badge: "ATTRIBUTION",
      color: "amber",
      text: "Server-side Conversions API synced 142 purchases with 100% deduplication rate",
      platform: "amazon",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveLogIndex((prev) => (prev + 1) % liveLogs.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [liveLogs.length]);

  const productModules = [
    {
      id: "budget",
      title: "Autonomous Budget Routing",
      tagline: "Cross-Network Liquidity Engine",
      icon: TrendingUp,
      accent: "from-blue-600 to-indigo-600",
      description:
        "ADOS constantly monitors marginal CPA across Meta, Google, and Amazon. The second one channel begins fatiguing, capital is autonomously reallocated to channels with cheaper available conversions.",
      metrics: [
        { label: "Execution Latency", value: "< 450ms" },
        { label: "Average ROAS Lift", value: "+340%" },
        { label: "Wasted Spend Prevented", value: "32.4%" },
      ],
      features: [
        "Continuous multi-armed bandit algorithmic reallocation",
        "Target CPA, target ROAS, and maximum liquidity modes",
        "Safe floor/ceiling budget guardrails set per brand",
        "Cross-network balance management without manual intervention",
      ],
    },
    {
      id: "creative",
      title: "Generative Creative Studio",
      tagline: "High-Velocity Asset Generation",
      icon: Sparkles,
      accent: "from-orange-500 to-amber-500",
      description:
        "Upload a single raw asset or product link, and ADOS automatically produces multi-aspect-ratio creatives (9:16 Reels, 1:1 Feed, 16:9 Landscape) with AI-tested hooks, overlays, and platform-native copy.",
      metrics: [
        { label: "Format Variants", value: "12 per asset" },
        { label: "Generation Speed", value: "< 15 sec" },
        { label: "CTR Improvement", value: "+84%" },
      ],
      features: [
        "Instant multi-format auto-cropping & resolution upscaling",
        "AI caption, hook, and headline permutation testing",
        "Dynamic Product Ads (DPA) automated template styling",
        "Real-time creative fatigue detection with replacement suggestions",
      ],
    },
    {
      id: "telemetry",
      title: "Zero-Loss Server Attribution",
      tagline: "First-Party Conversion Engine",
      icon: Database,
      accent: "from-emerald-600 to-teal-600",
      description:
        "Bypass client-side ad blockers, iOS 14+ tracking restrictions, and third-party cookie deprecation. Direct server-to-server Conversions API synchronization feeds clean signal back into ad networks.",
      metrics: [
        { label: "Event Match Quality", value: "9.6 / 10" },
        { label: "Attribution Accuracy", value: "99.4%" },
        { label: "Signal Recovery", value: "+28% Sales" },
      ],
      features: [
        "Direct Meta CAPI, Google Enhanced Conversions, and Amazon Attribution sync",
        "Automatic sha256 customer data tokenization & encryption",
        "Sub-second event deduplication across pixel and webhook streams",
        "Full compliance with GDPR, CCPA, and global privacy mandates",
      ],
    },
    {
      id: "defense",
      title: "Stop-Loss & Anomaly Defense",
      tagline: "Automated Capital Protection",
      icon: ShieldCheck,
      accent: "from-rose-500 to-pink-600",
      description:
        "Never wake up to a burned daily budget caused by platform glitches or unexpected CPM spikes. ADOS runs 24/7 rule-evaluation engines with algorithmic stop-loss protections.",
      metrics: [
        { label: "Detection Speed", value: "Instant" },
        { label: "False Positive Rate", value: "< 0.01%" },
        { label: "Budget Protected", value: "₹4.2 Cr+" },
      ],
      features: [
        "Sudden CPM surge circuit-breakers and auto-pause",
        "Zero-conversion spend thresholds with configurable tolerances",
        "Broken link and out-of-stock product tracking auto-pausing",
        "Instant Telegram, Slack, and WhatsApp anomaly push notifications",
      ],
    },
  ];

  const currentModule = productModules.find((m) => m.id === activeTab) || productModules[0];

  return (
    <div className="relative min-h-screen w-full bg-[#0d0e12] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white overflow-x-hidden">
      {/* Top Glassmorphic Navbar */}
      <Navbar
        user={user}
        onOpenContact={() => navigate("/contact")}
        onOpenAuth={() => navigate("/auth")}
        onOpenDashboard={() => navigate("/dashboard")}
      />

      {/* Ambient Glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[65%] -right-32 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs sm:text-[13px] font-semibold text-slate-300 backdrop-blur-md shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="tracking-wide uppercase text-blue-300">ADOS Platform Architecture</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-400">Autonomous Core Engine</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
          >
            The Autonomous Engine for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-orange-400 bg-clip-text text-transparent">
              Omnichannel Advertising
            </span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            ADOS orchestrates cross-channel bidding, generative creative resizing, and sub-second
            telemetry across Meta, Google Ads, Amazon, TikTok, and LinkedIn in one unified operating system.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#0d0e12] font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Connect Your Ad Accounts</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-sm tracking-wide backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>Book an Engineering Walkthrough</span>
            </Link>
          </motion.div>

          {/* Live Quick Stats Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { label: "Sync Latency", value: "< 450ms", icon: Activity },
              { label: "Supported Networks", value: "5+ Major APIs", icon: Layers },
              { label: "Server Attribution", value: "99.4% Accurate", icon: Database },
              { label: "Average ROAS Lift", value: "+340% Scaled", icon: TrendingUp },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm text-center"
              >
                <div className="text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-1.5">
                  <stat.icon className="w-4 h-4 text-blue-400" />
                  <span>{stat.value}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= LIVE OPTIMIZATION TICKER ================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-20">
        <div className="rounded-2xl bg-[#15171e]/90 border border-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="uppercase tracking-wider text-white font-bold">ADOS Telemetry Stream</span>
              <span className="text-white/30">•</span>
              <span className="text-slate-400">Live Production Node: IN-WEST-1</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Active Optimization Triggers: <strong className="text-emerald-400">2,419 / min</strong>
            </span>
          </div>

          <div className="pt-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={liveLogIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between gap-4 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-3">
                  <PlatformLogo platform={liveLogs[liveLogIndex].platform} size="xs" />
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white">
                    {liveLogs[liveLogIndex].badge}
                  </span>
                  <span className="text-slate-200 font-medium">
                    {liveLogs[liveLogIndex].text}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap hidden sm:inline">
                  {liveLogs[liveLogIndex].time}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE SUBSYSTEM EXPLORER ================= */}
      <section className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Deep-Dive Into The Core
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Four Modular Superpowers in One Operating System
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Select a module below to inspect its algorithms, live telemetry benchmarks, and architecture.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-4xl mx-auto">
          {productModules.map((module) => {
            const Icon = module.icon;
            const isSelected = module.id === activeTab;
            return (
              <button
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white text-[#0d0e12] shadow-lg scale-105"
                    : "bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 border border-white/[0.08]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <span>{module.title}</span>
              </button>
            );
          })}
        </div>

        {/* Module Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 backdrop-blur-xl">
          {/* Left: Info & Features */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-xs font-bold text-blue-300">
                <currentModule.icon className="w-3.5 h-3.5" />
                <span>{currentModule.tagline}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {currentModule.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentModule.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {currentModule.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA inside card */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Deploy This Module</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Speak with Solutions Architect →
              </Link>
            </div>
          </div>

          {/* Right: Telemetry & Benchmark Card */}
          <div className="lg:col-span-5 bg-[#14161f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Benchmarked Performance
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 gap-4 pt-6">
                {currentModule.metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {m.value}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                Enabled automatically when connecting your Meta, Google, or Amazon ad credentials.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURE PIPELINE ================= */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-orange-400">
            End-To-End Data Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How ADOS Optimizes Every Single Rupee & Dollar
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From raw click telemetry to autonomous budget reallocation, see the 4-stage pipeline that runs every 450ms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Raw Ingestion",
              desc: "Webhooks & direct OAuth tokens ingest real-time clicks, CPMs, and conversions from 5+ networks.",
              icon: Database,
              color: "text-blue-400",
            },
            {
              step: "02",
              title: "Attribution Sync",
              desc: "First-party conversions API maps purchases back to exact campaign, ad set, and creative variant.",
              icon: Cpu,
              color: "text-purple-400",
            },
            {
              step: "03",
              title: "Algorithmic Shift",
              desc: "Multi-armed bandit engine evaluates cost-per-action curves and dynamically balances budgets.",
              icon: TrendingUp,
              color: "text-emerald-400",
            },
            {
              step: "04",
              title: "Autonomous Action",
              desc: "New bid targets, creative rotations, and stop-loss rules are committed directly to network APIs.",
              icon: Zap,
              color: "text-orange-400",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-7 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-slate-500">{item.step}</span>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 text-center space-y-6 backdrop-blur-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Ready for autonomous advertising?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Connect Your Ad Accounts in Under 60 Seconds
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Experience the power of the autonomous Ad Operating System. No credit card required to start,
            and your first 14 days of predictive telemetry are completely free.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#0d0e12] font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Launch Free Trial
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Talk with an Engineer
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenContact={() => navigate("/contact")} />
    </div>
  );
}
