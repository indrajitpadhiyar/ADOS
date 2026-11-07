import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Trash2,
  ArrowLeft,
  Mail,
  ExternalLink,
  Printer,
  Share2,
  Check,
  ChevronRight,
  Clock,
  ArrowUp,
  Copy,
} from "lucide-react";

export default function LegalLayout({
  title,
  subtitle,
  category = "LEGAL & REGULATORY DOCUMENTATION",
  effectiveDate = "November 7, 2026",
  tocItems = [],
  children,
}) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      setShowScrollTop(window.scrollY > 400);

      // Section intersection detection
      if (tocItems.length > 0) {
        const scrollPosition = window.scrollY + 180;
        for (let i = tocItems.length - 1; i >= 0; i--) {
          const sectionEl = document.getElementById(tocItems[i].id);
          if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
            setActiveSection(tocItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("idrtech23@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navTabs = [
    {
      name: "Privacy Policy",
      path: "/privacy-policy",
      label: "Privacy & Data",
    },
    {
      name: "Terms of Service",
      path: "/terms",
      label: "Terms & Usage",
    },
    {
      name: "Data Deletion",
      path: "/data-deletion",
      label: "Data Deletion Guide",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-slate-900 selection:text-white flex flex-col antialiased">
      {/* Top Precision Reading Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-slate-200/80 z-50">
        <div
          className="h-full bg-slate-900 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Modern Editorial Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200/90 transition-all">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-18 flex items-center justify-between gap-4">
          {/* Brand Mark & Return Link */}
          <div className="flex items-center gap-5 sm:gap-7">
            <Link
              to="/"
              className="flex items-center gap-3 group transition-transform"
            >
              <div className="flex items-center justify-center p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <img
                  src="/ados2.png"
                  alt="ADOS Logo"
                  className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-950 leading-none">
                    ADOS
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    Governance
                  </span>
                </div>
                <span className="text-[10px] tracking-wider text-slate-400 mt-0.5 font-medium">
                  Adaptive Digital Operating System
                </span>
              </div>
            </Link>

            <div className="hidden lg:block h-5 w-px bg-slate-200" />

            <Link
              to="/"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>

          {/* Understated Document Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200/80">
            {navTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/90"
                      : "text-slate-600 hover:text-slate-950 hover:bg-white/60"
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>

          {/* Utility Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              aria-label="Print Document"
              title="Print document or export to PDF"
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              aria-label="Share Link"
              title="Copy canonical link to clipboard"
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <Link
              to="/auth"
              className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="md:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white text-slate-950 font-bold border border-slate-200 shadow-xs"
                    : "text-slate-600 font-medium hover:text-slate-950"
                }`}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Editorial Document Header */}
      <section className="relative w-full bg-white border-b border-slate-200/90 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">
            <Link to="/" className="hover:text-slate-800 transition-colors">
              ADOS
            </Link>
            <span>/</span>
            <span>LEGAL</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{category}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-1">
            <div className="max-w-4xl space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                {title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl">
                {subtitle}
              </p>
            </div>

            {/* Document Ledger Card */}
            <div className="flex-shrink-0 w-full lg:w-80 p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-200/80">
                <span className="uppercase text-[11px] tracking-wider text-slate-400">
                  Effective Date
                </span>
                <span className="font-semibold text-slate-900">
                  {effectiveDate}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-200/80">
                <span className="uppercase text-[11px] tracking-wider text-slate-400">
                  Authority
                </span>
                <a
                  href="https://idrtech.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1"
                >
                  idrtech.in
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="uppercase text-[11px] tracking-wider text-slate-400">
                  Contact Office
                </span>
                <a
                  href="mailto:idrtech23@gmail.com"
                  className="font-semibold text-slate-900 hover:text-blue-600"
                >
                  idrtech23@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Sidebar + Document Content */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">
          {/* Left Column: Swiss-Style Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 2xl:col-span-3">
            <div className="sticky top-28 space-y-6">
              {tocItems.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Index of Clauses
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {tocItems.length}
                    </span>
                  </div>

                  <nav className="space-y-0.5 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1 no-scrollbar text-xs">
                    {tocItems.map((item, index) => {
                      const isActive = activeSection === item.id;
                      const formattedIndex = String(index + 1).padStart(2, "0");
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(item.id);
                            if (el) {
                              const y =
                                el.getBoundingClientRect().top +
                                window.pageYOffset -
                                100;
                              window.scrollTo({ top: y, behavior: "smooth" });
                            }
                          }}
                          className={`group flex items-start gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                            isActive
                              ? "bg-slate-100 text-slate-950 font-bold"
                              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`font-mono text-[10px] mt-0.5 flex-shrink-0 transition-colors ${
                              isActive
                                ? "text-slate-950 font-bold"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          >
                            {formattedIndex}
                          </span>
                          <span className="leading-snug">
                            {item.label.replace(/^\d+\.\s*/, "")}
                          </span>
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Dedicated Privacy Officer Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Compliance Office
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For legal inquiries, rights requests, or deletion processing, contact the compliance desk directly.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="mailto:idrtech23@gmail.com"
                    className="flex-1 text-center py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition-colors"
                  >
                    Email Office
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    title="Copy Email Address"
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Document Cross-Navigation */}
              <div className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/70 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Companion Documents
                </span>
                <div className="space-y-1">
                  {navTabs
                    .filter((t) => t.path !== location.pathname)
                    .map((t) => (
                      <Link
                        key={t.path}
                        to={t.path}
                        className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-950 font-medium py-1 transition-colors"
                      >
                        <span>{t.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Actual Document Body */}
          <div className="lg:col-span-9 xl:col-span-9 2xl:col-span-9 w-full space-y-12">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 shadow-md hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Refined Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src="/ados2.png"
                alt="ADOS Logo"
                className="h-7 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-tight text-slate-950">
                  ADOS
                </span>
                <span className="text-[11px] text-slate-400">
                  IDR Tech Legal & Trust Center
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
              <Link to="/privacy-policy" className="hover:text-slate-950 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-300">/</span>
              <Link to="/terms" className="hover:text-slate-950 transition-colors">
                Terms of Service
              </Link>
              <span className="text-slate-300">/</span>
              <Link to="/data-deletion" className="hover:text-slate-950 transition-colors">
                User Data Deletion
              </Link>
              <span className="text-slate-300">/</span>
              <a
                href="https://idrtech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-950 transition-colors inline-flex items-center gap-1"
              >
                Website <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <p>© {new Date().getFullYear()} IDR Tech (ADOS). All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Direct:</span>
              <a
                href="mailto:idrtech23@gmail.com"
                className="text-slate-700 hover:text-slate-950 underline"
              >
                idrtech23@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
