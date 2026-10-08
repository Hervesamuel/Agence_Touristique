import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMonProfil, updateMonProfil, changerMotDePasse } from "../services/profilService";
import { useLanguage } from "../contexts/LanguageContext";

function Profil() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    nom: "",
    tel: "",
    email: "",
    ville: "",
    genre: "Masculin",
    photo: "",
  });

  const [mdpData, setMdpData] = useState({
    mdpActuel: "",
    mdpNouveau: "",
    mdpConfirmer: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittingMdp, setSubmittingMdp] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [mdpError, setMdpError] = useState("");
  const [mdpSuccess, setMdpSuccess] = useState("");

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        const response = await getMonProfil();
        const profil = response.data || response;
        setFormData({
          nom: profil.nom || "",
          tel: profil.tel || "",
          email: profil.email || "",
          ville: profil.ville || "",
          genre: profil.genre || "Masculin",
          photo: profil.photo || "",
        });
      } catch (err) {
        setError(err.message || t("profil_erreur_chargement"));
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Conversion + redimensionnement de la photo choisie
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 400;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setFormData((prev) => ({ ...prev, photo: resizedDataUrl }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
  };

  // Soumission des informations personnelles
  const handleSubmitInfos = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      setSubmitting(true);
      const payload = { ...formData };
      if (!payload.photo) delete payload.photo;

      await updateMonProfil(payload);
      setSuccessMsg(t("profil_succes"));
    } catch (err) {
      setErrorMsg(err.message || t("profil_erreur_defaut"));
    } finally {
      setSubmitting(false);
    }
  };

    // Soumission du changement de mot de passe
    const handleSubmitMdp = async (e) => {
    e.preventDefault();
    setMdpError("");
    setMdpSuccess("");

    if (mdpData.mdpNouveau !== mdpData.mdpConfirmer) {
      setMdpError(t("err_mdp_non_identiques"));
      return;
    }
    if (mdpData.mdpNouveau.length < 8) {
      setMdpError(t("err_mdp_court"));
      return;
    }

    try {
      setSubmittingMdp(true);
      await changerMotDePasse(mdpData.mdpActuel, mdpData.mdpNouveau);
      setMdpSuccess(t("profil_mdp_succes"));
      setMdpData({ mdpActuel: "", mdpNouveau: "", mdpConfirmer: "" });
    } catch (err) {
      setMdpError(err.message || t("profil_erreur_defaut"));
    } finally {
      setSubmittingMdp(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
        {t("profil_chargement")}
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 m-6 rounded-xl border border-red-200 dark:border-red-800 font-medium">
        {error}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <Link
        to="/dashboard"
        className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-sm"
      >
        <span>←</span> <span>{t("retour_dashboard")}</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t("profil_titre")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
          {t("profil_soustitre")}
        </p>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm max-w-lg mb-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">{t("profil_infos_titre")}</h2>

        <form onSubmit={handleSubmitInfos} className="space-y-4">
          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl p-3 font-medium">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Photo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_photo_label")}
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden shrink-0">
                {formData.photo ? (
                  <img src={formData.photo} alt="Photo de profil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-slate-400">{formData.nom?.[0]}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-block px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                  {t("profil_choisir_photo")}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
                {formData.photo && (
                  <button type="button" onClick={handleRemovePhoto} className="block text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
                    {t("profil_retirer_photo")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_nom_label")}
            </label>
            <input
              id="nom" name="nom" type="text" value={formData.nom} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Téléphone + Ville */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tel" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {t("profil_tel_label")}
              </label>
              <input
                id="tel" name="tel" type="tel" value={formData.tel} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label htmlFor="ville" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                {t("profil_ville_label")}
              </label>
              <input
                id="ville" name="ville" type="text" value={formData.ville} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_email_label")}
            </label>
            <input
              id="email" name="email" type="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_genre_label")}
            </label>
            <select
              id="genre" name="genre" value={formData.genre} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="Masculin">{t("genre_masculin")}</option>
              <option value="Féminin">{t("genre_feminin")}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? t("profil_enregistrement_en_cours") : t("profil_enregistrer_btn")}
          </button>
        </form>
      </div>

      {/* Changement de mot de passe */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm max-w-lg">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4">{t("profil_mdp_titre")}</h2>

        <form onSubmit={handleSubmitMdp} className="space-y-4">
          {mdpSuccess && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl p-3 font-medium">
              {mdpSuccess}
            </div>
          )}
          {mdpError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 font-medium">
              {mdpError}
            </div>
          )}

          <div>
            <label htmlFor="mdpActuel" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_mdp_actuel_label")}
            </label>
            <input
              id="mdpActuel" type="password" value={mdpData.mdpActuel}
              onChange={(e) => setMdpData((prev) => ({ ...prev, mdpActuel: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="mdpNouveau" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_mdp_nouveau_label")}
            </label>
            <input
              id="mdpNouveau" type="password" value={mdpData.mdpNouveau}
              onChange={(e) => setMdpData((prev) => ({ ...prev, mdpNouveau: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label htmlFor="mdpConfirmer" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              {t("profil_mdp_confirmer_label")}
            </label>
            <input
              id="mdpConfirmer" type="password" value={mdpData.mdpConfirmer}
              onChange={(e) => setMdpData((prev) => ({ ...prev, mdpConfirmer: e.target.value }))}
              className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={submittingMdp}
            className="px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submittingMdp ? t("profil_mdp_changement_en_cours") : t("profil_mdp_changer_btn")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profil;