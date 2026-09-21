
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

// =====================================================
// RECUPERATION DE TOUS LES VEHICULES
// =====================================================

const getAllVehicules = async () => {

    // Récupération de tous les véhicules
    const vehicules = await prisma.vehicule.findMany({
        orderBy: {
            idveh: "asc"
        },
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

    return vehicules;
};

// =====================================================
// RECUPERATION D'UN VEHICULE PAR SON IDENTIFIANT
// =====================================================

const getVehiculeById = async (id) => {

    // Recherche du véhicule par son identifiant
    const vehicule = await prisma.vehicule.findUnique({
        where: {
            idveh: id
        },
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

    // Vérification de l'existence du véhicule
    if (!vehicule) {
        const error = new Error("Véhicule introuvable");
        error.statusCode = 404;
        throw error;
    }

    return vehicule;
};

// =====================================================
// MODIFICATION D'UN VEHICULE
// =====================================================

const updateVehicule = async (id, data) => {

    // Vérification de l'existence du véhicule
    const existingVehicule = await prisma.vehicule.findUnique({
        where: {
            idveh: id
        }
    });

    if (!existingVehicule) {
        const error = new Error("Véhicule introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Préparation des données à modifier
    const updateData = {};

    if (data.immatriculation !== undefined) {
        updateData.immatriculation = data.immatriculation;
    }

    if (data.marque !== undefined) {
        updateData.marque = data.marque;
    }

    if (data.modele !== undefined) {
        updateData.modele = data.modele;
    }

    if (data.capacite !== undefined) {
        updateData.capacite = data.capacite;
    }

    if (data.photo !== undefined) {
        updateData.photo = data.photo;
    }

    if (data.status !== undefined) {
        updateData.status = data.status;
    }

    if (data.idchauffeur !== undefined) {
        updateData.idchauffeur = data.idchauffeur;
    }

    if (data.idagc !== undefined) {
        updateData.idagc = data.idagc;
    }

    // Modification du véhicule
    try {

        const vehicule = await prisma.vehicule.update({
            where: {
                idveh: id
            },
            data: updateData,
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

    } catch (error) {

        // Immatriculation ou chauffeur déjà utilisé
        if (error.code === "P2002") {

            const target = error.meta?.target;

            if (target?.includes("immatriculation")) {
                const err = new Error(
                    "Cette immatriculation est déjà utilisée"
                );
                err.statusCode = 409;
                throw err;
            }

            if (target?.includes("idchauffeur")) {
                const err = new Error(
                    "Ce chauffeur est déjà affecté à un autre véhicule"
                );
                err.statusCode = 409;
                throw err;
            }

            const err = new Error(
                "Une donnée unique est déjà utilisée"
            );
            err.statusCode = 409;
            throw err;
        }

        // Chauffeur ou agence inexistante
        if (error.code === "P2003") {
            const err = new Error(
                "Le chauffeur ou l'agence indiqué n'existe pas"
            );
            err.statusCode = 400;
            throw err;
        }

        throw error;
    }
};

// =====================================================
// SUPPRESSION D'UN VEHICULE
// =====================================================

const deleteVehicule = async (id) => {

    // Vérification de l'existence du véhicule
    const existingVehicule = await prisma.vehicule.findUnique({
        where: {
            idveh: id
        }
    });

    if (!existingVehicule) {
        const error = new Error("Véhicule introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Suppression du véhicule
    await prisma.vehicule.delete({
        where: {
            idveh: id
        }
    });

    return {
        message: "Véhicule supprimé avec succès"
    };
};


module.exports = {
    createVehicule,
    getAllVehicules,
    getVehiculeById,
    updateVehicule,
    deleteVehicule
};