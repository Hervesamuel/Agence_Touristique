//Importation d'Express
const express = require("express");

// Création du routeur Express
const router = express.Router();

// Importation du contrôleur Agent
const agentController = require("../controllers/agentController");

// Importation du middleware de validation
const validate = require("../middlewares/validate");

// Importation du schéma de validation Agent
const agentSchemas = require("../utils/agentSchema");

// Route permettant de récuperer toutes les agent
const authenticateToken = require("../middlewares/authMiddleware");
// Route permettant de vérifier le rôle de l'utilisateur 
const authorizeRoles = require("../middlewares/roleMiddleware");

// Route POST : créer un agent
// Accessible uniquement au Responsable
router.post(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(agentSchemas.create),
    agentController.createAgent
);

// Route GET : récupérer un agent par son ID
// Accessible au Responsable et à l'Agent
router.get(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    agentController.getAgentById
);

// Route GET : récupérer tous les agents
// Accessible au Responsable et à l'Agent
router.get(
    "/",
    authenticateToken,
    authorizeRoles("RESPONSABLE", "AGENT"),
    agentController.getAllAgents
);

// Route PUT : modifier un agent
// Accessible uniquement au Responsable
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    validate(agentSchemas.update),
    agentController.updateAgent
);

// Route DELETE : supprimer un agent
// Accessible uniquement au Responsable
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("RESPONSABLE"),
    agentController.deleteAgent
);


// Exportation du routeur
module.exports = router ;