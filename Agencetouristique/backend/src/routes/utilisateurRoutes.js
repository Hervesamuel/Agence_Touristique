const express = require("express");
const router = express.Router();

const utilisateurController = require("../controllers/utilisateurController");
const validate = require("../middlewares/validate");
const utilisateurSchema = require("../utils/utilisateurSchema");

// Création d'un utilisateur
router.post(
    "/",
    validate(utilisateurSchema.create),
    utilisateurController.createUtilisateur
);

// Récupération de tous les utilisateurs
router.get(
    "/",
    utilisateurController.getAllUtilisateurs
);

// Récupération d'un utilisateur par son identifiant
router.get(
    "/:id",
    utilisateurController.getUtilisateurById
);

// Modification d'un utilisateur
router.put(
    "/:id",
    validate(utilisateurSchema.update),
    utilisateurController.updateUtilisateur
);

// Suppression d'un utilisateur
router.delete(
    "/:id",
    utilisateurController.deleteUtilisateur
);

module.exports = router;