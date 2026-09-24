import { NavLink, useLocation } from "react-router-dom";

// Informations affichées selon la page
const pageInformations = {
  "/dashboard": { title: "Dashboard", description: "Vue d'ensemble de votre agence" },
  "/circuits": { title: "Circuits", description: "Gestion des circuits touristiques" },
  "/vehicules": { title: "Véhicules", description: "Gestion des véhicules de l'agence" },
  "/chauffeurs": { title: "Chauffeurs", description: "Gestion des chauffeurs" },
  "/agents": { title: "Agents", description: "Gestion des agents de l'agence" },
  "/reservations": { title: "Réservations", description: "Gestion des réservations" },
  "/rendez-vous": { title: "Rendez-vous", description: "Gestion des rendez-vous" },
  "/parametres": { title: "Paramètres", description: "Configuration de la plateforme" },
  "/profil": { title: "Mon profil", description: "Gestion de votre profil" },
  "/notifications": { title: "Notifications", description: "Consultez vos notifications" },
};

function Navbar({ onMenuClick }) {
  const location = useLocation();

  const currentPage = pageInformations[location.pathname] || {
    title: "AgenceTouristique",
    description: "Gestion de plateforme",
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
      {/* Zone gauche */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600 text-xl"
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>

        {/* Informations de la page */}
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{currentPage.title}</h2>
          <p className="hidden sm:block text-sm text-slate-500 truncate">{currentPage.description}</p>
        </div>
      </div>

      {/* Zone droite */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `relative w-10 h-10 rounded-full flex items-center justify-center transition ${
              isActive ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-100 text-slate-600"
            }`
          }
          aria-label="Notifications"
        >
          <span className="text-lg">🔔</span>
          {/* Badge des notifications */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </NavLink>

        {/* Profil */}
        <NavLink to="/profil" className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 pl-3 sm:pl-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold shrink-0">
            RS
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-slate-800">Responsable</p>
            <p className="text-xs text-slate-500">Responsable d'agence</p>
          </div>
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;
