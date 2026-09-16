
// Middleware générique de validation avec Zod
const validate = (schema) => {
    return (req, res, next) => {

        // Validation des données reçues
        const result = schema.safeParse(req.body);

        // Vérification du résultat de la validation
        if (!result.success) {
            return res.status(400).json({
                message: "Données invalides",
                errors: result.error.issues
            });
        }

        // Remplacement des données par les données validées
        req.body = result.data;

        // Passage au contrôleur suivant
        next();
    };
};

// Exportation du middleware
module.exports = validate;