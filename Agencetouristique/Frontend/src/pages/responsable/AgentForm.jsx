import { useState } from "react";
import { createAgent } from "../../services/agentService";
import { getUser } from "../../services/authService";
import { useLanguage } from "../../contexts/LanguageContext";

// Composant du drapeau malgache
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

function AgentForm({ onClose, onCreated }) {
  const { t } = useLanguage();
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

  // Téléphone : chiffres uniquement, +, espaces
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
        if (value.trim().length === 0) return t("err_nom_obligatoire");
        if (value.trim().length < 2) return t("err_nom_court");
        return "";

      case "tel":
        if (value.trim().length === 0) return t("err_tel_obligatoire");
        if (value.replace(/\s/g, "").length < 8) return t("err_tel_invalide");
        return "";

      case "email":
        if (value.trim().length === 0) return t("err_email_obligatoire");
        if (!/^\S+@\S+\.\S+$/.test(value)) return t("err_email_invalide");
        return "";

      case "mdp":
        if (value.length === 0) return t("err_mdp_obligatoire");
        if (value.length < 8) return t("err_mdp_court");
        return "";

      case "ville":
        if (value.trim().length === 0) return t("err_ville_obligatoire");
        if (value.trim().length < 2) return t("err_ville_courte");
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
      setGlobalError(t("agentform_erreur_agence"));
      return;
    }

    try {
      setSubmitting(true);
      await createAgent({
        ...formData,
        idagc: responsable.idagc,
        idresp: responsable.id,
      });
      onCreated?.();
      onClose?.();
    } catch (err) {
      setGlobalError(err.message || t("agentform_erreur_defaut"));
    } finally {
      setSubmitting(false);
    }
  };

  // Un champ est valide s'il a une valeur ET aucune erreur
  const isFieldValid = (name) => formData[name].length > 0 && !errors[name];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t("agentform_titre")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 font-medium">
              {globalError}
            </div>
          )}

          {/* Nom */}
          <div>
            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agentform_nom_label")}</label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.nom ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
              placeholder={t("agentform_nom_placeholder")}
            />
            {errors.nom && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.nom}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="tel" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agentform_tel_label")}</label>
            <div className="flex items-stretch">
              {/* Badge drapeau + indicatif Madagascar */}
              <span
                className={`flex items-center gap-1.5 px-3 border border-r-0 rounded-l-lg bg-slate-50 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 shrink-0 ${errors.tel ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
              >
                <FlagMadagascar />
                <span>+261</span>
              </span>
              <input
                id="tel"
                name="tel"
                type="tel"
                inputMode="numeric"
                value={formData.tel}
                onChange={handleChange}
                className={`w-full min-w-0 px-4 py-2.5 border rounded-r-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.tel ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
                placeholder={t("agentform_tel_placeholder")}
              />
            </div>
            {errors.tel && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.tel}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agentform_email_label")}</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.email ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
              placeholder={t("agentform_email_placeholder")}
            />
            {errors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe temporaire */}
          <div>
            <label htmlFor="mdp" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agentform_mdp_label")}</label>
            <input
              id="mdp"
              name="mdp"
              type="text"
              value={formData.mdp}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.mdp ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
              placeholder={t("agentform_mdp_placeholder")}
            />
            {errors.mdp && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.mdp}</p>}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t("agentform_mdp_hint")}</p>
          </div>

          {/* Genre + Statut sur la même ligne (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agentform_genre_label")}</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Masculin">{t("genre_masculin")}</option>
                <option value="Féminin">{t("genre_feminin")}</option>
              </select>
            </div>

            <div>
              <label htmlFor="statut" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agents_statut_label")}</label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="Actif">{t("statut_actif")}</option>
                <option value="Inactif">{t("statut_inactif")}</option>
              </select>
            </div>
          </div>

          {/* Ville */}
          <div>
            <label htmlFor="ville" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("agentform_ville_label")}</label>
            <input
              id="ville"
              name="ville"
              type="text"
              value={formData.ville}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.ville ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
              placeholder={t("agentform_ville_placeholder")}
            />
            {errors.ville && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.ville}</p>}
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors order-2 sm:order-1"
            >
              {t("btn_annuler")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {submitting ? t("agentform_creation_en_cours") : t("agentform_creer_btn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgentForm;