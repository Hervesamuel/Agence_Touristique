import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAgents, updateAgent } from "../../services/agentService";
import AgentForm from "./AgentForm";

function Agents() {
  // Gestion des agents
  const [agents, setAgents] = useState([]);
  // Gestion de la recherche
  const [search, setSearch] = useState("");
  // Gestion du chargement
  const [loading, setLoading] = useState(true);
  // Gestion des erreurs
  const [error, setError] = useState("");
  // Gestion de la bascule activer/désactiver (id de l'agent en cours de traitement)
  const [togglingId, setTogglingId] = useState(null);
  // Gestion de l'affichage du formulaire d'ajout
  const [showForm, setShowForm] = useState(false);

  // Récupération des agents depuis l'API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAgents();
        setAgents(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

    // Activation / désactivation d'un agent
    const handleToggleStatus = async (agent) => {
      const nextStatut = agent.statut === "Actif" ? "Inactif" : "Actif";
      const actionLabel = nextStatut === "Actif" ? "activer" : "désactiver";

      const confirmed = window.confirm(
        `Voulez-vous ${actionLabel} le compte de "${agent.nom}" ?`
      );
      if (!confirmed) return;

      try {
        setTogglingId(agent.idagt);
        const response = await updateAgent(agent.idagt, { statut: nextStatut });
        const updatedAgent = response.data || response;

        setAgents((prev) =>
          prev.map((a) => (a.idagt === agent.idagt ? { ...a, statut: updatedAgent.statut } : a))
        );
      } catch (err) {
        alert(err.message || "Impossible de modifier le statut de cet agent.");
      } finally {
        setTogglingId(null);
      }
    };

  // Rafraîchissement de la liste après création d'un agent
  const handleAgentCreated = () => {
    const fetchAgents = async () => {
      try {
        const response = await getAgents();
        setAgents(response.data || response || []);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les agents.");
      }
    };
    fetchAgents();
  };

  // Filtrage des agents
  const filteredAgents = agents.filter((agent) => {
    const searchValue = search.toLowerCase();
    return (
      agent.nom?.toLowerCase().includes(searchValue) ||
      agent.email?.toLowerCase().includes(searchValue)
    );
  });

  // Affichage pendant le chargement
  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Chargement des agents...</div>;

  // Affichage en cas d'erreur
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200 font-medium">{error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* Retour vers le Dashboard sur mobile */}
      <Link to="/dashboard" className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm">
        <span>←</span> <span>Retour au Dashboard</span>
      </Link>

      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Agents</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">Gestion des agents de l'agence</p>
        </div>
        {/* Bouton d'ajout */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          <span>＋</span> Ajouter un agent
        </button>
      </div>

      {/* Zone de recherche */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="w-full sm:max-w-md">
          <label htmlFor="search" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Rechercher un agent</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, prénom ou email..."
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Liste des agents */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Aucun agent trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => (
            <div
              key={agent.idagt}
              className="relative bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
                            {/* Badge de statut */}
              <span
                className={`absolute top-3 right-14 text-xxs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  agent.statut === "Actif" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}
              >
                {agent.statut}
              </span>

              {/* Bouton activer / désactiver */}
              <button
                type="button"
                onClick={() => handleToggleStatus(agent)}
                disabled={togglingId === agent.idagt}
                aria-label={agent.statut === "Actif" ? `Désactiver ${agent.nom}` : `Activer ${agent.nom}`}
                title={agent.statut === "Actif" ? "Désactiver ce compte" : "Activer ce compte"}
                className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  agent.statut === "Actif"
                    ? "text-emerald-600 hover:bg-red-50 hover:text-red-600"
                    : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {togglingId === agent.idagt ? (
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
                  {agent.nom?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{agent.nom}</p>
                  <p className="text-xs text-slate-500 truncate">{agent.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AgentForm onClose={() => setShowForm(false)} onCreated={handleAgentCreated} />
      )}
    </div>
  );
}

export default Agents;