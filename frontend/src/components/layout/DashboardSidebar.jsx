import React from "react";
import {
  Home,
  Link2,
  Megaphone,
  BarChart2,
  Settings,
  Sparkles,
  Zap,
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
        <div className="p-6 pb-6 flex items-center justify-between">
          <div
            onClick={onBackToWebsite}
            className="flex items-center gap-3 cursor-pointer group transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#0f172a] leading-none">
                ADOS
              </span>
              <span className="text-[10px] font-semibold text-slate-400 mt-1 tracking-wide">
                AI Ad Platform
              </span>
            </div>
          </div>
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

      {/* BOTTOM "Better Ads. Bigger Results." CARD */}
      <div className="p-3.5">
        <div className="p-4 rounded-2xl bg-[#f0f7ff] border border-blue-100/70 relative">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center mb-2.5">
            <Sparkles className="w-4 h-4" />
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
