// Importation d'Express
const express = require("express");

// Création du routeur Express
const router = express.Router();

// Importation du contrôleur Responsable
const responsableController = require("../controllers/responsableController");

// Route permettant de créer un responsable
router.post("/", responsableController.createResponsable);

const authenticateToken = require("../middlewares/authMiddleware");

// Route permettant de créer un responsable
router.post("/", responsableController.createResponsable);

// Route permettant de récupérer mon propre profil
router.get("/me", authenticateToken, responsableController.getMonProfil);

// Route permettant de modifier mon propre profil
router.put("/me", authenticateToken, responsableController.updateMonProfil);

// Route permettant de changer mon mot de passe
router.put("/me/mot-de-passe", authenticateToken, responsableController.changerMotDePasse);



// Exportation du routeur
module.exports = router;