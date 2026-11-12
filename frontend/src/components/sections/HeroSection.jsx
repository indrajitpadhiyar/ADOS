import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import PlatformLogo from "../common/PlatformLogo";

export default function HeroSection({ onOpenContact }) {
  const heroRef = useRef(null);
  const auroraLeftRef = useRef(null);
  const auroraRightRef = useRef(null);
  const auroraCenterRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);

  // Smooth & gentle ambient floating animation for the bottom aurora mesh
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(auroraLeftRef.current, {
        x: "+=35",
        y: "-=25",
        scale: 1.1,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(auroraRightRef.current, {
        x: "-=40",
        y: "+=30",
        scale: 1.12,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(auroraCenterRef.current, {
        y: "-=20",
        scale: 1.08,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Background Ambient Aurora Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        {/* Warm Amber / Tangerine Glow on the Bottom-Left */}
        <div
          ref={auroraLeftRef}
          className="absolute -bottom-24 -left-20 w-[420px] sm:w-[600px] md:w-[780px] h-[380px] sm:h-[500px] md:h-[620px] rounded-full bg-gradient-to-tr from-[#fbbf24] via-[#f97316] to-[#fb7185] opacity-40 sm:opacity-55 filter blur-[90px] sm:blur-[130px] mix-blend-multiply will-change-transform"
        />

        {/* Soft Rose / Peach Transition in the Center */}
        <div
          ref={auroraCenterRef}
          className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-[380px] sm:w-[560px] md:w-[720px] h-[340px] sm:h-[460px] md:h-[560px] rounded-full bg-gradient-to-t from-[#f43f5e] via-[#fb7185] to-[#fbcfe8] opacity-30 sm:opacity-45 filter blur-[95px] sm:blur-[135px] mix-blend-multiply will-change-transform"
        />

        {/* Electric Sky Blue / Vivid Cyan Glow on the Bottom-Right */}
        <div
          ref={auroraRightRef}
          className="absolute -bottom-20 -right-20 w-[420px] sm:w-[620px] md:w-[820px] h-[380px] sm:h-[520px] md:h-[640px] rounded-full bg-gradient-to-tl from-[#06b6d4] via-[#38bdf8] to-[#60a5fa] opacity-40 sm:opacity-55 filter blur-[90px] sm:blur-[130px] mix-blend-multiply will-change-transform"
        />

        {/* Subtle Canvas Dot Grid for depth */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Center Main Text Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 text-center flex flex-col items-center my-auto">
        {/* Eyebrow / Subtitle above mega title */}
        <motion.p
          ref={subtitleRef}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-base sm:text-xl md:text-2xl font-normal text-slate-800 tracking-tight mb-2 sm:mb-3"
        >
          Improve your
        </motion.p>

        {/* Mega Display Headline: "Advertising with AI" */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center w-full"
        >
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-[7.25rem] font-bold text-[#111113] tracking-[-0.04em] leading-[1.05] sm:leading-[1] select-none break-words text-center">
            Advertising
          </h1>
          <span className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] mt-1 sm:mt-2 text-center">
            with AI
          </span>
        </motion.div>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 sm:mt-8 max-w-xl sm:max-w-2xl text-xs sm:text-base md:text-[17px] text-slate-700 leading-relaxed font-normal px-2 sm:px-0"
        >
          Tailored digital solutions for high-growth modern brands. Create one ad
          creative and seamlessly launch, optimize, and scale campaigns across Meta,
          Google, Amazon, YouTube, and LinkedIn simultaneously.
        </motion.p>

        {/* Center Dark Pill Button: "Contact" / "Launch Campaign" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 sm:mt-9 flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full xs:w-auto"
        >
          <button
            onClick={onOpenContact}
            className="w-full xs:w-auto justify-center group relative px-8 sm:px-9 py-3 sm:py-3.5 rounded-full bg-[#111113] text-white text-sm sm:text-[15px] font-semibold tracking-wide shadow-md hover:bg-black hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <span>Contact</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </button>

          <a
            href="#interactive-demo"
            className="w-full xs:w-auto justify-center px-6 py-3 sm:py-3.5 rounded-full bg-white/80 hover:bg-white text-slate-800 text-sm sm:text-[15px] font-semibold border border-slate-200/90 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
          >
            <span>Try Simulator</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom Platform Logos Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-12 sm:mt-16"
      >
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 pt-6 border-t border-slate-900/[0.06]">
          {/* Meta */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="meta" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">Meta Ads</span>
          </div>

          {/* Google */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="google" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">Google Ads</span>
          </div>

          {/* Amazon */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="amazon" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">Amazon DSP</span>
          </div>

          {/* YouTube */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="youtube" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">YouTube Ads</span>
          </div>

          {/* LinkedIn */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="linkedin" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">LinkedIn Ads</span>
          </div>

          {/* Pinterest */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="pinterest" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">Pinterest Ads</span>
          </div>

          {/* Snapchat */}
          <div className="flex items-center gap-2.5 text-slate-800 hover:text-black transition-all duration-200 group cursor-pointer hover:scale-105">
            <PlatformLogo platform="snapchat" size="sm" />
            <span className="font-bold text-sm tracking-tight text-slate-800">Snapchat Ads</span>
          </div>
        </div>
      </motion.div>

      {/* ================= REFINED SLIM BOTTOM BLUR FADE (DECREASED HEIGHT) ================= */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-10 sm:h-14 z-20 overflow-hidden">
        {/* Delicate Progressive Blur */}
        <div className="w-full h-full backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,transparent,black)]" />
        {/* Delicate Gradient Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafbfc] to-transparent" />
      </div>
    </section>
  );
}
