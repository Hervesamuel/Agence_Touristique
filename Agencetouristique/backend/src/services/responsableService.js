// =====================================================
// SERVICE : RESPONSABLE
// =====================================================

// Chargement des variables d'environnement
require("dotenv").config();

// Importation de Prisma Client
const { PrismaClient } = require("@prisma/client");

// Importation de l'adaptateur PostgreSQL
const { PrismaPg } = require("@prisma/adapter-pg");

// Création de l'adaptateur PostgreSQL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

// Création de l'instance Prisma Client
const prisma = new PrismaClient({
    adapter
});

// Création d'un responsable
const createResponsable = async (data) => {
    const responsable = await prisma.responsable.create({
        data: {
            nom: data.nom,
            tel: data.tel,
            photo: data.photo,
            email: data.email,
            mdp: data.mdp,
            genre: data.genre,
            ville: data.ville
        }
    });

    return responsable;
};

// Exportation du service
module.exports = {
    createResponsable
};