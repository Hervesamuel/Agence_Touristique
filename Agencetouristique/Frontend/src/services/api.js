// =====================================================
// CONFIGURATION DES API
// =====================================================
const API_URL = "http://localhost:5000/api";

const API = {
  auth: `${API_URL}/auth`,
  agences: `${API_URL}/agences`,
  responsables: `${API_URL}/responsables`,
  agents: `${API_URL}/agents`,
  chauffeurs: `${API_URL}/chauffeurs`,
  vehicules: `${API_URL}/vehicules`,
  circuits: `${API_URL}/circuits`,
  reservations: `${API_URL}/reservations`,
  rendezVous: `${API_URL}/rendez-vous`,
  recus: `${API_URL}/recus`,
  notifications: `${API_URL}/notifications`,
  profil: `${API_URL}/profil`,
};

// =====================================================
// REQUETE AUTHENTIFIEE
// =====================================================
const fetchAuth = async (url, options = {}) => {
  // Récupération du token JWT
  const token = localStorage.getItem("token");

  // Création des en-têtes HTTP
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Ajout du token JWT
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Envoi de la requête
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // =====================================================
  // VERIFICATION DE L'EXPIRATION DU TOKEN
  // =====================================================
  if (response.status === 401) {
    // Suppression du token JWT
    localStorage.removeItem("token");
    // Suppression des informations utilisateur
    localStorage.removeItem("user");
    // Redirection vers la page de connexion
    window.location.href = "/login";
    // Arrêt du traitement de la réponse
    return response;
  }

  // Retour de la réponse
  return response;
};

// =====================================================
// EXPORTATION
// =====================================================
export { fetchAuth };
export default API;