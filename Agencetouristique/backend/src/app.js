// Importe Express pour créer l'application
const express = require("express");
// Importation de CORS
const cors = require("cors");
// Importation des routes Agence
const agenceRoutes = require("./routes/agenceRoutes");
// Importation des routes Responsable
const responsableRoutes = require("./routes/responsableRoutes");
// Création d'une instance de l'application Express
const app = express();
// Importation des routes Agent
const agentRoutes = require("./routes/agentRoutes");
// Importation des routes Chauffeur
const chauffeurRoutes = require("./routes/chauffeurRoutes");
// Importation des routes Vehicule
const vehiculeRoutes = require("./routes/vehiculeRoutes");  
// Importation des routes Circuit
const circuitRoutes = require("./routes/circuitRoutes");
// Importation des routes Reservation
const reservationRoutes = require("./routes/reservationRoutes");
// Importation des routes Rendezvous
const rendezVousRoutes = require("./routes/rendezVousRoutes");
// Importation des routes Recu
const recuRoutes = require("./routes/recuRoutes");
// Importation de route utilisateur 
const utilisateurRoutes = require("./routes/utilisateurRoutes");
// Importation de route notification
const notificationRoutes = require("./routes/notificationRoutes");
// Importation de route authentification
const authRoutes = require("./routes/authRoutes")
// Middleware permettant à Express de comprendre les données JSON
app.use(express.json());
// Autorisation des requêtes provenant du frontend
app.use(cors());
// ROUTE DE L'AGENCE
app.use("/api/agences", agenceRoutes);

// ROUTE DE RESPONSABLE
app.use("/api/responsables", responsableRoutes);

// ROUTE DE L'AGENT
app.use("/api/agents", agentRoutes);

// ROUTE DE CHAUFFEUR 
app.use("/api/chauffeurs", chauffeurRoutes);

// ROUTE DE VEHICULE
app.use("/api/vehicules", vehiculeRoutes);
// ROUTE DE CIRCUIT
app.use("/api/circuits", circuitRoutes);
// ROUTE DE RESERVATION
app.use("/api/reservations", reservationRoutes);
// ROUTE DE RENDEZ-VOUS
app.use("/api/rendez-vous", rendezVousRoutes);
// ROUTE DE RECU
app.use("/api/recus", recuRoutes);
// ROUTE UTILISATEUR 
app.use("/api/utilisateurs", utilisateurRoutes);
// ROUTE NOTIFICATION
app.use("/api/notifications", notificationRoutes);
// ROUTE AUTHENTIFICATION
app.use("/api/auth", authRoutes);


// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API AgenceTouristique opérationnelle",
    });
});

// Exporte l'application
module.exports = app;