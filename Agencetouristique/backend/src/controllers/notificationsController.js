// =====================================================
// CONTROLLER : NOTIFICATIONS
// =====================================================
const notificationsService = require("../services/notificationsService");

// =====================================================
// RECUPERATION DES NOTIFICATIONS DE L'UTILISATEUR CONNECTE
// =====================================================
const getMesNotifications = async (req, res) => {
    try {
        // req.user vient du middleware d'authentification (token décodé)
        const { id, role } = req.user;

        const notifications = await notificationsService.getNotificationsUtilisateur(id, role);
        res.status(200).json({ data: notifications });
    } catch (error) {
        console.error("ERREUR NOTIFICATIONS :", error);   // ← ajoute cette ligne
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message });
    }
};

// =====================================================
// COMPTAGE DES NOTIFICATIONS NON LUES
// =====================================================
const getNombreNonLues = async (req, res) => {
    try {
        const { id, role } = req.user;

        const count = await notificationsService.getNombreNonLues(id, role);
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du comptage des notifications", error: error.message });
    }
};

// =====================================================
// MARQUER UNE NOTIFICATION COMME LUE
// =====================================================
const marquerCommeLue = async (req, res) => {
    try {
        const idnotif = Number(req.params.id);
        if (!Number.isInteger(idnotif) || idnotif <= 0) {
            return res.status(400).json({ message: "Identifiant de la notification invalide" });
        }

        const notification = await notificationsService.marquerCommeLue(idnotif);
        res.status(200).json({ message: "Notification marquée comme lue", data: notification });
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la mise à jour de la notification", error: error.message });
    }
};

// =====================================================
// MARQUER TOUTES LES NOTIFICATIONS COMME LUES
// =====================================================
const marquerToutesCommeLues = async (req, res) => {
    try {
        const { id, role } = req.user;

        const result = await notificationsService.marquerToutesCommeLues(id, role);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour des notifications", error: error.message });
    }
};

// =====================================================
// SUPPRESSION D'UNE NOTIFICATION
// =====================================================
const deleteNotification = async (req, res) => {
    try {
        const idnotif = Number(req.params.id);
        if (!Number.isInteger(idnotif) || idnotif <= 0) {
            return res.status(400).json({ message: "Identifiant de la notification invalide" });
        }

        const result = await notificationsService.deleteNotification(idnotif);
        res.status(200).json(result);
    } catch (error) {
        if (error.statusCode === 404) return res.status(404).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de la suppression de la notification", error: error.message });
    }
};

module.exports = {
    getMesNotifications,
    getNombreNonLues,
    marquerCommeLue,
    marquerToutesCommeLues,
    deleteNotification,
};