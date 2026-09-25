import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRendezVous, updateRendezVous } from "../../services/rendezVousService";
import { getAgents } from "../../services/agentService";
import RendezVousForm from "./RendezVousForm";

function RendezVous() {
  const [rendezVous, setRendezVous] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRdv, setEditingRdv] = useState(null);

  // Récupération des rendez-vous et des agents (pour afficher le nom lié à idagt)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [rdvResponse, agentsResponse] = await Promise.all([getRendezVous(), getAgents()]);
        setRendezVous(rdvResponse.data || rdvResponse || []);
        setAgents(agentsResponse.data || agentsResponse || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les rendez-vous.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Association idagt -> nom de l'agent
  const getAgentNom = (idagt) => agents.find((a) => a.idagt === idagt)?.nom || `Agent #${idagt}`;

  // Rafraîchissement après création ou modification
  const handleSaved = () => {
    const fetchRdv = async () => {
      try {
        const response = await getRendezVous();
        setRendezVous(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les rendez-vous.");
      }
    };
    fetchRdv();
  };

  // Changement rapide de statut (ex: confirmer ou annuler)
  const handleChangeStatut = async (rdv, nouveauStatut) => {
    try {
      const response = await updateRendezVous(rdv.idrdv, { statut: nouveauStatut });
      const updated = response.data || response;
      setRendezVous((prev) => prev.map((r) => (r.idrdv === rdv.idrdv ? { ...r, statut: updated.statut } : r)));
    } catch (err) {
      alert(err.message || "Impossible de modifier le statut.");
    }
  };

  const getStatutStyle = (statut) => {
    if (statut === "Confirmé") return "bg-emerald-100 text-emerald-700";
    if (statut === "Annulé") return "bg-red-100 text-red-600";
    return "bg-amber-100 text-amber-700";
  };

  // Filtrage : motif + statut, tri par date croissante
  const filteredRdv = rendezVous
    .filter((rdv) => {
      const matchSearch = rdv.motif?.toLowerCase().includes(search.toLowerCase());
      const matchStatut = statutFilter === "Tous" || rdv.statut === statutFilter;
      return matchSearch && matchStatut;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const formatHeure = (h) => new Date(h).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Chargement des rendez-vous...</div>;
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200 font-medium">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>Retour au Dashboard</span>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Rendez-vous</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Gestion des rendez-vous des agents</p>
        </div>
        {/* <button type="button" onClick={() => setShowForm(true)} className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all">
          <span>＋</span> Ajouter un rendez-vous
        </button> */}
      </div>

      {/* Recherche + filtre statut */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Rechercher</label>
          <input
            id="search" type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Motif du rendez-vous..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="statutFilter" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Statut</label>
          <select
            id="statutFilter" value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          >
            <option value="Tous">Tous</option>
            <option value="En attente">En attente</option>
            <option value="Confirmé">Confirmé</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
      </div>

      {filteredRdv.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">Aucun rendez-vous trouvé.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRdv.map((rdv) => (
            <div key={rdv.idrdv} className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{rdv.motif}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{getAgentNom(rdv.idagt)}</p>
                </div>
                <button
                  type="button" onClick={() => setEditingRdv(rdv)} title="Modifier"
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-slate-600 mb-3">{formatDate(rdv.date)} à {formatHeure(rdv.heure)}</p>

              <div className="flex items-center justify-between">
                <span className={`text-xxs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${getStatutStyle(rdv.statut)}`}>
                  {rdv.statut}
                </span>

                {/* Actions rapides selon le statut actuel */}
                {rdv.statut === "En attente" && (
                  <div className="flex gap-1.5">
                    <button onClick={() => handleChangeStatut(rdv, "Confirmé")} className="text-xs font-semibold text-emerald-600 hover:underline">Confirmer</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={() => handleChangeStatut(rdv, "Annulé")} className="text-xs font-semibold text-red-600 hover:underline">Annuler</button>
                  </div>
                )}
              </div>

              {rdv.commentaire && (
                <p className="text-xs text-slate-400 mt-3 line-clamp-2">{rdv.commentaire}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && <RendezVousForm onClose={() => setShowForm(false)} onCreated={handleSaved} />}
      {editingRdv && (
        <RendezVousForm rdv={editingRdv} onClose={() => setEditingRdv(null)} onCreated={handleSaved} />
      )}
    </div>
  );
}

export default RendezVous;