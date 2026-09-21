const express = require("express");
const router = express.Router();

const recuController = require("../controllers/recuController");
const validate = require("../middlewares/validate");
const recuSchema = require("../utils/recuSchema");

// Création d'un reçu
router.post(
    "/",
    validate(recuSchema.create),
    recuController.createRecu
);

// Récupération de tous les reçus
router.get(
    "/",
    recuController.getAllRecus
);

// Récupération d'un reçu par son identifiant
router.get(
    "/:id",
    recuController.getRecuById
);

// Modification d'un reçu
router.put(
    "/:id",
    validate(recuSchema.update),
    recuController.updateRecu
);

// Suppression d'un reçu
router.delete(
    "/:id",
    recuController.deleteRecu
);

module.exports = router;