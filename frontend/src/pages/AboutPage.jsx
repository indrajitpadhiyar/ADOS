import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Globe,
  Users,
  CheckCircle2,
  ArrowRight,
  Heart,
  Server,
  Zap,
  Target,
  Award,
  Layers,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function AboutPage({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coreValues = [
    {
      title: "Algorithmic Parity",
      desc: "Every independent brand deserves the same high-frequency automated bidding and creative testing infrastructure once reserved for $100M media conglomerates.",
      icon: Cpu,
      color: "text-blue-400",
    },
    {
      title: "Absolute Data Sovereignty",
      desc: "Your tokens, your ad accounts, your customer relationships. ADOS acts as an intelligence layer on top of your accounts — we never lock you in or sell your data.",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      title: "Sub-Second Telemetry",
      desc: "Waiting 24 hours for a human to notice creative fatigue or a sudden CPM surge is obsolete. ADOS evaluates performance curves in sub-second intervals.",
      icon: Zap,
      color: "text-amber-400",
    },
    {
      title: "Radical Transparency",
      desc: "Zero black-box mystery. Every autonomous budget reallocation, creative swap, and stop-loss trigger is documented in an audit log with an explainable reason.",
      icon: Target,
      color: "text-purple-400",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Genesis & Private Alpha",
      desc: "Conceived by performance media buyers and engineers tired of dashboard switching. Private testing scaled across ₹5 Crore of ad spend.",
    },
    {
      year: "2025",
      title: "Omni-Channel Engine & Server CAPI",
      desc: "Launched native integrations for Meta Graph API v21, Google Ads API v18, and Amazon DSP with first-party server-side attribution.",
    },
    {
      year: "2026",
      title: "Autonomous Scale & Global Network",
      desc: "1,400+ active brands, ₹45 Crore+ optimized ad spend, and low-latency nodes deployed across Mumbai, Singapore, and Frankfurt.",
    },
  ];

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
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-purple-600/20 via-pink-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -left-32 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[70%] -right-32 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

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
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs sm:text-[13px] font-semibold text-slate-300 backdrop-blur-md shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="tracking-wide uppercase text-pink-300">About Ad Operating System</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-400">Our Story & Mission</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
          >
            Building the Operating System for{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Autonomous Advertising
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            We are on a mission to eliminate manual dashboard hopping, guesswork bidding, and wasted ad spend.
            ADOS gives every brand the power of high-frequency algorithmic media buying.
          </motion.p>
        </div>

        {/* Global Stats Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { stat: "1,400+", label: "Active Brands & Agencies" },
            { stat: "₹45 Cr+", label: "Ad Spend Processed" },
            { stat: "99.99%", label: "Platform Uptime SLA" },
            { stat: "< 450ms", label: "Sync & Optimization Latency" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-center"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {item.stat}
              </div>
              <div className="text-xs text-slate-400 mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= OUR ORIGIN STORY ================= */}
      <section className="relative z-10 py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Why We Built ADOS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Born From The Frustration of 7 Open Browser Tabs
          </h2>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              In 2024, our founders were running multi-million rupee ad budgets across Meta, Google Ads,
              Amazon, and TikTok. The workflow was broken: logging into five different dashboards,
              downloading conflicting CSV reports, trying to reconcile fragmented conversion pixels,
              and manually adjusting campaign bids at 2:00 AM.
            </p>
            <p>
              We realized that advertising wasn't suffering from a lack of creativity—it was suffering
              from a lack of <strong>infrastructure</strong>. When a creative fatigues or a competitor
              bids up keyword CPMs, waiting 24 hours for a human media buyer to notice is simply too late.
            </p>
            <p className="text-white font-medium">
              We asked a simple question: What if advertising behaved like modern financial markets?
              What if budgets flowed autonomously to where marginal returns were highest, with built-in
              stop-loss protections that prevent burning money?
            </p>
            <p>
              That became the blueprint for <strong>ADOS (Ad Operating System)</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CORE ENGINEERING VALUES ================= */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-pink-400">
            Our Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Four Non-Negotiable Engineering Principles
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            How we design every algorithm, API integration, and telemetry model inside ADOS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <val.icon className={`w-8 h-8 ${val.color}`} />
                <h3 className="text-xl font-bold text-white">{val.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TIMELINE & MILESTONES ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
            The Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Milestones of Continuous Innovation
          </h2>
        </div>

        <div className="space-y-8">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="px-4 py-2 rounded-xl bg-white/10 text-xl font-mono font-black text-pink-400 shrink-0">
                {m.year}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{m.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 text-center space-y-6 backdrop-blur-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>Join the autonomous revolution</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Experience the ADOS Advantage?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect your advertising accounts in 60 seconds with enterprise OAuth.
            Try all autonomous features free for 14 days.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#0d0e12] font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Start 14-Day Free Trial
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Contact Our Founders
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenContact={() => navigate("/contact")} />
    </div>
  );
}
