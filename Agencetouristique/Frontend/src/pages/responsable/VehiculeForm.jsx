import { useState } from "react";
import { createVehicule, updateVehicule } from "../../services/vehiculeService";
import { getUser } from "../../services/authService";

// vehicule (optionnel) : si fourni, le formulaire passe en mode modification
function VehiculeForm({ vehicule, onClose, onCreated }) {
  const responsable = getUser();
  const isEditMode = Boolean(vehicule);

  const [formData, setFormData] = useState({
    immatriculation: vehicule?.immatriculation || "",
    marque: vehicule?.marque || "",
    modele: vehicule?.modele || "",
    capacite: vehicule?.capacite ? String(vehicule.capacite) : "",
    status: vehicule?.status || "Disponible",
    photo: vehicule?.photo || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Filtres de saisie (bloquent les caractères invalides à la frappe)
  const filterImmat = (v) => v.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 20);
  const filterTexte = (v) => v.replace(/[^a-zA-ZÀ-ÿ0-9\s'-]/g, "").slice(0, 50);
  const filterNombre = (v) => v.replace(/[^0-9]/g, "").slice(0, 3);

  // Règles de validation par champ
  const validateField = (name, value) => {
    if (name === "immatriculation" && value.trim().length < 4) return "Immatriculation invalide (min. 4 caractères)";
    if (name === "marque" && value.trim().length < 2) return "La marque est obligatoire";
    if (name === "modele" && value.trim().length < 1) return "Le modèle est obligatoire";
    if (name === "capacite" && Number(value) <= 0) return "La capacité doit être supérieure à 0";
    return "";
  };

  // Saisie + filtrage + validation en temps réel
  const handleChange = (e) => {
    const { name, value } = e.target;
    let filtered = value;
    if (name === "immatriculation") filtered = filterImmat(value);
    else if (name === "marque" || name === "modele") filtered = filterTexte(value);
    else if (name === "capacite") filtered = filterNombre(value);

    setFormData((prev) => ({ ...prev, [name]: filtered }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, filtered) }));
  };

  // Conversion de la photo choisie en chaîne base64 (stockée telle quelle dans "photo")
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limite de taille raisonnable (2 Mo) pour éviter des requêtes trop lourdes
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "L'image ne doit pas dépasser 2 Mo" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    };
    reader.readAsDataURL(file);
  };

  // Suppression de la photo sélectionnée
  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
  };

  // Validation complète avant envoi
  const validateAll = () => {
    const newErrors = {};
    ["immatriculation", "marque", "modele", "capacite"].forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => !msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    if (!validateAll()) return;

    if (!responsable?.idagc) {
      setGlobalError("Impossible de déterminer votre agence. Veuillez vous reconnecter.");
      return;
    }

    // Construction du payload : "photo" n'est inclus que s'il a une valeur
    // (évite d'envoyer null/"", refusé par le schéma de validation backend)
    const payload = {
      immatriculation: formData.immatriculation,
      marque: formData.marque,
      modele: formData.modele,
      capacite: Number(formData.capacite),
      status: formData.status,
      idagc: responsable.idagc,
    };
    if (formData.photo) payload.photo = formData.photo;

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateVehicule(vehicule.idveh, payload);
      } else {
        await createVehicule(payload);
      }
      onCreated?.();
      onClose?.();
    } catch (err) {
      setGlobalError(err.message || "Impossible d'enregistrer le véhicule.");
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = (name) => formData[name].length > 0 && !errors[name];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditMode ? "Modifier le véhicule" : "Ajouter un véhicule"}
          </h2>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 font-medium">{globalError}</div>
          )}

          {/* Photo du véhicule */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Photo du véhicule</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                {formData.photo ? (
                  <img src={formData.photo} alt="Aperçu du véhicule" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🚐</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-block px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  Choisir une image
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
                {formData.photo && (
                  <button type="button" onClick={handleRemovePhoto} className="block text-xs text-red-600 hover:text-red-700 font-medium">
                    Retirer la photo
                  </button>
                )}
              </div>
            </div>
            {errors.photo && <p className="text-xs text-red-600 mt-1">{errors.photo}</p>}
          </div>

          {/* Immatriculation */}
          <div>
            <label htmlFor="immatriculation" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Immatriculation</label>
            <input
              id="immatriculation" name="immatriculation" type="text"
              value={formData.immatriculation} onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.immatriculation ? "border-red-400" : isValid("immatriculation") ? "border-emerald-300" : "border-slate-300"}`}
              placeholder="ex: 1234-ABC"
            />
            {errors.immatriculation && <p className="text-xs text-red-600 mt-1">{errors.immatriculation}</p>}
          </div>

          {/* Marque + Modèle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="marque" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Marque</label>
              <input
                id="marque" name="marque" type="text"
                value={formData.marque} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.marque ? "border-red-400" : isValid("marque") ? "border-emerald-300" : "border-slate-300"}`}
                placeholder="ex: Toyota"
              />
              {errors.marque && <p className="text-xs text-red-600 mt-1">{errors.marque}</p>}
            </div>
            <div>
              <label htmlFor="modele" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Modèle</label>
              <input
                id="modele" name="modele" type="text"
                value={formData.modele} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.modele ? "border-red-400" : isValid("modele") ? "border-emerald-300" : "border-slate-300"}`}
                placeholder="ex: Hiace"
              />
              {errors.modele && <p className="text-xs text-red-600 mt-1">{errors.modele}</p>}
            </div>
          </div>

          {/* Capacité + Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacite" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Capacité (places)</label>
              <input
                id="capacite" name="capacite" type="text" inputMode="numeric"
                value={formData.capacite} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.capacite ? "border-red-400" : isValid("capacite") ? "border-emerald-300" : "border-slate-300"}`}
                placeholder="ex: 15"
              />
              {errors.capacite && <p className="text-xs text-red-600 mt-1">{errors.capacite}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Statut</label>
              <select
                id="status" name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Disponible">Disponible</option>
                <option value="Indisponible">Indisponible</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors order-2 sm:order-1">Annuler</button>
            <button type="submit" disabled={submitting} className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2">
              {submitting ? (isEditMode ? "Modification..." : "Création...") : (isEditMode ? "Enregistrer" : "Créer le véhicule")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehiculeForm;