import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Search, Plus, Eye, Pencil, Trash2, RefreshCw } from "lucide-react";
import { getReservations, deleteReservation } from "../../services/reservationService";
import { getUser } from "../../services/authService";
import { useLanguage } from "../../contexts/LanguageContext";

// Locale de formatage de date selon la langue de l'application
const localeParLangue = { fr: "fr-FR", mg: "mg-MG", en: "en-US" };

function Reservation() {
  const { t, language } = useLanguage();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [periodFilter, setPeriodFilter] = useState("a-venir");
  const [selectedIds, setSelectedIds] = useState([]); // ids des réservations cochées

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
      setReservations(Array.isArray(data) ? data : data.reservations || data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReservations(); }, []);

  // =====================================================
  // SUPPRESSION
  // =====================================================
  const handleDelete = async (id) => {
    const confirmation = window.confirm(t("reservations_confirm_suppression"));
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
      if (Number.isNaN(voyageDate.getTime())) return false;
      voyageDate.setHours(0, 0, 0, 0);

      // Recherche textuelle
      const searchValue = search.toLowerCase().trim();
      const circuitName = [reservation.circuit?.nom, reservation.circuit?.libelle, reservation.circuit?.titre, reservation.circuit?.description].filter(Boolean).join(" ").toLowerCase();
      const agentName = [reservation.agent?.nom, reservation.agent?.prenom, reservation.agent?.matricule].filter(Boolean).join(" ").toLowerCase();
      const lieu = (reservation.lieu || "").toLowerCase();
      const clientInfo = [reservation.nomclient, reservation.telclient, reservation.emailclient].filter(Boolean).join(" ").toLowerCase();

            const matchesSearch = !searchValue || lieu.includes(searchValue) || circuitName.includes(searchValue) || agentName.includes(searchValue) || clientInfo.includes(searchValue);
      if (!matchesSearch) return false;

      // Recherche par date précise
      if (dateFilter) {
        const selectedDate = new Date(`${dateFilter}T00:00:00`);
        if (voyageDate.getFullYear() !== selectedDate.getFullYear() || voyageDate.getMonth() !== selectedDate.getMonth() || voyageDate.getDate() !== selectedDate.getDate()) return false;
      }

      // Recherche par mois
      if (monthFilter) {
        const [year, month] = monthFilter.split("-").map(Number);
        if (voyageDate.getFullYear() !== year || voyageDate.getMonth() !== month - 1) return false;
      }

      // Filtres rapides
      if (periodFilter === "a-venir" && voyageDate < today) return false;
      if (periodFilter === "aujourdhui" && voyageDate.getTime() !== today.getTime()) return false;
      if (periodFilter === "passees" && voyageDate >= today) return false;
      if (periodFilter === "toutes") return true;

      return true;
    });
  }, [reservations, search, dateFilter, monthFilter, periodFilter]);

    // =====================================================
  // SELECTION (CASES A COCHER)
  // =====================================================
  // Seules les réservations visibles ET cochées comptent (évite de notifier des lignes cachées par un filtre)
  const selectedReservations = filteredReservations.filter((r) => selectedIds.includes(r.idres));

  // Toutes les réservations affichées sont-elles cochées ?
  const allSelected = filteredReservations.length > 0 && selectedReservations.length === filteredReservations.length;

  // Cocher / décocher une réservation
  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Tout cocher / tout décocher (réservations affichées)
  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : filteredReservations.map((r) => r.idres));

  // =====================================================
  // FORMATAGE DES DATES
  // =====================================================
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString(localeParLangue[language] || "fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  // =====================================================
  // AFFICHAGE
  // =====================================================
  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">{t("reservations_titre")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t("reservations_soustitre")}</p>
        </div>
        {isAgent && (
          <Link to="/reservations/nouveau" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
            <Plus size={18} /> {t("reservations_nouvelle")}
          </Link>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("reservations_total")}</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-1">{reservations.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("reservations_a_venir")}</p>
          <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
            {reservations.filter((reservation) => new Date(reservation.datevoyage) >= new Date(new Date().setHours(0, 0, 0, 0))).length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("reservations_affichees")}</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white mt-1">{filteredReservations.length}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Recherche */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("reservations_rechercher_placeholder")} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          {/* Date précise */}
          <div className="relative">
            <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          {/* Mois */}
          <input type="month" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />

          {/* Période */}
          <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="a-venir">{t("reservations_periode_a_venir")}</option>
            <option value="aujourdhui">{t("reservations_periode_aujourdhui")}</option>
            <option value="passees">{t("reservations_periode_passees")}</option>
            <option value="toutes">{t("reservations_periode_toutes")}</option>
          </select>
        </div>

        {/* Réinitialisation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-20 gap-3 mt-3">
          <button type="button" onClick={() => { setSearch(""); setDateFilter(""); setMonthFilter(""); setPeriodFilter("a-venir"); loadReservations(); }} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-600 dark:hover:bg-slate-500 text-slate-200 text-sm font-medium transition" title={t("reservations_actualiser_title")}>
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">{error}</div>}

              {/* Barre de sélection (visible seulement si au moins une réservation est cochée) */}
      {isAgent && selectedReservations.length > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm">
          <span className="text-emerald-700 dark:text-emerald-300">{selectedReservations.length} réservation(s) sélectionnée(s)</span>
          <button type="button" onClick={() => setSelectedIds([])} className="text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white">
            Tout désélectionner
          </button>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-white">{t("reservations_liste_titre")}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filteredReservations.length} {t("reservations_count_suffix")}</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t("reservations_chargement")}</div>
        ) : filteredReservations.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">{t("reservations_aucune")}</div>
        ) : (
                   <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  {/* Case "tout sélectionner" (agent uniquement) */}
                  {isAgent && (
                    <th className="pl-5 pr-2 py-3 w-10">
                      <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} title="Tout sélectionner" className="w-4 h-4 accent-emerald-600" />
                    </th>
                  )}
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{t("reservations_th_voyage")}</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">{t("reservations_th_circuit")}</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{t("reservations_th_retour")}</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">{t("reservations_th_lieu")}</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">{t("reservations_th_agent")}</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">{t("reservations_th_actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.idres} className="border-t border-slate-200 dark:border-slate-700">
                    {/* Case à cocher de la ligne (agent uniquement) */}
                    {isAgent && (
                      <td className="pl-5 pr-2 py-4">
                        <input type="checkbox" checked={selectedIds.includes(reservation.idres)} onChange={() => toggleSelect(reservation.idres)} className="w-4 h-4 accent-emerald-600" />
                      </td>
                    )}

                    {/* Voyage */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 dark:text-white">{formatDate(reservation.datevoyage)}</div>
                      <div className="text-xs text-slate-400">{t("reservations_label_reservation")} : {formatDate(reservation.datereservation)}</div>
                    </td>

                    {/* Client : nom, téléphone, email */}
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-800 dark:text-white">{reservation.nomclient || "-"}</div>
                      <div className="text-xs text-slate-400">{reservation.telclient || "-"}</div>
                      <div className="text-xs text-slate-400 break-all">{reservation.emailclient || "-"}</div>
                    </td>

                    {/* Circuit */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {reservation.circuit?.nom || reservation.circuit?.libelle || `${t("reservations_circuit_fallback")} #${reservation.idcircuit}`}
                    </td>

                    {/* Retour */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatDate(reservation.dateretour)}</td>

                    {/* Lieu */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{reservation.lieu}</td>

                    {/* Agent */}
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {reservation.agent?.nom || reservation.agent?.prenom || `${t("reservations_agent_fallback")} #${reservation.idagt}`}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/reservations/${reservation.idres}`} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" title={t("reservations_action_consulter")}>
                          <Eye size={17} />
                        </Link>
                        {isAgent && (
                          <>
                            <Link to={`/reservations/${reservation.idres}/modifier`} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700" title={t("reservations_action_modifier")}>
                              <Pencil size={17} />
                            </Link>
                            <button type="button" onClick={() => handleDelete(reservation.idres)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-700" title={t("reservations_action_supprimer")}>
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