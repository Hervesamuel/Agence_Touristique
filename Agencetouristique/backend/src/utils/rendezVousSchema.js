const { z } = require("zod");

const rendezVousSchema = z.object({

    date: z.coerce.date({
        error: "La date du rendez-vous est invalide"
    }),

    heure: z.coerce.date({
        error: "L'heure du rendez-vous est invalide"
    }),

    motif: z.string()
        .min(2, "Le motif doit contenir au moins 2 caractères")
        .max(150, "Le motif est trop long"),

    statut: z.string()
        .min(1, "Le statut est obligatoire"),

    commentaire: z.string()
        .optional(),

    idagt: z.number()
        .int("L'identifiant de l'agent doit être un entier")
        .positive("L'identifiant de l'agent doit être positif")
});

const updateRendezVousSchema = rendezVousSchema.partial();

module.exports = {
    create: rendezVousSchema,
    update: updateRendezVousSchema
};