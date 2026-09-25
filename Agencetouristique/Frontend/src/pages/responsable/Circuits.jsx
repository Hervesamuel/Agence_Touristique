import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCircuits, updateCircuit } from "../../services/circuitService";
import CircuitForm from "./CircuitForm";

function Circuits() {
  const [circuits, setCircuits] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCircuits = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getCircuits();
        setCircuits(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les circuits.");
      } finally {
        setLoading(false);
      }
    };
    fetchCircuits();
  }, []);

  // Bascule du statut de disponibilité d'un circuit
  const handleToggleStatus = async (circuit) => {
    const nextStatus = circuit.status === "Disponible" ? "Indisponible" : "Disponible";
    const actionLabel = nextStatus === "Disponible" ? "rendre disponible" : "rendre indisponible";

    const confirmed = window.confirm(
      `Voulez-vous ${actionLabel} le circuit "${circuit.nom}" ?`
    );
    if (!confirmed) return;

    try {
      setTogglingId(circuit.idcircuit);
      const response = await updateCircuit(circuit.idcircuit, { status: nextStatus });
      const updatedCircuit = response.data || response;

      setCircuits((prev) =>
        prev.map((c) =>
          c.idcircuit === circuit.idcircuit ? { ...c, status: updatedCircuit.status } : c
        )
      );
    } catch (err) {
      alert(err.message || "Impossible de modifier le statut de ce circuit.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCircuitCreated = () => {
    const fetchCircuits = async () => {
      try {
        const response = await getCircuits();
        setCircuits(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les circuits.");
      }
    };
    fetchCircuits();
  };

  const filteredCircuits = circuits.filter((circuit) => {
    const searchValue = search.toLowerCase();
    return (
      circuit.nom?.toLowerCase().includes(searchValue) ||
      circuit.destination?.toLowerCase().includes(searchValue)
    );
  });

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Chargement des circuits...</div>;

  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200 font-medium">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>Retour au Dashboard</span>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Circuits</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Gestion des circuits de l'agence</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          <span>＋</span> Ajouter un circuit
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="w-full sm:max-w-md">
          <label htmlFor="search" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Rechercher un circuit</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom ou destination..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {filteredCircuits.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Aucun circuit trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCircuits.map((circuit) => {
            const isAvailable = circuit.status === "Disponible";
            const isToggling = togglingId === circuit.idcircuit;

            return (
              <div
                key={circuit.idcircuit}
                className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Badge de statut */}
                <span
                  className={`absolute top-3 right-14 text-xxs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {circuit.status}
                </span>

                {/* Bouton bascule disponibilité */}
                <button
                  type="button"
                  onClick={() => handleToggleStatus(circuit)}
                  disabled={isToggling}
                  aria-label={isAvailable ? `Rendre indisponible ${circuit.nom}` : `Rendre disponible ${circuit.nom}`}
                  title={isAvailable ? "Rendre indisponible" : "Rendre disponible"}
                  className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAvailable
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

                <div className="flex items-start gap-3 mb-3 pr-8 mt-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    🗺️
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{circuit.nom}</p>
                    <p className="text-xs text-slate-500 truncate">{circuit.destination}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{circuit.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span>👥</span>
                  <span>{circuit.capacite} places</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CircuitForm onClose={() => setShowForm(false)} onCreated={handleCircuitCreated} />
      )}
    </div>
  );
}

export default Circuits;