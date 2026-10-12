import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import PlatformLogo from "./PlatformLogo";
import {
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  MousePointerClick,
  Eye,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  Building2,
  Trash2,
  Sparkles,
  Zap,
  Copy,
} from "lucide-react";

export default function GoogleAdsIntegrationPanel({ onToast }) {
  const [statusData, setStatusData] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncingAccounts, setIsSyncingAccounts] = useState(false);
  const [isSelectingAccount, setIsSelectingAccount] = useState(false);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Campaigns & Date Filter state
  const [campaignData, setCampaignData] = useState(null);
  const [dateRange, setDateRange] = useState("LAST_30_DAYS");
  const [campaignError, setCampaignError] = useState(null);
  const [accountError, setAccountError] = useState(null);

  // Account selector dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  const handleCopyRedirectUri = () => {
    navigator.clipboard.writeText("http://localhost:5000/api/v1/google-ads/callback");
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2500);
  };

  useEffect(() => {
    loadStatus();
  }, []);

  // Fetch integration connection status
  const loadStatus = async () => {
    try {
      setIsLoadingStatus(true);
      const res = await api.getGoogleAdsStatus();
      setStatusData(res);
      setAccountError(null);

      // If already connected with an active customer account, fetch campaigns
      if (res?.isConnected && res?.selectedAccount?.id) {
        loadCampaigns(dateRange);
      }
    } catch (err) {
      console.warn("Notice: Failed to load Google Ads status:", err.message);
      setAccountError(err.message);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // Initiate OAuth authorization flow
  const handleConnectGoogleAds = async () => {
    try {
      setIsConnecting(true);
      const res = await api.getGoogleAdsAuthUrl();
      if (res?.authUrl) {
        // Redirect browser to Google's consent screen
        window.location.href = res.authUrl;
      } else {
        throw new Error("Unable to generate Google Ads authorization link.");
      }
    } catch (err) {
      onToast?.(err.message || "Failed to initiate Google Ads authorization.");
      setIsConnecting(false);
    }
  };

  // Synchronize / Discover accessible accounts
  const handleSyncAccounts = async () => {
    try {
      setIsSyncingAccounts(true);
      setAccountError(null);
      const accounts = await api.getGoogleAdsAccounts();
      setStatusData((prev) => ({
        ...prev,
        accessibleCustomers: accounts,
      }));
      onToast?.(`Discovered ${accounts.length} accessible customer account(s).`);
    } catch (err) {
      setAccountError(err.message);
      onToast?.(err.message);
    } finally {
      setIsSyncingAccounts(false);
    }
  };

  // Select active customer account
  const handleSelectAccount = async (account) => {
    try {
      setIsSelectingAccount(true);
      setIsDropdownOpen(false);
      setAccountError(null);
      const updated = await api.selectGoogleAdsAccount(account.id, account.manager ? account.id : null);
      setStatusData(updated);
      onToast?.(`Active account set to: ${account.descriptiveName}`);
      // Refresh campaigns for newly selected account
      loadCampaigns(dateRange);
    } catch (err) {
      setAccountError(err.message);
      onToast?.(err.message);
    } finally {
      setIsSelectingAccount(false);
    }
  };

  // Fetch real-time campaign performance using GAQL
  const loadCampaigns = async (selectedRange = dateRange) => {
    try {
      setIsLoadingCampaigns(true);
      setCampaignError(null);
      const res = await api.getGoogleAdsCampaigns({ dateRange: selectedRange });
      setCampaignData(res);
    } catch (err) {
      console.warn("Notice: Failed to load campaigns:", err.message);
      setCampaignError(err.message);
      setCampaignData(null);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  // Change date filter
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    loadCampaigns(newRange);
  };

  // Disconnect Google Ads
  const handleDisconnect = async () => {
    if (
      !window.confirm(
        "Are you sure you want to disconnect Google Ads? ADOS will remove your access tokens and pause automated reporting."
      )
    ) {
      return;
    }

    try {
      setIsDisconnecting(true);
      await api.disconnectGoogleAds();
      setStatusData((prev) => ({
        ...prev,
        isConnected: false,
        status: "NOT_CONNECTED",
        selectedAccount: null,
        accessibleCustomers: [],
      }));
      setCampaignData(null);
      onToast?.("Google Ads integration disconnected successfully.");
    } catch (err) {
      onToast?.(err.message || "Failed to disconnect Google Ads.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#ff4a22] animate-spin" />
        <p className="text-xs font-bold text-slate-500">Checking Google Ads integration telemetry...</p>
      </div>
    );
  }

  const isConnected = statusData?.isConnected;
  const selectedAccount = statusData?.selectedAccount;
  const accessibleCustomers = statusData?.accessibleCustomers || [];

  return (
    <div className="space-y-6 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111113] via-[#1a1a20] to-[#25252e] text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Google Ads API v18</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Developer Testing Mode</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-3">
            <PlatformLogo platform="google" size="md" />
            <span>Google Ads Integration & Live Reporting</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Authorize your Google Ads MCC or client accounts to pull live GAQL campaign performance, telemetry metrics, and multi-network attribution directly into ADOS.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {!isConnected ? (
            <button
              type="button"
              onClick={handleConnectGoogleAds}
              disabled={isConnecting}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing with Google...</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Connect Google Ads Account</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSyncAccounts}
                disabled={isSyncingAccounts}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                title="Re-synchronize accessible accounts list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAccounts ? "animate-spin" : ""}`} />
                <span>Sync Accounts</span>
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="px-4 py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-bold border border-red-500/30 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                title="Disconnect Google Ads integration"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Developer Testing Mode Advisory Note */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Developer Testing Mode Notice:</span> Your Google Ads API access is currently in{" "}
          <strong className="underline">Test</strong> access level while Standard/Explorer access is under review.
          Google Ads API allows calls only against <strong>Google Ads Test Accounts</strong> (or a test MCC). Once your Google approval completes, production accounts will unlock automatically with the same credentials.
        </div>
      </div>

      {/* Google Cloud Authorized Redirect URI Helper */}
      {!isConnected && (
        <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-950 leading-relaxed">
              <span className="font-bold">Google Cloud Console Setup:</span> To prevent <span className="font-mono text-red-600 font-semibold">Error 400: redirect_uri_mismatch</span>, ensure your OAuth 2.0 Client has this exact URI in <span className="font-semibold underline">Authorized redirect URIs</span>:
              <div className="mt-1.5 font-mono text-[11px] bg-white/90 border border-blue-200 px-3 py-1.5 rounded-xl text-blue-800 select-all inline-block break-all">
                http://localhost:5000/api/v1/google-ads/callback
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyRedirectUri}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            {copiedUri ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUri ? "Copied!" : "Copy URI"}</span>
          </button>
        </div>
      )}

      {/* Main Integration State */}
      {!isConnected ? (
        /* Not Connected State */
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xs text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center">
            <PlatformLogo platform="google" size="lg" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-extrabold text-[#111113]">No Google Ads Account Connected</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect your Google Ads account to authorize read-only campaign telemetry, impressions, clicks, cost, and conversions via Google Ads API v18.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Read-Only Scope</span>
              </div>
              <p className="text-[11px] text-slate-500">Only views campaigns & performance metrics. Never modifies ads or spends money.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tokens Encrypted</span>
              </div>
              <p className="text-[11px] text-slate-500">AES-256-GCM encryption at rest on backend. Never leaked to client or logs.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Offline Access</span>
              </div>
              <p className="text-[11px] text-slate-500">Automatic token refresh for continuous background telemetry reporting.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConnectGoogleAds}
            disabled={isConnecting}
            className="px-6 py-3 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-extrabold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <PlatformLogo platform="google" size="xs" />
            <span>Connect Google Ads Now</span>
          </button>
        </div>
      ) : (
        /* Connected State */
        <div className="space-y-6">
          {/* Account Details & Switcher Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <PlatformLogo platform="google" size="md" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#111113]">
                      {selectedAccount ? selectedAccount.name : "No Customer Account Selected"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Connected</span>
                    </span>
                    {selectedAccount?.isTestAccount && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        Test Account
                      </span>
                    )}
                    {selectedAccount?.isManager && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        Manager / MCC
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {statusData?.connectedEmail && <span>Authorized by: <strong>{statusData.connectedEmail}</strong> • </span>}
                    {selectedAccount ? `Customer ID: ${selectedAccount.formattedId} • ${selectedAccount.currency} • ${selectedAccount.timeZone}` : "Please select an account below to fetch live campaign data"}
                  </p>
                </div>
              </div>

              {/* Account Dropdown Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-between"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#ff4a22]" />
                  <span>{selectedAccount ? "Switch Customer Account" : "Select Customer Account"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 max-h-72 overflow-y-auto">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Accessible Customers ({accessibleCustomers.length})</span>
                      <button
                        type="button"
                        onClick={handleSyncAccounts}
                        className="text-[#ff4a22] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {accessibleCustomers.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No customer accounts discovered yet. Click "Refresh" or ensure your Google user has Google Ads permissions.
                      </div>
                    ) : (
                      accessibleCustomers.map((cust) => (
                        <div
                          key={cust.id}
                          onClick={() => handleSelectAccount(cust)}
                          className={`px-3.5 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors ${
                            selectedAccount?.id === cust.id ? "bg-orange-50/50" : ""
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{cust.descriptiveName}</span>
                              {cust.testAccount && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">Test</span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {cust.formattedId} • {cust.currencyCode}
                            </span>
                          </div>
                          {selectedAccount?.id === cust.id && (
                            <Check className="w-4 h-4 text-[#ff4a22] stroke-[3]" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Discovery Error Banner (if any) */}
            {accountError && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Google Ads API Warning: </span>
                  {accountError}
                </div>
              </div>
            )}
          </div>

          {/* Campaign Performance & Analytics Dashboard */}
          {selectedAccount ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              {/* Date Filter & Metrics Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#111113] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#ff4a22]" />
                    <span>Live GAQL Campaign Performance</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time statistics queried directly via Google Ads Query Language
                  </p>
                </div>

                {/* Date Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  {[
                    { id: "LAST_7_DAYS", label: "7D" },
                    { id: "LAST_14_DAYS", label: "14D" },
                    { id: "LAST_30_DAYS", label: "30D" },
                    { id: "THIS_MONTH", label: "This Month" },
                    { id: "ALL_TIME", label: "All Time" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleDateRangeChange(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        dateRange === filter.id
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => loadCampaigns(dateRange)}
                    disabled={isLoadingCampaigns}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Refresh Campaign Metrics"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCampaigns ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Campaign Error Banner */}
              {campaignError && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">Google Ads Query Diagnostic:</div>
                    <p>{campaignError}</p>
                    <p className="text-[11px] text-amber-700">
                      Tip: If this is a newly created test account, create a test campaign inside the Google Ads Test UI or grant viewer permissions to this user.
                    </p>
                  </div>
                </div>
              )}

              {/* Aggregate KPI Stat Cards */}
              {campaignData?.metricsSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spend</span>
                    <span className="text-base font-extrabold text-[#111113] mt-1 block">
                      {selectedAccount.currency === "INR" ? "₹" : "$"}{campaignData.metricsSummary.totalCost}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Impressions</span>
                    <span className="text-base font-extrabold text-[#111113] mt-1 block">
                      {campaignData.metricsSummary.totalImpressions.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clicks</span>
                    <span className="text-base font-extrabold text-[#111113] mt-1 block">
                      {campaignData.metricsSummary.totalClicks.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average CTR</span>
                    <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                      {campaignData.metricsSummary.overallCtr}%
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. CPC</span>
                    <span className="text-base font-extrabold text-slate-800 mt-1 block">
                      {selectedAccount.currency === "INR" ? "₹" : "$"}{campaignData.metricsSummary.overallAvgCpc}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conversions</span>
                    <span className="text-base font-extrabold text-purple-600 mt-1 block">
                      {campaignData.metricsSummary.totalConversions}
                    </span>
                  </div>
                </div>
              )}

              {/* Campaigns Data Table */}
              {isLoadingCampaigns ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 text-[#ff4a22] animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-500">Querying campaigns via Google Ads API...</p>
                </div>
              ) : campaignData?.campaigns?.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-700">No campaigns found for the selected date range ({dateRange})</h4>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    This Google Ads account currently has zero active or past campaigns recorded in this timeframe.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Campaign Name</th>
                        <th className="pb-3 font-semibold">Channel</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Impressions</th>
                        <th className="pb-3 font-semibold text-right">Clicks</th>
                        <th className="pb-3 font-semibold text-right">Cost</th>
                        <th className="pb-3 font-semibold text-right">CTR</th>
                        <th className="pb-3 font-semibold text-right">Avg CPC</th>
                        <th className="pb-3 font-semibold text-right">Conv.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(campaignData?.campaigns || []).map((camp) => (
                        <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pr-4">
                            <div className="font-bold text-slate-900">{camp.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {camp.id}</span>
                          </td>
                          <td className="py-3 pr-4 font-semibold text-slate-600">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold">
                              {camp.channelType}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                camp.status === "ENABLED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : camp.status === "PAUSED"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {camp.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-semibold text-slate-700">
                            {camp.impressions.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-semibold text-slate-700">
                            {camp.clicks.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-extrabold text-slate-900">
                            {selectedAccount.currency === "INR" ? "₹" : "$"}{camp.cost}
                          </td>
                          <td className="py-3 text-right font-semibold text-emerald-600">
                            {camp.ctrPercent}%
                          </td>
                          <td className="py-3 text-right font-semibold text-slate-700">
                            {selectedAccount.currency === "INR" ? "₹" : "$"}{camp.averageCpc}
                          </td>
                          <td className="py-3 text-right font-bold text-purple-600">
                            {camp.conversions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-sm font-extrabold text-slate-800">Select an Account to View Campaigns</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Use the account switcher above to pick an accessible customer account discovered from your Google profile.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
