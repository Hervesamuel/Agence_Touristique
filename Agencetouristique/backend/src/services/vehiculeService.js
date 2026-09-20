
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

// =====================================================
// CREATION D'UN VEHICULE
// =====================================================

const createVehicule = async (data) => {

    // Création du véhicule dans la base de données
    const vehicule = await prisma.vehicule.create({
        data: {
            immatriculation: data.immatriculation,
            marque: data.marque,
            modele: data.modele,
            capacite: data.capacite,
            photo: data.photo,
            status: data.status,
            idchauffeur: data.idchauffeur,
            idagc: data.idagc
        },

        // Sélection des informations retournées
        select: {
            idveh: true,
            immatriculation: true,
            marque: true,
            modele: true,
            capacite: true,
            photo: true,
            status: true,
            idchauffeur: true,
            idagc: true
        }
    });

    return vehicule;
};


module.exports = {
    createVehicule
};