const authService = require("../services/authService");

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
        return res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la connexion"
        });
    }
};


module.exports = {
    login
};