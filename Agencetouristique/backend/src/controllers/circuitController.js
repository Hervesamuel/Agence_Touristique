
const circuitService = require("../services/circuitService");

// =====================================================
// CREATION D'UN CIRCUIT
// =====================================================

const createCircuit = async (req, res) => {

    try {

        const circuit = await circuitService.createCircuit(req.body);

        res.status(201).json({
            message: "Circuit créé avec succès",
            data: circuit
        });

    } catch (error) {

        // Gestion d'une agence inexistante
        if (error.code === "P2003") {
            return res.status(400).json({
                message: "L'agence indiquée n'existe pas"
            });
        }

        res.status(500).json({
            message: "Erreur lors de la création du circuit",
            error: error.message
        });
    }
};

// =====================================================
// RECUPERATION DE TOUS LES CIRCUITS
// =====================================================

const getAllCircuits = async (req, res) => {

    try {

        const circuits = await circuitService.getAllCircuits();

        res.status(200).json({
            data: circuits
        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération des circuits",
            error: error.message
        });
    }
};

// =====================================================
// RECUPERATION D'UN CIRCUIT
// =====================================================

const getCircuitById = async (req, res) => {

    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du circuit invalide"
            });
        }

        const circuit = await circuitService.getCircuitById(id);

        res.status(200).json({
            data: circuit
        });

    } catch (error) {

        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Erreur lors de la récupération du circuit",
            error: error.message
        });
    }
};

// =====================================================
// MODIFICATION D'UN CIRCUIT
// =====================================================

const updateCircuit = async (req, res) => {

    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du circuit invalide"
            });
        }

        const circuit = await circuitService.updateCircuit(
            id,
            req.body
        );

        res.status(200).json({
            message: "Circuit modifié avec succès",
            data: circuit
        });

    } catch (error) {

        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.statusCode === 400) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Erreur lors de la modification du circuit",
            error: error.message
        });
    }
};

// =====================================================
// SUPPRESSION D'UN CIRCUIT
// =====================================================

const deleteCircuit = async (req, res) => {

    try {

        // Conversion de l'identifiant en nombre
        const id = Number(req.params.id);

        // Vérification de l'identifiant
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Identifiant du circuit invalide"
            });
        }

        const result = await circuitService.deleteCircuit(id);

        res.status(200).json(result);

    } catch (error) {

        if (error.statusCode === 404) {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Erreur lors de la suppression du circuit",
            error: error.message
        });
    }
};

module.exports = {
    createCircuit,
    getAllCircuits,
    getCircuitById,
    updateCircuit,
    deleteCircuit
};