const express = require("express");
const router = express.Router();

const smsController = require("../controllers/smsController");
const authenticateToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Réservé aux agents, comme les cases à cocher de la page Réservations
router.post("/envoyer", authenticateToken, authorizeRoles("AGENT"), smsController.envoyerSms);

module.exports = router;