import React, { useState, useEffect } from "react";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Trash2,
  AlertCircle,
  Key,
  Check,
  X,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function AdAccountsSection() {
  const [googleStatus, setGoogleStatus] = useState(null);
  const [metaStatus, setMetaStatus] = useState(null);
  const [metaAccounts, setMetaAccounts] = useState([]);
  const [selectedMetaIds, setSelectedMetaIds] = useState(new Set());
  const [isAccountsLoading, setIsAccountsLoading] = useState(false);
  const [isSavingAccounts, setIsSavingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState({ open: false, platform: null });
  const [tokenModal, setTokenModal] = useState({ open: false, token: "", isSubmitting: false, error: null });

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

      if (mRes?.isConnected) {
        await loadMetaAccounts();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetaAccounts = async () => {
    try {
      setIsAccountsLoading(true);
      setAccountsError(null);
      const accounts = await api.getMetaAdsAccounts();
      if (Array.isArray(accounts)) {
        setMetaAccounts(accounts);
        const selected = new Set(
          accounts.filter((a) => a.selected).map((a) => a.externalAccountId || a.id)
        );
        setSelectedMetaIds(selected);
      }
    } catch (err) {
      setAccountsError(err.message || "Failed to load accessible Meta ad accounts.");
    } finally {
      setIsAccountsLoading(false);
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

  // Connect via Direct Developer Token
  const handleConnectTokenSubmit = async (e) => {
    e.preventDefault();
    const token = tokenModal.token.trim();
    if (!token) return;

    setTokenModal((prev) => ({ ...prev, isSubmitting: true, error: null }));
    try {
      await api.connectMetaAdsToken(token);
      setTokenModal({ open: false, token: "", isSubmitting: false, error: null });
      showToast("Meta Ads connected successfully with access token!");
      await loadStatuses();
    } catch (err) {
      setTokenModal((prev) => ({
        ...prev,
        isSubmitting: false,
        error: err.message || "Failed to connect with access token.",
      }));
    }
  };

  // Toggle single account selection
  const handleToggleAccount = (accountId) => {
    setSelectedMetaIds((prev) => {
      const next = new Set(prev);
      if (next.has(accountId)) {
        next.delete(accountId);
      } else {
        next.add(accountId);
      }
      return next;
    });
  };

  // Select all accounts
  const handleSelectAll = () => {
    const allIds = new Set(metaAccounts.map((a) => a.externalAccountId || a.id));
    setSelectedMetaIds(allIds);
  };

  // Deselect all accounts
  const handleDeselectAll = () => {
    setSelectedMetaIds(new Set());
  };

  // Save selected accounts to MongoDB
  const handleSaveSelections = async () => {
    try {
      setIsSavingAccounts(true);
      const targetIds = Array.from(selectedMetaIds);
      const updatedAccounts = await api.selectMetaAdsAccounts(targetIds);
      setMetaAccounts(updatedAccounts);
      showToast(`Saved ${targetIds.length} selected Meta ad account(s).`);
      await loadStatuses();
    } catch (err) {
      showToast(err.message || "Failed to save selected accounts.");
    } finally {
      setIsSavingAccounts(false);
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
        setMetaAccounts([]);
        setSelectedMetaIds(new Set());
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

      {/* Developer Access Token Modal */}
      {tokenModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Connect with Access Token</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste your Meta Developer or Sandbox Access Token
                </p>
              </div>
              <button
                onClick={() => setTokenModal({ open: false, token: "", isSubmitting: false, error: null })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnectTokenSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Meta Access Token:
                </label>
                <textarea
                  rows={4}
                  value={tokenModal.token}
                  onChange={(e) => setTokenModal((prev) => ({ ...prev, token: e.target.value }))}
                  placeholder="EAAUuResl..."
                  required
                  className="w-full mt-1.5 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {tokenModal.error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{tokenModal.error}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Note: Ensure the token has the <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">ads_read</code> permission in the Meta Developer Console.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTokenModal({ open: false, token: "", isSubmitting: false, error: null })}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tokenModal.isSubmitting || !tokenModal.token.trim()}
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {tokenModal.isSubmitting ? "Connecting..." : "Connect Token"}
                </button>
              </div>
            </form>
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
            Authorize official OAuth 2.0 connections for Meta Ads and Google Ads to power unified analytics.
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
        {/* ================= META ADS INTEGRATION CARD ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <PlatformLogo platform="meta" size="md" />
                <div>
                  <h3 className="text-base font-extrabold text-[#0f172a]">Meta Ads</h3>
                  <p className="text-xs text-slate-400">Facebook + Instagram Advertising</p>
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

            {/* Connection Info */}
            <div className="py-5 space-y-3.5">
              {metaStatus?.isConnected ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-150 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Authenticated User:</span>
                    <span className="font-bold text-slate-800">
                      {metaStatus.metaUserName || metaStatus.connectedName || "Meta Business User"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Selected Accounts:</span>
                    <span className="font-semibold text-blue-600">
                      {metaStatus.selectedAccountsCount ?? selectedMetaIds.size} account(s) active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Last Synchronized:</span>
                    <span className="font-semibold text-slate-700">
                      {metaStatus.lastSyncAt ? new Date(metaStatus.lastSyncAt).toLocaleTimeString() : "Just now"}
                    </span>
                  </div>
                  {metaStatus.lastError && (
                    <div className="pt-1 text-[11px] text-amber-700 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{metaStatus.lastError}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-150 text-xs text-slate-500 space-y-2 leading-relaxed">
                  <p>
                    Connect your Facebook & Instagram ad accounts via official Meta Login using the Marketing API (<code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">ads_read</code>).
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Provides read-only campaign telemetry, spend pacing, and ROAS attribution.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            {metaStatus?.isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleConnectMeta}
                  className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reconnect</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTokenModal({ open: true, token: "", isSubmitting: false, error: null })}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    title="Update Developer Access Token"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Token</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisconnectModal({ open: true, platform: "meta" })}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleConnectMeta}
                  className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Connect Meta Ads</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTokenModal({ open: true, token: "", isSubmitting: false, error: null })}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Developer / Sandbox Token"
                >
                  <Key className="w-4 h-4 text-slate-500" />
                  <span>Token</span>
                </button>
              </div>
            )}
          </div>
        </div>

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

            {/* Connection Info */}
            <div className="py-5 space-y-3.5">
              {googleStatus?.isConnected ? (
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
      </div>

      {/* ================= META AD ACCOUNTS SELECTOR ================= */}
      {metaStatus?.isConnected && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-extrabold text-[#0f172a]">
                  Meta Advertising Accounts
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select one or more advertising accounts to synchronize with your ADOS analytics engine.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                {selectedMetaIds.size} of {metaAccounts.length} Selected
              </span>
              <button
                type="button"
                onClick={handleSaveSelections}
                disabled={isSavingAccounts}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSavingAccounts ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Selected Accounts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Select Controls */}
          {metaAccounts.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Select all
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Deselect all
                </button>
              </div>

              <button
                type="button"
                onClick={loadMetaAccounts}
                disabled={isAccountsLoading}
                className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isAccountsLoading ? "animate-spin" : ""}`} />
                <span>Refresh Accounts</span>
              </button>
            </div>
          )}

          {/* Error State */}
          {accountsError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{accountsError}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {isAccountsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : metaAccounts.length === 0 ? (
            /* Empty State */
            <div className="p-8 text-center rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700">No Meta Advertising Accounts Discovered</h4>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                No accessible ad accounts were returned for this user. Ensure your Facebook account has admin or advertiser role on the Business Manager.
              </p>
            </div>
          ) : (
            /* Account Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metaAccounts.map((account) => {
                const actId = account.externalAccountId || account.id;
                const isSelected = selectedMetaIds.has(actId);
                const isActive = account.status === "ACTIVE" || account.status === 1;

                return (
                  <div
                    key={actId}
                    onClick={() => handleToggleAccount(actId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-50/40 border-blue-300 ring-1 ring-blue-300"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#0f172a] leading-tight">
                          {account.name || "Meta Ad Account"}
                        </h4>
                        <div className="text-[11px] font-mono text-slate-500">
                          {actId}
                        </div>
                      </div>

                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by card click
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">
                          {account.currency || "USD"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 truncate max-w-[120px]">
                          {account.timezone || "UTC"}
                        </span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isActive ? "ACTIVE" : account.status || "DISABLED"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
