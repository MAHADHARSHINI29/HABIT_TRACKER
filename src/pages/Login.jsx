import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../features/auth/authSlice";
import { resetHabitsOnLogin, setHabits } from "../features/habits/habitsSlice";
import { Link, useNavigate } from "react-router-dom";
import { Orbit, Star, Sparkles, Beaker } from "lucide-react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();

// Hook to detect mobile
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

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const isMobile = useIsMobile();

  // Handle login submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError("⚠️ Please fill all the fields");
      return;
    }
    if (password.length < 6) {
      setFormError("⚠️ Password must be at least 6 characters");
      return;
    }
    setFormError("");
    dispatch(loginUser({ email, password }));
  };

  // Handle Demo Mode login
  const handleDemoMode = async () => {
    try {
      const demoEmail = "username@example.com"; // your demo email
      const demoPassword = "123456"; // your demo password

      const userCredential = await signInWithEmailAndPassword(
        auth,
        demoEmail,
        demoPassword
      );
      const demoUser = userCredential.user;

      // Fetch demo habits
      const habitsRef = collection(db, "users", demoUser.uid, "habits");
      const snapshot = await getDocs(habitsRef);
      const habits = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      dispatch(
        setUser({
          uid: demoUser.uid,
          email: demoUser.email,
          username: "Demo User",
          isDemo: true,
        })
      );
      dispatch(setHabits(habits));

      navigate("/homepage");
    } catch (err) {
      console.error("Demo mode login failed:", err.message);
      alert("Demo mode is unavailable right now. Please try again later.");
    }
  };

  // Redirect after login
  useEffect(() => {
    if (user) {
      dispatch(resetHabitsOnLogin(user.uid));
      navigate("/homepage");
    }
  }, [user, navigate, dispatch]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#1a1a2e] via-[#2a003f] to-[#3d0066] text-white px-4 sm:px-6 overflow-hidden">
      {/* --- App Logo --- */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 z-20 cursor-pointer"
      >
        <Orbit className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400 drop-shadow-md animate-spin-slow" />
        <span className="text-xl sm:text-2xl font-bold tracking-wide">
          HabiHobby
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

      {/* Login Card */}
      <div className="relative backdrop-blur-xl bg-white/80 border border-white/30 text-gray-900 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md transition duration-500 hover:shadow-pink-400/30">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent text-center mb-6 sm:mb-8">
          Log In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white/95 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition duration-300 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-white/95 border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition duration-300 text-sm sm:text-base"
            required
          />

          {(formError || error) && (
            <div className="text-red-500 text-xs sm:text-sm text-center">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 text-white font-semibold py-2.5 sm:py-3 rounded-full shadow-lg transition duration-300 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* 🧪 Demo Mode Button */}
        <button
          onClick={handleDemoMode}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-red-500 hover:to-pink-500 text-white font-semibold py-2.5 sm:py-3 rounded-full shadow-lg transition duration-300 text-sm sm:text-base"
        >
          <Beaker size={18} /> Try Demo Mode
        </button>

        {/* Signup Redirect */}
        <p className="text-center text-gray-700 mt-5 sm:mt-6 text-sm sm:text-base">
          New user?{" "}
          <Link
            to="/signup"
            className="text-pink-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
