import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ onOpenContact }) {
  const footerRef = useRef(null);
  const dividerRef = useRef(null);
  const emailRef = useRef(null);
  const adosLogoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Top row: Nav links & Giant email fade/slide up
      tl.fromTo(
        ".footer-nav-link",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
        0
      );

      tl.fromTo(
        emailRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.1
      );

      // 2. Divider line expands from left to right
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0.25
      );

      // 3. Middle row: Social links
      tl.fromTo(
        ".footer-social-link",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.09,
          ease: "power2.out",
        },
        0.45
      );

      // 4. Bottom row: Giant 'ADOS' wordmark letter-by-letter reveal
      const adosLetters = adosLogoRef.current?.querySelectorAll(".footer-ados-char");
      if (adosLetters && adosLetters.length > 0) {
        tl.fromTo(
          adosLetters,
          { y: "120%", opacity: 0, rotateX: -20 },
          {
            y: "0%",
            opacity: 1,
            rotateX: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.65
        );
      }

      // 5. Legal links bounce/fade in
      tl.fromTo(
        ".footer-legal-link",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        0.8
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#111113] text-white pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#ff4a22] selection:text-white"
    >
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* ================= ROW 1: TOP NAV LINKS & GIANT EMAIL ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 sm:pb-14">
          {/* Left: Nav Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-10 md:gap-12 text-sm sm:text-base md:text-[1.05rem] text-slate-300 font-medium">
            <a
              href="#about"
              className="footer-nav-link hover:text-white transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#why-us"
              className="footer-nav-link hover:text-white transition-colors duration-200"
            >
              Why Us
            </a>
            <a
              href="#platform"
              className="footer-nav-link hover:text-white transition-colors duration-200"
            >
              Platform
            </a>
            {/* <a
              href="#pricing"
              className="footer-nav-link hover:text-white transition-colors duration-200"
            >
              Pricing
            </a> */}
            <Link
              to="/contact"
              className="footer-nav-link hover:text-white transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Giant Email Link */}
          <div ref={emailRef} className="overflow-hidden">
            <a
              href="mailto:adoshub.online@gmail.com"
              className="group inline-flex items-center text-2xl sm:text-4xl md:text-5xl lg:text-[4.2rem] font-light text-white tracking-tight hover:text-[#ff5e3a] transition-colors duration-300"
            >
              <span>adoshub.online@gmail.com</span>
              <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ml-2 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#ff5e3a]" />
            </a>
          </div>
        </div>

        {/* ================= FULL-WIDTH HORIZONTAL DIVIDER ================= */}
        <div
          ref={dividerRef}
          className="w-full h-px bg-white/15 my-8 sm:my-12 lg:my-14 will-change-transform"
        />

        {/* ================= ROW 2: BRAND TAGLINE & SOCIAL MEDIA ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 py-4 sm:py-6">
          {/* Brand Tagline */}
          <div className="footer-social-link flex flex-col space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-[#ff5e3a]">
              Ad Operating System
            </span>
            <span className="text-xs sm:text-sm text-slate-400 font-light">
              Next-generation autonomous AI advertising platform
            </span>
          </div>

          {/* Social Links on Right */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link inline-flex items-center text-xs sm:text-sm text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/20 transition-all duration-200"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link inline-flex items-center text-xs sm:text-sm text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/20 transition-all duration-200"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link inline-flex items-center text-xs sm:text-sm text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/20 transition-all duration-200"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* ================= ROW 3: GIANT ADOS ® & LEGAL LINKS ================= */}
        <div className="pt-16 sm:pt-24 lg:pt-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Giant 'ADOS ®' Brand Wordmark (Matching Reference 'Ramos ®') */}
          <div
            ref={adosLogoRef}
            className="flex items-baseline select-none overflow-hidden"
          >
            <div className="flex items-baseline leading-none">
              {["A", "d", "o", "s"].map((char, i) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden"
                  style={{ verticalAlign: "bottom" }}
                >
                  <span className="footer-ados-char inline-block text-[4.5rem] sm:text-[7.5rem] md:text-[9.5rem] lg:text-[11.5rem] xl:text-[13.5rem] font-bold text-white tracking-[-0.04em] leading-none will-change-transform">
                    {char}
                  </span>
                </span>
              ))}
              <span
                className="inline-block overflow-hidden ml-1 sm:ml-2.5"
                style={{ verticalAlign: "top" }}
              >
                <span className="footer-ados-char inline-block text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-slate-300 will-change-transform">
                  ®
                </span>
              </span>
            </div>
          </div>

          {/* Legal & Compliance Section: Structured in 2 rows + Copyright */}
          <div className="flex flex-col items-start md:items-end gap-2.5 sm:gap-3 md:mb-4 lg:mb-6">
            {/* Row 1: [Privacy Policy] [Terms of Service] */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Link
                to="/privacy-policy"
                className="footer-legal-link px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="footer-legal-link px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                Terms of Service
              </Link>
            </div>

            {/* Row 2: [User Data Deletion] */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <Link
                to="/data-deletion"
                className="footer-legal-link px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                User Data Deletion
              </Link>
            </div>

            {/* Copyright & Attribution */}
            <div className="flex flex-col items-start md:items-end text-[11px] sm:text-xs text-slate-500 font-normal tracking-wide mt-2 space-y-0.5">
              <p className="footer-legal-link">
                © {new Date().getFullYear()} IDR TECH. All rights reserved.
              </p>
              <p className="footer-legal-link text-slate-400 font-medium">
                Powered by IDR TECH
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

