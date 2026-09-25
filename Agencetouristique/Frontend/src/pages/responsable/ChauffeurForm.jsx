import { useState } from "react";
import { createChauffeur } from "../../services/chauffeurServices";
import { getUser } from "../../services/authService";


// Composant du drapeau malgache (à ajouter en haut du fichier, avant le composant principal)
function FlagMadagascar({ className = "w-5 h-4" }) {
  return (
    <svg
      viewBox="0 0 900 600"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} rounded-sm shrink-0`}
    >
      <rect width="300" height="600" fill="#ffffff" />
      <rect x="300" width="600" height="300" fill="#fc3d32" />
      <rect x="300" y="300" width="600" height="300" fill="#007e3a" />
    </svg>
  );
}

function ChauffeurForm({ onClose, onCreated }) {
  const responsable = getUser();

  const [formData, setFormData] = useState({
    nom: "",
    tel: "",
    email: "",
    mdp: "",
    genre: "Masculin",
    ville: "",
    statut: "Actif",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // =====================================================
  // REGLES DE FILTRAGE PAR CHAMP (bloque la frappe invalide)
  // =====================================================

  // Nom : lettres (avec accents), espaces, tirets et apostrophes uniquement
  const filterNom = (value) => value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "").slice(0, 100);

  // Téléphone : chiffres uniquement, +, espaces (format international ou local)
  const filterTel = (value) => value.replace(/[^0-9+\s]/g, "").slice(0, 20);

  // Ville : lettres, espaces, tirets uniquement
  const filterVille = (value) => value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, "").slice(0, 100);

  // Email : bloque les espaces et les caractères clairement invalides
  const filterEmail = (value) => value.replace(/[^a-zA-Z0-9@._+-]/g, "");

  // Mot de passe : pas de restriction de caractères, juste une longueur max raisonnable
  const filterMdp = (value) => value.slice(0, 64);

  // =====================================================
  // VALIDATION EN TEMPS REEL PAR CHAMP
  // =====================================================

  const validateField = (name, value) => {
    switch (name) {
      case "nom":
        if (value.trim().length === 0) return "Le nom est obligatoire";
        if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères";
        return "";

      case "tel":
        if (value.trim().length === 0) return "Le téléphone est obligatoire";
        if (value.replace(/\s/g, "").length < 8) return "Le numéro de téléphone est invalide";
        return "";

      case "email":
        if (value.trim().length === 0) return "L'email est obligatoire";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "L'adresse email est invalide";
        return "";

      case "mdp":
        if (value.length === 0) return "Le mot de passe est obligatoire";
        if (value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
        return "";

      case "ville":
        if (value.trim().length === 0) return "La ville est obligatoire";
        if (value.trim().length < 2) return "La ville doit contenir au moins 2 caractères";
        return "";

      default:
        return "";
    }
  };

  // Application du filtre + validation à chaque frappe
  const handleChange = (e) => {
    const { name, value } = e.target;

    let filteredValue = value;
    if (name === "nom") filteredValue = filterNom(value);
    else if (name === "tel") filteredValue = filterTel(value);
    else if (name === "email") filteredValue = filterEmail(value);
    else if (name === "mdp") filteredValue = filterMdp(value);
    else if (name === "ville") filteredValue = filterVille(value);

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));

    // Validation immédiate du champ modifié
    const fieldError = validateField(name, filteredValue);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  // Validation complète de tous les champs (avant soumission)
  const validateAll = () => {
    const newErrors = {
      nom: validateField("nom", formData.nom),
      tel: validateField("tel", formData.tel),
      email: validateField("email", formData.email),
      mdp: validateField("mdp", formData.mdp),
      ville: validateField("ville", formData.ville),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => msg === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateAll()) return;

    if (!responsable?.idagc) {
      setGlobalError("Impossible de déterminer votre agence. Veuillez vous reconnecter.");
      return;
    }

    try {
      setSubmitting(true);
      await createChauffeur({
        ...formData,
        idagc: responsable.idagc,
      });
      onCreated?.();
      onClose?.();
    } catch (err) {
      setGlobalError(err.message || "Impossible de créer le chauffeur.");
    } finally {
      setSubmitting(false);
    }
  };

  // Un champ est valide s'il a une valeur ET aucune erreur
  const isFieldValid = (name) => formData[name].length > 0 && !errors[name];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">Ajouter un chauffeur</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 font-medium">
              {globalError}
            </div>
          )}

          {/* Nom */}
          <div>
            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.nom ? "border-red-400" : isFieldValid("nom") ? "border-emerald-300" : "border-slate-300"
                }`}
                placeholder="ex: Randria Paul"
              />
              {isFieldValid("nom") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.nom && <p className="text-xs text-red-600 mt-1">{errors.nom}</p>}
          </div>

                   {/* Téléphone */}
          <div>
            <label htmlFor="tel" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Téléphone
            </label>
            <div className="relative flex items-stretch">
              {/* Badge drapeau + indicatif Madagascar */}
              <span
                className={`flex items-center gap-1.5 px-3 border border-r-0 rounded-l-lg bg-slate-50 text-sm font-medium text-slate-600 shrink-0 ${
                  errors.tel ? "border-red-400" : isFieldValid("tel") ? "border-emerald-300" : "border-slate-300"
                }`}
              >
                              {/* Badge drapeau + indicatif Madagascar */}
              <span
                className={`flex items-center gap-1.5 px-3 border border-r-0 rounded-l-lg bg-slate-50 text-sm font-medium text-slate-600 shrink-0 ${
                  errors.tel ? "border-red-400" : isFieldValid("tel") ? "border-emerald-300" : "border-slate-300"
                }`}
              >
                <FlagMadagascar />
                <span>+261</span>
              </span>
              </span>

              <input
                id="tel"
                name="tel"
                type="tel"
                inputMode="numeric"
                value={formData.tel}
                onChange={handleChange}
                className={`w-full min-w-0 px-4 py-2.5 pr-10 border rounded-r-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.tel ? "border-red-400" : isFieldValid("tel") ? "border-emerald-300" : "border-slate-300"
                }`}
                placeholder="ex: 034 12 345 67"
              />
              {isFieldValid("tel") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.tel && <p className="text-xs text-red-600 mt-1">{errors.tel}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.email ? "border-red-400" : isFieldValid("email") ? "border-emerald-300" : "border-slate-300"
                }`}
                placeholder="ex: chauffeur@madatours.mg"
              />
              {isFieldValid("email") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe temporaire */}
          <div>
            <label htmlFor="mdp" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Mot de passe temporaire
            </label>
            <div className="relative">
              <input
                id="mdp"
                name="mdp"
                type="text"
                value={formData.mdp}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.mdp ? "border-red-400" : isFieldValid("mdp") ? "border-emerald-300" : "border-slate-300"
                }`}
                placeholder="8 caractères minimum"
              />
              {isFieldValid("mdp") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.mdp && <p className="text-xs text-red-600 mt-1">{errors.mdp}</p>}
            <p className="text-xs text-slate-400 mt-1">Le chauffeur pourra le modifier après sa première connexion.</p>
          </div>

          {/* Genre + Statut sur la même ligne (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Masculin">Masculin</option>
                <option value="Féminin">Féminin</option>
              </select>
            </div>

            <div>
              <label htmlFor="statut" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Statut
              </label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>

          {/* Ville */}
          <div>
            <label htmlFor="ville" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Ville
            </label>
            <div className="relative">
              <input
                id="ville"
                name="ville"
                type="text"
                value={formData.ville}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.ville ? "border-red-400" : isFieldValid("ville") ? "border-emerald-300" : "border-slate-300"
                }`}
                placeholder="ex: Antananarivo"
              />
              {isFieldValid("ville") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.ville && <p className="text-xs text-red-600 mt-1">{errors.ville}</p>}
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors order-2 sm:order-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {submitting ? "Création..." : "Créer le chauffeur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChauffeurForm;