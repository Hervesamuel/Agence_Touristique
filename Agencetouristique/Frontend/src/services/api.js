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
  utilisateurs: `${API_URL}/utilisateurs`,
  notifications: `${API_URL}/notifications`,
};

// =====================================================
// REQUETE AUTHENTIFIEE
// =====================================================

const fetchAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Ajout du token JWT
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

export { fetchAuth };

export default API;
