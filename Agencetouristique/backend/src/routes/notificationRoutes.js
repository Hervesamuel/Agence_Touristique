const express = require("express");

const notificationController =
    require("../controllers/notificationController");

const validate =
    require("../middlewares/validate");

const notificationSchema =
    require("../utils/notificationSchema");

const router = express.Router();

// Importation du middleware d'authentification
const authenticateToken =
    require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles =
    require("../middlewares/roleMiddleware");




  // Création d'une notification
// Accessible uniquement au Responsable
router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(notificationSchema.create),
    notificationController.createNotification
);

// Récupération de toutes les notifications
// Accessible au Responsable et à l'Agent
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    notificationController.getAllNotifications
);

// Récupération d'une notification par ID
// Accessible au Responsable et à l'Agent
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    notificationController.getNotificationById
);

// Modification d'une notification
// Accessible uniquement au Responsable
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(notificationSchema.update),
    notificationController.updateNotification
);

// Suppression d'une notification
// Accessible uniquement au Responsable
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    notificationController.deleteNotification
);

module.exports = router;