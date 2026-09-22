// =====================================================
// ROUTES : CIRCUIT
// =====================================================

const express = require("express");

const router = express.Router();

const circuitController = require("../controllers/circuitController");
const validate = require("../middlewares/validate");
const circuitSchema = require("../utils/circuitSchema");

// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");
// =====================================================
// POST
// =====================================================

// Route POST : créer un circuit
// Accessible uniquement au Responsable
router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(circuitSchema.create),
    circuitController.createCircuit
);

// =====================================================
// GET ALL
// =====================================================

// Route GET : récupérer tous les circuits
// Accessible au Responsable, à l'Agent et au Chauffeur
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT", "CHAUFFEUR"),
    circuitController.getAllCircuits
);

// =====================================================
// GET BY ID
// =====================================================

// Route GET : récupérer un circuit par son ID
// Accessible au Responsable, à l'Agent et au Chauffeur
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT", "CHAUFFEUR"),
    circuitController.getCircuitById
);

// =====================================================
// PUT
// =====================================================

// Route PUT : modifier un circuit
// Accessible uniquement au Responsable
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(circuitSchema.update),
    circuitController.updateCircuit
);

// =====================================================
// DELETE
// =====================================================

// Route DELETE : supprimer un circuit
// Accessible uniquement au Responsable
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    circuitController.deleteCircuit
);

module.exports = router;