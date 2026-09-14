// Rôle : Afficher le titre de la page courante, les notifications et le profil de l'utilisateur.

function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      {/* Intitulé de la vue actuelle */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Vue d'ensemble de votre agence</p>
      </div>

      {/* Zone d'actions à droite : Notifications et Profil */}
      <div className="flex items-center gap-5">
        {/* Bouton de notifications avec badge rouge d'alerte */}
        <button className="relative w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600">
          🔔
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Badge utilisateur connecté */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">RS</div>
          <div>
            <p className="text-sm font-medium text-slate-800">Responsable</p>
            <p className="text-xs text-slate-500">Responsable d'agence</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;