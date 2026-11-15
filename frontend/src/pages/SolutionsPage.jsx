import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Building2,
  Briefcase,
  Store,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Sliders,
  Sparkles,
  Zap,
  Target,
  Users,
  Compass,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function SolutionsPage({ user }) {
  const navigate = useNavigate();
  const [activePersona, setActivePersona] = useState("d2c");

  // Interactive Recommender State
  const [recModel, setRecModel] = useState("ecommerce");
  const [recSpend, setRecSpend] = useState("growth");
  const [recGoal, setRecGoal] = useState("scale_roas");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const personas = [
    {
      id: "d2c",
      title: "E-Commerce & D2C Brands",
      badge: "Retail & Consumer Brands",
      icon: ShoppingBag,
      tagline: "Break free from volatile seasonal CPMs and creative fatigue.",
      painPoints: [
        "Unpredictable ROAS spikes during peak sales events like Diwali & Black Friday",
        "Wasting money advertising products that are low or out of stock",
        "Fast creative fatigue on TikTok & Instagram Reels within 5–7 days",
      ],
      solutionPoints: [
        "Dynamic budget reallocation between Google Shopping, Amazon, and Meta Advantage+",
        "Direct inventory integration that auto-pauses ads for out-of-stock SKUs",
        "AI creative generator that outputs 12 fresh aspect-ratio variants per asset",
      ],
      metrics: [
        { label: "Blended ROAS Lift", value: "+380%" },
        { label: "Cost Per Acquisition", value: "-42%" },
        { label: "Ad Fatigue Recovery", value: "< 24 hrs" },
      ],
      ctaText: "Explore D2C Playbook",
    },
    {
      id: "agencies",
      title: "Performance Marketing Agencies",
      badge: "Media Buyers & Growth Shops",
      icon: Briefcase,
      tagline: "Manage 30+ client accounts from one pane of glass without human error.",
      painPoints: [
        "Media buyers logging in and out of dozens of separate ad managers daily",
        "Endless manual spreadsheets and weekend client reporting marathons",
        "Accidental budget overspends resulting in painful client disputes",
      ],
      solutionPoints: [
        "Single master cockpit with client workspace roles and granular permissions",
        "1-click white-label PDF/Excel reports branded with your agency logo",
        "Cross-account automated stop-loss guardrails that prevent budget overspends",
      ],
      metrics: [
        { label: "Reporting Time Saved", value: "85%" },
        { label: "Accounts Per Buyer", value: "3.5x" },
        { label: "Client Retention Rate", value: "96%" },
      ],
      ctaText: "Explore Agency Suite",
    },
    {
      id: "b2b",
      title: "B2B SaaS & High-Ticket Enterprise",
      badge: "Tech & Corporate Sales",
      icon: Building2,
      tagline: "Drive high-intent demo bookings and qualified enterprise pipeline.",
      painPoints: [
        "₹3,500+ cost per demo booked with massive drop-offs between click and call",
        "Fragmented journey between LinkedIn Ads, Google Search, and CRM stages",
        "Ad networks optimizing for low-quality form fills rather than paying deals",
      ],
      solutionPoints: [
        "Synchronize LinkedIn company matching with high-intent Google Search retargeting",
        "Feed closed-won CRM revenue back into ad algorithms for real CPQL bidding",
        "Automate personalized LinkedIn message and sponsored content variation testing",
      ],
      metrics: [
        { label: "Cost Per Demo Booked", value: "-48%" },
        { label: "Pipeline Velocity", value: "2.8x" },
        { label: "Closed-Won ROAS", value: "4.4x" },
      ],
      ctaText: "Explore B2B Playbook",
    },
    {
      id: "local",
      title: "Multi-Location & Franchise Retail",
      badge: "Local Stores & Chains",
      icon: Store,
      tagline: "Hyperlocal advertising across hundreds of pin codes simultaneously.",
      painPoints: [
        "Impossibly tedious to create and update ad campaigns for 50+ store locations",
        "Inability to track whether online ad impressions drive physical foot traffic",
        "Local store managers lacking media buying expertise",
      ],
      solutionPoints: [
        "Automated pin-code geo-fencing with localized phone numbers and addresses",
        "Centralized budget control with distributed store-level execution",
        "Offline conversion API integration syncing POS transactions to campaigns",
      ],
      metrics: [
        { label: "In-Store Foot Traffic", value: "+62%" },
        { label: "Localized CPA", value: "-34%" },
        { label: "Setup Time Per Store", value: "< 2 min" },
      ],
      ctaText: "Explore Franchise Model",
    },
  ];

  const currentPersona = personas.find((p) => p.id === activePersona) || personas[0];

  // Recommendations mapping
  const getRecommendation = () => {
    if (recModel === "agency") {
      return {
        title: "Multi-Tenant Agency Operating System",
        desc: "Deploy ADOS Agency Portal with white-label client dashboards, centralized budget stop-loss, and multi-network client reports.",
        expectedLift: "Save 18+ hrs/week per media buyer and scale to 3x more accounts.",
      };
    }
    if (recModel === "b2b") {
      return {
        title: "B2B Pipeline & Account-Based Orchestration",
        desc: "Connect LinkedIn Ads and Google Search with closed-loop CRM revenue sync to reduce cost per qualified demo.",
        expectedLift: "Reduce CPQL by ~45% and eliminate unqualified form fills.",
      };
    }
    return {
      title: "Omnichannel D2C Liquidity Engine",
      desc: "Connect Meta Advantage+, Google Shopping, and Amazon DSP with real-time autonomous budget rebalancing.",
      expectedLift: "Achieve +340% blended ROAS lift and 24/7 creative fatigue prevention.",
    };
  };

  const recResult = getRecommendation();

  return (
    <div className="relative min-h-screen w-full bg-[#0d0e12] text-white font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenContact={() => navigate("/contact")}
        onOpenAuth={() => navigate("/auth")}
        onOpenDashboard={() => navigate("/dashboard")}
      />

      {/* Ambient Lighting */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -left-32 w-[550px] h-[550px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[70%] -right-32 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

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
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="tracking-wide uppercase text-indigo-300">Customized For Your Business</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-400">Playbooks That Scale</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white"
          >
            Engineered For Every Growth Stage &{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Advertising Model
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you run a high-growth D2C brand, a 50-client media agency, or a B2B SaaS company,
            ADOS delivers the algorithmic architecture to eliminate wasted spend.
          </motion.p>

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
              <span>Get Your Custom Solution</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-sm tracking-wide backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <span>Talk to Growth Architect</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= PERSONA SELECTOR TABS ================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = p.id === activePersona;
            return (
              <button
                key={p.id}
                onClick={() => setActivePersona(p.id)}
                className={`p-5 rounded-2xl flex flex-col items-start gap-3 transition-all duration-200 cursor-pointer text-left ${
                  isSelected
                    ? "bg-white/[0.12] border-2 border-indigo-400 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                    : "bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08]"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-white/10 text-slate-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold text-white">{p.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{p.badge}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Deep Dive Card */}
        <div className="bg-[#14161f] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Pain points & Solution */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                  {currentPersona.badge}
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  {currentPersona.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mt-2">{currentPersona.tagline}</p>
              </div>

              {/* The Old Way vs The ADOS Way */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-2">
                    Common Frustrations Before ADOS:
                  </div>
                  <div className="space-y-2">
                    {currentPersona.painPoints.map((pt, i) => (
                      <div key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-rose-400 font-bold shrink-0">✕</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
                    The ADOS Autonomous Solution:
                  </div>
                  <div className="space-y-2">
                    {currentPersona.solutionPoints.map((sol, i) => (
                      <div key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-indigo-600/30"
                >
                  <span>{currentPersona.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Schedule Custom Demo →
                </Link>
              </div>
            </div>

            {/* Right: Quantifiable Benchmarks */}
            <div className="lg:col-span-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Verified Industry Benchmarks
                </span>
              </div>

              <div className="space-y-4">
                {currentPersona.metrics.map((m, i) => (
                  <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/[0.05]">
                    <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">
                      {m.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>
                  All playbooks include pre-built rules, automated budget reallocators, and live reporting templates.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE SOLUTION FINDER ================= */}
      <section className="relative z-10 py-20 max-w-6xl mx-auto px-4 sm:px-6 border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-400">
            Interactive Recommendation Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Find the Exact Blueprint for Your Stack
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Configure your business model, monthly spend, and target goals to get an instant strategy recommendation.
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Model */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                1. Your Business Model
              </label>
              <select
                value={recModel}
                onChange={(e) => setRecModel(e.target.value)}
                className="w-full bg-[#181a24] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="ecommerce">E-Commerce & D2C</option>
                <option value="agency">Performance Marketing Agency</option>
                <option value="b2b">B2B SaaS / High-Ticket</option>
                <option value="retail">Multi-Location Retail</option>
              </select>
            </div>

            {/* Step 2: Spend */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                2. Monthly Ad Spend
              </label>
              <select
                value={recSpend}
                onChange={(e) => setRecSpend(e.target.value)}
                className="w-full bg-[#181a24] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="starter">&lt; ₹2 Lakhs / mo ($2.5k)</option>
                <option value="growth">₹2L – ₹15 Lakhs / mo ($15k)</option>
                <option value="scale">₹15L – ₹50 Lakhs / mo ($60k)</option>
                <option value="enterprise">&gt; ₹50 Lakhs / mo ($100k+)</option>
              </select>
            </div>

            {/* Step 3: Primary Goal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                3. Primary Goal
              </label>
              <select
                value={recGoal}
                onChange={(e) => setRecGoal(e.target.value)}
                className="w-full bg-[#181a24] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="scale_roas">Maximize Blended ROAS</option>
                <option value="lower_cpa">Slash Customer Acquisition Cost</option>
                <option value="save_time">Automate Reporting & Save Hours</option>
                <option value="stop_loss">Protect Wasted Ad Spend</option>
              </select>
            </div>
          </div>

          {/* Dynamic Result Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#151722] border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-300">
                <Target className="w-3.5 h-3.5" />
                <span>Recommended Blueprint</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white">{recResult.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{recResult.desc}</p>
              <div className="text-xs text-emerald-400 font-semibold pt-1">
                ★ Impact: {recResult.expectedLift}
              </div>
            </div>

            <Link
              to="/auth"
              className="px-6 py-3 rounded-full bg-white text-[#0d0e12] font-bold text-xs sm:text-sm whitespace-nowrap shadow-lg hover:bg-slate-100 transition-all shrink-0"
            >
              Apply This Blueprint
            </Link>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 text-center space-y-6 backdrop-blur-2xl shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready for a tailored solution?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Scale Smarter With ADOS Tailored Playbooks
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join hundreds of high-performing brands and agencies running autonomous ad optimization.
            Start your 14-day free trial or talk with our solutions architects.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#0d0e12] font-bold text-sm tracking-wide shadow-xl hover:bg-slate-100 hover:scale-105 transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all"
            >
              Book Strategic Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenContact={() => navigate("/contact")} />
    </div>
  );
}
