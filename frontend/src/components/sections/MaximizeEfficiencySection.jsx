import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Helper to render letter-by-letter with overflow hidden for down-to-up reveal
function renderDownToUpLetters(text, className = "") {
  return text.split(" ").map((word, wordIdx) => (
    <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.26em]">
      {word.split("").map((char, charIdx) => (
        <span
          key={charIdx}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: "bottom" }}
        >
          <span
            className={`down-up-char inline-block will-change-transform leading-none ${className}`}
            style={{ display: "inline-block" }}
          >
            {char}
          </span>
        </span>
      ))}
    </span>
  ));
}

// Helper to render letter-by-letter with overflow hidden for left-to-right reveal
function renderLeftToRightLetters(text, className = "") {
  return text.split(" ").map((word, wordIdx) => (
    <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.24em]">
      {word.split("").map((char, charIdx) => (
        <span
          key={charIdx}
          className="inline-block overflow-hidden"
          style={{ verticalAlign: "bottom" }}
        >
          <span
            className={`ltr-char inline-block will-change-transform leading-none ${className}`}
            style={{ display: "inline-block" }}
          >
            {char}
          </span>
        </span>
      ))}
    </span>
  ));
}

export default function MaximizeEfficiencySection({ onOpenContact, onOpenAuth }) {
  const containerRef = useRef(null);
  const badgesRef = useRef(null);
  const pillRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. "Maximize efficiency with our intuitive" - letter-by-letter down to up
      const downUpChars = containerRef.current.querySelectorAll(".down-up-char");
      if (downUpChars.length > 0) {
        tl.fromTo(
          downUpChars,
          {
            y: "135%",
            opacity: 0,
            rotateX: -25,
          },
          {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            duration: 0.65,
            stagger: 0.02, // Letter-by-letter sequence from down to up!
            ease: "power3.out",
          },
          0
        );
      }

      // 2. Embedded badges pop & bounce in
      const badges = badgesRef.current?.querySelectorAll(".badge-item");
      if (badges && badges.length > 0) {
        tl.fromTo(
          badges,
          { scale: 0.4, opacity: 0, rotate: -15 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.55,
            stagger: 0.12,
            ease: "back.out(2)",
          },
          0.38
        );
      }

      // 3. "advertising suite" yellow capsule background animated LEFT TO RIGHT
      if (pillRef.current) {
        tl.fromTo(
          pillRef.current,
          {
            clipPath: "inset(0 100% 0 0 round 9999px)",
            opacity: 1,
          },
          {
            clipPath: "inset(0 0% 0 0 round 9999px)",
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
          },
          0.52
        );
      }

      // 4. "advertising suite" text animated LEFT TO RIGHT letter by letter
      const ltrChars = containerRef.current.querySelectorAll(".ltr-char");
      if (ltrChars.length > 0) {
        tl.fromTo(
          ltrChars,
          {
            x: -35,
            opacity: 0,
            scale: 0.8,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.032, // Sequential letter-by-letter reveal from left to right!
            ease: "power2.out",
          },
          0.62
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-white overflow-hidden border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Main Display Headline (Matching Frame 4) */}
        <div className="max-w-5xl">
          {/* Line 1: Maximize efficiency (letter-by-letter down to up) */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] leading-[1.08]">
            {renderDownToUpLetters("Maximize efficiency")}
          </h2>

          {/* Line 2: with our intuitive (letter-by-letter down to up) */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] leading-[1.08] mt-1 sm:mt-2">
            {renderDownToUpLetters("with our intuitive")}
          </h2>

          {/* Line 3 with embedded badges & elongated pill (Exact Match to Video Frame 4) */}
          <div
            ref={badgesRef}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 sm:mt-6"
          >
            {/* Soft Circle Badge with Red Trendline */}
            <div className="badge-item w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-slate-100 flex items-center justify-center shadow-xs border border-slate-200/80 hover:scale-105 transition-transform will-change-transform">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ff4a22] text-white flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Yellow Circle Badge with +30% */}
            <div className="badge-item w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#ffca28] text-slate-950 flex flex-col items-center justify-center shadow-md p-1 hover:scale-105 transition-transform will-change-transform">
              <span className="text-xs sm:text-base font-black leading-none">+30%</span>
              <span className="text-[7px] sm:text-[9px] font-semibold text-center leading-tight mt-0.5 max-w-[60px]">
                speed up your scaling
              </span>
            </div>

            {/* Elongated Yellow Capsule Pill with Left-to-Right Animated Background & Letter-by-Letter Text */}
            <div
              ref={pillRef}
              className="px-6 sm:px-10 py-3 sm:py-5 rounded-full bg-[#ffca28] text-slate-950 font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight shadow-md flex items-center will-change-transform"
              style={{
                clipPath: "inset(0 0% 0 0 round 9999px)",
              }}
            >
              {renderLeftToRightLetters("advertising suite")}
            </div>
          </div>
        </div>

        {/* Subtitle Description & Action Buttons (Matching Frame 4) */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal">
              Explore traffic sources, cross-network conversions, audience fatigue, and autonomous ROAS
              optimization to gain deep insight into your ad performance. With ADOS, your business doesn't
              just adapt — it leads.
            </p>
          </div>

          {/* Action Button: Start for free */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenContact}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-[#ff4a22] hover:bg-[#e03a14] text-white text-xs sm:text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Start for free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

