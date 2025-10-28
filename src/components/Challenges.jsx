import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, onValue, push, remove, update } from "firebase/database";

const Challenges = () => {
  const { user } = useSelector((state) => state.auth);
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const challengesRef = ref(db, `users/${user.uid}/challenges`);
    const unsubscribe = onValue(challengesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const challengesList = Object.entries(data).map(([id, challenge]) => ({
          id,
          ...challenge,
        }));
        setChallenges(challengesList);
      } else {
        setChallenges([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const addChallenge = async () => {
    if (!user?.uid || !newChallenge.trim()) return;

    try {
      const challengesRef = ref(db, `users/${user.uid}/challenges`);
      await push(challengesRef, {
        title: newChallenge,
        completed: false,
      });
      setNewChallenge("");
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  const toggleChallenge = async (id, completed) => {
    if (!user?.uid) return;
    try {
      const challengeRef = ref(db, `users/${user.uid}/challenges/${id}`);
      await update(challengeRef, { completed: !completed });
    } catch (error) {
      console.error("Error updating challenge:", error);
    }
  };

  const deleteChallenge = async (id) => {
    if (!user?.uid) return;
    try {
      const challengeRef = ref(db, `users/${user.uid}/challenges/${id}`);
      await remove(challengeRef);
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };

  return (
    <section className="relative mx-4 sm:mx-6 my-6 sm:my-8 rounded-2xl overflow-hidden shadow-xl border border-violet-600/30 bg-gradient-to-br from-[#1a1a2e]/90 to-[#2a003f]/90 backdrop-blur-xl p-5 sm:p-8">
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-70" />

      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
        🎯 Challenges
      </h2>

      {/* Input to add challenge */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={newChallenge}
          onChange={(e) => setNewChallenge(e.target.value)}
          placeholder="Enter challenge title..."
          className="flex-grow p-3 rounded-xl bg-[#1a1a2e]/70 border border-indigo-500/40 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 shadow-inner text-sm sm:text-base"
        />
        <button
          onClick={addChallenge}
          className="px-4 sm:px-5 py-2 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition text-sm sm:text-base"
        >
          Add
        </button>
      </div>

      {challenges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 sm:p-5 rounded-xl flex justify-between items-center bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 shadow-lg transition transform hover:scale-[1.02] sm:hover:scale-105 ${
                challenge.completed ? "opacity-70 line-through" : ""
              }`}
            >
              <span className="text-gray-200 break-words max-w-[70%]">
                {challenge.title}
              </span>
              <div className="flex gap-2">
                {/* Toggle */}
                <button
                  onClick={() =>
                    toggleChallenge(challenge.id, challenge.completed)
                  }
                  className={`px-2 py-1 rounded-md text-xs font-semibold ${
                    challenge.completed
                      ? "bg-green-600/70 text-white"
                      : "bg-indigo-500/70 text-white"
                  }`}
                >
                  {challenge.completed ? "Done" : "Mark"}
                </button>
                {/* Delete */}
                <button
                  onClick={() => deleteChallenge(challenge.id)}
                  className="px-2 py-1 rounded-md text-xs bg-red-500/70 text-white hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic text-sm sm:text-base">
          No challenges yet. Add one above!
        </p>
      )}
    </section>
  );
};

export default Challenges;
