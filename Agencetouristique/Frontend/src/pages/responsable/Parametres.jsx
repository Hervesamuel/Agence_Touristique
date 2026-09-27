import { Link } from "react-router-dom";
import useFontSize from "../../hooks/useFontSize";
import useTheme from "../../hooks/useTheme";
import { useLanguage } from "../../contexts/LanguageContext";

function Parametres() {
  const { fontSize, changeFontSize } = useFontSize();
  const { theme, changeTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const options = [
    { value: "petit", label: t("taille_petit"), preview: "text-xs" },
    { value: "normal", label: t("taille_normal"), preview: "text-sm" },
    { value: "grand", label: t("taille_grand"), preview: "text-base" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>{t("retour_dashboard")}</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{t("parametres_titre")}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{t("parametres_soustitre")}</p>
      </div>

      {/* Section taille de police */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm max-w-md">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{t("taille_texte_titre")}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("taille_texte_soustitre")}</p>

        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => changeFontSize(option.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                fontSize === option.value
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
              }`}
            >
              <span className={`${option.preview} font-bold text-slate-700 dark:text-slate-200`}>Aa</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section thème */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm max-w-md mt-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{t("apparence_titre")}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("apparence_soustitre")}</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => changeTheme("clair")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              theme === "clair"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-2xl">☀️</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("theme_clair")}</span>
          </button>

          <button
            type="button"
            onClick={() => changeTheme("sombre")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              theme === "sombre"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-2xl">🌙</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("theme_sombre")}</span>
          </button>
        </div>
      </div>

      {/* Section langue */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm max-w-md mt-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{t("langue_titre")}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("langue_soustitre")}</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => changeLanguage("fr")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              language === "fr"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-2xl">🇫🇷</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("langue_fr")}</span>
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("mg")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
              language === "en"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-200 dark:border-slate-600 hover:border-slate-300"
            }`}
          >
            <span className="text-2xl">MG</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t("Malagasy")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Parametres;