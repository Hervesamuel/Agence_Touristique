// Importation du service Responsable
const responsableService = require("../services/responsableService");

// Importation du schéma de validation
const responsableSchema = require("../utils/responsableSchema");

// Création d'un responsable
const createResponsable = async (req, res) => {
    try {

        // Validation des données reçues
        const result = responsableSchema.safeParse(req.body);

        // Vérification du résultat de la validation
        if (!result.success) {
            return res.status(400).json({
                message: "Données invalides",
                errors: result.error.issues
            });
        }

        // Envoi des données validées au service
        const responsable = await responsableService.createResponsable(
            result.data
        );

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