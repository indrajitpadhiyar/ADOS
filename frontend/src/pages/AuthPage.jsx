import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullPageAuth from "../components/FullPageAuth";

export default function AuthPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  // If already authenticated, redirect straight to dashboard (only in main window)
  useEffect(() => {
    // If running in a popup from earlier, redirect opener to full dashboard and close popup immediately
    if (window.opener && window.opener !== window) {
      try {
        window.opener.location.href = "/dashboard";
      } catch (e) {}
      window.close();
      return;
    }

    const token = localStorage.getItem("ados_token");
    const storedUser = localStorage.getItem("ados_user");
    if (token && storedUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // Sync login across tabs/windows (e.g. when popup saves token to localStorage)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "ados_token" && e.newValue) {
        const storedUser = localStorage.getItem("ados_user");
        let parsed = null;
        try {
          parsed = storedUser ? JSON.parse(storedUser) : null;
        } catch {}
        if (onLoginSuccess && parsed) {
          onLoginSuccess(parsed);
        }
        navigate("/dashboard", { replace: true });
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [navigate, onLoginSuccess]);

  const handleSuccess = (userData) => {
    if (userData) {
      localStorage.setItem("ados_user", JSON.stringify(userData));
    }

    // If running in a popup window, notify opener and close popup window
    if (window.opener && window.opener !== window) {
      try {
        window.opener.postMessage(
          { type: "GOOGLE_AUTH_SUCCESS", user: userData },
          window.location.origin
        );
      } catch {}
      window.close();
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
    // Redirect the main window to dashboard
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="relative w-full min-h-screen">
      {/* Quick Back to Landing Bar */}
      <div className="fixed top-4 left-4 z-50">
        {/* <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-md border border-slate-200 transition-all hover:scale-105 cursor-pointer"
        >
          ← Back to Landing
        </button> */}
      </div>

      <FullPageAuth onLoginSuccess={handleSuccess} />
    </div>
  );
}
