const { z } = require("zod");

// Seuls ces champs sont modifiables par l'utilisateur sur son propre compte.
// Zod ignore les autres (statut, idagc...) : un agent ne peut pas se réactiver ni changer d'agence.
const updateProfilSchema = z.object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom est trop long"),
    tel: z.string().min(8, "Le numéro de téléphone est invalide").max(20, "Le numéro de téléphone est trop long"),
    photo: z.string(),
    email: z.string().email("L'adresse email est invalide"),
    genre: z.string().min(1, "Le genre est obligatoire"),
    ville: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
}).partial();

const changerMdpSchema = z.object({
    mdpActuel: z.string().min(1, "Le mot de passe actuel est obligatoire"),
    mdpNouveau: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
});

module.exports = { update: updateProfilSchema, changerMdp: changerMdpSchema };