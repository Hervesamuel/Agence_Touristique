import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

// Mapping route -> clés de traduction (titre + description)
const pageKeys = {
  "/dashboard": { titleKey: "navbar_dashboard_titre", descKey: "navbar_dashboard_description" },
  "/circuits": { titleKey: "navbar_circuits_titre", descKey: "navbar_circuits_description" },
  "/vehicules": { titleKey: "navbar_vehicules_titre", descKey: "navbar_vehicules_description" },
  "/chauffeurs": { titleKey: "navbar_chauffeurs_titre", descKey: "navbar_chauffeurs_description" },
  "/agents": { titleKey: "navbar_agents_titre", descKey: "navbar_agents_description" },
  "/reservations": { titleKey: "navbar_reservations_titre", descKey: "navbar_reservations_description" },
  "/rendez-vous": { titleKey: "navbar_rendezvous_titre", descKey: "navbar_rendezvous_description" },
  "/parametres": { titleKey: "navbar_parametres_titre", descKey: "navbar_parametres_description" },
  "/profil": { titleKey: "navbar_profil_titre", descKey: "navbar_profil_description" },
  "/notifications": { titleKey: "navbar_notifications_titre", descKey: "navbar_notifications_description" },
};

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const { t } = useLanguage();

  const currentPageKeys = pageKeys[location.pathname] || {
    titleKey: "navbar_defaut_titre",
    descKey: "navbar_defaut_description",
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      {/* Zone gauche */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xl"
          aria-label={t("navbar_menu_aria")}
        >
          ☰
        </button>

        {/* Informations de la page */}
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">{t(currentPageKeys.titleKey)}</h2>
          <p className="hidden sm:block text-sm text-slate-500 dark:text-slate-400 truncate">{t(currentPageKeys.descKey)}</p>
        </div>
      </div>

      {/* Zone droite */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `relative w-10 h-10 rounded-full flex items-center justify-center transition ${
              isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            }`
          }
          aria-label={t("navbar_notifications_aria")}
        >
          <span className="text-lg">🔔</span>
          {/* Badge des notifications */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
        </NavLink>

        {/* Profil */}
        <NavLink to="/profil" className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 dark:border-slate-700 pl-3 sm:pl-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-semibold shrink-0">
            RS
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t("navbar_role")}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("navbar_sous_role")}</p>
          </div>
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;