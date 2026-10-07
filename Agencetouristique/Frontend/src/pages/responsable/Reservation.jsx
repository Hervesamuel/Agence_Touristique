import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Search, Plus, Eye, Pencil, Trash2, RefreshCw } from "lucide-react";

import {
  getReservations,
  deleteReservation,
} from "../../services/reservationService";

import { getUser } from "../../services/authService";

function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("a-venir");

  const user = getUser();

  const role = user?.role?.toLowerCase();

  const isAgent = role === "agent";

  // =====================================================
  // RECUPERATION DES RESERVATIONS
  // =====================================================

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

     const data = await getReservations();

        console.log("===== RESERVATIONS RECUES =====");
        console.log(data);

        setReservations(
        Array.isArray(data)
            ? data
            : data.reservations || data.data || []
        );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // =====================================================
  // SUPPRESSION
  // =====================================================

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette réservation ?"
    );

    if (!confirmation) return;

    try {
      await deleteReservation(id);
      await loadReservations();
    } catch (error) {
      setError(error.message);
    }
  };

  // =====================================================
  // FILTRAGE
  // =====================================================

  const filteredReservations = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return reservations.filter((reservation) => {
      const voyageDate = new Date(reservation.datevoyage);

      if (Number.isNaN(voyageDate.getTime())) {
        return false;
      }

      voyageDate.setHours(0, 0, 0, 0);

      // Recherche textuelle
     const searchValue = search.toLowerCase().trim();

const circuitName = [
  reservation.circuit?.nom,
  reservation.circuit?.libelle,
  reservation.circuit?.titre,
  reservation.circuit?.description,
]
  .filter(Boolean)
  .join(" ")
  .toLowerCase();

const agentName = [
  reservation.agent?.nom,
  reservation.agent?.prenom,
  reservation.agent?.matricule,
]
  .filter(Boolean)
  .join(" ")
  .toLowerCase();

const lieu = (reservation.lieu || "").toLowerCase();

const matchesSearch =
  !searchValue ||
  lieu.includes(searchValue) ||
  circuitName.includes(searchValue) ||
  agentName.includes(searchValue);

if (!matchesSearch) return false;
      if (!matchesSearch) return false;

      // Recherche par date précise
      if (dateFilter) {
        const selectedDate = new Date(`${dateFilter}T00:00:00`);

        if (
          voyageDate.getFullYear() !== selectedDate.getFullYear() ||
          voyageDate.getMonth() !== selectedDate.getMonth() ||
          voyageDate.getDate() !== selectedDate.getDate()
        ) {
          return false;
        }
      }

      // Recherche par mois
      if (monthFilter) {
        const [year, month] = monthFilter.split("-").map(Number);

        if (
          voyageDate.getFullYear() !== year ||
          voyageDate.getMonth() !== month - 1
        ) {
          return false;
        }
      }

      // Filtres rapides
      if (periodFilter === "a-venir" && voyageDate < today) {
        return false;
      }

      if (periodFilter === "aujourdhui") {
        if (voyageDate.getTime() !== today.getTime()) {
          return false;
        }
      }

      if (periodFilter === "passees" && voyageDate >= today) {
        return false;
      }

      if (periodFilter === "toutes") {
        return true;
      }

      return true;
    });
  }, [
    reservations,
    search,
    dateFilter,
    monthFilter,
    periodFilter,
  ]);

  // =====================================================
  // FORMATAGE DES DATES
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // AFFICHAGE
  // =====================================================

  return (
    <div className="p-6">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">
            Réservations
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Gestion et suivi des réservations de l'agence
          </p>
        </div>

        {isAgent && (
          <Link
            to="/reservations/nouveau"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition"
          >
            <Plus size={18} />
            Nouvelle réservation
          </Link>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-1">
            {reservations.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-500">À venir</p>
          <p className="text-2xl font-semibold text-emerald-600 mt-1">
            {
              reservations.filter(
                (reservation) =>
                  new Date(reservation.datevoyage) >=
                  new Date(new Date().setHours(0, 0, 0, 0))
              ).length
            }
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-500">Affichées</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-1">
            {filteredReservations.length}
          </p>
        </div>

      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Recherche */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Date précise */}
          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Mois */}
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Période */}
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="a-venir">À venir</option>
            <option value="aujourdhui">Aujourd'hui</option>
            <option value="passees">Passées</option>
            <option value="toutes">Toutes</option>
          </select>

        </div>

        {/* Réinitialisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-20 gap-3">
         <button
            type="button"
            onClick={() => {
                setSearch("");
                setDateFilter("");
                setMonthFilter("");
                setPeriodFilter("a-venir");
                loadReservations();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition"
            title="Actualiser les réservations"
            >
            <RefreshCw size={20} />
            </button>
        </div>

      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-white">
            Réservations
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredReservations.length} réservation(s) affichée(s)
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement des réservations...
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Aucune réservation trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-slate-500">
                    Voyage
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-slate-500">
                    Circuit
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-slate-500">
                    Retour
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-slate-500">
                    Lieu
                  </th>

                  <th className="text-left px-5 py-3 font-medium text-slate-500">
                    Agent
                  </th>

                  <th className="text-right px-5 py-3 font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredReservations.map((reservation) => (

                  <tr
                    key={reservation.idres}
                    className="border-t border-slate-200 dark:border-slate-700"
                  >

                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-800 dark:text-white">
                        {formatDate(reservation.datevoyage)}
                      </div>

                      <div className="text-xs text-slate-400">
                        Réservation :{" "}
                        {formatDate(reservation.datereservation)}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {reservation.circuit?.nom ||
                        reservation.circuit?.libelle ||
                        `Circuit #${reservation.idcircuit}`}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDate(reservation.dateretour)}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {reservation.lieu}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {reservation.agent?.nom ||
                        reservation.agent?.prenom ||
                        `Agent #${reservation.idagt}`}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/reservations/${reservation.idres}`}
                          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                          title="Consulter"
                        >
                          <Eye size={17} />
                        </Link>

                        {isAgent && (
                          <>
                            <Link
                              to={`/reservations/${reservation.idres}/modifier`}
                              className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700"
                              title="Modifier"
                            >
                              <Pencil size={17} />
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(reservation.idres)
                              }
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-700"
                              title="Supprimer"
                            >
                              <Trash2 size={17} />
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>

                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Reservation;