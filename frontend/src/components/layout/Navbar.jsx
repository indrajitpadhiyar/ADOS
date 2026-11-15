import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Navbar({ onOpenContact, onOpenAuth, onOpenDashboard, user }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem("ados_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const handleAuth = () => {
    if (onOpenAuth) onOpenAuth();
    else navigate("/auth");
  };

  const handleDashboard = () => {
    if (onOpenDashboard) onOpenDashboard();
    else navigate("/dashboard");
  };

  const handleContact = () => {
    if (onOpenContact) onOpenContact();
    else navigate("/contact");
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      // Close mobile menu on significant scroll
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

  // Helper to test if a given path is currently active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: "Product", to: "/product" },
    {
      label: "Platforms",
      to: "/platforms",
      badge: "5+",
    },
    {
      label: "Solutions",
      to: "/solutions",
    },
    {
      label: "Results",
      to: "/results",
    },
    {
      label: "About Us",
      to: "/about",
    },
  ];

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
      className={`fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-[#131418]/90 border-b border-white/[0.08] shadow-lg shadow-black/20 ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo - Links to Home and scrolls to top */}
        <Link
          to="/"
          onClick={() => {
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center group cursor-pointer shrink-0"
          title="ADOS - Ad Operating System"
        >
          <img
            src="/ados-logo.png"
            alt="ADOS"
            className="h-7 sm:h-8.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
          />
        </Link>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm lg:text-[14.5px] font-medium text-slate-300">
          {/* Dashboard link is ONLY shown when user is logged in */}
          {currentUser && (
            <button
              type="button"
              onClick={handleDashboard}
              className={`transition-all duration-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer font-bold ${
                isActive("/dashboard")
                  ? "text-white bg-white/15 border border-white/20 shadow-inner"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <span>Dashboard</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live
              </span>
            </button>
          )}

          {navLinks.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`transition-all duration-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? "text-white bg-white/15 border border-white/20 shadow-inner font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.08] hover:-translate-y-0.5"
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                      active
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-white/10 text-slate-300 border-white/10"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/contact"
            onClick={handleContact}
            className={`hidden xs:inline-flex relative px-4 sm:px-5.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-semibold tracking-wide shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
              isActive("/contact")
                ? "bg-amber-400 text-black font-bold ring-2 ring-white/30"
                : "bg-white text-[#121316] hover:bg-slate-100"
            }`}
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
          {currentUser ? (
            <button
              onClick={handleDashboard}
              type="button"
              className="inline-flex items-center gap-2 text-xs font-bold px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all hover:scale-105 cursor-pointer shadow-sm"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name || "User"}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          ) : (
            /* If user is NOT logged in: show Sign In button */
            <button
              onClick={handleAuth}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-colors px-3 sm:px-3.5 py-1.5 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/[0.08] cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboard();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Dashboard Cockpit</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              )}

              {navLinks.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      active
                        ? "bg-white/15 text-white font-bold border border-white/20"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                to="/contact"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleContact();
                }}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/contact")
                    ? "bg-white/15 text-white font-bold border border-white/20"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                Contact & Support
              </Link>
            </div>

            {/* Mobile Actions: Contact Pill & Sign In */}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                to="/contact"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleContact();
                }}
                className="w-full py-2.5 rounded-xl bg-white text-[#121316] font-bold text-center text-xs shadow-sm hover:bg-slate-100 transition-colors"
              >
                Contact Sales & Support
              </Link>

              {!currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleAuth();
                  }}
                  className="w-full py-2.5 rounded-xl border border-white/20 text-white font-bold text-center text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Sign In to ADOS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboard();
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Open Cockpit Dashboard</span>
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
