const express = require("express");
const router = express.Router();
const profilController = require("../controllers/profilController");
const authenticateToken = require("../middlewares/authMiddleware");

// Accessible aux trois rôles : chacun n'atteint que son propre compte (identifié par le token)
router.get("/me", authenticateToken, profilController.getMonProfil);
router.put("/me", authenticateToken, profilController.updateMonProfil);
router.put("/me/mot-de-passe", authenticateToken, profilController.changerMotDePasse);

module.exports = router;