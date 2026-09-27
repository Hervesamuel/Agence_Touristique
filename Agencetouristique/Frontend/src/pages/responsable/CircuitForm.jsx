import { useState } from "react";
import { createCircuit } from "../../services/circuitService";
import { getUser } from "../../services/authService";
import { useLanguage } from "../../contexts/LanguageContext";

function CircuitForm({ onClose, onCreated }) {
  const { t } = useLanguage();
  const responsable = getUser();

  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    destination: "",
    capacite: "",
    status: "Disponible",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // =====================================================
  // REGLES DE FILTRAGE PAR CHAMP (bloque la frappe invalide)
  // =====================================================

  // Nom : lettres (avec accents), chiffres, espaces, tirets, apostrophes
  const filterNom = (value) => value.replace(/[^a-zA-Z0-9À-ÿ\s'-]/g, "").slice(0, 100);

  // Destination : lettres, espaces, virgules, tirets (ex: "Nosy Be, Diego")
  const filterDestination = (value) => value.replace(/[^a-zA-ZÀ-ÿ\s',-]/g, "").slice(0, 150);

  // Capacité : chiffres uniquement
  const filterCapacite = (value) => value.replace(/[^0-9]/g, "").slice(0, 4);

  // Description : pas de filtrage de caractères, juste une longueur max
  const filterDescription = (value) => value.slice(0, 1000);

  // =====================================================
  // VALIDATION EN TEMPS REEL PAR CHAMP
  // =====================================================

  const validateField = (name, value) => {
    switch (name) {
      case "nom":
        if (value.trim().length === 0) return t("circuitform_err_nom_requis");
        if (value.trim().length < 2) return t("circuitform_err_nom_court");
        return "";

      case "description":
        if (value.trim().length === 0) return t("circuitform_err_description_requise");
        if (value.trim().length < 10) return t("circuitform_err_description_courte");
        return "";

      case "destination":
        if (value.trim().length === 0) return t("circuitform_err_destination_requise");
        if (value.trim().length < 2) return t("circuitform_err_destination_courte");
        return "";

      case "capacite":
        if (value.trim().length === 0) return t("circuitform_err_capacite_requise");
        if (Number(value) <= 0) return t("circuitform_err_capacite_positive");
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
    else if (name === "destination") filteredValue = filterDestination(value);
    else if (name === "capacite") filteredValue = filterCapacite(value);
    else if (name === "description") filteredValue = filterDescription(value);

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));

    // Validation immédiate du champ modifié
    const fieldError = validateField(name, filteredValue);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  // Validation complète de tous les champs (avant soumission)
  const validateAll = () => {
    const newErrors = {
      nom: validateField("nom", formData.nom),
      description: validateField("description", formData.description),
      destination: validateField("destination", formData.destination),
      capacite: validateField("capacite", formData.capacite),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => msg === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateAll()) return;

    if (!responsable?.idagc) {
      setGlobalError(t("circuitform_erreur_agence"));
      return;
    }

    try {
      setSubmitting(true);
      await createCircuit({
        ...formData,
        capacite: Number(formData.capacite),
        idagc: responsable.idagc,
      });
      onCreated?.();
      onClose?.();
    } catch (err) {
      setGlobalError(err.message || t("circuitform_erreur_creation"));
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
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("circuitform_titre_ajouter")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
            aria-label={t("circuitform_fermer_aria")}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 text-sm rounded-xl p-3 font-medium">
              {globalError}
            </div>
          )}

          {/* Nom du circuit */}
          <div>
            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("circuitform_label_nom")}
            </label>
            <div className="relative">
              <input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.nom ? "border-red-400 dark:border-red-500/60" : isFieldValid("nom") ? "border-emerald-300 dark:border-emerald-500/60" : "border-slate-300 dark:border-slate-600"
                }`}
                placeholder={t("circuitform_placeholder_nom")}
              />
              {isFieldValid("nom") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400">✓</span>
              )}
            </div>
            {errors.nom && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.nom}</p>}
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("circuitform_label_destination")}
            </label>
            <div className="relative">
              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.destination ? "border-red-400 dark:border-red-500/60" : isFieldValid("destination") ? "border-emerald-300 dark:border-emerald-500/60" : "border-slate-300 dark:border-slate-600"
                }`}
                placeholder={t("circuitform_placeholder_destination")}
              />
              {isFieldValid("destination") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400">✓</span>
              )}
            </div>
            {errors.destination && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.destination}</p>}
          </div>

          {/* Capacité + Statut sur la même ligne (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacite" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {t("circuitform_label_capacite")}
              </label>
              <div className="relative">
                <input
                  id="capacite"
                  name="capacite"
                  type="text"
                  inputMode="numeric"
                  value={formData.capacite}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.capacite ? "border-red-400 dark:border-red-500/60" : isFieldValid("capacite") ? "border-emerald-300 dark:border-emerald-500/60" : "border-slate-300 dark:border-slate-600"
                  }`}
                  placeholder={t("circuitform_placeholder_capacite")}
                />
                {isFieldValid("capacite") && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400">✓</span>
                )}
              </div>
              {errors.capacite && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.capacite}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {t("circuitform_label_statut")}
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="Disponible">{t("circuitform_statut_disponible")}</option>
                <option value="Indisponible">{t("circuitform_statut_indisponible")}</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("circuitform_label_description")}
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.description ? "border-red-400 dark:border-red-500/60" : isFieldValid("description") ? "border-emerald-300 dark:border-emerald-500/60" : "border-slate-300 dark:border-slate-600"
              }`}
              placeholder={t("circuitform_placeholder_description")}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400 dark:text-slate-500">{formData.description.length}/1000</p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold transition-colors order-2 sm:order-1"
            >
              {t("circuitform_btn_annuler")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              {submitting ? t("circuitform_btn_creation") : t("circuitform_btn_creer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CircuitForm;