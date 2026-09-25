import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChauffeurs, updateChauffeur } from "../../services/chauffeurServices";
import ChauffeurForm from "./ChauffeurForm";

function Chauffeurs() {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchChauffeurs = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getChauffeurs();
        setChauffeurs(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les chauffeurs.");
      } finally {
        setLoading(false);
      }
    };
    fetchChauffeurs();
  }, []);

  // Activation / désactivation d'un chauffeur
  const handleToggleStatus = async (chauffeur) => {
    const nextStatut = chauffeur.statut === "Actif" ? "Inactif" : "Actif";
    const actionLabel = nextStatut === "Actif" ? "activer" : "désactiver";

    const confirmed = window.confirm(
      `Voulez-vous ${actionLabel} le compte de "${chauffeur.nom}" ?`
    );
    if (!confirmed) return;

    try {
      setTogglingId(chauffeur.idchauffeur);
      const response = await updateChauffeur(chauffeur.idchauffeur, { statut: nextStatut });
      const updatedChauffeur = response.data || response;

      setChauffeurs((prev) =>
        prev.map((c) =>
          c.idchauffeur === chauffeur.idchauffeur ? { ...c, statut: updatedChauffeur.statut } : c
        )
      );
    } catch (err) {
      alert(err.message || "Impossible de modifier le statut de ce chauffeur.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleChauffeurCreated = () => {
    const fetchChauffeurs = async () => {
      try {
        const response = await getChauffeurs();
        setChauffeurs(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les chauffeurs.");
      }
    };
    fetchChauffeurs();
  };

  const filteredChauffeurs = chauffeurs.filter((chauffeur) => {
    const searchValue = search.toLowerCase();
    return (
      chauffeur.nom?.toLowerCase().includes(searchValue) ||
      chauffeur.email?.toLowerCase().includes(searchValue)
    );
  });

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Chargement des chauffeurs...</div>;

  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200 font-medium">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>Retour au Dashboard</span>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Chauffeurs</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Gestion des chauffeurs de l'agence</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          <span>＋</span> Ajouter un chauffeur
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="w-full sm:max-w-md">
          <label htmlFor="search" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Rechercher un chauffeur</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom ou email..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {filteredChauffeurs.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Aucun chauffeur trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChauffeurs.map((chauffeur) => {
            const isActive = chauffeur.statut === "Actif";
            const isToggling = togglingId === chauffeur.idchauffeur;

            return (
              <div
                key={chauffeur.idchauffeur}
                className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Badge de statut */}
                <span
                  className={`absolute top-3 right-14 text-xxs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {chauffeur.statut}
                </span>

                {/* Bouton activer / désactiver */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(chauffeur)}
                  disabled={isToggling}
                  aria-label={isActive ? `Désactiver ${chauffeur.nom}` : `Activer ${chauffeur.nom}`}
                  title={isActive ? "Désactiver ce compte" : "Activer ce compte"}
                  className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActive
                      ? "text-emerald-600 hover:bg-red-50 hover:text-red-600"
                      : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {isToggling ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                  )}
                </button>

                <div className="flex items-center gap-3 mb-3 pr-8 mt-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    {chauffeur.nom?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{chauffeur.nom}</p>
                    <p className="text-xs text-slate-500 truncate">{chauffeur.email}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ChauffeurForm onClose={() => setShowForm(false)} onCreated={handleChauffeurCreated} />
      )}
    </div>
  );
}

export default Chauffeurs;