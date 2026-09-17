// =====================================================
// CONTROLEUR : CHAUFFEUR
// =====================================================

// Importation du service Chauffeur
const chauffeurService = require("../services/chauffeurService");

// =====================================================
// CREATION D'UN CHAUFFEUR
// =====================================================

const createChauffeur = async (req, res) => {
    try {
        // Envoi des données validées au service
        const chauffeur = await chauffeurService.createChauffeur(req.body);

        res.status(201).json({
            message: "Chauffeur créé avec succès",
            data: chauffeur
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création du chauffeur",
            error: error.message
        });
    }
};


// =====================================================
// RECUPERATION DE TOUS LES CHAUFFEURS
// =====================================================

const getAllChauffeurs = async (req, res) => {
    try {
        // Récupération de tous les chauffeurs
        const chauffeurs = await chauffeurService.getAllChauffeurs();

        res.status(200).json({
            message: "Liste des chauffeurs récupérée avec succès",
            data: chauffeurs
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des chauffeurs",
            error: error.message
        });
    }
};


// =====================================================
// RECUPERATION D'UN CHAUFFEUR PAR SON IDENTIFIANT
// =====================================================

const getChauffeurById = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du chauffeur invalide"
            });
        }

        // Récupération du chauffeur
        const chauffeur = await chauffeurService.getChauffeurById(id);

        res.status(200).json({
            message: "Chauffeur récupéré avec succès",
            data: chauffeur
        });

    } catch (error) {
        // Gestion d'un chauffeur inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Gestion des autres erreurs
        res.status(500).json({
            message: "Erreur lors de la récupération du chauffeur",
            error: error.message
        });
    }
};

// =====================================================
// MODIFICATION D'UN CHAUFFEUR
// =====================================================

const updateChauffeur = async (req, res) => {
    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du chauffeur invalide"
            });
        }

        // Modification du chauffeur
        const chauffeur = await chauffeurService.updateChauffeur(
            id,
            req.body
        );

        res.status(200).json({
            message: "Chauffeur modifié avec succès",
            data: chauffeur
        });

    } catch (error) {

        // Chauffeur inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Email déjà utilisé
        if (error.statusCode === 409) {
            return res.status(409).json({
                message: error.message
            });
        }

        // Erreur serveur
        res.status(500).json({
            message: "Erreur lors de la modification du chauffeur",
            error: error.message
        });
    }
};

// =====================================================
// SUPPRESSION D'UN CHAUFFEUR
// =====================================================

const deleteChauffeur = async (req, res) => {
    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du chauffeur invalide"
            });
        }

        // Suppression du chauffeur
        const chauffeur = await chauffeurService.deleteChauffeur(id);

        res.status(200).json({
            message: "Chauffeur supprimé avec succès",
            data: chauffeur
        });

    } catch (error) {

        // Chauffeur inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Erreur serveur
        res.status(500).json({
            message: "Erreur lors de la suppression du chauffeur",
            error: error.message
        });
    }
};



// Exportation du contrôleur
module.exports = {
    createChauffeur,
    getAllChauffeurs,
    getChauffeurById,
    updateChauffeur,
    deleteChauffeur
};