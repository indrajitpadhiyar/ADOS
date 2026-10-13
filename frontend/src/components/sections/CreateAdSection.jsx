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
  ArrowUp,
  Paperclip,
  Mic,
  MicOff,
  Download,
  Bot,
  Maximize2,
  Minimize2,
  RotateCcw,
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

const IMAGE_PROMPT_SUGGESTIONS = [
  "🔥 40% Off Weekend Flash Sale poster for luxury footwear",
  "🧴 Organic Clean Skincare Product Before & After poster",
  "⚡ Streetwear Drop with High-Contrast Typography & 5★ Badge",
  "💎 Luxury Minimal Watch launch poster with titanium movement",
];

const VIDEO_PROMPT_SUGGESTIONS = [
  "🔥 'Wait... did my CPA just drop to ₹650?!' Viral UGC Hook video",
  "⚡ Kinetic carbon sneaker motion reveal with bassline beat",
  "🎧 Aesthetic lifestyle sound-sync video with lo-fi focus soundtrack",
  "🚀 High-converting B2B SaaS ROAS scale case study video",
];

const PROMPT_SUGGESTIONS = VIDEO_PROMPT_SUGGESTIONS;

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
  const [creativeType, setCreativeType] = useState("video"); // default to video per user focus, with instant toggle to poster

  // Chatbot State for Conversational Creation ("Meet AI Mode" & Google Flow / ChatGPT)
  const [chatInput, setChatInput] = useState("");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [generationFlowProgress, setGenerationFlowProgress] = useState(0);
  const [activeFlowStepText, setActiveFlowStepText] = useState("");
  const [chatViewMode, setChatViewMode] = useState("full"); // 'full' (full-size chatbot) | 'split' (with phone mockup)
  const fileInputRef = useRef(null);
  const chatMessagesEndRef = useRef(null);

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

  // Chatbot auto-scroll
  useEffect(() => {
    if (hasStartedChat && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isGenerating, hasStartedChat]);

  // Chatbot Send Prompt Handler (Conversational Ad Generation)
  const handleSendPrompt = (overrideText = null) => {
    const textToSend = overrideText !== null ? overrideText : chatInput;
    if (!textToSend.trim() && !attachedImage) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      attachedImage: attachedImage,
      creativeType,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setHasStartedChat(true);
    setChatInput("");
    setAttachedImage(null);
    setIsGenerating(true);
    setGenerationFlowProgress(15);
    setActiveFlowStepText(
      creativeType === "video"
        ? "Google Flow: Analyzing creative hook & target audience sentiment..."
        : "ChatGPT Vision: Extracting visual hierarchy, font contrast & color palette..."
    );

    // Step 1: Hook / Storyboard
    setTimeout(() => {
      setGenerationFlowProgress(45);
      setActiveFlowStepText(
        creativeType === "video"
          ? "Storyboarding 3-part UGC hook & camera movements..."
          : "Composing typography, discount badges & product lighting..."
      );
    }, 700);

    // Step 2: Synthesis
    setTimeout(() => {
      setGenerationFlowProgress(75);
      setActiveFlowStepText(
        creativeType === "video"
          ? "Google Flow Veo 2.5: Synthesizing 60fps vertical 9:16 cuts..."
          : "Rendering 4K high-contrast poster & promotional badges..."
      );
    }, 1400);

    // Step 3: Sound sync / CTR optimization
    setTimeout(() => {
      setGenerationFlowProgress(95);
      setActiveFlowStepText(
        creativeType === "video"
          ? "Aligning 128 BPM soundtrack beat & kinetic captions hook..."
          : "Optimizing predicted CTR and finalizing assets..."
      );
    }, 2000);

    // Step 4: Finalize
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationFlowProgress(100);
      setActiveFlowStepText("");

      let newCreative;
      if (creativeType === "video") {
        const randomVid =
          SAMPLE_VIDEOS[Math.floor(Math.random() * SAMPLE_VIDEOS.length)];
        setSelectedVideo(randomVid);
        setHeadline(randomVid.headline);
        setCaption(randomVid.caption);
        setVideoCaptionsHook(randomVid.captionsHook);
        setVideoSound(randomVid.soundTrack);
        setAdName(`AI_Video_${randomVid.label.replace(/\s/g, "_")}_GoogleFlow`);
        setIsPlaying(true);
        newCreative = randomVid;
      } else {
        const randomPoster =
          SAMPLE_POSTERS[Math.floor(Math.random() * SAMPLE_POSTERS.length)];
        setSelectedPoster(randomPoster);
        setHeadline(randomPoster.headline);
        setCaption(randomPoster.caption);
        setPosterBadge(randomPoster.badge);
        setPosterPrice(randomPoster.price);
        setPosterOriginalPrice(randomPoster.originalPrice);
        setAdName(`AI_Poster_${randomPoster.label.replace(/\s/g, "_")}_ChatGPT`);
        newCreative = randomPoster;
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          creativeType === "video"
            ? `🎬 Synthesized with Google Flow Neural Video Engine! High-retention vertical UGC pacing, dynamic captions, and soundtrack synchronization are tuned for Meta Reels & Snapchat algorithms.`
            : `✨ Generated with ChatGPT Creative Studio! High-contrast visual hierarchy, promotional badges, and social proof elements are optimized for maximum feed CTR.`,
        creativeType,
        creativeData: newCreative,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    }, 2500);
  };

  // Voice recognition simulation
  const handleVoicePrompt = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setTimeout(() => {
      const samplePrompts =
        creativeType === "video"
          ? [
              "Create a 40% off flash sale video with viral UGC hook and energetic soundtrack",
              "Synthesize a sleek product reveal video for urban sneakers with kinetic speed cuts",
              "Generate an aesthetic lo-fi lifestyle video ad for noise cancelling headphones",
            ]
          : [
              "Design a high-converting 40% discount flyer for luxury footwear with gold rating badge",
              "Create a clean organic skincare product launch poster with glass skin aesthetics",
              "Generate a minimalist titanium watch announcement poster with limited edition badge",
            ];
      const picked =
        samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      setChatInput(picked);
      setIsListening(false);
    }, 2400);
  };

  // Image Upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAttachedImage({ name: file.name, url });
    }
  };

  // Reset chatbot back to centered Meet AI Mode
  const handleResetChat = () => {
    setHasStartedChat(false);
    setChatMessages([]);
    setChatInput("");
    setAttachedImage(null);
    setIsGenerating(false);
    setActiveFlowStepText("");
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
          campaign: campaign || "Ados_MultiNetwork_Scale",
          platform: previewPlatform === "facebook" ? "meta" : previewPlatform || "meta",
          format: creativeType === "video" ? "Video (9:16)" : "Display Poster (1:1)",
          thumbnail: creativeType === "video" ? selectedVideo?.thumbnail : selectedPoster?.url,
          budget: totalDailyBudget,
          destinationUrl: destinationUrl,
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

      {/* Centered Format Selector (Image vs Video) */}
      <div className="flex justify-center items-center w-full pt-1 pb-1">
        <div className="inline-flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={() => setCreativeType("poster")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              creativeType === "poster"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#ff4a22]" />
            <span>🖼️ Image / Poster Ads</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-100 text-[#ff4a22]">
              ChatGPT
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCreativeType("video")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              creativeType === "video"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Video className="w-4 h-4 text-purple-600" />
            <span>🎥 Video Ads</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
              Google Flow
            </span>
          </button>
        </div>
      </div>

      {/* ================= MODE 1: GENERATE ADS (AI CHATBOT STUDIO) ================= */}
      {activeMode === "generate" ? (
        <div className="w-full space-y-6">
          {/* INITIAL STATE: Centered Hero "Meet AI Mode" (Matches Screenshot Exactly) */}
          {!hasStartedChat ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 rounded-3xl border border-slate-200/80 p-8 sm:p-14 text-center min-h-[580px] flex flex-col justify-center items-center shadow-2xs relative overflow-hidden"
            >
              {/* Subtle Ambient Background Aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-300/15 via-purple-300/15 to-orange-300/15 blur-3xl pointer-events-none rounded-full" />

              <div className="relative z-10 max-w-4xl w-full space-y-7">
                {/* Title and Subtitle matching Screenshot */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/90 text-[11px] font-bold text-slate-700 shadow-2xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff4a22]" />
                    <span>
                      {creativeType === "video" ? "Google Flow Neural Video Mode" : "ChatGPT Creative Poster Mode"}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111113] tracking-tight">
                    Meet AI Mode
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 font-medium">
                    Ask detailed questions for better responses
                  </p>
                </div>

                {/* The Floating AI Input Pill with Multi-Color Aura Glow - Expanded Width */}
                <div className="relative w-full max-w-3xl sm:max-w-4xl mx-auto text-left">
                  {/* Iridescent Glowing Ring */}
                  <div className="absolute -inset-1.5 rounded-[32px] bg-gradient-to-r from-blue-400/30 via-emerald-400/25 to-purple-400/30 blur-xl opacity-85 ai-aura-glow pointer-events-none" />

                  <div className="relative bg-white rounded-[28px] border border-slate-200 shadow-xl p-5 sm:p-6 space-y-3.5">
                    {/* Attached Image Preview if selected */}
                    {attachedImage && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 w-fit text-xs text-slate-700 font-medium animate-fadeIn">
                        <img src={attachedImage.url} alt="Attached" className="w-6 h-6 rounded-md object-cover" />
                        <span className="truncate max-w-[160px]">{attachedImage.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedImage(null)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Voice Listening Status */}
                    {isListening && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold animate-pulse">
                        <Mic className="w-4 h-4 text-purple-600 animate-bounce" />
                        <span>Listening... Speak your ad prompt</span>
                      </div>
                    )}

                    {/* Textarea matching Screenshot "Ask anything" - Spacious & Increased */}
                    <textarea
                      rows={3}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendPrompt();
                        }
                      }}
                      placeholder={
                        creativeType === "video"
                          ? "Ask anything... e.g. Create a 40% discount video ad with viral UGC hook for urban sneakers"
                          : "Ask anything... e.g. Design a sleek 40% off promotional poster with 4.9★ badge for headphones"
                      }
                      className="w-full text-base sm:text-lg text-slate-800 placeholder-slate-400 font-medium bg-transparent border-0 outline-none resize-none leading-relaxed"
                    />

                    {/* Input Controls Bar: Image, Attach, Mic, Send */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-500">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          title="Attach product image or poster reference"
                          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-4.5 h-4.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          title="Attach brand assets or logo"
                          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-4.5 h-4.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleVoicePrompt}
                          title={isListening ? "Listening..." : "Speech input"}
                          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                            isListening
                              ? "bg-purple-100 text-purple-700"
                              : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <Mic className="w-4.5 h-4.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendPrompt()}
                          disabled={!chatInput.trim() && !attachedImage}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            chatInput.trim() || attachedImage
                              ? "bg-[#ff4a22] text-white shadow-md hover:opacity-90 hover:scale-105"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggestion Prompts matching Screenshot (with 🔍 search icon) - Aligned to Chat Box Width */}
                <div className="space-y-2 pt-2 max-w-3xl sm:max-w-4xl mx-auto text-left">
                  {(creativeType === "video" ? VIDEO_PROMPT_SUGGESTIONS : IMAGE_PROMPT_SUGGESTIONS).map(
                    (sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendPrompt(sug)}
                        className="w-full text-left p-3.5 rounded-2xl hover:bg-white/90 bg-slate-50/70 border border-slate-200/60 hover:border-slate-300 transition-all flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium cursor-pointer group shadow-2xs"
                      >
                        <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#ff4a22] transition-colors shrink-0" />
                        <span className="truncate group-hover:text-slate-900">{sug}</span>
                      </button>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE CHATBOT: Prompts Docked at Bottom, Chat expanded Full Size */
            <div
              className={`grid grid-cols-1 ${
                chatViewMode === "split" ? "lg:grid-cols-12" : "lg:grid-cols-1"
              } gap-8 items-start`}
            >
              {/* Main Full-Size Chatbot Container */}
              <div
                className={`${
                  chatViewMode === "split" ? "lg:col-span-7" : "w-full"
                } bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col justify-between min-h-[750px] relative overflow-hidden`}
              >
                {/* Top Chat Bar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <div className="text-xs font-extrabold text-[#111113] flex items-center gap-2">
                        <span>
                          {creativeType === "video" ? "Google Flow Veo 2.5 Active" : "ChatGPT Creative 4o Active"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#ff4a22]">
                          Live
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Autonomous Creative Engine
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setChatViewMode(chatViewMode === "full" ? "split" : "full")
                      }
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {chatViewMode === "full" ? (
                        <>
                          <Smartphone className="w-3.5 h-3.5 text-[#ff4a22]" />
                          <span>Phone Mockup (Split)</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-[#ff4a22]" />
                          <span>Full Size Chatbot</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetChat}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>New Chat</span>
                    </button>
                  </div>
                </div>

                {/* Chat Feed (Scrollable Conversation) */}
                <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[580px]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === "user" ? "items-end" : "items-start"
                      } space-y-2`}
                    >
                      {/* Avatar & Label */}
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                        {msg.role === "user" ? (
                          <>
                            <span>You</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#ff4a22] to-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                              AI
                            </div>
                            <span className="text-[#111113] font-bold">
                              {msg.creativeType === "video" ? "Google Flow Video" : "ChatGPT Poster"}
                            </span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                          </>
                        )}
                      </div>

                      {/* Message Bubble */}
                      {msg.role === "user" ? (
                        <div className="max-w-[85%] sm:max-w-[70%] bg-[#111113] text-white p-4 rounded-3xl rounded-tr-md shadow-sm space-y-2 text-xs sm:text-sm font-medium">
                          {msg.attachedImage && (
                            <div className="w-28 h-20 rounded-xl overflow-hidden border border-white/20 mb-2">
                              <img
                                src={msg.attachedImage.url}
                                alt="Ref"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <p>{msg.content}</p>
                        </div>
                      ) : (
                        <div className="w-full max-w-2xl bg-slate-50 border border-slate-200/90 rounded-3xl rounded-tl-md p-4 sm:p-6 space-y-5 shadow-2xs">
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                            {msg.content}
                          </p>

                          {/* Render Generated Creative Card */}
                          {msg.creativeType === "video" ? (
                            /* Google Flow Generated Video Card */
                            <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-4">
                              <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4 text-[#ff4a22]" />
                                  <span className="font-extrabold tracking-wide">
                                    Google Flow Veo v2.5 • 9:16 Vertical HD
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Est. {selectedVideo.roas} ROAS
                                </span>
                              </div>

                              {/* Playable Video Player */}
                              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-black group">
                                <video
                                  ref={videoRef}
                                  src={selectedVideo.videoUrl}
                                  loop
                                  muted={isMuted}
                                  playsInline
                                  autoPlay
                                  className="w-full h-full object-cover"
                                />

                                {/* Hook subtitle badge overlay */}
                                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-lg text-xs font-black border border-white/15">
                                  {videoCaptionsHook}
                                </div>

                                {/* Controls */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="p-2 rounded-full bg-black/60 text-white backdrop-blur-xs hover:bg-black/80 cursor-pointer"
                                  >
                                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-2 rounded-full bg-[#ff4a22] text-white hover:opacity-90 cursor-pointer"
                                  >
                                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                                  </button>
                                </div>

                                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-white/90 font-medium">
                                  <Music className="w-3 h-3 text-rose-400 animate-spin" />
                                  <span className="truncate max-w-[150px]">{videoSound}</span>
                                </div>
                              </div>

                              {/* Google Flow Cuts / Scene Selector */}
                              <div className="space-y-2 pt-1">
                                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                                  <span>Google Flow Scene Variations:</span>
                                  <span className="text-[10px] text-slate-400">Click to switch cut</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {SAMPLE_VIDEOS.map((vid) => (
                                    <button
                                      key={vid.id}
                                      type="button"
                                      onClick={() => handleApplyVideo(vid)}
                                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                        selectedVideo.id === vid.id
                                          ? "bg-[#ff4a22]/20 border-[#ff4a22] text-white ring-1 ring-[#ff4a22]"
                                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                                      }`}
                                    >
                                      <div className="text-[10px] font-bold text-amber-400 truncate">
                                        {vid.duration} • {vid.style}
                                      </div>
                                      <div className="text-xs font-bold truncate mt-0.5">{vid.label}</div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* ChatGPT Generated Poster Card */
                            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
                              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4 text-[#ff4a22]" />
                                  <span className="font-extrabold text-[#111113]">
                                    ChatGPT Vision 4o • High-CTR Ad Poster
                                  </span>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Est. {selectedPoster.roas} ROAS
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <div className="sm:col-span-5 relative rounded-xl overflow-hidden aspect-[4/5] bg-slate-100">
                                  <img
                                    src={selectedPoster.url}
                                    alt="Poster"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 left-2 bg-[#ff4a22] text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow">
                                    {posterBadge}
                                  </div>
                                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-black px-2 py-1 rounded">
                                    <span className="text-amber-300">{posterPrice}</span>
                                    <span className="text-white/50 line-through text-[8px] ml-1">
                                      {posterOriginalPrice}
                                    </span>
                                  </div>
                                </div>

                                <div className="sm:col-span-7 space-y-2 text-left">
                                  <div className="text-xs font-bold text-[#ff4a22] uppercase tracking-wide">
                                    {selectedPoster.category}
                                  </div>
                                  <h4 className="text-sm font-extrabold text-[#111113] leading-snug">
                                    {headline}
                                  </h4>
                                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                    {caption}
                                  </p>

                                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100">
                                      ⭐⭐⭐⭐⭐ {selectedPoster.rating}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                                      {selectedPoster.ctr} Predicted CTR
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Poster Presets Selector */}
                              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                <div className="text-[11px] font-bold text-slate-600">
                                  Alternative Poster Concepts:
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  {SAMPLE_POSTERS.map((poster) => (
                                    <button
                                      key={poster.id}
                                      type="button"
                                      onClick={() => handleApplyPoster(poster)}
                                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                                        selectedPoster.id === poster.id
                                          ? "bg-orange-50/60 border-[#ff4a22] ring-1 ring-[#ff4a22]"
                                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                      }`}
                                    >
                                      <div className="text-[9px] font-bold text-[#ff4a22] truncate">
                                        {poster.badge}
                                      </div>
                                      <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                                        {poster.label}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Creative Action Toolbar */}
                          <div className="pt-2 flex flex-wrap items-center gap-2.5">
                            <button
                              type="button"
                              onClick={handleLaunchCampaign}
                              className="px-5 py-2.5 rounded-xl bg-[#111113] hover:bg-black text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                            >
                              <Rocket className="w-3.5 h-3.5 text-[#ff4a22]" />
                              <span>🚀 Launch Omnichannel Campaign</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveMode("manual")}
                              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5 text-slate-600" />
                              <span>Fine-Tune in Custom Studio</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(`${headline}\n\n${caption}`);
                                alert("Creative headline & caption copied to clipboard!");
                              }}
                              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Copy</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Neural Generation Stream (In Progress Indicator) */}
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 space-y-3 max-w-xl shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs font-extrabold text-[#111113]">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[#ff4a22] animate-spin" />
                          <span>
                            {creativeType === "video"
                              ? "Google Flow Veo 2.5 Synthesizer..."
                              : "ChatGPT Vision 4o Poster Studio..."}
                          </span>
                        </div>
                        <span className="text-[#ff4a22] font-black">
                          {generationFlowProgress}%
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          style={{ width: `${generationFlowProgress}%` }}
                          className="h-full bg-gradient-to-r from-[#ff4a22] via-orange-500 to-amber-500 transition-all duration-300"
                        />
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {activeFlowStepText || "Synthesizing creative assets..."}
                      </p>
                    </motion.div>
                  )}

                  <div ref={chatMessagesEndRef} />
                </div>

                {/* BOTTOM DOCKED INPUT BAR: "chat bot come to buttom" */}
                <div className="p-4 sm:p-5 border-t border-slate-100 bg-white">
                  <div className="relative w-full">
                    {/* Multi-Color Aura Glow */}
                    <div className="absolute -inset-0.5 rounded-[26px] bg-gradient-to-r from-blue-400/25 via-emerald-400/20 to-purple-400/25 blur-md opacity-70 ai-aura-glow pointer-events-none" />

                    <div className="relative bg-white rounded-[24px] border border-slate-200 shadow-md p-3 sm:p-4 space-y-2">
                      {attachedImage && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 w-fit text-xs text-slate-700 font-medium">
                          <img
                            src={attachedImage.url}
                            alt="Ref"
                            className="w-5 h-5 rounded object-cover"
                          />
                          <span className="truncate max-w-[140px]">{attachedImage.name}</span>
                          <button
                            type="button"
                            onClick={() => setAttachedImage(null)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {isListening && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold animate-pulse">
                          <Mic className="w-3.5 h-3.5 text-purple-600 animate-bounce" />
                          <span>Listening... Speak your follow-up instruction</span>
                        </div>
                      )}

                      <textarea
                        rows={2}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendPrompt();
                          }
                        }}
                        placeholder="Ask follow-up: e.g. 'Make the headline punchier', 'Change soundtrack to Lo-Fi', 'Add 50% discount badge'..."
                        className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 font-medium bg-transparent border-0 outline-none resize-none leading-relaxed"
                      />

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach image"
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach file"
                            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleVoicePrompt}
                            className={`p-1.5 rounded-full cursor-pointer ${
                              isListening
                                ? "bg-purple-100 text-purple-700"
                                : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            <Mic className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendPrompt()}
                            disabled={!chatInput.trim() && !attachedImage}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              chatInput.trim() || attachedImage
                                ? "bg-[#ff4a22] text-white shadow-md hover:scale-105"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* In Split View Mode: Display Interactive Phone Mockup beside Chatbot */}
              {chatViewMode === "split" && (
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5 sticky top-24">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#ff4a22]" />
                      <span className="text-xs font-extrabold text-[#111113]">
                        Live {creativeType === "video" ? "Video" : "Poster"} Preview
                      </span>
                    </div>

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

                  {/* Phone Mockup Frame */}
                  <div className="w-full max-w-[320px] mx-auto bg-slate-950 rounded-[40px] p-2.5 shadow-2xl border-4 border-slate-800">
                    <div className="bg-white rounded-[32px] overflow-hidden text-slate-900 font-sans min-h-[500px] flex flex-col justify-between relative">
                      {previewPlatform === "instagram" && (
                        <div className="flex flex-col justify-between h-full min-h-[500px]">
                          <div>
                            <div className="p-3 flex items-center justify-between border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[9px] font-black text-[#111113]">
                                    AD
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold leading-none">{brandName}</span>
                                  <span className="text-[8px] text-slate-400 mt-0.5">Sponsored</span>
                                </div>
                              </div>
                              <span className="text-slate-400 text-xs">•••</span>
                            </div>

                            <div className="w-full h-60 bg-slate-900 overflow-hidden relative">
                              {creativeType === "video" ? (
                                <video
                                  src={selectedVideo.videoUrl}
                                  loop
                                  muted={isMuted}
                                  playsInline
                                  autoPlay
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={selectedPoster.url}
                                  alt="Poster"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            <div className="px-3 py-2 bg-slate-50 border-t border-b border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-700 truncate max-w-[180px]">
                                {headline}
                              </span>
                              <button className="px-2 py-1 bg-[#ff4a22] text-white text-[9px] font-bold rounded">
                                {ctaText}
                              </button>
                            </div>

                            <div className="p-3 space-y-1.5 text-[10px]">
                              <p className="line-clamp-2 text-slate-600">{caption}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {previewPlatform !== "instagram" && (
                        <div className="p-4 text-center text-xs text-slate-500 flex flex-col justify-center items-center min-h-[500px]">
                          <PlatformLogo platform={previewPlatform} size="md" />
                          <span className="mt-2 font-bold capitalize">{previewPlatform} Format Ready</span>
                          <span className="text-[10px] text-slate-400">Synchronized with AI Creative</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ================= MODE 2: CUSTOM STUDIO FORM & BUDGETS ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#ff4a22]" />
                  <h3 className="text-base font-extrabold text-[#111113]">
                    Manual Studio & Budget Configuration
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMode("generate")}
                  className="text-xs font-bold text-[#ff4a22] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Switch to AI Chatbot</span>
                </button>
              </div>

              <form onSubmit={handleLaunchCampaign} className="space-y-6">
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
                      <option value="Meta_Advantage_Scale_US_Broad">Meta Advantage+ Scale (Broad)</option>
                      <option value="Google_PMax_Top_Sellers_AssetGroup">Google PMax Best Sellers</option>
                      <option value="LinkedIn_B2B_DecisionMakers_Q4">LinkedIn B2B Decision Makers</option>
                      <option value="YouTube_Shorts_Direct_Conversion">YouTube Shorts Direct</option>
                      <option value="Amazon_Sponsored_Brands_HeroPack">Amazon Sponsored Brands</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Headline (Hook)
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Primary Text / Caption
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff4a22]/30 focus:border-[#ff4a22] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                      Call to Action (CTA)
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

                {/* Target Ad Networks */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#111113] flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#ff4a22]" />
                      Target Ad Networks ({activePlatforms.length} Active)
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectAllPlatforms}
                      className="text-[10px] font-bold text-[#ff4a22] hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {AVAILABLE_PLATFORMS.map((plat) => {
                      const isSelected = !!selectedPlatforms[plat.id];
                      return (
                        <div
                          key={plat.id}
                          onClick={() => togglePlatform(plat.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "bg-orange-50/30 border-[#ff4a22] shadow-2xs"
                              : "bg-slate-50 border-slate-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <PlatformLogo platform={plat.id} size="xs" />
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {plat.name}
                            </span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#ff4a22]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Platform Budgets */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#111113] flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-emerald-600" />
                      Total Daily Budget: ₹{totalDailyBudget.toLocaleString()}/day
                    </span>
                  </div>

                  <input
                    type="range"
                    min="250"
                    max="20000"
                    step="250"
                    value={totalDailyBudget}
                    onChange={(e) => setTotalDailyBudget(Number(e.target.value))}
                    className="w-full accent-[#ff4a22] cursor-pointer"
                  />
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Rocket className="w-4 h-4 text-[#ff4a22]" />
                    <span>
                      🚀 Launch Campaign Across {activePlatforms.length} Networks (₹
                      {totalDailyBudget.toLocaleString()}/day)
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Phone Mockup */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#ff4a22]" />
                <span className="text-xs font-extrabold text-[#111113]">
                  Live {creativeType === "video" ? "Video" : "Poster"} Preview
                </span>
              </div>

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

            {/* Phone Mockup Frame */}
            <div className="w-full max-w-[340px] mx-auto bg-slate-950 rounded-[42px] p-3 shadow-2xl border-4 border-slate-800">
              <div className="bg-white rounded-[34px] overflow-hidden text-slate-900 font-sans min-h-[520px] flex flex-col justify-between relative">
                {previewPlatform === "instagram" && (
                  <div className="flex flex-col justify-between h-full min-h-[520px]">
                    <div>
                      <div className="p-3 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-black text-[#111113]">
                              AD
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold leading-none">{brandName}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">Sponsored</span>
                          </div>
                        </div>
                        <span className="text-slate-400 text-xs">•••</span>
                      </div>

                      <div className="w-full h-64 bg-slate-900 overflow-hidden relative">
                        {creativeType === "video" ? (
                          <div className="relative w-full h-full">
                            <video
                              src={selectedVideo.videoUrl}
                              loop
                              muted={isMuted}
                              playsInline
                              autoPlay
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                              <button
                                type="button"
                                onClick={() => setIsMuted(!isMuted)}
                                className="p-1.5 rounded-full bg-black/60 text-white backdrop-blur-xs"
                              >
                                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                              </button>
                            </div>
                            <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[9px]">
                              <Music className="w-2.5 h-2.5" />
                              <span className="max-w-[130px] truncate">{videoSound}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img
                              src={selectedPoster.url}
                              alt="Poster"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 left-2.5 bg-[#ff4a22] text-white text-[9px] font-extrabold px-2 py-0.5 rounded">
                              {posterBadge}
                            </div>
                            <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white px-2 py-1 rounded text-[10px] font-bold">
                              <span className="text-amber-300 font-extrabold">{posterPrice}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="px-3 py-2 bg-slate-50 border-t border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700 truncate max-w-[200px]">
                          {headline}
                        </span>
                        <button className="px-2.5 py-1 bg-[#ff4a22] text-white text-[9px] font-extrabold rounded flex items-center gap-1">
                          <span>{ctaText}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="p-3 space-y-2 text-[11px]">
                        <span className="font-bold mr-1.5">{brandName}</span>
                        <span className="text-slate-600 text-[10px] leading-relaxed line-clamp-3">
                          {caption}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span className="text-amber-500">⭐⭐⭐⭐⭐ 4.9/5</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-extrabold">
                        Est. {creativeType === "video" ? selectedVideo.roas : selectedPoster.roas} ROAS
                      </span>
                    </div>
                  </div>
                )}

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
                        alt="Snapchat"
                        className="absolute inset-0 w-full h-full object-cover opacity-85"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />

                    <div className="relative z-10 flex items-center justify-between text-xs text-white/80 font-bold">
                      <span>Discover</span>
                      <span className="text-white border-b-2 border-amber-300 pb-0.5">Spotlight</span>
                      <Search className="w-3.5 h-3.5" />
                    </div>

                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">@{brandName.toLowerCase().replace(/\s/g, "")}</span>
                        <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Sponsored</span>
                      </div>

                      {creativeType === "video" && (
                        <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 inline-block">
                          <span className="text-[10px] font-extrabold text-amber-300">
                            {videoCaptionsHook}
                          </span>
                        </div>
                      )}

                      <p className="text-[10px] text-white/90 line-clamp-2">{caption}</p>

                      <div className="pt-1">
                        <button className="w-full py-2 bg-[#ff4a22] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1">
                          <span>{ctaText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {previewPlatform === "google" && (
                  <div className="p-4 space-y-4 bg-white flex flex-col justify-between h-full min-h-[520px]">
                    <div className="space-y-2 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">
                          Sponsored
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">{destinationUrl}</span>
                      </div>
                      <h4 className="text-xs font-black text-blue-700 leading-snug">
                        {headline} | {brandName}
                      </h4>
                      <p className="text-[10px] text-slate-600 line-clamp-3">{caption}</p>

                      <div className="w-full h-28 rounded-xl overflow-hidden mt-2 relative">
                        <img
                          src={creativeType === "video" ? selectedVideo.thumbnail : selectedPoster.url}
                          alt="Google Asset"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="pt-2">
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {ctaText} →
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 text-[10px] text-slate-500 font-medium text-center">
                      Simulated Google Ad Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
