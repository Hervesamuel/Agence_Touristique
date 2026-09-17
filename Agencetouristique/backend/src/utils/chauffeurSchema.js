// =====================================================
// SCHEMA DE VALIDATION : CHAUFFEUR
// =====================================================

// Importation de Zod
const { z } = require("zod");

// Définition des règles de validation
const chauffeurSchema = z.object({
    nom: z.string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100, "Le nom est trop long"),

    tel: z.string()
        .min(9, "Le numéro de téléphone est invalide")
        .max(14, "Le numéro de téléphone est trop long"),

    photo: z.string().optional(),

    email: z.string()
        .email("L'adresse email est invalide"),

    mdp: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),

    genre: z.string()
        .min(1, "Le genre est obligatoire"),

    ville: z.string()
        .min(2, "La ville doit contenir au moins 2 caractères"),

    statut: z.string()
        .min(1, "Le statut est obligatoire"),

    idagc: z.number()
        .int("L'identifiant de l'agence doit être un entier")
        .positive("L'identifiant de l'agence doit être positif")
});


// Schéma utilisé pour la modification d'un chauffeur
const updateChauffeurSchema = chauffeurSchema.partial();

module.exports = {
    create: chauffeurSchema,
    update: updateChauffeurSchema
};