// src/utils/habits.js
import { db } from "./firebase"; 
import { ref, set, push, update, get } from "firebase/database";


export const addHabit = async (uid, habit) => {
  try {
    const habitRef = ref(db, `users/${uid}/habits`);
    const newHabitRef = push(habitRef); 
    await set(newHabitRef, habit);
    return newHabitRef.key; 
  } catch (error) {
    console.error("Error adding habit:", error);
  }
};

export const updateHabit = async (uid, habitId, updates) => {
  try {
    const habitRef = ref(db, `users/${uid}/habits/${habitId}`);
    await update(habitRef, updates);
  } catch (error) {
    console.error("Error updating habit:", error);
  }
};

export const getHabits = async (uid) => {
  try {
    const habitRef = ref(db, `users/${uid}/habits`);
    const snapshot = await get(habitRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching habits:", error);
  }
};
