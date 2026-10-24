import React, { useState, useEffect } from "react";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Target,
} from "lucide-react";

export default function CampaignsSection({ dateRange = "LAST_30_DAYS", searchQuery = "" }) {
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("spend");
  const [sortOrder, setSortOrder] = useState("desc");
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignsData, setCampaignsData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");

  const pageSize = 10;

  useEffect(() => {
    loadCampaigns();
  }, [dateRange, platformFilter]);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAnalyticsCampaigns({
        dateRange,
        platform: platformFilter,
      });

      if (res?.campaigns) {
        setCampaignsData(res.campaigns);
        if (res.currencySymbol) setCurrencySymbol(res.currencySymbol);
      }
    } catch (err) {
      console.warn("Notice: Failed to fetch campaigns:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return `${currencySymbol}0`;
    return `${currencySymbol}${Number(val).toLocaleString("en-IN")}`;
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null) return "0";
    return Number(val).toLocaleString("en-IN");
  };

  // Filter & sort
  let filtered = [...campaignsData];

  if (platformFilter !== "all") {
    filtered = filtered.filter((c) => c.platform?.toLowerCase() === platformFilter.toLowerCase());
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((c) => c.status?.toLowerCase() === statusFilter.toLowerCase());
  }

  if (localSearch) {
    const q = localSearch.toLowerCase();
    filtered = filtered.filter((c) => (c.name || "").toLowerCase().includes(q));
  }

  filtered.sort((a, b) => {
    const valA = Number(a[sortBy]) || 0;
    const valB = Number(b[sortBy]) || 0;
    return sortOrder === "asc" ? valA - valB : valB - valA;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Campaign Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time campaign performance across authorized Google Ads and Meta Ads accounts.
          </p>
        </div>

        <button
          onClick={loadCampaigns}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Platform tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold">
          {[
            { id: "all", label: "All Platforms" },
            { id: "google", label: "Google Ads" },
            { id: "meta", label: "Meta Ads" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setPlatformFilter(tab.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                platformFilter === tab.id
                  ? "bg-white text-blue-600 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Status filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Status</th>
                <th
                  onClick={() => toggleSort("spend")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>Spend</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("impressions")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>Impressions</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("clicks")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>Clicks</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("ctr")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>CTR</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("cpc")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>CPC</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("conversions")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>Conversions</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("roas")}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-600"
                >
                  <span className="inline-flex items-center gap-1">
                    <span>ROAS</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginated.length > 0 ? (
                paginated.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-[#0f172a]">
                      <div className="flex items-center gap-2.5">
                        <PlatformLogo platform={camp.platform} size="xs" />
                        <span className="truncate max-w-[240px]">{camp.name}</span>
                      </div>
                    </td>

                    {/* Platform */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                        <PlatformLogo platform={camp.platform} size="xs" />
                        <span>{camp.platformName || (camp.platform === "google" ? "Google Ads" : "Meta Ads")}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          camp.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            camp.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        <span>{camp.status}</span>
                      </span>
                    </td>

                    {/* Spend */}
                    <td className="py-3.5 px-4 text-right font-bold text-[#0f172a]">
                      {formatCurrency(camp.spend)}
                    </td>

                    {/* Impressions */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatNumber(camp.impressions)}
                    </td>

                    {/* Clicks */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatNumber(camp.clicks)}
                    </td>

                    {/* CTR */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {camp.ctr ? `${camp.ctr}%` : "—"}
                    </td>

                    {/* CPC */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {camp.cpc ? formatCurrency(camp.cpc) : "—"}
                    </td>

                    {/* Conversions */}
                    <td className="py-3.5 px-4 text-right text-slate-600">
                      {formatNumber(camp.conversions)}
                    </td>

                    {/* ROAS */}
                    <td className="py-3.5 px-4 text-right font-semibold text-[#0f172a]">
                      {camp.roas !== null && camp.roas !== undefined ? `${camp.roas}` : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    {isLoading ? "Loading campaigns..." : "No campaigns match your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800">{paginated.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{filtered.length}</span> campaigns
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
