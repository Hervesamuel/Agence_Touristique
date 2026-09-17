const agentService = require("../services/agentService");

// Création d'un agent
const createAgent = async (req, res) => {
    try {

        // Envoi des données validées au service
        const agent = await agentService.createAgent(req.body);

        res.status(201).json({
            message: "Agent créé avec succès",
            data: agent
        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la création de l'agent",
            error: error.message
        });
    }
};

// =====================================================
// RECUPERATION D'UN AGENT PAR SON IDENTIFIANT
// =====================================================

const getAgentById = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant de l'agent invalide"
            });
        }

        // Récupération de l'agent
        const agent = await agentService.getAgentById(id);

        res.status(200).json({
            message: "Agent récupéré avec succès",
            data: agent
        });

    } catch (error) {
        // Gestion d'un agent inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Gestion des autres erreurs
        res.status(500).json({
            message: "Erreur lors de la récupération de l'agent",
            error: error.message
        });
    }
};


// =====================================================
// RECUPERATION DE TOUS LES AGENTS
// =====================================================

const getAllAgents = async (req, res) => {
    try {
        // Récupération de tous les agents
        const agents = await agentService.getAllAgents();

        res.status(200).json({
            message: "Liste des agents récupérée avec succès",
            data: agents
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des agents",
            error: error.message
        });
    }
};


// =====================================================
// MODIFICATION D'UN AGENT
// =====================================================

const updateAgent = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Modification de l'agent
        const agent = await agentService.updateAgent(id, req.body);

        res.status(200).json({
            message: "Agent modifié avec succès",
            data: agent
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la modification de l'agent",
            error: error.message
        });
    }
};

// =====================================================
// SUPPRESSION D'UN AGENT
// =====================================================

const deleteAgent = async (req, res) => {
    try {
        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant de l'agent invalide"
            });
        }

        // Suppression de l'agent
        await agentService.deleteAgent(id);

        res.status(200).json({
            message: "Agent supprimé avec succès"
        });

    } catch (error) {
        // Gestion d'un agent inexistant
        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        // Gestion des autres erreurs
        res.status(500).json({
            message: "Erreur lors de la suppression de l'agent",
            error: error.message
        });
    }
};


// Exportation du contrôleur
module.exports = {
    createAgent,
    getAgentById,
    getAllAgents,
    updateAgent,
    deleteAgent
    
};