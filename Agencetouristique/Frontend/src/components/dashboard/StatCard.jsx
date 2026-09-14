// Rôle : Afficher un indicateur clé (KPI) avec une icône dynamique basée sur Lucide-React.

import { Globe, BusFront, UserRound, ClipboardList } from "lucide-react";

// Mapping associant chaque type de statistique au composant d'icône correspondant
const icons = { circuits: Globe, vehicules: BusFront, chauffeurs: UserRound, reservations: ClipboardList };

function StatCard({ title, value, description, type }) {
  // Récupération dynamique du composant d'icône selon la prop 'type'
  const Icon = icons[type];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
          <p className="text-xs text-slate-500 mt-2">{description}</p>
        </div>
        {/* Rendu conditionnel : affiche l'icône seulement si le type est reconnu */}
        <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
}

export default StatCard;