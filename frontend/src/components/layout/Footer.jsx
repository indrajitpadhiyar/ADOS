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
  const qrRef = useRef(null);

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

      // 3. Middle row: Office addresses & Social links
      tl.fromTo(
        ".footer-office-col",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
        },
        0.45
      );

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
        0.5
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

      // 5. Legal links and QR Code bounce in
      tl.fromTo(
        ".footer-legal-link",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        0.8
      );

      if (qrRef.current) {
        tl.fromTo(
          qrRef.current,
          { scale: 0.6, opacity: 0, rotate: -8 },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(2)",
          },
          0.75
        );
      }
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
            <a
              href="#pricing"
              className="footer-nav-link hover:text-white transition-colors duration-200"
            >
              Pricing
            </a>
            <button
              onClick={onOpenContact}
              className="footer-nav-link hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Contacts
            </button>
          </nav>

          {/* Right: Giant Email Link */}
          <div ref={emailRef} className="overflow-hidden">
            <a
              href="mailto:hello@ados.com"
              className="group inline-flex items-center text-3xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-light text-white tracking-tight hover:text-[#ff5e3a] transition-colors duration-300"
            >
              <span>hello@ados.com</span>
              <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ml-2 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-[#ff5e3a]" />
            </a>
          </div>
        </div>

        {/* ================= FULL-WIDTH HORIZONTAL DIVIDER ================= */}
        <div
          ref={dividerRef}
          className="w-full h-px bg-white/15 my-8 sm:my-12 lg:my-14 will-change-transform"
        />

        {/* ================= ROW 2: OFFICE ADDRESSES & SOCIAL MEDIA ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start py-4 sm:py-6">
          {/* Office 1: Raleigh */}
          <div className="footer-office-col md:col-span-4 lg:col-span-3 space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">Raleigh</h4>
            <div className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed space-y-0.5">
              <p>125 N. Harrington Street Raleigh,</p>
              <p>NC 27603 919.833.6413</p>
            </div>
          </div>

          {/* Office 2: Charlotte */}
          <div className="footer-office-col md:col-span-4 lg:col-span-3 space-y-2">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">Charlotte</h4>
            <div className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed space-y-0.5">
              <p>220 East Peterson Drive Charlotte,</p>
              <p>NC 28217 704.333.7272</p>
            </div>
          </div>

          {/* Social Links on Right */}
          <div className="md:col-span-4 lg:col-span-6 flex flex-col md:items-end justify-start space-y-2 sm:space-y-2.5">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link text-sm sm:text-base text-slate-300 hover:text-white transition-colors duration-200 inline-block"
            >
              Linkedin
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link text-sm sm:text-base text-slate-300 hover:text-white transition-colors duration-200 inline-block"
            >
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link text-sm sm:text-base text-slate-300 hover:text-white transition-colors duration-200 inline-block"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* ================= ROW 3: GIANT ADOS ®, LEGAL LINKS & QR CODE ================= */}
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

          {/* Privacy Policy, Terms of Service & User Data Deletion in Middle-Right */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 text-xs sm:text-[13px] text-slate-400 font-medium md:mb-6">
            <Link
              to="/privacy-policy"
              className="footer-legal-link hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="footer-legal-link hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link
              to="/data-deletion"
              className="footer-legal-link hover:text-white transition-colors duration-200"
            >
              User Data Deletion
            </Link>
          </div>

          {/* White Rounded Square QR Code Badge (Exact Match to Video Screenshot) */}
          <div
            ref={qrRef}
            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl bg-white p-2 sm:p-2.5 flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform duration-300 cursor-pointer group md:mb-3"
            title="Scan to explore ADOS on Mobile"
          >
            {/* Crisp High-Res Vector QR Code */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-slate-950 group-hover:scale-[1.02] transition-transform"
              fill="currentColor"
            >
              {/* Outer Top-Left Finder */}
              <rect x="8" y="8" width="28" height="28" rx="4" fill="black" />
              <rect x="14" y="14" width="16" height="16" rx="2" fill="white" />
              <rect x="18" y="18" width="8" height="8" rx="1.5" fill="black" />

              {/* Outer Top-Right Finder */}
              <rect x="64" y="8" width="28" height="28" rx="4" fill="black" />
              <rect x="70" y="14" width="16" height="16" rx="2" fill="white" />
              <rect x="74" y="18" width="8" height="8" rx="1.5" fill="black" />

              {/* Outer Bottom-Left Finder */}
              <rect x="8" y="64" width="28" height="28" rx="4" fill="black" />
              <rect x="14" y="70" width="16" height="16" rx="2" fill="white" />
              <rect x="18" y="74" width="8" height="8" rx="1.5" fill="black" />

              {/* Micro Data Matrix Dots */}
              <rect x="42" y="12" width="6" height="6" rx="1" fill="black" />
              <rect x="52" y="12" width="6" height="6" rx="1" fill="black" />
              <rect x="42" y="24" width="6" height="6" rx="1" fill="black" />
              <rect x="52" y="28" width="6" height="6" rx="1" fill="black" />
              <rect x="42" y="38" width="6" height="6" rx="1" fill="black" />
              <rect x="52" y="44" width="6" height="6" rx="1" fill="black" />

              <rect x="12" y="44" width="6" height="6" rx="1" fill="black" />
              <rect x="22" y="44" width="6" height="6" rx="1" fill="black" />
              <rect x="32" y="44" width="6" height="6" rx="1" fill="black" />

              <rect x="68" y="42" width="6" height="6" rx="1" fill="black" />
              <rect x="80" y="44" width="6" height="6" rx="1" fill="black" />
              <rect x="74" y="52" width="6" height="6" rx="1" fill="black" />

              <rect x="42" y="58" width="6" height="6" rx="1" fill="black" />
              <rect x="52" y="66" width="6" height="6" rx="1" fill="black" />
              <rect x="42" y="76" width="6" height="6" rx="1" fill="black" />
              <rect x="52" y="82" width="6" height="6" rx="1" fill="black" />

              <rect x="66" y="68" width="6" height="6" rx="1" fill="black" />
              <rect x="76" y="68" width="6" height="6" rx="1" fill="black" />
              <rect x="86" y="68" width="6" height="6" rx="1" fill="black" />
              <rect x="70" y="78" width="6" height="6" rx="1" fill="black" />
              <rect x="82" y="80" width="6" height="6" rx="1" fill="black" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}

