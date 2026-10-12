// =====================================================
// SERVICE : SMS (API ORANGE MADAGASCAR)
// =====================================================
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TOKEN_URL = "https://api.orange.com/oauth/v3/token";
const SMS_BASE_URL = "https://api.orange.com/smsmessaging/v1/outbound";

// Token OAuth gardé en mémoire (valable 1 heure côté Orange)
let tokenEnCache = { valeur: null, expireLe: 0 };

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const erreur = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

// =====================================================
// TOKEN D'ACCES
// =====================================================
const getAccessToken = async () => {
    if (tokenEnCache.valeur && Date.now() < tokenEnCache.expireLe) return tokenEnCache.valeur;

    const { ORANGE_SMS_CLIENT_ID: id, ORANGE_SMS_CLIENT_SECRET: secret } = process.env;
    if (!id || !secret) throw erreur("Configuration Orange SMS manquante sur le serveur", 500);

    const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.access_token) {
        console.error("Orange token refusé :", response.status, data);
        throw erreur("Authentification Orange refusée : vérifiez les identifiants", 502);
    }

    // On garde une marge de 60 secondes avant l'expiration réelle
    tokenEnCache = { valeur: data.access_token, expireLe: Date.now() + (Number(data.expires_in) - 60) * 1000 };
    return tokenEnCache.valeur;
};

// =====================================================
// OUTILS
// =====================================================
// "034 12 345 67", "0341234567" ou "+261341234567" -> "+261341234567"
const normaliserTelephone = (tel) => {
    const nettoye = String(tel || "").replace(/[^\d+]/g, "");
    if (/^\+261\d{9}$/.test(nettoye)) return nettoye;
    if (/^0\d{9}$/.test(nettoye)) return `+261${nettoye.slice(1)}`;
    return null;
};

// Heure actuelle à Madagascar (0 à 23)
const heureAMadagascar = () =>
    Number(new Intl.DateTimeFormat("fr-FR", { timeZone: "Indian/Antananarivo", hour: "numeric", hourCycle: "h23" }).format(new Date()));

// =====================================================
// ENVOI D'UN SMS
// =====================================================
const envoyerUnSms = async (telephone, message, dejaReessaye = false) => {
    const expediteur = `tel:${process.env.ORANGE_SMS_SENDER}`;
    const token = await getAccessToken();

    const response = await fetch(`${SMS_BASE_URL}/${encodeURIComponent(expediteur)}/requests`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            outboundSMSMessageRequest: {
                address: `tel:${telephone}`,
                senderAddress: expediteur,
                // Nom d'expéditeur : uniquement une fois validé par Orange
                ...(process.env.ORANGE_SMS_SENDER_NAME ? { senderName: process.env.ORANGE_SMS_SENDER_NAME } : {}),
                outboundSMSTextMessage: { message },
            },
        }),
    });

    // Token expiré : on en redemande un et on réessaie une seule fois
    if (response.status === 401 && !dejaReessaye) {
        tokenEnCache = { valeur: null, expireLe: 0 };
        return envoyerUnSms(telephone, message, true);
    }

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("Orange SMS refusé :", response.status, data);
        throw new Error(data?.requestError?.serviceException?.text || data?.description || data?.message || `Erreur HTTP ${response.status}`);
    }
};

// =====================================================
// ENVOI AUX CLIENTS DES RESERVATIONS SELECTIONNEES
// =====================================================
const envoyerAuxClients = async (idsReservations, message) => {
    // Orange interdit l'envoi de SMS entre 22 h et 6 h
    const heure = heureAMadagascar();
    if (heure >= 22 || heure < 6) {
        throw erreur("Les SMS ne peuvent pas être envoyés entre 22 h et 6 h (règle Orange).", 400);
    }

    if (!process.env.ORANGE_SMS_SENDER) throw erreur("Numéro expéditeur Orange manquant sur le serveur", 500);

    // Les numéros viennent de la base : on n'envoie jamais vers un numéro fourni par le navigateur
    const reservations = await prisma.reservation.findMany({
        where: { idres: { in: idsReservations } },
        select: { idres: true, nomclient: true, telclient: true },
    });

    // Un seul envoi par numéro, même si le client a plusieurs réservations
    const destinataires = new Set();
    let invalides = 0;
    reservations.forEach((r) => {
        const tel = normaliserTelephone(r.telclient);
        if (tel) destinataires.add(tel);
        else invalides += 1;
    });

    if (destinataires.size === 0) {
        throw erreur("Aucun numéro de téléphone valide parmi les réservations sélectionnées", 400);
    }

    // Vérifie l'authentification avant la boucle : une erreur d'identifiants est signalée une seule fois
    await getAccessToken();

    let envoyes = 0;
    let echecs = 0;
    let derniereErreur = "";
    const liste = Array.from(destinataires);

    for (let i = 0; i < liste.length; i++) {
        try {
            await envoyerUnSms(liste[i], message);
            envoyes += 1;
        } catch (err) {
            echecs += 1;
            derniereErreur = err.message;
        }
        // Orange limite à 5 transactions par seconde
        if (i < liste.length - 1) await pause(250);
    }

    return { envoyes, echecs, invalides, derniereErreur };
};

module.exports = { envoyerAuxClients };