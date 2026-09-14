// Fichier: src/pages/dashboard/Dashboard.jsx
// Rôle : Assembler les statistiques, les réservations récentes et les rendez-vous sur une seule vue.

import StatCard from "../../components/dashboard/StatCard";

// Données statiques pour les cartes de statistiques
const stats = [
  { title: "Circuits", value: "12", description: "Circuits disponibles", type: "circuits" },
  { title: "Véhicules", value: "08", description: "Véhicules enregistrés", type: "vehicules" },
  { title: "Chauffeurs", value: "06", description: "Chauffeurs actifs", type: "chauffeurs" },
  { title: "Réservations", value: "35", description: "Réservations ce mois", type: "reservations" },
];

// Données fictives des réservations récentes
const reservations = [
  { client: "Jean Rakoto", circuit: "Fianarantsoa Tour", date: "14 Sept. 2026", status: "Confirmée", style: "bg-emerald-100 text-emerald-700" },
  { client: "Marie Andria", circuit: "Sud de Madagascar", date: "15 Sept. 2026", status: "En attente", style: "bg-amber-100 text-amber-700" },
  { client: "Paul Rabe", circuit: "Circuit RN7", date: "16 Sept. 2026", status: "Nouvelle", style: "bg-blue-100 text-blue-700" },
];

// Données fictives des prochains rendez-vous
const appointments = [
  { day: "15", title: "Rendez-vous client", time: "Demain • 09:00", style: "bg-emerald-50 text-emerald-600" },
  { day: "16", title: "Confirmation de circuit", time: "16 Sept. • 14:30", style: "bg-blue-50 text-blue-600" },
  { day: "18", title: "Réunion agence", time: "18 Sept. • 10:00", style: "bg-amber-50 text-amber-600" },
];

function Dashboard() {
  return (
    <main className="p-8">
      {/* Message de bienvenue */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Bonjour le responsable👋</h1>
        <p className="text-slate-500 mt-1">Voici un aperçu de l'activité de votre agence aujourd'hui.</p>
      </section>

      {/* Grille des 4 cartes de statistiques */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </section>

      {/* Layout principal à 2 colonnes (Réservations + Rendez-vous) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Colonne gauche (large) : Tableau des réservations */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-semibold text-slate-800">Réservations récentes</h2>
              <p className="text-sm text-slate-500 mt-1">Les dernières réservations enregistrées</p>
            </div>
            <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Voir tout</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {["Client", "Circuit", "Date", "Statut"].map((h) => <th key={h} className="text-left px-6 py-4 font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.map((r) => (
                  <tr key={r.client}>
                    <td className="px-6 py-4 font-medium text-slate-700">{r.client}</td>
                    <td className="px-6 py-4 text-slate-500">{r.circuit}</td>
                    <td className="px-6 py-4 text-slate-500">{r.date}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${r.style}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Colonne droite (étroite) : Liste des rendez-vous */}
        <div className="bg-white border border-slate-200 rounded-xl">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Rendez-vous à venir</h2>
            <p className="text-sm text-slate-500 mt-1">Prochains rendez-vous</p>
          </div>
          <div className="p-6 space-y-5">
            {appointments.map((a) => (
              <div key={a.title} className="flex gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold ${a.style}`}>{a.day}</div>
                <div>
                  <p className="font-medium text-slate-700">{a.title}</p>
                  <p className="text-sm text-slate-500">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;