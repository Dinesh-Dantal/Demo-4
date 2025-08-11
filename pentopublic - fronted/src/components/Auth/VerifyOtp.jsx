import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Sun, Moon } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/ForgotPassword/verify-otp", { email, otp });
      navigate("/reset-password");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 py-16 px-6 min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Verify OTP
          </h2>
          
        </div>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border rounded-lg border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && (
          <p className="bg-red-900/30 border border-red-500/50 text-red-300 px-3 py-2 rounded-lg flex items-center space-x-2 mb-4 shadow-lg text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </p>
        )}

        <button
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={handleVerifyOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Verifying OTP...
            </>
          ) : (
            "Verify OTP"
          )}
        </button>
      </div>
    </div>
  );
}
