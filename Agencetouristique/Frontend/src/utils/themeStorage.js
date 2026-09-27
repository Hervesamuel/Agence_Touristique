// =====================================================
// PERSISTANCE : THEME (CLAIR / SOMBRE)
// =====================================================

const STORAGE_KEY = "themePreference";

const THEMES = {
  clair: "light",
  sombre: "dark",
};

const DEFAULT_THEME = "clair";

// Récupère la préférence sauvegardée, ou la valeur par défaut si absente/invalide
const getStoredTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return THEMES[stored] ? stored : DEFAULT_THEME;
};

// Sauvegarde la préférence
const setStoredTheme = (theme) => {
  if (!THEMES[theme]) return;
  localStorage.setItem(STORAGE_KEY, theme);
};

export { THEMES, DEFAULT_THEME, getStoredTheme, setStoredTheme };