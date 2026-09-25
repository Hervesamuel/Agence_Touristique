// =====================================================
// SERVICE : DASHBOARD
// =====================================================

// Importation de la configuration des API
import API from "./api";

// Importation du token d'authentification
import { getToken } from "./authService";

// Clé utilisée pour le cache hors-ligne
const CACHE_KEY = "dashboardCache";

// =====================================================
// RECUPERATION DES DONNEES DU DASHBOARD
// =====================================================

const getDashboardData = async () => {
  try {
    // Récupération du token JWT
    const token = getToken();

    // Configuration des en-têtes
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Appels des différentes API
    const [
      agentsResponse,
      chauffeursResponse,
      vehiculesResponse,
      circuitsResponse,
      reservationsResponse,
      rendezVousResponse,
    ] = await Promise.all([
      fetch(API.agents, { headers }),
      fetch(API.chauffeurs, { headers }),
      fetch(API.vehicules, { headers }),
      fetch(API.circuits, { headers }),
      fetch(API.reservations, { headers }),
      fetch(API.rendezVous, { headers }),
    ]);

    // Conversion des réponses en JSON
    const [
      agents,
      chauffeurs,
      vehicules,
      circuits,
      reservations,
      rendezVous,
    ] = await Promise.all([
      agentsResponse.json(),
      chauffeursResponse.json(),
      vehiculesResponse.json(),
      circuitsResponse.json(),
      reservationsResponse.json(),
      rendezVousResponse.json(),
    ]);

    // Vérification des réponses
    if (!agentsResponse.ok) {
      throw new Error(
        agents.message || "Impossible de récupérer les agents"
      );
    }

    if (!chauffeursResponse.ok) {
      throw new Error(
        chauffeurs.message || "Impossible de récupérer les chauffeurs"
      );
    }

    if (!vehiculesResponse.ok) {
      throw new Error(
        vehicules.message || "Impossible de récupérer les véhicules"
      );
    }

    if (!circuitsResponse.ok) {
      throw new Error(
        circuits.message || "Impossible de récupérer les circuits"
      );
    }

    if (!reservationsResponse.ok) {
      throw new Error(
        reservations.message || "Impossible de récupérer les réservations"
      );
    }

    if (!rendezVousResponse.ok) {
      throw new Error(
        rendezVous.message || "Impossible de récupérer les rendez-vous"
      );
    }

    // Regroupement des données du dashboard
    const dashboardData = {
      agents,
      chauffeurs,
      vehicules,
      circuits,
      reservations,
      rendezVous,
    };

    // Mise en cache pour permettre l'accès hors-ligne
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: dashboardData, savedAt: new Date().toISOString() })
      );
    } catch (cacheError) {
      // Le cache n'est pas critique : on ignore une éventuelle erreur (ex: quota dépassé)
      console.warn("Impossible de mettre en cache les données du dashboard :", cacheError);
    }

    return dashboardData;
  } catch (error) {
    // Cas d'une absence de connexion réseau
    if (error instanceof TypeError) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        return data;
      }
      throw new Error(
        "Impossible de contacter le serveur et aucune donnée en cache disponible."
      );
    }

    throw error;
  }
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================

export { getDashboardData };