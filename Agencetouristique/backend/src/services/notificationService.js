// =====================================================
// SERVICE : NOTIFICATION
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

// Champs retournés pour une notification
const selectFields = {
    idnot: true,
    message: true,
    date: true,
    reference: true,
    type: true,
    status: true,
    idutilisateur: true
};

// =====================================================
// CREATION D'UNE NOTIFICATION
// =====================================================

const createNotification = async (data) => {
    try {
        return await prisma.notification.create({
            data: {
                message: data.message,
                reference: data.reference,
                type: data.type,
                status: data.status,
                idutilisateur: data.idutilisateur
            },
            select: selectFields
        });
    } catch (error) {

        // Vérification de l'existence de l'utilisateur
        if (error.code === "P2003") {
            const err = new Error(
                "L'utilisateur indiqué n'existe pas"
            );
            err.statusCode = 400;
            throw err;
        }

        throw error;
    }
};

// =====================================================
// RECUPERATION DE TOUTES LES NOTIFICATIONS
// =====================================================

const getAllNotifications = async () => {
    return await prisma.notification.findMany({
        orderBy: { idnot: "asc" },
        select: selectFields
    });
};

// =====================================================
// RECUPERATION D'UNE NOTIFICATION PAR ID
// =====================================================

const getNotificationById = async (id) => {
    const notification = await prisma.notification.findUnique({
        where: { idnot: id },
        select: selectFields
    });

    if (!notification) {
        const error = new Error("Notification introuvable");
        error.statusCode = 404;
        throw error;
    }

    return notification;
};

// =====================================================
// MODIFICATION D'UNE NOTIFICATION
// =====================================================

const updateNotification = async (id, data) => {

    // Vérification de l'existence de la notification
    await getNotificationById(id);

    const updateData = {};

    if (data.message !== undefined) {
        updateData.message = data.message;
    }

    if (data.reference !== undefined) {
        updateData.reference = data.reference;
    }

    if (data.type !== undefined) {
        updateData.type = data.type;
    }

    if (data.status !== undefined) {
        updateData.status = data.status;
    }

    if (data.idutilisateur !== undefined) {
        updateData.idutilisateur = data.idutilisateur;
    }

    try {
        return await prisma.notification.update({
            where: { idnot: id },
            data: updateData,
            select: selectFields
        });
    } catch (error) {

        // Vérification de l'existence du nouvel utilisateur
        if (error.code === "P2003") {
            const err = new Error(
                "L'utilisateur indiqué n'existe pas"
            );
            err.statusCode = 400;
            throw err;
        }

        throw error;
    }
};

// =====================================================
// SUPPRESSION D'UNE NOTIFICATION
// =====================================================

const deleteNotification = async (id) => {

    // Vérification de l'existence de la notification
    await getNotificationById(id);

    await prisma.notification.delete({
        where: { idnot: id }
    });

    return {
        message: "Notification supprimée avec succès"
    };
};

module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
};