import React from "react";
import agentImg from "../../assets/agent.png";
import {
  Home,
  Link2,
  Megaphone,
  BarChart2,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

export default function DashboardSidebar({
  activeTab,
  onSelectTab,
  onBackToWebsite,
  user,
  isOpenMobile,
  onCloseMobile,
}) {
  const navItems = [
    {
      id: "overview",
      targetTab: "overview",
      label: "Overview",
      icon: Home,
    },
    {
      id: "ad-accounts",
      targetTab: "ad-accounts",
      label: "Ad Accounts",
      icon: Link2,
    },
    {
      id: "campaigns",
      targetTab: "campaigns",
      label: "Campaigns",
      icon: Megaphone,
    },
    {
      id: "reports",
      targetTab: "reports",
      label: "Reports",
      icon: BarChart2,
    },
    {
      id: "settings",
      targetTab: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleItemClick = (targetTab) => {
    onSelectTab(targetTab);
    if (onCloseMobile) onCloseMobile();
  };

  const isCurrentActive = (targetTab) => {
    if (targetTab === "overview") {
      return activeTab === "overview" || activeTab === "dashboard";
    }
    if (targetTab === "ad-accounts") {
      return activeTab === "ad-accounts" || activeTab === "manage-account";
    }
    if (targetTab === "campaigns") {
      return activeTab === "campaigns" || activeTab === "manage-ads";
    }
    return activeTab === targetTab;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif] select-none justify-between">
      <div>
        {/* BRAND HEADER */}
        <div className="p-5 sm:p-6 pb-5 flex items-center justify-between">
          <div
            onClick={onBackToWebsite}
            className="flex items-center cursor-pointer group transition-all"
          >
            <img
              src="/ados-logo.png"
              alt="ADOS Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105 select-none"
            />
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <div className="px-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isCurrentActive(item.targetTab);

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.targetTab)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group text-left ${
                  isActive
                    ? "bg-[#eff6ff] text-[#2563eb]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive ? "text-[#2563eb]" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM "Better Ads. Bigger Results." CARD WITH AI AGENT LOGO */}
      <div className="p-3.5">
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#f0f7ff] to-[#f8faff] border border-blue-100/90 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-blue-200/70 p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <img
                src={agentImg}
                alt="ADOS AI Agent"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Agent
            </span>
          </div>
          <h4 className="text-xs font-bold text-[#0f172a]">
            Better Ads. Bigger Results.
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Connect your accounts and get real insights across all platforms.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-64 max-w-[85vw] h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
