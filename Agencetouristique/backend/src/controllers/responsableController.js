// Importation du service Responsable
const responsableService = require("../services/responsableService");

// Importation du schéma de validation
const responsableSchema = require("../utils/responsableSchema");

// Création d'un responsable
const createResponsable = async (req, res) => {
    try {
        const result = responsableSchema.create.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Données invalides",
                errors: result.error.issues
            });
        }

        const responsable = await responsableService.createResponsable(result.data);

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

// =====================================================
// RECUPERATION DE MON PROFIL
// =====================================================

const getMonProfil = async (req, res) => {
    try {
        const responsable = await responsableService.getResponsableById(req.user.id);
        res.status(200).json({ data: responsable });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la récupération du profil", error: error.message });
    }
};

// =====================================================
// MODIFICATION DE MON PROFIL
// =====================================================

const updateMonProfil = async (req, res) => {
    try {
        const result = responsableSchema.update.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Données invalides",
                errors: result.error.issues
            });
        }

        const responsable = await responsableService.updateResponsable(req.user.id, result.data);
        res.status(200).json({ message: "Profil mis à jour avec succès", data: responsable });
    } catch (error) {
        if (error.statusCode === 409) return res.status(409).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error: error.message });
    }
};

// =====================================================
// CHANGEMENT DU MOT DE PASSE
// =====================================================

const changerMotDePasse = async (req, res) => {
    try {
        const result = responsableSchema.changerMdp.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Données invalides",
                errors: result.error.issues
            });
        }

        const { mdpActuel, mdpNouveau } = result.data;
        const response = await responsableService.changerMotDePasse(req.user.id, mdpActuel, mdpNouveau);

        res.status(200).json(response);
    } catch (error) {
        if (error.statusCode === 401) return res.status(401).json({ message: error.message });
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors du changement de mot de passe", error: error.message });
    }
};

// Exportation du contrôleur
module.exports = {
    createResponsable,
    getMonProfil,
    updateMonProfil,
    changerMotDePasse
};