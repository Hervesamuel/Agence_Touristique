// Importe Express pour créer l'application
const express = require("express");

// Importation des routes Agence
const agenceRoutes = require("./routes/agenceRoutes");
// Importation des routes Responsable
const responsableRoutes = require("./routes/responsableRoutes");
// Création d'une instance de l'application Express
const app = express();
// Importation des routes Agent
const agentRoutes = require("./routes/agentRoutes");

// Middleware permettant à Express de comprendre les données JSON
app.use(express.json());

// ROUTE DE L'AGENCE
app.use("/api/agences", agenceRoutes);

// ROUTE DE RESPONSABLE
app.use("/api/responsables", responsableRoutes);

// ROUTE DE L'AGENT
app.use("/api/agents", agentRoutes);












// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API AgenceTouristique opérationnelle",
    });
});

// Exporte l'application
module.exports = app;