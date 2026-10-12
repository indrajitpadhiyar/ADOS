import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Lock,
  Mail,
  RefreshCw,
  Check,
} from "lucide-react";
import ClockWidget from "./ClockWidget";
import SmoothInput from "./SmoothInput";
import characterImg from "../assets/ados-character.png";

export default function FullPageAuth({ onLoginSuccess }) {
  // 'signup' | 'login'
  const [mode, setMode] = useState("signup");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Email verification state
  const [verifyModal, setVerifyModal] = useState({
    isOpen: false,
    status: "prompt", // 'prompt' | 'verifying' | 'success' | 'expired' | 'invalid' | 'already_verified'
    email: "",
    message: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendEmailInput, setResendEmailInput] = useState("");
  const [isResending, setIsResending] = useState(false);

  // References for smooth cursor & focus movement across inputs
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const GOOGLE_CLIENT_ID =
    import.meta.env?.VITE_GOOGLE_CLIENT_ID ||
    "821131046800-porffpf9he7l4b7v61gfo0gs6bg7fjmu.apps.googleusercontent.com";
  const API_BASE_URL = "http://localhost:5000/api/v1/auth";

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogle = () => {
      try {
        if (!window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      } catch (err) {
        console.warn("Google Identity initialization:", err);
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    const credential = response?.credential;
    if (!credential) {
      triggerToast("error", "Google authentication returned no credential.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Google authentication failed.");
      }

      if (data.data?.accessToken) {
        localStorage.setItem("ados_token", data.data.accessToken);
        if (data.data.user) {
          localStorage.setItem("ados_user", JSON.stringify(data.data.user));
        }
      }

      // If running in a popup window, pass user to opener and close self immediately
      if (window.opener && window.opener !== window) {
        try {
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_SUCCESS", user: data.data?.user },
            window.location.origin
          );
        } catch (e) {}
        window.close();
        return;
      }

      triggerToast("success", `Signed in with Google as ${data.data?.user?.name || "Advertiser"}!`);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(data.data?.user || { name: "Advertiser" });
        }
      }, 200);
    } catch (err) {
      triggerToast("error", err.message || "Failed to authenticate with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleButtonClick = () => {
    setIsLoading(true);
    triggerToast("info", "Redirecting to Google secure authentication...");

    // Generate high-entropy anti-CSRF state parameter
    const stateBytes = new Uint8Array(24);
    window.crypto.getRandomValues(stateBytes);
    const state = Array.from(stateBytes, (b) => b.toString(16).padStart(2, "0")).join("");
    sessionStorage.setItem("ados_google_auth_state", state);

    // Full-browser redirect to Google OpenID Connect endpoint for user sign-in
    const redirectUri = encodeURIComponent("http://localhost:5173/auth");
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      GOOGLE_CLIENT_ID
    )}&redirect_uri=${redirectUri}&response_type=token%20id_token&scope=openid%20email%20profile&state=${encodeURIComponent(
      state
    )}&nonce=${Date.now()}`;
    window.location.assign(oauthUrl);
  };

  // Listen for messages from popup window
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "GOOGLE_AUTH_CREDENTIAL" && event.data?.credential) {
        handleGoogleResponse({ credential: event.data.credential });
      } else if (event.data?.type === "GOOGLE_AUTH_SUCCESS" && event.data?.user) {
        triggerToast("success", `Signed in with Google as ${event.data.user.name || "Advertiser"}!`);
        if (onLoginSuccess) {
          onLoginSuccess(event.data.user);
        }
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, [onLoginSuccess]);

  // Check for Google OAuth callback, email verification token, or OAuth popup response in URL
  useEffect(() => {
    // 1. Check for Google OAuth return in URL hash (Implicit / OpenID Connect fragment)
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const idToken = hashParams.get("id_token");
      const returnedState = hashParams.get("state");
      const error = hashParams.get("error");
      const errorDesc = hashParams.get("error_description");

      // Scrub hash immediately to prevent token exposure in address bar or history
      window.history.replaceState({}, document.title, window.location.pathname);

      if (error) {
        triggerToast("error", errorDesc || `Google authentication failed: ${error}`);
        return;
      }

      if (idToken) {
        // Validate anti-CSRF state token
        const expectedState = sessionStorage.getItem("ados_google_auth_state");
        sessionStorage.removeItem("ados_google_auth_state");

        if (!returnedState || returnedState !== expectedState) {
          triggerToast("error", "Security validation failed: Invalid or expired OAuth state token.");
          return;
        }

        // If this window is a popup opened by the main window:
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage(
              { type: "GOOGLE_AUTH_CREDENTIAL", credential: idToken },
              window.location.origin
            );
          } catch (e) {}
          // Close popup immediately so dashboard opens in the main window
          window.close();
          return;
        }

        handleGoogleResponse({ credential: idToken });
        return;
      }
    }

    // 2. Check for Google OAuth query parameters (e.g. error redirects)
    const params = new URLSearchParams(window.location.search);
    const searchError = params.get("error");
    const searchErrorDesc = params.get("error_description");
    if (searchError) {
      window.history.replaceState({}, document.title, window.location.pathname);
      triggerToast("error", searchErrorDesc || `Google sign-in error: ${searchError}`);
      return;
    }

    // 3. Check for email verification token in search query
    const token = params.get("verifyToken") || params.get("token");
    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);
      handleTokenVerification(token);
    }
  }, []);

  const handleTokenVerification = async (token) => {
    setVerifyModal({
      isOpen: true,
      status: "verifying",
      email: "",
      message: "Verifying your security token...",
    });

    try {
      const res = await fetch(`${API_BASE_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.message || "Verification failed.";
        const isExpired = errorMsg.toLowerCase().includes("expired");
        setVerifyModal({
          isOpen: true,
          status: isExpired ? "expired" : "invalid",
          email: "",
          message: errorMsg,
        });
        return;
      }

      if (data.data?.alreadyVerified) {
        setVerifyModal({
          isOpen: true,
          status: "already_verified",
          email: "",
          message: data.message || "Your email address is already verified.",
        });
      } else {
        if (data.data?.accessToken) {
          localStorage.setItem("ados_token", data.data.accessToken);
          if (data.data.user) {
            localStorage.setItem("ados_user", JSON.stringify(data.data.user));
          }
        }
        setVerifyModal({
          isOpen: true,
          status: "success",
          email: data.data?.user?.email || "",
          message: data.message || "Email verified successfully!",
        });
        triggerToast("success", "Email verified! Redirecting to dashboard...");
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data.data?.user || { email: data.data?.user?.email });
          }
        }, 300);
      }
    } catch (err) {
      setVerifyModal({
        isOpen: true,
        status: "invalid",
        email: "",
        message: err.message || "Network error while connecting to verification service.",
      });
    }
  };

  const handleCodeVerification = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!verificationCode || verificationCode.trim().length !== 6) {
      triggerToast("error", "Please enter your 6-digit verification code.");
      return;
    }

    const emailToVerify = (verifyModal.email || formData.email || "").trim();
    if (!emailToVerify) {
      triggerToast("error", "Please enter or confirm your email address.");
      return;
    }

    setIsVerifyingCode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verificationCode.trim(),
          email: emailToVerify,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.message || "Invalid or expired verification code.";
        const isExpired = errorMsg.toLowerCase().includes("expired");
        setVerifyModal((prev) => ({
          ...prev,
          status: isExpired ? "expired" : "invalid",
          message: errorMsg,
        }));
        return;
      }

      if (data.data?.accessToken) {
        localStorage.setItem("ados_token", data.data.accessToken);
        if (data.data.user) {
          localStorage.setItem("ados_user", JSON.stringify(data.data.user));
        }
      }

      if (data.data?.alreadyVerified) {
        setVerifyModal((prev) => ({
          ...prev,
          status: "already_verified",
          message: data.message || "Your email address is already verified.",
        }));
      } else {
        setVerifyModal((prev) => ({
          ...prev,
          status: "success",
          message: data.message || "Email verified! You are now logged in.",
        }));
        triggerToast("success", "Email verified successfully! Welcome to ADOS.");
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data.data?.user || { name: emailToVerify.split("@")[0] });
          }
        }, 700);
      }
    } catch (err) {
      triggerToast("error", err.message || "Verification request failed.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResendVerification = async (targetEmail) => {
    const emailToUse = (targetEmail || verifyModal.email || resendEmailInput || formData.email || "").trim();
    if (!emailToUse) {
      triggerToast("error", "Please provide a valid email address.");
      return;
    }

    setIsResending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to resend verification email.");
      }

      triggerToast("success", data.message || "Verification email dispatched!");
      setVerifyModal({
        isOpen: true,
        status: "prompt",
        email: emailToUse,
        message: data.message,
      });
    } catch (err) {
      triggerToast("error", err.message || "Resend request failed.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!formData.email || !formData.password) {
      triggerToast("error", "Please enter your email and password.");
      return;
    }

    if (mode === "signup") {
      if (!formData.name.trim()) {
        triggerToast("error", "Please enter your full name.");
        return;
      }
      if (formData.password.length < 8) {
        triggerToast("error", "Password must be at least 8 characters long.");
        return;
      }
      if (!formData.confirmPassword) {
        triggerToast("error", "Please confirm your password.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        triggerToast("error", "Passwords do not match. Please verify.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = mode === "signup" ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
      const payload =
        mode === "signup"
          ? {
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }
          : {
              email: formData.email.trim(),
              password: formData.password,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (data.errors && data.errors[0]?.message) || "Authentication failed");
      }

      if (mode === "signup") {
        setVerifyModal({
          isOpen: true,
          status: "prompt",
          email: formData.email.trim(),
          message: data.message || "Verification link sent! Please check your inbox.",
        });
        triggerToast(
          "success",
          `Account created! Please check your inbox at ${formData.email.trim()}`
        );
      } else {
        // If login detects unverified email, immediately show 6-digit code entry modal
        if (data.data?.requiresEmailVerification) {
          setVerifyModal({
            isOpen: true,
            status: "prompt",
            email: formData.email.trim(),
            message: data.message || `Verification required. Check your inbox at ${formData.email.trim()}`,
          });
          triggerToast(
            "error",
            `Account unverified. 6-digit verification code sent to ${formData.email.trim()}`
          );
          return;
        }

        if (data.data?.accessToken) {
          localStorage.setItem("ados_token", data.data.accessToken);
          if (data.data.user) {
            localStorage.setItem("ados_user", JSON.stringify(data.data.user));
          }
        }

        triggerToast(
          "success",
          `Welcome back, ${data.data?.user?.name || formData.email.split("@")[0]}!`
        );
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(data.data?.user || { name: formData.email.split("@")[0] });
          }
        }, 200);
      }
    } catch (err) {
      triggerToast("error", err.message || "Failed to connect to authentication server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!forgotEmail) return;

    setForgotSubmitted(true);
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to process password recovery");
      }
      triggerToast("success", data.message || `Password recovery link sent to ${forgotEmail}`);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSubmitted(false);
        setForgotEmail("");
      }, 1200);
    } catch (err) {
      triggerToast("error", err.message || "Password recovery request failed");
      setForgotSubmitted(false);
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen overflow-hidden flex flex-col lg:flex-row bg-white font-['Outfit','Poppins','Plus_Jakarta_Sans',sans-serif] selection:bg-[#9ed84f] selection:text-[#18360d]">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3.5 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border ${
              toast.type === "success"
                ? "bg-slate-900/95 text-white border-[#9ed84f]/40"
                : "bg-rose-950/95 text-white border-rose-500/40"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#9ed84f] shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium tracking-wide">
              {toast.message}
            </span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= LEFT SIDE: FULL SIZE 3D CHARACTER IMAGE ================= */}
      <div className="relative w-full lg:w-[50%] xl:w-[48%] h-[340px] sm:h-[420px] lg:h-full overflow-hidden select-none shrink-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
        {/* Full Size 3D Character Background Image (Full Bleed) */}
        <img
          src={characterImg}
          alt="ADOS Platform Character at Work"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
        />

        {/* Subtle Ambient Vignette / Contrast Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none" />

        {/* Top Header Floating Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1b3e21]" />
            <span className="text-xs font-bold text-[#15341a] tracking-wide">
              ADOS Workspace
            </span>
          </div>

          {/* Minimalist Analog Clock */}
          <ClockWidget className="w-11 h-11 sm:w-13 sm:h-13 bg-white shadow-md border-2 border-white/80" />
        </div>

        {/* Bottom Tagline on Left Panel */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white font-medium drop-shadow-md">
          <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            &copy; {new Date().getFullYear()} ADOS Platform
          </span>
          <span className="bg-white/80 backdrop-blur-md text-[#15341a] px-3.5 py-1 rounded-full font-bold text-[11px] shadow-sm">
            Built for a better tomorrow
          </span>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FULL HEIGHT WHITE AUTH CARD ================= */}
      <div className="flex-1 h-full bg-white flex flex-col justify-between overflow-y-auto px-6 py-8 sm:px-12 md:px-16 lg:px-20 xl:px-24">
        {/* Top Header: Quick Demo Fill Button */}
        {/* <div className="w-full max-w-[400px] mx-auto flex justify-end pb-2">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-semibold text-[#548421] hover:text-[#416817] flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1 rounded-full bg-[#f1f9e6] hover:bg-[#e6f4d3] border border-[#d6ecb7]"
            title="Auto-fill sample credentials"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7dbb34]" />
            <span>Demo Fill</span>
          </button>
        </div> */}

        {/* Centered Form Area */}
        <div className="my-auto py-4 max-w-[390px] w-full mx-auto">
          {/* USER ADDED ADOS LOGO FROM public/ados.png */}
          <div className="flex flex-col items-center mb-5">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center"
            >
              <img
                src="/ados2.png"
                alt="ADOS - Built For A Better Tomorrow"
                className="h-40 sm:h-48 w-auto max-w-[280px] object-contain select-none"
              />
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-[#1a2b20] text-center tracking-normal mb-8 font-['Outfit','Poppins','Plus_Jakarta_Sans',sans-serif]"
          >
            {mode === "signup" ? "Create account" : "Welcome back"}
          </motion.h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field in Sign Up */}
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <SmoothInput
                    inputRef={nameInputRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Full name"
                    autoComplete="name"
                    onEnterNext={() => emailInputRef.current?.focus()}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <SmoothInput
              inputRef={emailInputRef}
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              autoComplete="email"
              onEnterNext={() => passwordInputRef.current?.focus()}
            />

            {/* Password with Eye Visibility Toggle */}
            <SmoothInput
              inputRef={passwordInputRef}
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              onEnterNext={() => {
                if (mode === "signup") {
                  confirmPasswordInputRef.current?.focus();
                } else {
                  handleSubmit();
                }
              }}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              }
            />

            {/* Confirm Password Field (Sign Up Mode) */}
            <AnimatePresence>
              {mode === "signup" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden space-y-1"
                >
                  <SmoothInput
                    inputRef={confirmPasswordInputRef}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    autoComplete="new-password"
                    onEnterNext={handleSubmit}
                    rightElement={
                      <div className="flex items-center gap-1.5">
                        {formData.confirmPassword && (
                          formData.password === formData.confirmPassword ? (
                            <span title="Passwords match">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </span>
                          ) : (
                            <span title="Passwords do not match yet">
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            </span>
                          )
                        )}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                          title={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-slate-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    }
                  />
                  {formData.confirmPassword && (
                    <p
                      className={`text-[11px] px-3 font-medium transition-colors ${
                        formData.password === formData.confirmPassword
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {formData.password === formData.confirmPassword
                        ? "✓ Passwords match"
                        : "Passwords must match"}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password Link in Login Mode */}
            {mode === "login" && (
              <div className="flex justify-end pr-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs text-slate-500 hover:text-[#548421] transition-colors cursor-pointer font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Primary Lime Green Pill Button (Faithful to Reference Image) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] active:bg-[#7ebd30] text-[#1c3a0e] font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2 mt-3"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-[#1c3a0e] border-t-transparent rounded-full"
                  />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>{mode === "signup" ? "Create account" : "Sign in"}</span>
              )}
            </motion.button>
          </form>

          {/* Social Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {mode === "signup" ? "Or sign up with" : "Or sign in with"}
            </span>
          </div>

          {/* Real Google OAuth Action */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              id="google-signin-btn"
              onClick={handleGoogleButtonClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs transition-all shadow-xs hover:shadow-sm cursor-pointer disabled:opacity-50"
              title="Authenticate securely with Google"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </motion.button>
          </div>

          {/* Terms and Privacy Notice */}
          <div className="text-center mt-6 text-[11px] leading-relaxed text-slate-500 font-normal">
            By creating an account you agree to ADOS's{" "}
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                triggerToast("success", "Terms of Services viewed");
              }}
              className="text-[#548421] font-bold hover:underline"
            >
              Terms of Services
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                triggerToast("success", "Privacy Policy viewed");
              }}
              className="text-[#548421] font-bold hover:underline"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>

        {/* Bottom Mode Switcher */}
        <div className="text-center pt-4 border-t border-slate-100 max-w-[390px] mx-auto w-full">
          <span className="text-xs text-slate-500">
            {mode === "signup"
              ? "Have an account? "
              : "Don't have an account? "}
          </span>
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
            className="text-xs font-bold text-[#548421] hover:text-[#3e6616] hover:underline cursor-pointer transition-colors"
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 space-y-4 z-10"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#548421]" />
                  Reset your Password
                </h3>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your email address to receive an official ADOS password
                recovery link.
              </p>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <SmoothInput
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@ados.io"
                  autoComplete="email"
                  onEnterNext={handleForgotSubmit}
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotSubmitted}
                    className="px-6 py-2.5 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] text-[#1c3a0e] font-bold text-xs shadow-sm cursor-pointer transition-colors"
                  >
                    {forgotSubmitted ? "Sending..." : "Send reset link"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= EMAIL VERIFICATION MODAL / BANNER ================= */}
      <AnimatePresence>
        {verifyModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (verifyModal.status !== "verifying") {
                  setVerifyModal((prev) => ({ ...prev, isOpen: false }));
                }
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-7 sm:p-8 shadow-2xl border border-slate-100 z-10 text-center space-y-5"
            >
              {/* Close Button */}
              {verifyModal.status !== "verifying" && (
                <button
                  type="button"
                  onClick={() => setVerifyModal((prev) => ({ ...prev, isOpen: false }))}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Status: PROMPT (After Signup or Resend) */}
              {verifyModal.status === "prompt" && (
                <div className="space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#f1f9e6] flex items-center justify-center text-[#548421]">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2b20]">Check your inbox</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    We sent a 6-digit verification code to{" "}
                    <strong className="text-slate-900">{verifyModal.email || formData.email}</strong>.
                    Enter the code below to activate your account.
                  </p>

                  {/* 6-Digit Code Input Section */}
                  <form onSubmit={handleCodeVerification} className="space-y-3 pt-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Enter 6-Digit Code
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setVerificationCode(val);
                        }}
                        placeholder="• • • • • •"
                        className="w-full max-w-[240px] text-center font-mono text-2xl font-black tracking-[0.35em] py-2.5 px-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#9ed84f] focus:bg-white focus:outline-none transition-all text-[#172c1c]"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isVerifyingCode || verificationCode.length !== 6}
                      className="w-full py-3 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] active:bg-[#7ebd30] text-[#1c3a0e] font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isVerifyingCode ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying code...</span>
                        </>
                      ) : (
                        <span>Verify Code</span>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center gap-2 my-2 text-[11px] text-slate-400">
                    <span className="flex-1 h-px bg-slate-100" />
                    <span>or click the email link</span>
                    <span className="flex-1 h-px bg-slate-100" />
                  </div>

                  <p className="text-[11px] text-slate-400">
                    The code and link will expire in 30 minutes. Be sure to check your spam/junk folder.
                  </p>
                  <div className="pt-1 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={() => handleResendVerification(verifyModal.email)}
                      className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Resending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Resend code</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyModal((prev) => ({ ...prev, isOpen: false }));
                        setMode("login");
                      }}
                      className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Go to Sign in
                    </button>
                  </div>
                </div>
              )}

              {/* Status: VERIFYING */}
              {verifyModal.status === "verifying" && (
                <div className="space-y-4 py-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#f1f9e6] flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-6 h-6 border-3 border-[#548421] border-t-transparent rounded-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a2b20]">Verifying your email...</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Validating your cryptographic token with the ADOS security service.
                  </p>
                </div>
              )}

              {/* Status: SUCCESS */}
              {verifyModal.status === "success" && (
                <div className="space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Email verified!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Your email address has been successfully verified. Your ADOS workspace account is now fully active.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyModal((prev) => ({ ...prev, isOpen: false }));
                        setMode("login");
                      }}
                      className="w-full py-3 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] text-[#1c3a0e] font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      Sign In Now
                    </button>
                  </div>
                </div>
              )}

              {/* Status: ALREADY VERIFIED */}
              {verifyModal.status === "already_verified" && (
                <div className="space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#f1f9e6] text-[#548421] flex items-center justify-center">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Already verified</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    Your email address was already verified previously. You can sign in to your workspace.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyModal((prev) => ({ ...prev, isOpen: false }));
                        setMode("login");
                      }}
                      className="w-full py-3 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] text-[#1c3a0e] font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      Go to Sign In
                    </button>
                  </div>
                </div>
              )}

              {/* Status: EXPIRED */}
              {verifyModal.status === "expired" && (
                <div className="space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Link expired</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    This verification link has expired. Verification links are valid for 30 minutes for security.
                  </p>
                  <div className="pt-2 space-y-2">
                    <SmoothInput
                      type="email"
                      value={resendEmailInput}
                      onChange={(e) => setResendEmailInput(e.target.value)}
                      placeholder="Enter your email to resend"
                      autoComplete="email"
                      onEnterNext={() => handleResendVerification(resendEmailInput)}
                    />
                    <button
                      type="button"
                      disabled={isResending}
                      onClick={() => handleResendVerification(resendEmailInput)}
                      className="w-full py-2.5 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] text-[#1c3a0e] font-bold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                    >
                      {isResending ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sending new link...</span>
                        </>
                      ) : (
                        <span>Request new verification link</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Status: INVALID */}
              {verifyModal.status === "invalid" && (
                <div className="space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Invalid link</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                    This verification link is invalid, malformed, or has already been used.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyModal((prev) => ({
                          ...prev,
                          status: "expired",
                        }));
                      }}
                      className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Resend link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyModal((prev) => ({ ...prev, isOpen: false }));
                        setMode("login");
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#9ed84f] hover:bg-[#8ecb3e] text-[#1c3a0e] font-bold text-xs shadow-sm transition-colors cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
