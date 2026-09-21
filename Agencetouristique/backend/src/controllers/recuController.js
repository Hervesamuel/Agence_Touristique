const recuService = require("../services/recuService");

// Création d'un reçu
const createRecu = async (req, res) => {
    try {
        const recu = await recuService.createRecu(req.body);

        res.status(201).json({
            message: "Reçu créé avec succès",
            data: recu
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la création du reçu"
        });
    }
};

// Récupération de tous les reçus
const getAllRecus = async (req, res) => {
    try {
        const recus = await recuService.getAllRecus();

        res.status(200).json({
            message: "Liste des reçus récupérée avec succès",
            data: recus
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des reçus"
        });
    }
};

// Récupération d'un reçu par son identifiant
const getRecuById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant du reçu est invalide"
            });
        }

        const recu = await recuService.getRecuById(id);

        res.status(200).json({
            message: "Reçu récupéré avec succès",
            data: recu
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la récupération du reçu"
        });
    }
};

// Modification d'un reçu
const updateRecu = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant du reçu est invalide"
            });
        }

        const recu = await recuService.updateRecu(id, req.body);

        res.status(200).json({
            message: "Reçu modifié avec succès",
            data: recu
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la modification du reçu"
        });
    }
};

// Suppression d'un reçu
const deleteRecu = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant du reçu est invalide"
            });
        }

        const result = await recuService.deleteRecu(id);

        res.status(200).json(result);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la suppression du reçu"
        });
    }
};

module.exports = {
    createRecu,
    getAllRecus,
    getRecuById,
    updateRecu,
    deleteRecu
};