// =====================================================
// MIDDLEWARE : AUTORISATION PAR ROLE
// =====================================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        // Vérification de la présence des informations utilisateur
        if (!req.user) {
            return res.status(401).json({
                message: "Utilisateur non authentifié"
            });
        }

        // Vérification du rôle de l'utilisateur
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Accès interdit"
            });
        }

        // Accès autorisé
        next();
    };
};

// Exportation du middleware
module.exports = authorizeRoles;