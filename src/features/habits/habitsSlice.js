import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const db = getFirestore();

// pure habits pe loop karke ajki date nai hai to add karke false kardo user nai kara to
export const resetHabitsOnLogin = createAsyncThunk(
  "habits/resetOnLogin",
  async (userId) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const habitsRef = collection(db, "users", userId, "habits");
    const snapshot = await getDocs(habitsRef);

    const updates = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.date !== today) {
        const habitRef = doc(db, "users", userId, "habits", docSnap.id);
        updates.push(
          updateDoc(habitRef, {
            completed: false,
            date: today,
          })
        );
      }
    });

    await Promise.all(updates);
    return today;
  }
);

// yaha pe habits pe ittrate karke user agar completed check tick kardia to ajki habbit true kardo
export const markHabitComplete = createAsyncThunk(
  "habits/markComplete",
  async ({ userId, habitId }) => {
    const today = new Date().toISOString().split("T")[0];
    const habitRef = doc(db, "users", userId, "habits", habitId);

    await updateDoc(habitRef, {
      completed: true,
      date: today,
    });

    return { habitId, today };
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState: {
    habits: [],
    loading: false,
    error: null,
  },
  reducers: {
    setHabits(state, action) {
      state.habits = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetHabitsOnLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetHabitsOnLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetHabitsOnLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markHabitComplete.fulfilled, (state, action) => {
        const { habitId, today } = action.payload;
        const habit = state.habits.find((h) => h.id === habitId);
        if (habit) {
          habit.completed = true;
          habit.date = today;
        }
      });
  },
});

export const { setHabits } = habitsSlice.actions;
export default habitsSlice.reducer;
