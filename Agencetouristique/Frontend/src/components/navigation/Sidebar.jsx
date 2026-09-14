// Fichier: src/components/layout/Sidebar.jsx
// Rôle : Composant de navigation latérale pour l'accès aux différents modules de l'application.

// Structure de données décrivant les liens du menu principal
const mainNav = [
  { label: 'Dashboard', icon: '▦', active: true },
  { label: 'Circuits', icon: '⌁' },
  { label: 'Véhicules', icon: '▣' },
  { label: 'Chauffeurs', icon: '♙' },
  { label: 'Agents', icon: '♙' },
  { label: 'Réservations', icon: '▤' },
  { label: 'Rendez-vous', icon: '◷' },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* En-tête / Logo de l'agence */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold">AgenceTouristique</h1>
          <p className="text-xs text-slate-400 mt-1">Gestion de plateforme</p>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">Principal</p>
        <div className="space-y-1">
          {/* Génération dynamique des boutons de navigation via un .map() */}
          {mainNav.map((item) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${item.active ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>

        {/* Section Système / Paramètres */}
        <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3 mt-8">Système</p>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white text-sm">
            <span>⚙</span>Paramètres
          </button>
        </div>
      </nav>

      {/* Profil de l'utilisateur connecté (Pied de page de la Sidebar) */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-semibold">RS</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Responsable</p>
            <p className="text-xs text-slate-400 truncate">Administrateur</p>
          </div>
          <button className="text-slate-400 hover:text-white">⋮</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;