// =====================================================
// SERVICE : NOTIFICATIONS
// =====================================================
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const selectFields = { idnotif: true, message: true, type: true, action: true, reference: true, date: true,
                       iddestinataire: true, roleDestinataire: true, idagc: true, lue: true };

// =====================================================
// DIFFUSION D'UNE NOTIFICATION A TOUTE L'AGENCE
// =====================================================
const notifierAgence = async ({ idagc, type, action, reference, message }) => {
    try {
        // Récupération de tous les destinataires de l'agence
        const [agence, agents, chauffeurs] = await Promise.all([
            prisma.agence.findUnique({
                where: { idagc },
                select: { idresp: true },
            }),
            prisma.agent.findMany({
                where: { idagc },
                select: { idagt: true },
            }),
            prisma.chauffeur.findMany({
                where: { idagc },
                select: { idchauffeur: true },
            }),
        ]);

        // Construction de la liste des destinataires
        const destinataires = [];

        if (agence?.idresp) {
            destinataires.push({ id: agence.idresp, role: "RESPONSABLE" });
        }
        agents.forEach((a) => destinataires.push({ id: a.idagt, role: "AGENT" }));
        chauffeurs.forEach((c) => destinataires.push({ id: c.idchauffeur, role: "CHAUFFEUR" }));

        // Création en masse des notifications (une par destinataire)
        if (destinataires.length === 0) return;

        await prisma.notifications.createMany({
            data: destinataires.map((dest) => ({
                message,
                type,
                action,
                reference: reference || null,
                idagc,
                iddestinataire: dest.id,
                roleDestinataire: dest.role,
            })),
        });
    } catch (error) {
        // Une notification ratée ne doit jamais faire échouer l'action principale
        console.error("Erreur lors de la diffusion des notifications :", error.message);
    }
};

// =====================================================
// RECUPERATION DES NOTIFICATIONS D'UN UTILISATEUR
// =====================================================
const getNotificationsUtilisateur = async (iddestinataire, roleDestinataire) => {
    return await prisma.notifications.findMany({
        where: { iddestinataire, roleDestinataire },
        orderBy: { date: "desc" },
        select: selectFields,
    });
};

// =====================================================
// COMPTAGE DES NOTIFICATIONS NON LUES
// =====================================================
const getNombreNonLues = async (iddestinataire, roleDestinataire) => {
    return await prisma.notifications.count({
        where: { iddestinataire, roleDestinataire, lue: false },
    });
};

// =====================================================
// MARQUER UNE NOTIFICATION COMME LUE
// =====================================================
const marquerCommeLue = async (idnotif) => {
    const existing = await prisma.notifications.findUnique({ where: { idnotif } });
    if (!existing) {
        const error = new Error("Notification introuvable");
        error.statusCode = 404;
        throw error;
    }

    return await prisma.notifications.update({
        where: { idnotif },
        data: { lue: true },
        select: selectFields,
    });
};

// =====================================================
// MARQUER TOUTES LES NOTIFICATIONS COMME LUES
// =====================================================
const marquerToutesCommeLues = async (iddestinataire, roleDestinataire) => {
    await prisma.notifications.updateMany({
        where: { iddestinataire, roleDestinataire, lue: false },
        data: { lue: true },
    });
    return { message: "Notifications marquées comme lues" };
};

// =====================================================
// SUPPRESSION D'UNE NOTIFICATION
// =====================================================
const deleteNotification = async (idnotif) => {
    const existing = await prisma.notifications.findUnique({ where: { idnotif } });
    if (!existing) {
        const error = new Error("Notification introuvable");
        error.statusCode = 404;
        throw error;
    }

    await prisma.notifications.delete({ where: { idnotif } });
    return { message: "Notification supprimée" };
};

module.exports = {
    notifierAgence,
    getNotificationsUtilisateur,
    getNombreNonLues,
    marquerCommeLue,
    marquerToutesCommeLues,
    deleteNotification,
};