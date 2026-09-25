// =====================================================
// SERVICE : DASHBOARD
// =====================================================

// Importation de la configuration des API
import API from "./api";

// Importation du token d'authentification
import { getToken } from "./authService";

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

    // Retour des données du dashboard
    return {
      agents,
      chauffeurs,
      vehicules,
      circuits,
      reservations,
      rendezVous,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Impossible de contacter le serveur.");
    }

    throw error;
  }
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================

export { getDashboardData };