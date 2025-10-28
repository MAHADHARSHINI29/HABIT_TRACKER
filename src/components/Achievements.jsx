// src/components/Achievements.jsx
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue } from "firebase/database";

// 🔹 Achievements in ascending order
const achievementsList = [
  { streak: 3, name: "Starter Badge 🌱", color: "#9ACD32" },
  { streak: 7, name: "Bronze Badge 🥉", color: "#CD7F32" },
  { streak: 14, name: "Silver Badge 🥈", color: "#C0C0C0" },
  { streak: 21, name: "Sapphire Badge 💎", color: "#0F52BA" },
  { streak: 30, name: "Gold Badge 🥇", color: "#FFD700" },
  { streak: 50, name: "Ruby Badge 🔥", color: "#E0115F" },
  { streak: 75, name: "Diamond Badge 💠", color: "#00CED1" },
  { streak: 100, name: "Legendary Badge 👑", color: "#9400D3" },
];

// ✅ streak calculator (optimized loop)
const calculateStreak = (history = {}) => {
  const completed = Object.keys(history)
    .filter((d) => history[d])
    .sort((a, b) => new Date(b) - new Date(a));

  if (!completed.length) return 0;

  let streak = 1;
  let prevDate = new Date(completed[0]);

  for (let i = 1; i < completed.length; i++) {
    const d = new Date(completed[i]);
    if ((prevDate - d) / (1000 * 60 * 60 * 24) === 1) {
      streak++;
      prevDate = d;
    } else break;
  }

  return streak;
};

const Achievements = () => {
  const { user } = useSelector((state) => state.auth);
  const [longestStreak, setLongestStreak] = useState(0);

  // 🔹 Fetch habits from Firebase
  useEffect(() => {
    if (!user?.uid) return;
    const habitsRef = ref(db, `users/${user.uid}/habits`);

    const unsubscribe = onValue(habitsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLongestStreak(0);
        return;
      }

      const data = snapshot.val();
      let maxStreak = 0;

      for (const habit of Object.values(data)) {
        const streak = calculateStreak(habit.history || {});
        if (streak > maxStreak) maxStreak = streak;
      }

      setLongestStreak(maxStreak);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔹 Compute next milestone (memoized)
  const nextMilestone = useMemo(
    () => achievementsList.find((a) => longestStreak < a.streak),
    [longestStreak]
  );

  return (
    <div className="p-4 sm:p-6 rounded-2xl shadow-lg bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/20">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-indigo-900 flex items-center gap-2">
        🏆 Achievements
      </h2>

      {/* Motivation banner */}
      {nextMilestone ? (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-l-4 border-indigo-500 text-indigo-800 rounded-xl shadow-sm text-sm sm:text-base">
          🔜 {nextMilestone.name} is just{" "}
          <b>{nextMilestone.streak - longestStreak}</b> days away!
        </div>
      ) : (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-l-4 border-green-500 text-green-900 rounded-xl shadow-sm text-sm sm:text-base">
          🎉 You’ve unlocked all achievements! Legendary status 👑
        </div>
      )}

      {/* Achievements grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {achievementsList.map((ach, i) => {
  const unlocked = longestStreak >= ach.streak;

  return (
    <div
      key={i}
      className="p-4 sm:p-5 rounded-xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl backdrop-blur-md"
      style={{
        background: unlocked
          ? `linear-gradient(135deg, ${ach.color}AA, ${ach.color}FF)`
          : "rgba(255,255,255,0.4)",
        opacity: unlocked ? 1 : 0.6,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-base sm:text-lg font-semibold ${
            unlocked ? "text-white" : "text-gray-700"
          } drop-shadow-md`}
        >
          {ach.name}
        </span>
        <span
          className={`text-lg sm:text-xl ${
            unlocked ? "text-white" : "text-gray-700"
          }`}
        >
          {unlocked ? "✨" : "🔒"}
        </span>
      </div>

      {/* Progress bar (only for locked) */}
      {!unlocked && (
        <div className="mt-3 w-full bg-gray-300/70 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min((longestStreak / ach.streak) * 100, 100)}%`,
              backgroundColor: ach.color,
            }}
          />
        </div>
      )}

      {/* 🔹 Text changes based on unlock status */}
      <p
        className={`text-xs sm:text-sm mt-3 ${
          unlocked ? "text-white/90" : "text-gray-600"
        }`}
      >
        {unlocked
          ? `Consistent for ${ach.streak} days`
          : `Unlock at ${ach.streak} days`}
      </p>
    </div>
  );
})}

      </div>
    </div>
  );
};

export default Achievements;
