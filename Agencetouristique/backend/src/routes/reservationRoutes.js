// =====================================================
// ROUTES : RESERVATION
// =====================================================

const express = require("express");

const router = express.Router();

const reservationController = require("../controllers/reservationController");
const validate = require("../middlewares/validate");
const reservationSchema = require("../utils/reservationSchema");

// =====================================================
// POST
// =====================================================

router.post(
    "/",
    validate(reservationSchema.create),
    reservationController.createReservation
);

// =====================================================
// GET ALL
// =====================================================

router.get(
    "/",
    reservationController.getAllReservations
);

// =====================================================
// GET BY ID
// =====================================================

router.get(
    "/:id",
    reservationController.getReservationById
);

// =====================================================
// PUT
// =====================================================

router.put(
    "/:id",
    validate(reservationSchema.update),
    reservationController.updateReservation
);

// =====================================================
// DELETE
// =====================================================

router.delete(
    "/:id",
    reservationController.deleteReservation
);

module.exports = router;