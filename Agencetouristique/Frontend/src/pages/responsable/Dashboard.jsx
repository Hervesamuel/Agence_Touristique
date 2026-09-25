// Rôle : Afficher les statistiques, les réservations récentes et les rendez-vous.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import { getDashboardData } from "../../services/dashboardService";

function Dashboard() {
  // États pour les données, le chargement et les erreurs
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupération des données du dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err.message || "Impossible de récupérer les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Affichage pendant le chargement
  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Chargement des données...</div>;

  // Affichage en cas d'erreur
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50 m-6 rounded-xl border border-red-200 font-medium">{error}</div>;

  // Récupération des données selon votre schéma Prisma (.data ou tableau direct selon votre API)
  const agents = data?.agents?.data || data?.agents || [];
  const chauffeurs = data?.chauffeurs?.data || data?.chauffeurs || [];
  const vehicules = data?.vehicules?.data || data?.vehicules || [];
  const circuits = data?.circuits?.data || data?.circuits || [];
  const reservations = data?.reservations?.data || data?.reservations || [];
  const rendezVous = data?.rendezVous?.data || data?.rendezVous || [];

  console.log("agents :", agents);
  console.log("chauffeurs :", chauffeurs);
  console.log("vehicules :", vehicules);
  console.log("circuits :", circuits);
  console.log("reservations :", reservations);
  console.log("rendezVous :", rendezVous);

  // Statistiques
  const stats = [
    { title: "Circuits", value: String(circuits.length).padStart(2, "0"), description: "Circuits disponibles", type: "circuits" },
    { title: "Véhicules", value: String(vehicules.length).padStart(2, "0"), description: "Véhicules enregistrés", type: "vehicules" },
    { title: "Chauffeurs", value: String(chauffeurs.length).padStart(2, "0"), description: "Chauffeurs enregistrés", type: "chauffeurs" },
    { title: "Réservations", value: String(reservations.length).padStart(2, "0"), description: "Réservations enregistrées", type: "reservations" },
  ];

  // Style des statuts
  const getStatusStyle = (status) => {
    if (status === "Confirmée" || status === "CONFIRMEE" || status === "Actif") return "bg-emerald-100 text-emerald-700";
    if (status === "En attente" || status === "EN_ATTENTE" || status === "En Attente") return "bg-amber-100 text-amber-700";
    if (status === "Annulée" || status === "ANNULEE") return "bg-red-100 text-red-700";
    return "bg-blue-100 text-blue-700";
  };

  // Formatage des dates
  const formatDate = (date) => {
    if (!date) return "-";
    const formattedDate = new Date(date);
    if (Number.isNaN(formattedDate.getTime())) return date;
    return formattedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  };

  // Formatage de l'heure pour les rendez-vous
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const d = new Date(timeStr);
    if (Number.isNaN(d.getTime())) return timeStr;
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* Message de bienvenue */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Bonjour le responsable 👋</h1>
        <p className="text-slate-500 mt-1">Voici un aperçu de l'activité de votre agence aujourd'hui.</p>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </section>

      {/* Réservations et rendez-vous */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Réservations */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-semibold text-slate-800">Réservations récentes</h2>
              <p className="text-sm text-slate-500 mt-1">Les dernières réservations enregistrées</p>
            </div>
            <Link to="/reservations" className="text-sm text-emerald-600 font-medium hover:text-emerald-700">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Agent Responsable</th>
                  <th className="text-left px-6 py-4 font-medium">Circuit</th>
                  <th className="text-left px-6 py-4 font-medium">Date Voyage</th>
                  <th className="text-left px-6 py-4 font-medium">Lieu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reservations.length > 0 ? (
                  reservations.slice(0, 5).map((reservation, index) => (
                    <tr key={reservation.idres || index}>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {reservation.agent?.nom || `Agent #${reservation.idagt}`}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {reservation.circuit?.nom || `Circuit #${reservation.idcircuit}`}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(reservation.datevoyage)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {reservation.lieu || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">Aucune réservation enregistrée.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">Rendez-vous à venir</h2>
            <p className="text-sm text-slate-500 mt-1">Prochains rendez-vous</p>
          </div>
          <div className="p-6 space-y-4">
            {rendezVous.length > 0 ? (
              rendezVous.slice(0, 5).map((rdv, index) => (
                <div key={rdv.idrdv || index} className="flex items-center gap-4 p-2 hover:bg-slate-50 rounded-lg transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    {rdv.date ? new Date(rdv.date).getDate() : "📅"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{rdv.motif || "Rendez-vous"}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {formatDate(rdv.date)} à {formatTime(rdv.heure)}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-xxs font-medium ${getStatusStyle(rdv.statut)}`}>
                    {rdv.statut}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Aucun rendez-vous planifié.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
