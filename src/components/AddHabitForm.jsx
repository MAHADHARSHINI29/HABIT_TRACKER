// src/components/AddHabitForm.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, push, set } from "firebase/database";

const predefinedCategories = [
  "Health",
  "Fitness",
  "Wellness",
  "Personal Development",
];

const AddHabitForm = () => {
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(predefinedCategories[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [reminderTime, setReminderTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid || !name) return;

    const finalCategory =
      category === "Custom" && customCategory ? customCategory : category;

    const habitsRef = ref(db, `users/${user.uid}/habits`);
    const newHabitRef = push(habitsRef);

    await set(newHabitRef, {
      name,
      category: finalCategory,
      difficulty,
      completed: false,
      streak: 0,
      reminderTime,
    });

    setName("");
    setCategory(predefinedCategories[0]);
    setCustomCategory("");
    setDifficulty("Easy");
    setReminderTime("");
  };

  return (
    <section
      className="relative mx-4 sm:mx-6 my-6 sm:my-8 rounded-2xl overflow-hidden 
                 shadow-xl border border-violet-600/30 
                 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 
                 backdrop-blur-xl p-6 sm:p-8"
    >
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-70" />

      <h3 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md mb-4 sm:mb-6">
        ✨ Add a New Habit
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Habit Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Habit name"
          className="w-full px-3 sm:px-4 h-11 rounded-xl bg-white/90 text-gray-800 
                     placeholder-gray-500 focus:outline-none 
                     focus:ring-2 focus:ring-pink-400 shadow text-sm sm:text-base"
          required
        />

        {/* Category */}
        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 sm:px-4 h-11 rounded-xl bg-white/90 text-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 shadow text-sm sm:text-base"
          >
            {predefinedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Custom">➕ Custom</option>
          </select>

          {/* Custom category input */}
          {category === "Custom" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="mt-2 w-full px-3 sm:px-4 h-11 rounded-xl bg-white/90 text-gray-800 
                         placeholder-gray-500 focus:outline-none 
                         focus:ring-2 focus:ring-pink-400 shadow text-sm sm:text-base"
              required
            />
          )}
        </div>

        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-3 sm:px-4 h-11 rounded-xl bg-white/90 text-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-pink-400 shadow text-sm sm:text-base"
        >
          <option value="Easy">Easy</option>
          <option value="Moderate">Moderate</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Reminder */}
        <div>
          <label className="block text-xs sm:text-sm text-gray-300 mb-1">
            ⏰ Reminder Time
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full px-3 sm:px-4 h-11 rounded-xl bg-white/90 text-gray-800 
                       focus:outline-none focus:ring-2 focus:ring-pink-400 shadow text-sm sm:text-base appearance-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                     text-white font-semibold rounded-xl shadow-md 
                     hover:opacity-90 transition duration-200 text-sm sm:text-base"
        >
          ➕ Add Habit
        </button>
      </form>
    </section>
  );
};

export default AddHabitForm;
