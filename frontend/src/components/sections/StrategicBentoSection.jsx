import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Reusable Smooth 1, 2, 3... Number Counter using GSAP and ScrollTrigger
function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.8,
  triggerRef,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const triggerEl = triggerRef?.current || elementRef.current;
    if (!triggerEl) return;

    const counterObj = { current: 0 };

    const tween = gsap.to(counterObj, {
      current: value,
      duration,
      ease: "power3.out", // smooth rapid start, gentle slowing finish
      scrollTrigger: {
        trigger: triggerEl,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      onUpdate: () => {
        setDisplayValue(counterObj.current);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration, triggerRef]);

  return (
    <span ref={elementRef} className="tabular-nums font-inherit inline-block">
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

export default function StrategicBentoSection() {
  const containerRef = useRef(null);
  const cardLeftRef = useRef(null);
  const cardRightRef = useRef(null);
  const statNumberRef = useRef(null);
  const chartPathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth cards reveal
      gsap.fromTo(
        [cardLeftRef.current, cardRightRef.current],
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
          opacity: 1,
          y: 0,
          stagger: 0.18,
          duration: 0.9,
          ease: "power3.out",
        }
      );

      // Stat container pulse scale
      if (statNumberRef.current) {
        gsap.fromTo(
          statNumberRef.current,
          { scale: 0.9, opacity: 0 },
          {
            scrollTrigger: {
              trigger: statNumberRef.current,
              start: "top 85%",
            },
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: "back.out(1.5)",
          }
        );
      }

      // Smooth SVG chart line draw
      if (chartPathRef.current) {
        const length = chartPathRef.current.getTotalLength?.() || 300;
        gsap.fromTo(
          chartPathRef.current,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardLeftRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 bg-[#fafbfc] border-t border-slate-200/60 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* ================= SECTION HEADER (DITTO MATCHING REFERENCE) ================= */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-bold text-[#111113] tracking-tight leading-[1.12]">
              Your key to strategic
              <br />
              success through analytics
            </h2>
          </div>
          <div className="max-w-xs md:text-right pt-2">
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
              Ready for exciting, instantaneous,
              <br />
              all-accessible insights in real time?
            </p>
          </div>
        </div>

        {/* ================= DUAL BENTO CARDS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          {/* ================= LEFT CARD (WHITE STUDIO BENTO) ================= */}
          <div
            ref={cardLeftRef}
            className="lg:col-span-7 bg-white rounded-[2.5rem] p-7 sm:p-10 border border-slate-200/90 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Inner Left: Text & Setting Up Reports Tag */}
              <div className="md:col-span-6 flex flex-col justify-between h-full">
                <div>
                  {/* Yellow Rounded Pill Tag: "Setting up reports" */}
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-[#ffc83b] text-slate-950 font-bold text-xs tracking-tight mb-7 shadow-xs">
                    Setting up reports
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-4">
                    Fast and easy access
                    <br />
                    to analytics
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
                    One platform is a comprehensive system of solutions that will be the first step
                    towards digitalization of your business!
                  </p>
                </div>
              </div>

              {/* Inner Right: Floating Sales Statistic Card Mockup */}
              <div className="md:col-span-6 bg-[#fafbfc] rounded-2xl p-5 border border-slate-200/80 shadow-sm relative">
                {/* Header */}
                <div className="text-xs font-bold text-slate-800 mb-4 tracking-tight">
                  Sales statistic
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 gap-3 pb-3">
                  {/* Total Profit with 1, 2, 3... Counting Animation */}
                  <div className="flex items-center gap-2.5">
                    {/* Red Circular Icon with White Pulse Wave */}
                    <div className="w-10 h-10 rounded-full bg-[#ff4a22] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold leading-tight">Total profit</div>
                      <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                        <AnimatedCounter
                          value={264.2}
                          prefix="₹ "
                          suffix="K"
                          decimals={1}
                          duration={2.0}
                          triggerRef={cardLeftRef}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visitors with 1, 2, 3... Counting Animation */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs">
                    <div className="text-[10px] text-slate-400 font-semibold leading-tight">Visitors</div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <AnimatedCounter
                        value={46}
                        suffix="K"
                        duration={1.8}
                        triggerRef={cardLeftRef}
                      />
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    </div>
                    {/* Small Progress Bar */}
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[65%] rounded-full transition-all duration-1000" />
                    </div>
                  </div>
                </div>

                {/* Visit Statistics Line Graph Area */}
                <div className="mt-3 pt-3 border-t border-slate-200/60 relative">
                  <div className="text-[10px] text-slate-400 font-semibold mb-2">Visit statistics</div>

                  {/* SVG Chart connecting yellow points */}
                  <div className="relative h-20 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60">
                      {/* Smooth Golden Curve */}
                      <path
                        ref={chartPathRef}
                        d="M 5,45 Q 35,50 65,32 T 130,22 T 195,12"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      {/* Dots on Chart */}
                      <circle cx="5" cy="45" r="3" fill="#f59e0b" />
                      <circle cx="65" cy="32" r="3" fill="#f59e0b" />
                      <circle cx="100" cy="28" r="3" fill="#f59e0b" />
                      <circle cx="130" cy="22" r="3" fill="#f59e0b" />
                      <circle cx="165" cy="18" r="3" fill="#f59e0b" />
                      <circle cx="195" cy="12" r="3.5" fill="#f59e0b" />
                    </svg>
                  </div>

                  {/* Chart X-axis Day Labels */}
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium px-1 mt-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                  </div>

                  {/* Overlapping Orange Badge "39%" with Counting Animation */}
                  <div className="absolute -bottom-2 right-2 px-3.5 py-1.5 rounded-xl bg-[#ff4a22] text-white font-extrabold text-xs tracking-tight shadow-md flex items-center justify-center">
                    <AnimatedCounter
                      value={39}
                      suffix="%"
                      duration={1.5}
                      triggerRef={cardLeftRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT CARD (DEEP OBSIDIAN BENTO) ================= */}
          <div
            ref={cardRightRef}
            className="lg:col-span-5 bg-[#0e0f12] text-white rounded-[2.5rem] p-7 sm:p-10 border border-slate-800 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.4)] flex flex-col justify-between"
          >
            {/* Top Row: Two Squircle Tiles */}
            <div className="grid grid-cols-2 gap-4">
              {/* Squircle 1: 3D Gold Geometric Cube + 2 Avatars */}
              <div className="bg-[#18191f] rounded-3xl p-5 border border-white/[0.06] flex flex-col items-center justify-between min-h-[140px] shadow-inner">
                {/* 3D Geometric Gold Cube Icon */}
                <div className="w-11 h-11 flex items-center justify-center">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                    {/* Isometric Cube Layers */}
                    <path
                      d="M20 6 L32 13 L20 20 L8 13 Z"
                      fill="#f59e0b"
                      opacity="0.9"
                    />
                    <path
                      d="M8 13 L20 20 L20 34 L8 27 Z"
                      fill="#d97706"
                      opacity="0.8"
                    />
                    <path
                      d="M32 13 L20 20 L20 34 L32 27 Z"
                      fill="#b45309"
                      opacity="0.9"
                    />
                    <path
                      d="M20 10 L28 15 L20 20 L12 15 Z"
                      stroke="#fef08a"
                      strokeWidth="1.2"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Overlapping User Avatars */}
                <div className="flex -space-x-2.5 mt-3">
                  <div className="w-8 h-8 rounded-full ring-2 ring-[#18191f] overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    👨‍💼
                  </div>
                  <div className="w-8 h-8 rounded-full ring-2 ring-[#18191f] overflow-hidden bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    👩‍💼
                  </div>
                </div>
              </div>

              {/* Squircle 2: Transactions + 38K with 1, 2, 3... Counting Animation */}
              <div className="bg-[#18191f] rounded-3xl p-5 border border-white/[0.06] flex flex-col justify-between min-h-[140px] shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Transactions</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>

                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-auto">
                  <AnimatedCounter
                    value={38}
                    suffix="K"
                    duration={1.8}
                    triggerRef={cardRightRef}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Content: "Widget control" */}
            <div className="mt-8 pt-6">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2.5">
                Widget control
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Reports provide a comprehensive overview of important aspects of web analytics.
              </p>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM STAT ROW: "Up to 45%" with 1, 2, 3... Counting Animation ================= */}
        <div className="mt-14 pt-10 border-t border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: "Up to 45%" */}
          <div className="flex items-baseline gap-3 shrink-0">
            <span className="text-base sm:text-lg text-slate-500 font-semibold tracking-tight">
              Up to
            </span>
            <span
              ref={statNumberRef}
              className="text-6xl sm:text-8xl lg:text-[6.5rem] font-black text-[#111113] tracking-tighter leading-none"
            >
              <AnimatedCounter
                value={45}
                suffix="%"
                duration={1.8}
                triggerRef={statNumberRef}
              />
            </span>
          </div>

          {/* Right: Descriptive paragraph */}
          <div className="max-w-xl">
            <p className="text-xs sm:text-[13.5px] text-slate-600 leading-relaxed font-normal">
              Increase your analytics efficiency by up to 45%. Unique algorithms provide
              insights from data, reduce time for analysis and save time for making important,
              informed decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
