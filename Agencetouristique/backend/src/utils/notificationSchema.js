const { z } = require("zod");

const notificationSchema = z.object({
    message: z.string()
        .min(2, "Le message doit contenir au moins 2 caractères")
        .max(255, "Le message est trop long"),

    reference: z.string()
        .min(1, "La référence est obligatoire")
        .max(100, "La référence est trop longue"),

    type: z.string()
        .min(1, "Le type de notification est obligatoire")
        .max(50, "Le type est trop long"),

    status: z.string()
        .min(1, "Le statut est obligatoire")
        .max(50, "Le statut est trop long"),

    idutilisateur: z.number()
        .int("L'identifiant de l'utilisateur doit être un entier")
        .positive("L'identifiant de l'utilisateur doit être positif")
});

const updateNotificationSchema = notificationSchema.partial();

module.exports = {
    create: notificationSchema,
    update: updateNotificationSchema
};