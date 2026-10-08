// Importation d'Express
const express = require("express");

// Importation du controller d'authentification
const authController = require("../controllers/authController");

// Importation du middleware de validation
const validate = require("../middlewares/validate");

// Importation du middleware d'authentification JWT
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du schéma de validation d'authentification
const authSchema = require("../utils/authSchema");

// Création du routeur
const router = express.Router();

// =====================================================
// ROUTE : CONNEXION
// =====================================================
// POST /api/auth/login
router.post("/login", validate(authSchema.login), authController.login);

// =====================================================
// ROUTE : RECUPERATION DU PROFIL
// =====================================================
// GET /api/auth/me
router.get("/me", authenticateToken, authController.getProfile);

// =====================================================
// ROUTE : MODIFICATION DU PROFIL
// =====================================================
// PUT /api/auth/profile
router.put("/profile", authenticateToken, authController.updateProfile);

// =====================================================
// ROUTE : MODIFICATION DU MOT DE PASSE
// =====================================================
// PUT /api/auth/password
router.put("/password", authenticateToken, authController.updatePassword);

// =====================================================
// EXPORTATION DU ROUTEUR
// =====================================================
module.exports = router;