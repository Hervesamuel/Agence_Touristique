import { createContext, useState, useEffect } from "react";
import { FONT_SIZES, getStoredFontSize, setStoredFontSize } from "../utils/fontSizeStorage";

// Contexte exposant l'état et l'action de changement
const FontSizeContext = createContext(null);

function FontSizeProvider({ children }) {
  // Initialisation depuis le stockage (une seule fois, au montage)
  const [fontSize, setFontSize] = useState(getStoredFontSize);

  // Application de la taille sur la racine du document dès que la valeur change
  // (variable CSS unique -> toutes les classes Tailwind en "rem" s'adaptent automatiquement)
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZES[fontSize];
    setStoredFontSize(fontSize);
  }, [fontSize]);

  // Action exposée aux composants consommateurs
  const changeFontSize = (newSize) => {
    if (!FONT_SIZES[newSize]) return;
    setFontSize(newSize);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export { FontSizeContext, FontSizeProvider };