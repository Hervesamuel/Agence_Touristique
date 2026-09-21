// =====================================================// SERVICE : RENDEZ-VOUS// =====================================================
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Création de l'instance Prisma
const prisma = new PrismaClient({ adapter });

const selectFields = { idrdv: true, date: true, heure: true, motif: true, statut: true, commentaire: true, idagt: true };

// =====================================================// CREATION D'UN RENDEZ-VOUS// =====================================================
const createRendezVous = async (data) => {
    try {
        return await prisma.rendezVous.create({
            data: { date: data.date, heure: data.heure, motif: data.motif, statut: data.statut, commentaire: data.commentaire, idagt: data.idagt },
            select: selectFields
        });
    } catch (error) {
        // Vérification de l'existence de l'agent
        if (error.code === "P2003") {
            const err = new Error("L'agent indiqué n'existe pas");
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
};

// =====================================================// RECUPERATION DE TOUS LES RENDEZ-VOUS// =====================================================
const getAllRendezVous = async () => {
    return await prisma.rendezVous.findMany({ orderBy: { idrdv: "asc" }, select: selectFields });
};

// =====================================================// RECUPERATION D'UN RENDEZ-VOUS PAR SON IDENTIFIANT// =====================================================
const getRendezVousById = async (id) => {
    const rendezVous = await prisma.rendezVous.findUnique({ where: { idrdv: id }, select: selectFields });
    if (!rendezVous) {
        const error = new Error("Rendez-vous introuvable");
        error.statusCode = 404;
        throw error;
    }
    return rendezVous;
};

// =====================================================// MODIFICATION D'UN RENDEZ-VOUS// =====================================================
const updateRendezVous = async (id, data) => {
    // Vérification de l'existence du rendez-vous
    const existingRendezVous = await prisma.rendezVous.findUnique({ where: { idrdv: id } });
    if (!existingRendezVous) {
        const error = new Error("Rendez-vous introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Préparation des données à modifier
    const updateData = {};
    if (data.date !== undefined) updateData.date = data.date;
    if (data.heure !== undefined) updateData.heure = data.heure;
    if (data.motif !== undefined) updateData.motif = data.motif;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.commentaire !== undefined) updateData.commentaire = data.commentaire;
    if (data.idagt !== undefined) updateData.idagt = data.idagt;

    try {
        return await prisma.rendezVous.update({ where: { idrdv: id }, data: updateData, select: selectFields });
    } catch (error) {
        if (error.code === "P2003") {
            const err = new Error("L'agent indiqué n'existe pas");
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
};

// =====================================================// SUPPRESSION D'UN RENDEZ-VOUS// =====================================================
const deleteRendezVous = async (id) => {
    // Vérification de l'existence du rendez-vous
    const existingRendezVous = await prisma.rendezVous.findUnique({ where: { idrdv: id } });
    if (!existingRendezVous) {
        const error = new Error("Rendez-vous introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Suppression du rendez-vous
    await prisma.rendezVous.delete({ where: { idrdv: id } });
    return { message: "Rendez-vous supprimé avec succès" };
};

module.exports = { createRendezVous, getAllRendezVous, getRendezVousById, updateRendezVous, deleteRendezVous };