const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// Envoi du code temporaire de récupération
const envoyerCodeReset = async (destinataire, nom, code) => {
    await transporter.sendMail({
        from: `"MADATours" <${process.env.MAIL_USER}>`,
        to: destinataire,
        subject: "Votre code temporaire de connexion - MADATours",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
                <h2 style="color: #0d9488;">MADATours</h2>
                <p>Bonjour ${nom},</p>
                <p>Voici votre code temporaire. Utilisez-le comme mot de passe pour vous connecter :</p>
                <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #f1f5f9; padding: 12px; text-align: center; border-radius: 8px;">${code}</p>
                <p>Ce code est valable <b>30 minutes</b>. Après connexion, vous devrez choisir un nouveau mot de passe dans votre profil.</p>
                <p style="color: #64748b; font-size: 12px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
            </div>
        `
    });
};

module.exports = { envoyerCodeReset };