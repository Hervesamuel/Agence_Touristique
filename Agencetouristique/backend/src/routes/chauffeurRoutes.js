// Importation d'Express
const express = require("express");

// Création du routeur Express
const router = express.Router();

// Importation du contrôleur Chauffeur
const chauffeurController = require("../controllers/chauffeurController");

// Importation du middleware de validation
const validate = require("../middlewares/validate");

// Importation du schéma de validation Chauffeur
const chauffeurSchema = require("../utils/chauffeurSchema");

// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");

// Route POST : créer un chauffeur
// Accessible uniquement au Responsable
router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(chauffeurSchema.create),
    chauffeurController.createChauffeur
);

// Route GET : récupérer un chauffeur par son ID
// Accessible au Responsable et à l'Agent
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    chauffeurController.getChauffeurById
);

// Route GET : récupérer tous les chauffeurs
// Accessible au Responsable et à l'Agent
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    chauffeurController.getAllChauffeurs
);

// Route PUT : modifier un chauffeur
// Accessible uniquement au Responsable
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(chauffeurSchema.update),
    chauffeurController.updateChauffeur
);

// Route DELETE : supprimer un chauffeur
// Accessible uniquement au Responsable
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    chauffeurController.deleteChauffeur
);

// Exportation du routeur
module.exports = router;