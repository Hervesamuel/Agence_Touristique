import { createContext, useState, useEffect } from "react";
import { THEMES, getStoredTheme, setStoredTheme } from "../utils/themeStorage";

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);

  // Application de la classe "dark" sur <html> (convention Tailwind pour le mode sombre)
  useEffect(() => {
    const root = document.documentElement;
    if (THEMES[theme] === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    setStoredTheme(theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (!THEMES[newTheme]) return;
    setTheme(newTheme);
  };

  // Bascule rapide clair <-> sombre
  const toggleTheme = () => {
    setTheme((prev) => (prev === "clair" ? "sombre" : "clair"));
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext, ThemeProvider };