import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Navbar({ onOpenContact, onOpenAuth, onOpenDashboard, user }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Always visible at the top of the page
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (delta > 8 && currentScrollY > 80) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else if (delta < -8) {
        // Scrolling up -> show navbar smoothly
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : "-100%",
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-[#131418]/90 border-b border-white/[0.08] shadow-lg shadow-black/20 ${isVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with actual user asset */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center group cursor-pointer"
        >
          <img
            src="/ados-logo.png"
            alt="ADOS"
            className="h-7 sm:h-8.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
          />
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm lg:text-[14.5px] font-medium text-slate-300">
          {/* Dashboard link is ONLY shown when user is logged in */}
          {user && (
            <a
              href="#dashboard"
              onClick={(e) => {
                if (onOpenDashboard) {
                  e.preventDefault();
                  onOpenDashboard();
                }
              }}
              className="hover:text-white transition-colors flex items-center gap-1.5 hover:-translate-y-0.5 transform duration-150 font-bold text-white cursor-pointer"
            >
              Dashboard
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live
              </span>
            </a>
          )}
          <a
            href="#product"
            className="hover:text-white transition-colors hover:-translate-y-0.5 transform duration-150"
          >
            Product
          </a>
          <a
            href="#platforms"
            className="hover:text-white transition-colors flex items-center gap-1.5 hover:-translate-y-0.5 transform duration-150"
          >
            Platforms
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
              5+
            </span>
          </a>
          <a
            href="#solutions"
            className="hover:text-white transition-colors flex items-center gap-1 hover:-translate-y-0.5 transform duration-150"
          >
            Solutions
            <span className="text-[11px] text-slate-400 font-sans">ⓘ</span>
          </a>
          <a
            href="#results"
            className="hover:text-white transition-colors hover:-translate-y-0.5 transform duration-150"
          >
            Results
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors hover:-translate-y-0.5 transform duration-150"
          >
            About Us
          </a>
        </nav>

        {/* Right Actions: White pill Contact CTA + Language Switcher + Sign In / Dashboard */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          <Link
            to="/contact"
            onClick={onOpenContact}
            className="relative px-5 sm:px-5.5 py-2 rounded-full bg-white text-[#121316] text-xs sm:text-[13px] font-semibold tracking-wide shadow-sm hover:bg-slate-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Contact
          </Link>

          {/* Language Switcher */}
          <div className="hidden sm:flex items-center text-xs font-semibold text-slate-400 tracking-wider">
            <span className="text-white font-bold">EN</span>
            <span className="mx-1 text-white/20">/</span>
            <span className="hover:text-white cursor-pointer transition-colors">DE</span>
          </div>

          {/* If user is logged in: show Dashboard button */}
          {user ? (
            onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 cursor-pointer shadow-sm"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            )
          ) : (
            /* If user is NOT logged in: show Sign In button only */
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors px-3.5 py-1.5 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/[0.06] cursor-pointer"
              >
                Sign In
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
}
