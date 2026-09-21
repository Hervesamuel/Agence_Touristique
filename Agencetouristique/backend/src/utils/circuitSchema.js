const { z } = require("zod");

const circuitSchema = z.object({

    nom: z.string()
        .min(2, "Le nom du circuit doit contenir au moins 2 caractères")
        .max(100, "Le nom du circuit est trop long"),

    description: z.string()
        .optional(),

    destination: z.string()
        .min(2, "La destination doit contenir au moins 2 caractères")
        .max(100, "La destination est trop longue"),

    capacite: z.number()
        .int("La capacité doit être un nombre entier")
        .positive("La capacité doit être supérieure à 0"),

    photo: z.string()
        .optional(),

    status: z.string()
        .min(1, "Le statut est obligatoire"),

    idagc: z.number()
        .int("L'identifiant de l'agence doit être un entier")
        .positive("L'identifiant de l'agence doit être positif")
});

// Schema utilisé pour la modification
const updateCircuitSchema = circuitSchema.partial();

module.exports = {
    create: circuitSchema,
    update: updateCircuitSchema
};