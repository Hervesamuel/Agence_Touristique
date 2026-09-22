// Chargement des variables d'environnement
require("dotenv").config();

// Importation de Prisma Client
const { PrismaClient } = require("@prisma/client");

// Importation de l'adaptateur PostgreSQL
const { PrismaPg } = require("@prisma/adapter-pg");

// Importation de bcrypt pour sécuriser les mots de passe
const bcrypt = require("bcrypt");

// Création de l'adaptateur PostgreSQL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

// Création de l'instance Prisma Client
const prisma = new PrismaClient({
    adapter
});

// =====================================================
// CREATION D'UN RESPONSABLE
// =====================================================

const createResponsable = async (data) => {

    // Vérification de l'utilisation de l'email dans les comptes
    const existingResponsable = await prisma.responsable.findUnique({
        where: {
            email: data.email
        }
    });

    const existingAgent = await prisma.agent.findUnique({
        where: {
            email: data.email
        }
    });

    const existingChauffeur = await prisma.chauffeur.findUnique({
        where: {
            email: data.email
        }
    });

    // Vérification de l'unicité globale de l'email
    if (
        existingResponsable ||
        existingAgent ||
        existingChauffeur
    ) {
        const error = new Error(
            "Cette adresse email est déjà utilisée par un autre compte"
        );

        error.statusCode = 409;
        throw error;
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(data.mdp, 10);

    // Création du responsable dans la base de données
    const responsable = await prisma.responsable.create({
        data: {
            nom: data.nom,
            tel: data.tel,
            photo: data.photo,
            email: data.email,
            mdp: hashedPassword,
            genre: data.genre,
            ville: data.ville
        },

        // Sélection des informations retournées
        // Le mot de passe n'est pas envoyé
        select: {
            idresp: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true
        }
    });

    return responsable;
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================

module.exports = {
    createResponsable
};