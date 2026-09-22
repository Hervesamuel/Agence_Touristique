// Importation d'Express
const express = require("express");

// Importation du controller d'authentification
const authController = require("../controllers/authController");

// Importation du middleware de validation
const validate = require("../middlewares/validate");

// Importation du schéma d'authentification
const authSchema = require("../utils/authSchema");

// Création du routeur
const router = express.Router();

// =====================================================
// ROUTE : CONNEXION
// =====================================================

// POST /api/auth/login
router.post(
    "/login",
    validate(authSchema.login),
    authController.login
);

// Exportation du routeur
module.exports = router;