
const express = require("express");

const router = express.Router();

const reservationController = require("../controllers/reservationController");
const validate = require("../middlewares/validate");
const reservationSchema = require("../utils/reservationSchema");
// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");


// =====================================================
// POST
// =====================================================

// Route POST : créer une réservation
// Accessible uniquement à l'Agent
router.post(
    "/",
    authenticateToken,
    authorizeRoles("AGENT"),
    validate(reservationSchema.create),
    reservationController.createReservation
);
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT", "CHAUFFEUR"),
    reservationController.getAllReservations
);

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT", "CHAUFFEUR"),
    reservationController.getReservationById
);

// =====================================================
// PUT
// =====================================================

// Route PUT : modifier une réservation
// Accessible uniquement à l'Agent
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("AGENT"),
    validate(reservationSchema.update),
    reservationController.updateReservation
);

// =====================================================
// DELETE
// =====================================================

// Route DELETE : supprimer une réservation
// Accessible uniquement à l'Agent
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("AGENT"),
    reservationController.deleteReservation
);

module.exports = router;