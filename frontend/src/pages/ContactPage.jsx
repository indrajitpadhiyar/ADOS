import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Globe,
  Building,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import PlatformLogo from "../components/common/PlatformLogo";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    problem: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("adoshub.online@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  const faqs = [
    {
      q: "How fast can ADOS connect to my existing ad accounts?",
      a: "Instant OAuth connection takes less than 60 seconds for Meta, Google Ads, Amazon DSP, and other supported networks without any manual tracking pixel headaches.",
    },
    {
      q: "Does ADOS require a long-term contract?",
      a: "No long-term lock-in. You have full control over your billing, ad budgets, and connected ad accounts at all times.",
    },
    {
      q: "Can ADOS automate ad spend across multiple networks simultaneously?",
      a: "Yes! ADOS's autonomous routing monitors real-time CPA/ROAS across Meta, Google, Amazon, YouTube, and TikTok to dynamically allocate spend to top performers.",
    },
    {
      q: "Is my proprietary advertising and audience data protected?",
      a: "All credentials and telemetry are encrypted in transit with TLS 1.3 and at rest with AES-256. We never sell or train third-party public models on your private data.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#fbfbfd] text-[#111113] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-orange-100/50 via-purple-100/30 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-20 -right-24 w-[500px] h-[500px] bg-amber-100/35 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Micro-Grid */}
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

        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/ados-logo.png"
            alt="ADOS"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 select-none"
          />
        </Link>

        {/* Support Online Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Support Online · 2h Response</span>
          <span className="sm:hidden">Online</span>
        </div>
      </header>

      {/* ================= HERO INTRO ================= */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 pt-6 sm:pt-10 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider shadow-xs mb-5"
        >
          <Sparkles className="w-4 h-4 text-[#ff4a22]" />
          <span>Direct Contact & Partnerships</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111113] leading-[1.12] mb-4"
        >
          Let's Scale Your Advertising{" "}
          <span className="bg-gradient-to-r from-[#ff4a22] to-amber-500 bg-clip-text text-transparent">
            with Autonomous AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          Connect with an ADOS deployment strategist to discuss cross-channel growth, custom enterprise integrations, or schedule a hands-on platform walkthrough.
        </motion.p>
      </section>

      {/* ================= MAIN CONTENT: 2-COLUMN SPLIT ================= */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 pb-16 sm:pb-24 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: INFO & DIRECT CHANNELS ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Email Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff4a22] flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111113] mb-1">
                Email Our Strategy Team
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed font-light">
                For sales inquiries, partnership requests, or custom agency onboarding briefs:
              </p>

              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 select-all truncate">
                  adoshub.online@gmail.com
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-black hover:border-slate-300 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Enterprise & Agency Card */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111113]">
                Enterprise & Agency Flight
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                Managing ₹250k+ monthly ad spend? We provide dedicated account architects, custom webhook triggers, and white-glove migration assistance.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Dedicated SLA & Priority 24/7 Support</span>
              </div>
            </div>

            {/* Platform Coverage Ribbon */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Live Omni-Channel Integrations
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "meta", label: "Meta" },
                  { id: "google", label: "Google" },
                  { id: "amazon", label: "Amazon" },
                  { id: "youtube", label: "YouTube" },
                  { id: "linkedin", label: "LinkedIn" },
                  { id: "pinterest", label: "Pinterest" },
                  { id: "snapchat", label: "Snap" },
                ].map((net) => (
                  <div
                    key={net.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-700"
                  >
                    <PlatformLogo platform={net.id} size="xs" />
                    <span>{net.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company & Legal Info */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">IDR TECH</span>
                <span>Autonomous Advertising Operating Systems</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 font-medium">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>India · Global</span>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: INTERACTIVE CONTACT FORM ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl sm:rounded-[32px] border border-slate-200/90 shadow-lg relative"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-16 space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111113]">
                  Message Received!
                </h3>
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-bold text-black">{form.name}</span>. Our team has received your message and will review your details and contact you at <span className="font-semibold text-black">{form.email}</span> within 2 hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        problem: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111113] tracking-tight">
                    Get in Touch
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill out the form below and describe your problem. Our team will get back to you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Row 1: Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Work Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Company & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Company / Brand Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Acme Global"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Problem Description Textbox */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Describe Your Problem *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe your problem or what you need assistance with..."
                      value={form.problem}
                      onChange={(e) => setForm({ ...form, problem: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-[#111113] hover:bg-black text-white font-bold text-sm tracking-wide shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4 text-[#ff4a22]" />
                    <span>{loading ? "Sending..." : "Submit"}</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center pt-1 font-light">
                    🔒 By submitting this form, you agree to our{" "}
                    <Link to="/privacy-policy" className="underline hover:text-black">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/terms" className="underline hover:text-black">
                      Terms of Service
                    </Link>
                    .
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>

        {/* ================= FAQ ACCORDION SECTION ================= */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-slate-200 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#111113] tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need to know about getting started with ADOS.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-slate-800 hover:text-black cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === idx ? "rotate-180 text-black" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer className="relative z-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 max-w-7xl mx-auto w-full px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
          <Link to="/data-deletion" className="hover:text-black transition-colors">
            User Data Deletion
          </Link>
          <Link to="/" className="text-[#ff4a22] hover:underline font-semibold">
            Return to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}

