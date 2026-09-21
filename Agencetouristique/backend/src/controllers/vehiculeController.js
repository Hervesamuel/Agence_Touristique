// Importation du service Vehicule
const vehiculeService = require("../services/vehiculeService");

// =====================================================
// CREATION D'UN VEHICULE
// =====================================================

const createVehicule = async (req, res) => {
    try {

        // Création du véhicule
        const vehicule = await vehiculeService.createVehicule(req.body);

        // Réponse en cas de succès
        res.status(201).json({
            message: "Véhicule créé avec succès",
            data: vehicule
        });

    } catch (error) {

        // Gestion d'une immatriculation déjà utilisée
        // Gestion des contraintes d'unicité
if (error.code === "P2002") {

    // Vérification de la contrainte concernée
    const target = error.meta?.target;

            if (target?.includes("immatriculation")) {
                return res.status(409).json({
                    message: "Cette immatriculation est déjà utilisée"
                });
            }

            if (target?.includes("idchauffeur")) {
                return res.status(409).json({
                    message: "Ce chauffeur est déjà affecté à un autre véhicule"
                });
            }

            return res.status(409).json({
                message: "Une donnée unique est déjà utilisée"
            });
        }

        // Gestion d'un chauffeur ou d'une agence inexistante
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "Le chauffeur ou l'agence indiqué n'existe pas"
            });
        }

        // Gestion des autres erreurs
        res.status(500).json({
            message: "Erreur lors de la création du véhicule",
            error: error.message
        });
    }
};

// =====================================================
// RECUPERATION DE TOUS LES VEHICULES
// =====================================================

const getAllVehicules = async (req, res) => {
    try {

        // Récupération de tous les véhicules
        const vehicules = await vehiculeService.getAllVehicules();

        res.status(200).json({
            message: "Liste des véhicules récupérée avec succès",
            data: vehicules
        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération des véhicules",
            error: error.message
        });
    }
};

// =====================================================
// RECUPERATION D'UN VEHICULE PAR SON IDENTIFIANT
// =====================================================

// =====================================================
// RECUPERATION D'UN VEHICULE PAR SON IDENTIFIANT
// =====================================================

const getVehiculeById = async (req, res) => {
    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du véhicule invalide"
            });
        }

        // Recherche du véhicule à travers le service
        const vehicule = await vehiculeService.getVehiculeById(id);

        res.status(200).json({
            message: "Véhicule récupéré avec succès",
            data: vehicule
        });

    } catch (error) {

        // Véhicule inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Erreur serveur
        res.status(500).json({
            message: "Erreur lors de la récupération du véhicule",
            error: error.message
        });
    }
};

// =====================================================
// MODIFICATION D'UN VEHICULE
// =====================================================

const updateVehicule = async (req, res) => {
    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du véhicule invalide"
            });
        }

        // Modification du véhicule
        const vehicule = await vehiculeService.updateVehicule(
            id,
            req.body
        );

        res.status(200).json({
            message: "Véhicule modifié avec succès",
            data: vehicule
        });

    } catch (error) {

        // Véhicule inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Conflit de donnée unique
        if (error.statusCode === 409) {
            return res.status(409).json({
                message: error.message
            });
        }

        // Erreur liée à une relation
        if (error.statusCode === 400) {
            return res.status(400).json({
                message: error.message
            });
        }

        // Erreur serveur
        res.status(500).json({
            message: "Erreur lors de la modification du véhicule",
            error: error.message
        });
    }
};

// =====================================================
// SUPPRESSION D'UN VEHICULE
// =====================================================

const deleteVehicule = async (req, res) => {
    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du véhicule invalide"
            });
        }

        // Suppression du véhicule
        const result = await vehiculeService.deleteVehicule(id);

        res.status(200).json(result);

    } catch (error) {

        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Erreur lors de la suppression du véhicule",
            error: error.message
        });
    }
};

module.exports = {
    createVehicule,
    getAllVehicules,
    getVehiculeById,
    updateVehicule,
    deleteVehicule
};