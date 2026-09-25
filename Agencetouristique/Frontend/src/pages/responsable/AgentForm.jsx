import { useState } from "react";
import { createAgent } from "../../services/agentService";
import { getUser } from "../../services/authService";

function AgentForm({ onClose, onCreated }) {
  const responsable = getUser();
    console.log("UTILISATEUR CONNECTÉ :", responsable);
    console.log("ID AGENCE :", responsable?.idagc);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Réinitialisation de l'erreur du champ modifié
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation simple côté client, alignée sur agentSchema.js (backend)
  const validate = () => {
    const newErrors = {};
    if (formData.nom.trim().length < 2) newErrors.nom = "Le nom doit contenir au moins 2 caractères";
    if (formData.tel.trim().length < 8) newErrors.tel = "Le numéro de téléphone est invalide";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "L'adresse email est invalide";
    if (formData.mdp.length < 8) newErrors.mdp = "Le mot de passe doit contenir au moins 8 caractères";
    if (formData.ville.trim().length < 2) newErrors.ville = "La ville doit contenir au moins 2 caractères";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    if (!validate()) return;

    if (!responsable?.idagc) {
      setGlobalError("Impossible de déterminer votre agence. Veuillez vous reconnecter.");
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
      setGlobalError(err.message || "Impossible de créer l'agent.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-slate-900">Ajouter un agent</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 font-medium">
              {globalError}
            </div>
          )}

          {/* Nom */}
          <div>
            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Nom complet</label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={formData.nom}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.nom ? "border-red-400" : "border-slate-300"}`}
              placeholder="ex: Rakoto Jean"
            />
            {errors.nom && <p className="text-xs text-red-600 mt-1">{errors.nom}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="tel" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Téléphone</label>
            <input
              id="tel"
              name="tel"
              type="tel"
              value={formData.tel}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.tel ? "border-red-400" : "border-slate-300"}`}
              placeholder="ex: 0341234567"
            />
            {errors.tel && <p className="text-xs text-red-600 mt-1">{errors.tel}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.email ? "border-red-400" : "border-slate-300"}`}
              placeholder="ex: agent@madatours.mg"
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe temporaire */}
          <div>
            <label htmlFor="mdp" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Mot de passe temporaire</label>
            <input
              id="mdp"
              name="mdp"
              type="text"
              value={formData.mdp}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.mdp ? "border-red-400" : "border-slate-300"}`}
              placeholder="8 caractères minimum"
            />
            {errors.mdp && <p className="text-xs text-red-600 mt-1">{errors.mdp}</p>}
            <p className="text-xs text-slate-400 mt-1">L'agent pourra le modifier après sa première connexion.</p>
          </div>

          {/* Genre + Statut sur la même ligne (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="genre" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Genre</label>
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
              <label htmlFor="statut" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Statut</label>
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
            <label htmlFor="ville" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Ville</label>
            <input
              id="ville"
              name="ville"
              type="text"
              value={formData.ville}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.ville ? "border-red-400" : "border-slate-300"}`}
              placeholder="ex: Antananarivo"
            />
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
              {submitting ? "Création..." : "Créer l'agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgentForm;