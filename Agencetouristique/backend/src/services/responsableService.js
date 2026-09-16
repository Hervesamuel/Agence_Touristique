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

// Création d'un responsable
const createResponsable = async (data) => {

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
        }
    });

    return responsable;
};

// Exportation du service
module.exports = {
    createResponsable
};