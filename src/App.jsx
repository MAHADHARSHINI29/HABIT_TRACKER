// src/App.jsx
import { useEffect, useState } from "react";
import AllRoutes from "./routes/AllRoutes";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./utils/firebase";
import { useDispatch } from "react-redux";
import { setUser, logout } from "./features/auth/authSlice";
import { get, ref } from "firebase/database";

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false); // wait for Firebase

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const snapshot = await get(ref(db, "users/" + currentUser.uid));
          let username = null;
          if (snapshot.exists()) {
            username = snapshot.val().username;
          }
          dispatch(
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: username,
              photoURL: currentUser.photoURL,
            })
          );
        } catch (err) {
          console.error("Error fetching profile:", err);
          dispatch(
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: null,
              photoURL: currentUser.photoURL,
            })
          );
        }
      } else {
        dispatch(logout());
      }
      setAuthChecked(true); // mark as resolved
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!authChecked) {
    // show loader until Firebase finishes checking
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a14] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40"></div>
      </div>
    );
  }

  return <AllRoutes />;
}

export default App;
