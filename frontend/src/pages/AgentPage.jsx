import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Bell,
  ArrowRight,
} from "lucide-react";
import agentImg from "../assets/agent.png";
import PlatformLogo from "../components/common/PlatformLogo";

export default function AgentPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafd] text-[#111113] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      {/* Soft Multi-Color Ambient Glows (White Theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[440px] bg-gradient-to-b from-orange-100/60 via-purple-100/30 to-transparent blur-[110px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-[420px] h-[420px] bg-cyan-100/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[440px] h-[440px] bg-amber-100/35 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle Micro-Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* ================= HEADER ================= */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 sm:px-10 py-6 sm:py-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-black bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs px-4 py-2 rounded-full transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 group-hover:text-black transition-all" />
          <span>Back to Home</span>
        </Link>

        {/* Brand Link */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/ados3.png"
            alt="ADOS"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#111113]">
            ADOS
          </span>
        </Link>

        {/* Live Training Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Model Training in Progress</span>
          <span className="sm:hidden">In Training</span>
        </div>
      </header>

      {/* ================= MAIN COMING SOON HERO ================= */}
      <main className="relative z-20 max-w-4xl mx-auto px-6 sm:px-8 py-8 sm:py-14 flex-1 flex flex-col items-center text-center justify-center">
        
        {/* Release Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-bold uppercase tracking-wider shadow-xs mb-6 sm:mb-8"
        >
          <Bot className="w-4 h-4 text-[#ff4a22]" />
          <span>ADOS Autonomous AI Agent</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span className="text-[#ff4a22] font-black">Coming Soon</span>
        </motion.div>

        {/* ================= 3D AI MODEL CENTERPIECE ================= */}
        <div className="relative mb-8 sm:mb-10 flex items-center justify-center">
          {/* Ambient Multi-Color Radial Halo */}
          <div className="absolute w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-gradient-to-tr from-cyan-200/40 via-purple-200/35 to-orange-200/45 blur-3xl pointer-events-none" />
          <div className="absolute w-72 sm:w-96 md:w-[420px] h-72 sm:h-96 md:h-[420px] rounded-full border border-slate-200/60 pointer-events-none" />

          {/* Floating 3D Agent Character */}
          <motion.div
            animate={{
              y: [-12, 12, -12],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10 w-48 sm:w-64 md:w-72 drop-shadow-[0_25px_45px_rgba(0,0,0,0.14)]"
          >
            <img
              src={agentImg}
              alt="ADOS Autonomous AI Agent Model"
              className="w-full h-auto object-contain select-none pointer-events-none"
            />
          </motion.div>

          {/* Orbiting Telemetry Chip 1 - Top Right */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "backOut" }}
            className="absolute -top-3 -right-4 sm:top-2 sm:-right-10 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-slate-900 leading-tight">+38.4% ROAS</div>
              <div className="text-[10px] text-slate-500 font-medium">Auto-Optimized</div>
            </div>
          </motion.div>

          {/* Orbiting Telemetry Chip 2 - Bottom Left */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45, ease: "backOut" }}
            className="absolute -bottom-3 -left-4 sm:bottom-4 sm:-left-10 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.06)] flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff4a22] flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-extrabold text-slate-900 leading-tight">Fatigue Guard</div>
              <div className="text-[10px] text-slate-500 font-medium">24/7 Live Monitoring</div>
            </div>
          </motion.div>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111113] max-w-3xl leading-[1.12] mb-3 sm:mb-4"
        >
          Autonomous AI Agent is{" "}
          <span className="bg-gradient-to-r from-[#ff4a22] to-amber-500 bg-clip-text text-transparent">
            Coming Soon
          </span>
        </motion.h1>

        {/* Short Focused Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl leading-relaxed font-normal mb-8 sm:mb-10"
        >
          Our 24/7 intelligent ad strategist is undergoing final training to execute real-time cross-channel bidding, budget reallocation, and creative fatigue prevention.
        </motion.p>

        {/* Early Access / Notify Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md mb-10 sm:mb-12"
        >
          <AnimatePresence mode="wait">
            {!submitted ? (
              <form
                onSubmit={handleNotifySubmit}
                className="relative flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white border border-slate-200 shadow-md focus-within:border-[#ff4a22] focus-within:ring-2 focus-within:ring-[#ff4a22]/15 transition-all"
              >
                <div className="flex items-center gap-2.5 px-4 w-full sm:w-auto flex-1">
                  <Bell className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none py-2.5"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl sm:rounded-full bg-[#111113] hover:bg-black text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Notify Me"}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-3 shadow-xs"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  You're on the priority waitlist! We'll notify you when the agent goes live.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Supported Platforms at Launch */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-3 pt-2"
        >
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Supported Ad Platforms At Launch
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "meta", label: "Meta Ads" },
              { id: "google", label: "Google Ads" },
              { id: "amazon", label: "Amazon DSP" },
              { id: "youtube", label: "YouTube" },
              { id: "linkedin", label: "LinkedIn" },
              { id: "pinterest", label: "Pinterest" },
              { id: "snapchat", label: "Snapchat" },
            ].map((platform) => (
              <div
                key={platform.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <PlatformLogo platform={platform.id} size="xs" />
                <span className="text-xs font-bold text-slate-700">{platform.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* ================= CLEAN WHITE FOOTER ================= */}
      <footer className="relative z-20 border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-6 max-w-7xl mx-auto w-full px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} ADOS · Powered by IDR TECH.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/privacy-policy" className="hover:text-black transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-black transition-colors">
            Terms of Service
          </Link>
          <Link to="/" className="text-[#ff4a22] hover:underline font-semibold">
            Return to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
