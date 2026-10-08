// Importation du service d'authentification
const authService = require("../services/authService");

// =====================================================
// CONNEXION
// =====================================================
const login = async (req, res) => {
    try {
        // Récupération des données envoyées
        const { email, mdp } = req.body;
        // Appel du service d'authentification
        const result = await authService.login(email, mdp);
        // Retour de la réponse
        return res.status(200).json(result);
    } catch (error) {
        // Gestion des erreurs
        return res.status(error.statusCode || 500).json({ message: error.message || "Erreur lors de la connexion" });
    }
};

// =====================================================
// RECUPERATION DU PROFIL
// =====================================================
const getProfile = async (req, res) => {
    try {
        // Récupération des informations du token JWT
        const user = req.user;
        // Appel du service de récupération du profil
        const profile = await authService.getProfile(user);
        // Retour du profil
        return res.status(200).json({ message: "Profil récupéré avec succès", user: profile });
    } catch (error) {
        // Gestion des erreurs
        return res.status(error.statusCode || 500).json({ message: error.message || "Erreur lors de la récupération du profil" });
    }
};

// =====================================================
// MODIFICATION DU PROFIL
// =====================================================
const updateProfile = async (req, res) => {
    try {
        // Récupération des informations du token JWT
        const user = req.user;
        // Récupération des données du profil
        const data = req.body;
        // Appel du service de modification du profil
        const profile = await authService.updateProfile(user, data);
        // Retour du profil modifié
        return res.status(200).json({ message: "Profil modifié avec succès", user: profile });
    } catch (error) {
        // Gestion des erreurs
        return res.status(error.statusCode || 500).json({ message: error.message || "Erreur lors de la modification du profil" });
    }
};

// =====================================================
// MODIFICATION DU MOT DE PASSE
// =====================================================
const updatePassword = async (req, res) => {
    try {
        // Récupération des informations du token JWT
        const user = req.user;
        // Récupération des mots de passe
        const { ancienMdp, nouveauMdp } = req.body;
        // Appel du service de modification du mot de passe
        const result = await authService.updatePassword(user, ancienMdp, nouveauMdp);
        // Retour de la réponse
        return res.status(200).json(result);
    } catch (error) {
        // Gestion des erreurs
        return res.status(error.statusCode || 500).json({ message: error.message || "Erreur lors de la modification du mot de passe" });
    }
};

// =====================================================
// EXPORTATION DU CONTROLLER
// =====================================================
module.exports = {
    login,
    getProfile,
    updateProfile,
    updatePassword
};