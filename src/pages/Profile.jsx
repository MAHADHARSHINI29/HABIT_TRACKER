// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../utils/firebase";
import { ref, get, update } from "firebase/database";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const snapshot = await get(ref(db, "users/" + user.uid));
          if (snapshot.exists()) {
            setProfileData({
              username: snapshot.val().username || "",
              email: snapshot.val().email || user.email,
              bio: snapshot.val().bio || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await update(ref(db, "users/" + user.uid), {
        username: profileData.username,
        bio: profileData.bio,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error.message);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400">Loading profile...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="flex-grow flex justify-center items-center px-4">
        <div className="w-full max-w-xl bg-gradient-to-br from-[#1a1a2e] to-[#2a003f] p-8 rounded-2xl shadow-2xl border border-violet-600/40">
          {/* Back Button */}
          <Link
            to="/homepage"
            className="inline-block mb-6 text-sm text-indigo-400 hover:text-pink-400 transition"
          >
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>

          {/* Username */}
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={profileData.username}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded-lg bg-[#1a1a2e] border border-violet-600/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          {/* Email (read-only) */}
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="w-full p-3 mb-4 rounded-lg bg-gray-800 text-gray-400 border border-gray-600 cursor-not-allowed"
          />

          {/* Bio */}
          <label className="block text-gray-300 mb-1">Bio</label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            className="w-full p-3 mb-6 rounded-lg bg-[#1a1a2e] border border-violet-600/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows="3"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-lg shadow-md hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
