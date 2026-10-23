import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Info,
  Clock,
  Layers,
  BarChart3,
  Video,
  Lock,
} from "lucide-react";
import { api } from "../../services/api";

export default function UpgradePlanSection({ user }) {
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly' | 'yearly'
  const [quota, setQuota] = useState(null);
  const [isLoadingQuota, setIsLoadingQuota] = useState(true);
  const [activatedPro, setActivatedPro] = useState(false);
  const [showFaqIndex, setShowFaqIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getAiQuota()
      .then((res) => {
        if (isMounted) setQuota(res);
      })
      .catch((err) => console.error("Error loading quota:", err))
      .finally(() => {
        if (isMounted) setIsLoadingQuota(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleActivateProBeta = () => {
    setActivatedPro(true);
    setTimeout(() => {
      alert("🎉 Pro Free-Beta privileges unlocked! Your workspace now has experimental multi-variant creatives enabled.");
    }, 150);
  };

  const PLANS = [
    {
      id: "free",
      name: "Starter / Free Tier",
      badge: "Current Plan",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      price: "₹0",
      period: "forever",
      description: "Everything you need to test autonomous AI marketing, connect Google Ads, and run campaigns at zero cost.",
      highlight: false,
      buttonText: "Active Plan",
      buttonDisabled: true,
      features: [
        "10 Free AI Ad Images per day",
        "Direct Google Ads OAuth & Campaign Sync",
        "5-Network Multi-Channel Reporting",
        "High-Speed Flux.1 Community Inference",
        "7-Day Rolling Secure Session Keepalive",
        "Standard Exportable CSV Reports",
      ],
    },
    {
      id: "pro",
      name: "Pro Growth Suite",
      badge: "Free Public Beta",
      badgeColor: "bg-orange-50 text-[#ff4a22] border-orange-200",
      price: billingCycle === "monthly" ? "₹0" : "₹0",
      oldPrice: billingCycle === "monthly" ? "₹2,499" : "₹1,999",
      period: "during beta",
      description: "Scale campaign velocity with elevated inference limits, automated cross-channel budget pacing, and ROAS guardrails.",
      highlight: true,
      buttonText: activatedPro ? "Beta Activated" : "Activate Free Beta",
      buttonDisabled: activatedPro,
      features: [
        "Everything in Starter, plus:",
        "100 AI Creative Generations daily",
        "AI Diffusion Video Generation (with custom endpoint)",
        "Autonomous ROAS Pacing Assistant",
        "Cross-network conversion attribution tracking",
        "Priority queue processing & Webhooks",
      ],
    },
    {
      id: "enterprise",
      name: "Agency / Enterprise",
      badge: "Custom Deployment",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      price: "Custom",
      period: "contact us",
      description: "Designed for performance agencies managing multiple client ad accounts and custom inference clusters.",
      highlight: false,
      buttonText: "Contact Agency Team",
      buttonDisabled: false,
      buttonAction: () => {
        window.location.href = "mailto:sales@ados.ai?subject=ADOS%20Agency%20Plan%20Inquiry";
      },
      features: [
        "Unlimited Multi-Client Workspaces",
        "Dedicated Private GPU Inference Endpoints",
        "White-Label Client PDF Reporting Cockpit",
        "Direct Engineering Slack Support Channel",
        "Custom SLA & Role-Based Access Control",
        "Enterprise Single Sign-On (SSO)",
      ],
    },
  ];

  const FAQS = [
    {
      q: "Does ADOS have any hidden fees or automatic billing?",
      a: "No. ADOS operates under a strict Zero-Cost guarantee for our free-tier features. We never ask for payment details unless you explicitly choose to subscribe to a paid deployment.",
    },
    {
      q: "When does my daily AI image generation quota reset?",
      a: "Free image quotas reset every 24 hours at 00:00 UTC. You can view your current daily usage and remaining generations at the top of this page.",
    },
    {
      q: "How does AI video generation work with my plan?",
      a: "Commercial text-to-video APIs currently require dedicated GPU billing clusters. To prevent unauthorized charges, ADOS provides a pluggable provider interface where you can safely plug in your own endpoint without automatic platform markup.",
    },
    {
      q: "Can I connect my real Google Ads account on the Free plan?",
      a: "Yes! Full Google Ads OAuth integration, token refresh handling, and live reporting telemetry are included in the Free Starter tier at zero cost.",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 pb-16">
      {/* 1. HEADER & ZERO-COST GUARANTEE */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#ff4a22] text-xs font-black uppercase tracking-wider">
          <Crown className="w-4 h-4" />
          <span>Membership & Tier Allocation</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Flexible Plans for Modern Ad Teams
        </h1>

        <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
          Zero-cost free tiers with genuine AI creative generation, deep Google Ads synchronization, and no surprise credit card bills.
        </p>

        {/* Billing Toggle (Monthly / Yearly) */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME FREE QUOTA & USAGE METER */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff4a22]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-300 bg-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#ff4a22]" />
              <span>Current Daily Quota Status</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {user?.name || "Advertiser"}'s Active Free Tier
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your account is provisioned with 10 free AI generations per day. Generations refresh continuously with zero billing or hidden subscriptions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">Generations Remaining:</span>
              <span className="text-xl font-black text-emerald-400">
                {isLoadingQuota ? "..." : `${quota?.remainingToday ?? 10} / ${quota?.dailyLimit ?? 10}`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/15 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-[#ff4a22] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${
                    quota
                      ? Math.min(100, Math.max(5, (quota.usedToday / quota.dailyLimit) * 100))
                      : 10
                  }%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
              <span>Provider: {quota?.provider || "Community Flux.1"}</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Cost Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {PLANS.map((plan) => {
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.highlight
                  ? "bg-white border-2 border-[#ff4a22] shadow-xl ring-4 ring-orange-50 scale-[1.02]"
                  : "bg-white border border-slate-200/90 shadow-sm hover:border-slate-300"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff4a22] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-wider">
                  Recommended
                </div>
              )}

              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900">{plan.name}</h3>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${plan.badgeColor}`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-1 border-b border-slate-100 pb-5">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">{plan.price}</span>
                  {plan.oldPrice && (
                    <span className="text-sm font-bold text-slate-400 line-through">
                      {plan.oldPrice}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-semibold">/ {plan.period}</span>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Included Features
                  </span>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={plan.buttonAction || (plan.id === "pro" ? handleActivateProBeta : undefined)}
                  disabled={plan.buttonDisabled}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? "bg-[#ff4a22] hover:bg-[#e63f19] text-white shadow-md hover:scale-[1.01]"
                      : plan.buttonDisabled
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  {!plan.buttonDisabled && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#ff4a22] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Plan & Billing FAQ</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            Common questions regarding memberships & quotas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {FAQS.map((faq, index) => {
            const isOpen = showFaqIndex === index;
            return (
              <div
                key={index}
                onClick={() => setShowFaqIndex(isOpen ? null : index)}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs cursor-pointer hover:border-slate-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
                  <span>{faq.q}</span>
                  <span className="text-slate-400 ml-2">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1 border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
