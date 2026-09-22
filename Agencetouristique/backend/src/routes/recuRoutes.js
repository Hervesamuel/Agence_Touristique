const express = require("express");
const router = express.Router();

const recuController = require("../controllers/recuController");
const validate = require("../middlewares/validate");
const recuSchema = require("../utils/recuSchema");

// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");


// Création d'un reçu
// Accessible uniquement à l'Agent
router.post(
    "/",
    authenticateToken,
    authorizeRoles("AGENT"),
    validate(recuSchema.create),
    recuController.createRecu
);

// Récupération de tous les reçus
// Accessible au Responsable et à l'Agent
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    recuController.getAllRecus
);

// Récupération d'un reçu par son identifiant
// Accessible au Responsable et à l'Agent
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    recuController.getRecuById
);

// Modification d'un reçu
// Accessible uniquement à l'Agent
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("AGENT"),
    validate(recuSchema.update),
    recuController.updateRecu
);

// Suppression d'un reçu
// Accessible uniquement à l'Agent
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("AGENT"),
    recuController.deleteRecu
);

module.exports = router;