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
    {
      label: "Platforms",
      to: "/platforms",
      badge: "5+",
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
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Full-width Light Theme Frosted Glass Navbar */}
      <div className="relative w-full rounded-none backdrop-blur-2xl backdrop-saturate-150 bg-white/80 border-b border-slate-200/80 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)]">
        {/* Subtle Top Ambient Sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative z-10">
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
              src="/ados-logo-dark.png"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/ados-logo.png";
                e.currentTarget.classList.add("brightness-0");
              }}
              alt="ADOS"
              className="h-6 sm:h-7.5 w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-xs sm:text-[13.5px] font-semibold text-slate-600">
            {/* Dashboard link is ONLY shown when user is logged in */}
            {currentUser && (
              <button
                type="button"
                onClick={handleDashboard}
                className={`relative transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer font-bold ${
                  isActive("/dashboard")
                    ? "text-[#0f172a]"
                    : "text-slate-600 hover:text-[#0f172a] hover:bg-slate-100/70"
                }`}
              >
                {isActive("/dashboard") && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-slate-900/[0.06] border border-slate-900/10 rounded-full shadow-2xs backdrop-blur-xs"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Dashboard</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    Live
                  </span>
                </span>
              </button>
            )}

            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-all duration-200 ${
                    active
                      ? "text-[#0f172a] font-bold"
                      : "text-slate-600 hover:text-[#0f172a] hover:bg-slate-100/70"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-slate-900/[0.06] border border-slate-900/10 rounded-full shadow-2xs backdrop-blur-xs"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`relative z-10 text-[10px] font-bold px-1.5 py-0.2 rounded-full border transition-colors ${
                        active
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-slate-100 text-slate-600 border-slate-200/80"
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
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/contact"
              className={`hidden xs:inline-flex relative px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isActive("/contact")
                  ? "bg-amber-400 text-black font-extrabold ring-2 ring-slate-900/10 shadow-sm"
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md"
              }`}
            >
              Contact
            </Link>

            {/* Language Switcher (Desktop) */}
            <div className="hidden sm:flex items-center text-xs font-semibold text-slate-400 tracking-wider px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/70 shadow-2xs">
              <span className="text-slate-900 font-bold">EN</span>
              <span className="mx-1 text-slate-300">/</span>
              <span className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">DE</span>
            </div>

            {/* If user is logged in: show Dashboard button */}
            {currentUser ? (
              <button
                onClick={handleDashboard}
                type="button"
                className="inline-flex items-center gap-2 text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name || "User"}
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-blue-300"
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            ) : (
              /* If user is NOT logged in: show Sign In button */
              <button
                onClick={handleAuth}
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 transition-all px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-2xs cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer (Light Theme, Full Width) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full rounded-none backdrop-blur-2xl bg-white/95 border-b border-slate-200/80 shadow-xl px-5 pt-3 pb-6 space-y-3 overflow-hidden"
          >
            <div className="flex flex-col space-y-1 pt-1 max-w-7xl mx-auto">
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboard();
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl bg-blue-50 text-blue-800 font-bold text-sm flex items-center justify-between border border-blue-100"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Dashboard Cockpit</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
              )}

              {navLinks.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      active
                        ? "bg-slate-100 text-slate-950 font-bold border border-slate-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
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
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/contact")
                    ? "bg-slate-100 text-slate-950 font-bold border border-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Contact & Support
              </Link>
            </div>

            {/* Mobile Actions: Contact Pill & Sign In */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5 max-w-7xl mx-auto">
              <Link
                to="/contact"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleContact();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-center text-xs shadow-xs hover:bg-slate-800 transition-all"
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
                  className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold text-center text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Sign In to ADOS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleDashboard();
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
