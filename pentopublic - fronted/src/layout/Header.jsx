import { LogOut, Search, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5041/api";

const Header = ({ search, setSearch, setFilter }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.userId || user.role !== "reader") return;
      try {
        const res = await axios.get(
          `${API_BASE}/Reader/${user.userId}/subscription`
        );
        setIsSubscribed(res.data.isSubscribed);
      } catch (err) {
        console.error("Error fetching subscription", err);
      }
    };
    fetchSubscription();
  }, [user]);

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

  const handleSubscriptionClick = () => {
    if (!isSubscribed) {
      navigate("/subscription", {
        state: { userId: user?.userId },
      });
      setDropdownOpen(false);
    }
  };

  const filterOptions = [
    { label: "All Books", value: "all" },
    { label: "Top Books", value: "top" },
    { label: "Recent Books", value: "recent" },
    { label: "Free Books", value: "free" },
    { label: "Audio Books", value: "audio" },
  ];

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20 shadow-lg">
      <div className="flex items-center gap-4">
        <h1
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          onClick={() => {
            setFilter("all");
            navigate("/");
          }}
        >
          PenToPublic
        </h1>

        <div className="hidden md:flex gap-2 text-sm">
          {filterOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={clsx(
                "px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500 transition-all duration-200",
                "hover:shadow-md hover:shadow-purple-500/20"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full md:max-w-md">
        <div className="flex items-center border border-slate-700 rounded-full px-3 py-2 shadow-sm bg-slate-800 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-200">
          <Search size={16} className="mr-2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search books or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none w-full bg-transparent text-slate-100 placeholder-slate-500"
          />
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 border border-slate-700 rounded-full px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20"
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
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-lg shadow-purple-500/10 z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <p className="font-semibold text-slate-100">{user?.userName}</p>
                <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 hover:bg-slate-800 text-slate-300 transition-all"
              >
                Your Profile
              </button>

             
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all"
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

export default Header;
