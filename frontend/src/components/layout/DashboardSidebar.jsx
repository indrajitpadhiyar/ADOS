import React from "react";
import PlatformLogo from "../common/PlatformLogo";
import agentImg from "../../assets/agent.png";
import {
  Home,
  LayoutDashboard,
  Megaphone,
  Image as ImageIcon,
  Video,
  Rocket,
  Crown,
  FileText,
  Settings,
  ArrowRight,
  ArrowLeft,
  LogOut,
  ChevronRight,
  Sparkles,
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
      targetTab: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "manage-ads",
      targetTab: "manage-ads",
      label: "Control Ads",
      icon: Megaphone,
    },
    {
      id: "generate-poster",
      targetTab: "generate-poster",
      label: "Generate Poster",
      icon: ImageIcon,
    },
    {
      id: "generate-video",
      targetTab: "generate-video",
      label: "Generate Video",
      icon: Video,
    },
    {
      id: "publish-ads",
      targetTab: "publish-ads",
      label: "Publish Ads",
      icon: Rocket,
    },
    {
      id: "upgrade-plan",
      targetTab: "upgrade-plan",
      label: "Upgrade Plan",
      icon: Crown,
    },
    {
      id: "reports",
      targetTab: "reports",
      label: "Reports",
      icon: FileText,
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

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 font-['Plus_Jakarta_Sans',sans-serif] select-none justify-between">
      <div>
        {/* 1. BRAND HEADER */}
        <div className="p-6 pb-6 flex items-center justify-between">
          <div
            onClick={onBackToWebsite}
            className="flex items-center gap-3 cursor-pointer group transition-all"
          >
            <img
              src="/ados2.png"
              alt="ADOS Logo"
              className="h-8 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-[#111113] leading-none">
                ADOS
              </span>
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400 mt-1">
                AI AD PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION LINKS */}
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.targetTab;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.targetTab)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer group text-left ${
                  isActive
                    ? "bg-[#FFF4EC] text-[#FF5722] shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isActive ? "text-[#FF5722]" : "text-slate-500 group-hover:text-slate-700"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BOTTOM AI AGENT WIDGET */}
      <div className="p-4">
        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center gap-3 relative shadow-2xs">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-white shadow-xs">
            <img
              src={agentImg}
              alt="ADOS AI Agent"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-extrabold text-[#111113] truncate">
              ADOS AI Agent
            </div>
            <div className="text-[10px] text-slate-400 truncate font-medium">
              Your AI growth partner
            </div>
            <button
              onClick={() => handleItemClick("create-ads")}
              className="mt-1 text-[11px] font-bold text-[#FF5722] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ask Agent</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-64 max-w-[85vw] h-full shadow-2xl z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
