// src/pages/Signup.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, resetSignup, loginUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Orbit, Star, Sparkles, Beaker } from "lucide-react";

// ✅ Hook to detect mobile
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

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupSuccess, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const isMobile = useIsMobile();

  // ✅ Demo login handler
  const handleDemoLogin = () => {
    dispatch(loginUser({ email: "username@example.com", password: "123456" }))
      .unwrap()
      .then(() => {
        navigate("/homepage");
      })
      .catch((err) => {
        console.error("Demo login failed:", err);
        alert("Demo login failed: " + err);
      });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setFormError("⚠️ Please fill all the fields");
      return;
    }
    if (password.length < 6) {
      setFormError("⚠️ Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("⚠️ Passwords do not match");
      return;
    }

    setFormError("");
    dispatch(signupUser({ username: name, email, password }));
  };

  // Redirect after signup
  useEffect(() => {
    if (signupSuccess) {
      navigate("/login");
      dispatch(resetSignup());
    }
  }, [signupSuccess, navigate, dispatch]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1a1a2e] via-[#2a003f] to-[#3d0066] text-white px-4 sm:px-6 overflow-hidden">
      {/* ✅ Logo clickable → go to Landing Page */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 z-20 cursor-pointer"
      >
        <Orbit className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 drop-shadow-md animate-spin-slow" />
        <span className="text-xl sm:text-2xl font-bold tracking-wide">
          Orbit
        </span>
      </div>

      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-70" />

      {/* Decorative Stars + Sparkles */}
      {!isMobile && (
        <>
          <Star className="absolute bottom-16 right-8 sm:right-14 w-8 sm:w-10 h-8 sm:h-10 text-yellow-200/30 animate-pulse" />
          <Sparkles className="absolute top-1/3 left-1/6 sm:left-1/4 w-6 sm:w-8 h-6 sm:h-8 text-white/25 animate-bounce" />
          <Star className="absolute top-10 right-6 sm:right-10 w-4 sm:w-6 h-4 sm:h-6 text-pink-300/40 animate-ping" />
          <Star className="absolute bottom-1/4 left-1/4 sm:left-1/3 w-3 sm:w-4 h-3 sm:h-4 text-purple-300/40 animate-bounce" />
        </>
      )}

      {/* Signup Card */}
      <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 text-gray-900 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-sm sm:max-w-md w-full transition duration-500 hover:shadow-pink-400/30 z-10">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <Orbit className="w-7 h-7 text-pink-400 animate-spin-slow" />
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Create Account
          </h2>
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <input
            autoFocus
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 border border-gray-200 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 border border-gray-200 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition duration-300 text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 border border-gray-200 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 text-sm sm:text-base"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/95 border border-gray-200 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-pink-400 outline-none transition duration-300 text-sm sm:text-base"
          />

          {/* Error Messages */}
          {(formError || error) && (
            <div className="text-red-500 text-xs sm:text-sm text-center">
              {formError || error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold py-2.5 sm:py-3 rounded-full shadow-lg transition duration-300 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* ✅ Continue as Guest Button */}
        <button
          onClick={handleDemoLogin}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-2.5 sm:py-3 rounded-full shadow-lg transition duration-300 text-sm sm:text-base"
        >
          <Beaker size={18} /> Try Demo Mode
        </button>

        {/* Redirect to login */}
        <p className="text-center text-gray-700 mt-4 sm:mt-6 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-pink-500 font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
