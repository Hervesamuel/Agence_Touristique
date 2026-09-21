// =====================================================// CONTROLLER : RESERVATION// =====================================================
const reservationService = require("../services/reservationService");

// =====================================================// CREATION D'UNE RESERVATION// =====================================================
const createReservation = async (req, res) => {
    try {
        const reservation = await reservationService.createReservation(req.body);
        res.status(201).json({ message: "Réservation créée avec succès", data: reservation });
    } catch (error) {
        if (error.statusCode === 400) return res.status(400).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la création de la réservation", error: error.message });
    }
};

// =====================================================// RECUPERATION DE TOUTES LES RESERVATIONS// =====================================================
const getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationService.getAllReservations();
        res.status(200).json({ data: reservations });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des réservations", error: error.message });
    }
};

// =====================================================// RECUPERATION D'UNE RESERVATION// =====================================================
const getReservationById = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);
        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Identifiant de la réservation invalide" });

        const reservation = await reservationService.getReservationById(id);
        res.status(200).json({ data: reservation });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la récupération de la réservation", error: error.message });
    }
};

// =====================================================// MODIFICATION D'UNE RESERVATION// =====================================================
const updateReservation = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);
        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Identifiant de la réservation invalide" });

        const reservation = await reservationService.updateReservation(id, req.body);
        res.status(200).json({ message: "Réservation modifiée avec succès", data: reservation });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        if (error.statusCode === 400) return res.status(400).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la modification de la réservation", error: error.message });
    }
};

// =====================================================// SUPPRESSION D'UNE RESERVATION// =====================================================
const deleteReservation = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);
        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: "Identifiant de la réservation invalide" });

        const result = await reservationService.deleteReservation(id);
        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        if (error.statusCode === 409) return res.status(409).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la suppression de la réservation", error: error.message });
    }
};

module.exports = { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation };