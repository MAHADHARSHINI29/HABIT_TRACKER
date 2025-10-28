// src/components/ui/MagicBento.jsx
import React, { useEffect, useRef, lazy, Suspense } from "react";
import gsap from "gsap";

// Import homepage components
import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import AddHabitForm from "../AddHabitForm";
import DailyHabits from "../DailyHabits";
import Streak from "../Streak";
import Challenges from "../Challenges";
import Footer from "../Footer";

// Lazy load heavier components
const ProgressCharts = lazy(() => import("../ProgressCharts"));
const Achievements = lazy(() => import("../Achievements"));

// ---------------- Global Spotlight Effect ----------------
const GlobalSpotlight = () => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const spotlight = spotlightRef.current;

    const handleMove = (e) => {
      gsap.to(spotlight, {
        x: e.clientX - 150,
        y: e.clientY - 150,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <div ref={spotlightRef} className="global-spotlight" />;
};

// ---------------- Magic Bento Wrapper ----------------
const MagicBento = () => {
  return (
    <div className="magicbento-wrapper">
      <Navbar />
      <GlobalSpotlight />

      {/* Homepage Sections */}
      <div className="homepage-sections">
        <div className="section-card" id="hero">
          <HeroSection />
        </div>
        <div className="section-card" id="habits">
          <DailyHabits />
        </div>
        <div className="section-card" id="add-habit">
          <AddHabitForm />
        </div>
        <div className="section-card" id="progress">
          <Suspense fallback={<div>Loading charts...</div>}>
            <ProgressCharts />
          </Suspense>
        </div>
        <div className="section-card" id="streak">
          <Streak />
        </div>
        <div className="section-card" id="achievements">
          <Suspense fallback={<div>Loading achievements...</div>}>
            <Achievements />
          </Suspense>
        </div>
        <div className="section-card" id="challenges">
          <Challenges />
        </div>
      </div>

      <Footer />

      {/* Styling (unchanged) */}
      <style jsx>{`
        .magicbento-wrapper {
          min-height: 100vh;
          background: #0a0a14;
          padding: 1.5rem; /* same as before */
        }

        .homepage-sections {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem; /* same as before */
        }

        .section-card {
          background: linear-gradient(135deg, #1a1a2e, #2a003f);
          border-radius: 16px; /* unchanged */
          /* no padding added here */
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5),
            0 0 15px rgba(147, 51, 234, 0.4);
          color: white;
        }

        /* Desktop tweaks only */
        @media (min-width: 768px) {
          .section-card {
            padding: 1.5rem; /* only for desktop */
            border-radius: 20px;
          }
        }

        /* Spotlight */
        .global-spotlight {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(
            circle,
            rgba(168, 85, 247, 0.25),
            transparent 70%
          );
          filter: blur(80px);
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

export default React.memo(MagicBento);
