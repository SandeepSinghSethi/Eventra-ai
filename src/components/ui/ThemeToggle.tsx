"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("eventra-theme") as "light" | "dark" | null;
    const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const applyTheme = (t: "light" | "dark") => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    }
    localStorage.setItem("eventra-theme", t);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
      aria-label="Toggle theme"
      className="p-2 rounded-xl text-muted hover:text-main hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-token"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-[#6B625B]" />
      ) : (
        <Sun className="w-5 h-5 text-[#F08A70]" />
      )}
    </button>
  );
};

