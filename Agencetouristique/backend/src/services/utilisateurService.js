// =====================================================// SERVICE : UTILISATEUR// =====================================================
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// Configuration de l'adaptateur PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Création de l'instance Prisma
const prisma = new PrismaClient({ adapter });

// Champs retournés pour un utilisateur
const selectFields = { idruti: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true };

// =====================================================// CREATION D'UN UTILISATEUR// =====================================================
const createUtilisateur = async (data) => {
    try {
        // Hachage du mot de passe
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(data.mdp, 10);

        return await prisma.utilisateur.create({
            data: { nom: data.nom, tel: data.tel, photo: data.photo, email: data.email, mdp: hashedPassword, genre: data.genre, ville: data.ville },
            select: selectFields
        });
    } catch (error) {
        // Vérification de l'unicité de l'email
        if (error.code === "P2002") {
            const err = new Error("Cette adresse email est déjà utilisée");
            err.statusCode = 409;
            throw err;
        }
        throw error;
    }
};

// =====================================================// RECUPERATION DE TOUS LES UTILISATEURS// =====================================================
const getAllUtilisateurs = async () => {
    return await prisma.utilisateur.findMany({ orderBy: { idruti: "asc" }, select: selectFields });
};

// =====================================================// RECUPERATION D'UN UTILISATEUR PAR SON IDENTIFIANT// =====================================================
const getUtilisateurById = async (id) => {
    const utilisateur = await prisma.utilisateur.findUnique({ where: { idruti: id }, select: selectFields });
    if (!utilisateur) {
        const error = new Error("Utilisateur introuvable");
        error.statusCode = 404;
        throw error;
    }
    return utilisateur;
};

// =====================================================// MODIFICATION D'UN UTILISATEUR// =====================================================
const updateUtilisateur = async (id, data) => {
    // Vérification de l'existence de l'utilisateur
    await getUtilisateurById(id);

    // Préparation des données à modifier
    const updateData = {};
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.tel !== undefined) updateData.tel = data.tel;
    if (data.photo !== undefined) updateData.photo = data.photo;

    if (data.email !== undefined) {
        const existingUtilisateur = await prisma.utilisateur.findFirst({ where: { email: data.email, NOT: { idruti: id } } });
        if (existingUtilisateur) {
            const error = new Error("Cette adresse email est déjà utilisée par un autre utilisateur");
            error.statusCode = 409;
            throw error;
        }
        updateData.email = data.email;
    }

    if (data.mdp !== undefined) {
        const bcrypt = require("bcrypt");
        updateData.mdp = await bcrypt.hash(data.mdp, 10);
    }

    if (data.genre !== undefined) updateData.genre = data.genre;
    if (data.ville !== undefined) updateData.ville = data.ville;

    try {
        return await prisma.utilisateur.update({ where: { idruti: id }, data: updateData, select: selectFields });
    } catch (error) {
        if (error.code === "P2002") {
            const err = new Error("Cette adresse email est déjà utilisée");
            err.statusCode = 409;
            throw err;
        }
        throw error;
    }
};

// =====================================================// SUPPRESSION D'UN UTILISATEUR// =====================================================
const deleteUtilisateur = async (id) => {
    // Vérification de l'existence de l'utilisateur
    await getUtilisateurById(id);

    try {
        await prisma.utilisateur.delete({ where: { idruti: id } });
    } catch (error) {
        // L'utilisateur possède peut-être des notifications
        if (error.code === "P2003") {
            const err = new Error("Cet utilisateur possède des notifications et ne peut pas être supprimé");
            err.statusCode = 409;
            throw err;
        }
        throw error;
    }

    return { message: "Utilisateur supprimé avec succès" };
};

module.exports = { createUtilisateur, getAllUtilisateurs, getUtilisateurById, updateUtilisateur, deleteUtilisateur };