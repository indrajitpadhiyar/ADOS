import React from "react";
import PlatformLogo from "../common/PlatformLogo";
import {
  LayoutDashboard,
  Layers,
  Sparkles,
  Rocket,
  UserCheck,
  Settings,
  ArrowLeft,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Globe,
  Radio,
} from "lucide-react";

export default function DashboardSidebar({
  activeTab,
  onSelectTab,
  onBackToWebsite,
  onLogout,
  user,
  isOpenMobile,
  onCloseMobile,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
      description: "Overview & Telemetry",
    },
    {
      id: "manage-ads",
      label: "Manage Ads",
      icon: Layers,
      badge: "48",
      description: "Creatives & Live Status",
    },
    {
      id: "create-ads",
      label: "Create Ads",
      icon: Sparkles,
      badge: "Studio",
      description: "Multi-Platform Designer",
    },
    {
      id: "publish-ads",
      label: "Publish Ads",
      icon: Rocket,
      badge: "Deploy",
      description: "Omnichannel Launcher",
    },
    {
      id: "manage-account",
      label: "Manage Account",
      icon: UserCheck,
      badge: "5 Live",
      description: "Connected Accounts & Team",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      badge: null,
      description: "Rules, API & Tracking",
    },
  ];

  const handleItemClick = (id) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif] select-none">
      {/* 1. BRAND HEADER */}
      <div className="p-6 pb-5 border-b border-slate-100 flex items-center justify-between">
        <div
          onClick={onBackToWebsite}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <img
            src="/ados2.png"
            alt="ADOS Logo"
            className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[#111113] leading-none">
              ADOS
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#ff4a22] mt-0.5">
              Ad Operating System
            </span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={onBackToWebsite}
          title="Back to Landing Page"
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer group text-left ${
                isActive
                  ? "bg-emerald-50/80 text-emerald-950 border border-emerald-200/70 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? "bg-[#0f766e] text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className={`leading-snug truncate ${isActive ? "text-emerald-950 font-extrabold" : "text-slate-800 font-bold"}`}>
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] font-normal truncate mt-0.5 ${
                      isActive ? "text-emerald-700/80 font-medium" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    isActive
                      ? "bg-[#0f766e] text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. CONNECTED NETWORKS LIVE STATUS BOX */}
      <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-extrabold text-[#111113]">5 Networks Live</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">14ms latency</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { id: "meta", label: "Meta" },
            { id: "google", label: "Google" },
            { id: "amazon", label: "Amzn" },
            { id: "youtube", label: "YouTube" },
            { id: "linkedin", label: "LinkedIn" },
          ].map((net) => (
            <div
              key={net.id}
              className="p-1 rounded-lg bg-white border border-slate-200/80 flex flex-col items-center justify-center gap-1 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
              title={`${net.label} Connected & Live`}
              onClick={() => handleItemClick("manage-account")}
            >
              <PlatformLogo platform={net.id} size="xs" />
              <span className="text-[8px] font-bold text-slate-600 truncate max-w-full">
                {net.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. USER PROFILE & LOGOUT FOOTER */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between">
          <div
            onClick={() => handleItemClick("manage-account")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 text-white flex items-center justify-center font-extrabold text-xs shadow-xs group-hover:bg-[#ff4a22] transition-colors">
              {user?.avatar ? (
                <img src={user.avatar} alt={user?.name || "User"} className="w-full h-full object-cover" />
              ) : user?.name ? (
                user.name.slice(0, 2).toUpperCase()
              ) : (
                "AD"
              )}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-extrabold text-[#111113] group-hover:text-[#ff4a22] transition-colors truncate max-w-[120px]">
                {user?.name || "Advertiser"}
              </span>
              <span className="text-[10px] text-slate-400 truncate">Enterprise Admin</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Sticky / Fixed) */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Slide-over Container */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
