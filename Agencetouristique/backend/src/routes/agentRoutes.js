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

// Route POST : créer un agent
router.post(
    "/",
    validate(agentSchemas.create),
    agentController.createAgent
);
//  Route GET : Récuperer un agent par id

router.get(
    "/:id",
    agentController.getAgentById
);

// Route GET : récupérer tous les agents
router.get(
    "/",
    agentController.getAllAgents
);

// Route PUT : modifier un agent
router.put(
    "/:id",
    validate(agentSchemas.update),
    agentController.updateAgent
);

//Route DELETE : Supprimer un agent
router.delete(
    "/:id",
    agentController.deleteAgent
);

// Exportation du routeur
module.exports = router ;