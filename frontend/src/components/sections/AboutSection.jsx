import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Building2,
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection({ onOpenContact, onOpenAuth }) {
  const [billingCycle, setBillingCycle] = useState("annual"); // 'monthly' | 'annual'
  const containerRef = useRef(null);
  const cardsRef = useRef(null);

  const isAnnual = billingCycle === "annual";

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      subtitle: "For independent creators & early-stage brands looking to consolidate ad spend.",
      monthlyPrice: 3999,
      annualPrice: 3199,
      popular: false,
      badge: "Starter",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      ctaText: "Start 14-Day Free Trial",
      ctaStyle: "bg-slate-900 hover:bg-black text-white",
      features: [
        "2 Connected Ad Accounts (Meta & Google)",
        "Up to ₹1,50,000 monthly ad spend tracked",
        "AI Creative Multi-Format Auto-Resizing",
        "Unified Multi-Channel Dashboard",
        "Standard Conversion API Sync",
        "Real-Time CPA & ROAS Metrics",
        "Email Support (24h turnaround)",
        "Single Workspace Member",
      ],
      notIncluded: [
        "Autonomous Budget Reallocation",
        "Pinterest & Snapchat Deep Integrations",
        "Dedicated Account Strategist",
      ],
    },
    {
      id: "business",
      name: "Business Plan",
      subtitle: "For scaling e-commerce brands & teams demanding automated ROAS optimization.",
      monthlyPrice: 11999,
      annualPrice: 9599,
      popular: true,
      badge: "Most Popular",
      badgeColor: "bg-[#ff4a22] text-white border-transparent",
      ctaText: "Get Started with Business",
      ctaStyle: "bg-[#ff4a22] hover:bg-[#e03a14] text-white shadow-lg shadow-[#ff4a22]/25",
      features: [
        "All Connected Networks (Meta, Google, Amazon, YouTube, LinkedIn, Pinterest, Snapchat)",
        "Up to ₹10,00,000 monthly ad spend tracked",
        "Autonomous ROAS Auto-Shifting Engine",
        "Predictive Audience Fatigue Detection",
        "Multi-Touch Attribution Modeling",
        "Hourly Live Campaign Sync",
        "Priority 24/7 Dedicated Slack Support",
        "5 Team Members with Custom Permissions",
      ],
      notIncluded: [
        "Custom Data Warehousing & ERP",
      ],
    },
    {
      id: "custom",
      name: "Custom Plan",
      subtitle: "For enterprise organizations & multi-brand agencies managing global portfolios.",
      isCustomPrice: true,
      popular: false,
      badge: "Enterprise",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      ctaText: "Talk to Enterprise Sales",
      ctaStyle: "bg-slate-900 hover:bg-black text-white",
      features: [
        "Unlimited Ad Accounts & Unlimited Spend",
        "White-Label Client Reporting Cockpit",
        "Custom Machine Learning Attribution",
        "Dedicated Growth Strategist & Media Buyer",
        "Custom API Webhooks & ERP Sync",
        "Single Sign-On (SSO) & SOC2 Type II",
        "Unlimited Workspaces & Role Hierarchies",
        "99.99% Uptime SLA & Custom Invoicing",
      ],
      notIncluded: [],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for pricing cards
      const cards = cardsRef.current?.querySelectorAll(".pricing-card");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCta = (planId) => {
    if (planId === "custom") {
      if (onOpenContact) onOpenContact();
    } else {
      if (onOpenAuth) {
        onOpenAuth();
      } else if (onOpenContact) {
        onOpenContact();
      }
    }
  };

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-[#fcfdfd] overflow-hidden border-t border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-orange-100/40 via-amber-100/30 to-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>Transparent Pricing Plans</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111113] tracking-tight leading-[1.12]">
            Predictable pricing.
            <br />
            <span className="text-[#ff4a22]">Limitless scale.</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the plan that fits your current ad velocity. Start free for 14 days with zero
            commitment and unlock autonomous multi-channel intelligence.
          </p>

          {/* ================= BILLING TOGGLE (MONTHLY VS ANNUAL) ================= */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center p-1.5 rounded-full bg-slate-100 border border-slate-200/80 shadow-inner">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  !isAnnual
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Monthly billing
              </button>

              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isAnnual
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                <span>Annual billing</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#ff4a22] text-white">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 3 PRICING CARDS: BASIC, BUSINESS, CUSTOM ================= */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10 items-stretch"
        >
          {plans.map((plan) => {
            const isBusiness = plan.id === "business";

            return (
              <div
                key={plan.id}
                className={`pricing-card relative rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 will-change-transform ${
                  isBusiness
                    ? "bg-[#111113] text-white border-2 border-[#ff4a22] shadow-[0_25px_70px_-15px_rgba(255,74,34,0.25)] lg:-translate-y-4"
                    : "bg-white text-slate-900 border border-slate-200/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] hover:border-slate-300 hover:shadow-xl"
                }`}
              >
                {/* Popular Pill Tag on top of Business Card */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-[#ff4a22] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <Zap className="w-3 h-3 fill-white" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header: Plan Name & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                    {!plan.popular && (
                      <span
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${plan.badgeColor}`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed mb-6 ${
                      isBusiness ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Price Block */}
                  <div className="pb-6 mb-6 border-b border-dashed border-slate-200/40">
                    {plan.isCustomPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-black tracking-tight">
                          Custom
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isBusiness ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          tailored SLA
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-black tracking-tight">
                          ₹{(isAnnual ? plan.annualPrice : plan.monthlyPrice).toLocaleString('en-IN')}
                        </span>
                        <span
                          className={`text-xs sm:text-sm font-semibold ${
                            isBusiness ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          / month
                        </span>
                        {isAnnual && (
                          <span className="ml-2 text-[11px] font-bold text-emerald-500">
                            (billed annually)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <div
                      className={`text-[11px] font-bold uppercase tracking-wider ${
                        isBusiness ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Included in this plan:
                    </div>

                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isBusiness
                              ? "bg-[#ff4a22]/20 text-[#ff5e3a]"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span
                          className={`leading-snug ${
                            isBusiness ? "text-slate-200" : "text-slate-700 font-medium"
                          }`}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div>
                  <button
                    onClick={() => handleCta(plan.id)}
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${plan.ctaStyle}`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p
                    className={`text-[11px] text-center mt-3 ${
                      isBusiness ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {plan.id === "custom"
                      ? "Custom contract & dedicated onboarding"
                      : "Instant setup · No card required · 14-day trial"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM GUARANTEE & LOGO ROW ================= */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#ff4a22] shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                100% Risk-Free 14-Day Guarantee
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your Meta and Google accounts in 60 seconds with verified OAuth. No code required.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContact}
              className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Have custom questions?
            </button>
            <button
              onClick={onOpenContact}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Book 1-on-1 Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

