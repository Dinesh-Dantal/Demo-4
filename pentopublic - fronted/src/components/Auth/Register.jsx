import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { Eye, EyeOff, AlertCircle, CheckCircle, Sun, Moon } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    role: "reader", // default
    bio: "",
    isSubscribed: false,
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('dark'); // Default to dark theme

  // Effect to set initial theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Effect to apply theme class to documentElement and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return "Username can only contain letters, numbers, dots, hyphens, and underscores";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 254) return "Email is too long";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 128) return "Password is too long";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(password)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateBio = (bio, role) => {
    if (role === "author") {
      if (!bio) return "Bio is required for authors";
      if (bio.length < 50) return "Bio must be at least 50 characters";
      if (bio.length > 500) return "Bio must be less than 500 characters";
    }
    return "";
  };

  const validateForm = () => {
    const errors = {};
    const usernameError = validateUsername(formData.userName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const bioError = validateBio(formData.bio, formData.role);

    if (usernameError) errors.userName = usernameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (bioError) errors.bio = bioError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "" });
    }
    
    // Clear general error
    if (error) setError("");
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      bio: "", // Reset bio when role changes
      isSubscribed: false, // Reset subscription when role changes
    });
    
    // Clear bio error when switching roles
    if (fieldErrors.bio) {
      setFieldErrors({ ...fieldErrors, bio: "" });
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&]/.test(password),
      password.length >= 12
    ];
    
    score = checks.filter(Boolean).length;
    
    if (score <= 2) return { strength: score, label: "Weak", color: "text-red-400" };
    if (score <= 4) return { strength: score, label: "Medium", color: "text-yellow-400" };
    return { strength: score, label: "Strong", color: "text-green-400" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Capture needed values before async call
    const { email, role, isSubscribed } = formData;
    setIsLoading(true);

    try {
      await registerUser(formData);

      // Redirect based on role and subscription status
      if (role === "reader" && isSubscribed) {
        navigate("/subscription", {
          state: { email }, // pass email to subscription page
        });
      } else {
        navigate("/login");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Username or email already exists. Please try different ones.");
      } else if (err.response && err.response.status === 400) {
        setError("Invalid registration data. Please check your inputs.");
      } else if (err.response && err.response.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 relative z-10 backdrop-blur-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Register
          </h2>
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors duration-200"
          >
            {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
        
        {/* General Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Username Field */}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={formData.userName}
            onChange={(e) => handleInputChange("userName", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg transition-colors 
              ${fieldErrors.userName 
                ? "border-red-500/50 bg-red-900/20 focus:border-red-500 focus:ring-red-500/25" 
                : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
              } 
              bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
            required
          />
          {fieldErrors.userName && (
            <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.userName}</span>
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg transition-colors 
              ${fieldErrors.email 
                ? "border-red-500/50 bg-red-900/20 focus:border-red-500 focus:ring-red-500/25" 
                : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
              } 
              bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
            required
          />
          {fieldErrors.email && (
            <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.email}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors 
                ${fieldErrors.password 
                  ? "border-red-500/50 bg-red-900/20 focus:border-red-500 focus:ring-red-500/25" 
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
                } 
                bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-100 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength <= 2 ? 'bg-red-500' :
                      passwordStrength.strength <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center space-x-1 ${formData.password.length >= 8 ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>8+ chars</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${/[a-z]/.test(formData.password) ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>Lowercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${/\d/.test(formData.password) ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${/[@$!%*?&]/.test(formData.password) ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>Special</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {fieldErrors.password && (
            <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{fieldErrors.password}</span>
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <select
            value={formData.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full px-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/25 bg-slate-800 text-slate-100"
            required
          >
            <option value="reader">Reader</option>
            <option value="author">Author</option>
          </select>
        </div>

        {/* Author Bio Field */}
        {formData.role === "author" && (
          <div>
            <textarea
              placeholder="Author Bio (Tell readers about yourself, your writing style, experience, etc.)"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg h-24 resize-none transition-colors 
                ${fieldErrors.bio 
                  ? "border-red-500/50 bg-red-900/20 focus:border-red-500 focus:ring-red-500/25" 
                  : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/25"
                } 
                bg-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2`}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-slate-400">
                {formData.bio.length}/500 characters
              </div>
              {formData.bio && (
                <div className="text-xs text-slate-400">
                  {formData.bio.length >= 50 ? <span className="text-green-400">✓ Minimum reached</span> : `${50 - formData.bio.length} more needed`}
                </div>
              )}
            </div>
            {fieldErrors.bio && (
              <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{fieldErrors.bio}</span>
              </p>
            )}
          </div>
        )}

        {/* Reader Subscription */}
        {formData.role === "reader" && (
          <label className="text-sm flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600 cursor-pointer hover:bg-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={formData.isSubscribed}
              onChange={(e) => handleInputChange("isSubscribed", e.target.checked)}
              className="mt-0.5 h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-600 rounded bg-slate-800"
            />
            <div>
              <div className="font-medium text-slate-100">Subscribe to Premium Content</div>
              <div className="text-slate-400 text-xs mt-1">
                Get access to exclusive books, newsletters, and premium features
              </div>
            </div>
          </label>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Creating Account...
            </>
          ) : (
            "Register"
          )}
        </button>

        <div className="text-sm text-center text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:underline font-medium">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;