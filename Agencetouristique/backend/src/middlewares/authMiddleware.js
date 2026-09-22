const jwt = require("jsonwebtoken");

// =====================================================
// MIDDLEWARE : AUTHENTIFICATION JWT
// =====================================================

const authenticateToken = (req, res, next) => {

    // Récupération de l'en-tête Authorization
    const authHeader = req.headers.authorization;

    // Vérification de la présence du token
    if (!authHeader) {
        return res.status(401).json({
            message: "Token d'authentification requis"
        });
    }

    // Vérification du format Bearer Token
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Format du token invalide"
        });
    }

    // Récupération du token
    const token = parts[1];

    try {

        // Vérification et décodage du token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Stockage des informations du token
        // dans l'objet request
        req.user = decoded;

        // Passage au middleware ou controller suivant
        next();

    } catch (error) {

        // Token invalide ou expiré
        return res.status(401).json({
            message: "Token invalide ou expiré"
        });
    }
};

// Exportation du middleware
module.exports = authenticateToken;