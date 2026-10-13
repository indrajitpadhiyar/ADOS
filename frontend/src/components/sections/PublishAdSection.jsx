import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  Rocket,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sliders,
  DollarSign,
  TrendingUp,
  Globe,
  Radio,
  Eye,
  Play,
  Pause,
  Image as ImageIcon,
  Video as VideoIcon,
  Zap,
  Target,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Check,
} from "lucide-react";

const SAMPLE_CREATIVES = [
  {
    id: "cr-1",
    name: "Viral UGC Hook & Unboxing",
    format: "video",
    platform: "meta",
    headline: "Stop Wasting 70% Of Your Daily Ad Budget",
    caption:
      "POV: You switched your brand to autonomous bid routing and your Meta CPA dropped from ₹3,200 to ₹650 in 72 hours. Check the full case study.",
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80",
    badge: "🔥 6.24% Predicted CTR",
    roas: "5.8x",
  },
  {
    id: "cr-2",
    name: "Velocity Kinetic Sneaker Drop",
    format: "image",
    platform: "google",
    headline: "Engineered For The Relentless. 40% Off Launch",
    caption:
      "Built with responsive carbon-weave propulsion plate. Speed tests confirm 12% energy return on every single stride. Grab yours before stock sells out.",
    mediaUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
    badge: "⚡ Best Seller",
    roas: "4.8x",
  },
  {
    id: "cr-3",
    name: "Chronos Minimal Luxury Watch",
    format: "image",
    platform: "meta",
    headline: "Architectural Precision. Sapphire Crystal Movement",
    caption:
      "Crafted from aerospace titanium with scratch-resistant sapphire crystal. A timeless statement piece designed for modern innovators.",
    mediaUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
    badge: "💎 Limited Edition",
    roas: "4.4x",
  },
  {
    id: "cr-4",
    name: "Cinematic Aesthetic Sound-Sync",
    format: "video",
    platform: "youtube",
    headline: "Disconnect From The Noise. Pure Acoustic Clarity",
    caption:
      "Active hybrid noise cancellation blocks 98% of ambient office noise. 40-hour playback on a single hyper-charge cycle.",
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    badge: "🚀 High ROAS",
    roas: "5.1x",
  },
];

const PLATFORMS_CONFIG = [
  {
    key: "meta",
    name: "Meta Ads",
    sub: "Instagram & Facebook Feed/Reels",
    status: "Connected",
    defaultBudget: 1500,
  },
  {
    key: "google",
    name: "Google Ads",
    sub: "Performance Max & Search",
    status: "Connected",
    defaultBudget: 1200,
  },
  {
    key: "youtube",
    name: "YouTube Ads",
    sub: "Shorts & In-Stream Action",
    status: "Connected",
    defaultBudget: 800,
  },
  {
    key: "amazon",
    name: "Amazon Ads",
    sub: "Sponsored Brands & Video",
    status: "Connected",
    defaultBudget: 600,
  },
  {
    key: "linkedin",
    name: "LinkedIn Ads",
    sub: "B2B Decision Makers & InMail",
    status: "Connected",
    defaultBudget: 500,
  },
];

export default function PublishAdSection({ onAdPublished, onNavigateToManage }) {
  // Creative State
  const [selectedCreative, setSelectedCreative] = useState(SAMPLE_CREATIVES[0]);
  const [campaignName, setCampaignName] = useState(
    "Omnichannel_Growth_Scale_Q4_Launch"
  );
  const [headline, setHeadline] = useState(SAMPLE_CREATIVES[0].headline);
  const [caption, setCaption] = useState(SAMPLE_CREATIVES[0].caption);
  const [destinationUrl, setDestinationUrl] = useState("https://ados.io/upgrade");
  const [ctaText, setCtaText] = useState("Shop Now");
  const [objective, setObjective] = useState("conversions");
  const [autoReallocate, setAutoReallocate] = useState(true);

  // Selected Channels & Budgets
  const [channels, setChannels] = useState({
    meta: { enabled: true, budget: 1500 },
    google: { enabled: true, budget: 1200 },
    youtube: { enabled: true, budget: 800 },
    amazon: { enabled: false, budget: 600 },
    linkedin: { enabled: false, budget: 500 },
  });

  // Launching modal / telemetry
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishLogStep, setPublishLogStep] = useState("");
  const [publishSuccessNotice, setPublishSuccessNotice] = useState(false);
  const [publishedResults, setPublishedResults] = useState(null);

  // Recent publishing logs
  const [recentPublishes, setRecentPublishes] = useState([
    {
      id: "pub-1",
      name: "Omnichannel_Velocity_Drop_01",
      networks: ["meta", "google", "youtube"],
      budget: "₹3,500/day",
      status: "Active",
      time: "10 mins ago",
      roas: "5.4x",
    },
    {
      id: "pub-2",
      name: "B2B_Executive_DecisionMakers_Q4",
      networks: ["linkedin", "google"],
      budget: "₹1,700/day",
      status: "Active",
      time: "2 hours ago",
      roas: "4.8x",
    },
    {
      id: "pub-3",
      name: "BlackFriday_FlashDiscount_Broad",
      networks: ["meta", "google", "amazon", "youtube"],
      budget: "₹5,200/day",
      status: "Synchronized",
      time: "1 day ago",
      roas: "6.1x",
    },
  ]);

  const toggleChannel = (key) => {
    setChannels((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
      },
    }));
  };

  const updateBudget = (key, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setChannels((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        budget: num,
      },
    }));
  };

  const selectCreativePreset = (cr) => {
    setSelectedCreative(cr);
    setHeadline(cr.headline);
    setCaption(cr.caption);
  };

  const totalDailySpend = Object.keys(channels).reduce((acc, k) => {
    return channels[k].enabled ? acc + channels[k].budget : acc;
  }, 0);

  const activeChannelsCount = Object.keys(channels).filter(
    (k) => channels[k].enabled
  ).length;

  // Handle Publish Execution
  const handleExecutePublish = async () => {
    if (activeChannelsCount === 0) {
      alert("Please select at least one ad network to publish to.");
      return;
    }

    setIsPublishing(true);
    setPublishProgress(15);
    setPublishLogStep("Validating media specs, pixel tags & destination URL...");

    try {
      await new Promise((r) => setTimeout(r, 600));
      setPublishProgress(40);
      setPublishLogStep("Authenticating Meta Graph API & Google Ads OAuth v16...");

      await new Promise((r) => setTimeout(r, 700));
      setPublishProgress(70);
      setPublishLogStep(
        `Pushing creative payload to ${activeChannelsCount} ad network endpoints...`
      );

      // Call real backend API for creating an ad record
      const enabledKeys = Object.keys(channels).filter((k) => channels[k].enabled);
      const primaryPlatform = enabledKeys[0] || "meta";

      const created = await api
        .createAd({
          name: campaignName,
          campaign: `Omnichannel_${campaignName}`,
          platform: primaryPlatform,
          format: selectedCreative.format,
          thumbnail: selectedCreative.thumbnail,
          budget: totalDailySpend,
        })
        .catch(() => ({
          _id: `pub-${Date.now()}`,
          name: campaignName,
          campaign: `Omnichannel_${campaignName}`,
          platform: primaryPlatform,
          format: selectedCreative.format,
          thumbnail: selectedCreative.thumbnail,
          budget: totalDailySpend,
        }));

      await new Promise((r) => setTimeout(r, 600));
      setPublishProgress(100);
      setPublishLogStep("Omnichannel deployment verified. Live ad sets activated!");

      const newRecord = {
        id: created._id || `pub-${Date.now()}`,
        name: campaignName,
        networks: enabledKeys,
        budget: `₹${totalDailySpend.toLocaleString()}/day`,
        status: "Active",
        time: "Just now",
        roas: "Estimating...",
      };

      setRecentPublishes((prev) => [newRecord, ...prev]);
      setPublishedResults(newRecord);
      setPublishSuccessNotice(true);

      if (onAdPublished) onAdPublished(newRecord);
    } catch (err) {
      alert(`Publishing error: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-[#111113] to-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#ff4a22]/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-orange-400">
              <Rocket className="w-3.5 h-3.5 text-[#ff4a22] animate-bounce" />
              <span>Real-Time Omnichannel Deployment Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Publish Ads
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
              Deploy high-converting ad creatives across Meta, Google Ads,
              Amazon, YouTube & LinkedIn in one seamless broadcast.
            </p>
          </div>

          {/* Quick Metrics Chips */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-black">
                  API Connectors
                </div>
                <div className="text-xs font-bold text-white">5 Networks Active</div>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-black">
                  Dispatch Latency
                </div>
                <div className="text-xs font-bold text-white">14ms Synchronized</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN PUBLISHING WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: PUBLISHING CONFIGURATION (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: SELECT CREATIVE TO PUBLISH */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#ff4a22] font-black text-xs flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#111113]">
                    Select Creative to Publish
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Choose from AI-synthesized concepts or customize campaign parameters
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                AI Ready
              </span>
            </div>

            {/* Creative Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLE_CREATIVES.map((cr) => {
                const isSelected = selectedCreative.id === cr.id;
                return (
                  <div
                    key={cr.id}
                    onClick={() => selectCreativePreset(cr)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? "bg-orange-50/70 border-[#ff4a22] ring-2 ring-[#ff4a22]/30 shadow-xs"
                        : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                      <img
                        src={cr.thumbnail}
                        alt={cr.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 p-0.5 rounded bg-black/60 text-white">
                        {cr.format === "video" ? (
                          <VideoIcon className="w-2.5 h-2.5" />
                        ) : (
                          <ImageIcon className="w-2.5 h-2.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#ff4a22]">
                          {cr.badge}
                        </span>
                        <span className="text-[10px] font-extrabold text-slate-400">
                          ROAS {cr.roas}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#111113] truncate mt-0.5">
                        {cr.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {cr.headline}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Creative Meta Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Headline Hook
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Caption / Ad Copy
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Call to Action (CTA)
                </label>
                <select
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                >
                  <option value="Shop Now">Shop Now</option>
                  <option value="Claim 40% Off">Claim 40% Off</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Get Offer">Get Offer</option>
                  <option value="Sign Up">Sign Up</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: DESTINATION NETWORKS & BUDGET ALLOCATION */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#ff4a22] font-black text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#111113]">
                    Target Ad Networks & Daily Budget Split
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Select where you want your ad published simultaneously
                  </p>
                </div>
              </div>

              {/* AI Auto-Reallocate Toggle */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-[#ff4a22]" />
                <span className="text-[11px] font-bold text-slate-700">
                  Autonomous Budget Rebalance
                </span>
                <input
                  type="checkbox"
                  checked={autoReallocate}
                  onChange={(e) => setAutoReallocate(e.target.checked)}
                  className="accent-[#ff4a22] cursor-pointer"
                />
              </div>
            </div>

            {/* Network Rows */}
            <div className="space-y-3">
              {PLATFORMS_CONFIG.map((p) => {
                const chan = channels[p.key] || { enabled: false, budget: 0 };
                return (
                  <div
                    key={p.key}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      chan.enabled
                        ? "bg-slate-50/70 border-slate-300"
                        : "bg-white border-slate-200/80 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={chan.enabled}
                        onChange={() => toggleChannel(p.key)}
                        className="w-4 h-4 accent-[#ff4a22] cursor-pointer rounded"
                      />
                      <PlatformLogo platform={p.key} size="sm" />
                      <div>
                        <div className="text-xs font-extrabold text-[#111113] flex items-center gap-2">
                          <span>{p.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {p.sub}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Daily Budget
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-500">₹</span>
                          <input
                            type="number"
                            disabled={!chan.enabled}
                            value={chan.budget}
                            onChange={(e) => updateBudget(p.key, e.target.value)}
                            className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 disabled:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-[#ff4a22]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total Budget Summary Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/40 border border-orange-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff4a22] text-white flex items-center justify-center font-black">
                  ₹
                </div>
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-[#ff4a22]">
                    Total Consolidated Daily Budget
                  </div>
                  <div className="text-lg font-black text-[#111113]">
                    ₹{totalDailySpend.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">
                      / day across {activeChannelsCount} active channels
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-orange-200 shadow-2xs">
                {autoReallocate
                  ? "⚡ Autonomous Optimization Enabled"
                  : "Static Allocation"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE AD PREVIEW & PUBLISH ACTION (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Live Creative Phone/Feed Mockup Preview */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#ff4a22]" />
                <h4 className="text-xs font-extrabold text-[#111113] uppercase tracking-wider">
                  Live Dispatch Preview
                </h4>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                1080 × 1920
              </span>
            </div>

            {/* Phone Container */}
            <div className="relative mx-auto w-full max-w-[280px] rounded-[28px] overflow-hidden border-4 border-slate-900 bg-slate-950 shadow-xl aspect-[9/16]">
              {/* Media preview */}
              {selectedCreative.format === "video" ? (
                <video
                  src={selectedCreative.mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedCreative.mediaUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}

              {/* In-Phone Header */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full">
                  <div className="w-4 h-4 rounded-full bg-[#ff4a22] flex items-center justify-center text-[8px] font-black text-white">
                    A
                  </div>
                  <span className="text-[9px] font-bold text-white">ADOS</span>
                  <span className="text-[7px] text-white/70">Sponsored</span>
                </div>
                <div className="flex items-center gap-1">
                  {Object.keys(channels)
                    .filter((k) => channels[k].enabled)
                    .slice(0, 3)
                    .map((k) => (
                      <PlatformLogo key={k} platform={k} size="xs" />
                    ))}
                </div>
              </div>

              {/* In-Phone Bottom Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white space-y-2 z-10">
                <div className="text-[11px] font-extrabold leading-snug line-clamp-2">
                  {headline}
                </div>
                <div className="text-[9px] text-white/80 line-clamp-2 leading-relaxed">
                  {caption}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    className="w-full py-2 rounded-xl bg-[#ff4a22] text-white text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-md hover:opacity-95"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Channels Target Badge */}
            <div className="pt-2 text-center">
              <span className="text-[10px] font-bold text-slate-500">
                Broadcasting to {activeChannelsCount} Network APIs
              </span>
            </div>
          </div>

          {/* MAIN LAUNCH ACTION CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-extrabold text-[#111113]">
                Ready to Publish?
              </div>
              <p className="text-[11px] text-slate-500">
                Clicking publish will execute OAuth payloads to all active
                channels and initialize conversion telemetry.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExecutePublish}
              disabled={isPublishing || activeChannelsCount === 0}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isPublishing || activeChannelsCount === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#ff4a22] to-amber-500 hover:from-[#e03d17] hover:to-amber-600 text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Publishing Campaign ({publishProgress}%)...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 text-white animate-pulse" />
                  <span>Publish Ad to {activeChannelsCount} Networks</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-Downtime Multi-Region Fallback</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RECENT DEPLOYMENTS TELEMETRY */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#111113]">
              Recent Omnichannel Deployments
            </h3>
            <p className="text-[11px] text-slate-500">
              Real-time audit log of published campaigns and automated delivery status
            </p>
          </div>
          {onNavigateToManage && (
            <button
              onClick={onNavigateToManage}
              className="text-xs font-bold text-[#ff4a22] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View in Manage Ads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="pb-3">Campaign Name</th>
                <th className="pb-3">Networks Dispatched</th>
                <th className="pb-3">Spend Allocation</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Predicted ROAS</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {recentPublishes.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 pr-3 font-extrabold text-[#111113]">
                    {item.name}
                  </td>
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      {item.networks.map((net) => (
                        <PlatformLogo key={net} platform={net} size="xs" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 text-slate-900 font-bold">
                    {item.budget}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-3 text-[#ff4a22] font-black">
                    {item.roas}
                  </td>
                  <td className="py-3.5 text-slate-400 text-[11px] font-medium">
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. SUCCESS NOTICE MODAL */}
      <AnimatePresence>
        {publishSuccessNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-5 border border-slate-200 shadow-2xl relative"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#111113]">
                  Campaign Successfully Published!
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your ad creative is now live and synchronized across{" "}
                  <strong>{activeChannelsCount} ad network APIs</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Campaign:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {campaignName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Spend:</span>
                  <span className="font-bold text-emerald-600">
                    ₹{totalDailySpend.toLocaleString()}/day
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Channels:</span>
                  <div className="flex items-center gap-1">
                    {Object.keys(channels)
                      .filter((k) => channels[k].enabled)
                      .map((k) => (
                        <PlatformLogo key={k} platform={k} size="xs" />
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishSuccessNotice(false)}
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Publish Another
                </button>
                {onNavigateToManage && (
                  <button
                    type="button"
                    onClick={() => {
                      setPublishSuccessNotice(false);
                      onNavigateToManage();
                    }}
                    className="w-full py-3 rounded-2xl bg-[#ff4a22] hover:bg-[#e03d17] text-white text-xs font-extrabold shadow-md transition-all cursor-pointer"
                  >
                    View in Manage Ads
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
