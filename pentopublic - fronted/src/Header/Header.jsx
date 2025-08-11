import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon } from "lucide-react";

const indianQuotes = [
  "“Arise, awake, and stop not till the goal is reached.” – Swami Vivekananda",
  "“Be the change that you wish to see in the world.” – Mahatma Gandhi",
  "“Learning gives creativity, creativity leads to thinking.” – Dr. APJ Abdul Kalam",
  "“Education is the manifestation of the perfection already in man.” – Swami Vivekananda",
  "“You must be the change you want to see in the world.” – Mahatma Gandhi",
];

const Header = ({ theme, toggleTheme }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % indianQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 no-underline">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                PenToPublic ✍️
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-slate-100 hover:text-blue-300 font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "underline font-semibold"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-100 hover:bg-slate-800/70 transition-colors duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Quote Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm text-slate-300 text-center py-2 text-sm italic border-t border-slate-700/50">
        <p className="m-0">{indianQuotes[quoteIndex]}</p>
      </div>
    </>
  );
};

export default Header;
