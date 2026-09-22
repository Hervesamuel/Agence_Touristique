const express = require("express");
const router = express.Router();

const utilisateurController = require("../controllers/utilisateurController");
const validate = require("../middlewares/validate");
const utilisateurSchema = require("../utils/utilisateurSchema");

// Importation du middleware d'authentification
const authenticateToken = require("../middlewares/authMiddleware");

// Importation du middleware d'autorisation par rôle
const authorizeRoles = require("../middlewares/roleMiddleware");


// Création d'un utilisateur
// Accessible uniquement au Responsable
router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(utilisateurSchema.create),
    utilisateurController.createUtilisateur
);

// Récupération de tous les utilisateurs
// Accessible uniquement au Responsable
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    utilisateurController.getAllUtilisateurs
);

// Récupération d'un utilisateur par son identifiant
// Accessible uniquement au Responsable
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    utilisateurController.getUtilisateurById
);

// Modification d'un utilisateur
// Accessible uniquement au Responsable
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(utilisateurSchema.update),
    utilisateurController.updateUtilisateur
);

// Suppression d'un utilisateur
// Accessible uniquement au Responsable
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    utilisateurController.deleteUtilisateur
);

module.exports = router;