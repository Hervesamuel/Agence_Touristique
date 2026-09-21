// =====================================================// CONTROLLER : RENDEZ-VOUS// =====================================================
const rendezVousService = require("../services/rendezVousService");

// =====================================================// CREATION D'UN RENDEZ-VOUS// =====================================================
const createRendezVous = async (req, res) => {
    try {
        const rendezVous = await rendezVousService.createRendezVous(req.body);
        res.status(201).json({ message: "Rendez-vous créé avec succès", data: rendezVous });
    } catch (error) {
        if (error.statusCode === 400) return res.status(400).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la création du rendez-vous", error: error.message });
    }
};

// =====================================================// RECUPERATION DE TOUS LES RENDEZ-VOUS// =====================================================
const getAllRendezVous = async (req, res) => {
    try {
        const rendezVous = await rendezVousService.getAllRendezVous();
        res.status(200).json({ data: rendezVous });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des rendez-vous", error: error.message });
    }
};

// =====================================================// RECUPERATION D'UN RENDEZ-VOUS// =====================================================
const getRendezVousById = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);
        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Identifiant du rendez-vous invalide" });

        const rendezVous = await rendezVousService.getRendezVousById(id);
        res.status(200).json({ data: rendezVous });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la récupération du rendez-vous", error: error.message });
    }
};

// =====================================================// MODIFICATION D'UN RENDEZ-VOUS// =====================================================
const updateRendezVous = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);
        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Identifiant du rendez-vous invalide" });

        const rendezVous = await rendezVousService.updateRendezVous(id, req.body);
        res.status(200).json({ message: "Rendez-vous modifié avec succès", data: rendezVous });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        if (error.statusCode === 400) return res.status(400).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la modification du rendez-vous", error: error.message });
    }
};

// =====================================================// SUPPRESSION D'UN RENDEZ-VOUS// =====================================================
const deleteRendezVous = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);
        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Identifiant du rendez-vous invalide" });

        const result = await rendezVousService.deleteRendezVous(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la suppression du rendez-vous", error: error.message });
    }
};

module.exports = { createRendezVous, getAllRendezVous, getRendezVousById, updateRendezVous, deleteRendezVous };