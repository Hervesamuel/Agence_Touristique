// =====================================================
// ROUTES : NOTIFICATION
// =====================================================

const express = require("express");

const notificationController =
    require("../controllers/notificationController");

const validate =
    require("../middlewares/validate");

const notificationSchema =
    require("../utils/notificationSchema");

const router = express.Router();

// Création d'une notification
router.post(
    "/",
    validate(notificationSchema.create),
    notificationController.createNotification
);

// Récupération de toutes les notifications
router.get(
    "/",
    notificationController.getAllNotifications
);

// Récupération d'une notification par ID
router.get(
    "/:id",
    notificationController.getNotificationById
);

// Modification d'une notification
router.put(
    "/:id",
    validate(notificationSchema.update),
    notificationController.updateNotification
);

// Suppression d'une notification
router.delete(
    "/:id",
    notificationController.deleteNotification
);

module.exports = router;