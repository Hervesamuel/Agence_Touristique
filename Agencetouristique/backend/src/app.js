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
// Importation des routes Chauffeur
const chauffeurRoutes = require("./routes/chauffeurRoutes");
// Importation des routes Vehicule
const vehiculeRoutes = require("./routes/vehiculeRoutes");  
// Importation des routes Circuit
const circuitRoutes = require("./routes/circuitRoutes");









// Middleware permettant à Express de comprendre les données JSON
app.use(express.json());

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






// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API AgenceTouristique opérationnelle",
    });
});

// Exporte l'application
module.exports = app;