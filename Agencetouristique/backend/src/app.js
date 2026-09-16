// Importe Express pour créer l'application
const express = require("express");

// Importation des routes Agence
const agenceRoutes = require("./routes/agenceRoutes");

// Création d'une instance de l'application Express
const app = express();

// Middleware permettant à Express de comprendre les données JSON
app.use(express.json());

// Utilisation des routes Agence
app.use("/api/agences", agenceRoutes);

// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API AgenceTouristique opérationnelle",
    });
});

// Exporte l'application
module.exports = app;