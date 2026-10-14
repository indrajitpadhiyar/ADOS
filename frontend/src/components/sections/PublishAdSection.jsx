import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlatformLogo from "../common/PlatformLogo";
import { api } from "../../services/api";
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  X,
  Play,
  Pause,
  Image as ImageIcon,
  Video as VideoIcon,
  Tag,
  Link as LinkIcon,
  Copy,
  Check,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  Rocket,
  Layers,
  Sliders,
  DollarSign,
  TrendingUp,
  Globe,
  Radio,
  ChevronDown,
  Info,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

const PLATFORMS_CONFIG = [
  {
    key: "meta",
    name: "Meta Ads",
    sub: "Instagram & Facebook Feed/Reels",
    status: "Connected",
    defaultBudget: 1500,
    minBudget: 200,
    estimatedReach: "45K - 92K",
    bestFor: "Viral UGC & Visual Conversions",
  },
  {
    key: "google",
    name: "Google Ads",
    sub: "Search, Shopping & Performance Max",
    status: "Connected",
    defaultBudget: 2000,
    minBudget: 300,
    estimatedReach: "60K - 120K",
    bestFor: "High-Intent Shoppers",
  },
  {
    key: "amazon",
    name: "Amazon Sponsored",
    sub: "Sponsored Products & Brand Video",
    status: "Connected",
    defaultBudget: 1200,
    minBudget: 250,
    estimatedReach: "28K - 55K",
    bestFor: "Direct E-Commerce Checkout",
  },
  {
    key: "youtube",
    name: "YouTube Ads",
    sub: "In-Stream TrueView & Shorts Ads",
    status: "Connected",
    defaultBudget: 1000,
    minBudget: 200,
    estimatedReach: "35K - 75K",
    bestFor: "High Engagement Video",
  },
  {
    key: "linkedin",
    name: "LinkedIn Sponsored",
    sub: "Single Image & Video Ads",
    status: "Connected",
    defaultBudget: 800,
    minBudget: 500,
    estimatedReach: "12K - 24K",
    bestFor: "B2B & High-Value Customers",
  },
];

export default function PublishAdSection({ onAdPublished, onNavigateToManage }) {
  // Stepper state: 1: Content, 2: Details, 3: Select Platform, 4: Review & Launch
  const [currentStep, setCurrentStep] = useState(1);

  // Uploaded Files State
  const [files, setFiles] = useState([
    {
      id: "file-1",
      name: "product.jpg",
      size: "2.4 MB",
      type: "image",
      preview: "/backpack.jpg",
    },
    {
      id: "file-2",
      name: "product-video.mp4",
      size: "12.8 MB",
      type: "video",
      duration: "00:15",
      preview:
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&auto=format&fit=crop&q=80",
    },
  ]);

  // Form Details State
  const [adTitle, setAdTitle] = useState("50% Off - Premium Backpack");
  const [category, setCategory] = useState("Fashion & Apparel");
  const [description, setDescription] = useState(
    "Premium quality backpack with modern design. Perfect for college, office and travel. Limited time offer!"
  );
  const [cta, setCta] = useState("Shop Now");
  const [landingUrl, setLandingUrl] = useState("https://yourwebsite.com/offer");

  // UI helpers
  const [copied, setCopied] = useState(false);
  const [showProTip, setShowProTip] = useState(true);
  const [activePreviewDot, setActivePreviewDot] = useState(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Platform selection state (for Step 3)
  const [channels, setChannels] = useState({
    meta: { enabled: true, budget: 1500 },
    google: { enabled: true, budget: 2000 },
    amazon: { enabled: true, budget: 1200 },
    youtube: { enabled: false, budget: 1000 },
    linkedin: { enabled: false, budget: 800 },
  });

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccessNotice, setPublishSuccessNotice] = useState(false);

  // Copy URL to clipboard
  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(landingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle local file uploads
  const handleFileUpload = (e) => {
    const uploaded = Array.from(e.target.files || []);
    if (!uploaded.length) return;

    const newItems = uploaded.map((file, idx) => {
      const isVid = file.type.startsWith("video");
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      const objUrl = URL.createObjectURL(file);
      return {
        id: `upload-${Date.now()}-${idx}`,
        name: file.name,
        size: sizeMB,
        type: isVid ? "video" : "image",
        duration: isVid ? "00:10" : null,
        preview: objUrl,
      };
    });

    setFiles((prev) => [...prev, ...newItems]);
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const totalDailySpend = Object.keys(channels).reduce((acc, k) => {
    return channels[k].enabled ? acc + channels[k].budget : acc;
  }, 0);

  const activeChannelsCount = Object.keys(channels).filter(
    (k) => channels[k].enabled
  ).length;

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

  // Execute Publishing
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));

      const enabledKeys = Object.keys(channels).filter((k) => channels[k].enabled);
      const created = await api
        .createAd({
          name: adTitle,
          campaign: `Omnichannel_${adTitle}`,
          platform: enabledKeys[0] || "meta",
          format: "image",
          thumbnail: "/backpack.jpg",
          budget: totalDailySpend,
        })
        .catch(() => ({
          _id: `pub-${Date.now()}`,
          name: adTitle,
        }));

      const newRecord = {
        id: created._id || `pub-${Date.now()}`,
        name: adTitle,
        networks: enabledKeys,
        budget: `₹${totalDailySpend.toLocaleString()}/day`,
        status: "Active",
        time: "Just now",
      };

      if (onAdPublished) onAdPublished(newRecord);
      setPublishSuccessNotice(true);
    } catch (err) {
      alert(`Publishing failed: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 pb-16">
      {/* ======================================================== */}
      {/* 1. TOP HEADER & BREADCRUMB */}
      {/* ======================================================== */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep((prev) => prev - 1);
            } else if (onNavigateToManage) {
              onNavigateToManage();
            }
          }}
          className="w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
          title="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Publish Ads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Upload your content, add details and let AI handle the rest.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HORIZONTAL STEPPER PROGRESS BAR */}
      {/* ======================================================== */}
      <div className="flex items-center gap-2 sm:gap-4 py-2 overflow-x-auto scrollbar-none select-none">
        {[
          { step: 1, label: "Content" },
          { step: 2, label: "Details" },
          { step: 3, label: "Select Platform" },
          { step: 4, label: "Review & Launch" },
        ].map((item, idx, arr) => {
          const isActive = currentStep === item.step;
          const isPassed = currentStep > item.step;

          return (
            <React.Fragment key={item.step}>
              <button
                onClick={() => setCurrentStep(item.step)}
                className="flex items-center gap-2.5 group cursor-pointer focus:outline-none shrink-0"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#ff4a22] text-white shadow-sm ring-4 ring-orange-100"
                      : isPassed
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-slate-900 font-bold"
                      : isPassed
                      ? "text-slate-700"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </button>

              {idx < arr.length - 1 && (
                <div className="flex-1 min-w-[28px] max-w-[80px] sm:max-w-[120px] h-0.5 bg-slate-200 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN WORKFLOW: 2 COLUMNS (8 COLS LEFT, 4 COLS RIGHT) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: STEP CARDS */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1 & 2 VIEW (Matches user's screenshot exactly) */}
          {(currentStep === 1 || currentStep === 2) && (
            <>
              {/* CARD 1: UPLOAD YOUR CONTENT */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
                {/* Section Header */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ff4a22] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-[#111113]">
                      Upload Your Content
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Add your image or video file. We support high-quality media
                      formats.
                    </p>
                  </div>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.length) {
                      handleFileUpload({ target: { files: e.dataTransfer.files } });
                    }
                  }}
                  className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/30 hover:bg-blue-50/50 hover:border-blue-300 transition-all p-7 sm:p-9 flex flex-col items-center justify-center text-center cursor-pointer group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Cloud Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform mb-3">
                    <UploadCloud className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    Drag & drop your file here{" "}
                    <span className="text-blue-600 font-semibold underline underline-offset-2">
                      or click to browse
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports: JPG, PNG, MP4, MOV, WEBM • Max size: 100MB
                  </p>
                </div>

                {/* Uploaded Files Attachment Row */}
                <div className="flex flex-wrap gap-3.5 items-center pt-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="w-36 sm:w-40 rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs group relative"
                    >
                      {/* Thumbnail Container */}
                      <div className="h-28 bg-[#f5ad75] relative overflow-hidden flex items-center justify-center">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Video Play Overlay & Duration Tag */}
                        {file.type === "video" && (
                          <>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center pl-0.5 shadow-sm">
                                <Play className="w-3.5 h-3.5 fill-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-bold text-white tracking-wider">
                              {file.duration || "00:15"}
                            </div>
                          </>
                        )}

                        {/* Top-Right Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-red-600 shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                          title="Remove file"
                        >
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* File Details Footer */}
                      <div className="p-2.5 bg-white">
                        <div className="text-xs font-bold text-slate-800 truncate" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {file.size}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Multiple Files Card */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-[174px] rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/20 hover:bg-blue-50/40 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-1.5 text-blue-500 mb-2">
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-xs font-bold text-blue-400">+</span>
                      <VideoIcon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-slate-700 leading-snug">
                      You can add multiple files
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      (Image + Video)
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: ADD DETAILS */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
                {/* Section Header */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ff4a22] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    2
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-[#111113]">
                      Add Details
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      Tell us more about your ad so we can create the best campaign.
                    </p>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  {/* LEFT COLUMN: TITLE & DESCRIPTION */}
                  <div className="space-y-4">
                    {/* Ad Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Ad Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={adTitle}
                          maxLength={60}
                          onChange={(e) => setAdTitle(e.target.value)}
                          placeholder="e.g. 50% Off - Premium Backpack"
                          className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff4a22] focus:ring-2 focus:ring-orange-100 transition-all shadow-2xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 pointer-events-none">
                          {adTitle.length}/60
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <textarea
                          rows={4}
                          value={description}
                          maxLength={200}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell potential customers what makes your product irresistible..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/90 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#ff4a22] focus:ring-2 focus:ring-orange-100 transition-all shadow-2xs resize-none"
                        />
                        <div className="text-right text-[10px] font-semibold text-slate-400 mt-1">
                          {description.length}/200
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: CATEGORY, CTA, LANDING URL */}
                  <div className="space-y-4">
                    {/* Category / Product Type */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Category / Product Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-800 bg-white appearance-none focus:outline-none focus:border-[#ff4a22] focus:ring-2 focus:ring-orange-100 transition-all shadow-2xs cursor-pointer"
                        >
                          <option value="Fashion & Apparel">Fashion & Apparel</option>
                          <option value="Electronics & Tech">Electronics & Tech</option>
                          <option value="Home & Kitchen">Home & Kitchen</option>
                          <option value="Beauty & Grooming">Beauty & Grooming</option>
                          <option value="Fitness & Health">Fitness & Health</option>
                          <option value="Books & Education">Books & Education</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Call to Action (CTA) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Call to Action (CTA) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={cta}
                          onChange={(e) => setCta(e.target.value)}
                          className="w-full px-3.5 pr-8 py-2.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-800 bg-white appearance-none focus:outline-none focus:border-[#ff4a22] focus:ring-2 focus:ring-orange-100 transition-all shadow-2xs cursor-pointer"
                        >
                          <option value="Shop Now">Shop Now</option>
                          <option value="Order Now">Order Now</option>
                          <option value="Learn More">Learn More</option>
                          <option value="Claim Offer">Claim Offer</option>
                          <option value="Sign Up">Sign Up</option>
                          <option value="Get Started">Get Started</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Landing Page URL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Landing Page URL <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="url"
                          value={landingUrl}
                          onChange={(e) => setLandingUrl(e.target.value)}
                          placeholder="https://yourwebsite.com/offer"
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#ff4a22] focus:ring-2 focus:ring-orange-100 transition-all shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={handleCopyUrl}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Bottom Navigation Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (onNavigateToManage) onNavigateToManage();
                    }}
                    className="px-6 py-2.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-2.5 rounded-full bg-[#ff4a22] hover:bg-[#e63f19] text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 3 VIEW: SELECT PLATFORM */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff4a22] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  3
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#111113]">
                    Select Ad Networks & Allocate Daily Budget
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Choose which channels to activate. ADOS AI routes impressions dynamically for optimal ROAS.
                  </p>
                </div>
              </div>

              {/* Channels List */}
              <div className="space-y-3 pt-2">
                {PLATFORMS_CONFIG.map((p) => {
                  const state = channels[p.key];
                  return (
                    <div
                      key={p.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        state.enabled
                          ? "bg-orange-50/20 border-orange-200 shadow-2xs"
                          : "bg-slate-50/50 border-slate-200/70 opacity-60"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={state.enabled}
                            onChange={() => toggleChannel(p.key)}
                            className="w-4 h-4 rounded text-[#ff4a22] focus:ring-[#ff4a22] cursor-pointer"
                          />
                          <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                            <PlatformLogo platform={p.key} size="xs" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{p.name}</span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {p.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">{p.sub}</span>
                          </div>
                        </div>

                        {/* Budget allocation */}
                        {state.enabled && (
                          <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className="text-right">
                              <div className="text-[10px] uppercase font-bold text-slate-400">Daily Budget</div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-extrabold text-slate-700">₹</span>
                                <input
                                  type="number"
                                  value={state.budget}
                                  onChange={(e) => updateBudget(p.key, e.target.value)}
                                  className="w-20 px-2 py-1 rounded-lg border border-slate-200 text-xs font-extrabold text-slate-900 text-right focus:border-[#ff4a22] outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-2.5 rounded-full bg-[#ff4a22] hover:bg-[#e63f19] text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                >
                  <span>Review & Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 VIEW: REVIEW & LAUNCH */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff4a22] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  4
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-[#111113]">
                    Review & Launch Omnichannel Broadcast
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    Review campaign parameters before dispatching across live network APIs.
                  </p>
                </div>
              </div>

              {/* Review Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Campaign Title</div>
                    <div className="text-xs font-bold text-slate-800 truncate mt-0.5">{adTitle}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Product Category</div>
                    <div className="text-xs font-bold text-slate-800 truncate mt-0.5">{category}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Total Spend</div>
                    <div className="text-xs font-black text-[#ff4a22] truncate mt-0.5">
                      ₹{totalDailySpend.toLocaleString()}/day
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Active Networks</div>
                    <div className="text-xs font-bold text-emerald-600 truncate mt-0.5">
                      {activeChannelsCount} Connected
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Landing Destination</div>
                  <div className="text-xs font-mono text-slate-600 truncate">{landingUrl}</div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#ff4a22] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-black flex items-center gap-2.5 shadow-lg shadow-orange-500/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Rocket className={`w-4 h-4 text-white ${isPublishing ? "animate-spin" : "animate-bounce"}`} />
                  <span>{isPublishing ? "Publishing to Networks..." : "Launch Ad Campaign"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: PREVIEW, PRO TIP & WHAT HAPPENS NEXT */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. CONTENT PREVIEW CARD */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-extrabold text-[#111113] tracking-tight">
              Content Preview
            </h3>

            {/* Inner Ad Banner Preview */}
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#f8be8c] via-[#f5ad75] to-[#ef924f] p-5 sm:p-6 shadow-sm relative overflow-hidden flex items-center justify-between min-h-[260px] border border-orange-200/50">
              {/* Left Ad Copy */}
              <div className="max-w-[55%] z-10 space-y-2.5">
                <span className="inline-block px-3 py-1 rounded-full bg-[#ff4a22] text-white text-[10px] font-black tracking-wider uppercase shadow-2xs">
                  50% OFF
                </span>

                <div className="space-y-1">
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {adTitle.replace(/50%\s*Off\s*[-–]\s*/i, "") || "Premium Backpack"}
                  </h4>
                  <p className="text-xs font-semibold text-slate-700/90">
                    Style Meets Functionality
                  </p>
                </div>

                <div className="pt-2">
                  <button className="px-4 py-2 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                    <span>{cta || "Shop Now"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Visual (Backpack with Play Button Overlay) */}
              <div className="w-[45%] h-48 relative flex items-center justify-center">
                <img
                  src="/backpack.jpg"
                  alt="Backpack Preview"
                  className="w-full h-full object-contain drop-shadow-xl select-none"
                />

                {/* Centered Play Button Overlay */}
                <button
                  onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  className="absolute w-10 h-10 rounded-full bg-black/55 backdrop-blur-xs hover:bg-black/75 text-white flex items-center justify-center pl-0.5 shadow-md transition-all cursor-pointer hover:scale-110"
                  title="Play creative video preview"
                >
                  {isPlayingPreview ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Pagination Dots (7 Dots: 1 Active Orange Pill, 6 Gray Dots) */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <button
                  key={i}
                  onClick={() => setActivePreviewDot(i)}
                  className={`transition-all duration-200 cursor-pointer ${
                    activePreviewDot === i
                      ? "w-4 h-1.5 rounded-full bg-[#ff4a22]"
                      : "w-1.5 h-1.5 rounded-full bg-slate-200 hover:bg-slate-300"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 2. PRO TIP CARD */}
          {showProTip && (
            <div className="rounded-2xl bg-[#eff6ff] border border-blue-100 p-4 relative shadow-2xs">
              <button
                onClick={() => setShowProTip(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Dismiss tip"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Lightbulb className="w-4 h-4 fill-blue-500 text-blue-500" />
                <span className="text-xs font-extrabold text-blue-900">Pro Tip</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Use high-quality images or videos for better engagement and reach. AI
                will optimize your content for each platform.
              </p>
            </div>
          )}

          {/* 3. WHAT HAPPENS NEXT? CARD */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs relative overflow-hidden">
            {/* Header + Flying Rocket Illustration */}
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-sm font-extrabold text-[#111113] tracking-tight">
                What happens next?
              </h3>
              {/* Rocket icon with animated launch styling */}
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff4a22] shadow-2xs">
                  <Rocket className="w-5 h-5 -rotate-45" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 rounded-full bg-orange-400 blur-xs animate-ping" />
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4 pt-1">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ff4a22] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Add your content & details
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Upload files and fill in the information.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700">
                    Choose platforms
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Select where you want to run your ads.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700">
                    Set budget & launch
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Review and start your campaign with one click.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SUCCESS CELEBRATION MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {publishSuccessNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-md w-full p-7 text-center shadow-2xl border border-slate-100 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-[#111113]">
                  Campaign Successfully Published!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  "{adTitle}" has been queued and synchronized with {activeChannelsCount} ad network APIs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Daily Spend:</span>
                  <span className="text-[#ff4a22]">₹{totalDailySpend.toLocaleString()}/day</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Routing Status:</span>
                  <span className="text-emerald-600">Live & Synced</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPublishSuccessNotice(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Stay Here
                </button>
                <button
                  onClick={() => {
                    setPublishSuccessNotice(false);
                    if (onNavigateToManage) onNavigateToManage();
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#111113] hover:bg-black text-white text-xs font-bold cursor-pointer"
                >
                  Go to Manage Ads
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
