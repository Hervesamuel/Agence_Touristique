
// =====================================================
// CONTROLEUR : AGENCE
// =====================================================

// Importation du service Agence
const agenceService = require("../services/agenceService");

// Création d'une agence
const createAgence = async (req, res) => {
    try {
        const agence = await agenceService.createAgence(req.body);
        res.status(201).json({ message: "Agence créée avec succès", data: agence });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'agence", error: error.message });
    }
};

// Exportation du contrôleu
module.exports = { createAgence };