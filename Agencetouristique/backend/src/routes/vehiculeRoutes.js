// Importation d'Express
const express = require("express");

// Création du routeur Express
const router = express.Router();

// Importation du contrôleur Vehicule
const vehiculeController = require("../controllers/vehiculeController");

// Importation du middleware de validation
const validate = require("../middlewares/validate");

// Importation du schéma de validation Vehicule
const vehiculeSchema = require("../utils/vehiculeSchema");

// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");

// Route POST : créer un véhicule
// Accessible uniquement au Responsable
router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(vehiculeSchema.create),
    vehiculeController.createVehicule
);

// Route GET : récupérer tous les véhicules
// Accessible au Responsable, à l'Agent et au Chauffeur
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT", "CHAUFFEUR"),
    vehiculeController.getAllVehicules
);

// Route GET : récupérer un véhicule par ID
// Accessible au Responsable, à l'Agent et au Chauffeur
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT", "CHAUFFEUR"),
    vehiculeController.getVehiculeById
);

// Route PUT : modifier un véhicule
// Accessible uniquement au Responsable
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(vehiculeSchema.update),
    vehiculeController.updateVehicule
);

// Route DELETE : supprimer un véhicule
// Accessible uniquement au Responsable
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    vehiculeController.deleteVehicule
);

// Exportation du routeur
module.exports = router;