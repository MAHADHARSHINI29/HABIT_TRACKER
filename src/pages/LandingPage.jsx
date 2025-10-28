// src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Orbit, Star, Sparkles, Beaker } from "lucide-react";
import DecryptedText from "../components/ui/DecryptedText";
import RotatingText from "@/components/ui/RotatingText";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

//  Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
};

const LandingPage = () => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Demo login handler
  const handleDemoLogin = () => {
    dispatch(loginUser({ email: "username@example.com", password: "123456" }))
      .unwrap()
      .then(() => {
        navigate("/homepage"); // redirect after success
      })
      .catch((err) => {
        console.error("Demo login failed:", err);
        alert("Demo login failed: " + err); // helpful feedback
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1a1a2e] via-[#2a003f] to-[#3d0066] text-white px-4 sm:px-6 overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-70" />

      {/* --- App Logo --- */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 z-20">
        <Orbit className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 drop-shadow-md animate-spin-slow" />
        <span className="text-xl sm:text-2xl font-bold tracking-wide">
          Orbit
        </span>
      </div>

      {/* Decorative icons */}
      {!isMobile && (
        <>
          <Star className="absolute bottom-16 right-8 sm:right-14 w-8 sm:w-10 h-8 sm:h-10 text-yellow-200/30 animate-pulse" />
          <Sparkles className="absolute top-1/3 right-1/6 sm:right-1/4 w-6 sm:w-8 h-6 sm:h-8 text-white/25 animate-bounce" />
          <Star className="absolute top-10 right-6 sm:right-10 w-4 sm:w-6 h-4 sm:h-6 text-pink-300/40 animate-ping" />
          <Star className="absolute bottom-1/4 left-1/4 sm:left-1/3 w-3 sm:w-4 h-3 sm:h-4 text-purple-300/40 animate-bounce" />
        </>
      )}

      <div className="text-center max-w-2xl sm:max-w-3xl relative z-10">
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg leading-snug">
          <div className="mt-20 flex items-center gap-2 sm:gap-3 justify-center">
            <Orbit className="w-8 h-8 sm:w-10 sm:h-10 text-pink-300 animate-spin-slow" />
            <DecryptedText
              text={`Stay in your Orbit,\nBuild better habits`}
              animateOn="view"
              revealDirection="center"
            />
            <Sparkles className="w-5 sm:w-7 h-5 sm:h-7 text-yellow-200 animate-pulse" />
          </div>
        </h1>

        {/* Rotating text */}
        <div className="mt-4 sm:mt-6">
          <RotatingText
            texts={["Stay consistent", "Stay motivated", "Track your progress"]}
            mainClassName="px-3 sm:px-4 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold overflow-hidden py-1 md:py-2 justify-center rounded-lg shadow-lg text-sm sm:text-base"
            staggerFrom="last"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-6 relative z-10 w-full max-w-xs sm:max-w-none justify-center items-center">
        {/* Top row: Login + Sign Up (side by side on mobile) */}
        <div className="flex w-full sm:w-auto gap-3 sm:gap-6">
          <Link
            to="/login"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg
      bg-white/10 backdrop-blur-md border border-white/20 
      hover:bg-white/20 hover:scale-105 transition text-sm sm:text-base"
          >
            <LogIn size={18} /> Login
          </Link>

          <Link
            to="/signup"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg
      bg-gradient-to-r from-indigo-700 to-purple-800 text-white 
      border border-indigo-400/40 
      hover:scale-105 hover:brightness-110 transition text-sm sm:text-base"
          >
            <UserPlus size={18} /> Sign Up
          </Link>
        </div>

        {/* Demo Account (below on mobile, inline on desktop) */}
        <button
          onClick={handleDemoLogin}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg
    bg-gradient-to-r from-pink-500 to-red-500 text-white 
    border border-pink-400/40 
    hover:scale-105 hover:brightness-110 transition text-sm sm:text-base"
        >
          <Beaker size={18} /> Try Demo
        </button>
      </div>

      {/* Small text */}
      <div className="mt-8 sm:mt-10 text-xs sm:text-sm text-gray-300 relative z-10">
        New here?{" "}
        <Link
          to="/signup"
          className="underline font-medium hover:text-white transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
