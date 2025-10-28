import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue } from "firebase/database";
import HabitCard from "./HabitCard";
import {
  requestNotificationPermission,
  showReminderNotification,
} from "../utils/notificationUtils";

const DailyHabits = () => {
  const { user } = useSelector((state) => state.auth);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch habits from Firebase
  useEffect(() => {
    if (!user?.uid) {
      setHabits([]);
      setLoading(false);
      return;
    }

    requestNotificationPermission();

    const habitsRef = ref(db, `users/${user.uid}/habits`);
    const unsubscribe = onValue(habitsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const habitsList = Object.entries(data).map(([id, habit]) => ({
          id,
          ...habit,
        }));
        setHabits(habitsList);
      } else {
        setHabits([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Memoized reminders list
  const reminders = useMemo(
    () => habits.filter((h) => h.reminderTime),
    [habits]
  );

  // Reminder checker
  useEffect(() => {
    if (reminders.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      reminders.forEach((habit) => {
        if (habit.reminderTime === currentTime) {
          showReminderNotification(habit.name);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders]);

  // Group habits by category (memoized)
  const groupedHabits = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const category = habit.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(habit);
      return acc;
    }, {});
  }, [habits]);

  return (
    <section className="relative my-6 mx-4 sm:mx-6 rounded-2xl overflow-hidden border border-violet-600/30 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 backdrop-blur-xl shadow-xl p-4 sm:p-6">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-70" />

      <h2 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow">
        📅 This Week’s Habits
      </h2>

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-5 bg-gray-700/40 rounded w-1/3"></div>
          <div className="h-20 bg-gray-700/30 rounded"></div>
          <div className="h-20 bg-gray-700/30 rounded"></div>
        </div>
      ) : habits.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedHabits).map(([category, habitsInCategory]) => (
            <div key={category}>
              {/* Category Heading */}
              <h3 className="text-lg sm:text-xl font-bold text-pink-400 mb-2">
                {category}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {habitsInCategory.map((habit) => (
                  <HabitCard key={habit.id} habit={habit} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic text-sm sm:text-base text-center py-6">
          No habits added yet. Start tracking your first habit 🚀
        </p>
      )}
    </section>
  );
};

export default DailyHabits;
