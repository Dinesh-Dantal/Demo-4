import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginApi } from "../../services/authService";
import { Eye, EyeOff, AlertCircle, Sun, Moon } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_.-]+$/.test(username))
      return "Username can only contain letters, numbers, dots, hyphens, and underscores";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateForm = () => {
    const errors = {};
    const usernameError = validateUsername(formData.userName);
    const passwordError = validatePassword(formData.password);

    if (usernameError) errors.userName = usernameError;
    if (passwordError) errors.password = passwordError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await loginApi(formData);
      const userRole = res.data.role;
      login({ userName: formData.userName, role: userRole }, res.data.token);

      switch (userRole) {
        case "reader":
          navigate("/reader-dashboard");
          break;
        case "author":
          navigate("/author-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        default:
          setError("Unknown user role");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else if (err.response && err.response.status === 404) {
        setError("User not found. Please check your username.");
      } else if (err.response && err.response.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-sm space-y-4 border border-slate-300 dark:border-slate-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Login
          </h2>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.userName}
            onChange={(e) => handleInputChange("userName", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg transition-colors 
              ${fieldErrors.userName
                ? "border-red-500 bg-red-50 dark:bg-red-900 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-200"
              } 
              bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2`}
            required
          />
          {fieldErrors.userName && (
            <p className="text-red-500 dark:text-red-300 text-xs mt-1 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.userName}</span>
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-2 pr-12 border rounded-lg transition-colors 
                ${fieldErrors.password
                  ? "border-red-500 bg-red-50 dark:bg-red-900 focus:border-red-500 focus:ring-red-200"
                  : "border-slate-300 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-200"
                } 
                bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 dark:text-red-300 text-xs mt-1 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.password}</span>
            </p>
          )}
        </div>

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-blue-500 hover:underline">
            Create Account
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-500/30"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
