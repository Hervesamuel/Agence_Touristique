const notificationService = require("../services/notificationService");

// =====================================================
// CREATION
// =====================================================

const createNotification = async (req, res) => {
    try {
        const notification =
            await notificationService.createNotification(req.body);

        res.status(201).json(notification);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};

// =====================================================
// RECUPERATION DE TOUTES LES NOTIFICATIONS
// =====================================================

const getAllNotifications = async (req, res) => {
    try {
        const notifications =
            await notificationService.getAllNotifications();

        res.status(200).json(notifications);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};

// =====================================================
// RECUPERATION PAR ID
// =====================================================

const getNotificationById = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant de la notification est invalide"
            });
        }

        const notification =
            await notificationService.getNotificationById(id);

        res.status(200).json(notification);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};

// =====================================================
// MODIFICATION
// =====================================================

const updateNotification = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant de la notification est invalide"
            });
        }

        const notification =
            await notificationService.updateNotification(id, req.body);

        res.status(200).json(notification);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};

// =====================================================
// SUPPRESSION
// =====================================================

const deleteNotification = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "L'identifiant de la notification est invalide"
            });
        }

        const result =
            await notificationService.deleteNotification(id);

        res.status(200).json(result);

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message
        });
    }
};

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
};