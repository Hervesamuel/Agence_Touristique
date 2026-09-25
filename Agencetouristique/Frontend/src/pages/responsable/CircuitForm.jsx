import { useState } from "react";
import { createCircuit } from "../../services/circuitService";
import { getUser } from "../../services/authService";

function CircuitForm({ onClose, onCreated }) {
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
        if (value.trim().length === 0) return "Le nom du circuit est obligatoire";
        if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères";
        return "";

      case "description":
        if (value.trim().length === 0) return "La description est obligatoire";
        if (value.trim().length < 10) return "La description doit contenir au moins 10 caractères";
        return "";

      case "destination":
        if (value.trim().length === 0) return "La destination est obligatoire";
        if (value.trim().length < 2) return "La destination doit contenir au moins 2 caractères";
        return "";

      case "capacite":
        if (value.trim().length === 0) return "La capacité est obligatoire";
        if (Number(value) <= 0) return "La capacité doit être supérieure à 0";
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
      setGlobalError("Impossible de déterminer votre agence. Veuillez vous reconnecter.");
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
      setGlobalError(err.message || "Impossible de créer le circuit.");
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
          <h2 className="text-lg font-bold text-slate-900">Ajouter un circuit</h2>
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

          {/* Nom du circuit */}
          <div>
            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Nom du circuit
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
                placeholder="ex: Circuit Nord Diego"
              />
              {isFieldValid("nom") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.nom && <p className="text-xs text-red-600 mt-1">{errors.nom}</p>}
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Destination
            </label>
            <div className="relative">
              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.destination ? "border-red-400" : isFieldValid("destination") ? "border-emerald-300" : "border-slate-300"
                }`}
                placeholder="ex: Nosy Be, Diego Suarez"
              />
              {isFieldValid("destination") && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
              )}
            </div>
            {errors.destination && <p className="text-xs text-red-600 mt-1">{errors.destination}</p>}
          </div>

          {/* Capacité + Statut sur la même ligne (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacite" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Capacité (places)
              </label>
              <div className="relative">
                <input
                  id="capacite"
                  name="capacite"
                  type="text"
                  inputMode="numeric"
                  value={formData.capacite}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.capacite ? "border-red-400" : isFieldValid("capacite") ? "border-emerald-300" : "border-slate-300"
                  }`}
                  placeholder="ex: 20"
                />
                {isFieldValid("capacite") && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
                )}
              </div>
              {errors.capacite && <p className="text-xs text-red-600 mt-1">{errors.capacite}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Disponible">Disponible</option>
                <option value="Indisponible">Indisponible</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.description ? "border-red-400" : isFieldValid("description") ? "border-emerald-300" : "border-slate-300"
              }`}
              placeholder="Décrivez le circuit : itinéraire, points d'intérêt, durée..."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400">{formData.description.length}/1000</p>
            </div>
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
              {submitting ? "Création..." : "Créer le circuit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CircuitForm;