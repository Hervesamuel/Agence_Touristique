import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  LayoutDashboard,
  Route,
  Car,
  Contact,
  UserCheck,
  CalendarCheck,
  Clock,
  BarChart3,
  LogOut,
} from "lucide-react";
import { getUser, logout } from "../../services/authService";
import useProfil from "../../hooks/useProfil";
import { peutAcceder } from "../../utils/roleAccess";
// Structure des liens du menu principal
const mainNav = [
  {
    key: "nav_dashboard",
    icon: <LayoutDashboard size={20} className="text-green-400" />,
    path: "/dashboard",
  },
  {
    key: "nav_circuits",
    icon: <Route size={20} className="text-green-400 hover:text-green-400" />,
    path: "/circuits",
  },
  {
    key: "nav_vehicules",
    icon: <Car size={25} className="text-green-400" />,
    path: "/vehicules",
  },
  {
    key: "nav_chauffeurs",
    icon: <Contact size={20} className="text-green-400" />,
    path: "/chauffeurs",
  },
  {
    key: "nav_agents",
    icon: <UserCheck size={25} className="text-green-400" />,
    path: "/agents",
  },
  {
    key: "nav_reservations",
    icon: <CalendarCheck size={20} className="text-green-400" />,
    path: "/reservations",
  },
  {
    key: "nav_rendezvous",
    icon: <Clock size={20} className="text-green-400" />,
    path: "/rendez-vous",
  },
  {
    key: "nav_statistiques",
    icon: <BarChart3 size={20} className="text-yellow-400" />,
    path: "/statistiques",
  },
];

function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();

  // Navigation
  const navigate = useNavigate();

  // Informations de l'utilisateur connecté
  const user = getUser();
  const role = user?.role;

  // Nom et photo du profil, actualisés automatiquement toutes les 3 secondes
  const profil = useProfil();

  // Seuls les liens autorisés pour le rôle connecté sont affichés
  const liensAutorises = mainNav.filter((item) => peutAcceder(role, item.path));
  const roleLabel = role === "RESPONSABLE" ? t("sidebar_titre_role") : t(`role_${(role || "").toLowerCase()}`);

  // Fermeture du menu mobile après navigation
  const handleNavigation = () => {
    if (onClose) {
      onClose();
    }
  };

  // Déconnexion
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Fond sombre sur mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* En-tête de la plateforme */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div>
            <h1 className="text-xl font-bold">
              MADATours
            </h1>

            <p className="text-xs text-slate-400 mt-1">
              Madagascar
            </p>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">

          {/* Section principale */}
          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">
            {t("nav_principal")}
          </p>

          <div className="space-y-1">
            {liensAutorises.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="w-5 text-center">
                  {item.icon}
                </span>

                <span>
                  {t(item.key)}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Section système */}
          <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3 mt-8">
            {t("nav_systeme")}
          </p>

          <NavLink
            to="/parametres"
            onClick={handleNavigation}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="w-5.5 text-center text-xl leading-none">
              ⚙
            </span>

            <span>
              {t("nav_parametres")}
            </span>
          </NavLink>
        </nav>

        {/* Profil de l'utilisateur connecté */}
        <div className="border-t border-slate-800 p-4 shrink-0">

          {/* Accès au profil */}
          <NavLink
            to="/profil"
            onClick={handleNavigation}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-800 transition"
          >
            {/* Photo ou initiale */}
            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-semibold shrink-0 overflow-hidden">
              {profil.photo ? (
                <img
                  src={profil.photo}
                  alt={profil.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                profil.nom?.[0]?.toUpperCase()
              )}
            </div>

            {/* Informations utilisateur */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profil.nom || user?.nom || "Utilisateur"}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {roleLabel}
              </p>
            </div>
          </NavLink>

          {/* Bouton de déconnexion */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 mt-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={19} />

            <span>
              Déconnexion
            </span>
          </button>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;