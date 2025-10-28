import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-6 rounded-xl overflow-hidden border-t border-violet-600/30 bg-gradient-to-br from-[#1a1a2e]/95 to-[#2a003f]/95 backdrop-blur-xl shadow-[0_-2px_20px_rgba(139,92,246,0.2)] p-4">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-2xl opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* Branding */}
        <div>
          <h3 className="text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent tracking-wide">
            Orbit – Build Better Habits 🚀
          </h3>
          <p className="text-xs text-gray-400">
            &copy; {year} Orbit. All Rights Reserved.
          </p>
        </div>

        {/* Social + Links */}
        <div className="flex items-center gap-4">
          {/* Divider - only on desktop */}
          <span className="hidden sm:block h-4 w-px bg-gray-600/40" />

          {/* Social icons */}
          <div className="flex gap-4 text-lg text-gray-400">
            <a
              href="https://github.com/CodeWithQadeer"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-indigo-400 transition-transform hover:scale-110"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/syed-abdul-qadeer-4a2896313/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-purple-400 transition-transform hover:scale-110"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
