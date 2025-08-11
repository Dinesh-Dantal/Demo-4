import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";

const AdminHeader = () => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    <header className="bg-white shadow px-6 py-3 flex justify-end items-center border-b sticky top-0 z-20">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 border rounded-full px-4 py-2 bg-white hover:bg-gray-100 transition"
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
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow z-50 overflow-hidden">
              <div className="p-4 border-b">
                <p className="font-semibold">{user?.userName}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
              </div>

              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 hover:bg-gray-100"
              >
                Your Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50"
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

export default AdminHeader;
