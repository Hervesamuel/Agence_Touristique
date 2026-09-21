const { z } = require("zod");

const reservationSchema = z.object({

    datevoyage: z.coerce.date({
        error: "La date de voyage est invalide"
    }),

    dateretour: z.coerce.date({
        error: "La date de retour est invalide"
    }),

    lieu: z.string()
        .min(2, "Le lieu doit contenir au moins 2 caractères")
        .max(150, "Le lieu est trop long"),

    idcircuit: z.number()
        .int("L'identifiant du circuit doit être un entier")
        .positive("L'identifiant du circuit doit être positif"),

    idagt: z.number()
        .int("L'identifiant de l'agent doit être un entier")
        .positive("L'identifiant de l'agent doit être positif")
});

const updateReservationSchema = reservationSchema.partial();

module.exports = {
    create: reservationSchema,
    update: updateReservationSchema
};