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
      color: "text-blue-600",
    },
    {
      title: "Absolute Data Sovereignty",
      desc: "Your tokens, your ad accounts, your customer relationships. ADOS acts as an intelligence layer on top of your accounts — we never lock you in or sell your data.",
      icon: ShieldCheck,
      color: "text-emerald-600",
    },
    {
      title: "Sub-Second Telemetry",
      desc: "Waiting 24 hours for a human to notice creative fatigue or a sudden CPM surge is obsolete. ADOS evaluates performance curves in sub-second intervals.",
      icon: Zap,
      color: "text-amber-600",
    },
    {
      title: "Radical Transparency",
      desc: "Zero black-box mystery. Every autonomous budget reallocation, creative swap, and stop-loss trigger is documented in an audit log with an explainable reason.",
      icon: Target,
      color: "text-purple-600",
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
    <div className="relative min-h-screen w-full bg-[#fbfbfd] text-[#111113] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white overflow-x-hidden">
      {/* Ambient Lighting Accents (Light Pastel Theme) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-purple-100/60 via-pink-100/30 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -left-32 w-[550px] h-[550px] bg-blue-100/40 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[70%] -right-32 w-[550px] h-[550px] bg-emerald-100/40 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle Micro-Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs sm:text-[13px] font-semibold text-slate-700 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span className="tracking-wide uppercase text-pink-700 font-bold">About Ad Operating System</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Our Story & Mission</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900"
          >
            Building the Operating System for{" "}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Autonomous Advertising
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
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
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {item.stat}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= OUR ORIGIN STORY ================= */}
      <section className="relative z-10 py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 lg:p-14 rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)] space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Why We Built ADOS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Born From The Frustration of 7 Open Browser Tabs
          </h2>

          <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            <p>
              In 2024, our founders were running multi-million rupee ad budgets across Meta, Google Ads,
              Amazon, and TikTok. The workflow was broken: logging into five different dashboards,
              downloading conflicting CSV reports, trying to reconcile fragmented conversion pixels,
              and manually adjusting campaign bids at 2:00 AM.
            </p>
            <p>
              We realized that advertising wasn't suffering from a lack of creativity—it was suffering
              from a lack of <strong className="text-slate-900 font-semibold">infrastructure</strong>. When a creative fatigues or a competitor
              bids up keyword CPMs, waiting 24 hours for a human media buyer to notice is simply too late.
            </p>
            <p className="text-slate-900 font-semibold">
              We asked a simple question: What if advertising behaved like modern financial markets?
              What if budgets flowed autonomously to where marginal returns were highest, with built-in
              stop-loss protections that prevent burning money?
            </p>
            <p>
              That became the blueprint for <strong className="text-slate-900 font-semibold">ADOS (Ad Operating System)</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CORE ENGINEERING VALUES ================= */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-pink-700">
            Our Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Four Non-Negotiable Engineering Principles
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            How we design every algorithm, API integration, and telemetry model inside ADOS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <val.icon className={`w-8 h-8 ${val.color}`} />
                <h3 className="text-xl font-bold text-slate-900">{val.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TIMELINE & MILESTONES ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-700">
            The Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Milestones of Continuous Innovation
          </h2>
        </div>

        <div className="space-y-8">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              <div className="px-4 py-2 rounded-xl bg-pink-50 border border-pink-200/80 text-xl font-mono font-black text-pink-600 shrink-0">
                {m.year}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-slate-200/90 text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-pink-600" />
            <span>Join the autonomous revolution</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Ready to Experience the ADOS Advantage?
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Connect your advertising accounts in 60 seconds with enterprise OAuth.
            Try all autonomous features free for 14 days.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 text-white font-bold text-sm tracking-wide shadow-md hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer"
            >
              Start 14-Day Free Trial
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm transition-all cursor-pointer shadow-xs"
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
