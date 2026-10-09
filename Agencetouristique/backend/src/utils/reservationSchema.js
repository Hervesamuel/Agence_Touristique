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
        // Coordonnées du client
    nomclient: z.string()
        .trim()
        .min(2, "Le nom du client doit contenir au moins 2 caractères")
        .max(100, "Le nom du client est trop long")
        .regex(/^[\p{L}\s'-]+$/u, "Le nom du client contient des caractères invalides"),

    // Mobile malgache : 0341234567 ou +261341234567
    telclient: z.string()
        .regex(/^(\+261|0)3\d{8}$/, "Numéro de téléphone invalide"),

    // Email facultatif (null accepté quand le champ est vide)
    emailclient: z.email("Adresse email invalide")
        .max(100, "L'adresse email est trop longue")
        .nullable()
        .optional(),

    idcircuit: z.number()
        .int("L'identifiant du circuit doit être un entier")
        .positive("L'identifiant du circuit doit être positif"),

        // L'agent est déterminé par le token (le contrôleur le renseigne), pas par le formulaire
    idagt: z.number()
        .int("L'identifiant de l'agent doit être un entier")
        .positive("L'identifiant de l'agent doit être positif")
        .optional()
});

const updateReservationSchema = reservationSchema.partial();

module.exports = {
    create: reservationSchema,
    update: updateReservationSchema
};