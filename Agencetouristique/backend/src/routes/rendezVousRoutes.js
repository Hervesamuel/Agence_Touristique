// =====================================================
// ROUTES : RENDEZ-VOUS
// =====================================================

const express = require("express");

const router = express.Router();

const rendezVousController =
    require("../controllers/rendezVousController");

const validate = require("../middlewares/validate");

const rendezVousSchema =
    require("../utils/rendezVousSchema");

// =====================================================
// POST
// =====================================================

router.post(
    "/",
    validate(rendezVousSchema.create),
    rendezVousController.createRendezVous
);

// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    rendezVousController.getAllRendezVous
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    rendezVousController.getRendezVousById
);

// =====================================================
// PUT
// =====================================================

router.put(
    "/:id",
    validate(rendezVousSchema.update),
    rendezVousController.updateRendezVous
);

// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    rendezVousController.deleteRendezVous
);

module.exports = router;