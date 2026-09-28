// Rôle : Afficher les statistiques, les réservations récentes et les rendez-vous.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import { getDashboardData } from "../../services/dashboardService";
import { useLanguage } from "../../contexts/LanguageContext";

// Icônes en SVG inline — pas de dépendance externe
const IconArrow = (p) => (
  <svg viewBox="0 0 16 16" fill="none" {...p}>
    <path
      d="M6 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMap = (p) => (
  <svg viewBox="0 0 20 20" fill="none" {...p}>
    <path
      d="M4 5l4-1.5 4 1.5 4-1.5v11l-4 1.5-4-1.5-4 1.5V5z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M8 3.5v11M12 5v11" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconCalendar = (p) => (
  <svg viewBox="0 0 20 20" fill="none" {...p}>
    <rect
      x="3"
      y="4.5"
      width="14"
      height="12"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M3 8h14M7 3v3M13 3v3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const IconInbox = (p) => (
  <svg viewBox="0 0 40 40" fill="none" {...p}>
    <path
      d="M6 22l4-12h20l4 12M6 22v9a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-9M6 22h8a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1a2 2 0 0 1 2-2h8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

function Dashboard() {
  const { language, t } = useLanguage();

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
        setError(err.message || t("dashboard_erreur"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
        {t("dashboard_chargement")}
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 m-6 rounded-xl border border-red-200 dark:border-red-800 font-medium">
        {error}
      </div>
    );
  }

  // Récupération des données selon la réponse de l'API
  const agents = data?.agents?.data || data?.agents || [];
  const chauffeurs = data?.chauffeurs?.data || data?.chauffeurs || [];
  const vehicules = data?.vehicules?.data || data?.vehicules || [];
  const circuits = data?.circuits?.data || data?.circuits || [];
  const reservations = data?.reservations?.data || data?.reservations || [];
  const rendezVous = data?.rendezVous?.data || data?.rendezVous || [];

  // Statistiques
  const stats = [
    {
      title: t("dashboard_circuits"),
      value: String(circuits.length).padStart(2, "0"),
      description: t("dashboard_circuits_description"),
      type: "circuits",
    },
    {
      title: t("dashboard_vehicules"),
      value: String(vehicules.length).padStart(2, "0"),
      description: t("dashboard_vehicules_description"),
      type: "vehicules",
    },
    {
      title: t("dashboard_chauffeurs"),
      value: String(chauffeurs.length).padStart(2, "0"),
      description: t("dashboard_chauffeurs_description"),
      type: "chauffeurs",
    },
    {
      title: t("dashboard_reservations"),
      value: String(reservations.length).padStart(2, "0"),
      description: t("dashboard_reservations_description"),
      type: "reservations",
    },
  ];

  // Style des statuts
  const getStatusStyle = (status) => {
    if (
      status === "Confirmée" ||
      status === "CONFIRMEE" ||
      status === "Actif"
    ) {
      return "bg-[#E8F0E3] dark:bg-emerald-900/30 text-[#2F5233] dark:text-emerald-400";
    }

    if (
      status === "En attente" ||
      status === "EN_ATTENTE" ||
      status === "En Attente"
    ) {
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    }

    if (status === "Annulée" || status === "ANNULEE") {
      return "bg-[#F3E4DA] dark:bg-red-900/30 text-[#B85C38] dark:text-red-400";
    }

    return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
  };

  // Traduction des statuts
  const translateStatus = (status) => {
    if (status === "Confirmée" || status === "CONFIRMEE") {
      return t("dashboard_confirmee");
    }

    if (
      status === "En attente" ||
      status === "EN_ATTENTE" ||
      status === "En Attente"
    ) {
      return t("dashboard_en_attente");
    }

    if (status === "Annulée" || status === "ANNULEE") {
      return t("dashboard_annulee");
    }

    if (status === "Actif") {
      return t("dashboard_actif");
    }

    return status;
  };

  // Langue utilisée pour le formatage des dates
  const locale =
    language === "mg"
      ? "mg-MG"
      : language === "en"
        ? "en-US"
        : "fr-FR";

  // Formatage des dates
  const formatDate = (date) => {
    if (!date) return "-";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Formatage de l'heure pour les rendez-vous
  const formatTime = (timeStr) => {
    if (!timeStr) return "";

    const d = new Date(timeStr);

    if (Number.isNaN(d.getTime())) {
      return timeStr;
    }

    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Date du jour affichée dans l'en-tête
  const aujourdHui = new Date().toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-[#FAF8F3] dark:bg-slate-900 min-h-full">

      {/* Message de bienvenue */}
      <section className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-[#232821] dark:text-slate-100">
            {t("dashboard_bienvenue")}
          </h1>

          <p className="text-[#6B7268] dark:text-slate-400 mt-1">
            {t("dashboard_apercu")}
          </p>
        </div>

        <p className="text-xs font-medium text-[#8B9186] dark:text-slate-500 capitalize sm:text-right shrink-0">
          {aujourdHui}
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
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 border border-[#E9E4D6] dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">

          <div className="flex items-center justify-between p-6 border-b border-[#E9E4D6] dark:border-slate-700">
            <div className="flex items-center gap-3">

              <div className="w-9 h-9 shrink-0 rounded-lg bg-[#E8F0E3] dark:bg-emerald-900/30 text-[#2F5233] dark:text-emerald-400 flex items-center justify-center">
                <IconMap className="w-5 h-5" />
              </div>

              <div>
                <h2 className="font-semibold text-[#232821] dark:text-slate-100">
                  {t("dashboard_reservations_titre")}
                </h2>

                <p className="text-sm text-[#8B9186] dark:text-slate-400 mt-0.5">
                  {t("dashboard_reservations_soustitre")}
                </p>
              </div>
            </div>

            <Link
              to="/reservations"
              className="inline-flex items-center gap-1 text-sm text-[#2F5233] dark:text-emerald-400 font-medium hover:text-[#22391F] dark:hover:text-emerald-300 shrink-0"
            >
              {t("dashboard_voir_tout")}
              <IconArrow className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-[#F4F0E6] dark:bg-slate-900/50 text-[#6B7268] dark:text-slate-400">
                <tr>
                  <th className="text-left px-6 py-3.5 font-medium">
                    {t("dashboard_agent")}
                  </th>

                  <th className="text-left px-6 py-3.5 font-medium">
                    {t("dashboard_circuit")}
                  </th>

                  <th className="text-left px-6 py-3.5 font-medium">
                    {t("dashboard_date_voyage")}
                  </th>

                  <th className="text-left px-6 py-3.5 font-medium">
                    {t("dashboard_lieu")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0ECE0] dark:divide-slate-700">

                {reservations.length > 0 ? (
                  reservations.slice(0, 5).map((reservation, index) => (
                    <tr
                      key={reservation.idres || index}
                      className="hover:bg-[#FBFAF6] dark:hover:bg-slate-700/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-[#232821] dark:text-slate-200">
                        {reservation.agent?.nom ||
                          `Agent #${reservation.idagt}`}
                      </td>

                      <td className="px-6 py-4 text-[#6B7268] dark:text-slate-400">
                        {reservation.circuit?.nom ||
                          `Circuit #${reservation.idcircuit}`}
                      </td>

                      <td className="px-6 py-4 text-[#6B7268] dark:text-slate-400">
                        {formatDate(reservation.datevoyage)}
                      </td>

                      <td className="px-6 py-4 text-[#6B7268] dark:text-slate-400">
                        {reservation.lieu || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-14">
                      <div className="flex flex-col items-center text-center gap-2">
                        <IconInbox className="w-10 h-10 text-[#C7C2AE] dark:text-slate-600" />

                        <p className="text-[#8B9186] dark:text-slate-400 font-medium">
                          {t("dashboard_aucune_reservation")}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* Rendez-vous */}
        <div className="bg-white dark:bg-slate-800 border border-[#E9E4D6] dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">

          <div className="p-6 border-b border-[#E9E4D6] dark:border-slate-700 flex items-center gap-3">

            <div className="w-9 h-9 shrink-0 rounded-lg bg-[#EFEBDE] dark:bg-slate-700 text-[#6B8E6B] dark:text-slate-300 flex items-center justify-center">
              <IconCalendar className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-semibold text-[#232821] dark:text-slate-100">
                {t("dashboard_rendezvous_titre")}
              </h2>

              <p className="text-sm text-[#8B9186] dark:text-slate-400 mt-0.5">
                {t("dashboard_rendezvous_soustitre")}
              </p>
            </div>
          </div>

          <div className="p-4 space-y-1">

            {rendezVous.length > 0 ? (
              rendezVous.slice(0, 5).map((rdv, index) => (
                <div
                  key={rdv.idrdv || index}
                  className="flex items-center gap-3 p-2.5 hover:bg-[#FBFAF6] dark:hover:bg-slate-700/40 rounded-xl transition-colors"
                >
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-[#E8F0E3] dark:bg-emerald-900/30 text-[#2F5233] dark:text-emerald-400 flex flex-col items-center justify-center leading-none">

                    <span className="text-sm font-bold">
                      {rdv.date ? new Date(rdv.date).getDate() : "—"}
                    </span>

                    {rdv.date && (
                      <span className="text-[9px] uppercase font-medium mt-0.5">
                        {new Date(rdv.date).toLocaleDateString(locale, {
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-sm font-semibold text-[#232821] dark:text-slate-100 truncate">
                      {rdv.motif || t("dashboard_rendezvous")}
                    </p>

                    <p className="text-xs text-[#8B9186] dark:text-slate-500 font-medium mt-0.5">
                      {formatDate(rdv.date)} {rdv.heure && `à ${formatTime(rdv.heure)}`}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xxs font-medium ${getStatusStyle(
                      rdv.statut
                    )}`}
                  >
                    {translateStatus(rdv.statut)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center text-center gap-2 py-10">
                <IconInbox className="w-10 h-10 text-[#C7C2AE] dark:text-slate-600" />

                <p className="text-sm text-[#8B9186] dark:text-slate-400 font-medium">
                  {t("dashboard_aucun_rendezvous")}
                </p>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
