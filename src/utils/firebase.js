import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBHrmToZ3m9sZq5VK-9QI9h605_lPdIWjo",
  authDomain: "habit-tracker-app-58b9f.firebaseapp.com",
  projectId: "habit-tracker-app-58b9f",
  storageBucket: "habit-tracker-app-58b9f.appspot.com",
  messagingSenderId: "517744107999",
  appId: "1:517744107999:web:202d785bb76e75d81f646a",
  measurementId: "G-D01EZ8LT9C",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(
  app,
  "https://habit-tracker-app-58b9f-default-rtdb.asia-southeast1.firebasedatabase.app/"
);

export { auth, db };
