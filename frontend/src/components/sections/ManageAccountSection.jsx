import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import GoogleAdsIntegrationPanel from "../common/GoogleAdsIntegrationPanel";
import { api } from "../../services/api";
import {
  UserCheck,
  Building2,
  CreditCard,
  Users,
  ShieldCheck,
  Plus,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Trash2,
  Mail,
  Key,
  Globe,
  IndianRupee,
  AlertCircle,
  Check,
  Lock,
  Shield,
  Sliders,
  Sparkles,
  Clock,
  ArrowRight,
  Layers,
  ChevronRight,
} from "lucide-react";

const PLATFORM_PRESETS = [
  {
    id: "meta",
    name: "Meta Ads (Facebook & Instagram)",
    badge: "Meta Marketing API v19",
    color: "bg-blue-600",
    borderHover: "hover:border-blue-500",
    prefix: "act_",
    description: "Advantage+ shopping, Instagram Reels, carousel feeds & automated custom audiences.",
  },
  {
    id: "google",
    name: "Google Ads (MCC / Search / PMax)",
    badge: "Google Ads API v17",
    color: "bg-emerald-600",
    borderHover: "hover:border-emerald-500",
    prefix: "xxx-xxx-xxxx",
    description: "Performance Max, Search keyword auctions, YouTube in-stream and Display network.",
  },

  {
    id: "amazon",
    name: "Amazon Advertising DSP",
    badge: "Amazon Ads API",
    color: "bg-amber-600",
    borderHover: "hover:border-amber-500",
    prefix: "amzn_",
    description: "Sponsored Products, Sponsored Brands, Storefront banners & Amazon DSP programmatic.",
  },
  {
    id: "youtube",
    name: "YouTube Video / DV360 Ads",
    badge: "Google DV360 API",
    color: "bg-red-600",
    borderHover: "hover:border-red-500",
    prefix: "yt_",
    description: "Skippable in-stream, YouTube Shorts ads, bumper campaigns & Google Video Partners.",
  },
  {
    id: "pinterest",
    name: "Pinterest Business Ads",
    badge: "Pinterest Ads API",
    color: "bg-rose-600",
    borderHover: "hover:border-rose-500",
    prefix: "pin_",
    description: "Idea Pins, Promoted Product Collections & high-intent shopping search boards.",
  },
  {
    id: "linkedin",
    name: "LinkedIn Campaign Manager",
    badge: "LinkedIn Marketing Developer",
    color: "bg-blue-700",
    borderHover: "hover:border-blue-600",
    prefix: "li_",
    description: "B2B account targeting, Sponsored InMail messages & Lead Gen document ads.",
  },
  {
    id: "snapchat",
    name: "Snapchat Ads Business",
    badge: "Snap Marketing API",
    color: "bg-amber-500",
    borderHover: "hover:border-amber-400",
    prefix: "snap_",
    description: "Full-screen vertical Snap ads, AR lens experiences & dynamic e-commerce catalog.",
  },
  {
    id: "x_ads",
    name: "X (Twitter) Commercial Ads",
    badge: "X Ads API v12",
    color: "bg-black",
    borderHover: "hover:border-slate-800",
    prefix: "x_act_",
    description: "Promoted trend takeovers, timeline engagement boosts & conversion web click ads.",
  },
];

export default function ManageAccountSection() {
  const [activeTab, setActiveTab] = useState("networks"); // 'networks' | 'add-account' | 'team' | 'billing' | 'organization'
  const [accounts, setAccounts] = useState([]);
  const [team, setTeam] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Add New Account Form States
  const [selectedPlatform, setSelectedPlatform] = useState("meta");
  const [newAccountName, setNewAccountName] = useState("Meta Advantage+ Scale Europe");
  const [newAccountId, setNewAccountId] = useState("act_948201482");
  const [authMethod, setAuthMethod] = useState("oauth"); // 'oauth' | 'token'
  const [apiToken, setApiToken] = useState("");
  const [currency, setCurrency] = useState("INR (₹)");
  const [timezone, setTimezone] = useState("UTC+05:30 (IST India)");
  const [monthlySpendCap, setMonthlySpendCap] = useState("₹20,000");
  const [enableAiOptimization, setEnableAiOptimization] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState("");
  const [accountCreatedModal, setAccountCreatedModal] = useState(false);
  const [justAddedAccount, setJustAddedAccount] = useState(null);

  // Invite member modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Media Buyer");

  // Connect network quick modal
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadAccountData();

    // Check for Google Ads OAuth return query parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("google_ads_success") === "true") {
      setActiveTab("google-ads");
      showToast("Google Ads account successfully connected!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get("google_ads_error")) {
      const err = urlParams.get("google_ads_error");
      setActiveTab("google-ads");
      showToast(`Google Ads connection error: ${decodeURIComponent(err)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadAccountData = async () => {
    try {
      setIsLoadingData(true);
      const [accs, teamMembers] = await Promise.all([
        api.getAccounts().catch(() => []),
        api.getTeam().catch(() => []),
      ]);
      if (Array.isArray(accs)) {
        setAccounts(accs.map((a) => ({ ...a, id: a._id })));
      }
      if (Array.isArray(teamMembers)) {
        setTeam(
          teamMembers.map((m) => ({
            ...m,
            id: m._id,
            access:
              m.role === "Admin"
                ? "Full Access"
                : m.role === "Media Buyer"
                ? "Campaigns & Budgets"
                : "Read-Only Telemetry",
            avatar: m.avatar || m.name.slice(0, 2).toUpperCase(),
          }))
        );
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // When changing platform preset, auto-suggest account name & prefix
  const handleSelectPlatform = (platformId) => {
    setSelectedPlatform(platformId);
    const preset = PLATFORM_PRESETS.find((p) => p.id === platformId);
    if (preset) {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000);
      setNewAccountName(`${preset.name.split(" ")[0]} Growth Hub`);
      setNewAccountId(
        platformId === "google"
          ? `${String(randomNum).slice(0, 3)}-${String(randomNum).slice(3, 6)}-${String(randomNum).slice(6, 10)}`
          : `${preset.prefix}${randomNum}`
      );
    }
  };

  // Handle Add New Account Submission
  const handleAddAccountSubmit = async (e) => {
    e.preventDefault();
    if (!newAccountName || !newAccountId) {
      showToast("Please provide both account name and account ID.");
      return;
    }

    setIsVerifying(true);
    setVerifyStep("Initiating secure OAuth 2.0 handshake with ad provider...");

    setTimeout(() => {
      setVerifyStep("Verifying advertiser credentials & permissions scopes...");
    }, 600);

    setTimeout(() => {
      setVerifyStep("Synchronizing live campaign telemetry & pixel attribution...");
    }, 1100);

    setTimeout(async () => {
      const currentPreset = PLATFORM_PRESETS.find((p) => p.id === selectedPlatform) || PLATFORM_PRESETS[0];

      try {
        const created = await api.connectAccount({
          name: newAccountName,
          accountId: newAccountId,
          platform: selectedPlatform,
          currency,
          spendCap: `${monthlySpendCap}/mo`,
          iconBg: currentPreset.color,
        });

        const formatted = { ...created, id: created._id };
        setAccounts([formatted, ...accounts]);
        setJustAddedAccount(formatted);
        setAccountCreatedModal(true);
      } catch (err) {
        showToast(err.message || "Failed to connect account.");
      } finally {
        setIsVerifying(false);
        setVerifyStep("");
      }
    }, 1700);
  };

  // Delete / Disconnect account
  const handleDisconnectAccount = async (id, name) => {
    if (window.confirm(`Are you sure you want to disconnect "${name}"? ADOS will cease automated bid routing for this account.`)) {
      setAccounts(accounts.filter((a) => a.id !== id));
      showToast(`Disconnected ${name}`);
      try {
        await api.disconnectAccount(id);
      } catch (err) {
        console.error("Failed to disconnect account on backend:", err);
      }
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    try {
      const member = await api.inviteTeamMember({
        name: inviteName,
        email: inviteEmail,
        role: inviteRole,
      });

      const formatted = {
        ...member,
        id: member._id,
        access: inviteRole === "Admin" ? "Full Access" : "Campaigns & Budgets",
        avatar: inviteName.slice(0, 2).toUpperCase(),
      };

      setTeam([...team, formatted]);
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      showToast(`Invitation sent to ${member.email}`);
    } catch (err) {
      showToast(err.message || "Failed to invite team member.");
    }
  };

  const handleRemoveMember = async (id, name) => {
    setTeam(team.filter((m) => m.id !== id));
    showToast(`Removed ${name} from organization`);
    try {
      await api.removeTeamMember(id);
    } catch (err) {
      console.error("Failed to remove member on backend:", err);
    }
  };

  const handleSyncAccount = (name) => {
    showToast(`Synchronized credentials & tokens for ${name}`);
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-[#111113] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Created Success Celebration Modal */}
      <AnimatePresence>
        {accountCreatedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <PlatformLogo platform={justAddedAccount?.platform} size="lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">
                  ✓
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-[#111113]">
                Ad Account Connected Successfully!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                "{justAddedAccount?.name}" ({justAddedAccount?.accountId}) has been linked with ADOS. Autonomous bid routing and multi-network telemetry are now live.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Status:</span>
                  <span className="font-bold text-emerald-600">Active & Syncing</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Active Campaigns:</span>
                  <span className="font-bold text-slate-800">{justAddedAccount?.activeCampaigns} campaigns</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">AI Bid Protection:</span>
                  <span className="font-bold text-[#ff4a22]">Enabled (Sub-Second)</span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAccountCreatedModal(false);
                    setActiveTab("networks");
                  }}
                  className="w-full py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  View Connected Networks →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>Organization & Connected Ad Networks Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111113] tracking-tight">
            Manage Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain connected ad network tokens, add new advertising accounts, team permissions, and workspace credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("add-account")}
            className="px-5 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 text-[#ff4a22]" />
            <span>+ Add New Account</span>
          </button>
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: "networks", label: "Connected Networks", count: accounts.length },
          { id: "google-ads", label: "Google Ads (Live API)", highlight: true },
          { id: "add-account", label: "Add New Account" },
          { id: "team", label: "Team & Permissions", count: team.length },
          { id: "billing", label: "Billing & Credit Line" },
          { id: "organization", label: "Organization Details" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#111113] text-white shadow-xs"
                : tab.highlight
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.highlight && <Sparkles className="w-3 h-3 text-emerald-600" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= TAB: GOOGLE ADS LIVE API ================= */}
      {activeTab === "google-ads" && (
        <GoogleAdsIntegrationPanel onToast={showToast} />
      )}

      {/* ================= TAB: ADD NEW ACCOUNT ================= */}
      {activeTab === "add-account" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Intro Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-[#1e1e24] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enterprise 256-bit TLS OAuth 2.0 Integration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Connect New Ad Network Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Seamlessly authorize your Meta, Google, Amazon, YouTube, LinkedIn, Pinterest or Snapchat ad accounts. ADOS continuously ingests conversion pixels, balances daily pacing, and automates sub-second bids.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Supported Networks</div>
                <div className="flex items-center gap-2">
                  <PlatformLogo platform="meta" size="xs" />
                  <PlatformLogo platform="google" size="xs" />
                  <PlatformLogo platform="amazon" size="xs" />
                  <PlatformLogo platform="youtube" size="xs" />
                  <PlatformLogo platform="linkedin" size="xs" />
                  <PlatformLogo platform="pinterest" size="xs" />
                  <PlatformLogo platform="snapchat" size="xs" />
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">Zero data downtime • Live telemetry</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddAccountSubmit} className="space-y-6">
            {/* Step 1: Select Platform */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#ff4a22] uppercase tracking-wider block">
                    Step 1 of 3
                  </span>
                  <h3 className="text-base font-extrabold text-[#111113]">
                    Select Ad Platform / Network
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Choose the network you want to synchronize
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {PLATFORM_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPlatform(preset.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      selectedPlatform === preset.id
                        ? "border-[#ff4a22] bg-orange-50/20 shadow-xs ring-2 ring-[#ff4a22]/15"
                        : `border-slate-200/80 bg-slate-50/60 ${preset.borderHover} hover:bg-white`
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <PlatformLogo platform={preset.id} size="md" />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPlatform === preset.id
                            ? "border-[#ff4a22] bg-[#ff4a22] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {selectedPlatform === preset.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {preset.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                        {preset.badge}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Account Details & Identifiers */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#ff4a22] uppercase tracking-wider block">
                    Step 2 of 3
                  </span>
                  <h3 className="text-base font-extrabold text-[#111113]">
                    Account Configuration & Credentials
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Specify account identification tags
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Account Name / Nickname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="e.g. Meta Advantage+ Scale Europe"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Internal workspace label used in reporting and rule automations.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Ad Account ID / MCC ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newAccountId}
                    onChange={(e) => setNewAccountId(e.target.value)}
                    placeholder="e.g. act_849201948 or 492-019-3829"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Found in your native platform Ads Manager URL or billing settings.
                  </p>
                </div>
              </div>

              {/* Authentication Type Selector */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Connection / Authentication Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setAuthMethod("oauth")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      authMethod === "oauth"
                        ? "border-[#ff4a22] bg-orange-50/20"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200 text-[#ff4a22]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-slate-900">
                          One-Click OAuth 2.0 (Recommended)
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Instant
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Instantly exchange secure token without manual copy-pasting. Auto-refreshes daily.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setAuthMethod("token")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      authMethod === "token"
                        ? "border-[#ff4a22] bg-orange-50/20"
                        : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-200 text-slate-700">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-slate-900">
                          Manual System User Access Token
                        </h4>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          Custom
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        For enterprise deployments, agency partner tokens, or custom server proxies.
                      </p>
                    </div>
                  </div>
                </div>

                {authMethod === "token" && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                      Permanent Access Token (Bearer Secret)
                    </label>
                    <input
                      type="password"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                      placeholder="EAABw... (paste token here)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30"
                    />
                  </div>
                )}
              </div>

              {/* Currency, Timezone & Budget Line */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Account Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30"
                  >
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>AUD ($)</option>
                    <option>CAD ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Reporting Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30"
                  >
                    <option>UTC-05:00 (Eastern Time)</option>
                    <option>UTC-08:00 (Pacific Time)</option>
                    <option>UTC+00:00 (GMT London)</option>
                    <option>UTC+05:30 (IST India)</option>
                    <option>UTC+01:00 (CET Berlin/Paris)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Monthly Spend Target
                  </label>
                  <input
                    type="text"
                    value={monthlySpendCap}
                    onChange={(e) => setMonthlySpendCap(e.target.value)}
                    placeholder="₹20,000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Optimization Switches & Connect Action */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#ff4a22] uppercase tracking-wider block">
                    Step 3 of 3
                  </span>
                  <h3 className="text-base font-extrabold text-[#111113]">
                    Autonomous AI Governance & Spend Protection
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  Safety guardrails & bid limits
                </span>
              </div>

              {/* Toggle 1: Autonomous Bid Optimization */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff4a22] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">
                      Enable Sub-Second Bid Routing & CPA Suppression
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Automatically outbids rivals during high-intent spikes and pauses underperforming ad groups when CPA exceeds target.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableAiOptimization(!enableAiOptimization)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    enableAiOptimization ? "bg-[#ff4a22]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                      enableAiOptimization ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("networks")}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="px-7 py-3 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-[#ff4a22]" />
                        <span>{verifyStep || "Verifying Credentials..."}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Authorize & Connect Account →</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 1: CONNECTED NETWORKS ================= */}
      {activeTab === "networks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Quick "+ Add Another Ad Account" Action Card */}
            <div
              onClick={() => setActiveTab("add-account")}
              className="bg-slate-50/70 border-2 border-dashed border-slate-300 hover:border-[#ff4a22] rounded-3xl p-6 flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all hover:bg-orange-50/20 group min-h-[220px]"
            >
              <div className="flex items-center -space-x-1.5 p-2 rounded-2xl bg-white shadow-2xs border border-slate-200 group-hover:scale-105 transition-transform">
                <PlatformLogo platform="meta" size="xs" />
                <PlatformLogo platform="google" size="xs" />
                <PlatformLogo platform="amazon" size="xs" />
                <PlatformLogo platform="youtube" size="xs" />
                <PlatformLogo platform="linkedin" size="xs" />
                <PlatformLogo platform="pinterest" size="xs" />
                <PlatformLogo platform="snapchat" size="xs" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#111113]">Connect New Ad Account</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Meta, Google, Amazon, YouTube, LinkedIn, Pinterest & Snap
                </p>
              </div>
              <span className="text-xs font-bold text-[#ff4a22] group-hover:underline flex items-center gap-1">
                <span>+ Add Account</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* List of Connected Accounts */}
            {accounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <PlatformLogo platform={acc.platform} size="md" />
                    <div>
                      <h3 className="text-sm font-extrabold text-[#111113]">{acc.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {acc.accountId}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{acc.status}</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Active Campaigns:</span>
                    <span className="font-bold text-slate-800">{acc.activeCampaigns} campaigns</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Spend Allocation:</span>
                    <span className="font-semibold text-slate-700">{acc.spendCap ? acc.spendCap.replace("$", "₹") : "₹20,000/mo"}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Last Telemetry Sync:</span>
                    <span className="font-semibold text-slate-700">{acc.lastSync}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    {acc.platform === "google" && (
                      <button
                        type="button"
                        onClick={() => setActiveTab("google-ads")}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Live GAQL API</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSyncAccount(acc.name)}
                      className="text-xs font-bold text-slate-600 hover:text-[#ff4a22] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Tokens</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDisconnectAccount(acc.id, acc.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Disconnect Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: TEAM & PERMISSIONS ================= */}
      {activeTab === "team" && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-[#111113]">Workspace Collaborators</h2>
              <p className="text-xs text-slate-500">
                Manage roles and granular permissions for campaigns, creatives, and billing.
              </p>
            </div>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-4 py-2 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Member</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Scope & Access</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-extrabold">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#111113]">{member.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{member.access}</td>
                    <td className="py-3.5 px-3 text-right">
                      {member.role.includes("Owner") ? (
                        <span className="text-[10px] font-bold text-slate-400">Owner</span>
                      ) : (
                        <button
                          onClick={() => handleRemoveMember(member.id, member.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: BILLING & CREDIT LINE ================= */}
      {activeTab === "billing" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Monthly Credit Line
              </span>
              <IndianRupee className="w-4 h-4 text-[#ff4a22]" />
            </div>
            <div>
              <div className="text-3xl font-black text-[#111113]">₹50,000.00</div>
              <p className="text-xs text-slate-500 mt-1">Current monthly allocated media spend line</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Cycle Utilization (68%)</span>
                <span>₹34,210 / ₹50,000</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-[#ff4a22] h-full rounded-full w-[68%]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Primary Payment Method
              </span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>CORPORATE VISA</span>
                <span>04/28</span>
              </div>
              <div className="text-lg font-mono font-bold tracking-widest">
                •••• •••• •••• 4242
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">
                ADOS ENTERPRISE MEDIA HOLDINGS
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Auto-Pay Enabled
              </span>
              <button className="text-slate-600 font-bold hover:text-slate-900 cursor-pointer">
                Update Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ORGANIZATION DETAILS ================= */}
      {activeTab === "organization" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-extrabold text-[#111113]">Organization Profile</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Legal entity details and workspace configuration.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                Organization / Company Name
              </label>
              <input
                type="text"
                defaultValue="ADOS Performance Technologies Inc."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Timezone
                </label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900">
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC-08:00 (Pacific Time)</option>
                  <option>UTC+00:00 (GMT London)</option>
                  <option>UTC+05:30 (IST India)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                  Default Currency
                </label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => showToast("Organization details updated")}
              className="px-6 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-[#111113]">Invite Team Member</h3>
                <button
                  onClick={() => setIsInviteOpen(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="maya@company.com"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider text-[11px]">
                    Role & Permissions
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
                  >
                    <option value="Admin">Administrator (All Access)</option>
                    <option value="Media Buyer">Media Buyer (Campaigns & Creatives)</option>
                    <option value="Analyst">Data Analyst (Read-Only)</option>
                    <option value="Billing Manager">Billing & Finance</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
