import { useState, useEffect } from "react";
import { createRendezVous, updateRendezVous } from "../../services/rendezVousService";
import { getAgents } from "../../services/agentService";
import { useLanguage } from "../../contexts/LanguageContext";

// rdv (optionnel) : si fourni, le formulaire passe en mode modification
function RendezVousForm({ rdv, onClose, onCreated }) {
  const { t } = useLanguage();
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

  // Date minimale autorisée : demain (aujourd'hui + 1 jour)
  const getMinDate = () => {
    const demain = new Date();
    demain.setDate(demain.getDate() + 1);
    return demain.toISOString().slice(0, 10); // format "YYYY-MM-DD" attendu par <input type="date">
  };
  const minDate = getMinDate();

  // Chargement de la liste des agents pour le select
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await getAgents();
        setAgents(response.data || response || []);
      } catch {
        setGlobalError(t("rdvform_erreur_agents"));
      }
    };
    fetchAgents();
  }, []);

  // Filtre motif : lettres, chiffres, ponctuation courante
  const filterMotif = (v) => v.replace(/[^a-zA-ZÀ-ÿ0-9\s'.,-]/g, "").slice(0, 150);
  const filterCommentaire = (v) => v.slice(0, 500);

  // Validation par champ
  const validateField = (name, value) => {
    if (name === "idagt" && !value) return t("rdvform_err_agent_requis");
    if (name === "date" && !value) return t("rdvform_err_date_requise");
    if (name === "date" && value < minDate) return t("rdvform_err_date_min");
    if (name === "heure" && !value) return t("rdvform_err_heure_requise");
    if (name === "motif" && value.trim().length < 3) return t("rdvform_err_motif_court");
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
      setGlobalError(err.message || t("rdvform_erreur_enregistrement"));
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = (name) => formData[name].length > 0 && !errors[name];

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-800 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {isEditMode ? t("rdvform_titre_modifier") : t("rdvform_titre_ajouter")}
          </h2>
          <button type="button" onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" aria-label={t("rdvform_fermer_aria")}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-5 space-y-4">
          {globalError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 font-medium">{globalError}</div>
          )}

          {/* Agent concerné */}
          <div>
            <label htmlFor="idagt" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("rdvform_label_agent")}</label>
            <select
              id="idagt" name="idagt" value={formData.idagt} onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${errors.idagt ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-600"}`}
            >
              <option value="">{t("rdvform_select_agent_defaut")}</option>
              {agents.map((agent) => (
                <option key={agent.idagt} value={agent.idagt}>{agent.nom}</option>
              ))}
            </select>
            {errors.idagt && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.idagt}</p>}
          </div>

          {/* Date + Heure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("rdvform_label_date")}</label>
              <input
                id="date" name="date" type="date" value={formData.date} onChange={handleChange}
                min={minDate}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${errors.date ? "border-red-400 dark:border-red-500" : isValid("date") ? "border-emerald-300 dark:border-emerald-600" : "border-slate-300 dark:border-slate-600"}`}
              />
              {errors.date && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="heure" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("rdvform_label_heure")}</label>
              <input
                id="heure" name="heure" type="time" value={formData.heure} onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${errors.heure ? "border-red-400 dark:border-red-500" : isValid("heure") ? "border-emerald-300 dark:border-emerald-600" : "border-slate-300 dark:border-slate-600"}`}
              />
              {errors.heure && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.heure}</p>}
            </div>
          </div>

          {/* Motif */}
          <div>
            <label htmlFor="motif" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("rdvform_label_motif")}</label>
            <input
              id="motif" name="motif" type="text" value={formData.motif} onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${errors.motif ? "border-red-400 dark:border-red-500" : isValid("motif") ? "border-emerald-300 dark:border-emerald-600" : "border-slate-300 dark:border-slate-600"}`}
              placeholder={t("rdvform_placeholder_motif")}
            />
            {errors.motif && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{errors.motif}</p>}
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="statut" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("rdvform_label_statut")}</label>
            <select
              id="statut" name="statut" value={formData.statut} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="En attente">{t("rdvform_statut_en_attente")}</option>
              <option value="Confirmé">{t("rdvform_statut_confirme")}</option>
              <option value="Annulé">{t("rdvform_statut_annule")}</option>
            </select>
          </div>

          {/* Commentaire */}
          <div>
            <label htmlFor="commentaire" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">{t("rdvform_label_commentaire")}</label>
            <textarea
              id="commentaire" name="commentaire" rows={3} value={formData.commentaire} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t("rdvform_placeholder_commentaire")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors order-2 sm:order-1">{t("rdvform_btn_annuler")}</button>
            <button type="submit" disabled={submitting} className="w-full sm:w-auto flex-1 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2">
              {submitting
                ? (isEditMode ? t("rdvform_btn_modification") : t("rdvform_btn_creation"))
                : (isEditMode ? t("rdvform_btn_enregistrer") : t("rdvform_btn_creer"))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default RendezVousForm;