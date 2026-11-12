import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import OmnichannelShowcaseSection from "../components/sections/OmnichannelShowcaseSection";
import StrategicBentoSection from "../components/sections/StrategicBentoSection";
import DeviceShowcaseSection from "../components/sections/DeviceShowcaseSection";
import MaximizeEfficiencySection from "../components/sections/MaximizeEfficiencySection";
import AiAgentSection from "../components/sections/AiAgentSection";
import AboutSection from "../components/sections/AboutSection";

export default function HomePage({ user }) {
  const navigate = useNavigate();
  const handleOpenContact = () => navigate("/contact");

  // Initialize smooth scrolling with Locomotive Scroll (Lenis v5)
  useEffect(() => {
    let locomotiveScroll;
    try {
      locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          wrapper: window,
          content: document.documentElement,
          lerp: 0.08,
          duration: 1.2,
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1.0,
        },
      });

      // Synchronize ScrollTrigger
      ScrollTrigger.refresh();
    } catch (e) {
      console.warn("LocomotiveScroll fallback:", e);
    }

    return () => {
      if (locomotiveScroll && typeof locomotiveScroll.destroy === "function") {
        locomotiveScroll.destroy();
      }
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#fafbfc] text-[#121214] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-slate-900 selection:text-white overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenContact={handleOpenContact}
        onOpenAuth={() => navigate("/auth")}
        onOpenDashboard={() => navigate("/dashboard")}
      />

      {/* Page 1: Hero Section */}
      <HeroSection onOpenContact={handleOpenContact} />

      {/* Page 2: Omnichannel Showcase */}
      <OmnichannelShowcaseSection />

      {/* Page 3: Strategic Bento Section */}
      <StrategicBentoSection />

      {/* Page 4: Device Showcase & Giant ADOS */}
      <DeviceShowcaseSection onOpenContact={handleOpenContact} />

      {/* Page 5: Maximize Efficiency */}
      <MaximizeEfficiencySection
        onOpenContact={handleOpenContact}
        onOpenAuth={() => navigate("/auth")}
      />

      {/* Page 6: Autonomous AI Agent Section */}
      <AiAgentSection
        onOpenContact={handleOpenContact}
        onOpenAuth={() => navigate("/auth")}
      />

      {/* Pricing / Subscription Model Section (Commented Out) */}
      {/* <AboutSection
        onOpenContact={handleOpenContact}
        onOpenAuth={() => navigate("/auth")}
      /> */}

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />
    </div>
  );
}
