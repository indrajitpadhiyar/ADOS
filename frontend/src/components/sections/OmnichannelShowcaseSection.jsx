import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, TrendingUp, BarChart2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Helper component that splits words and letters into masked overflow-hidden containers
function AnimatedWord({ word, className = "" }) {
  return (
    <span className={`inline-flex whitespace-nowrap overflow-hidden align-baseline ${className}`}>
      {word.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-baseline py-1 -my-1"
        >
          <span className="char-item inline-block will-change-transform leading-none">
            {char}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function OmnichannelShowcaseSection() {
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const badge1Ref = useRef(null);
  const badge2Ref = useRef(null);
  const badge3Ref = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const allChars = textContainerRef.current?.querySelectorAll(".char-item");
      const badges = [badge1Ref.current, badge2Ref.current, badge3Ref.current].filter(Boolean);

      // Main Letter-by-letter animation coming one-by-one from bottom to top in masked area
      if (allChars && allChars.length > 0) {
        gsap.fromTo(
          allChars,
          {
            y: "140%",
            opacity: 0,
            rotateX: -40,
            filter: "blur(2px)",
          },
          {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.022, // letter-by-letter sequential reveal
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Badges animation: rising from bottom with subtle bounce
      if (badges.length > 0) {
        gsap.fromTo(
          badges,
          {
            y: "130%",
            scale: 0.7,
            opacity: 0,
          },
          {
            y: "0%",
            scale: 1,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Paragraph fade up
      if (paragraphRef.current) {
        gsap.fromTo(
          paragraphRef.current,
          {
            y: 35,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 md:py-44 bg-[#fafbfc] overflow-hidden border-t border-slate-200/60 flex flex-col items-center justify-center text-center"
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 flex flex-col items-center justify-center text-center">
        {/* Centered Headline with Letter-by-Letter Animation & Badges */}
        <div
          ref={textContainerRef}
          className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto select-none"
        >
          {/* Line 1: [⚡] [📈] Advertising */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] leading-[1.12]">
            {/* Round Icon 1: Soft grey badge with lightning */}
            <div className="inline-block overflow-hidden align-middle">
              <span
                ref={badge1Ref}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-slate-100 text-amber-500 shadow-sm border border-slate-200/80 transform hover:scale-110 transition-transform cursor-pointer will-change-transform"
              >
                <Zap className="w-6 h-6 sm:w-9 sm:h-9 fill-amber-400" />
              </span>
            </div>

            {/* Round Icon 2: Bright red/orange badge with trendline */}
            <div className="inline-block overflow-hidden align-middle">
              <span
                ref={badge2Ref}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#ff4a22] text-white shadow-md transform hover:scale-110 transition-transform cursor-pointer will-change-transform"
              >
                <TrendingUp className="w-6 h-6 sm:w-9 sm:h-9" />
              </span>
            </div>

            <AnimatedWord word="Advertising" />
          </div>

          {/* Line 2: that helps you */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] leading-[1.12] mt-2 sm:mt-4">
            <AnimatedWord word="that" />
            <AnimatedWord word="helps" />
            <AnimatedWord word="you" />
          </div>

          {/* Line 3: shape [🟡] the future */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[#111113] tracking-[-0.035em] leading-[1.12] mt-2 sm:mt-4">
            <AnimatedWord word="shape" />

            {/* Round Icon 3: Golden yellow badge with bar chart */}
            <div className="inline-block overflow-hidden align-middle">
              <span
                ref={badge3Ref}
                className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#ffca28] text-slate-900 shadow-md transform hover:scale-110 transition-transform cursor-pointer will-change-transform"
              >
                <BarChart2 className="w-6 h-6 sm:w-9 sm:h-9" />
              </span>
            </div>

            <AnimatedWord word="the" />
            <AnimatedWord word="future" />
          </div>
        </div>

        {/* Centered Descriptive Paragraph Below */}
        <div ref={paragraphRef} className="mt-10 sm:mt-14 max-w-2xl mx-auto text-center">
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Harness real-time multi-network intelligence. ADOS constantly recalibrates your
            spend across Meta, Google Ads, Amazon, YouTube, and LinkedIn to ensure every rupee captures
            the highest-yielding audience.
          </p>
        </div>
      </div>
    </section>
  );
}
