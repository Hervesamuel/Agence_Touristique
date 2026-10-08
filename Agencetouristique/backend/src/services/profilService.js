require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Table et clé primaire correspondant à chaque rôle du token JWT
const COMPTES = {
    RESPONSABLE: { table: "responsable", pk: "idresp" },
    AGENT: { table: "agent", pk: "idagt" },
    CHAUFFEUR: { table: "chauffeur", pk: "idchauffeur" },
};

const getCompte = (role) => {
    const compte = COMPTES[role];
    if (!compte) {
        const error = new Error("Rôle utilisateur invalide");
        error.statusCode = 403;
        throw error;
    }
    return compte;
};

// Le mot de passe n'est jamais sélectionné
const champsProfil = (pk) => ({ [pk]: true, nom: true, tel: true, photo: true, email: true, genre: true, ville: true });

// Même forme de réponse quel que soit le rôle : { id, role, nom, ... }
const formater = (utilisateur, pk, role) => {
    const { [pk]: id, ...reste } = utilisateur;
    return { id, role, ...reste };
};

const introuvable = () => {
    const error = new Error("Compte introuvable");
    error.statusCode = 404;
    return error;
};

const getProfil = async (id, role) => {
    const { table, pk } = getCompte(role);
    const utilisateur = await prisma[table].findUnique({ where: { [pk]: id }, select: champsProfil(pk) });
    if (!utilisateur) throw introuvable();
    return formater(utilisateur, pk, role);
};

const updateProfil = async (id, role, data) => {
    const { table, pk } = getCompte(role);

    // L'email doit rester unique sur les trois tables de comptes
    if (data.email !== undefined) {
        const [responsable, agent, chauffeur] = await Promise.all([
            prisma.responsable.findUnique({ where: { email: data.email } }),
            prisma.agent.findUnique({ where: { email: data.email } }),
            prisma.chauffeur.findUnique({ where: { email: data.email } }),
        ]);

        // Refusé s'il appartient à un autre compte que celui de l'utilisateur
        const trouves = [
            [responsable, "RESPONSABLE", "idresp"],
            [agent, "AGENT", "idagt"],
            [chauffeur, "CHAUFFEUR", "idchauffeur"],
        ];
        const dejaPris = trouves.some(([compte, r, cle]) => compte && !(r === role && compte[cle] === id));

        if (dejaPris) {
            const error = new Error("Cette adresse email est déjà utilisée par un autre compte");
            error.statusCode = 409;
            throw error;
        }
    }

    const utilisateur = await prisma[table].update({ where: { [pk]: id }, data, select: champsProfil(pk) });
    return formater(utilisateur, pk, role);
};

const changerMotDePasse = async (id, role, mdpActuel, mdpNouveau) => {
    const { table, pk } = getCompte(role);

    const utilisateur = await prisma[table].findUnique({ where: { [pk]: id } });
    if (!utilisateur) throw introuvable();

    // Vérification de l'ancien mot de passe avant tout changement
    if (!(await bcrypt.compare(mdpActuel, utilisateur.mdp))) {
        const error = new Error("Le mot de passe actuel est incorrect");
        error.statusCode = 401;
        throw error;
    }

    await prisma[table].update({ where: { [pk]: id }, data: { mdp: await bcrypt.hash(mdpNouveau, 10) } });
    return { message: "Mot de passe modifié avec succès" };
};

module.exports = { getProfil, updateProfil, changerMotDePasse };