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
// CREATION D'UN AGENT
// =====================================================

const createAgent = async (data) => {

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
    if (existingResponsable || existingAgent || existingChauffeur) {
        const error = new Error(
            "Cette adresse email est déjà utilisée par un autre compte"
        );

        error.statusCode = 409;
        throw error;
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(data.mdp, 10);

    // Création de l'agent dans la base de données
    const agent = await prisma.agent.create({
        data: {
            nom: data.nom,
            tel: data.tel,
            photo: data.photo,
            email: data.email,
            mdp: hashedPassword,
            genre: data.genre,
            ville: data.ville,
            statut: data.statut,
            idagc: data.idagc,
            idresp: data.idresp
        }
    });

    return agent;
};

// =====================================================
// RECUPERATION D'UN AGENT PAR SON IDENTIFIANT
// =====================================================

const getAgentById = async (id) => {

    // Recherche de l'agent par son identifiant
    const agent = await prisma.agent.findUnique({
        where: {
            idagt: id
        },

        // Sélection des informations à retourner
        // Le mot de passe n'est pas envoyé
        select: {
            idagt: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true,
            idresp: true
        }
    });

    // Vérification de l'existence de l'agent
    if (!agent) {
        const error = new Error("Agent introuvable");
        error.statusCode = 404;
        throw error;
    }

    return agent;
};

// =====================================================
// RECUPERATION DE TOUS LES AGENTS
// =====================================================

const getAllAgents = async () => {
    return await prisma.agent.findMany({
        orderBy: {
            idagt: "asc"
        },
        select: {
            idagt: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true,
            idresp: true
        }
    });
};

// =====================================================
// MODIFICATION D'UN AGENT
// =====================================================

const updateAgent = async (id, data) => {

    // Préparation des données à modifier
    const updateData = {};

    // Vérification de l'email lors d'une modification
    if (data.email !== undefined) {

        // Recherche de l'email dans Responsable
        const existingResponsable = await prisma.responsable.findUnique({
            where: {
                email: data.email
            }
        });

        // Recherche de l'email dans les autres Agents
        const existingAgent = await prisma.agent.findFirst({
            where: {
                email: data.email,
                NOT: {
                    idagt: id
                }
            }
        });

        // Recherche de l'email dans Chauffeur
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

        updateData.email = data.email;
    }

    // Ajout uniquement des champs reçus
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.tel !== undefined) updateData.tel = data.tel;
    if (data.photo !== undefined) updateData.photo = data.photo;
    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.ville !== undefined) updateData.ville = data.ville;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.idagc !== undefined) updateData.idagc = data.idagc;
    if (data.idresp !== undefined) updateData.idresp = data.idresp;

    // Hashage du nouveau mot de passe uniquement
    // lorsqu'un nouveau mot de passe est fourni
    if (data.mdp !== undefined) {
        updateData.mdp = await bcrypt.hash(data.mdp, 10);
    }

    // Modification de l'agent
    const agent = await prisma.agent.update({
        where: {
            idagt: id
        },
        data: updateData,
        select: {
            idagt: true,
            nom: true,
            tel: true,
            photo: true,
            email: true,
            genre: true,
            ville: true,
            statut: true,
            idagc: true,
            idresp: true
        }
    });

    return agent;
};

// =====================================================
// SUPPRESSION D'UN AGENT
// =====================================================

const deleteAgent = async (id) => {

    // Vérification de l'existence de l'agent
    const existingAgent = await prisma.agent.findUnique({
        where: {
            idagt: id
        }
    });

    // Vérification du résultat de la recherche
    if (!existingAgent) {
        const error = new Error("Agent introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Suppression de l'agent
    await prisma.agent.delete({
        where: {
            idagt: id
        }
    });
};

// Exportation du service
module.exports = {
    createAgent,
    getAllAgents,
    updateAgent,
    deleteAgent,
    getAgentById
};