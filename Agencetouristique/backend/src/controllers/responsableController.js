// Importation du service Responsable
const responsableService = require("../services/responsableService");

// Création d'un responsable
const createResponsable = async (req, res) => {
    try {
        const responsable = await responsableService.createResponsable(req.body);

        res.status(201).json({
            message: "Responsable créé avec succès",
            data: responsable
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création du responsable",
            error: error.message
        });
    }
};

// Exportation du contrôleur
module.exports = {
    createResponsable
};