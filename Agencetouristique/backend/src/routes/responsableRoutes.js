// Importation d'Express
const express = require("express");

// Création du routeur Express
const router = express.Router();

// Importation du contrôleur Responsable
const responsableController = require("../controllers/responsableController");

// Route permettant de créer un responsable
router.post("/", responsableController.createResponsable);

// Exportation du routeur
module.exports = router;