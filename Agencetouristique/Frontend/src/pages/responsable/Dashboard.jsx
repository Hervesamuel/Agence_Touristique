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
  if (loading) {
    return (
      <main className="p-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          Chargement des données...
        </div>
      </main>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <main className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
          {error}
        </div>
      </main>
    );
  }

  // Récupération des données
 // Récupération des données
const agents = data?.agents?.data || [];
const chauffeurs = data?.chauffeurs?.data || [];
const vehicules = data?.vehicules?.data || [];
const circuits = data?.circuits?.data || [];
const reservations = data?.reservations?.data || [];
const rendezVous = data?.rendezVous?.data || [];

  console.log("agents :", agents);
  console.log("chauffeurs :", chauffeurs);
  console.log("vehicules :", vehicules);
  console.log("circuits :", circuits);
  console.log("reservations :", reservations);
  console.log("rendezVous :", rendezVous);

  // Statistiques
  const stats = [
    {
      title: "Circuits",
      value: String(circuits.length).padStart(2, "0"),
      description: "Circuits disponibles",
      type: "circuits",
    },
    {
      title: "Véhicules",
      value: String(vehicules.length).padStart(2, "0"),
      description: "Véhicules enregistrés",
      type: "vehicules",
    },
    {
      title: "Chauffeurs",
      value: String(chauffeurs.length).padStart(2, "0"),
      description: "Chauffeurs enregistrés",
      type: "chauffeurs",
    },
    {
      title: "Réservations",
      value: String(reservations.length).padStart(2, "0"),
      description: "Réservations enregistrées",
      type: "reservations",
    },
  ];

  // Style des statuts
  const getStatusStyle = (status) => {
    if (status === "Confirmée" || status === "CONFIRMEE") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "En attente" || status === "EN_ATTENTE") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "Annulée" || status === "ANNULEE") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  // Formatage des dates
  const formatDate = (date) => {
    if (!date) return "-";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("fr-FR");
  };
    console.log("agents :", agents);
    console.log("Chauffeurs :", chauffeurs);
    console.log("Véhicules :", vehicules);
    console.log("Circuits :", circuits);
    console.log("Réservations :", reservations);
    console.log("Rendez-vous :", rendezVous);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* Message de bienvenue */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Bonjour le responsable 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Voici un aperçu de l'activité de votre agence aujourd'hui.
        </p>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Réservations et rendez-vous */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Réservations */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="font-semibold text-slate-800">
                Réservations récentes
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Les dernières réservations enregistrées
              </p>
            </div>

            <Link
              to="/reservations"
              className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              Voir tout
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Client</th>
                  <th className="text-left px-6 py-4 font-medium">Circuit</th>
                  <th className="text-left px-6 py-4 font-medium">Date</th>
                  <th className="text-left px-6 py-4 font-medium">Statut</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reservations.length > 0 ? (
                  reservations.slice(0, 5).map((reservation, index) => (
                    <tr key={reservation.id || reservation.idres || index}>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {reservation.client ||
                          reservation.nomClient ||
                          reservation.nom ||
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {reservation.circuit?.nom ||
                          reservation.circuit ||
                          reservation.nomCircuit ||
                          "-"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(
                          reservation.date ||
                            reservation.dateReservation ||
                            reservation.dateRes
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                            reservation.status ||
                              reservation.statut
                          )}`}
                        >
                          {reservation.status ||
                            reservation.statut ||
                            "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Aucune réservation enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">
              Rendez-vous à venir
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Prochains rendez-vous
            </p>
          </div>

          <div className="p-6 space-y-5">
            {rendezVous.length > 0 ? (
              rendezVous.slice(0, 5).map((rendezVousItem, index) => (
                <div
                  key={
                    rendezVousItem.id ||
                    rendezVousItem.idrdv ||
                    index
                  }
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold shrink-0">
                    {rendezVousItem.day ||
                      rendezVousItem.jour ||
                      (rendezVousItem.date
                        ? new Date(rendezVousItem.date).getDate()
                        : "-")}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-slate-700 truncate">
                      {rendezVousItem.title ||
                        rendezVousItem.titre ||
                        rendezVousItem.objet ||
                        "Rendez-vous"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {rendezVousItem.time ||
                        rendezVousItem.heure ||
                        (rendezVousItem.date
                          ? formatDate(rendezVousItem.date)
                          : "-")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-4">
                Aucun rendez-vous enregistré.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}


export default Dashboard;