import { useContext } from "react";
import { FontSizeContext } from "../contexts/FontSizeContext";

// Hook personnalisé : évite d'importer useContext + FontSizeContext partout,
// et centralise la vérification d'usage correct (erreur claire si mal utilisé)
function useFontSize() {
  const context = useContext(FontSizeContext);

  if (!context) {
    throw new Error("useFontSize doit être utilisé à l'intérieur d'un FontSizeProvider");
  }

  return context;
}

export default useFontSize;