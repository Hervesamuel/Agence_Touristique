const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
// CONNEXION
// =====================================================

const login = async (email, mdp) => {

    // =================================================
    // RECHERCHE DU RESPONSABLE
    // =================================================

    const responsable = await prisma.responsable.findUnique({
        where: {
            email: email
        }
    });

    if (responsable) {

        // Vérification du mot de passe
        const passwordCorrect = await bcrypt.compare(
            mdp,
            responsable.mdp
        );

        if (!passwordCorrect) {
            const error = new Error("Email ou mot de passe incorrect");
            error.statusCode = 401;
            throw error;
        }

        // Récupération de l'agence liée au responsable
        const agence = await prisma.agence.findUnique({
            where: {
                idresp: responsable.idresp
            },
            select: {
                idagc: true
            }
        });

        // Vérification de l'agence récupérée (debug temporaire)
        console.log("DEBUG - idresp recherché :", responsable.idresp);
        console.log("DEBUG - agence trouvée :", agence);

        // Création du token JWT
        const token = jwt.sign(
            {
                id: responsable.idresp,
                email: responsable.email,
                role: "RESPONSABLE",
                idagc: agence?.idagc
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return {
            message: "Connexion réussie",
            token: token,
            user: {
                id: responsable.idresp,
                idresp: responsable.idresp,
                idagc: agence?.idagc,
                nom: responsable.nom,
                email: responsable.email,
                role: "RESPONSABLE"
            }
        };
    }

    // =================================================
    // RECHERCHE DE L'AGENT
    // =================================================

    const agent = await prisma.agent.findUnique({
        where: {
            email: email
        }
    });

    if (agent) {

        // Vérification du mot de passe
        const passwordCorrect = await bcrypt.compare(
            mdp,
            agent.mdp
        );

        if (!passwordCorrect) {
            const error = new Error(
                "Email ou mot de passe incorrect"
            );

            error.statusCode = 401;
            throw error;
        }

        // Création du token JWT
        const token = jwt.sign(
            {
                id: agent.idagt,
                email: agent.email,
                role: "AGENT"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return {
            message: "Connexion réussie",
            token: token,
            user: {
                id: agent.idagt,
                nom: agent.nom,
                email: agent.email,
                role: "AGENT"
            }
        };
    }

    // =================================================
    // RECHERCHE DU CHAUFFEUR
    // =================================================

    const chauffeur = await prisma.chauffeur.findUnique({
        where: {
            email: email
        }
    });

    if (chauffeur) {

        // Vérification du mot de passe
        const passwordCorrect = await bcrypt.compare(
            mdp,
            chauffeur.mdp
        );

        if (!passwordCorrect) {
            const error = new Error(
                "Email ou mot de passe incorrect"
            );

            error.statusCode = 401;
            throw error;
        }

        // Création du token JWT
        const token = jwt.sign(
            {
                id: chauffeur.idchauffeur,
                email: chauffeur.email,
                role: "CHAUFFEUR"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return {
            message: "Connexion réussie",
            token: token,
            user: {
                id: chauffeur.idchauffeur,
                nom: chauffeur.nom,
                email: chauffeur.email,
                role: "CHAUFFEUR"
            }
        };
    }

    // =================================================
    // COMPTE INTROUVABLE
    // =================================================

    const error = new Error(
        "Email ou mot de passe incorrect"
    );

    error.statusCode = 401;
    throw error;
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================

module.exports = {
    login
};