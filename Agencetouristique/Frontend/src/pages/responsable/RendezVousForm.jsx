import { useState, useEffect } from "react";
import { createRendezVous, updateRendezVous } from "../../services/rendezVousService";
import { getAgents } from "../../services/agentService";

// rdv (optionnel) : si fourni, le formulaire passe en mode modification
function RendezVousForm({ rdv, onClose, onCreated }) {
  const isEditMode = Boolean(rdv);

  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    idagt: rdv?.idagt ? String(rdv.idagt) : "",
    date: rdv?.date ? rdv.date.slice(0, 10) : "",
    heure: rdv?.heure ? rdv.heure.slice(11, 16) : "",
    motif: rdv?.motif || "",
    statut: rdv?.statut || "En attente",
    commentaire: rdv?.commentaire || "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Chargement de la liste des agents pour le select
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await getAgents();
        setAgents(response.data || response || []);
      } catch {
        setGlobalError("Impossible de charger la liste des agents.");
      }
    };
    fetchAgents();
  }, []);

  // Filtre motif : lettres, chiffres, ponctuation courante
  const filterMotif = (v) => v.replace(/[^a-zA-ZÀ-ÿ0-9\s'.,-]/g, "").slice(0, 150);
  const filterCommentaire = (v) => v.slice(0, 500);

  // Validation par champ
  const validateField = (name, value) => {
    if (name === "idagt" && !value) return "Veuillez choisir un agent";
    if (name === "date" && !value) return "La date est obligatoire";
    if (name === "heure" && !value) return "L'heure est obligatoire";
    if (name === "motif" && value.trim().length < 3) return "Le motif doit contenir au moins 3 caractères";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filtered = value;
    if (name === "motif") filtered = filterMotif(value);
    else if (name === "commentaire") filtered = filterCommentaire(value);

    setFormData((prev) => ({ ...prev, [name]: filtered }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, filtered) }));
  };

  const validateAll = () => {
    const newErrors = {};
    ["idagt", "date", "heure", "motif"].forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => !msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    if (!validateAll()) return;

    // Combinaison date + heure en objets Date valides pour Prisma
    const dateTimeComplet = new Date(`${formData.date}T${formData.heure}:00`);

    const payload = {
      idagt: Number(formData.idagt),
      date: dateTimeComplet.toISOString(),
      heure: dateTimeComplet.toISOString(),
      motif: formData.motif,
      statut: formData.statut,
    };
    if (formData.commentaire) payload.commentaire = formData.commentaire;

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateRendezVous(rdv.idrdv, payload);
      } else {
        await createRendezVous(payload);
      }
      onCreated?.();
      onClose?.();
    } catch (err) {
      setGlobalError(err.message || "Impossible d'enregistrer le rendez-vous.");
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
            {isEditMode ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}
          </h2>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Fermer">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 font-medium">{globalError}</div>
          )}

          {/* Agent concerné */}
          <div>
            <label htmlFor="idagt" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Agent</label>
            <select
              id="idagt" name="idagt" value={formData.idagt} onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white ${errors.idagt ? "border-red-400" : "border-slate-300"}`}
            >
              <option value="">Sélectionner un agent</option>
              {agents.map((agent) => (
                <option key={agent.idagt} value={agent.idagt}>{agent.nom}</option>
              ))}
            </select>
            {errors.idagt && <p className="text-xs text-red-600 mt-1">{errors.idagt}</p>}
          </div>

          {/* Date + Heure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Date</label>
              <input
                id="date" name="date" type="date" value={formData.date} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.date ? "border-red-400" : isValid("date") ? "border-emerald-300" : "border-slate-300"}`}
              />
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="heure" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Heure</label>
              <input
                id="heure" name="heure" type="time" value={formData.heure} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.heure ? "border-red-400" : isValid("heure") ? "border-emerald-300" : "border-slate-300"}`}
              />
              {errors.heure && <p className="text-xs text-red-600 mt-1">{errors.heure}</p>}
            </div>
          </div>

          {/* Motif */}
          <div>
            <label htmlFor="motif" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Motif</label>
            <input
              id="motif" name="motif" type="text" value={formData.motif} onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${errors.motif ? "border-red-400" : isValid("motif") ? "border-emerald-300" : "border-slate-300"}`}
              placeholder="ex: Préparation d'un voyage"
            />
            {errors.motif && <p className="text-xs text-red-600 mt-1">{errors.motif}</p>}
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="statut" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Statut</label>
            <select
              id="statut" name="statut" value={formData.statut} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="En attente">En attente</option>
              <option value="Confirmé">Confirmé</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>

          {/* Commentaire */}
          <div>
            <label htmlFor="commentaire" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Commentaire (facultatif)</label>
            <textarea
              id="commentaire" name="commentaire" rows={3} value={formData.commentaire} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Précisions supplémentaires..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors order-2 sm:order-1">Annuler</button>
            <button type="submit" disabled={submitting} className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2">
              {submitting ? (isEditMode ? "Modification..." : "Création...") : (isEditMode ? "Enregistrer" : "Créer le rendez-vous")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RendezVousForm;