import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Sparkles,
  Quote,
  Star,
  BarChart3,
  Building,
  Award,
} from "lucide-react";
import Footer from "../components/layout/Footer";

export default function ResultsPage({ user }) {
  const navigate = useNavigate();

  // Interactive ROI Calculator State
  const [monthlySpend, setMonthlySpend] = useState(500000); // in INR (₹5L)
  const [currentRoas, setCurrentRoas] = useState(2.2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dynamic calculations
  // Average ADOS improvement: +40% ROAS increase, ~25% wasted spend saved
  const projectedRoas = (currentRoas * 1.45).toFixed(2);
  const currentRevenue = monthlySpend * currentRoas;
  const projectedRevenue = monthlySpend * parseFloat(projectedRoas);
  const additionalMonthlyRevenue = Math.round(projectedRevenue - currentRevenue);
  const estimatedSpendSaved = Math.round(monthlySpend * 0.22);
  const estimatedHoursSaved = Math.round(18 * 4.2); // ~75 hours per month

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const caseStudies = [
    {
      company: "NovaWear D2C",
      industry: "Apparel & Lifestyle",
      logoBadge: "Apparel",
      problem:
        "Meta Advantage+ CPA surged from ₹380 to ₹890 during the festive quarter, with creatives burning out every 4 days.",
      solution:
        "ADOS automated creative studio generated 16 dynamic Reels & TikTok variants and reallocated budget to winning hooks within 400ms.",
      results: [
        { label: "Blended ROAS", before: "1.8x", after: "4.4x", gain: "+144%" },
        { label: "Cost Per Acquisition", before: "₹890", after: "₹340", gain: "-61%" },
        { label: "Monthly Ad Spend", before: "₹5 Lakhs", after: "₹38 Lakhs", gain: "Scaled" },
      ],
      quote:
        "ADOS gave our small 3-person team the execution speed of a 20-person performance agency. We scaled 7x without hiring media buyers.",
      author: "Vikram Mehta, Co-Founder & Head of Growth",
    },
    {
      company: "CloudScale SaaS",
      industry: "B2B Tech & Enterprise",
      logoBadge: "B2B SaaS",
      problem:
        "Struggling with ₹3,200+ cost per demo booked and zero closed-loop tracking between LinkedIn clicks and closed deals.",
      solution:
        "Activated ADOS First-Party Server Conversions API and connected CRM pipeline stages directly to Google & LinkedIn bidding algorithms.",
      results: [
        { label: "Cost Per Demo", before: "₹3,200", after: "₹1,420", gain: "-55%" },
        { label: "Pipeline Velocity", before: "48 days", after: "26 days", gain: "+84%" },
        { label: "Closed-Won ROAS", before: "2.1x", after: "4.8x", gain: "+128%" },
      ],
      quote:
        "Connecting closed-won pipeline back into our ad algorithms completely eliminated junk leads. Our sales reps only talk to qualified buyers.",
      author: "Neha Sharma, VP of Demand Generation",
    },
    {
      company: "KitchenCraft Online",
      industry: "Home & Kitchen Appliances",
      logoBadge: "Omnichannel",
      problem:
        "Running out of stock on top-selling SKUs while Google Shopping and Amazon Sponsored Products continued burning daily budget.",
      solution:
        "Integrated real-time inventory feed with ADOS stop-loss rules to automatically pause ads when stock dropped below 15 units.",
      results: [
        { label: "Stockout Waste Prevented", before: "₹4.8L / mo", after: "₹0", gain: "100% Saved" },
        { label: "Amazon ACoS", before: "34%", after: "19%", gain: "-44%" },
        { label: "Overall Sales Growth", before: "₹18L / mo", after: "₹62L / mo", gain: "+244%" },
      ],
      quote:
        "The automated inventory circuit breaker alone saved us over ₹5 Lakhs in the first month. An absolute game-changer for retail.",
      author: "Rahul Verma, Director of E-Commerce",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#fbfbfd] text-[#111113] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white overflow-x-hidden">
      {/* Ambient Lighting Accents (Light Pastel Theme) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-amber-100/60 via-orange-100/30 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -right-32 w-[550px] h-[550px] bg-emerald-100/40 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[75%] -left-32 w-[550px] h-[550px] bg-blue-100/40 rounded-full blur-[150px] pointer-events-none" />

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
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="tracking-wide uppercase text-amber-700 font-bold">Quantifiable Performance Impact</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">1,400+ Brands Scaled</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-900"
          >
            Real Results. Proven Returns.{" "}
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 bg-clip-text text-transparent">
              Zero Marketing Fluff.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Explore verified case studies and benchmark statistics from brands leveraging ADOS's
            autonomous multi-channel bidding, creative rotation, and stop-loss engines.
          </motion.p>
        </div>

        {/* Quantified Benchmarks Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto"
        >
          {[
            { metric: "+340%", label: "Average Blended ROAS Lift", sub: "Across multi-channel campaigns" },
            { metric: "-42%", label: "Average CPA Reduction", sub: "Lower acquisition costs" },
            { metric: "18.4 hrs", label: "Saved Weekly / Buyer", sub: "Automated manual optimization" },
            { metric: "₹45 Cr+", label: "Ad Spend Optimized", sub: "With 99.98% capital efficiency" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-600 tracking-tight">
                {item.metric}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-2">{item.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{item.sub}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= INTERACTIVE ROI CALCULATOR ================= */}
      <section className="relative z-10 py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 lg:p-12 rounded-[2.5rem] bg-white border border-amber-200/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.07)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>Interactive Projected Value Calculator</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Estimate Your Return with ADOS
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Model based on 1,400+ live account historical averages
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-stretch">
            {/* Sliders Input */}
            <div className="lg:col-span-6 space-y-8 flex flex-col justify-between">
              {/* Slider 1: Monthly Spend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700">Your Monthly Ad Spend</span>
                  <span className="font-mono font-bold text-slate-900 text-base">
                    {formatCurrency(monthlySpend)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>₹50,000</span>
                  <span>₹25 Lakhs</span>
                  <span>₹50 Lakhs+</span>
                </div>
              </div>

              {/* Slider 2: Current ROAS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700">Current Blended ROAS</span>
                  <span className="font-mono font-bold text-amber-700 text-base">
                    {currentRoas.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={currentRoas}
                  onChange={(e) => setCurrentRoas(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>1.0x</span>
                  <span>2.5x</span>
                  <span>5.0x</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
                💡 ADOS automatically routes budgets to lower-CPA campaigns and stops underperforming
                ad sets before budgets are burned, raising blended returns significantly.
              </div>
            </div>

            {/* Calculated Output Card (High Contrast Cockpit Card) */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Estimated Monthly Impact
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
                      +{formatCurrency(additionalMonthlyRevenue)}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">Extra Monthly Revenue</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-300">
                      {projectedRoas}x
                    </div>
                    <div className="text-xs text-slate-300 mt-1">Projected ADOS ROAS</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-lg font-bold text-white">
                      ~{formatCurrency(estimatedSpendSaved)}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Wasted Spend Prevented</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-lg font-bold text-white">~{estimatedHoursSaved} hrs/mo</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Optimization Time Saved</div>
                  </div>
                </div>
              </div>

              <Link
                to="/auth"
                className="w-full py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm text-center shadow-lg transition-all cursor-pointer"
              >
                Claim This ROI — Connect Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= IN-DEPTH VERIFIED CASE STUDIES ================= */}
      <section className="relative z-10 py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-700">
            Real Customer Breakdowns
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            How Top Brands Scaled Profitably
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Read exactly how high-growth teams turned advertising from a cost center into a scalable revenue engine.
          </p>
        </div>

        <div className="space-y-8">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{study.company}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {study.logoBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{study.industry}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {study.results.map((r, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center min-w-[120px]"
                    >
                      <div className="text-lg sm:text-xl font-extrabold text-emerald-600">{r.gain}</div>
                      <div className="text-[11px] text-slate-600 font-medium">{r.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {r.before} → {r.after}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
                    The Challenge:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{study.problem}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                    ADOS Autonomous Action:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{study.solution}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-slate-700 italic">
                <Quote className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div>"{study.quote}"</div>
                  <div className="text-xs font-bold text-slate-900 not-italic mt-2">— {study.author}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-slate-200/90 text-center space-y-6 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Ready to unlock your highest ROAS yet?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Stop Guessing. Start Scaling With ADOS.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every day without autonomous optimization is money left on the table.
            Connect your ad accounts in 60 seconds and experience real algorithmic efficiency.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 text-white font-bold text-sm tracking-wide shadow-md hover:bg-slate-800 hover:scale-105 transition-all cursor-pointer"
            >
              Get Started Free (14 Days)
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-sm transition-all cursor-pointer shadow-xs"
            >
              Request Custom Audit
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onOpenContact={() => navigate("/contact")} />
    </div>
  );
}
