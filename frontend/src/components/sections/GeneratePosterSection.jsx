import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Maximize2,
  X,
  Sliders,
  ChevronDown,
  Rocket,
} from "lucide-react";

export default function GeneratePosterSection({ onNavigateBack }) {
  const navigate = useNavigate();

  // Settings
  const [selectedSize, setSelectedSize] = useState("square"); // square (1:1), portrait (4:5), story (9:16)
  const [selectedStyle, setSelectedStyle] = useState("minimal"); // minimal, product, bold
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Conversation & Generation History (ChatGPT / Gemini style)
  const [generations, setGenerations] = useState([
    {
      id: "gen-init",
      userPrompt: "Create a premium backpack ad poster",
      imageUrl: "/poster_backpack.jpg",
      size: "square",
      style: "minimal",
      timestamp: "Just now",
      seed: 42,
    },
  ]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [generations, isGenerating]);

  // Build high-quality AI prompt based on selected style & size
  const buildEnhancedPrompt = (rawPrompt, styleKey) => {
    let styleModifier = "";
    if (styleKey === "minimal") {
      styleModifier = ", minimalist aesthetic, clean studio lighting, soft natural shadows, elegant product photography, 8k resolution";
    } else if (styleKey === "product") {
      styleModifier = ", commercial product advertisement photography, sharp focus, professional color grading, studio backdrop, Hasselblad shot, 8k";
    } else if (styleKey === "bold") {
      styleModifier = ", vibrant cinematic colors, dynamic volumetric lighting, hyper-detailed, bold dramatic composition, award-winning visual";
    }
    return `${rawPrompt}${styleModifier}`;
  };

  // Generate real AI image like ChatGPT / Gemini
  const handleGenerate = async (overridePrompt) => {
    const textPrompt = (overridePrompt || prompt).trim();
    if (!textPrompt || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep("Understanding prompt...");

    const newId = `gen-${Date.now()}`;
    const seed = Math.floor(Math.random() * 999999);

    // Dimension calculation
    let width = 1024;
    let height = 1024;
    if (selectedSize === "portrait") {
      width = 896;
      height = 1120;
    } else if (selectedSize === "story") {
      width = 768;
      height = 1344;
    }

    const enhanced = buildEnhancedPrompt(textPrompt, selectedStyle);

    try {
      await new Promise((r) => setTimeout(r, 600));
      setGenerationStep("Synthesizing visual canvas...");

      // Pollinations AI image generator
      const aiGeneratedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        enhanced
      )}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

      // Preload image
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        setTimeout(resolve, 5000);
        img.src = aiGeneratedUrl;
      });

      setGenerationStep("Finalizing resolution...");
      await new Promise((r) => setTimeout(r, 400));

      const newGen = {
        id: newId,
        userPrompt: textPrompt,
        imageUrl: aiGeneratedUrl,
        size: selectedSize,
        style: selectedStyle,
        timestamp: "Just now",
        seed,
      };

      setGenerations((prev) => [...prev, newGen]);
      setPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  // Download image helper
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "ados-ai-poster.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, "_blank");
    }
  };

  // Copy prompt helper
  const handleCopyPrompt = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run Ad with this generated visual helper
  const handleRunAd = (gen) => {
    try {
      localStorage.setItem("ados_ad_preview_image", gen.imageUrl);
      localStorage.setItem("ados_ad_preview_title", gen.userPrompt);
    } catch {}
    navigate("/publish-ads");
  };

  // Aspect ratio helper class
  const getAspectRatioClass = (sizeKey) => {
    switch (sizeKey) {
      case "portrait":
        return "aspect-[4/5] max-w-[480px]";
      case "story":
        return "aspect-[9/16] max-w-[380px]";
      case "square":
      default:
        return "aspect-square max-w-[540px]";
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 relative select-none">
      {/* ======================================================== */}
      {/* 1. TOP HEADER */}
      {/* ======================================================== */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => {
              if (onNavigateBack) onNavigateBack();
              else window.history.back();
            }}
            className="w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer shrink-0"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Generate Poster
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create stunning ad visuals with AI
            </p>
          </div>
        </div>

        {/* Quick Style & Ratio Pill Switcher */}
        <div className="flex items-center gap-2">
          {/* Ratio Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            {[
              { id: "square", label: "1:1" },
              { id: "portrait", label: "4:5" },
              { id: "story", label: "9:16" },
            ].map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedSize(ratio.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedSize === ratio.id
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {/* Style Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            {[
              { id: "minimal", label: "Minimal" },
              { id: "product", label: "Product" },
              { id: "bold", label: "Bold" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStyle(st.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedStyle === st.id
                    ? "bg-[#ff4a22] text-white shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. CHAT STREAM CONTAINER (CHATGPT / GEMINI FULL-WIDTH PLAIN) */}
      {/* ======================================================== */}
      <div className="max-w-4xl w-full mx-auto flex-1 space-y-7 py-6 pb-36 overflow-y-auto">
        {/* Initial Assistant Greeting */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4a22] to-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            A
          </div>

          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-slate-700">ADOS AI</span>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                What image shall we create today? 🎨
              </div>
              <div className="text-xs text-slate-500 font-medium leading-relaxed">
                Type any idea, concept, or product visual prompt — ADOS AI
                generates pure high-definition artwork without superimposed text.
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {[
                { label: "🎒 Leather Backpack Ad", prompt: "A luxury black leather backpack on a weathered rustic wooden log in autumn mountain forest, warm golden sunlight, commercial product photography" },
                { label: "🏡 Modern Luxury Villa", prompt: "A modern luxury architectural villa with green grass lawn, glass walls, swimming pool, blue sky, cinematic architectural render" },
                { label: "⌚ Minimalist Watch", prompt: "Chronos minimal luxury titanium wristwatch with sapphire crystal, clean marble pedestal, dramatic studio lighting" },
                { label: "👟 Futuristic Sneaker", prompt: "Futuristic kinetic running sneaker floating in mid-air, dynamic propulsion plate, clean studio backdrop, 8k resolution" },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleGenerate(chip.prompt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-600 hover:text-slate-900 shadow-2xs transition-all cursor-pointer group"
                >
                  <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-[#ff4a22] transition-colors" />
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Turns (User Prompts & Clean Generated Visuals) */}
        {generations.map((gen, idx) => (
          <div key={gen.id || idx} className="space-y-6">
            {/* User Prompt Message */}
            <div className="flex items-center justify-end gap-2.5">
              <div className="bg-[#EEF4FF] border border-blue-100/90 text-xs sm:text-sm font-semibold text-slate-800 px-4 py-2.5 rounded-2xl rounded-tr-xs shadow-2xs max-w-xl leading-relaxed">
                {gen.userPrompt}
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                👤
              </div>
            </div>

            {/* AI Generated Clean Image Card */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4a22] to-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                A
              </div>

              <div className="space-y-3 w-full max-w-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">ADOS AI</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {gen.size} • {gen.style}
                  </span>
                </div>

                {/* Pure Clean Image Box - No Text Overlaid */}
                <div
                  className={`w-full ${getAspectRatioClass(
                    gen.size
                  )} rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 relative bg-slate-950 group select-none transition-all duration-300`}
                >
                  <img
                    src={gen.imageUrl}
                    alt={gen.userPrompt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />

                  {/* Actions Toolbar on Hover (Run Ad, Download, Fullscreen, Copy) */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/15">
                    <button
                      onClick={() => handleRunAd(gen)}
                      className="px-2.5 py-1.5 rounded-xl text-white bg-[#ff4a22] hover:bg-[#e63f19] transition-all cursor-pointer shadow-md flex items-center gap-1 text-xs font-bold"
                      title="Run Ad Campaign with this Image"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Run Ad</span>
                    </button>

                    <button
                      onClick={() => setFullscreenImage(gen.imageUrl)}
                      className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
                      title="View Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopyPrompt(gen.userPrompt, gen.id)}
                      className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors cursor-pointer"
                      title="Copy Prompt"
                    >
                      {copiedId === gen.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleDownload(
                          gen.imageUrl,
                          `ados-ai-${gen.id}.jpg`
                        )
                      }
                      className="p-2 rounded-xl text-white hover:bg-[#ff4a22] transition-colors cursor-pointer"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Hover Caption, Regenerate & Run Ad */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity text-white flex items-center justify-between">
                    <p className="text-xs font-medium truncate max-w-[65%] drop-shadow-xs">
                      {gen.userPrompt}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerate(gen.userPrompt)}
                        className="text-[11px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                      <button
                        onClick={() => handleRunAd(gen)}
                        className="px-2 py-1 rounded-lg bg-[#ff4a22] hover:bg-[#e63f19] text-white text-[11px] font-extrabold flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                      >
                        <Rocket className="w-3 h-3" />
                        <span>Run Ad</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Message Turn */}
        {isGenerating && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff4a22] to-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              A
            </div>

            <div className="w-full max-w-2xl bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg flex flex-col items-center justify-center gap-3 text-center">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff4a22] via-purple-500 to-amber-400 animate-spin blur-xs opacity-75" />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center absolute inset-1 text-[#ff4a22]">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-slate-800">
                  {generationStep || "Generating AI Visual..."}
                </div>
                <div className="text-[11px] text-slate-400">
                  Synthesizing neural imagery from your prompt...
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* ======================================================== */}
      {/* 3. FIXED CHAT SECTION AT THE ABSOLUTE BOTTOM (LIKE CHATGPT / GEMINI) */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-40 px-4 pb-4 pt-4 bg-gradient-to-t from-[#fafbfc] via-[#fafbfc]/95 to-transparent backdrop-blur-xs">
        <div className="max-w-4xl w-full mx-auto">
          {/* Main Floating Chat Box */}
          <div className="rounded-3xl border border-slate-300 bg-white p-2 sm:p-2.5 shadow-2xl flex items-center gap-3 transition-all focus-within:border-[#ff4a22] focus-within:ring-2 focus-within:ring-orange-100">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 ml-1 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Message ADOS AI to generate image... (e.g. A luxury watch on black marble)"
              className="flex-1 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            />

            {/* Active Aspect & Style Indicators */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-600 select-none">
              <span>{selectedSize === "square" ? "1:1" : selectedSize === "portrait" ? "4:5" : "9:16"}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#ff4a22] uppercase text-[10px]">{selectedStyle}</span>
            </div>

            {/* Orange Send Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="w-10 h-10 rounded-full bg-[#ff4a22] hover:bg-[#e63f19] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer shrink-0 disabled:opacity-40 disabled:hover:scale-100"
              title="Send Prompt"
            >
              <Send className="w-4 h-4 -translate-y-0.5 translate-x-0.5 fill-white stroke-[1.5]" />
            </button>
          </div>

          {/* ChatGPT-style subtle disclaimer */}
          <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
            ADOS AI can generate creative visuals and photorealistic ads. Verify results for commercial campaign specs.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FULLSCREEN IMAGE PREVIEW MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreenImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={fullscreenImage}
              alt="Fullscreen AI Art"
              className="max-w-[90vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
