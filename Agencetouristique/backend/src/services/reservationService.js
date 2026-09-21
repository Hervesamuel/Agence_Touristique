// =====================================================// SERVICE : RESERVATION// =====================================================
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Création de l'instance Prisma
const prisma = new PrismaClient({ adapter });

const selectFields = { idres: true, datereservation: true, datevoyage: true, dateretour: true, lieu: true, idcircuit: true, idagt: true };

// =====================================================// CREATION D'UNE RESERVATION// =====================================================
const createReservation = async (data) => {
    try {
        return await prisma.reservation.create({
            data: { datevoyage: data.datevoyage, dateretour: data.dateretour, lieu: data.lieu, idcircuit: data.idcircuit, idagt: data.idagt },
            select: selectFields
        });
    } catch (error) {
        // Vérification des clés étrangères
        if (error.code === "P2003") {
            const err = new Error("Le circuit ou l'agent indiqué n'existe pas");
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
};

// =====================================================// RECUPERATION DE TOUTES LES RESERVATIONS// =====================================================
const getAllReservations = async () => {
    return await prisma.reservation.findMany({ orderBy: { idres: "asc" }, select: selectFields });
};

// =====================================================// RECUPERATION D'UNE RESERVATION PAR SON IDENTIFIANT// =====================================================
const getReservationById = async (id) => {
    const reservation = await prisma.reservation.findUnique({ where: { idres: id }, select: selectFields });
    if (!reservation) {
        const error = new Error("Réservation introuvable");
        error.statusCode = 404;
        throw error;
    }
    return reservation;
};

// =====================================================// MODIFICATION D'UNE RESERVATION// =====================================================
const updateReservation = async (id, data) => {
    // Vérification de l'existence de la réservation
    const existingReservation = await prisma.reservation.findUnique({ where: { idres: id } });
    if (!existingReservation) {
        const error = new Error("Réservation introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Préparation des données à modifier
    const updateData = {};
    if (data.datevoyage !== undefined) updateData.datevoyage = data.datevoyage;
    if (data.dateretour !== undefined) updateData.dateretour = data.dateretour;
    if (data.lieu !== undefined) updateData.lieu = data.lieu;
    if (data.idcircuit !== undefined) updateData.idcircuit = data.idcircuit;
    if (data.idagt !== undefined) updateData.idagt = data.idagt;

    try {
        return await prisma.reservation.update({ where: { idres: id }, data: updateData, select: selectFields });
    } catch (error) {
        if (error.code === "P2003") {
            const err = new Error("Le circuit ou l'agent indiqué n'existe pas");
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
};

// =====================================================// SUPPRESSION D'UNE RESERVATION// =====================================================
const deleteReservation = async (id) => {
    // Vérification de l'existence de la réservation
    const existingReservation = await prisma.reservation.findUnique({ where: { idres: id } });
    if (!existingReservation) {
        const error = new Error("Réservation introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Suppression de la réservation
    try {
        await prisma.reservation.delete({ where: { idres: id } });
    } catch (error) {
        // Une réservation peut être liée à un reçu
        if (error.code === "P2003") {
            const err = new Error("Cette réservation possède un reçu et ne peut pas être supprimée");
            err.statusCode = 409;
            throw err;
        }
        throw error;
    }

    return { message: "Réservation supprimée avec succès" };
};

module.exports = { createReservation, getAllReservations, getReservationById, updateReservation, deleteReservation };