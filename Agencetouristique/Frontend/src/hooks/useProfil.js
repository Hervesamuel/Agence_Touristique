import { useEffect, useState } from "react";
import { getUser } from "../services/authService";
import { getMonProfil } from "../services/profilService";

// Profil du compte connecté (nom + photo), actualisé toutes les 3 secondes
function useProfil(intervalMs = 3000) {
  const [profil, setProfil] = useState({ nom: getUser()?.nom || "", photo: "" });

  useEffect(() => {
    let actif = true;

    const charger = async () => {
      try {
        const response = await getMonProfil();
        const data = response.data || response;
        if (!actif) return;

        // L'état ne change que si le nom ou la photo ont changé (évite les rendus inutiles)
        setProfil((prev) =>
          prev.nom === data.nom && prev.photo === (data.photo || "")
            ? prev
            : { nom: data.nom, photo: data.photo || "" }
        );
      } catch {
        // échec silencieux : on garde les dernières valeurs connues
      }
    };

    charger();
    const interval = setInterval(charger, intervalMs);

    // Nettoyage : arrête l'actualisation quand le composant est démonté
    return () => {
      actif = false;
      clearInterval(interval);
    };
  }, [intervalMs]);

  return profil;
}

export default useProfil;