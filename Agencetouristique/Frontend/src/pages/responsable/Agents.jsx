import { useState } from "react";
import { Link } from "react-router-dom";

function Agents() {
  // Gestion de la recherche
  const [search, setSearch] = useState("");

  // Données temporaires des agents
  const agents = [
    { id: 1, nom: "Rakoto", prenom: "Jean", email: "jean@agence.com", telephone: "034 00 000 00", statut: "Actif" },
    { id: 2, nom: "Rabe", prenom: "Marie", email: "marie@agence.com", telephone: "032 00 000 00", statut: "Actif" },
    { id: 3, nom: "Andria", prenom: "Paul", email: "paul@agence.com", telephone: "033 00 000 00", statut: "Inactif" },
  ];

  // Filtrage des agents
  const filteredAgents = agents.filter((agent) => {
    const searchValue = search.toLowerCase();
    return (
      agent.nom.toLowerCase().includes(searchValue) ||
      agent.prenom.toLowerCase().includes(searchValue) ||
      agent.email.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 min-h-screen">
      {/* Retour vers le Dashboard sur mobile */}
      <Link
        to="/dashboard"
        className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors mb-5 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
      >
        <span>←</span>
        <span>Retour au Dashboard</span>
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
          className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>✨</span> + Ajouter un agent
        </button>
      </div>

      {/* Zone de recherche */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="w-full sm:max-w-md">
          <label htmlFor="search" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">Rechercher un agent</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🔍</span>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, prénom ou email..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          VERSION ORDINATEUR
          ===================================================== */}
      <div className="hidden md:block bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-50/80 transition-colors duration-150 group">
                    {/* Agent */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform duration-200">
                          {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors duration-150">{agent.prenom} {agent.nom}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">Personnel</p>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-6 py-4.5 text-sm text-slate-600 font-medium whitespace-nowrap">{agent.email}</td>
                    {/* Téléphone */}
                    <td className="px-6 py-4.5 text-sm text-slate-600 font-medium whitespace-nowrap">{agent.telephone}</td>
                    {/* Statut */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm/50 border ${
                        agent.statut === "Actif"
                          ? "bg-emerald-50 border-emerald-200/60 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}>
                        {agent.statut === "Actif" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                        {agent.statut}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4.5 whitespace-nowrap">
                      <div className="flex justify-end gap-2.5">
                        <button type="button" className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all duration-200 active:scale-95">Modifier</button>
                        <button type="button" className="px-3.5 py-2 text-xs font-semibold text-red-600 bg-red-50/30 border border-red-100 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-200 active:scale-95">Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-sm text-slate-400 font-medium bg-slate-50/20">
                    Aucun agent trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          VERSION MOBILE
          ===================================================== */}
      <div className="md:hidden space-y-4">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              {/* Informations principales */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm shrink-0">
                  {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{agent.prenom} {agent.nom}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Personnel</p>
                </div>
                <span className={`ml-auto shrink-0 inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold border ${
                  agent.statut === "Actif" ? "bg-emerald-50 border-emerald-200/60 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                  {agent.statut}
                </span>
              </div>
              {/* Coordonnées détaillées */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2"><span>📧</span><span className="truncate">{agent.email}</span></div>
                <div className="flex items-center gap-2"><span>📞</span><span>{agent.telephone}</span></div>
              </div>
              {/* Boutons d'actions rapides */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" className="w-full py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center shadow-sm">Modifier</button>
                <button type="button" className="w-full py-2.5 text-xs font-bold text-red-600 bg-red-50/30 border border-red-100 rounded-xl text-center shadow-sm">Supprimer</button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-600 font-medium text-center">
              Aucun agent trouvé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Agents;