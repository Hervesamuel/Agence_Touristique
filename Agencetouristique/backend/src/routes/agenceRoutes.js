// Importation d'Express
const express = require("express");

// Création du routeur Express
const router = express.Router();

// Importation du contrôleur Agence
const agenceController = require("../controllers/agenceController");

// Route permettant de créer une agence
router.post("/", agenceController.createAgence);



// Exportation du routeur
module.exports = router;