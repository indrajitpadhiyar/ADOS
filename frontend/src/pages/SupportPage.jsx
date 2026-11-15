import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Mail,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkles,
  LifeBuoy,
  FileText,
  ShieldCheck,
  Zap,
  Settings,
  CreditCard,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function SupportPage({ user }) {
  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem("ados_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    category: "technical",
    priority: "normal",
    subject: "",
    message: "",
  });
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("adoshub.online@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.email || !ticketForm.message) return;

    setTicketSubmitting(true);
    setTimeout(() => {
      const generatedId = `ADOS-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setTicketSubmitting(false);
      setTicketSubmitted(true);
    }, 700);
  };

  const categories = [
    { id: "all", label: "All Topics", icon: HelpCircle },
    { id: "accounts", label: "Ad Accounts & OAuth", icon: RefreshCw },
    { id: "campaigns", label: "AI & Automation", icon: Zap },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "security", label: "Security & Privacy", icon: ShieldCheck },
  ];

  const helpTopics = [
    {
      id: "oauth-meta",
      category: "accounts",
      icon: RefreshCw,
      title: "Connecting Meta & Instagram Ad Accounts",
      description: "How to grant permissions, select your business manager, and link ad assets via official Meta Graph API.",
      tag: "Account Setup",
    },
    {
      id: "oauth-google",
      category: "accounts",
      icon: RefreshCw,
      title: "Google Ads & YouTube OAuth Setup",
      description: "Authorize ADOS with manager (MCC) or individual Google Ads accounts without sharing passwords.",
      tag: "Account Setup",
    },
    {
      id: "ai-routing",
      category: "campaigns",
      icon: Zap,
      title: "Autonomous Spend & Cross-Network Routing",
      description: "How ADOS continuously analyzes real-time CPA/ROAS to reallocate budget across high-performing ad sets.",
      tag: "Automation",
    },
    {
      id: "budget-limits",
      category: "campaigns",
      icon: Zap,
      title: "Setting Hard Budget Caps & Safety Thresholds",
      description: "Configuring daily burn limits, stop-loss triggers, and emergency pause rules.",
      tag: "Campaign Safety",
    },
    {
      id: "invoicing",
      category: "billing",
      icon: CreditCard,
      title: "Payment Methods, Invoices & GST Receipts",
      description: "How to download monthly tax invoices, manage card credentials, and handle currency conversions.",
      tag: "Billing",
    },
    {
      id: "data-rights",
      category: "security",
      icon: ShieldCheck,
      title: "Data Protection & Complete Account Deletion",
      description: "How your tokens are encrypted with AES-256 and how to revoke all access and purge stored analytics.",
      tag: "Compliance",
    },
  ];

  const faqs = [
    {
      id: "faq-1",
      category: "accounts",
      q: "How do I reconnect an ad account if the token expires?",
      a: "Go to your Ad Accounts Hub (/ad-accounts). Under your connected accounts list, click 'Refresh Token' or 'Reconnect'. This generates a fresh OAuth handshake with Meta or Google without disrupting your active campaign tracking.",
    },
    {
      id: "faq-2",
      category: "campaigns",
      q: "Does ADOS make changes to my live campaigns without approval?",
      a: "Only within the bounds you configure. In 'Full Autonomous' mode, ADOS adjusts bids and budget allocations within your defined min/max boundaries. In 'Assisted' mode, ADOS flags recommended optimizations and waits for your confirmation.",
    },
    {
      id: "faq-3",
      category: "accounts",
      q: "Why is my ad account balance or campaign spend not showing in real-time?",
      a: "Most advertising APIs (Meta Graph API and Google Ads API) have a 10 to 15-minute telemetry latency window. You can force an instant telemetry sync anytime by clicking the 'Sync Now' icon on your Dashboard overview.",
    },
    {
      id: "faq-4",
      category: "billing",
      q: "Can I cancel or change my plan anytime?",
      a: "Yes, ADOS is month-to-month with no long-term contracts. You can upgrade, downgrade, or cancel directly from your Settings page at any time without cancellation penalties.",
    },
    {
      id: "faq-5",
      category: "security",
      q: "How do I request complete deletion of my data from ADOS?",
      a: "You can submit an instant automated deletion request at /data-deletion, or disconnect your accounts from the Ad Accounts Hub. All tokens, campaign cache, and user data are permanently wiped within 24 hours.",
    },
    {
      id: "faq-6",
      category: "billing",
      q: "Does ADOS charge a percentage fee on my ad spend?",
      a: "No! ADOS operates on flat subscription tiers. We never charge hidden percentage-of-spend commissions, allowing you to scale your ad budget without escalating software costs.",
    },
    {
      id: "faq-7",
      category: "technical",
      q: "What browsers and platforms are supported by the ADOS web portal?",
      a: "ADOS is optimized for all modern evergreen browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari, on desktop, tablet, and mobile devices.",
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen w-full bg-[#fbfbfd] text-[#111113] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-orange-100/50 via-blue-100/30 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[450px] h-[450px] bg-amber-100/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-20 -right-24 w-[500px] h-[500px] bg-purple-100/35 rounded-full blur-[130px] pointer-events-none" />

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
          to={currentUser ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-black bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs px-4 py-2 rounded-full transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 group-hover:text-black transition-all" />
          <span>{currentUser ? "Back to Dashboard" : "Back to Home"}</span>
        </Link>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/ados-logo.png"
            alt="ADOS"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105 select-none"
          />
        </Link>

        {/* Support Online SLA Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Support Desk Active · 2h Response</span>
          <span className="sm:hidden">Active</span>
        </div>
      </header>

      {/* ================= HERO INTRO & SEARCH ================= */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 sm:px-10 pt-6 sm:pt-10 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider shadow-xs mb-5"
        >
          <LifeBuoy className="w-4 h-4 text-[#ff4a22]" />
          <span>Help & Support Center</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111113] leading-[1.12] mb-4"
        >
          How Can We Help You{" "}
          <span className="bg-gradient-to-r from-[#ff4a22] to-amber-500 bg-clip-text text-transparent">
            Succeed with ADOS?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Search guides, explore troubleshooting steps for ad networks, or open a direct priority support ticket with our technical engineering desk.
        </motion.p>

        {/* Global Live Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="max-w-2xl mx-auto relative"
        >
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, ad network issues, billing, OAuth..."
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white border border-slate-200/90 text-sm sm:text-base text-slate-900 shadow-md focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#111113] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-black border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ff5e3a]" : "text-slate-400"}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* ================= KEY SUPPORT STATS & CARDS ================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 py-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Fast Response Desk */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ff4a22] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Fast Priority Response
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                Average ticket turnaround is under 2 hours. Our solutions engineers are on standby for ad emergency freezes.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Target Response</span>
              <span className="font-bold text-emerald-600">&lt; 120 Minutes</span>
            </div>
          </div>

          {/* Card 2: Direct Email Desk */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Direct Engineering Inbox
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light mb-3">
                Send logs, screenshot attachments, or API payload errors directly to our engineering desk:
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-800">
                <span className="truncate">adoshub.online@gmail.com</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="ml-2 px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-black shrink-0 transition-colors cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Contact Us</span>
              <Link to="/contact" className="font-bold text-[#ff4a22] hover:underline flex items-center gap-1">
                Sales & Inquiries <ArrowLeft className="w-3 h-3 rotate-180" />
              </Link>
            </div>
          </div>

          {/* Card 3: Platform Health Status */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                All Systems Operational
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                Meta Graph API, Google Ads API, TikTok Webhooks, and ADOS Autonomous Optimization engines running 100% normal.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Platform Uptime</span>
              <span className="font-bold text-slate-900">99.98% Monitored</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN SPLIT: TICKET FORM & FAQS ================= */}
      <main className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-16 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: TICKET SUBMISSION ================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-[#ff4a22]/10 text-[#ff4a22] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Open a Support Ticket
                  </h3>
                  <p className="text-xs text-slate-500">
                    Get direct technical assistance for your campaign or ad account
                  </p>
                </div>
              </div>

              {ticketSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Ticket Received!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Your inquiry has been routed to our technical queue with high priority.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono font-semibold text-slate-700">
                    Reference ID: <span className="text-[#ff4a22]">{ticketId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketSubmitted(false);
                      setTicketForm({
                        name: currentUser?.name || "",
                        email: currentUser?.email || "",
                        category: "technical",
                        priority: "normal",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-black underline cursor-pointer"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.name}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, name: e.target.value })
                        }
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Work Email
                      </label>
                      <input
                        type="email"
                        required
                        value={ticketForm.email}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, email: e.target.value })
                        }
                        placeholder="john@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Category
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, category: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all"
                      >
                        <option value="technical">Technical Support</option>
                        <option value="account">Ad Account Connection</option>
                        <option value="campaigns">AI & Optimization</option>
                        <option value="billing">Billing & Invoices</option>
                        <option value="feature">Feature Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                        Priority
                      </label>
                      <select
                        value={ticketForm.priority}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, priority: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all"
                      >
                        <option value="normal">Normal (Standard)</option>
                        <option value="high">High (Active Campaign)</option>
                        <option value="urgent">Urgent (Spend Blocked)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketForm.subject}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, subject: e.target.value })
                      }
                      placeholder="e.g. Meta OAuth token expired after password change"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                      Problem Details / Error Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={ticketForm.message}
                      onChange={(e) =>
                        setTicketForm({ ...ticketForm, message: e.target.value })
                      }
                      placeholder="Please describe what occurred, which ad account was involved, and any specific error code shown..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ticketSubmitting}
                    className="w-full py-3 px-5 rounded-xl bg-[#111113] hover:bg-black text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {ticketSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Ticket to Engineers</span>
                        <Send className="w-3.5 h-3.5 text-[#ff5e3a]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="bg-slate-100/80 p-6 rounded-3xl border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Self-Service Documentation
              </h4>
              <div className="flex flex-col gap-2">
                <Link
                  to="/data-deletion"
                  className="p-3 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 text-xs font-semibold text-slate-800 flex items-center justify-between group transition-all"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Data Deletion & Access Instructions
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/privacy-policy"
                  className="p-3 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 text-xs font-semibold text-slate-800 flex items-center justify-between group transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Privacy Policy & Security Standards
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/terms"
                  className="p-3 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 text-xs font-semibold text-slate-800 flex items-center justify-between group transition-all"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Platform Terms of Service
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EXPANDABLE FAQS & GUIDES ================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Instant answers to common account, campaign, and setup questions
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                {filteredFaqs.length} Answers
              </span>
            </div>

            {/* Accordion List */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">
                    No articles found matching "{searchQuery}"
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="text-xs font-bold text-[#ff4a22] hover:underline cursor-pointer"
                  >
                    Reset search filters
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <motion.div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                      >
                        <span className="text-xs sm:text-sm md:text-[15px] font-bold text-slate-900 leading-snug">
                          {faq.q}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                            isOpen
                              ? "bg-slate-900 border-slate-900 text-white rotate-180"
                              : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                          >
                            <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Popular Guides Grid */}
            <div className="pt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Popular Integration Guides
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {helpTopics.slice(0, 4).map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <div
                      key={topic.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono font-bold uppercase text-[#ff4a22] bg-orange-50 px-2 py-0.5 rounded">
                            {topic.tag}
                          </span>
                          <Icon className="w-4 h-4 text-slate-400" />
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 mb-1 group-hover:text-[#ff4a22] transition-colors">
                          {topic.title}
                        </h5>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">
                          {topic.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>Read Walkthrough</span>
                        <ArrowLeft className="w-3.5 h-3.5 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-[#1e2029] p-6 sm:p-8 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1 z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-[#ff5e3a] font-bold">
                  Still Need Help?
                </span>
                <h4 className="text-lg sm:text-xl font-bold tracking-tight">
                  Speak directly with an ADOS deployment specialist
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light max-w-md">
                  Looking for tailored onboarding, custom agency integrations, or high-volume multi-account setups?
                </p>
              </div>
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shrink-0 shadow-sm hover:scale-105 active:scale-95 z-10"
              >
                Contact Sales & Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ================= CLEAN FOOTER ================= */}
      <footer className="relative z-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-6 max-w-7xl mx-auto w-full px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} ADOS · Powered by IDR TECH. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link to="/contact" className="hover:text-black transition-colors">
            Contact Us
          </Link>
          <Link to="/support" className="text-[#ff4a22] font-semibold transition-colors">
            Support Center
          </Link>
          <Link to="/privacy-policy" className="hover:text-black transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-black transition-colors">
            Terms of Service
          </Link>
          <Link to="/data-deletion" className="hover:text-black transition-colors">
            Data Deletion
          </Link>
          <Link to="/" className="text-slate-700 hover:text-black font-semibold">
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
