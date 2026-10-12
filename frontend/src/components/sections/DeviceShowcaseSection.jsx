import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Plus,
  Minus,
  Search,
  Bell,
  Menu,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DeviceShowcaseSection() {
  const containerRef = useRef(null);
  const phoneRef = useRef(null);
  const tabletRef = useRef(null);
  const bigBrandRef = useRef(null);

  // Active accordion on the left
  const [activeAccordion, setActiveAccordion] = useState(0);

  const accordionItems = [
    {
      title: "Instant Insights",
      description:
        "Real-time predictive attribution tracking across Meta, Google Ads, and LinkedIn with zero conversion delay.",
    },
    {
      title: "AI technology",
      description:
        "Autonomous budget shifting moves spend to the ad set generating the lowest CPA in sub-second intervals.",
    },
    {
      title: "Easy integration",
      description:
        "Connect your ad accounts in 1-click via official verified APIs. No complex pixel scripts or engineering required.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. One-by-one DOWN-TO-TOP ScrollTrigger animation for 'A', 'D', 'O', 'S' behind the phone
      const letters = bigBrandRef.current?.querySelectorAll(".ados-letter");
      if (letters && letters.length > 0) {
        gsap.fromTo(
          letters,
          {
            y: "140%", // starts below mask (down)
            opacity: 0,
            rotateX: -25,
          },
          {
            y: "0%", // rises up to top position
            opacity: 1,
            rotateX: 0,
            duration: 0.95,
            stagger: 0.16, // letter-by-letter sequence
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Phone and tablet are STATIC as requested - no parallax scroll animation
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Architectural Bar Chart Data for Tablet
  const tabletBarsBack = [45, 55, 68, 85, 95, 115, 100, 118, 90, 75, 85, 92, 105, 95, 80];
  const tabletBarsFront = [35, 42, 58, 76, 88, 108, 92, 110, 80, 65, 72, 82, 95, 86, 70];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 sm:py-32 lg:py-36 bg-[#f8f9fb] overflow-hidden border-t border-slate-200/70 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* Background Subtle Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        {/* ================= TOP TWO-COLUMN LAYOUT: CONTENT + DEVICES ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* ================= LEFT COLUMN: TITLE & 3 ACCORDION PILLS ================= */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center">
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#111113] tracking-tight leading-[1.12]">
                Turning data into real
                <br />
                actions and ideas.
              </h2>

              {/* Three Pill Capsule Accordion Buttons */}
              <div className="space-y-4 pt-4 max-w-sm sm:max-w-md">
                {accordionItems.map((item, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                        className="w-full px-7 py-4.5 flex items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base hover:text-black cursor-pointer"
                      >
                        <span className="tracking-tight">{item.title}</span>
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-black transition-transform duration-200 shrink-0">
                          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="px-7 pb-4 pt-1 text-xs sm:text-[13px] text-slate-500 leading-relaxed border-t border-slate-100">
                              {item.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: STATIC PHONE & TABLET WITH ADOS BEHIND PHONE ================= */}
          <div className="lg:col-span-7 xl:col-span-8 relative flex items-center justify-end min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] xl:min-h-[820px] overflow-visible">
            {/* ================= GIANT 'ADOS' BEHIND THE PHONE (LIGHT COLOR, LETTER-BY-LETTER DOWN-TO-TOP) ================= */}
            <div
              ref={bigBrandRef}
              className="absolute -bottom-4 sm:-bottom-8 lg:-bottom-10 left-[-4%] sm:left-[0%] lg:left-[-14%] xl:left-[-10%] z-10 select-none pointer-events-none"
            >
              <div className="flex items-center gap-1 sm:gap-2.5 md:gap-4 tracking-tighter">
                {["A", "D", "O", "S"].map((char, i) => (
                  <span
                    key={i}
                    className="inline-block overflow-hidden py-1"
                    style={{ verticalAlign: "bottom" }}
                  >
                    <span className="ados-letter inline-block text-[7.5rem] sm:text-[10rem] md:text-[12.5rem] lg:text-[14.5rem] xl:text-[17rem] font-black text-[#ff7043]/50 sm:text-[#ff7043]/55 lg:text-[#ff7043]/60 leading-none tracking-tighter will-change-transform">
                      {char}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* ================= TABLET MOCKUP (STATIC, 80% VISIBLE, SHIFTED RIGHT) ================= */}
            <div
              ref={tabletRef}
              className="w-full max-w-[760px] lg:max-w-[840px] xl:max-w-[940px] 2xl:max-w-[1020px] bg-[#111113] rounded-[2.6rem] p-3 sm:p-4 shadow-[0_35px_90px_-20px_rgba(0,0,0,0.32)] border-[4.5px] border-[#18191d] relative z-10 -translate-y-6 sm:-translate-y-10 lg:-translate-y-12 translate-x-8 sm:translate-x-16 lg:translate-x-24 xl:translate-x-32"
            >
              {/* Tablet Screen Surface */}
              <div className="bg-[#fcfdfd] rounded-[2.1rem] overflow-hidden text-slate-900 shadow-inner">
                {/* Top Dark Header Bar */}
                <div className="bg-[#111113] text-white px-5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-tight">
                      <span className="w-2 h-2 rounded-full bg-[#ff4a22]" />
                      ados
                    </div>
                  </div>

                  {/* Search Bar & Profile */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-xs text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-[10px] font-bold flex items-center justify-center text-white">
                      JD
                    </div>
                  </div>
                </div>

                {/* Tablet Main Canvas */}
                <div className="p-5 sm:p-7">
                  {/* Top Row: Revenue Metric + Tall Architectural Stepped Orange Bars */}
                  <div className="grid grid-cols-12 gap-4 sm:gap-6 items-end pb-5 sm:pb-6">
                    {/* Left: Revenue Stat */}
                    <div className="col-span-5 sm:col-span-4">
                      <div className="text-[11px] sm:text-xs text-slate-400 font-semibold mb-1">
                        Revenue amount
                      </div>
                      <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1.5 sm:gap-2">
                        ₹ 1,342,567
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          +18%
                        </span>
                      </div>
                    </div>

                    {/* Right: Architectural 3D Orange Stepped Pill Bars */}
                    <div className="col-span-7 sm:col-span-8 relative h-32 sm:h-40 flex items-end justify-end gap-1.5 sm:gap-2.5">
                      {/* Back Layer of soft grey bars */}
                      <div className="absolute inset-0 flex items-end justify-end gap-1.5 sm:gap-2.5 pointer-events-none opacity-40">
                        {tabletBarsBack.map((h, i) => (
                          <div
                            key={`back-${i}`}
                            className="w-3.5 sm:w-5 bg-slate-300 rounded-t-2xl"
                            style={{ height: `${(h / 120) * 100}%` }}
                          />
                        ))}
                      </div>

                      {/* Front Layer of vibrant red-orange bars */}
                      {tabletBarsFront.map((h, i) => (
                        <div
                          key={`front-${i}`}
                          className="relative z-10 w-3.5 sm:w-5 bg-[#ff4a22] rounded-t-2xl shadow-xs transition-all hover:brightness-110"
                          style={{ height: `${(h / 120) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Middle Navigation Tabs (Dashboard, Reports, Documents...) */}
                  <div className="flex items-center gap-2 border-y border-slate-100 py-3 my-2 overflow-x-auto text-[11px] sm:text-xs font-semibold text-slate-500">
                    <span className="px-4 sm:px-5 py-1.5 rounded-full bg-slate-900 text-white font-bold shadow-xs">
                      Dashboard
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 rounded-full hover:bg-slate-100 hover:text-black cursor-pointer">
                      Reports
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 rounded-full hover:bg-slate-100 hover:text-black cursor-pointer">
                      Documents
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 rounded-full hover:bg-slate-100 hover:text-black cursor-pointer">
                      History
                    </span>
                    <span className="px-3 sm:px-4 py-1.5 rounded-full hover:bg-slate-100 hover:text-black cursor-pointer">
                      Settings
                    </span>
                  </div>

                  {/* Bottom Grid: 4 Metric Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3">
                    {/* Card 1: Total Profit */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100">
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">Total profit</div>
                      <div className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 mt-1">
                        ₹ 264.2K
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[27%]" />
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 font-medium">27% / ₹71.2K</div>
                    </div>

                    {/* Card 2: Sales Revenue */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#ffc83b] flex items-center justify-center text-[9px] font-bold">
                          ⚡
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">Sales revenue</span>
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 mt-1">
                        ₹ 132.4K
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[80%]" />
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 font-medium">80% / ₹160K</div>
                    </div>

                    {/* Card 3: Average Bill */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold">
                          ✓
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">Average bill</span>
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 mt-1">
                        ₹ 1,090
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-emerald-600 font-bold mt-2">
                        +14% vs last week
                      </div>
                    </div>

                    {/* Card 4: Visit Statistics Line Graph */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold">Visit statistics</div>
                      <svg className="w-full h-8 sm:h-10 overflow-visible mt-1.5" viewBox="0 0 100 30">
                        <path
                          d="M 5,25 Q 25,28 45,18 T 75,12 T 95,6"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="5" cy="25" r="2.5" fill="#f59e0b" />
                        <circle cx="45" cy="18" r="2.5" fill="#f59e0b" />
                        <circle cx="75" cy="12" r="2.5" fill="#f59e0b" />
                        <circle cx="95" cy="6" r="3" fill="#f59e0b" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= PHONE MOCKUP (STATIC, IN FRONT OF ADOS, SLIM BEZEL) ================= */}
            <div
              ref={phoneRef}
              className="absolute left-2 sm:left-6 lg:-left-2 xl:left-4 top-1/2 -translate-y-[45%] w-[290px] sm:w-[325px] xl:w-[345px] h-[610px] sm:h-[660px] xl:h-[690px] bg-[#111113] rounded-[2.6rem] sm:rounded-[2.9rem] p-2 shadow-[0_45px_100px_-20px_rgba(0,0,0,0.45)] border-[2.5px] border-[#22242a] z-20 flex flex-col justify-between"
            >
              {/* Dynamic Island Notch (Ultra-Slim) */}
              <div className="w-22 h-3.5 bg-black rounded-full mx-auto mb-1 flex items-center justify-end pr-2.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Phone Screen Canvas (Slim Bezel, Clean Border) */}
              <div className="bg-[#fcfdfd] rounded-[2.3rem] p-3.5 sm:p-4 text-slate-900 shadow-inner flex-1 flex flex-col justify-between overflow-hidden">
                {/* Phone Top Header */}
                <div className="flex items-center justify-between pb-1.5 text-slate-700">
                  <Menu className="w-4 h-4 cursor-pointer" />
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                    Revenue amount
                  </span>
                  <Bell className="w-4 h-4 cursor-pointer" />
                </div>

                {/* Big Metric */}
                <div className="text-center py-1">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                    ₹ 1,342,567
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      +18%
                    </span>
                  </div>
                </div>

                {/* Stepped Red-Orange Bars in Phone */}
                <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-20 sm:h-22 py-1.5 my-1 bg-slate-50 rounded-2xl px-2.5 border border-slate-100 shrink-0">
                  {[30, 45, 65, 52, 82, 100, 75, 90, 105, 68].map((h, i) => (
                    <div
                      key={`phone-bar-${i}`}
                      className="flex-1 bg-[#ff4a22] rounded-t-sm shadow-xs"
                      style={{ height: `${(h / 105) * 100}%` }}
                    />
                  ))}
                </div>

                {/* "Data report" Section */}
                <div className="space-y-1.5 mt-0.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">Data report</span>
                    <span className="text-[10px] text-slate-400 font-semibold cursor-pointer">
                      View all ›
                    </span>
                  </div>

                  {/* Two Mini Pills: Profit & Revenue */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#ff4a22] text-white flex items-center justify-center text-[8.5px] font-bold">
                          ✓
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">Total profit</span>
                      </div>
                      <div className="text-xs sm:text-[13px] font-extrabold text-slate-900 mt-0.5">₹ 264.2K</div>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#ffc83b] text-slate-900 flex items-center justify-center text-[8.5px] font-bold">
                          ⚡
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold">Sales revenue</span>
                      </div>
                      <div className="text-xs sm:text-[13px] font-extrabold text-slate-900 mt-0.5">₹ 132.4K</div>
                    </div>
                  </div>

                  {/* Sales statistics colorful bars + Transactions 242.2K */}
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-400 font-semibold mb-1">Sales statistics</div>
                      <div className="flex items-end gap-1.5 h-8">
                        {[20, 32, 24, 38, 28, 40].map((v, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 rounded-t-xs ${
                              idx % 2 === 0 ? "bg-indigo-600" : "bg-[#ffc83b]"
                            }`}
                            style={{ height: `${(v / 40) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[9px] text-slate-400 font-semibold">Transactions</div>
                      <div className="text-xs sm:text-[13px] font-black text-slate-900 mt-0.5">242.2K</div>
                      <span className="inline-block text-[8px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 mt-0.5">
                        -48%
                      </span>
                    </div>
                  </div>

                  {/* Visit Statistics with Visitors 56K + 39% Badge */}
                  <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-400 font-semibold">Visitors</div>
                      <div className="text-xs sm:text-[13px] font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                        56K
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-xl bg-[#ff4a22] text-white text-[10.5px] font-black shadow-xs">
                      39%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

