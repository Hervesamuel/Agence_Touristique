
// Importation de Zod
const { z } = require("zod");

// Définition des règles de validation
const agentSchema = z.object({
    nom: z.string()
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(100, "Le nom est trop long"),

    tel: z.string()
        .min(8, "Le numéro de téléphone est invalide")
        .max(20, "Le numéro de téléphone est trop long"),

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
        .positive("L'identifiant de l'agence doit être positif"),

    idresp: z.number()
        .int("L'identifiant du responsable doit être un entier")
        .positive("L'identifiant du responsable doit être positif")
});

const updateAgentSchema = agentSchema.partial();



// Exportation des schémas
module.exports = {
    create: agentSchema,
    update: updateAgentSchema
};
