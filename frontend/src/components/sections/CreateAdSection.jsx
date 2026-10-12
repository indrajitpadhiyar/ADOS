import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Video,
  Upload,
  Globe,
  CheckCircle2,
  Layers,
  ArrowRight,
  Eye,
  Smartphone,
  Laptop,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Share2,
  Music,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  Check,
  Zap,
  Flame,
  Star,
  Tag,
  Film,
  Search,
  CheckCheck,
  Copy,
  IndianRupee,
  Rocket,
  X,
  Info,
  BarChart3,
  Percent,
} from "lucide-react";

// Supported Ad Networks for Omnichannel Campaign Routing
const AVAILABLE_PLATFORMS = [
  {
    id: "meta",
    name: "Meta Ads",
    subName: "Instagram & Facebook",
    desc: "Advantage+ shopping, Feed & Reels",
    recommendedShare: 35,
    minDaily: 25,
    estCpc: "₹0.48",
    estRoas: "4.35x",
    color: "#1877F2",
  },
  {
    id: "google",
    name: "Google Ads",
    subName: "Search & PMax",
    desc: "Performance Max, Search & Shopping",
    recommendedShare: 25,
    minDaily: 30,
    estCpc: "₹0.82",
    estRoas: "4.15x",
    color: "#0F9D58",
  },
  {
    id: "amazon",
    name: "Amazon Ads",
    subName: "Sponsored Brands & DSP",
    desc: "High-intent marketplace buyers",
    recommendedShare: 15,
    minDaily: 35,
    estCpc: "₹0.95",
    estRoas: "5.10x",
    color: "#d97706",
  },
  {
    id: "youtube",
    name: "YouTube Video",
    subName: "Shorts & In-Stream",
    desc: "High video retention & sound sync",
    recommendedShare: 10,
    minDaily: 20,
    estCpc: "₹0.32",
    estRoas: "3.60x",
    color: "#DC2626",
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    subName: "Sponsored InFeed & B2B",
    desc: "Decision makers & enterprise buyers",
    recommendedShare: 15,
    minDaily: 40,
    estCpc: "₹2.10",
    estRoas: "3.90x",
    color: "#0A66C2",
  },
  {
    id: "pinterest",
    name: "Pinterest Ads",
    subName: "Idea Pins & Catalogs",
    desc: "Visual inspiration & lifestyle shopping",
    recommendedShare: 10,
    minDaily: 20,
    estCpc: "₹0.36",
    estRoas: "3.80x",
    color: "#E60023",
  },
  {
    id: "snapchat",
    name: "Snapchat Ads",
    subName: "Spotlight & Story Ads",
    desc: "Gen-Z vertical video immersion",
    recommendedShare: 10,
    minDaily: 20,
    estCpc: "₹0.28",
    estRoas: "3.70x",
    color: "#eab308",
  },
];

// Curated High-Definition Posters (Images)
const SAMPLE_POSTERS = [
  {
    id: "poster-1",
    label: "Audio Pro X",
    category: "Consumer Tech",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80",
    badge: "🔥 40% OFF THIS WEEK",
    headline: "Immersive Studio Sound Without The Studio Price",
    caption:
      "Experience spatial acoustics with 48h battery life. Engineered for creators, audiophiles, and daily commuters. 14-day risk-free trial.",
    price: "₹149.00",
    originalPrice: "₹249.00",
    rating: "4.9",
    reviews: "3,420",
    ctr: "5.12%",
    roas: "4.8x",
  },
  {
    id: "poster-2",
    label: "Aura Glow Skincare",
    category: "Beauty & Wellness",
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000&auto=format&fit=crop&q=80",
    badge: "⭐ TOP RATED 4.9★",
    headline: "Wake Up With Glass Skin. 100% Plant Bio-Retinol",
    caption:
      "Dermatologist approved formula clinically proven to restore skin barrier in 7 nights. Vegan, cruelty-free, zero filler ingredients.",
    price: "₹38.00",
    originalPrice: "₹58.00",
    rating: "4.95",
    reviews: "1,890",
    ctr: "4.78%",
    roas: "5.1x",
  },
  {
    id: "poster-3",
    label: "HyperGlide Sneaker",
    category: "Streetwear & Footwear",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
    badge: "⚡ FLASH SALE - 24H LEFT",
    headline: "The Featherlight Runner That Broke The Internet",
    caption:
      "Zero-gravity foam cushioning meets aerodynamic knit mesh. Built for marathon training or everyday city sprinting. Free shipping worldwide.",
    price: "₹89.00",
    originalPrice: "₹140.00",
    rating: "4.88",
    reviews: "5,120",
    ctr: "5.45%",
    roas: "5.6x",
  },
  {
    id: "poster-4",
    label: "Chronos Minimal Watch",
    category: "Luxury Accessories",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
    badge: "💎 LIMITED EDITION DROP",
    headline: "Architectural Precision. Sapphire Crystal Movement",
    caption:
      "Crafted from aerospace titanium with scratch-resistant sapphire crystal. A timeless statement piece designed for modern innovators.",
    price: "₹210.00",
    originalPrice: "₹350.00",
    rating: "4.92",
    reviews: "890",
    ctr: "4.35%",
    roas: "4.4x",
  },
];

// Curated High-Retention Video Creatives (Direct web-playable MP4s)
const SAMPLE_VIDEOS = [
  {
    id: "vid-1",
    label: "Viral UGC Hook & Unboxing",
    style: "Problem/Solution UGC",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop&q=80",
    headline: "Stop Wasting 70% Of Your Daily Ad Budget",
    caption:
      "POV: You switched your brand to autonomous bid routing and your Meta CPA dropped from ₹3,200 to ₹650 in 72 hours. Check the full case study.",
    captionsHook: "🔥 'Wait... did my CPA just drop to ₹650?!'",
    soundTrack: "Trending Commercial Beat (128 BPM)",
    duration: "15s",
    ctr: "6.24%",
    roas: "5.8x",
  },
  {
    id: "vid-2",
    label: "Kinetic Action & Motion Reveal",
    style: "High-Energy Product Reveal",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    headline: "Engineered For The Relentless. Feel The Speed",
    caption:
      "Built with responsive carbon-weave propulsion plate. Speed tests confirm 12% energy return on every single stride. Grab yours before stock sells out.",
    captionsHook: "⚡ 'The sneaker that shattered every benchmark.'",
    soundTrack: "Bassline Pulse - ADOS Sound Engine",
    duration: "30s",
    ctr: "5.89%",
    roas: "5.3x",
  },
  {
    id: "vid-3",
    label: "Cinematic Aesthetic Lifestyle",
    style: "Atmospheric Visual Story",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    headline: "Disconnect From The Noise. Pure Acoustic Clarity",
    caption:
      "Active noise-cancellation tuned to block out city chatter and drone hums. Handcrafted memory foam cups for all-day comfort. Special 40% launch discount.",
    captionsHook: "🎧 'Silence the world. Press play.'",
    soundTrack: "Lo-Fi Deep Focus Chillout",
    duration: "20s",
    ctr: "5.15%",
    roas: "4.9x",
  },
];

const PROMPT_SUGGESTIONS = [
  "🔥 40% Off Weekend Flash Sale for E-Commerce Brand",
  "🚀 High-Converting B2B SaaS ROAS Scale Case Study",
  "🧴 Organic Clean Skincare Product Before & After",
  "⚡ Streetwear Drop with High-Energy Kinetic Typography",
];

const POSTER_BADGE_OPTIONS = [
  "🔥 40% OFF THIS WEEK",
  "⭐ TOP RATED 4.9★",
  "⚡ FLASH SALE - 24H LEFT",
  "💎 LIMITED EDITION DROP",
  "🚀 FREE SHIPPING WORLDWIDE",
  "✨ AI RECOMMENDED CHOICE",
];

export default function CreateAdSection({ onAdCreated }) {
  // Mode selection: 'generate' (AI Generator) vs 'manual' (Custom Studio)
  const [activeMode, setActiveMode] = useState("generate");

  // Core Creative Format Option: "poster" vs "video"
  const [creativeType, setCreativeType] = useState("poster"); // 'poster' | 'video'

  // AI Generator Form States
  const [prompt, setPrompt] = useState(
    "High-converting omnichannel campaign with 40% discount launch",
  );
  const [brandName, setBrandName] = useState("ADOS Performance");
  const [targetAudience, setTargetAudience] = useState(
    "Broad E-Commerce (20-45)",
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");

  // Current Active Creative Details (Synchronized across generator and manual editor)
  const [adName, setAdName] = useState("Scale_Growth_Omnichannel_Creative_01");
  const [campaign, setCampaign] = useState("Meta_Advantage_Scale_US_Broad");
  const [headline, setHeadline] = useState(SAMPLE_POSTERS[0].headline);
  const [caption, setCaption] = useState(SAMPLE_POSTERS[0].caption);
  const [ctaText, setCtaText] = useState("Shop Now");
  const [destinationUrl, setDestinationUrl] = useState(
    "https://ados.io/upgrade",
  );

  // Poster specific customization
  const [selectedPoster, setSelectedPoster] = useState(SAMPLE_POSTERS[0]);
  const [posterBadge, setPosterBadge] = useState("🔥 40% OFF THIS WEEK");
  const [posterPrice, setPosterPrice] = useState("₹149.00");
  const [posterOriginalPrice, setPosterOriginalPrice] = useState("₹249.00");

  // Video specific customization
  const [selectedVideo, setSelectedVideo] = useState(SAMPLE_VIDEOS[0]);
  const [videoCaptionsHook, setVideoCaptionsHook] = useState(
    SAMPLE_VIDEOS[0].captionsHook,
  );
  const [videoSound, setVideoSound] = useState(SAMPLE_VIDEOS[0].soundTrack);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Platform Preview states
  const [previewPlatform, setPreviewPlatform] = useState("instagram"); // 'instagram' | 'snapchat' | 'google'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [launchStepText, setLaunchStepText] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);
  const [campaignLaunchedData, setCampaignLaunchedData] = useState(null);

  // Target platforms selection: "kaha kaha pe ads run karna hai"
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    meta: true,
    google: true,
    amazon: true,
    youtube: true,
    linkedin: true,
    pinterest: false,
    snapchat: false,
  });

  // Total daily campaign budget
  const [totalDailyBudget, setTotalDailyBudget] = useState(2500);

  // Platform budget weights (used to compute proportional daily & monthly spend)
  const [platformShares, setPlatformShares] = useState({
    meta: 35,
    google: 25,
    amazon: 15,
    youtube: 10,
    linkedin: 15,
    pinterest: 10,
    snapchat: 10,
  });

  // Autonomous AI dynamic rebalancing toggle
  const [autoRebalance, setAutoRebalance] = useState(true);

  // Platform selection toggler
  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (prev[id] && activeCount <= 1) {
        // Prevent deselecting all networks
        return prev;
      }
      return {
        ...prev,
        [id]: !prev[id],
      };
    });
  };

  const handleSelectAllPlatforms = () => {
    const allSelected = {};
    AVAILABLE_PLATFORMS.forEach((p) => {
      allSelected[p.id] = true;
    });
    setSelectedPlatforms(allSelected);
  };

  const handleSelectTop3Platforms = () => {
    setSelectedPlatforms({
      meta: true,
      google: true,
      amazon: true,
      youtube: false,
      linkedin: false,
      pinterest: false,
      snapchat: false,
    });
  };

  const handleShareChange = (id, newShare) => {
    setPlatformShares((prev) => ({
      ...prev,
      [id]: Math.max(5, Math.min(80, Number(newShare))),
    }));
  };

  // Compute active platforms and their budgets
  const activePlatforms = AVAILABLE_PLATFORMS.filter(
    (p) => selectedPlatforms[p.id],
  );
  const activeWeightsSum =
    activePlatforms.reduce((sum, p) => sum + (platformShares[p.id] || 10), 0) ||
    1;

  const platformBudgetBreakdown = activePlatforms.map((p) => {
    const weight = platformShares[p.id] || 10;
    const sharePct = Math.round((weight / activeWeightsSum) * 100);
    const dailyAmt = Math.round((totalDailyBudget * weight) / activeWeightsSum);
    const monthlyAmt = dailyAmt * 30;
    const estClicks = Math.round(
      dailyAmt / (parseFloat(p.estCpc.replace(/[^\d.]/g, "")) || 0.5),
    );
    const estImpressions = Math.round(estClicks * 38);
    return {
      ...p,
      sharePct,
      dailyAmt,
      monthlyAmt,
      estClicks,
      estImpressions,
    };
  });

  // Keep video play/pause in sync with state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, selectedVideo, creativeType]);

  // Handle AI Generate Ads
  const handleGenerateAds = () => {
    setIsGenerating(true);
    setGenerationStep(
      "Analyzing 50,000+ top-converting Meta & Snapchat ad hooks...",
    );

    setTimeout(() => {
      setGenerationStep(
        creativeType === "video"
          ? "Synthesizing dynamic video cuts, kinetic captions & sound alignment..."
          : "Synthesizing high-contrast typography, discount badges & promotional layout...",
      );
    }, 500);

    setTimeout(() => {
      setGenerationStep("Optimizing predicted CTR and finalizing assets...");
    }, 950);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationStep("");

      if (creativeType === "poster") {
        // Cycle or pick high impact generated poster
        const randomPoster =
          SAMPLE_POSTERS[Math.floor(Math.random() * SAMPLE_POSTERS.length)];
        setSelectedPoster(randomPoster);
        setHeadline(randomPoster.headline);
        setCaption(randomPoster.caption);
        setPosterBadge(randomPoster.badge);
        setPosterPrice(randomPoster.price);
        setPosterOriginalPrice(randomPoster.originalPrice);
        setAdName(`AI_Poster_${randomPoster.label.replace(/\s/g, "_")}_Scale`);
      } else {
        // Cycle or pick high impact generated video
        const randomVideo =
          SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
        setSelectedVideo(randomVideo);
        setHeadline(randomVideo.headline);
        setCaption(randomVideo.caption);
        setVideoCaptionsHook(randomVideo.captionsHook);
        setVideoSound(randomVideo.soundTrack);
        setAdName(`AI_Video_${randomVideo.label.replace(/\s/g, "_")}_9x16`);
        setIsPlaying(true);
      }
    }, 1400);
  };

  // Direct Apply from preset cards
  const handleApplyPoster = (poster) => {
    setSelectedPoster(poster);
    setHeadline(poster.headline);
    setCaption(poster.caption);
    setPosterBadge(poster.badge);
    setPosterPrice(poster.price);
    setPosterOriginalPrice(poster.originalPrice);
    setAdName(`Ad_Poster_${poster.label.replace(/\s/g, "_")}`);
  };

  const handleApplyVideo = (vid) => {
    setSelectedVideo(vid);
    setHeadline(vid.headline);
    setCaption(vid.caption);
    setVideoCaptionsHook(vid.captionsHook);
    setVideoSound(vid.soundTrack);
    setAdName(`Ad_Video_${vid.label.replace(/\s/g, "_")}`);
    setIsPlaying(true);
  };

  // Launch Campaign with this ad across selected platforms with assigned budgets
  const handleLaunchCampaign = (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setLaunchStepText(
      "Validating creative formatting across selected platforms...",
    );

    setTimeout(() => {
      const platformNames = activePlatforms.map((p) => p.name).join(", ");
      setLaunchStepText(
        `Synchronizing ₹${totalDailyBudget.toLocaleString()}/day budget across ${activePlatforms.length} active networks (${platformNames})...`,
      );
    }, 750);

    setTimeout(() => {
      setLaunchStepText(
        "Activating Autonomous Bid AI & Unified Attribution Layer...",
      );
    }, 1500);

    setTimeout(async () => {
      try {
        await api.createAd({
          name: adName || "New_Campaign_Ad",
          campaign: campaignName || "Ados_MultiNetwork_Scale",
          platform: previewPlatform === "facebook" ? "meta" : previewPlatform || "meta",
          format: creativeType === "video" ? "Video (9:16)" : "Display Poster (1:1)",
          thumbnail: creativeType === "video" ? selectedVideo?.thumbnail : selectedPoster?.image,
          budget: totalDailyBudget,
          destinationUrl: targetUrl,
          creativeTitle: headline,
          primaryText: caption,
          category: "Multi-Platform Growth",
        });
      } catch (err) {
        console.warn("Notice: Failed to persist created ad to database:", err);
      }

      setIsSubmitting(false);
      setLaunchStepText("");
      setCampaignLaunchedData({
        adName,
        headline,
        creativeType,
        totalDailyBudget,
        breakdown: platformBudgetBreakdown,
      });
      setSuccessNotice(true);
    }, 2200);
  };

  const handlePublish = handleLaunchCampaign;


  return (
    <div className="w-full space-y-8 animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Launching Handshake Loading Modal */}
      <AnimatePresence>
        {isSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#ff4a22] flex items-center justify-center mx-auto text-2xl animate-spin">
                <RefreshCw className="w-8 h-8 text-[#ff4a22]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111113]">
                Launching Campaign...
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {launchStepText ||
                  "Deploying ad creative to selected networks..."}
              </p>
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {activePlatforms.map((p) => (
                  <PlatformLogo key={p.id} platform={p.id} size="xs" />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification Modal with Complete Platform & Budget Breakdown */}
      <AnimatePresence>
        {successNotice && campaignLaunchedData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                🚀
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-[#111113]">
                  Campaign Launched Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  "{campaignLaunchedData.adName}" is now active and routing
                  spend across{" "}
                  <strong>
                    {campaignLaunchedData.breakdown.length} ad networks
                  </strong>
                  .
                </p>
              </div>

              {/* Total Daily & Monthly Spend Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Blended Spend
                  </span>
                  <div className="text-xl font-black text-[#111113]">
                    ₹{campaignLaunchedData.totalDailyBudget.toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal">
                      {" "}
                      / day
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Monthly Projection
                  </span>
                  <div className="text-sm font-extrabold text-emerald-600">
                    ₹
                    {(
                      campaignLaunchedData.totalDailyBudget * 30
                    ).toLocaleString()}{" "}
                    / mo
                  </div>
                </div>
              </div>

              {/* Platform Budgets Breakdown Cards */}
              <div className="space-y-2 text-left">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Assigned Platform Budgets:</span>
                  <span className="text-[11px] text-[#ff4a22]">
                    Autonomous AI Active
                  </span>
                </div>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {campaignLaunchedData.breakdown.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlatformLogo platform={item.id} size="sm" />
                        <div>
                          <div className="font-extrabold text-[#111113]">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {item.sharePct}% allocation • Est. {item.estRoas}{" "}
                            ROAS
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-slate-900">
                          ₹{item.dailyAmt}/day
                        </div>
                        <div className="text-[10px] text-slate-500">
                          ₹{item.monthlyAmt.toLocaleString()}/mo
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessNotice(false);
                    if (onAdCreated) onAdCreated();
                  }}
                  className="w-full py-3 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  View in Campaign Telemetry
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[11px] font-bold text-[#ff4a22] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ff4a22] animate-pulse" />
            <span>Autonomous Creative Generation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111113] tracking-tight">
            Create Ads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate high-converting <strong>Video</strong> and{" "}
            <strong>Poster</strong> ad creatives with AI, or manually customize
            your assets.
          </p>
        </div>

        {/* Mode Selector Pill */}
        <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode("generate")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "generate"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ff4a22]" />
            <span>✨ Generate Ads (AI)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("manual")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMode === "manual"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-700" />
            <span>🛠️ Custom Studio</span>
          </button>
        </div>
      </div>

      {/* CREATIVE OPTION SELECTOR (VIDEO vs POSTER) - Prominent Selector */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Step 1 • Select Creative Format
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#111113]">
              Choose Creative Type: Video or Poster
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Selected:{" "}
            <strong className="text-slate-900 capitalize">
              {creativeType} Ad
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Poster / Graphic Ad */}
          <div
            onClick={() => setCreativeType("poster")}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              creativeType === "poster"
                ? "bg-orange-50/30 border-[#ff4a22] shadow-sm ring-2 ring-[#ff4a22]/20"
                : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    creativeType === "poster"
                      ? "bg-[#ff4a22] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Poster / Image Ad
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      High CTR
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    High-impact static flyer, promotional discount poster & feed
                    banner.
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  creativeType === "poster"
                    ? "border-[#ff4a22] bg-[#ff4a22] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {creativeType === "poster" && (
                  <Check className="w-3 h-3 stroke-[3]" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-orange-500" />
                Promotional Badges
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500" />
                Price & Star Rating
              </span>
              <span>•</span>
              <span>1:1 & 4:5 Feed</span>
            </div>
          </div>

          {/* Option 2: Video / Motion Ad */}
          <div
            onClick={() => setCreativeType("video")}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
              creativeType === "video"
                ? "bg-orange-50/30 border-[#ff4a22] shadow-sm ring-2 ring-[#ff4a22]/20"
                : "bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    creativeType === "video"
                      ? "bg-[#ff4a22] text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Video / Motion Ad
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Viral UGC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vertical Reels & Snapchat videos with motion captions and
                    sound sync.
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  creativeType === "video"
                    ? "border-[#ff4a22] bg-[#ff4a22] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {creativeType === "video" && (
                  <Check className="w-3 h-3 stroke-[3]" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1">
                <Film className="w-3 h-3 text-purple-500" />
                9:16 Vertical Reel
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Music className="w-3 h-3 text-rose-500" />
                Trending Sound Track
              </span>
              <span>•</span>
              <span>Live Looping Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Form/Generator, Right Live Multi-Platform Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: AI GENERATOR OR CUSTOM STUDIO */}
        <div className="lg:col-span-7 space-y-6">
          {activeMode === "generate" ? (
            /* ================= GENERATE ADS AI PANEL ================= */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff4a22] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#111113]">
                      AI Ad Creative Generator
                    </h3>
                    <p className="text-xs text-slate-500">
                      Generates complete visual{" "}
                      {creativeType === "video" ? "videos" : "posters"},
                      high-converting copy & hooks in seconds.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  What would you like to generate? (Prompt / Goal)
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g. High-converting 40% discount video ad for urban sneakers targeting Instagram Reels and Snapchat..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] resize-none"
                  />
                </div>

                {/* Quick Prompt Suggestions */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 self-center mr-1">
                    Try Prompt:
                  </span>
                  {PROMPT_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(sug)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand and Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Brand Name / Product
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Target Demographic
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                </div>
              </div>

              {/* Specific Options based on Video vs Poster */}
              {creativeType === "poster" ? (
                <div className="space-y-3 p-4 bg-orange-50/40 border border-orange-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#ff4a22]" />
                      Poster Badge Overlay
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Customizable flyer tag
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POSTER_BADGE_OPTIONS.map((badge, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPosterBadge(badge)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          posterBadge === badge
                            ? "bg-[#ff4a22] text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-purple-50/40 border border-purple-100 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-purple-600" />
                      Video Hook & Sound Preset
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Viral UGC Pacing
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-purple-200/70">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Audio Track:
                      </span>
                      <span className="font-bold text-slate-800 text-xs truncate block">
                        {videoSound}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-purple-200/70">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Video Format:
                      </span>
                      <span className="font-bold text-slate-800 text-xs block">
                        9:16 Vertical Reel / Snapchat
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Big Generate Button with AI animation */}
              <div>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAds}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff4a22] via-orange-500 to-amber-500 hover:opacity-95 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{generationStep || "Generating Creative..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        ⚡ Generate{" "}
                        {creativeType === "video" ? "Video Ad" : "Poster Ad"}{" "}
                        Creative
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Generated Presets Carousel / Gallery */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    Generated{" "}
                    {creativeType === "video"
                      ? "Video Options"
                      : "Poster Options"}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click to apply instantly to builder & preview
                  </span>
                </div>

                {creativeType === "poster" ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SAMPLE_POSTERS.map((poster) => (
                      <div
                        key={poster.id}
                        onClick={() => handleApplyPoster(poster)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          selectedPoster.id === poster.id
                            ? "border-[#ff4a22] ring-2 ring-[#ff4a22]/20 shadow-md scale-102"
                            : "border-slate-200/80 hover:border-slate-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="aspect-[4/5] w-full overflow-hidden relative">
                          <img
                            src={poster.url}
                            alt={poster.label}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 text-white">
                            <span className="text-[9px] font-bold bg-[#ff4a22] px-1.5 py-0.5 rounded text-white block truncate mb-1">
                              {poster.badge}
                            </span>
                            <span className="text-xs font-bold block truncate">
                              {poster.label}
                            </span>
                            <span className="text-[10px] text-white/80 font-semibold block">
                              {poster.price} • {poster.ctr} CTR
                            </span>
                          </div>
                          {selectedPoster.id === poster.id && (
                            <div className="absolute top-2 right-2 bg-[#ff4a22] text-white p-1 rounded-full shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SAMPLE_VIDEOS.map((vid) => (
                      <div
                        key={vid.id}
                        onClick={() => handleApplyVideo(vid)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          selectedVideo.id === vid.id
                            ? "border-[#ff4a22] ring-2 ring-[#ff4a22]/20 shadow-md"
                            : "border-slate-200/80 hover:border-slate-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="aspect-[9/14] w-full overflow-hidden relative bg-slate-900">
                          <img
                            src={vid.thumbnail}
                            alt={vid.label}
                            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Video className="w-2.5 h-2.5 text-[#ff4a22]" />
                            <span>{vid.duration}</span>
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
                              <Play className="w-4 h-4 ml-0.5" />
                            </div>
                          </div>

                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-1">
                            <span className="text-[10px] font-bold text-amber-300 block truncate">
                              Est. {vid.roas} ROAS ({vid.ctr} CTR)
                            </span>
                            <span className="text-xs font-extrabold block truncate">
                              {vid.label}
                            </span>
                            <span className="text-[9px] text-white/70 block truncate">
                              {vid.soundTrack}
                            </span>
                          </div>

                          {selectedVideo.id === vid.id && (
                            <div className="absolute top-2 right-2 bg-[#ff4a22] text-white p-1 rounded-full shadow-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* ================= MANUAL STUDIO FORM / EDITING ================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#ff4a22]" />
                <h3 className="text-base font-extrabold text-[#111113]">
                  Ad Configuration & Content Studio
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Format:{" "}
                <strong className="text-slate-800 capitalize">
                  {creativeType}
                </strong>
              </span>
            </div>

            <form onSubmit={handleLaunchCampaign} className="space-y-6">
              {/* Ad Name & Campaign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Ad Creative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adName}
                    onChange={(e) => setAdName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Parent Campaign
                  </label>
                  <select
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  >
                    <option value="Meta_Advantage_Scale_US_Broad">
                      Meta Advantage+ Scale (Broad)
                    </option>
                    <option value="Google_PMax_Top_Sellers_AssetGroup">
                      Google PMax Best Sellers
                    </option>
                    <option value="LinkedIn_B2B_DecisionMakers_Q4">
                      LinkedIn B2B Decision Makers
                    </option>
                    <option value="YouTube_Shorts_Direct_Conversion">
                      YouTube Shorts Direct
                    </option>
                    <option value="Amazon_Sponsored_Brands_HeroPack">
                      Amazon Sponsored Brands
                    </option>
                  </select>
                </div>
              </div>

              {/* Headline */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Headline (Hook)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const hooks = [
                        "Scale Your Cross-Platform ROAS by 340% Today",
                        "The Autonomous Ad Operating System High-Growth Brands Rely On",
                        "Stop Guessing Bids. Let AI Route Your Daily Ad Spend.",
                        "Break The Algorithm. 4.8x Blended ROAS In 72 Hours.",
                      ];
                      setHeadline(
                        hooks[Math.floor(Math.random() * hooks.length)],
                      );
                    }}
                    className="text-[11px] font-bold text-[#ff4a22] hover:text-[#e03d17] flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>AI Rewrite</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                />
              </div>

              {/* Primary Text / Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Primary Text / Caption
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const captions = [
                        "Tired of logging into multiple ad managers every morning? ADOS consolidates your Meta, Google, LinkedIn, and Amazon campaigns into one autonomous intelligence engine. Try the 14-day free pilot.",
                        "High CPA eating into your margins? Our neural bid allocator shifts your budget to high-converting audiences in real-time. Experience 4.8x blended ROAS.",
                        "Meet the future of omnichannel marketing. Autonomous creative fatigue detection, unified ROAS telemetry, and multi-network ad scaling.",
                      ];
                      setCaption(
                        captions[Math.floor(Math.random() * captions.length)],
                      );
                    }}
                    className="text-[11px] font-bold text-[#ff4a22] hover:text-[#e03d17] flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>AI Hook</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] resize-none"
                />
              </div>

              {/* Call to Action & Destination URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Call to Action (CTA) Button
                  </label>
                  <select
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  >
                    <option value="Shop Now">Shop Now</option>
                    <option value="Claim Offer">Claim Offer</option>
                    <option value="Learn More">Learn More</option>
                    <option value="Get Offer">Get Offer</option>
                    <option value="Sign Up">Sign Up</option>
                    <option value="Install Now">Install Now</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Destination URL
                  </label>
                  <input
                    type="url"
                    required
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                </div>
              </div>

              {/* ================= STEP 4: WHERE TO RUN ADS (TARGET PLATFORMS) ================= */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#ff4a22]" />
                      <h4 className="text-sm font-extrabold text-[#111113]">
                        Target Ad Networks (Where to Run Ads)
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select which networks to launch this creative on. ADOS
                      adapts your asset formats automatically.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={handleSelectAllPlatforms}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Select All (7)
                    </button>
                    <button
                      type="button"
                      onClick={handleSelectTop3Platforms}
                      className="px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-[#ff4a22] text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Top 3 ROAS
                    </button>
                  </div>
                </div>

                {/* Platform Selection Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {AVAILABLE_PLATFORMS.map((plat) => {
                    const isSelected = !!selectedPlatforms[plat.id];
                    return (
                      <div
                        key={plat.id}
                        onClick={() => togglePlatform(plat.id)}
                        className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? "bg-orange-50/25 border-[#ff4a22] shadow-2xs ring-1 ring-[#ff4a22]/20"
                            : "bg-slate-50/60 border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <PlatformLogo platform={plat.id} size="sm" />
                          <div className="min-w-0">
                            <div className="font-extrabold text-slate-900 text-xs truncate">
                              {plat.name}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {plat.subName}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-[#ff4a22] bg-[#ff4a22] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= STEP 5: BUDGETS OF EVERY PLATFORM ================= */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-sm font-extrabold text-[#111113]">
                        Platform Budgets & Capital Allocation
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Allocate spend across every selected platform with
                      real-time conversion and ROAS projections.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Blended Daily Cap
                    </span>
                    <span className="text-lg font-black text-[#111113]">
                      ₹{totalDailyBudget.toLocaleString()}
                      <span className="text-xs text-slate-400 font-normal">
                        {" "}
                        / day
                      </span>
                    </span>
                  </div>
                </div>

                {/* Quick Budget Presets & Custom Input */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-700">
                      Set Total Daily Spend:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[500, 1000, 2500, 5000, 10000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setTotalDailyBudget(amt)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            totalDailyBudget === amt
                              ? "bg-[#111113] text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          ₹{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="range"
                    min="250"
                    max="20000"
                    step="250"
                    value={totalDailyBudget}
                    onChange={(e) =>
                      setTotalDailyBudget(Number(e.target.value))
                    }
                    className="w-full accent-[#ff4a22] cursor-pointer"
                  />
                </div>

                {/* Visual Allocation Segmented Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Network Capital Distribution:</span>
                    <span>
                      100% Allocated Across {activePlatforms.length} Networks
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                    {platformBudgetBreakdown.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          width: `${item.sharePct}%`,
                          backgroundColor: item.color,
                        }}
                        className="h-full transition-all duration-300"
                        title={`${item.name}: ${item.sharePct}% (₹${item.dailyAmt}/day)`}
                      />
                    ))}
                  </div>
                </div>

                {/* Autonomous AI Toggle Card */}
                <div className="p-3.5 bg-gradient-to-r from-orange-50/60 to-amber-50/30 rounded-2xl border border-orange-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#ff4a22]" />
                    <div>
                      <div className="text-xs font-bold text-[#111113] flex items-center gap-1.5">
                        <span>Autonomous ROAS Rebalancing</span>
                        <span className="text-[9px] uppercase font-black px-1.5 py-0.5 bg-[#ff4a22] text-white rounded-md">
                          AI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Dynamically routes budget every 15 min to the platform
                        generating highest ROAS.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoRebalance(!autoRebalance)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      autoRebalance ? "bg-[#ff4a22]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        autoRebalance ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Individual Budgets for Every Selected Platform */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-xs font-bold text-slate-700">
                    Live Budgets & Forecast for Every Platform:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {platformBudgetBreakdown.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <PlatformLogo platform={item.id} size="sm" />
                            <div>
                              <div className="font-extrabold text-[#111113] text-xs">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Est. {item.estRoas}
                          </span>
                        </div>

                        {/* Spend Numbers */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-left">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Daily Budget
                            </span>
                            <div className="text-sm font-black text-slate-900">
                              ₹{item.dailyAmt.toLocaleString()}
                              <span className="text-[10px] text-slate-400 font-normal">
                                {" "}
                                / day
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Monthly Spend
                            </span>
                            <div className="text-xs font-bold text-slate-700">
                              ₹{item.monthlyAmt.toLocaleString()} / mo
                            </div>
                          </div>
                        </div>

                        {/* Slider to adjust individual platform share */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span>Platform Share Weight:</span>
                            <span className="text-[#111113]">
                              {item.sharePct}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="80"
                            step="5"
                            value={platformShares[item.id] || 10}
                            onChange={(e) =>
                              handleShareChange(item.id, e.target.value)
                            }
                            className="w-full accent-[#ff4a22] cursor-pointer"
                          />
                        </div>

                        {/* Estimated Performance Metrics */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>
                            ~{item.estClicks.toLocaleString()} est. clicks
                          </span>
                          <span>
                            ~{item.estImpressions.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleGenerateAds}
                  className="text-xs font-bold text-[#ff4a22] hover:text-[#e03d17] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerate Creative</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <span>Launching Campaign...</span>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 text-[#ff4a22]" />
                        <span>
                          🚀 Launch Campaign Across {activePlatforms.length}{" "}
                          Networks (${totalDailyBudget.toLocaleString()}/day)
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE MULTI-PLATFORM PHONE MOCKUP */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#ff4a22]" />
              <span className="text-xs font-extrabold text-[#111113]">
                Live {creativeType === "video" ? "Video" : "Poster"} Preview
              </span>
            </div>

            {/* Platform Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-[10px] font-bold">
              {[
                { id: "instagram", label: "Instagram" },
                { id: "snapchat", label: "Snapchat" },
                { id: "google", label: "Google" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreviewPlatform(p.id)}
                  className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    previewPlatform === p.id
                      ? "bg-white text-[#111113] shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Phone Mockup Frame */}
          <div className="w-full max-w-[340px] mx-auto bg-slate-950 rounded-[42px] p-3 shadow-2xl border-4 border-slate-800">
            <div className="bg-white rounded-[34px] overflow-hidden text-slate-900 font-sans min-h-[520px] flex flex-col justify-between relative">
              {/* ================= INSTAGRAM PREVIEW ================= */}
              {previewPlatform === "instagram" && (
                <div className="flex flex-col justify-between h-full min-h-[520px]">
                  <div>
                    {/* IG Post Header */}
                    <div className="p-3 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-black text-[#111113]">
                            AD
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold leading-none">
                            {brandName}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">
                            Sponsored
                          </span>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs">•••</span>
                    </div>

                    {/* MEDIA DISPLAY (VIDEO OR POSTER) */}
                    <div className="w-full h-64 bg-slate-900 overflow-hidden relative">
                      {creativeType === "video" ? (
                        /* VIDEO PLAYER */
                        <div className="relative w-full h-full group">
                          <video
                            ref={videoRef}
                            src={selectedVideo.videoUrl}
                            loop
                            muted={isMuted}
                            playsInline
                            autoPlay
                            className="w-full h-full object-cover"
                          />
                          {/* Video Overlay Controls */}
                          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                            <button
                              type="button"
                              onClick={() => setIsMuted(!isMuted)}
                              className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
                            >
                              {isMuted ? (
                                <VolumeX className="w-3 h-3" />
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80"
                            >
                              {isPlaying ? (
                                <Pause className="w-3 h-3" />
                              ) : (
                                <Play className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {/* Sound wave / Reel tag */}
                          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px] font-medium">
                            <Music className="w-2.5 h-2.5 animate-spin" />
                            <span className="max-w-[130px] truncate">
                              {videoSound}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* POSTER DISPLAY WITH BADGE */
                        <div className="relative w-full h-full">
                          <img
                            src={selectedPoster.url}
                            alt="Poster Ad"
                            className="w-full h-full object-cover"
                          />
                          {/* Poster Promotional Badge */}
                          <div className="absolute top-2.5 left-2.5 bg-[#ff4a22] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                            <span>{posterBadge}</span>
                          </div>

                          {/* Price Tag Overlay */}
                          <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white px-2 py-1 rounded-md text-[10px] font-bold">
                            <span className="text-amber-300 font-extrabold">
                              {posterPrice}
                            </span>
                            <span className="text-white/60 line-through text-[8px] ml-1">
                              {posterOriginalPrice}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Bar */}
                    <div className="px-3 py-2 bg-slate-50 border-t border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 truncate max-w-[200px]">
                        {headline}
                      </span>
                      <button className="px-2.5 py-1 bg-[#ff4a22] text-white text-[9px] font-extrabold rounded-md flex items-center gap-1 cursor-pointer">
                        <span>{ctaText}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* IG Actions */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between text-slate-800">
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-slate-800" />
                          <MessageCircle className="w-4 h-4 text-slate-800" />
                          <Send className="w-4 h-4 text-slate-800" />
                        </div>
                        <Bookmark className="w-4 h-4 text-slate-800" />
                      </div>

                      <div className="text-[11px]">
                        <span className="font-bold mr-1.5">{brandName}</span>
                        <span className="text-slate-600 text-[10px] leading-relaxed line-clamp-3">
                          {caption}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating / Telemetry Pill */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-amber-500">
                      ⭐⭐⭐⭐⭐ 4.9/5
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-extrabold">
                      Est.{" "}
                      {creativeType === "video"
                        ? selectedVideo.roas
                        : selectedPoster.roas}{" "}
                      ROAS
                    </span>
                  </div>
                </div>
              )}

              {/* ================= SNAPCHAT PREVIEW ================= */}
              {previewPlatform === "snapchat" && (
                <div className="relative w-full h-[520px] bg-slate-900 rounded-[34px] overflow-hidden text-white flex flex-col justify-between p-4">
                  {creativeType === "video" ? (
                    <video
                      src={selectedVideo.videoUrl}
                      loop
                      muted={isMuted}
                      playsInline
                      autoPlay
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                  ) : (
                    <img
                      src={selectedPoster.url}
                      alt="Snapchat Poster"
                      className="absolute inset-0 w-full h-full object-cover opacity-85"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />

                  {/* Top Bar */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-white/80 font-bold">
                    <span>Discover</span>
                    <span className="text-white border-b-2 border-amber-300 pb-0.5">
                      Spotlight
                    </span>
                    <Search className="w-3.5 h-3.5" />
                  </div>

                  {/* Right Floating Actions */}
                  <div className="relative z-10 self-end flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white flex items-center justify-center text-[10px] font-bold">
                      AD
                    </div>
                    <div className="flex flex-col items-center">
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                      <span className="text-[9px]">48.2k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-[9px]">1,420</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Share2 className="w-5 h-5" />
                      <span className="text-[9px]">920</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-400 flex items-center justify-center animate-spin">
                      <Music className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {/* Bottom Text, Dynamic Subtitle Hook & CTA */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">
                        @{brandName.toLowerCase().replace(/\s/g, "")}
                      </span>
                      <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">
                        Sponsored
                      </span>
                    </div>

                    {creativeType === "video" && (
                      <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 inline-block">
                        <span className="text-[10px] font-extrabold text-amber-300">
                          {videoCaptionsHook}
                        </span>
                      </div>
                    )}

                    <p className="text-[10px] text-white/90 line-clamp-2 leading-relaxed">
                      {caption}
                    </p>

                    <div className="flex items-center gap-1.5 text-[9px] text-white/70">
                      <Music className="w-3 h-3 animate-spin" />
                      <span className="truncate">{videoSound}</span>
                    </div>

                    <div className="pt-1">
                      <button className="w-full py-2 bg-[#ff4a22] hover:bg-[#e03d17] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 shadow-lg cursor-pointer">
                        <span>{ctaText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= GOOGLE PREVIEW ================= */}
              {previewPlatform === "google" && (
                <div className="p-4 space-y-4 bg-white flex flex-col justify-between h-full min-h-[520px]">
                  <div>
                    <div className="text-xs text-slate-400 font-bold mb-3">
                      Google Sponsored Result
                    </div>
                    <div className="space-y-2 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">
                          Sponsored
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">
                          {destinationUrl}
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-blue-700 hover:underline leading-snug cursor-pointer">
                        {headline} | {brandName}
                      </h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-3">
                        {caption}
                      </p>

                      {/* Display Media Thumbnail */}
                      <div className="w-full h-28 rounded-xl overflow-hidden mt-2 relative">
                        <img
                          src={
                            creativeType === "video"
                              ? selectedVideo.thumbnail
                              : selectedPoster.url
                          }
                          alt="Google Ad Asset"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {creativeType === "video"
                            ? "Video Asset"
                            : "Poster Asset"}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {ctaText} →
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Instant Checkout
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 text-[10px] text-slate-500 font-medium text-center">
                    Simulated Google Responsive Display Ad Preview
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
