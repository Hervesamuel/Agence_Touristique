import { NavLink } from "react-router-dom";

// Structure des liens du menu principal
const mainNav = [
  { label: "Dashboard", icon: "▦", path: "/dashboard" },
  { label: "Circuits", icon: "⌁", path: "/circuits" },
  { label: "Véhicules", icon: "▣", path: "/vehicules" },
  { label: "Chauffeurs", icon: "♙", path: "/chauffeurs" },
  { label: "Agents", icon: "♙", path: "/agents" },
  { label: "Réservations", icon: "▤", path: "/reservations" },
  { label: "Rendez-vous", icon: "◷", path: "/rendez-vous" },
];

function Sidebar({ isOpen, onClose }) {
  // Fermeture du menu mobile après navigation
  const handleNavigation = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Fond sombre sur mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* En-tête de la plateforme */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div>
            <h1 className="text-xl font-bold">AgenceTouristique</h1>
            <p className="text-xs text-slate-400 mt-1">Gestion de plateforme</p>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">Principal</p>
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                    isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Section système */}
          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3 mt-8">Système</p>
          <NavLink
            to="/parametres"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="w-5 text-center">⚙</span>
            <span>Paramètres</span>
          </NavLink>
        </nav>

        {/* Profil de l'utilisateur connecté */}
        <div className="border-t border-slate-800 p-4 shrink-0">
          <NavLink
            to="/profil"
            onClick={handleNavigation}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-800 transition"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-semibold shrink-0">
              RS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Responsable</p>
              <p className="text-xs text-slate-400 truncate">Administrateur</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;