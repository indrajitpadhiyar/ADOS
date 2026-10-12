import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  Layers,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  IndianRupee,
  MousePointerClick,
  Eye,
  Trash2,
  Copy,
  Edit3,
  Sliders,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function ManageAdsSection({ onCreateAdClick }) {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdForPreview, setSelectedAdForPreview] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAds();
      if (Array.isArray(data)) {
        setAds(data.map((ad) => ({ ...ad, id: ad._id })));
      }
    } catch (err) {
      console.warn("Notice: Failed to fetch ads:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle active/paused status via real MongoDB endpoint
  const toggleAdStatus = async (adId) => {
    const target = ads.find((a) => a.id === adId);
    if (!target) return;
    const nextStatus = target.status === "active" ? "paused" : "active";

    setAds((prev) =>
      prev.map((ad) => (ad.id === adId ? { ...ad, status: nextStatus } : ad))
    );
    showNotice(`Ad "${target.name}" is now ${nextStatus.toUpperCase()}`);

    try {
      await api.toggleAdStatus(adId);
    } catch (err) {
      console.error("Failed to toggle status on server:", err);
    }
  };

  // Duplicate ad via real MongoDB endpoint
  const handleDuplicate = async (ad) => {
    try {
      const created = await api.createAd({
        name: `${ad.name}_Copy`,
        campaign: ad.campaign,
        platform: ad.platform,
        format: ad.format,
        thumbnail: ad.thumbnail,
        budget: ad.budget || 500,
      });
      setAds((prev) => [{ ...created, id: created._id }, ...prev]);
      showNotice(`Duplicated ad: "${ad.name}_Copy" created`);
    } catch (err) {
      showNotice(`Failed to duplicate: ${err.message}`);
    }
  };

  // Delete ad via real MongoDB endpoint
  const handleDelete = async (adId, adName) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
    showNotice(`Ad "${adName}" was removed`);
    try {
      await api.deleteAd(adId);
    } catch (err) {
      console.error("Failed to delete ad on server:", err);
    }
  };

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filtered ads
  const filteredAds = ads.filter((ad) => {
    const matchSearch =
      ad.name.toLowerCase().includes(search.toLowerCase()) ||
      ad.campaign.toLowerCase().includes(search.toLowerCase());
    const matchPlatform =
      platformFilter === "all" ||
      (platformFilter === "facebook" && (ad.platform === "facebook" || ad.platform === "meta")) ||
      (platformFilter === "meta" && (ad.platform === "facebook" || ad.platform === "meta")) ||
      ad.platform === platformFilter;
    const matchStatus = statusFilter === "all" || ad.status === statusFilter;
    return matchSearch && matchPlatform && matchStatus;
  });

  const activeCount = ads.filter((a) => a.status === "active").length;

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Toast Notice */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-[#111113] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 mb-2">
            <Layers className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>Ad Creatives Central Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111113] tracking-tight">
            Manage Ads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status management, creative inspection, and cross-network telemetry across all ads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCreateAdClick}
            className="px-5 py-2.5 rounded-full bg-[#ff4a22] hover:bg-[#e03d17] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Ad</span>
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Ads</div>
          <div className="text-2xl font-black text-[#111113] mt-1">{activeCount} / {ads.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">● Live Telemetry Pacing</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Managed Spend</div>
          <div className="text-2xl font-black text-[#111113] mt-1">₹44,210</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">Across 5 Networks</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average CTR</div>
          <div className="text-2xl font-black text-[#111113] mt-1">4.54%</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">+1.1% vs Industry Bench</div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blended ROAS</div>
          <div className="text-2xl font-black text-[#ff4a22] mt-1">4.78x</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Autonomous Optimized</div>
        </div>
      </div>

      {/* Controls: Search, Platform Filter, Status Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ads by name or campaign..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
          />
        </div>

        {/* Platform Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Networks" },
            { id: "facebook", label: "Meta Ads" },
            { id: "google", label: "Google Ads" },
            { id: "amazon", label: "Amazon DSP" },
            { id: "youtube", label: "YouTube" },
            { id: "linkedin", label: "LinkedIn Ads" },
            { id: "pinterest", label: "Pinterest Ads" },
            { id: "snapchat", label: "Snapchat Ads" },
          ].map((plat) => (
            <button
              key={plat.id}
              onClick={() => setPlatformFilter(plat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                platformFilter === plat.id || (plat.id === "facebook" && platformFilter === "meta")
                  ? "bg-[#111113] text-white shadow-xs scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {plat.id !== "all" && <PlatformLogo platform={plat.id} size="xs" />}
              <span>{plat.label}</span>
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full text-xs font-bold">
          {["all", "active", "paused"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-[#111113] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Ads Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Ad Creative</th>
                <th className="py-3.5 px-3">Network</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Spend</th>
                <th className="py-3.5 px-3">Impressions</th>
                <th className="py-3.5 px-3">Clicks & CTR</th>
                <th className="py-3.5 px-3">CPA</th>
                <th className="py-3.5 px-3">ROAS</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No ads match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Creative info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ad.thumbnail}
                          alt={ad.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedAdForPreview(ad)}
                        />
                        <div className="flex flex-col">
                          <span
                            onClick={() => setSelectedAdForPreview(ad)}
                            className="font-extrabold text-[#111113] hover:text-[#ff4a22] cursor-pointer transition-colors"
                          >
                            {ad.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal truncate max-w-[200px]">
                            {ad.campaign}
                          </span>
                          <span className="text-[9px] text-slate-500 mt-0.5">{ad.format}</span>
                        </div>
                      </div>
                    </td>

                    {/* Network */}
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs">
                        <PlatformLogo platform={ad.platform} size="xs" />
                        <span className="capitalize text-[10px] font-black text-slate-700">
                          {ad.platform === "meta" ? "Meta Ads" : ad.platform === "google" ? "Google Ads" : ad.platform}
                        </span>
                      </div>
                    </td>

                    {/* Status switch */}
                    <td className="py-3 px-3">
                      <button
                        onClick={() => toggleAdStatus(ad.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                          ad.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ad.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        />
                        <span className="capitalize">{ad.status}</span>
                      </button>
                    </td>

                    {/* Metrics */}
                    <td className="py-3 px-3 font-black text-slate-900">{ad.spend ? ad.spend.replace("$", "₹") : "₹0"}</td>
                    <td className="py-3 px-3 text-slate-600">{ad.impressions}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800">{ad.clicks}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{ad.ctr}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{ad.cpa ? ad.cpa.replace("$", "₹") : "₹0.00"}</td>
                    <td className="py-3 px-3 font-black text-[#ff4a22] text-sm">{ad.roas}</td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => toggleAdStatus(ad.id)}
                          title={ad.status === "active" ? "Pause Ad" : "Resume Ad"}
                          className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          {ad.status === "active" ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDuplicate(ad)}
                          title="Duplicate Ad"
                          className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedAdForPreview(ad)}
                          title="Preview Creative"
                          className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-[#ff4a22] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ad.id, ad.name)}
                          title="Delete Ad"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad Preview Modal */}
      <AnimatePresence>
        {selectedAdForPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-[#111113]">
                    {selectedAdForPreview.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold tracking-wider mt-0.5">
                    <PlatformLogo platform={selectedAdForPreview.platform} size="xs" />
                    <span className="uppercase">{selectedAdForPreview.platform}</span>
                    <span>•</span>
                    <span>{selectedAdForPreview.format}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAdForPreview(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Creative Image */}
              <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedAdForPreview.thumbnail}
                  alt={selectedAdForPreview.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Spend</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{selectedAdForPreview.spend ? selectedAdForPreview.spend.replace("$", "₹") : "₹0"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">CTR</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{selectedAdForPreview.ctr}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">ROAS</div>
                  <div className="text-sm font-black text-[#ff4a22] mt-0.5">{selectedAdForPreview.roas}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedAdForPreview(null)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toggleAdStatus(selectedAdForPreview.id);
                    setSelectedAdForPreview(null);
                  }}
                  className="px-5 py-2 rounded-full bg-[#111113] text-white text-xs font-bold hover:bg-black cursor-pointer"
                >
                  Toggle Active/Paused
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
