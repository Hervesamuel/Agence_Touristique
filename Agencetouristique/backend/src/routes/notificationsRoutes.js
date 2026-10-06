const express = require("express");
const router = express.Router();

const notificationsController = require("../controllers/notificationsController");
const authenticateToken = require("../middlewares/authMiddleware");

// Toutes les routes nécessitent d'être connecté (Responsable, Agent ou Chauffeur)
// Accessible à tous les rôles, car chacun doit pouvoir voir ses propres notifications

// Route GET : récupérer mes notifications
router.get("/", authenticateToken, notificationsController.getMesNotifications);

// Route GET : nombre de notifications non lues (pour le badge de la cloche)
router.get("/non-lues/count", authenticateToken, notificationsController.getNombreNonLues);

// Route PUT : marquer une notification comme lue
router.put("/:id/lue", authenticateToken, notificationsController.marquerCommeLue);

// Route PUT : marquer toutes les notifications comme lues
router.put("/lues/tout", authenticateToken, notificationsController.marquerToutesCommeLues);

// Route DELETE : supprimer une notification
router.delete("/:id", authenticateToken, notificationsController.deleteNotification);

module.exports = router;