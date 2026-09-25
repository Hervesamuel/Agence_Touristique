import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVehicules, updateVehicule } from "../../services/vehiculeService";
import VehiculeForm from "./VehiculeForm";

function Vehicules() {
  const [vehicules, setVehicules] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [minCapacite, setMinCapacite] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // Véhicule actuellement en cours de modification (null = aucun)
  const [editingVehicule, setEditingVehicule] = useState(null);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getVehicules();
        setVehicules(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les véhicules.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicules();
  }, []);

  // Bascule du statut de disponibilité
  const handleToggleStatus = async (vehicule) => {
    const nextStatus = vehicule.status === "Disponible" ? "Indisponible" : "Disponible";
    const confirmed = window.confirm(`Marquer "${vehicule.immatriculation}" comme ${nextStatus.toLowerCase()} ?`);
    if (!confirmed) return;

    try {
      setTogglingId(vehicule.idveh);
      const response = await updateVehicule(vehicule.idveh, { status: nextStatus });
      const updated = response.data || response;
      setVehicules((prev) => prev.map((v) => (v.idveh === vehicule.idveh ? { ...v, status: updated.status } : v)));
    } catch (err) {
      alert(err.message || "Impossible de modifier le statut de ce véhicule.");
    } finally {
      setTogglingId(null);
    }
  };

  // Rafraîchissement de la liste après création ou modification
  const handleVehiculeSaved = () => {
    const fetchVehicules = async () => {
      try {
        const response = await getVehicules();
        setVehicules(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les véhicules.");
      }
    };
    fetchVehicules();
  };

  // Filtrage combiné : texte + statut + capacité minimale
  const filteredVehicules = vehicules.filter((v) => {
    const searchValue = search.toLowerCase();
    const matchSearch =
      v.immatriculation?.toLowerCase().includes(searchValue) ||
      v.marque?.toLowerCase().includes(searchValue) ||
      v.modele?.toLowerCase().includes(searchValue);

    const matchStatus = statusFilter === "Tous" || v.status === statusFilter;
    const matchCapacite = minCapacite === "" || v.capacite >= Number(minCapacite);

    return matchSearch && matchStatus && matchCapacite;
  });

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Chargement des véhicules...</div>;
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200 font-medium">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>Retour au Dashboard</span>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Véhicules</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Gestion des véhicules de l'agence</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all">
          <span>＋</span> Ajouter un véhicule
        </button>
      </div>

      {/* Zone de recherche et filtres */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Rechercher</label>
          <input
            id="search" type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Immatriculation, marque, modèle..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="statusFilter" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Statut</label>
          <select
            id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          >
            <option value="Tous">Tous</option>
            <option value="Disponible">Disponible</option>
            <option value="Indisponible">Indisponible</option>
          </select>
        </div>
        <div>
          <label htmlFor="minCapacite" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Places min.</label>
          <input
            id="minCapacite" type="text" inputMode="numeric" value={minCapacite}
            onChange={(e) => setMinCapacite(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="ex: 10"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {filteredVehicules.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">Aucun véhicule trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVehicules.map((vehicule) => {
            const isAvailable = vehicule.status === "Disponible";
            const isToggling = togglingId === vehicule.idveh;

            return (
              <div key={vehicule.idveh} className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                {/* Badge de statut */}
                <span className={`absolute top-3 right-24 text-xxs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {vehicule.status}
                </span>

                {/* Bouton modifier */}
                <button
                  type="button"
                  onClick={() => setEditingVehicule(vehicule)}
                  title="Modifier ce véhicule"
                  className="absolute top-3 right-14 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                {/* Bouton bascule disponibilité */}
                <button
                  type="button" onClick={() => handleToggleStatus(vehicule)} disabled={isToggling}
                  title={isAvailable ? "Rendre indisponible" : "Rendre disponible"}
                  className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAvailable ? "text-emerald-600 hover:bg-red-50 hover:text-red-600" : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"}`}
                >
                  {isToggling ? (
                    <span className="w-4 h-4 border-2 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                  )}
                </button>

                {/* Photo du véhicule, sous les boutons du haut */}
                <div className="w-full h-32 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden mb-4 mt-8 flex items-center justify-center">
                  {vehicule.photo ? (
                    <img
                      src={vehicule.photo}
                      alt={`${vehicule.marque} ${vehicule.modele}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">🚐</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{vehicule.marque} {vehicule.modele}</p>
                    <p className="text-xs text-slate-500 truncate">{vehicule.immatriculation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span>👥</span><span>{vehicule.capacite} places</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <VehiculeForm onClose={() => setShowForm(false)} onCreated={handleVehiculeSaved} />
      )}

      {editingVehicule && (
        <VehiculeForm
          vehicule={editingVehicule}
          onClose={() => setEditingVehicule(null)}
          onCreated={handleVehiculeSaved}
        />
      )}
    </div>
  );
}

export default Vehicules;