import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film,
  Users,
  Clapperboard,
  Wand2,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Edit3,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  Share2,
  Sliders,
  ArrowRight,
  Layers,
  Sparkles,
  Camera,
  RotateCcw,
  Upload,
  Check,
  Video,
  Palette,
  Copy,
} from "lucide-react";

export default function GenerateVideoSection({ user, onNavigateBack }) {
  // Navigation tabs in left sidebar
  const [activeLeftTab, setActiveLeftTab] = useState("all-media"); // all-media, characters, scenes, tools
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);

  // Session State
  const [sessionTitle, setSessionTitle] = useState("Untitled session");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [cameraMotion, setCameraMotion] = useState("orbit"); // pan, zoom, orbit
  const [aspectRatio, setAspectRatio] = useState("9:16"); // 16:9, 9:16, 1:1
  const [selectedDuration, setSelectedDuration] = useState("10s");

  // Media Library state
  const [activeVideo, setActiveVideo] = useState({
    id: "vid-1",
    title: "Velocity Kinetic Sneaker Ad",
    prompt: "Cinematic commercial for high-performance sneakers in rain, dramatic slow motion, neon puddles",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
    duration: "00:15",
  });

  const [hasStartedGenerating, setHasStartedGenerating] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Quick preset cards
  const PRESET_CARDS = [
    {
      id: "card-1",
      title: "Build a visual moodboard",
      sub: "Collect video styles, pacing & color schemes",
      icon: Palette,
      color: "from-amber-400 to-orange-500",
      prompt: "High-energy fast-paced streetwear launch teaser, quick jump cuts, strobe neon aesthetics",
    },
    {
      id: "card-2",
      title: "Generate concept art & storyboards",
      sub: "Prompt-to-video cinematic scenes",
      icon: Wand2,
      color: "from-blue-400 to-indigo-600",
      prompt: "Ultra-crisp 4k macro shot of luxury wristwatch gears rotating smoothly, studio cinematic lighting",
    },
    {
      id: "card-3",
      title: "Create a few versions of a video ad",
      sub: "A/B test hooks, camera angles & dynamic sound",
      icon: Layers,
      color: "from-emerald-400 to-teal-600",
      prompt: "Viral TikTok UGC style unboxing of an ultra-light waterproof adventure backpack in mountain peaks",
    },
  ];

  // Media clips in All Media
  const [mediaClips, setMediaClips] = useState([
    {
      id: "clip-1",
      name: "Sneaker Drop Kinetic",
      duration: "00:15",
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      poster: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "clip-2",
      name: "Mountain Adventure Hook",
      duration: "00:10",
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      poster: "/poster_backpack.jpg",
    },
  ]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Trigger Video Generation
  const handleGenerateVideo = async (customPrompt) => {
    const finalPrompt = (customPrompt || prompt).trim();
    if (!finalPrompt || isGenerating) return;

    setIsGenerating(true);
    setHasStartedGenerating(true);
    setGenerationStep("Analyzing visual prompt & motion trajectory...");

    try {
      await new Promise((r) => setTimeout(r, 800));
      setGenerationStep("Synthesizing neural optical flow keyframes...");

      await new Promise((r) => setTimeout(r, 1000));
      setGenerationStep("Interpolating 60fps cinematic camera motion...");

      await new Promise((r) => setTimeout(r, 700));

      const newClip = {
        id: `clip-${Date.now()}`,
        name: finalPrompt.slice(0, 24) + "...",
        prompt: finalPrompt,
        duration: selectedDuration,
        type: "video",
        url:
          finalPrompt.toLowerCase().includes("backpack") ||
          finalPrompt.toLowerCase().includes("adventure")
            ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
            : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        poster:
          finalPrompt.toLowerCase().includes("backpack")
            ? "/poster_backpack.jpg"
            : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
      };

      setMediaClips((prev) => [newClip, ...prev]);
      setActiveVideo(newClip);
      setSessionTitle(finalPrompt.slice(0, 28));
      setPrompt("");
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-5.5rem)] flex font-['Plus_Jakarta_Sans',sans-serif] bg-white text-slate-800 rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden select-none">
      {/* ======================================================== */}
      {/* 1. LEFT TOOLBAR & ASSET SIDEBAR (WHITE THEME) */}
      {/* ======================================================== */}
      <div
        className={`bg-slate-50/70 border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 shrink-0 ${
          isLeftCollapsed ? "w-16 p-3 items-center" : "w-56 p-4"
        }`}
      >
        <div className="space-y-4">
          {/* Top Navigation Items */}
          <div className="space-y-1">
            {/* All Media */}
            <button
              onClick={() => setActiveLeftTab("all-media")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === "all-media"
                  ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              } ${isLeftCollapsed ? "justify-center px-0" : ""}`}
              title="All media"
            >
              <Film className="w-4 h-4 text-[#ff4a22] shrink-0" />
              {!isLeftCollapsed && <span>All media</span>}
            </button>

            {/* Characters */}
            <button
              onClick={() => setActiveLeftTab("characters")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === "characters"
                  ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              } ${isLeftCollapsed ? "justify-center px-0" : ""}`}
              title="Characters"
            >
              <Users className="w-4 h-4 text-slate-500 shrink-0" />
              {!isLeftCollapsed && <span>Characters</span>}
            </button>

            {/* Scenes */}
            <button
              onClick={() => setActiveLeftTab("scenes")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === "scenes"
                  ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              } ${isLeftCollapsed ? "justify-center px-0" : ""}`}
              title="Scenes"
            >
              <Clapperboard className="w-4 h-4 text-slate-500 shrink-0" />
              {!isLeftCollapsed && <span>Scenes</span>}
            </button>
          </div>

          <div className="border-t border-slate-200/80 my-2" />

          {/* Tools & Create Tool */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveLeftTab("tools")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeLeftTab === "tools"
                  ? "bg-white text-slate-900 border border-slate-200/90 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              } ${isLeftCollapsed ? "justify-center px-0" : ""}`}
              title="Tools"
            >
              <Wand2 className="w-4 h-4 text-slate-500 shrink-0" />
              {!isLeftCollapsed && <span>Tools</span>}
            </button>

            <button
              onClick={() => {
                const title = prompt("New camera/lighting tool preset name:");
                if (title) alert(`Tool "${title}" created.`);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-all cursor-pointer ${
                isLeftCollapsed ? "justify-center px-0" : ""
              }`}
              title="Create tool"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {!isLeftCollapsed && <span>Create tool</span>}
            </button>
          </div>

          {/* Generated Media Thumbnails in Left Sidebar */}
          {!isLeftCollapsed && (
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                Generated Takes
              </span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {mediaClips.map((clip) => (
                  <div
                    key={clip.id}
                    onClick={() => {
                      setActiveVideo(clip);
                      if (videoRef.current) {
                        videoRef.current.load();
                        videoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      activeVideo.id === clip.id
                        ? "bg-white border-[#ff4a22]/60 shadow-xs ring-2 ring-orange-100"
                        : "bg-white/80 border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className="w-10 h-7 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative">
                      <img src={clip.poster} alt={clip.name} className="w-full h-full object-cover" />
                      <Play className="w-2.5 h-2.5 fill-white text-white absolute inset-0 m-auto" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-slate-800 truncate">{clip.name}</div>
                      <div className="text-[9px] text-slate-400 font-medium">{clip.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sidebar Controls */}
        <div className="space-y-3 pt-3 border-t border-slate-200/80">
          <button
            onClick={() => {
              if (confirm("Clear session clips?")) {
                setMediaClips([]);
              }
            }}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${
              isLeftCollapsed ? "justify-center px-0" : ""
            }`}
            title="Trash"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            {!isLeftCollapsed && <span>Trash</span>}
          </button>

          <button
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer ${
              isLeftCollapsed ? "justify-center px-0" : ""
            }`}
            title={isLeftCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isLeftCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 shrink-0" />
            ) : (
              <PanelLeftClose className="w-4 h-4 shrink-0" />
            )}
            {!isLeftCollapsed && <span>Collapse</span>}
          </button>

          {!isLeftCollapsed && (
            <p className="text-[10px] text-slate-400 leading-tight px-1 font-medium">
              Google Flow can make mistakes, so double check it.
            </p>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CENTER CANVAS (PREVIEW / CREATIVE SPACE IN WHITE THEME) */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#fafbfc] relative overflow-hidden">
        {/* If no video has been generated yet */}
        {!hasStartedGenerating ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm">
            {/* Flower / Blossom creative icon from Google Flow screenshot */}
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#ff4a22] hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-9 h-9 stroke-[1.8] fill-none stroke-current"
              >
                <path d="M12 2a4 4 0 0 0-4 4c0 2 2 3 4 5 2-2 4-3 4-5a4 4 0 0 0-4-4Z" />
                <path d="M2 12a4 4 0 0 0 4 4c2 0 3-2 5-4-2-2-3-4-5-4a4 4 0 0 0-4 4Z" />
                <path d="M12 22a4 4 0 0 0 4-4c0-2-2-3-4-5-2 2-4 3-4 5a4 4 0 0 0 4 4Z" />
                <path d="M22 12a4 4 0 0 0-4-4c-2 0-3 2-5 4 2 2 3 4 5 4a4 4 0 0 0 4-4Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Start creating or drop media
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Prompt our AI diffusion video model or drop reference video/images
              </p>
            </div>
          </div>
        ) : (
          /* Active Video Player Screen */
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <div
              className={`w-full max-h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl relative border border-slate-200 group flex items-center justify-center ${
                aspectRatio === "9:16"
                  ? "max-w-[420px] aspect-[9/16]"
                  : aspectRatio === "1:1"
                  ? "max-w-[540px] aspect-square"
                  : "max-w-[800px] aspect-video"
              }`}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                src={activeVideo.url}
                poster={activeVideo.poster}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play / Pause Center Overlay Button */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center pl-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white" />
                )}
              </button>

              {/* Top Controls Overlay */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  {aspectRatio} • {cameraMotion.toUpperCase()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => window.open(activeVideo.url, "_blank")}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors cursor-pointer"
                    title="Download Clip"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Scrubber Overlay */}
              <div className="absolute bottom-4 inset-x-4 bg-black/60 backdrop-blur-md p-2.5 rounded-2xl flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 min-w-0 max-w-[70%]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate font-bold text-[11px]">{activeVideo.name}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  {activeVideo.duration}
                </span>
              </div>

              {/* Loading Shimmer Overlay while Generating */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff4a22] via-purple-500 to-amber-400 animate-spin blur-xs opacity-75" />
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center absolute inset-1 text-[#ff4a22]">
                        <Clapperboard className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-slate-900">
                        {generationStep || "Generating Video..."}
                      </h4>
                      <p className="text-xs text-slate-500 max-w-xs">
                        Google Flow diffusion model rendering physics & optical flow
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. RIGHT PANEL (AI CREATION SESSION IN WHITE THEME) */}
      {/* ======================================================== */}
      <div className="w-80 sm:w-96 bg-white border-l border-slate-200/90 flex flex-col justify-between p-5 shrink-0 shadow-xs">
        {/* Top Session Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Menu className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-900" />
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="text-xs font-bold text-slate-900 border-b border-orange-500 outline-none max-w-[160px]"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-[#ff4a22] transition-colors truncate max-w-[160px]">
                  {sessionTitle}
                </span>
                <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSessionTitle("Untitled session");
                setHasStartedGenerating(false);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Close session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Session Body / Welcome & Preset Cards */}
        <div className="my-auto py-6 space-y-5">
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Hi {user?.name || "Advertiser"}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              What would you like to create?
            </h2>
          </div>

          {/* 3 Preset Option Cards (White Theme with Colorful Icons) */}
          <div className="space-y-3 pt-1">
            {PRESET_CARDS.map((card) => {
              const IconComp = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => handleGenerateVideo(card.prompt)}
                  className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/90 flex items-center gap-3.5 cursor-pointer transition-all hover:scale-[1.01] hover:border-orange-300 group shadow-2xs"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#ff4a22] transition-colors truncate">
                      {card.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {card.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Aspect & Duration Selectors */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl font-bold text-slate-600">
              {["16:9", "9:16", "1:1"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    aspectRatio === ratio
                      ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl font-bold text-slate-600">
              {["5s", "10s", "15s"].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    selectedDuration === dur
                      ? "bg-[#ff4a22] text-white shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Input Prompt Bar (Google Flow / ChatGPT in White Theme) */}
        <div className="pt-3 border-t border-slate-100">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-2 focus-within:bg-white focus-within:border-[#ff4a22] focus-within:ring-2 focus-within:ring-orange-100 transition-all shadow-2xs space-y-2">
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerateVideo();
                }
              }}
              placeholder="What do you want to create?"
              className="w-full text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none bg-transparent resize-none leading-relaxed px-1"
            />

            <div className="flex items-center justify-between pt-1">
              {/* Left Plus icon (Attach Image/Reference) */}
              <button
                type="button"
                onClick={() => {
                  const sample = prompt("Enter reference image URL:");
                  if (sample) setPrompt((p) => `${p} [Ref: ${sample}]`);
                }}
                className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Add reference frame / image"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Right Settings & Send Button */}
              <div className="flex items-center gap-2">
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 rounded-lg px-2 py-1 outline-none cursor-pointer"
                  title="Camera Movement"
                >
                  <option value="orbit">Orbit 360°</option>
                  <option value="zoom">Slow Zoom</option>
                  <option value="pan">Cinematic Pan</option>
                </select>

                <button
                  onClick={() => handleGenerateVideo()}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-7 h-7 rounded-xl bg-[#ff4a22] hover:bg-[#e63f19] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer disabled:opacity-40 disabled:hover:scale-100"
                  title="Generate Video"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
