import React, { useState, useEffect } from "react";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  RefreshCw,
  Trash2,
  ExternalLink,
  Bell,
  Mail,
  Key,
} from "lucide-react";

export default function SettingsSection({ user }) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'connections' | 'security'
  const [googleStatus, setGoogleStatus] = useState(null);
  const [metaStatus, setMetaStatus] = useState(null);
  const [saveNotice, setSaveNotice] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const [g, m] = await Promise.all([
        api.getGoogleAdsStatus().catch(() => ({ isConnected: false })),
        api.getMetaAdsStatus().catch(() => ({ isConnected: false })),
      ]);
      setGoogleStatus(g);
      setMetaStatus(m);
    } catch (e) {
      // Ignore
    }
  };

  const handleDisconnect = async (platform) => {
    try {
      if (platform === "google") {
        await api.disconnectGoogleAds();
        showToast("Google Ads account disconnected.");
      } else {
        await api.disconnectMetaAds();
        showToast("Meta Ads account disconnected.");
      }
      loadConnections();
    } catch (err) {
      showToast(err.message || "Failed to disconnect.");
    }
  };

  const userName = user?.name || "John Doe";
  const userEmail = user?.email || "user@ados.io";

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn select-none">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-[#0f172a] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your user profile, connected advertising accounts, and workspace security.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: "profile", label: "User Profile" },
          { id: "connections", label: "Connected Ad Accounts" },
          { id: "security", label: "Security & Privacy" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#2563eb] text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Profile */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs max-w-2xl space-y-5">
          <h3 className="text-sm font-bold text-[#0f172a]">User Profile Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={userName}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={userEmail}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Workspace Role
                </label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                  Account Owner (Admin)
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Plan Tier
                </label>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-blue-600 font-bold">
                  {user?.plan || "Pro Plan"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Connected Ad Accounts */}
      {activeTab === "connections" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs max-w-3xl space-y-5">
          <h3 className="text-sm font-bold text-[#0f172a]">
            Active Advertising OAuth Connections
          </h3>

          <div className="space-y-4">
            {/* Google Ads */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="google" size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Google Ads</h4>
                  <p className="text-[11px] text-slate-500">
                    {googleStatus?.isConnected
                      ? `${googleStatus.selectedCustomerName || "Connected"} (${googleStatus.selectedCustomerId || "—"})`
                      : "Not connected"}
                  </p>
                </div>
              </div>

              {googleStatus?.isConnected ? (
                <button
                  type="button"
                  onClick={() => handleDisconnect("google")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Disconnected</span>
              )}
            </div>

            {/* Meta Ads */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="meta" size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Meta Ads</h4>
                  <p className="text-[11px] text-slate-500">
                    {metaStatus?.isConnected
                      ? `${metaStatus.selectedAccountName || "Connected"} (${metaStatus.selectedAccountId || "—"})`
                      : "Not connected"}
                  </p>
                </div>
              </div>

              {metaStatus?.isConnected ? (
                <button
                  type="button"
                  onClick={() => handleDisconnect("meta")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-slate-400">Disconnected</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Security & Privacy */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs max-w-2xl space-y-4">
          <h3 className="text-sm font-bold text-[#0f172a]">Security & Token Isolation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All OAuth tokens and API secrets are encrypted at rest on the ADOS backend using AES-256-GCM. Client secrets and refresh tokens are strictly hidden from the frontend to preserve SOC2 and enterprise compliance.
          </p>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>256-bit AES-GCM Encrypted Token Vault Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
