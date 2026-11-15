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
  Building2,
  Phone,
  Globe,
  Coins,
  Camera,
  Save,
  RotateCcw,
  Check,
  Copy,
  Sparkles,
  Sliders,
  Briefcase,
  AlertCircle,
} from "lucide-react";

const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-purple-600 to-pink-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
];

const TIMEZONE_OPTIONS = [
  { value: "Asia/Kolkata (UTC+5:30)", label: "Asia/Kolkata (IST - UTC+5:30)" },
  { value: "America/New_York (UTC-5)", label: "America/New_York (EST - UTC-5)" },
  { value: "America/Chicago (UTC-6)", label: "America/Chicago (CST - UTC-6)" },
  { value: "America/Los_Angeles (UTC-8)", label: "America/Los_Angeles (PST - UTC-8)" },
  { value: "Europe/London (UTC+0)", label: "Europe/London (GMT - UTC+0)" },
  { value: "Europe/Berlin (UTC+1)", label: "Europe/Berlin (CET - UTC+1)" },
  { value: "Asia/Dubai (UTC+4)", label: "Asia/Dubai (GST - UTC+4)" },
  { value: "Asia/Singapore (UTC+8)", label: "Asia/Singapore (SGT - UTC+8)" },
  { value: "Asia/Tokyo (UTC+9)", label: "Asia/Tokyo (JST - UTC+9)" },
  { value: "Australia/Sydney (UTC+11)", label: "Australia/Sydney (AEST - UTC+11)" },
];

const CURRENCY_OPTIONS = [
  { value: "INR (₹)", label: "INR (₹) - Indian Rupee" },
  { value: "USD ($)", label: "USD ($) - US Dollar" },
  { value: "EUR (€)", label: "EUR (€) - Euro" },
  { value: "GBP (£)", label: "GBP (£) - British Pound" },
  { value: "AED (AED)", label: "AED (AED) - UAE Dirham" },
  { value: "AUD (A$)", label: "AUD (A$) - Australian Dollar" },
  { value: "CAD (C$)", label: "CAD (C$) - Canadian Dollar" },
  { value: "SGD (S$)", label: "SGD (S$) - Singapore Dollar" },
];

export default function SettingsSection({ user, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'connections' | 'workspace' | 'security'
  const [googleStatus, setGoogleStatus] = useState(null);
  const [metaStatus, setMetaStatus] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Stored / Current user fallback
  const currentUser = user || (() => {
    try {
      const stored = localStorage.getItem("ados_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "Advertiser",
    email: currentUser?.email || "user@ados.io",
    company: currentUser?.company || "",
    title: currentUser?.title || "Performance Lead",
    phone: currentUser?.phone || "",
    timezone: currentUser?.timezone || "Asia/Kolkata (UTC+5:30)",
    currency: currentUser?.currency || "INR (₹)",
    avatar: currentUser?.avatar || "",
    avatarGradient: currentUser?.avatarGradient || AVATAR_GRADIENTS[0],
  });

  // Workspace Settings Form State
  const [prefsForm, setPrefsForm] = useState({
    attributionModel: "data_driven",
    refreshRate: "14ms",
    webhookUrl: "https://api.brand.com/v1/ados-webhooks",
    minRoasAlert: 2.8,
    autoPauseFatigue: true,
    emailAlerts: true,
    slackAlerts: true,
    apiKey: "ados_live_sec_****************************",
  });

  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    loadConnections();
    loadSettings();
  }, []);

  // Sync profileForm if user prop changes
  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        company: user.company || prev.company,
        title: user.title || prev.title,
        phone: user.phone || prev.phone,
        timezone: user.timezone || prev.timezone,
        currency: user.currency || prev.currency,
        avatar: user.avatar || prev.avatar,
        avatarGradient: user.avatarGradient || prev.avatarGradient,
      }));
    }
  }, [user]);

  const loadConnections = async () => {
    try {
      const [g, m] = await Promise.all([
        api.getGoogleAdsStatus().catch(() => ({ isConnected: false })),
        api.getMetaAdsStatus().catch(() => ({ isConnected: false })),
      ]);
      setGoogleStatus(g);
      setMetaStatus(m);
    } catch {
      // Ignore
    }
  };

  const loadSettings = async () => {
    try {
      const res = await api.getSettings().catch(() => null);
      if (res?.data) {
        setPrefsForm((prev) => ({
          ...prev,
          attributionModel: res.data.attributionModel || prev.attributionModel,
          refreshRate: res.data.refreshRate || prev.refreshRate,
          webhookUrl: res.data.webhookUrl || prev.webhookUrl,
          minRoasAlert: res.data.minRoasAlert ?? prev.minRoasAlert,
          autoPauseFatigue: res.data.autoPauseFatigue ?? prev.autoPauseFatigue,
          emailAlerts: res.data.emailAlerts ?? prev.emailAlerts,
          slackAlerts: res.data.slackAlerts ?? prev.slackAlerts,
          apiKey: res.data.apiKey || prev.apiKey,
        }));
      }
    } catch {
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
      showToast(err.message || "Failed to disconnect.", "error");
    }
  };

  // Save Manage Profile
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!profileForm.name.trim()) {
      showToast("Full name cannot be empty.", "error");
      return;
    }

    setSavingProfile(true);
    try {
      // Call backend to persist user profile changes
      await api.updateSettings({
        name: profileForm.name.trim(),
        company: profileForm.company.trim(),
        timezone: profileForm.timezone,
        currency: profileForm.currency,
      });

      // Update local storage and application state
      const updatedUser = {
        ...(currentUser || {}),
        name: profileForm.name.trim(),
        email: profileForm.email,
        company: profileForm.company.trim(),
        title: profileForm.title.trim(),
        phone: profileForm.phone.trim(),
        timezone: profileForm.timezone,
        currency: profileForm.currency,
        avatar: profileForm.avatar.trim(),
        avatarGradient: profileForm.avatarGradient,
      };

      localStorage.setItem("ados_user", JSON.stringify(updatedUser));
      if (onUpdateUser) onUpdateUser(updatedUser);
      window.dispatchEvent(new Event("storage"));

      showToast("Profile changes saved successfully!");
    } catch (err) {
      showToast(err.message || "Failed to save profile.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // Reset Profile to saved state
  const handleResetProfile = () => {
    setProfileForm({
      name: currentUser?.name || "Advertiser",
      email: currentUser?.email || "user@ados.io",
      company: currentUser?.company || "",
      title: currentUser?.title || "Performance Lead",
      phone: currentUser?.phone || "",
      timezone: currentUser?.timezone || "Asia/Kolkata (UTC+5:30)",
      currency: currentUser?.currency || "INR (₹)",
      avatar: currentUser?.avatar || "",
      avatarGradient: currentUser?.avatarGradient || AVATAR_GRADIENTS[0],
    });
    showToast("Profile reset to saved values.");
  };

  // Save Workspace & Automation Preferences
  const handleSavePreferences = async (e) => {
    e?.preventDefault();
    setSavingPrefs(true);
    try {
      await api.updateSettings({
        attributionModel: prefsForm.attributionModel,
        refreshRate: prefsForm.refreshRate,
        webhookUrl: prefsForm.webhookUrl,
        minRoasAlert: Number(prefsForm.minRoasAlert),
        autoPauseFatigue: Boolean(prefsForm.autoPauseFatigue),
        emailAlerts: Boolean(prefsForm.emailAlerts),
        slackAlerts: Boolean(prefsForm.slackAlerts),
      });
      showToast("Automation preferences saved successfully!");
    } catch (err) {
      showToast(err.message || "Failed to save preferences.", "error");
    } finally {
      setSavingPrefs(false);
    }
  };

  // Regenerate API Key
  const handleRegenerateKey = async () => {
    if (!window.confirm("Are you sure you want to regenerate your live API key? Any active webhook integrations using the old key will stop working.")) {
      return;
    }
    setRegeneratingKey(true);
    try {
      const res = await api.regenerateApiKey();
      if (res?.data?.apiKey) {
        setPrefsForm((prev) => ({ ...prev, apiKey: res.data.apiKey }));
        showToast("New API key generated securely.");
      }
    } catch (err) {
      showToast(err.message || "Failed to regenerate API key.", "error");
    } finally {
      setRegeneratingKey(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(prefsForm.apiKey);
    setCopiedKey(true);
    showToast("API key copied to clipboard.");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const userInitials = (profileForm.name || "JD")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-20 right-8 z-50 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 transition-all duration-300 ${
            toastType === "error" ? "bg-rose-600 border border-rose-500" : "bg-[#0f172a] border border-slate-700"
          }`}
        >
          {toastType === "error" ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, ad account OAuth tokens, workspace preferences, and API security.
          </p>
        </div>

        {/* User Quick Identity Pill */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${profileForm.avatarGradient} flex items-center justify-center text-white text-xs font-black shadow-xs overflow-hidden shrink-0`}
          >
            {profileForm.avatar ? (
              <img src={profileForm.avatar} alt={profileForm.name} className="w-full h-full object-cover" />
            ) : (
              <span>{userInitials}</span>
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 leading-tight">{profileForm.name}</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{currentUser?.role === "admin" ? "Admin" : "Account Owner"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "profile", label: "Manage Profile", icon: User },
          { id: "connections", label: "Connected Ad Accounts", icon: RefreshCw },
          { id: "workspace", label: "Workspace & Automation", icon: Sliders },
          { id: "security", label: "Security & API Keys", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isActive
                  ? "bg-[#2563eb] text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MANAGE PROFILE                                                     */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="space-y-6 max-w-4xl">
          {/* Identity & Avatar Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-4">
                {/* Large Avatar */}
                <div className="relative group">
                  <div
                    className={`w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gradient-to-br ${profileForm.avatarGradient} flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md overflow-hidden shrink-0`}
                  >
                    {profileForm.avatar ? (
                      <img src={profileForm.avatar} alt={profileForm.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{userInitials}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">{profileForm.name}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{profileForm.email}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {profileForm.company || "Independent Brand"}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                      {currentUser?.plan || "Pro Tier"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Avatar Preset Colors */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Avatar Theme
                </span>
                <div className="flex items-center gap-2">
                  {AVATAR_GRADIENTS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setProfileForm((prev) => ({ ...prev, avatarGradient: grad }))}
                      className={`w-6 h-6 rounded-full bg-gradient-to-br ${grad} transition-transform cursor-pointer ${
                        profileForm.avatarGradient === grad
                          ? "ring-2 ring-offset-2 ring-[#2563eb] scale-110"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      title={`Color theme ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Form Inputs */}
            <form onSubmit={handleSaveProfile} className="pt-6 space-y-6">
              {/* Row 1: Personal Info */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email Address (Primary Login)</span>
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      readOnly
                      title="Email is verified with OAuth/credentials"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200/90 text-xs font-semibold text-slate-500 cursor-not-allowed select-text"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Organization & Role */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Company & Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Company / Brand Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Company / Brand Name</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      placeholder="e.g. NovaWear D2C"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                    />
                  </div>

                  {/* Job Title / Role */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>Job Title / Function</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      placeholder="e.g. Head of Performance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Phone / Contact Number</span>
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Localization Preferences */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Regional & Currency Standards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Timezone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ad Account Default Timezone</span>
                    </label>
                    <select
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all cursor-pointer"
                    >
                      {TIMEZONE_OPTIONS.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reporting Currency</span>
                    </label>
                    <select
                      value={profileForm.currency}
                      onChange={(e) => setProfileForm({ ...profileForm, currency: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all cursor-pointer"
                    >
                      {CURRENCY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Custom Avatar URL (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile Photo Image URL (Optional)</span>
                </label>
                <input
                  type="url"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                />
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetProfile}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Discard Changes</span>
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{savingProfile ? "Saving Profile..." : "Save Profile Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CONNECTED AD ACCOUNTS                                              */}
      {/* ========================================================================= */}
      {activeTab === "connections" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Active Advertising OAuth Connections</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage live API credentials connecting ADOS to your ad network accounts.
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Ads */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="google" size="sm" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Google Ads API v18</h4>
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
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
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
                  <h4 className="text-xs font-bold text-slate-900">Meta Graph API v21.0</h4>
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
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
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

      {/* ========================================================================= */}
      {/* TAB 3: WORKSPACE & AUTOMATION PREFERENCES                                 */}
      {/* ========================================================================= */}
      {activeTab === "workspace" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Algorithmic Bidding & Automation Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure attribution models, real-time polling frequency, and circuit-breaker triggers.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Attribution Model */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Multi-Touch Attribution Model
                </label>
                <select
                  value={prefsForm.attributionModel}
                  onChange={(e) => setPrefsForm({ ...prefsForm, attributionModel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all cursor-pointer"
                >
                  <option value="data_driven">Data-Driven Algorithmic (Recommended)</option>
                  <option value="last_click">Last-Touch Attribution</option>
                  <option value="first_click">First-Touch Discovery</option>
                  <option value="linear">Linear Equal Weight</option>
                </select>
              </div>

              {/* Refresh Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bid Optimization Polling Frequency
                </label>
                <select
                  value={prefsForm.refreshRate}
                  onChange={(e) => setPrefsForm({ ...prefsForm, refreshRate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all cursor-pointer"
                >
                  <option value="14ms">14ms Ultra Low-Latency</option>
                  <option value="30s">30 Seconds Standard</option>
                  <option value="1m">1 Minute Eco-Pacing</option>
                </select>
              </div>
            </div>

            {/* Min ROAS Alert */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Stop-Loss Minimum Target ROAS Threshold
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="10.0"
                  value={prefsForm.minRoasAlert}
                  onChange={(e) => setPrefsForm({ ...prefsForm, minRoasAlert: e.target.value })}
                  className="w-36 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb]"
                />
                <span className="text-xs text-slate-500">
                  ADOS alerts or freezes campaigns falling below this ROAS.
                </span>
              </div>
            </div>

            {/* Automation Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={prefsForm.autoPauseFatigue}
                  onChange={(e) => setPrefsForm({ ...prefsForm, autoPauseFatigue: e.target.checked })}
                  className="w-4 h-4 text-[#2563eb] rounded border-slate-300 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Auto-Pause Creative Fatigue</div>
                  <div className="text-[11px] text-slate-500">
                    Automatically pause ad variants when view-through drops &gt; 45% in 48 hours.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={prefsForm.emailAlerts}
                  onChange={(e) => setPrefsForm({ ...prefsForm, emailAlerts: e.target.checked })}
                  className="w-4 h-4 text-[#2563eb] rounded border-slate-300 focus:ring-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Critical Anomaly Email Alerts</div>
                  <div className="text-[11px] text-slate-500">
                    Instant notification if daily budget spend exceeds normal velocity by &gt; 25%.
                  </div>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex justify-end">
              <button
                type="submit"
                disabled={savingPrefs}
                className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingPrefs ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Automation Preferences</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SECURITY & API KEYS                                                */}
      {/* ========================================================================= */}
      {activeTab === "security" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Security & Live API Credentials</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your programmatic ADOS secret keys and view hardware-grade encryption status.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>256-bit AES-GCM Encrypted Token Isolation Active across all connected networks.</span>
          </div>

          {/* Live API Key */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Live Workspace API Secret Key</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={prefsForm.apiKey}
                readOnly
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 select-all"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Copy API key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                disabled={regeneratingKey}
                onClick={handleRegenerateKey}
                className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regeneratingKey ? "animate-spin" : ""}`} />
                <span>Rotate Key</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Never share your secret key publicly. Use it for backend server-to-server webhook verification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
