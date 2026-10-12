const smsService = require("../services/smsService");
const smsSchema = require("../utils/smsSchema");

// =====================================================
// ENVOI DE SMS AUX CLIENTS DES RESERVATIONS SELECTIONNEES
// =====================================================
const envoyerSms = async (req, res) => {
    try {
        const result = smsSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: result.error.issues[0].message, errors: result.error.issues });
        }

        const { idsReservations, message } = result.data;
        const bilan = await smsService.envoyerAuxClients(idsReservations, message);

        res.status(200).json({ data: bilan });
    } catch (error) {
        if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
        res.status(500).json({ message: "Erreur lors de l'envoi des SMS", error: error.message });
    }
};

module.exports = { envoyerSms };