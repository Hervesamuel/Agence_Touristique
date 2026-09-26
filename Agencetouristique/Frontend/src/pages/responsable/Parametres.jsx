import { Link } from "react-router-dom";
import useFontSize from "../../hooks/useFontSize";

function Parametres() {
  const { fontSize, changeFontSize } = useFontSize();

  const options = [
    { value: "petit", label: "Petit", preview: "text-xs" },
    { value: "normal", label: "Normal", preview: "text-sm" },
    { value: "grand", label: "Grand", preview: "text-base" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>Retour au Dashboard</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">Personnalisez votre expérience</p>
      </div>

      {/* Section taille de police */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-md">
        <h2 className="font-semibold text-slate-800 mb-1">Taille du texte</h2>
        <p className="text-sm text-slate-500 mb-4">Ajustez la taille du texte dans toute l'application</p>

        <div className="grid grid-cols-3 gap-3">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => changeFontSize(option.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                fontSize === option.value
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className={`${option.preview} font-bold text-slate-700`}>Aa</span>
              <span className="text-xs font-semibold text-slate-600">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Parametres;