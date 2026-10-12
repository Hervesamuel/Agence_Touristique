const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { envoyerCodeReset } = require("./emailmdpoublierService");
// Chargement des variables d'environnement
require("dotenv").config();

// Importation de Prisma Client
const { PrismaClient } = require("@prisma/client");
// Importation de l'adaptateur PostgreSQL
const { PrismaPg } = require("@prisma/adapter-pg");

// Création de l'adaptateur PostgreSQL
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Création de l'instance Prisma Client
const prisma = new PrismaClient({ adapter });


// =====================================================
// OUTILS : CODE TEMPORAIRE
// =====================================================

// Génère un code aléatoire de 8 caractères (ex : "A3F9C21B")
const genererCode = () => crypto.randomBytes(4).toString("hex").toUpperCase();

// Vérifie le mot de passe OU le code temporaire encore valide
const verifierMdp = async (utilisateur, mdp) => {
    // Cas 1 : mot de passe normal
    if (await bcrypt.compare(mdp, utilisateur.mdp)) {
        return { ok: true, viaCode: false };
    }

    // Cas 2 : code temporaire non expiré
    if (utilisateur.codeReset && utilisateur.codeResetExpire && utilisateur.codeResetExpire > new Date()) {
        if (await bcrypt.compare(mdp.trim().toUpperCase(), utilisateur.codeReset)) {
            return { ok: true, viaCode: true };
        }
    }

    return { ok: false, viaCode: false };
};

// =====================================================
// CONNEXION
// =====================================================
const login = async (email, mdp) => {
    // =================================================
    // RECHERCHE DU RESPONSABLE
    // =================================================
    const responsable = await prisma.responsable.findUnique({ where: { email: email } });

    if (responsable) {
        // Vérification du mot de passe
        const verif = await verifierMdp(responsable, mdp);
        if (!verif.ok) {
            const error = new Error("Email ou mot de passe incorrect");
            error.statusCode = 401;
            throw error;
        }

        // Récupération de l'agence liée au responsable
        const agence = await prisma.agence.findUnique({ where: { idresp: responsable.idresp }, select: { idagc: true } });

        // Affichage des informations de contrôle
        console.log("DEBUG - idresp recherché :", responsable.idresp);
        console.log("DEBUG - agence trouvée :", agence);

        // Création du token JWT
        const token = jwt.sign(
            { id: responsable.idresp, email: responsable.email, role: "RESPONSABLE", idagc: agence?.idagc },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            message: "Connexion réussie",
            token: token,
            doitChangerMdp: verif.viaCode,
            user: { id: responsable.idresp, idresp: responsable.idresp, idagc: agence?.idagc, nom: responsable.nom, email: responsable.email, role: "RESPONSABLE" }
        };
    }

    // =================================================
    // RECHERCHE DE L'AGENT
    // =================================================
    const agent = await prisma.agent.findUnique({ where: { email: email } });

    if (agent) {
        // Vérification du mot de passe (ou du code temporaire)
        const verif = await verifierMdp(agent, mdp);
        if (!verif.ok) {
            const error = new Error("Email ou mot de passe incorrect");
            error.statusCode = 401;
            throw error;
        }

        // Vérification du statut du compte
        if (agent.statut !== "Actif") {
            const error = new Error("Votre compte a été désactivé. Veuillez contacter votre responsable.");
            error.statusCode = 403;
            throw error;
        }

        // Création du token JWT
        const token = jwt.sign(
            { id: agent.idagt, email: agent.email, role: "AGENT" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            message: "Connexion réussie",
            token: token,
            doitChangerMdp: verif.viaCode,
            user: { id: agent.idagt, nom: agent.nom, email: agent.email, role: "AGENT" }
        };
    }

    // =================================================
    // RECHERCHE DU CHAUFFEUR
    // =================================================
    const chauffeur = await prisma.chauffeur.findUnique({ where: { email: email } });

    if (chauffeur) {
        // Vérification du mot de passe
        const verif = await verifierMdp(chauffeur, mdp);
        if (!verif.ok) {
            const error = new Error("Email ou mot de passe incorrect");
            error.statusCode = 401;
            throw error;
        }

        // Vérification du statut du compte
        if (chauffeur.statut !== "Actif") {
            const error = new Error("Votre compte a été désactivé. Veuillez contacter votre responsable.");
            error.statusCode = 403;
            throw error;
        }

        // Création du token JWT
        const token = jwt.sign(
            { id: chauffeur.idchauffeur, email: chauffeur.email, role: "CHAUFFEUR" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return {
            message: "Connexion réussie",
            token: token,
            doitChangerMdp: verif.viaCode,
            user: { id: chauffeur.idchauffeur, nom: chauffeur.nom, email: chauffeur.email, role: "CHAUFFEUR" }
        };
    }

    // =================================================
    // COMPTE INTROUVABLE
    // =================================================
    const error = new Error("Email ou mot de passe incorrect");
    error.statusCode = 401;
    throw error;
};

// =====================================================
// RECUPERATION DU PROFIL
// =====================================================
const getProfile = async (user) => {
    // Vérification du rôle Responsable
    if (user.role === "RESPONSABLE") {
        const responsable = await prisma.responsable.findUnique({
            where: { idresp: user.id },
            select: { idresp: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true }
        });

        if (!responsable) {
            const error = new Error("Utilisateur introuvable");
            error.statusCode = 404;
            throw error;
        }

        return { id: responsable.idresp, nom: responsable.nom, tel: responsable.tel, photo: responsable.photo, email: responsable.email, genre: responsable.genre, ville: responsable.ville, role: "RESPONSABLE" };
    }

    // Vérification du rôle Agent
    if (user.role === "AGENT") {
        const agent = await prisma.agent.findUnique({
            where: { idagt: user.id },
            select: { idagt: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true, statut: true, idagc: true, idresp: true }
        });

        if (!agent) {
            const error = new Error("Utilisateur introuvable");
            error.statusCode = 404;
            throw error;
        }

        return { id: agent.idagt, nom: agent.nom, tel: agent.tel, photo: agent.photo, email: agent.email, genre: agent.genre, ville: agent.ville, statut: agent.statut, idagc: agent.idagc, idresp: agent.idresp, role: "AGENT" };
    }

    // Vérification du rôle Chauffeur
    if (user.role === "CHAUFFEUR") {
        const chauffeur = await prisma.chauffeur.findUnique({
            where: { idchauffeur: user.id },
            select: { idchauffeur: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true, statut: true, idagc: true }
        });

        if (!chauffeur) {
            const error = new Error("Utilisateur introuvable");
            error.statusCode = 404;
            throw error;
        }

        return { id: chauffeur.idchauffeur, nom: chauffeur.nom, tel: chauffeur.tel, photo: chauffeur.photo, email: chauffeur.email, genre: chauffeur.genre, ville: chauffeur.ville, statut: chauffeur.statut, idagc: chauffeur.idagc, role: "CHAUFFEUR" };
    }

    // Rejet d'un rôle non reconnu
    const error = new Error("Rôle utilisateur invalide");
    error.statusCode = 403;
    throw error;
};

// =====================================================
// MODIFICATION DU PROFIL
// =====================================================
const updateProfile = async (user, data) => {
    // Extraction des données du profil
    const { nom, tel, email, genre, ville, photo } = data;

    // =================================================
    // MODIFICATION DU RESPONSABLE
    // =================================================
    if (user.role === "RESPONSABLE") {
        const responsable = await prisma.responsable.update({
            where: { idresp: user.id },
            data: { nom, tel, email, genre, ville, photo },
            select: { idresp: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true }
        });

        return { id: responsable.idresp, nom: responsable.nom, tel: responsable.tel, photo: responsable.photo, email: responsable.email, genre: responsable.genre, ville: responsable.ville, role: "RESPONSABLE" };
    }

    // =================================================
    // MODIFICATION DE L'AGENT
    // =================================================
    if (user.role === "AGENT") {
        const agent = await prisma.agent.update({
            where: { idagt: user.id },
            data: { nom, tel, email, genre, ville, photo },
            select: { idagt: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true, statut: true, idagc: true, idresp: true }
        });

        return { id: agent.idagt, nom: agent.nom, tel: agent.tel, photo: agent.photo, email: agent.email, genre: agent.genre, ville: agent.ville, statut: agent.statut, idagc: agent.idagc, idresp: agent.idresp, role: "AGENT" };
    }

    // =================================================
    // MODIFICATION DU CHAUFFEUR
    // =================================================
    if (user.role === "CHAUFFEUR") {
        const chauffeur = await prisma.chauffeur.update({
            where: { idchauffeur: user.id },
            data: { nom, tel, email, genre, ville, photo },
            select: { idchauffeur: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true, statut: true, idagc: true }
        });

        return { id: chauffeur.idchauffeur, nom: chauffeur.nom, tel: chauffeur.tel, photo: chauffeur.photo, email: chauffeur.email, genre: chauffeur.genre, ville: chauffeur.ville, statut: chauffeur.statut, idagc: chauffeur.idagc, role: "CHAUFFEUR" };
    }

    // Rejet d'un rôle non reconnu
    const error = new Error("Rôle utilisateur invalide");
    error.statusCode = 403;
    throw error;
};


// =====================================================
// MODIFICATION DU MOT DE PASSE
// =====================================================
const updatePassword = async (user, ancienMdp, nouveauMdp) => {
    let utilisateur = null;

    // Recherche du Responsable
    if (user.role === "RESPONSABLE") {
        utilisateur = await prisma.responsable.findUnique({ where: { idresp: user.id } });
    }

    // Recherche de l'Agent
    if (user.role === "AGENT") {
        utilisateur = await prisma.agent.findUnique({ where: { idagt: user.id } });
    }

    // Recherche du Chauffeur
    if (user.role === "CHAUFFEUR") {
        utilisateur = await prisma.chauffeur.findUnique({ where: { idchauffeur: user.id } });
    }

    // Vérification de l'utilisateur
    if (!utilisateur) {
        const error = new Error("Utilisateur introuvable");
        error.statusCode = 404;
        throw error;
    }

    // Vérification de l'ancien mot de passe (ou du code temporaire)
    const verif = await verifierMdp(utilisateur, ancienMdp);
    if (!verif.ok) {
        const error = new Error("L'ancien mot de passe est incorrect");
        error.statusCode = 401;
        throw error;
    }

    // Vérification de la différence entre les mots de passe
    if (ancienMdp === nouveauMdp) {
        const error = new Error("Le nouveau mot de passe doit être différent de l'ancien");
        error.statusCode = 400;
        throw error;
    }

    // Chiffrement du nouveau mot de passe
    const nouveauMdpHash = await bcrypt.hash(nouveauMdp, 10);

    // Données à enregistrer : nouveau mot de passe + suppression du code temporaire
    const donnees = { mdp: nouveauMdpHash, codeReset: null, codeResetExpire: null };

    // Modification du mot de passe du Responsable
    if (user.role === "RESPONSABLE") {
        await prisma.responsable.update({ where: { idresp: user.id }, data: donnees });
    }

    // Modification du mot de passe de l'Agent
    if (user.role === "AGENT") {
        await prisma.agent.update({ where: { idagt: user.id }, data: donnees });
    }

    // Modification du mot de passe du Chauffeur
    if (user.role === "CHAUFFEUR") {
        await prisma.chauffeur.update({ where: { idchauffeur: user.id }, data: donnees });
    }

    // Retour du résultat
    return { message: "Mot de passe modifié avec succès" };
};

// =====================================================
// MOT DE PASSE OUBLIE : ENVOI DU CODE TEMPORAIRE
// =====================================================
const forgotPassword = async (email) => {
    // Réponse identique que l'email existe ou non (sécurité)
    const reponse = { message: "Si cet email existe, un code temporaire a été envoyé." };

    // Recherche de l'email dans les 3 tables
    let cible = null;

    const responsable = await prisma.responsable.findUnique({ where: { email } });
    if (responsable) cible = { table: "responsable", where: { idresp: responsable.idresp }, nom: responsable.nom };

    if (!cible) {
        const agent = await prisma.agent.findUnique({ where: { email } });
        if (agent) cible = { table: "agent", where: { idagt: agent.idagt }, nom: agent.nom };
    }

    if (!cible) {
        const chauffeur = await prisma.chauffeur.findUnique({ where: { email } });
        if (chauffeur) cible = { table: "chauffeur", where: { idchauffeur: chauffeur.idchauffeur }, nom: chauffeur.nom };
    }

    // Email inconnu : on répond sans rien faire
    if (!cible) return reponse;

    // Génération du code, chiffrement et expiration (5 minutes)
    const code = genererCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiration = new Date(Date.now() + 5 * 60 * 1000);

    await prisma[cible.table].update({
        where: cible.where,
        data: { codeReset: codeHash, codeResetExpire: expiration }
    });

    // Envoi de l'email (une erreur d'envoi ne doit pas révéler l'existence du compte)
    try {
        await envoyerCodeReset(email, cible.nom, code);
    } catch (err) {
        console.error("Erreur d'envoi de l'email :", err.message);
    }

    return reponse;
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================
module.exports = {
    login,
    getProfile,
    updateProfile,
    updatePassword,
    forgotPassword
};