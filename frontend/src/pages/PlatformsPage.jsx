import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  Activity,
  Lock,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Server,
  Globe,
  Check,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PlatformLogo from "../components/common/PlatformLogo";

export default function PlatformsPage({ user }) {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState("meta");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const platforms = [
    {
      id: "meta",
      name: "Meta Ads",
      sub: "Facebook, Instagram & Messenger",
      logoKey: "meta",
      category: "Social & Discovery",
      latency: "38ms",
      status: "Operational",
      description:
        "Full support for Meta Graph API v21.0. Automate Advantage+ shopping campaigns, dynamic creative overlays, Reels placements, and direct server-to-server Conversions API (CAPI).",
      features: [
        "Advantage+ Shopping & Catalog automated scaling",
        "Direct Server-Side CAPI with 9.8/10 Event Match Quality",
        "Multi-aspect ratio auto-generation for Instagram Stories & Reels",
        "Custom & Lookalike audience automated refreshing",
      ],
      metrics: {
        avgCpaDrop: "-38%",
        roasGain: "+3.6x",
        supportedPlacements: "Feeds, Reels, Stories, Audience Network",
      },
    },
    {
      id: "google",
      name: "Google Ads",
      sub: "Search, YouTube, PMax & Shopping",
      logoKey: "google",
      category: "High-Intent Search & Video",
      latency: "41ms",
      status: "Operational",
      description:
        "Direct integration with Google Ads API v18. Synchronize Search query intent, Performance Max asset groups, YouTube video action campaigns, and Google Merchant Center feeds.",
      features: [
        "Performance Max asset group optimization and audience signals",
        "Negative keyword auto-harvesting to eliminate wasted search spend",
        "Enhanced Conversions first-party hashed data synchronization",
        "YouTube In-Stream and Shorts video creative rotation",
      ],
      metrics: {
        avgCpaDrop: "-44%",
        roasGain: "+4.1x",
        supportedPlacements: "Google Search, YouTube, Maps, Gmail, Display",
      },
    },
    {
      id: "amazon",
      name: "Amazon Ads",
      sub: "Sponsored Products, Brands & DSP",
      logoKey: "amazon",
      category: "Retail Media & Marketplace",
      latency: "52ms",
      status: "Operational",
      description:
        "Connect Amazon Advertising REST API and DSP. Bid aggressively when product inventory is high, and automatically pause ad sets if Buy Box is lost or stock drops.",
      features: [
        "Sponsored Products, Brands, and Display automated bidding",
        "Real-time Buy Box loss detection with instant ad pause",
        "Negative target harvesting based on ACoS thresholds",
        "Cross-channel sync between Amazon DSP and Google Search",
      ],
      metrics: {
        avgCpaDrop: "-32%",
        roasGain: "+2.9x",
        supportedPlacements: "Search results, Product detail pages, Prime Video",
      },
    },
    {
      id: "youtube",
      name: "YouTube Ads",
      sub: "TrueView, Shorts & Video Action",
      logoKey: "youtube",
      category: "High-Impact Video",
      latency: "44ms",
      status: "Operational",
      description:
        "Harness the world's largest video engine. Automatically test video hooks, end-screens, and vertical Shorts variants to drive conversions at scale.",
      features: [
        "Video Action Campaign (VAC) target CPA auto-optimization",
        "YouTube Shorts vertical creative permutation testing",
        "Placement exclusion lists to block low-retention channels",
        "Cross-device attribution with Google Search and Meta",
      ],
      metrics: {
        avgCpaDrop: "-29%",
        roasGain: "+3.1x",
        supportedPlacements: "YouTube Shorts, In-Stream, Masthead, Search",
      },
    },
    {
      id: "linkedin",
      name: "LinkedIn Ads",
      sub: "B2B Lead Gen & Account-Based Marketing",
      logoKey: "linkedin",
      category: "B2B & High-Value Enterprise",
      latency: "63ms",
      status: "Operational",
      description:
        "Direct LinkedIn Marketing Solutions API sync. Reach decision-makers by job function, seniority, and verified company lists with instant CRM lead-routing.",
      features: [
        "Native Lead Gen Form submission auto-sync to your CRM",
        "Account-Based Marketing (ABM) matched company list refreshes",
        "Sponsored Content carousel and single-image testing",
        "Cost-per-qualified-lead (CPQL) real-time bidding",
      ],
      metrics: {
        avgCpaDrop: "-47%",
        roasGain: "+2.7x",
        supportedPlacements: "LinkedIn Feed, Sponsored Messaging, Right Rail",
      },
    },
    {
      id: "tiktok",
      name: "TikTok & Snap Ads",
      sub: "Short-Form Video & Gen-Z Direct Response",
      logoKey: "snap",
      category: "Social Video & Commerce",
      latency: "48ms",
      status: "Operational",
      description:
        "Deploy high-converting 9:16 vertical short-form creatives. Auto-detect video hook fatigue and automatically rotate in fresh hooks before CPA spikes.",
      features: [
        "Spark Ads & TikTok Shop shopping campaign automated optimization",
        "Creative fatigue detection using view-through-rate degradation",
        "Instant sound and trending audio template pairing",
        "Dynamic Product Ads (DPA) catalog synchronization",
      ],
      metrics: {
        avgCpaDrop: "-36%",
        roasGain: "+3.4x",
        supportedPlacements: "TikTok For You Page, Snap Stories, Spotlight",
      },
    },
  ];

  const current = platforms.find((p) => p.id === selectedPlatform) || platforms[0];

  return (
    <div className="relative min-h-screen w-full bg-[#0d0e12] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenContact={() => navigate("/contact")}
        onOpenAuth={() => navigate("/auth")}
        onOpenDashboard={() => navigate("/dashboard")}
      />

      {/* Ambient Lighting Accents */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-purple-600/20 via-blue-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[45%] -right-32 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[75%] -left-32 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs sm:text-[13px] font-semibold text-slate-300 backdrop-blur-md shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide uppercase text-emerald-300">5+ Supported Ad Networks</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-400">Enterprise Native Connectors</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
          >
            One Unified Cockpit for{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Every Major Ad Platform
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Break free from platform silos. Connect Meta, Google Ads, Amazon, YouTube, LinkedIn,
            and TikTok in 60 seconds. Manage multi-channel budgets with algorithmic cross-network liquidity.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#0d0e12] font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Connect All Platforms Now</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-sm tracking-wide backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>Request Custom Network Connector</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= PLATFORM LOGOS INTERACTIVE STRIP ================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {platforms.map((p) => {
            const isSelected = p.id === selectedPlatform;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer text-center ${
                  isSelected
                    ? "bg-white/[0.12] border-2 border-emerald-400 shadow-lg shadow-emerald-500/10 scale-105"
                    : "bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08]"
                }`}
              >
                <PlatformLogo platform={p.logoKey} size="sm" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5">● {p.latency}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= DETAILED PLATFORM DEEP-DIVE CARD ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#14161f] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-4">
                <PlatformLogo platform={current.logoKey} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{current.name}</h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {current.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{current.sub}</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.description}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Native Capabilities In ADOS
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connect CTA */}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30"
                >
                  <span>Connect {current.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400">Takes &lt; 60 seconds with OAuth</span>
              </div>
            </div>

            {/* Right Telemetry & Benchmark Box */}
            <div className="lg:col-span-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Performance Impact
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Latency: {current.latency}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    {current.metrics.avgCpaDrop}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Average CPA Drop</div>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {current.metrics.roasGain}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Blended ROAS Gain</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-slate-400">Supported Placements:</div>
                <div className="text-xs text-slate-200 font-semibold bg-white/[0.04] p-3 rounded-lg border border-white/[0.06]">
                  {current.metrics.supportedPlacements}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Zero token storage risk. ADOS connects via standard enterprise scopes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW CONNECTION WORKS (3 STEPS) ================= */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Frictionless Integration
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Connect in 3 Simple Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            No complex SDK installs, no engineering tickets, and no tracking pixel headaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "1-Click OAuth Grant",
              desc: "Click connect and grant read/write access via official Meta, Google, or Amazon permission screens.",
              icon: Lock,
            },
            {
              num: "02",
              title: "Automatic Baseline Ingestion",
              desc: "ADOS pulls past 30 days of campaign baselines, CPA trends, and winning creative formats.",
              icon: RefreshCw,
            },
            {
              num: "03",
              title: "Activate Autonomous Mode",
              desc: "Set your target ROAS or CPA guardrails. ADOS immediately starts optimizing bids and liquidity.",
              icon: Zap,
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold text-slate-500">{step.num}</span>
                  <step.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 text-center space-y-6 backdrop-blur-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready to unite your advertising channels?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Stop Hopping Between 5 Different Dashboards
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Unify your multi-channel media buying inside ADOS. Scale faster, spend smarter,
            and monitor performance in real time.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#0d0e12] font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Connect My Ad Accounts
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Talk to Integrations Team
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenContact={() => navigate("/contact")} />
    </div>
  );
}
