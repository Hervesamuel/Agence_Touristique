// =====================================================
// PERSISTANCE : TAILLE DE POLICE
// =====================================================
// Responsabilité unique : lire/écrire la préférence en localStorage.
// Si in jour on change de mécanisme (API, cookies...), seul ce fichier change.

const STORAGE_KEY = "fontSizePreference";

// Valeurs autorisées et leur taille CSS correspondante (en % de la taille racine)
const FONT_SIZES = {
  petit: "87.5%",   // ~14px si base 16px
  normal: "100%",   // 16px, taille de référence
  grand: "112.5%",  // ~18px
};

const DEFAULT_SIZE = "normal";

// Récupère la préférence sauvegardée, ou la valeur par défaut si absente/invalide
const getStoredFontSize = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return FONT_SIZES[stored] ? stored : DEFAULT_SIZE;
};

// Sauvegarde la préférence
const setStoredFontSize = (size) => {
  if (!FONT_SIZES[size]) return;
  localStorage.setItem(STORAGE_KEY, size);
};

export { FONT_SIZES, DEFAULT_SIZE, getStoredFontSize, setStoredFontSize };