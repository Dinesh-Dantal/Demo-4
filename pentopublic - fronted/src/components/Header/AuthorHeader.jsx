import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

const AuthorHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 shadow-lg px-4 py-2 flex items-center justify-between sticky top-0 z-20">
      <h1
        className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        onClick={() => navigate("/writer-dashboard")}
      >
        PenToPublic ✍️
      </h1>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 border border-slate-700 rounded-full px-3 py-2 bg-slate-800 hover:bg-slate-700 transition text-slate-100"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <User size={18} />
          <span>{user?.userName}</span>
          <ChevronDown size={16} />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-slate-100">{user?.userName}</p>
                <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 hover:bg-slate-800 text-slate-100"
              >
                Your Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/30 hover:text-red-300 flex items-center"
              >
                <LogOut size={16} className="inline mr-2" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default AuthorHeader;
