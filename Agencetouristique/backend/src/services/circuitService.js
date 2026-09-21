require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Création de l'instance Prisma
const prisma = new PrismaClient({ adapter });

const selectFields = { idcircuit: true, nom: true, description: true, destination: true, capacite: true, photo: true, status: true, idagc: true };

// =====================================================// CREATION D'UN CIRCUIT// =====================================================
const createCircuit = async (data) => {
    return await prisma.circuit.create({
        data: { nom: data.nom, description: data.description, destination: data.destination, capacite: data.capacite, photo: data.photo, status: data.status, idagc: data.idagc },
        select: selectFields
    });
};

// =====================================================// RECUPERATION DE TOUS LES CIRCUITS// =====================================================
const getAllCircuits = async () => {
    return await prisma.circuit.findMany({ orderBy: { idcircuit: "asc" }, select: selectFields });
};

// =====================================================// RECUPERATION D'UN CIRCUIT PAR SON IDENTIFIANT// =====================================================
const getCircuitById = async (id) => {
    const circuit = await prisma.circuit.findUnique({ where: { idcircuit: id }, select: selectFields });
    if (!circuit) { const error = new Error("Circuit introuvable"); error.statusCode = 404; throw error; }
    return circuit;
};

// =====================================================// MODIFICATION D'UN CIRCUIT// =====================================================
const updateCircuit = async (id, data) => {
    // Vérification de l'existence du circuit
    const existingCircuit = await prisma.circuit.findUnique({ where: { idcircuit: id } });
    if (!existingCircuit) { const error = new Error("Circuit introuvable"); error.statusCode = 404; throw error; }

    // Préparation des données à modifier
    const updateData = {};
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.destination !== undefined) updateData.destination = data.destination;
    if (data.capacite !== undefined) updateData.capacite = data.capacite;
    if (data.photo !== undefined) updateData.photo = data.photo;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.idagc !== undefined) updateData.idagc = data.idagc;

    try {
        return await prisma.circuit.update({ where: { idcircuit: id }, data: updateData, select: selectFields });
    } catch (error) {
        // Gestion d'une agence inexistante
        if (error.code === "P2003") { const err = new Error("L'agence indiquée n'existe pas"); err.statusCode = 400; throw err; }
        throw error;
    }
};

// =====================================================// SUPPRESSION D'UN CIRCUIT// =====================================================
const deleteCircuit = async (id) => {
    // Vérification de l'existence du circuit
    const existingCircuit = await prisma.circuit.findUnique({ where: { idcircuit: id } });
    if (!existingCircuit) { const error = new Error("Circuit introuvable"); error.statusCode = 404; throw error; }

    // Suppression du circuit
    await prisma.circuit.delete({ where: { idcircuit: id } });
    return { message: "Circuit supprimé avec succès" };
};

module.exports = { createCircuit, getAllCircuits, getCircuitById, updateCircuit, deleteCircuit };