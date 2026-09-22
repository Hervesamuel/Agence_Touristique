
const express = require("express");

const router = express.Router();

const rendezVousController =
    require("../controllers/rendezVousController");

const validate = require("../middlewares/validate");

const rendezVousSchema =
    require("../utils/rendezVousSchema");

// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");


// =====================================================
// POST
// =====================================================

// Route POST : créer un rendez-vous
// Accessible uniquement à l'Agent
router.post(
    "/",
    authenticateToken,
    authorizeRoles("AGENT"),
    validate(rendezVousSchema.create),
    rendezVousController.createRendezVous
);

// =====================================================
// GET ALL
// =====================================================

// Route GET : récupérer tous les rendez-vous
// Accessible au Responsable et à l'Agent
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    rendezVousController.getAllRendezVous
);

// =====================================================
// GET BY ID
// =====================================================

// Route GET : récupérer un rendez-vous par son ID
// Accessible au Responsable et à l'Agent
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    rendezVousController.getRendezVousById
);

// =====================================================
// PUT
// =====================================================

// Route PUT : modifier un rendez-vous
// Accessible uniquement à l'Agent
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("AGENT"),
    validate(rendezVousSchema.update),
    rendezVousController.updateRendezVous
);

// =====================================================
// DELETE
// =====================================================

// Route DELETE : supprimer un rendez-vous
// Accessible uniquement à l'Agent
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("AGENT"),
    rendezVousController.deleteRendezVous
);

module.exports = router;