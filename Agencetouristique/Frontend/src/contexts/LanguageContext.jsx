import { createContext, useContext, useState } from "react";
import translations from "../langue/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Langue actuelle, persistée dans le localStorage (fr par défaut)
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "fr");

  function changeLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  }

  // Fonction de traduction : renvoie le texte dans la langue actuelle,
  // ou la clé elle-même si elle n'existe pas encore (utile pendant la migration page par page)
  function t(key) {
    return translations[language]?.[key] || translations.fr[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}