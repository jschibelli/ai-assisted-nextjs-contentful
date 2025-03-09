// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the context state interface
interface AppContextState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  locale: string;
  setLocale: (locale: string) => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

// Create context with default values
const AppContext = createContext<AppContextState>({
  theme: "light",
  toggleTheme: () => {},
  locale: "en-US",
  setLocale: () => {},
  isMenuOpen: false,
  toggleMenu: () => {},
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [locale, setLocale] = useState("en-US");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      // Persist theme preference
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        // Apply theme to HTML element for Tailwind dark mode
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return newTheme;
    });
  };

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Effect to initialize from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize theme from localStorage or system preference
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const initialTheme = savedTheme
        ? (savedTheme as "light" | "dark")
        : prefersDark
        ? "dark"
        : "light";

      setTheme(initialTheme);
      document.documentElement.classList.toggle(
        "dark",
        initialTheme === "dark"
      );

      // Initialize locale from navigator or localStorage
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale) {
        setLocale(savedLocale);
      } else if (navigator.language) {
        setLocale(navigator.language);
      }
    }
  }, []);

  // Provide the context value
  const contextValue = {
    theme,
    toggleTheme,
    locale,
    setLocale: (newLocale: string) => {
      setLocale(newLocale);
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", newLocale);
      }
    },
    isMenuOpen,
    toggleMenu,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => useContext(AppContext);


