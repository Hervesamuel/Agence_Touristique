const profilService = require("../services/profilService");
const profilSchema = require("../utils/profilSchema");

// Reprend le statut défini par le service (401, 404, 409...), sinon 500
const repondreErreur = (res, error, message) => {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    res.status(500).json({ message, error: error.message });
};

const getMonProfil = async (req, res) => {
    try {
        const profil = await profilService.getProfil(req.user.id, req.user.role);
        res.status(200).json({ data: profil });
    } catch (error) {
        repondreErreur(res, error, "Erreur lors de la récupération du profil");
    }
};

const updateMonProfil = async (req, res) => {
    try {
        const result = profilSchema.update.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Données invalides", errors: result.error.issues });
        }
        const profil = await profilService.updateProfil(req.user.id, req.user.role, result.data);
        res.status(200).json({ message: "Profil mis à jour avec succès", data: profil });
    } catch (error) {
        repondreErreur(res, error, "Erreur lors de la mise à jour du profil");
    }
};

const changerMotDePasse = async (req, res) => {
    try {
        const result = profilSchema.changerMdp.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Données invalides", errors: result.error.issues });
        }
        const { mdpActuel, mdpNouveau } = result.data;
        const reponse = await profilService.changerMotDePasse(req.user.id, req.user.role, mdpActuel, mdpNouveau);
        res.status(200).json(reponse);
    } catch (error) {
        repondreErreur(res, error, "Erreur lors du changement de mot de passe");
    }
};

module.exports = { getMonProfil, updateMonProfil, changerMotDePasse };