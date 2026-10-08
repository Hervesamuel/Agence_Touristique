// =====================================================
// SERVICE : AUTHENTIFICATION
// =====================================================

// URL de l'API d'authentification
const API_URL = "http://localhost:5000/api/auth";

// =====================================================
// CONNEXION
// =====================================================
const login = async (email, mdp) => {
    try {
        // Envoi des identifiants au backend
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, mdp })
        });

        // Conversion de la réponse en JSON
        const data = await response.json();

        // Vérification de la réponse
        if (!response.ok) {
            throw new Error(data.message || "Email ou mot de passe incorrect");
        }

        // Stockage du token JWT
        localStorage.setItem("token", data.token);

        // Stockage des informations utilisateur
        localStorage.setItem("user", JSON.stringify(data.user));

        // Retour des informations de connexion
        return data;

    } catch (error) {
        // Gestion des erreurs de connexion au serveur
        if (error instanceof TypeError) {
            throw new Error("Impossible de contacter le serveur. Veuillez réessayer.");
        }

        throw error;
    }
};

// =====================================================
// RECUPERATION DU TOKEN
// =====================================================
const getToken = () => {
    return localStorage.getItem("token");
};

// =====================================================
// RECUPERATION DE L'UTILISATEUR
// =====================================================
const getUser = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
};

// =====================================================
// DECONNEXION
// =====================================================
const logout = () => {
    // Suppression du token JWT
    localStorage.removeItem("token");
    // Suppression des informations utilisateur
    localStorage.removeItem("user");
};

// =====================================================
// EXPIRATION DU TOKEN
// =====================================================

// Date d'expiration du token (en millisecondes), lue dans le payload du JWT
const getTokenExpiration = (token) => {
    try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.exp ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
};

// Déconnexion forcée : nettoie la session et renvoie vers la page de connexion
// avec un message d'explication (affiché par Login.jsx)
const expireSession = () => {
    logout();
    sessionStorage.setItem("sessionExpired", "1");
    window.location.replace("/login");
};


// =====================================================
// EXPORTATION DU SERVICE
// =====================================================

export { login, getToken, getUser, logout, getTokenExpiration, expireSession };