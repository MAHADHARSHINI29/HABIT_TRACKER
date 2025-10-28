// src/components/HeroSection.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue } from "firebase/database";

const toISODate = (date) => new Date(date).toLocaleDateString("en-CA");

//calculate streak
const calculateStreak = (habits) => {
  let maxStreak = 0;
  habits.forEach((h) => {
    if (h.history) {
      let streak = 0;
      const dates = Object.keys(h.history).sort().reverse();
      if (dates.length > 0) {
        let lastDate = new Date(dates[0]);
        for (let i = 0; i < dates.length; i++) {
          const current = new Date(dates[i]);
          const expected = new Date(lastDate);
          expected.setDate(lastDate.getDate() - i);

          if (current.toDateString() === expected.toDateString()) {
            streak++;
          } else break;
        }
      }
      maxStreak = Math.max(maxStreak, streak);
    }
  });
  return maxStreak;
};

const HeroSection = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    username: "",
    totalHabits: 0,
    completedHabits: 0,
    currentStreak: 0,
  });
  const [greeting, setGreeting] = useState("Hello");
  const [loading, setLoading] = useState(true);

  // Greeting 
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) setGreeting("Good Morning");
    else if (hours >= 12 && hours < 17) setGreeting("Good Afternoon");
    else if (hours >= 17 && hours < 23) setGreeting("Good Evening");
    else setGreeting("Good Night");
  }, []);

  // Fetch data
  useEffect(() => {
    if (!user?.uid) {
      setStats({ username: "", totalHabits: 0, completedHabits: 0, currentStreak: 0 });
      setLoading(false);
      return;
    }

    const userRef = ref(db, "users/" + user.uid);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const username = data.username || "";
        let totalHabits = 0, completedHabits = 0, currentStreak = 0;

        if (data.habits) {
          const habits = Object.values(data.habits);
          totalHabits = habits.length;

          const todayStr = toISODate(new Date());
          completedHabits = habits.filter((h) => Boolean(h?.history?.[todayStr])).length;

          currentStreak = calculateStreak(habits);
        }

        setStats({ username, totalHabits, completedHabits, currentStreak });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <section className="relative mx-4 sm:mx-6 my-6 sm:my-8 rounded-2xl overflow-hidden shadow-xl border border-violet-600/30 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 backdrop-blur-xl p-6 sm:p-8">
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-70" />

      {/* Greeting */}
      <h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
        {greeting}, {stats.username || "Explorer"} ✦
      </h2>
      <p className="mt-2 text-gray-300 text-sm sm:text-base">
        Here’s a quick overview of your habits today.
      </p>

      {loading ? (
        <div className="mt-6 animate-pulse space-y-4">
          <div className="h-6 bg-gray-700/50 rounded w-1/3"></div>
          <div className="h-6 bg-gray-700/50 rounded w-1/4"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {/* Total Habits */}
          <StatCard label="Total Habits" value={stats.totalHabits} color="indigo" />

          {/* Completed Today */}
          <StatCard label="Completed Today" value={stats.completedHabits} color="green" />

          {/* Streak */}
          <StatCard label="Best Streak" value={`${stats.currentStreak} days`} color="pink" />
        </div>
      )}
    </section>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value, color }) => (
  <div
    className={`p-4 sm:p-5 rounded-xl bg-gradient-to-br from-${color}-600/30 to-${color}-800/30 border border-${color}-500/40 shadow-lg hover:scale-[1.02] sm:hover:scale-105 transition`}
  >
    <p className="text-gray-400 text-sm">{label}</p>
    <h3 className={`text-2xl sm:text-3xl font-bold text-${color}-300`}>{value}</h3>
  </div>
);

export default HeroSection;
