// =====================================================
// SERVICE : CHAUFFEUR
// =====================================================

// Chargement des variables d'environnement
require("dotenv").config();

// Importation de Prisma Client
const { PrismaClient } = require("@prisma/client");

// Importation de l'adaptateur PostgreSQL
const { PrismaPg } = require("@prisma/adapter-pg");

// Importation de bcrypt pour sécuriser le mot de passe
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
// CREATION D'UN CHAUFFEUR
// =====================================================

const createChauffeur = async (data) => {
    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(data.mdp, 10);

    // Création du chauffeur dans la base de données
        const chauffeur = await prisma.chauffeur.create({
        data: {
            nom: data.nom,
            tel: data.tel,
            photo: data.photo,
            email: data.email,
            mdp: hashedPassword,
            genre: data.genre,
            ville: data.ville,
            statut: data.statut,
            idagc: data.idagc
        },

        // Sélection des informations retournées
        // Le mot de passe n'est pas envoyé
        select: {
            idchauffeur: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true
        }
    });

    return chauffeur;
};

// =====================================================
// RECUPERATION DE TOUS LES CHAUFFEURS
// =====================================================

const getAllChauffeurs = async () => {
    // Récupération de tous les chauffeurs
    const chauffeurs = await prisma.chauffeur.findMany({

        // Tri des chauffeurs par identifiant
        orderBy: {
            idchauffeur: "asc"
        },

        // Sélection des informations à retourner
        // Le mot de passe n'est pas envoyé
        select: {
            idchauffeur: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true
        }
    });

    return chauffeurs;
};

// =====================================================
// RECUPERATION D'UN CHAUFFEUR PAR SON IDENTIFIANT
// =====================================================

const getChauffeurById = async (id) => {
    // Recherche du chauffeur par son identifiant
    const chauffeur = await prisma.chauffeur.findUnique({
        where: {
            idchauffeur: id
        },

        // Sélection des informations à retourner
        // Le mot de passe n'est pas envoyé
        select: {
            idchauffeur: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true
        }
    });

    // Vérification de l'existence du chauffeur
    if (!chauffeur) {
        const error = new Error("Chauffeur introuvable");
        error.statusCode = 404;
        throw error;
    }

    return chauffeur;
};

// =====================================================
// MODIFICATION D'UN CHAUFFEUR
// =====================================================

const updateChauffeur = async (id, data) => {

    // Vérification de l'existence du chauffeur
    const existingChauffeur = await prisma.chauffeur.findUnique({
        where: {
            idchauffeur: id
        }
    });

    if (!existingChauffeur) {
        const error = new Error("Chauffeur introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Préparation des données à modifier
    const updateData = {};

    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.tel !== undefined) updateData.tel = data.tel;
    if (data.photo !== undefined) updateData.photo = data.photo;
    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.ville !== undefined) updateData.ville = data.ville;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.idagc !== undefined) updateData.idagc = data.idagc;

    // Vérification de l'unicité de l'adresse email
    if (data.email !== undefined) {

        const emailExiste = await prisma.chauffeur.findFirst({
            where: {
                email: data.email,
                NOT: {
                    idchauffeur: id
                }
            }
        });

        if (emailExiste) {
            const error = new Error(
                "Cette adresse email est déjà utilisée par un autre chauffeur"
            );

            error.statusCode = 409;
            throw error;
        }

        updateData.email = data.email;
    }

    // Hashage du nouveau mot de passe
    if (data.mdp !== undefined) {
        updateData.mdp = await bcrypt.hash(data.mdp, 10);
    }

    // Modification du chauffeur
    const chauffeur = await prisma.chauffeur.update({
        where: {
            idchauffeur: id
        },
        data: updateData,

        // Le mot de passe n'est jamais retourné
        select: {
            idchauffeur: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true
        }
    });

    return chauffeur;
};

// =====================================================
// SUPPRESSION D'UN CHAUFFEUR
// =====================================================

const deleteChauffeur = async (id) => {

    // Vérification de l'existence du chauffeur
    const chauffeur = await prisma.chauffeur.findUnique({
        where: {
            idchauffeur: id
        }
    });

    if (!chauffeur) {
        const error = new Error("Chauffeur introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Suppression du chauffeur
    await prisma.chauffeur.delete({
        where: {
            idchauffeur: id
        }
    });

    return {
        idchauffeur: id
    };
};

// Exportation du service
module.exports = {
    createChauffeur,
    getAllChauffeurs,
    getChauffeurById,
    updateChauffeur,
    deleteChauffeur
};