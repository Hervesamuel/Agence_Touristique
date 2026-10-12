const { z } = require("zod");

const loginSchema = z.object({

    // Vérification de l'adresse email
    email: z.string()
        .email("L'adresse email est invalide"),

    // Vérification du mot de passe
    mdp: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
});

// Schéma de validation : mot de passe oublié
const forgotPasswordSchema = z.object({
    email: z.string().email("Adresse email invalide")
});

// Exportation du schéma
module.exports = {
    login: loginSchema,
    forgotPasswordSchema
};