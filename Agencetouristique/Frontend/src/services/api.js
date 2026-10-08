import { expireSession } from "./authService"
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
  // Token refusé par le serveur (expiré ou invalide) : fin de session
  if (response.status === 401) {
    const body = await response.clone().json().catch(() => null);
    if (body?.code === "TOKEN_INVALID") expireSession();
  }

  // Retour de la réponse
  return response;
};

// =====================================================
// EXPORTATION
// =====================================================
export { fetchAuth };
export default API;