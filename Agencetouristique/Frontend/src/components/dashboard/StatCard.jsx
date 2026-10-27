// Rôle : Afficher un indicateur clé (KPI) avec une icône dynamique basée sur Lucide-React.

import { Globe, BusFront, UserRound, ClipboardList } from "lucide-react";

// Mapping associant chaque type de statistique au composant d'icône correspondant
const icons = { circuits: Globe, vehicules: BusFront, chauffeurs: UserRound, reservations: ClipboardList };

// Couleur d'accent de chaque type (présentation uniquement) :
// "tile" = pastille de l'icône, "bar" = liseré en haut de la carte
const accents = {
  circuits: {
    tile: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-emerald-600/15 dark:ring-emerald-400/15",
    bar: "from-emerald-600 to-emerald-300 dark:from-emerald-500 dark:to-emerald-700",
  },
  vehicules: {
    tile: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 ring-teal-600/15 dark:ring-teal-400/15",
    bar: "from-teal-600 to-teal-300 dark:from-teal-500 dark:to-teal-700",
  },
  chauffeurs: {
    tile: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 ring-amber-600/15 dark:ring-amber-400/15",
    bar: "from-amber-500 to-amber-300 dark:from-amber-500 dark:to-amber-700",
  },
  reservations: {
    tile: "bg-orange-50 dark:bg-orange-900/30 text-[#B85C38] dark:text-orange-400 ring-orange-600/15 dark:ring-orange-400/15",
    bar: "from-[#B85C38] to-orange-300 dark:from-orange-500 dark:to-orange-700",
  },
};

function StatCard({ title, value, description, type }) {
  // Récupération dynamique du composant d'icône selon la prop 'type'
  const Icon = icons[type];

  // Couleurs d'accent selon la prop 'type' (par défaut : vert)
  const accent = accents[type] || accents.circuits;

  return (
    <div className="group relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border border-[#E9E4D6] dark:border-slate-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Liseré coloré en haut de la carte */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.bar}`}
      />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#6B7268] dark:text-slate-400">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight tabular-nums text-[#232821] dark:text-slate-100 mt-2">{value}</h3>
          <p className="text-xs text-[#8B9186] dark:text-slate-500 mt-2">{description}</p>
        </div>

        {/* Rendu conditionnel : affiche l'icône seulement si le type est reconnu */}
        <div className={`w-12 h-12 shrink-0 rounded-xl ring-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${accent.tile}`}>
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
      </div>
    </div>
  );
}

export default StatCard;