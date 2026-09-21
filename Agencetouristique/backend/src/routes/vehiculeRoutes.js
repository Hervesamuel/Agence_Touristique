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

// Route POST : Creer un véhicule
router.post(
    "/",
    validate(vehiculeSchema.create),
    vehiculeController.createVehicule
);
// Route GET : Récuperer tous les céhicules

router.get(
    "/",
    vehiculeController.getAllVehicules
);
// Route GET : Récuoerer un véhicule par id
router.get(
    "/:id",
    vehiculeController.getVehiculeById
);

// ROUTE PUT : MODIFIER UN VEHICUL
router.put(
    "/:id",
    validate(vehiculeSchema.update),
    vehiculeController.updateVehicule
);

// DELETE
router.delete(
    "/:id",
    vehiculeController.deleteVehicule
);


module.exports = router;