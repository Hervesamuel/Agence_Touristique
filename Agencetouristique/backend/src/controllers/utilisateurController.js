const utilisateurService = require("../services/utilisateurService");

// Création d'un utilisateur
const createUtilisateur = async (req, res) => {
    try {
        const utilisateur = await utilisateurService.createUtilisateur(req.body);

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            data: utilisateur
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la création de l'utilisateur"
        });
    }
};

// Récupération de tous les utilisateurs
const getAllUtilisateurs = async (req, res) => {
    try {
        const utilisateurs = await utilisateurService.getAllUtilisateurs();

        res.status(200).json({
            message: "Liste des utilisateurs récupérée avec succès",
            data: utilisateurs
        });

    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs"
        });
    }
};

// Récupération d'un utilisateur par son identifiant
const getUtilisateurById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant de l'utilisateur est invalide"
            });
        }

        const utilisateur = await utilisateurService.getUtilisateurById(id);

        res.status(200).json({
            message: "Utilisateur récupéré avec succès",
            data: utilisateur
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la récupération de l'utilisateur"
        });
    }
};

// Modification d'un utilisateur
const updateUtilisateur = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant de l'utilisateur est invalide"
            });
        }

        const utilisateur = await utilisateurService.updateUtilisateur(
            id,
            req.body
        );

        res.status(200).json({
            message: "Utilisateur modifié avec succès",
            data: utilisateur
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la modification de l'utilisateur"
        });
    }
};

// Suppression d'un utilisateur
const deleteUtilisateur = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant de l'utilisateur est invalide"
            });
        }

        const result = await utilisateurService.deleteUtilisateur(id);

        res.status(200).json(result);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Erreur lors de la suppression de l'utilisateur"
        });
    }
};

module.exports = {
    createUtilisateur,
    getAllUtilisateurs,
    getUtilisateurById,
    updateUtilisateur,
    deleteUtilisateur
};