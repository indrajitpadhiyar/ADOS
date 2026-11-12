import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, ExternalLink } from "lucide-react";

export default function Navbar({ onOpenContact, onOpenAuth, onOpenDashboard, user }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Close mobile menu on scroll
      if (Math.abs(delta) > 15) {
        setIsMobileMenuOpen(false);
      }

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

  const handleMobileNavClick = (callback) => {
    setIsMobileMenuOpen(false);
    if (callback) callback();
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => {
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center group cursor-pointer shrink-0"
        >
          <img
            src="/ados-logo.png"
            alt="ADOS"
            className="h-7 sm:h-8.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
          />
        </div>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-[14.5px] font-medium text-slate-300">
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

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/contact"
            onClick={onOpenContact}
            className="hidden xs:inline-flex relative px-4 sm:px-5.5 py-1.5 sm:py-2 rounded-full bg-white text-[#121316] text-xs sm:text-[13px] font-semibold tracking-wide shadow-sm hover:bg-slate-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Contact
          </Link>

          {/* Language Switcher (Desktop) */}
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
                className="inline-flex items-center gap-2 text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 cursor-pointer shadow-sm"
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
            /* If user is NOT logged in: show Sign In button */
            onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-colors px-3 sm:px-3.5 py-1.5 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/[0.08] cursor-pointer"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#131418] border-b border-white/10 px-5 pt-3 pb-6 space-y-3 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-1 pt-2">
              {user && (
                <a
                  href="#dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMobileNavClick(onOpenDashboard);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Dashboard Cockpit</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </a>
              )}

              <a
                href="#product"
                onClick={() => handleMobileNavClick()}
                className="px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
              >
                Product
              </a>
              <a
                href="#platforms"
                onClick={() => handleMobileNavClick()}
                className="px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors flex items-center justify-between"
              >
                <span>Platforms</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                  5+ Networks
                </span>
              </a>
              <a
                href="#solutions"
                onClick={() => handleMobileNavClick()}
                className="px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
              >
                Solutions
              </a>
              <a
                href="#results"
                onClick={() => handleMobileNavClick()}
                className="px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
              >
                Results
              </a>
              <a
                href="#about"
                onClick={() => handleMobileNavClick()}
                className="px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
              >
                About Us
              </a>
              <Link
                to="/contact"
                onClick={() => handleMobileNavClick(onOpenContact)}
                className="px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
              >
                Contact & Support
              </Link>
            </div>

            {/* Mobile Actions: Contact Pill & Sign In */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                to="/contact"
                onClick={() => handleMobileNavClick(onOpenContact)}
                className="w-full py-2.5 rounded-xl bg-white text-[#121316] font-bold text-center text-xs shadow-sm hover:bg-slate-100 transition-colors"
              >
                Contact Sales & Support
              </Link>

              {!user && onOpenAuth && (
                <button
                  type="button"
                  onClick={() => handleMobileNavClick(onOpenAuth)}
                  className="w-full py-2.5 rounded-xl border border-white/20 text-white font-bold text-center text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Sign In to ADOS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
