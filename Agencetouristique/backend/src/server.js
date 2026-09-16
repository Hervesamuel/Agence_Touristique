// Importation d'application Expresse 
const app = require("./app");
// Port d'écoute du serveurport
const PORT = process.env.PORT || 5000;

// Demmarade du serveur sur le port spécifie
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT};`)
})