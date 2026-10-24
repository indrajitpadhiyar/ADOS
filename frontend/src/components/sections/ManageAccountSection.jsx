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

export default function ManageAccountSection() {
  const [activeTab, setActiveTab] = useState("networks"); // 'networks' | 'team' | 'billing' | 'organization'
  const [accounts, setAccounts] = useState([]);
  const [team, setTeam] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
            Maintain connected ad network tokens, team permissions, and workspace credentials.
          </p>
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: "networks", label: "Connected Networks", count: accounts.length },
          { id: "google-ads", label: "Google Ads (Live API)", highlight: true },
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

      {/* ================= TAB 1: CONNECTED NETWORKS ================= */}
      {activeTab === "networks" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-12 border border-slate-200/80 text-center text-slate-500 text-xs space-y-2">
                <PlatformLogo platform="meta" size="md" className="mx-auto mb-2 opacity-50" />
                <p className="font-bold text-slate-700 text-sm">No connected accounts</p>
                <p className="text-slate-400">All connected ad network accounts will appear here.</p>
              </div>
            )}

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
