const { z } = require("zod");

// Un SMS est limité à 160 caractères (un seul message, sans découpage)
const smsSchema = z.object({
    message: z.string().trim()
        .min(1, "Le message est obligatoire")
        .max(200, "Un SMS est limité à 160 caractères"),
    idsReservations: z.array(z.number().int().positive())
        .min(1, "Sélectionnez au moins une réservation")
        .max(20, "20 réservations maximum par envoi"),
});

module.exports = smsSchema;