// src/components/Streak.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue } from "firebase/database";

// ✅ Optimized streak calculation
const calculateStreak = (history = {}) => {
  const dates = Object.keys(history)
    .filter((d) => history[d] === true)
    .map((d) => new Date(d).setHours(0, 0, 0, 0)) // normalize dates
    .sort((a, b) => b - a);

  if (dates.length === 0) return 0;

  let streak = 1;
  let prevDate = dates[0];

  for (let i = 1; i < dates.length; i++) {
    const diff = (prevDate - dates[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      prevDate = dates[i];
    } else break;
  }

  return streak;
};

const Streak = () => {
  const { user } = useSelector((state) => state.auth);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const habitsRef = ref(db, `users/${user.uid}/habits`);

    const unsubscribe = onValue(habitsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setHabits([]);
        return;
      }

      const data = snapshot.val();
      const habitsList = Object.entries(data).map(([id, habit]) => ({
        id,
        name: habit.name,
        streak: calculateStreak(habit.history || {}),
      }));

      habitsList.sort((a, b) => b.streak - a.streak);
      setHabits(habitsList);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <section
      className="relative mx-4 sm:mx-6 my-6 sm:my-8 rounded-2xl overflow-hidden 
                 shadow-xl border border-violet-600/30 
                 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 
                 backdrop-blur-xl p-5 sm:p-8"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 
                      bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 
                      blur-3xl opacity-70" />

      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6 
                     bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 
                     bg-clip-text text-transparent drop-shadow-md"
      >
        🔥 Streak Leaderboard
      </h2>

      {habits.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {habits.map((habit, index) => (
           <div
  key={habit.id}
  className="flex justify-between items-center px-4 sm:px-5 h-14 
             rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 
             border border-indigo-500/40 shadow-lg 
             transition-transform duration-300 ease-out
             hover:scale-[1.02] sm:hover:scale-[1.03] 
             overflow-hidden will-change-transform"
>
  <span className="font-semibold text-sm sm:text-base md:text-lg text-gray-200 truncate max-w-[70%]">
    {index + 1}. {habit.name}
  </span>
  <span className="text-base sm:text-lg md:text-xl font-bold text-indigo-300 whitespace-nowrap">
    {habit.streak} {habit.streak === 1 ? "day" : "days"}
  </span>
</div>

          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic text-sm sm:text-base">
          No streaks yet. Start building habits!
        </p>
      )}
    </section>
  );
};

export default Streak;
