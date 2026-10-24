import React, { useState, useEffect } from "react";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Trash2,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Link2,
  Layers,
  ChevronDown,
} from "lucide-react";

export default function AdAccountsSection() {
  const [googleStatus, setGoogleStatus] = useState(null);
  const [metaStatus, setMetaStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState({ open: false, platform: null });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    loadStatuses();

    // Check OAuth return query parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get("google_ads_success") === "true") {
      showToast("Google Ads account authorized and connected successfully!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("google_ads_error")) {
      showToast(`Google Ads error: ${decodeURIComponent(params.get("google_ads_error"))}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("meta_ads_success") === "true") {
      showToast("Meta Ads account authorized and connected successfully!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("meta_ads_error")) {
      showToast(`Meta Ads error: ${decodeURIComponent(params.get("meta_ads_error"))}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const loadStatuses = async () => {
    try {
      setIsLoading(true);
      const [gRes, mRes] = await Promise.all([
        api.getGoogleAdsStatus().catch((err) => ({ isConnected: false, error: err.message })),
        api.getMetaAdsStatus().catch((err) => ({ isConnected: false, error: err.message })),
      ]);
      setGoogleStatus(gRes);
      setMetaStatus(mRes);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Initiation
  const handleConnectGoogle = async () => {
    try {
      const data = await api.getGoogleAdsAuthUrl();
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      showToast(`Unable to start Google OAuth: ${err.message}`);
    }
  };

  // Meta OAuth Initiation
  const handleConnectMeta = async () => {
    try {
      const data = await api.getMetaAdsAuthUrl();
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (err) {
      showToast(`Unable to start Meta OAuth: ${err.message}`);
    }
  };

  // Select customer account
  const handleSelectGoogleCustomer = async (customerId) => {
    try {
      await api.selectGoogleAdsAccount(customerId);
      showToast(`Selected Google Ads Customer ID: ${customerId}`);
      loadStatuses();
    } catch (err) {
      showToast(err.message || "Failed to select Google customer account.");
    }
  };

  const handleSelectMetaAccount = async (accountId) => {
    try {
      await api.selectMetaAdsAccount(accountId);
      showToast(`Selected Meta Ad Account: ${accountId}`);
      loadStatuses();
    } catch (err) {
      showToast(err.message || "Failed to select Meta ad account.");
    }
  };

  // Disconnect handler
  const confirmDisconnect = async () => {
    const platform = disconnectModal.platform;
    setDisconnectModal({ open: false, platform: null });

    try {
      if (platform === "google") {
        await api.disconnectGoogleAds();
        showToast("Google Ads account disconnected.");
      } else if (platform === "meta") {
        await api.disconnectMetaAds();
        showToast("Meta Ads account disconnected.");
      }
      loadStatuses();
    } catch (err) {
      showToast(err.message || "Failed to disconnect account.");
    }
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await loadStatuses();
      showToast("Synchronized live account credentials and metadata.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn select-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#0f172a] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {disconnectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-[#0f172a]">
              Disconnect {disconnectModal.platform === "google" ? "Google Ads" : "Meta Ads"}?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will remove authorized tokens and stop synchronizing advertising analytics from this platform.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDisconnectModal({ open: false, platform: null })}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDisconnect}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Ad Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authorize official OAuth 2.0 connections for Google Ads and Meta Ads to power your unified analytics.
          </p>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isSyncing}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin" : ""}`} />
          <span>Sync Connections</span>
        </button>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= GOOGLE ADS CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="google" size="md" />
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Google Ads</h3>
                  <p className="text-xs text-slate-400">Search, Display, Performance Max & YouTube</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  googleStatus?.isConnected
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    googleStatus?.isConnected ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                <span>{googleStatus?.isConnected ? "Connected" : "Not Connected"}</span>
              </span>
            </div>

            {/* Connection Information */}
            <div className="py-5 space-y-3.5">
              {googleStatus?.isConnected ? (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Account Name:</span>
                      <span className="font-bold text-slate-800">
                        {googleStatus.selectedCustomerName || "Active Google Ads Account"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Customer ID:</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {googleStatus.selectedCustomerId || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Currency & Timezone:</span>
                      <span className="font-semibold text-slate-700">
                        {googleStatus.selectedCustomerCurrency} • {googleStatus.selectedCustomerTimeZone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Last Synchronized:</span>
                      <span className="font-semibold text-slate-700">
                        {googleStatus.lastSyncAt ? new Date(googleStatus.lastSyncAt).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                  </div>

                  {/* Discovered Accessible Customer Selector */}
                  {Array.isArray(googleStatus.accessibleCustomers) && googleStatus.accessibleCustomers.length > 1 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Switch Customer Account:
                      </label>
                      <select
                        value={googleStatus.selectedCustomerId || ""}
                        onChange={(e) => handleSelectGoogleCustomer(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {googleStatus.accessibleCustomers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.descriptiveName} ({c.id})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 text-xs text-slate-500 space-y-2 leading-relaxed">
                  <p>
                    Authorize ADOS via Google Identity with the official Google Ads API scope (<code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">https://www.googleapis.com/auth/adwords</code>).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports Manager Accounts (MCC), client accounts, and multi-currency reporting.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {googleStatus?.isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-authorize</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisconnectModal({ open: true, platform: "google" })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectGoogle}
                className="w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Connect Google Ads</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= META ADS CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="meta" size="md" />
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Meta Ads</h3>
                  <p className="text-xs text-slate-400">Facebook Feed, Instagram Reels & Messenger</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  metaStatus?.isConnected
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    metaStatus?.isConnected ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                <span>{metaStatus?.isConnected ? "Connected" : "Not Connected"}</span>
              </span>
            </div>

            {/* Connection Information */}
            <div className="py-5 space-y-3.5">
              {metaStatus?.isConnected ? (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Account Name:</span>
                      <span className="font-bold text-slate-800">
                        {metaStatus.selectedAccountName || "Active Meta Ad Account"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Account ID:</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {metaStatus.selectedAccountId || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Currency:</span>
                      <span className="font-semibold text-slate-700">
                        {metaStatus.selectedAccountCurrency || "USD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Last Synchronized:</span>
                      <span className="font-semibold text-slate-700">
                        {metaStatus.lastSyncAt ? new Date(metaStatus.lastSyncAt).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                  </div>

                  {/* Discovered Accessible Meta Account Selector */}
                  {Array.isArray(metaStatus.accessibleAccounts) && metaStatus.accessibleAccounts.length > 1 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        Switch Ad Account:
                      </label>
                      <select
                        value={metaStatus.selectedAccountId || ""}
                        onChange={(e) => handleSelectMetaAccount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {metaStatus.accessibleAccounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.accountId})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 text-xs text-slate-500 space-y-2 leading-relaxed">
                  <p>
                    Connect your Meta Business ad account via Meta OAuth using the official Meta Marketing API (<code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">ads_read, read_insights</code>).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Provides live campaign tracking, conversion action telemetry, and spend pacing.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {metaStatus?.isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleConnectMeta}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-authorize</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDisconnectModal({ open: true, platform: "meta" })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectMeta}
                className="w-full py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Connect Meta Ads</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
