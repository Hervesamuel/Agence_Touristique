// =====================================================
// SCHEMA DE VALIDATION : VEHICULE
// =====================================================

// Importation de Zod
const { z } = require("zod");

// Définition des règles de validation
const vehiculeSchema = z.object({

    // Informations générales du véhicule
    immatriculation: z.string()
        .min(3, "L'immatriculation doit contenir au moins 3 caractères")
        .max(20, "L'immatriculation est trop longue"),

    marque: z.string()
        .min(2, "La marque doit contenir au moins 2 caractères")
        .max(50, "La marque est trop longue"),

    modele: z.string()
        .min(2, "Le modèle doit contenir au moins 2 caractères")
        .max(50, "Le modèle est trop long"),

    // Capacité du véhicule
    capacite: z.number()
        .int("La capacité doit être un nombre entier")
        .positive("La capacité doit être supérieure à 0"),

    // Photo facultative
    photo: z.string().optional(),

    // Statut du véhicule
    status: z.string()
        .min(1, "Le statut est obligatoire"),

    // Chauffeur facultatif
    idchauffeur: z.number()
        .int("L'identifiant du chauffeur doit être un entier")
        .positive("L'identifiant du chauffeur doit être positif")
        .optional(),

    // Agence propriétaire du véhicule
    idagc: z.number()
        .int("L'identifiant de l'agence doit être un entier")
        .positive("L'identifiant de l'agence doit être positif")
});

// Schéma utilisé pour la modification
const updateVehiculeSchema = vehiculeSchema.partial();

// Exportation des schémas
module.exports = {
    create: vehiculeSchema,
    update: updateVehiculeSchema
};