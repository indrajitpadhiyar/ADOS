import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  ChevronDown,
  Bell,
  Menu,
  Settings as SettingsIcon,
  LogOut,
  User,
  Check,
} from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";

export const DATE_RANGE_OPTIONS = [
  { id: "TODAY", label: "Today" },
  { id: "YESTERDAY", label: "Yesterday" },
  { id: "LAST_7_DAYS", label: "Last 7 days" },
  { id: "LAST_14_DAYS", label: "Last 14 days" },
  { id: "LAST_30_DAYS", label: "Last 30 days" },
  { id: "THIS_MONTH", label: "This month" },
  { id: "LAST_MONTH", label: "Last month" },
];

export default function DashboardLayout({
  children,
  user,
  onLogout,
  dateRange = "LAST_30_DAYS",
  onDateRangeChange,
  searchQuery = "",
  onSearchChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const dateMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setIsDateRangeOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("ad-accounts") || path.includes("manage-account")) return "ad-accounts";
    if (path.includes("campaigns") || path.includes("manage-ads")) return "campaigns";
    if (path.includes("reports")) return "reports";
    if (path.includes("settings")) return "settings";
    return "overview";
  };

  const activeTab = getActiveTab();

  const handleNavigateTab = (tabId) => {
    switch (tabId) {
      case "overview":
      case "dashboard":
        navigate("/dashboard");
        break;
      case "ad-accounts":
      case "manage-account":
        navigate("/ad-accounts");
        break;
      case "campaigns":
      case "manage-ads":
        navigate("/campaigns");
        break;
      case "reports":
        navigate("/reports");
        break;
      case "settings":
        navigate("/settings");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("ados_token");
      localStorage.removeItem("ados_user");
      navigate("/");
    }
  };

  const selectedDateOption = DATE_RANGE_OPTIONS.find((o) => o.id === dateRange) || DATE_RANGE_OPTIONS[4];

  // Derive user name and initials
  const userName = user?.name || "John Doe";
  const userPlan = user?.plan || "Pro Plan";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] font-['Plus_Jakarta_Sans',sans-serif] flex selection:bg-blue-600 selection:text-white">
      {/* 1. SIDEBAR */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={handleNavigateTab}
        onBackToWebsite={() => navigate("/")}
        user={user || { name: "Advertiser" }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN APP CANVAS */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
          <div className="px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
            {/* Left: Mobile menu toggle & Search input */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative w-60 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Right: Date Range Selector, Notification Bell, User Menu */}
            <div className="flex items-center gap-3">
              {/* Date Range Dropdown */}
              <div className="relative" ref={dateMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-slate-50/50 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedDateOption.label}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isDateRangeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-slate-150 p-1.5 z-50 text-xs"
                    >
                      {DATE_RANGE_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            if (onDateRangeChange) onDateRangeChange(option.id);
                            setIsDateRangeOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left cursor-pointer transition-colors ${
                            dateRange === option.id
                              ? "bg-blue-50 text-blue-600 font-bold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{option.label}</span>
                          {dateRange === option.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notifMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 relative cursor-pointer transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white" />
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-150 p-3 z-50 text-xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                        <span>Notifications</span>
                        <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark read</span>
                      </div>
                      <div className="py-2.5 space-y-2 text-slate-600 text-[11px]">
                        <p className="font-semibold text-slate-800">Connected Accounts Synced</p>
                        <p className="text-slate-400">All live telemetry metrics were refreshed successfully.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Pill */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer select-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563eb] font-bold text-xs flex items-center justify-center">
                    {userInitials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-[#0f172a] leading-tight">
                      {userName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-none">
                      {userPlan}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-150 p-1.5 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="font-bold text-slate-900 truncate">{userName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user?.email || "user@ados.io"}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/settings");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium cursor-pointer text-left mt-1"
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                        Settings
                      </button>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogoutAction();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
