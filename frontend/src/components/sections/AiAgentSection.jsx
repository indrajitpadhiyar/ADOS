import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Bot,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import agentImg from "../../assets/agent.png";
import PlatformLogo from "../common/PlatformLogo";

gsap.registerPlugin(ScrollTrigger);

export default function AiAgentSection({ onOpenContact, onOpenAuth }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const avatarWrapperRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text & Header Reveal
      gsap.fromTo(
        ".agent-text-item",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Avatar Entry Animation
      if (avatarWrapperRef.current) {
        gsap.fromTo(
          avatarWrapperRef.current,
          { scale: 0.85, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: avatarWrapperRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 3. Floating Telemetry Badges
      gsap.fromTo(
        ".agent-float-badge",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.65,
          stagger: 0.15,
          delay: 0.35,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: avatarWrapperRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSeeMore = () => {
    navigate("/agent");
  };

  return (
    <section
      id="ai-agent"
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 md:py-40 bg-white text-slate-900 overflow-hidden border-t border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* Background Subtle Gradient Blobs matching Agent colors */}
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-100/50 via-purple-100/40 to-orange-100/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[420px] h-[420px] bg-gradient-to-tr from-blue-100/40 to-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Grid Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          {/* ================= LEFT COLUMN: AGENT NAME, WORK PARAGRAPH & SEE MORE BUTTON ================= */}
          <div ref={contentRef} className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8">
            {/* Small Top Badge */}
            <div className="agent-text-item inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 text-xs font-bold uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <Bot className="w-4 h-4 text-[#ff4a22]" />
              <span>Autonomous AI Engine</span>
            </div>

            {/* 1. AGENT NAME */}
            <div className="agent-text-item space-y-2">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#111113] tracking-tight leading-[1.06]">
                ADOS Agent
              </h2>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff4a22] to-amber-500 bg-clip-text text-transparent">
                Your 24/7 Autonomous Ad Strategist
              </div>
            </div>

            {/* 2. AGENT WORK (SHORT PARAGRAPH) */}
            <p className="agent-text-item text-slate-600 text-base sm:text-lg md:text-[1.18rem] leading-relaxed max-w-xl font-normal">
              ADOS Agent lives inside your ad networks, continuously monitoring Meta, Google Ads, Amazon,
              LinkedIn, Pinterest, and YouTube in real time. It automatically shifts budget to winning creatives, detects ad fatigue
              before conversion costs spike, and executes sub-second bid adjustments with zero human lag.
            </p>

            {/* Key Value Points (Clean White Pills) */}
            <div className="agent-text-item grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Autonomous Cross-Channel Shifting</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Conversion Delay AI Guard</span>
              </div>
            </div>

            {/* Monitored Networks Ribbon with Original Logos */}
            <div className="agent-text-item flex flex-wrap items-center gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400">Live AI Routing:</span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "meta", label: "Meta Ads" },
                  { id: "google", label: "Google Ads" },
                  { id: "amazon", label: "Amazon DSP" },
                  { id: "youtube", label: "YouTube" },
                  { id: "linkedin", label: "LinkedIn" },
                  { id: "pinterest", label: "Pinterest" },
                  { id: "snapchat", label: "Snapchat" },
                ].map((net) => (
                  <div
                    key={net.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs hover:scale-105 transition-transform"
                    title={`${net.label} Monitored`}
                  >
                    <PlatformLogo platform={net.id} size="xs" />
                    <span className="text-[11px] font-extrabold text-slate-700">{net.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. BUTTON: "SEE MORE ABOUT THE AGENT" */}
            <div className="agent-text-item pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={handleSeeMore}
                className="px-8 py-4 rounded-full bg-[#111113] hover:bg-black text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2.5 cursor-pointer group"
              >
                <span>See more about the agent</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </button>

              <button
                onClick={onOpenContact}
                className="px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm sm:text-base tracking-wide transition-all cursor-pointer"
              >
                Book 1-on-1 Demo
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: 3D FLOATING AGENT AVATAR IN WHITE THEME ================= */}
          <div
            ref={avatarWrapperRef}
            className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px] lg:min-h-[600px]"
          >
            {/* Soft Ambient Light Halo Behind Agent */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full bg-gradient-to-tr from-cyan-200/35 via-purple-200/30 to-amber-200/35 blur-2xl" />
              <div className="w-[420px] sm:w-[520px] h-[420px] sm:h-[520px] rounded-full border border-slate-200/60" />
            </div>

            {/* Continuous Smooth Levitation of the 3D Agent Robot */}
            <motion.div
              animate={{
                y: [-12, 12, -12],
                rotate: [-1.5, 1.5, -1.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.14)] flex items-center justify-center"
            >
              <img
                src={agentImg}
                alt="ADOS Autonomous AI Agent"
                className="w-full h-auto object-contain select-none pointer-events-none transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Orbiting Telemetry Badge 1: Top Right ROAS Shift */}
            <div className="agent-float-badge absolute top-2 sm:top-10 right-1 sm:right-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center gap-2.5 sm:gap-3 max-w-[210px] sm:max-w-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shadow-xs shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  +38.4% ROAS
                  <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Auto
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                  <span>Shifted</span>
                  <PlatformLogo platform="meta" size="xs" />
                  <span className="text-slate-400">➔</span>
                  <PlatformLogo platform="google" size="xs" />
                  <span className="font-semibold text-slate-800">PMax</span>
                </div>
              </div>
            </div>

            {/* Orbiting Telemetry Badge 2: Bottom Left Creative Fatigue */}
            <div className="agent-float-badge absolute bottom-2 sm:bottom-10 left-1 sm:left-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center gap-2.5 sm:gap-3 max-w-[210px] sm:max-w-none">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#ff4a22] flex items-center justify-center font-black shadow-xs shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  Fatigue Guard
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500">Paused 4 Decayed Creatives</div>
              </div>
            </div>

            {/* Orbiting Telemetry Badge 3: Top Left Status Pulse (Hidden on tiny screens to avoid crowding) */}
            <div className="agent-float-badge hidden md:flex absolute top-16 sm:top-20 left-0 sm:-left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full px-3.5 py-1.5 shadow-sm items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-slate-700">14ms Inference Latency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
