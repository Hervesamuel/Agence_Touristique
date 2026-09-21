const { z } = require("zod");

// =====================================================
// SCHEMA : RECU
// =====================================================

const recuSchema = z.object({
    description: z.string()
        .min(2, "La description doit contenir au moins 2 caractères")
        .max(255, "La description est trop longue"),

    heure: z.coerce.date({
        error: "L'heure du reçu est invalide"
    }),

    idres: z.number()
        .int("L'identifiant de la réservation doit être un entier")
        .positive("L'identifiant de la réservation doit être positif")
});

// Schéma utilisé lors de la modification
const updateRecuSchema = recuSchema.partial();

module.exports = {
    create: recuSchema,
    update: updateRecuSchema
};