const { z } = require("zod");

const responsableSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom est trop long"),
    tel: z.string().min(10, "Le numéro de téléphone est invalide").max(20, "Le numéro de téléphone est trop long"),
    photo: z.string().optional(),
    email: z.string().email("L'adresse email est invalide"),
    mdp: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    genre: z.string().min(1, "Le genre est obligatoire"),
    ville: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
});

// Schéma pour la mise à jour du profil : tous les champs optionnels
const updateResponsableSchema = responsableSchema.partial();

module.exports = {
    create: responsableSchema,
    update: updateResponsableSchema,
};