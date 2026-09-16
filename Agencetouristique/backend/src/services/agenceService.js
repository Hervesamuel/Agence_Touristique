// =====================================================
// SERVICE : AGENCE
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

// Création d'une agence
const createAgence = async (data) => {
    const agence = await prisma.agence.create({
        data: {
            nom: data.nom,
            tel: data.tel,
            logo: data.logo,
            email: data.email,
            mdp: data.mdp,
            description: data.description,
            idresp: data.idresp
        }
    });

    return agence;
};

// Exportation du service
module.exports = {
    createAgence
};