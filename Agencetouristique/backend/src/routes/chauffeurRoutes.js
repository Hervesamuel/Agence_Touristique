// =====================================================
// ROUTES : CHAUFFEUR
// =====================================================

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

// =====================================================
// ROUTE POST : CREER UN CHAUFFEUR
// =====================================================

router.post(
    "/",
    validate(chauffeurSchema.create),
    chauffeurController.createChauffeur
);

router.get(
    "/",
    chauffeurController.getAllChauffeurs
);

router.get(
    "/:id",
    chauffeurController.getChauffeurById
);

router.put(
    "/:id",
    validate(chauffeurSchema.update),
    chauffeurController.updateChauffeur
);
router.delete(
    "/:id",
    chauffeurController.deleteChauffeur
);


// Exportation du routeur
module.exports = router;