// =====================================================
// SERVICE : RECU
// =====================================================

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

// Création de l'instance Prisma
const prisma = new PrismaClient({ adapter });

// Champs retournés pour un reçu
const selectFields = {
    idrec: true,
    description: true,
    daterecu: true,
    heure: true,
    idres: true
};

// =====================================================
// CREATION D'UN RECU
// =====================================================

const createRecu = async (data) => {
    try {
        return await prisma.recu.create({
            data: {
                description: data.description,
                heure: data.heure,
                idres: data.idres
            },
            select: selectFields
        });
    } catch (error) {

        // Vérification de l'existence de la réservation
        if (error.code === "P2003") {
            const err = new Error(
                "La réservation indiquée n'existe pas"
            );
            err.statusCode = 400;
            throw err;
        }

        // Une réservation ne peut avoir qu'un seul reçu
        if (error.code === "P2002") {
            const err = new Error(
                "Cette réservation possède déjà un reçu"
            );
            err.statusCode = 409;
            throw err;
        }

        throw error;
    }
};

// =====================================================
// RECUPERATION DE TOUS LES RECUS
// =====================================================

const getAllRecus = async () => {
    return await prisma.recu.findMany({
        orderBy: {
            idrec: "asc"
        },
        select: selectFields
    });
};

// =====================================================
// RECUPERATION D'UN RECU PAR SON IDENTIFIANT
// =====================================================

const getRecuById = async (id) => {

    const recu = await prisma.recu.findUnique({
        where: {
            idrec: id
        },
        select: selectFields
    });

    if (!recu) {
        const error = new Error("Reçu introuvable");
        error.statusCode = 404;
        throw error;
    }

    return recu;
};

// =====================================================
// MODIFICATION D'UN RECU
// =====================================================

const updateRecu = async (id, data) => {

    // Vérification de l'existence du reçu
    await getRecuById(id);

    // Préparation des données à modifier
    const updateData = {};

    if (data.description !== undefined) {
        updateData.description = data.description;
    }

    if (data.heure !== undefined) {
        updateData.heure = data.heure;
    }

    if (data.idres !== undefined) {
        updateData.idres = data.idres;
    }

    try {
        return await prisma.recu.update({
            where: {
                idrec: id
            },
            data: updateData,
            select: selectFields
        });
    } catch (error) {

        // Vérification de l'existence de la réservation
        if (error.code === "P2003") {
            const err = new Error(
                "La réservation indiquée n'existe pas"
            );
            err.statusCode = 400;
            throw err;
        }

        // Vérification de l'unicité de la réservation
        if (error.code === "P2002") {
            const err = new Error(
                "Cette réservation possède déjà un reçu"
            );
            err.statusCode = 409;
            throw err;
        }

        throw error;
    }
};

// =====================================================
// SUPPRESSION D'UN RECU
// =====================================================

const deleteRecu = async (id) => {

    // Vérification de l'existence du reçu
    await getRecuById(id);

    // Suppression du reçu
    await prisma.recu.delete({
        where: {
            idrec: id
        }
    });

    return {
        message: "Reçu supprimé avec succès"
    };
};

module.exports = {
    createRecu,
    getAllRecus,
    getRecuById,
    updateRecu,
    deleteRecu
};