// Importe Express pour créer notre application
const express = require("express");

// Crée une instance de l'application Express
const app = express();

// Middleware permettant à Express de comprendre les données JSON
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "API AgenceTouristique opérationnelle",
  });
});

// Exporte l'application
module.exports = app;