import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import { createReservation, getReservationById, updateReservation } from "../../services/reservationService";
import { getCircuits } from "../../services/circuitService";
import { useLanguage } from "../../contexts/LanguageContext";

// Limites de saisie : le clavier est bloqué au-delà (attribut maxLength)
const LIMITES = { nomclient: 100, emailclient: 100, telclient: 13, lieu: 100 };

// Formats acceptés
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Mobile malgache : 034 12 345 67 ou +261 34 12 345 67 (espaces retirés)
const REGEX_TEL = /^(\+261|0)3\d{8}$/;

// Date du jour au format YYYY-MM-DD (heure locale) pour l'attribut min
const aujourdhui = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

// Convertit une date ISO du serveur en YYYY-MM-DD pour les champs date
const versChampDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

// Nettoyage en direct : on refuse les caractères non autorisés dès la frappe
const nettoyer = {
  // Nom : lettres, espaces, tiret et apostrophe uniquement
  nomclient: (v) => v.replace(/[^\p{L}\s'-]/gu, ""),
  // Téléphone : chiffres, et un "+" seulement en première position
  telclient: (v) => v.replace(/\s/g, "").replace(/(?!^)\+/g, "").replace(/[^\d+]/g, ""),
};

// Validation complète avant envoi : retourne un objet { champ: "message" }
// (t = fonction de traduction, passée en paramètre car cette fonction est hors du composant)
const valider = (f, modeEdition, t) => {
  const e = {};
  if (!f.nomclient.trim()) e.nomclient = t("resform_err_nom");
  if (!f.telclient) e.telclient = t("resform_err_tel_obligatoire");
  else if (!REGEX_TEL.test(f.telclient)) e.telclient = t("resform_err_tel_invalide");
  if (f.emailclient && !REGEX_EMAIL.test(f.emailclient)) e.emailclient = t("resform_err_email");
  if (!f.idcircuit) e.idcircuit = t("resform_err_circuit");
  if (!f.lieu.trim()) e.lieu = t("resform_err_lieu");
  if (!f.datevoyage) e.datevoyage = t("resform_err_datevoyage_obligatoire");
  else if (!modeEdition && f.datevoyage < aujourdhui()) e.datevoyage = t("resform_err_datevoyage_passe");
  if (!f.dateretour) e.dateretour = t("resform_err_dateretour_obligatoire");
  else if (f.dateretour < f.datevoyage) e.dateretour = t("resform_err_dateretour_avant");
  return e;
};

function ReservationForm() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Identifiant présent dans l'URL = mode modification
  const { id } = useParams();
  const modeEdition = Boolean(id);

  const [circuits, setCircuits] = useState([]);
  const [erreurs, setErreurs] = useState({});
  const [erreurServeur, setErreurServeur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [form, setForm] = useState({
    nomclient: "", emailclient: "", telclient: "",
    idcircuit: "", lieu: "", datevoyage: "", dateretour: "",
  });

  // Chargement de la liste des circuits pour la liste déroulante
  useEffect(() => {
    getCircuits()
      .then((data) => setCircuits(Array.isArray(data) ? data : data.circuits || data.data || []))
      .catch((err) => setErreurServeur(err.message));
  }, []);

  // En modification : chargement de la réservation et pré-remplissage des champs
  useEffect(() => {
    if (!modeEdition) return;
    getReservationById(id)
      .then((res) => {
        console.log("RESERVATION A MODIFIER :", res); // à retirer quand tout fonctionne
        const r = res.data || res;
        setForm({
          nomclient: r.nomclient || "",
          emailclient: r.emailclient || "",
          telclient: r.telclient || "",
          idcircuit: r.idcircuit ? String(r.idcircuit) : "",
          lieu: r.lieu || "",
          datevoyage: versChampDate(r.datevoyage),
          dateretour: versChampDate(r.dateretour),
        });
      })
      .catch((err) => setErreurServeur(err.message));
  }, [id, modeEdition]);

  // Mise à jour d'un champ (avec nettoyage si une règle existe)
  const handleChange = (e) => {
    const { name, value } = e.target;
    const valeur = nettoyer[name] ? nettoyer[name](value) : value;
    setForm((prev) => ({ ...prev, [name]: valeur }));
    setErreurs((prev) => ({ ...prev, [name]: "" })); // efface l'erreur du champ modifié
  };

  // Envoi du formulaire (création ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = valider(form, modeEdition, t);
    setErreurs(e2);
    if (Object.keys(e2).length > 0) return; // on arrête s'il y a des erreurs

    const donnees = {
      nomclient: form.nomclient.trim(),
      emailclient: form.emailclient.trim() || null,
      telclient: form.telclient,
      idcircuit: Number(form.idcircuit),
      lieu: form.lieu.trim(),
      datevoyage: new Date(`${form.datevoyage}T00:00:00`).toISOString(),
      dateretour: new Date(`${form.dateretour}T00:00:00`).toISOString(),
    };

    try {
      setEnvoi(true);
      setErreurServeur("");
      if (modeEdition) await updateReservation(id, donnees);
      else await createReservation(donnees);
      navigate("/reservations");
    } catch (err) {
      setErreurServeur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  // Classes communes des champs (bordure rouge si erreur)
  const classeChamp = (nom) =>
    `w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${
      erreurs[nom] ? "border-red-500" : "border-slate-300 dark:border-slate-600"
    }`;

// Fermeture du formulaire : retour à la liste des réservations
  const fermerModal = () => navigate("/reservations");


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* En-tête de la Modal */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-white">{t("resform_titre")}</h1>
          <button onClick={fermerModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <X size={20} />
          </button>
        </div>

        {erreurServeur && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{erreurServeur}</div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom du client */}
          <div>
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_nom_label")}</label>
            <input name="nomclient" value={form.nomclient} onChange={handleChange} maxLength={LIMITES.nomclient} className={classeChamp("nomclient")} />
            <div className="flex justify-between text-xs mt-1">
              <span className="text-red-500">{erreurs.nomclient}</span>
              <span className="text-slate-400">{form.nomclient.length}/{LIMITES.nomclient}</span>
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_tel_label")}</label>
            <input name="telclient" value={form.telclient} onChange={handleChange} maxLength={LIMITES.telclient} inputMode="tel" placeholder="0341234567" className={classeChamp("telclient")} />
            <span className="text-xs text-red-500">{erreurs.telclient}</span>
          </div>

          {/* Email (optionnel) */}
          <div>
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_email_label")}</label>
            <input type="email" name="emailclient" value={form.emailclient} onChange={handleChange} maxLength={LIMITES.emailclient} className={classeChamp("emailclient")} />
            <span className="text-xs text-red-500">{erreurs.emailclient}</span>
          </div>

          {/* Circuit */}
          <div>
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_circuit_label")}</label>
            <select name="idcircuit" value={form.idcircuit} onChange={handleChange} className={classeChamp("idcircuit")}>
              <option value="">{t("resform_choisir")}</option>
              {circuits.map((c) => (
                <option key={c.idcircuit} value={c.idcircuit}>{c.nom || c.libelle || c.titre || `${t("resform_circuit_prefix")} #${c.idcircuit}`}</option>
              ))}
            </select>
            <span className="text-xs text-red-500">{erreurs.idcircuit}</span>
          </div>

          {/* Lieu */}
          <div className="md:col-span-2">
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_lieu_label")}</label>
            <input name="lieu" value={form.lieu} onChange={handleChange} maxLength={LIMITES.lieu} className={classeChamp("lieu")} />
            <span className="text-xs text-red-500">{erreurs.lieu}</span>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_datevoyage_label")}</label>
            <input type="date" name="datevoyage" value={form.datevoyage} onChange={handleChange} min={aujourdhui()} className={classeChamp("datevoyage")} />
            <span className="text-xs text-red-500">{erreurs.datevoyage}</span>
          </div>
          <div>
            <label className="block text-xs uppercase font-medium text-slate-500 dark:text-slate-400 mb-1">{t("resform_dateretour_label")}</label>
            <input type="date" name="dateretour" value={form.dateretour} onChange={handleChange} min={form.datevoyage || aujourdhui()} className={classeChamp("dateretour")} />
            <span className="text-xs text-red-500">{erreurs.dateretour}</span>
          </div>

          {/* Boutons de la Modal */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700 mt-2">
            <button type="button" onClick={fermerModal} className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
              {t("btn_annuler")}
            </button>
            <button type="submit" disabled={envoi} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 transition">
              {envoi ? t("resform_enregistrement") : t("resform_creer_btn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationForm;