import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { auth, db } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", id: "hero" },
    { name: "Habits", id: "habits" },
    { name: "Progress", id: "progress" },
    { name: "Achievements", id: "achievements" },
  ];

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Fetch username
  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.uid) {
        try {
          const snapshot = await get(ref(db, "users/" + user.uid));
          if (snapshot.exists()) setUsername(snapshot.val().username);
        } catch (error) {
          console.error("Failed to fetch username:", error.message);
        }
      }
    };
    fetchUsername();
  }, [user]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll helper
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (id) => {
    if (location.pathname === "/homepage") {
      scrollToSection(id);
    } else {
      navigate("/homepage");
      setTimeout(() => scrollToSection(id), 300);
    }
  };

  return (
    <nav className="sticky top-0 z-50 rounded-xl backdrop-blur-lg bg-gradient-to-r from-[#1a1a2e]/90 to-[#2a003f]/90 border-b border-violet-600/30 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-6">
        {/* Logo */}
        <Link
          to={user ? "/homepage" : "/"}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
        >
          Orbit ✦
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="relative text-gray-300 hover:text-white transition group"
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-5">
          <button
            aria-label="Notifications"
            className="p-2 rounded-full hover:bg-violet-600/20 transition"
          >
            <Bell className="text-gray-300" size={20} />
          </button>

          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 group"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                  {username ? username.charAt(0) : "U"}
                </div>
                <span className="font-medium text-gray-300 group-hover:text-white">
                  {username || "Loading..."}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-gradient-to-br from-[#1a1a2e] to-[#2a003f] border border-violet-600/30 shadow-2xl rounded-xl p-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 rounded-md text-gray-300 hover:bg-violet-600/20 hover:text-white transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 rounded-md text-gray-300 hover:bg-red-600/30 hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-1.5 rounded-md shadow-md hover:scale-105 transition-transform"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Toggle Menu"
          className="md:hidden text-gray-300 hover:text-white text-2xl p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2a003f] border-t border-violet-600/30 shadow-xl">
          <div className="flex flex-col space-y-3 px-6 py-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  handleNavClick(link.id);
                  setIsOpen(false);
                }}
                className="py-2 text-gray-300 hover:text-white transition"
              >
                {link.name}
              </button>
            ))}

            {user && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="py-2 text-gray-300 hover:text-white transition"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="text-left py-2 text-red-400 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
