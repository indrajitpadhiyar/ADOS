import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Navbar({ onOpenContact, onOpenAuth, onOpenDashboard, user }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-black/[0.04] transition-all"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with actual user asset */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center group cursor-pointer"
        >
          <img
            src="/ados-logo.png"
            alt="ADOS"
            className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none"
          />
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
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
              className="hover:text-black transition-colors flex items-center gap-1.5 hover:-translate-y-0.5 transform duration-150 font-bold text-slate-900 cursor-pointer"
            >
              Dashboard
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live
              </span>
            </a>
          )}
          <a
            href="#product"
            className="hover:text-black transition-colors hover:-translate-y-0.5 transform duration-150"
          >
            Product
          </a>
          <a
            href="#platforms"
            className="hover:text-black transition-colors flex items-center gap-1.5 hover:-translate-y-0.5 transform duration-150"
          >
            Platforms
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              5+
            </span>
          </a>
          <a
            href="#solutions"
            className="hover:text-black transition-colors flex items-center gap-1 hover:-translate-y-0.5 transform duration-150"
          >
            Solutions
            <span className="text-[11px] text-slate-400 font-sans">ⓘ</span>
          </a>
          <a
            href="#results"
            className="hover:text-black transition-colors hover:-translate-y-0.5 transform duration-150"
          >
            Results
          </a>
          <a
            href="#about"
            className="hover:text-black transition-colors hover:-translate-y-0.5 transform duration-150"
          >
            About Us
          </a>
        </nav>

        {/* Right Actions: Dark pill Contact CTA + Language Switcher + Sign In / Dashboard */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          <Link
            to="/contact"
            onClick={onOpenContact}
            className="relative px-6 py-2.5 rounded-full bg-[#121214] text-white text-sm font-semibold tracking-wide shadow-sm hover:bg-black hover:shadow-md active:scale-95 transition-all duration-200"
          >
            Contact
          </Link>

          {/* Language Switcher */}
          <div className="hidden sm:flex items-center text-xs font-semibold text-slate-500 tracking-wider">
            <span className="text-black">EN</span>
            <span className="mx-1 text-slate-300">/</span>
            <span className="hover:text-black cursor-pointer transition-colors">DE</span>
          </div>

          {/* If user is logged in: show Dashboard button */}
          {user ? (
            onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white transition-all hover:scale-105 cursor-pointer shadow-sm"
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
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-black transition-colors px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-slate-300 cursor-pointer"
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
