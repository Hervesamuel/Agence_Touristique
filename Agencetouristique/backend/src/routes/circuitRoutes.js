// =====================================================
// ROUTES : CIRCUIT
// =====================================================

const express = require("express");

const router = express.Router();

const circuitController = require("../controllers/circuitController");
const validate = require("../middlewares/validate");
const circuitSchema = require("../utils/circuitSchema");

// =====================================================
// POST
// =====================================================

router.post(
    "/",
    validate(circuitSchema.create),
    circuitController.createCircuit
);

// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    circuitController.getAllCircuits
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    circuitController.getCircuitById
);

// =====================================================
// PUT
// =====================================================

router.put(
    "/:id",
    validate(circuitSchema.update),
    circuitController.updateCircuit
);

// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    circuitController.deleteCircuit
);

module.exports = router;