import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header"; // Assuming Header is in the same folder

const Layout = () => {
  const [theme, setTheme] = useState("light");
  const location = useLocation();

  // List of paths where you don't want to show the Header
  const noHeaderRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
    "/reset-password",
  ];

  // Check if current path is in the list
  const showHeader = !noHeaderRoutes.includes(location.pathname);

  // Load theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Apply theme and save to localStorage
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header theme={theme} toggleTheme={toggleTheme} />}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
