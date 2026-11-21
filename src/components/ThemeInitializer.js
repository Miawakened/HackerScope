
"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("hackerscope-theme");

      if (savedTheme === "dark" || savedTheme === "light") {
        document.documentElement.dataset.theme = savedTheme;
      }
    } catch {

    }
  }, []);

  return null;
}