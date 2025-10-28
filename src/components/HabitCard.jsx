import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue, set, remove } from "firebase/database";
import { Trash2, CheckCircle,Ban } from "lucide-react";

// Utils
const toISODate = (date) => new Date(date).toLocaleDateString("en-CA");

const getWeekDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i - 3);
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: toISODate(d),
      isToday: i === 3,
      isPast: i < 3,
      isFuture: i > 3,
    };
  });
};

const showReminderNotification = (habitName) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Habit Reminder", {
      body: `⏰ Time to do: ${habitName}`
    });
  }
};

const HabitCard = ({ habit }) => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState({});

  // Memoized week days
  const weekDays = useMemo(() => getWeekDays(), []);

  // Fetch history from Firebase
  useEffect(() => {
    if (!user?.uid || !habit?.id) return;

    const historyRef = ref(db, `users/${user.uid}/habits/${habit.id}/history`);
    const unsubscribe = onValue(historyRef, (snapshot) =>
      setHistory(snapshot.exists() ? snapshot.val() : {})
    );

    return () => unsubscribe();
  }, [user?.uid, habit?.id]);

  // Toggle habit completion
  const toggleToday = useCallback(
    async (dayStr, checked) => {
      if (!user?.uid) return;
      const dayRef = ref(
        db,
        `users/${user.uid}/habits/${habit.id}/history/${dayStr}`
      );
      checked ? await set(dayRef, true) : await remove(dayRef);
    },
    [user?.uid, habit?.id]
  );

  // Delete habit
  const deleteHabit = useCallback(async () => {
    if (!user?.uid) return;
    await remove(ref(db, `users/${user.uid}/habits/${habit.id}`));
  }, [user?.uid, habit?.id]);

  //  Reminder check
  useEffect(() => {
    if (!habit?.reminderTime) return;

    const interval = setInterval(() => {
      const now = new Date().toTimeString().slice(0, 5);
      if (now === habit.reminderTime) showReminderNotification(habit.name);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [habit?.reminderTime, habit?.name]);

  return (
    <div
      className="relative bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 
                 border border-violet-500/30 backdrop-blur-xl rounded-2xl 
                 p-4 sm:p-5 shadow-lg hover:shadow-pink-500/30 
                 transition-all duration-300"
    >
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl opacity-70 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg text-white truncate">
            {habit.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 truncate">
            {habit.category} • {habit.difficulty}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation(); //  prevents bubbling
            deleteHabit();
          }}
          className="shrink-0 text-pink-400 hover:text-pink-300 active:scale-90 transition"
          aria-label="Delete habit"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Reminder Info */}
      <p className="text-xs text-indigo-300 mb-2">
        ⏰ Reminder: {habit.reminderTime || "None"}
      </p>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 mt-3 w-full">
        {weekDays.map((day) => {
          const completed = history[day.date];
          return (
            <div
              key={day.date}
              className="flex flex-col items-center text-center select-none"
            >
              <span
                className={`text-[10px] sm:text-xs mb-1 ${
                  day.isToday ? "text-pink-400 font-semibold" : "text-gray-500"
                }`}
              >
                {day.label}
              </span>

              {day.isToday ? (
                <input
                  type="checkbox"
                  checked={!!completed}
                  onChange={(e) => toggleToday(day.date, e.target.checked)}
                  className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer accent-pink-500 hover:scale-110 transition"
                  aria-label={`Mark ${habit.name} as completed for today`}
                />
              ) : completed ? (
                <CheckCircle className="text-green-400 w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Ban className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 rounded-full border border-gray-600 opacity-40"/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitCard;
