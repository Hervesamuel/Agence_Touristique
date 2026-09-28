// Rôle : Afficher les statistiques de l'agence.

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Label, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDashboardData } from "../../services/dashboardService";
import { useLanguage } from "../../contexts/LanguageContext";

// =====================================================
// ICÔNES (SVG inline, aucune dépendance externe)
// =====================================================
const IconUsers = (p) => (
  <svg viewBox="0 0 20 20" fill="none" {...p}>
    <circle cx="8" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 16c.7-3 2.8-4.5 5.5-4.5S12.800 13 13.500 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14" cy="8" r="2.200" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
    <path d="M14.500 12c1.500.3 2.600 1.500 3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
  </svg>
);
const IconMap = (p) => (
  <svg viewBox="0 0 20 20" fill="none" {...p}>
    <path d="M4 5l4-1.500 4 1.500 4-1.500v11l-4 1.500-4-1.500-4 1.500V5z" stroke="currentColor" strokeWidth="1.400" strokeLinejoin="round" />
    <path d="M8 3.500v11M12 5v11" stroke="currentColor" strokeWidth="1.400" />
  </svg>
);
const IconTicket = (p) => (
  <svg viewBox="0 0 20 20" fill="none" {...p}>
    <path d="M3 6.500a1.500 1.500 0 0 1 1.500-1.500h11A1.500 1.500 0 0 1 17 6.500V8a2 2 0 0 0 0 4v1.500a1.500 1.500 0 0 1-1.500 1.500h-11A1.500 1.500 0 0 1 3 13.500V12a2 2 0 0 0 0-4V6.500z" stroke="currentColor" strokeWidth="1.400" strokeLinejoin="round" />
    <path d="M12 5v10" stroke="currentColor" strokeWidth="1.400" strokeDasharray="1.500 2" />
  </svg>
);
const IconCalendar = (p) => (
  <svg viewBox="0 0 20 20" fill="none" {...p}>
    <rect x="3" y="4.500" width="14" height="12" rx="1.500" stroke="currentColor" strokeWidth="1.400" />
    <path d="M3 8h14M7 3v3M13 3v3" stroke="currentColor" strokeWidth="1.400" strokeLinecap="round" />
  </svg>
);

// =====================================================
// AIDES D'AFFICHAGE DES GRAPHIQUES (présentation uniquement)
// =====================================================
const RADIAN = Math.PI / 180;

// Nombre affiché au milieu de chaque portion de l'anneau (comme dans le modèle)
const renderLabelDansAnneau = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight={700}
    >
      {value}
    </text>
  );
};

// Total affiché au centre du trou de l'anneau
const renderTotalCentre = (total) => ({ viewBox }) => {
  const { cx, cy } = viewBox;

  return (
    <g>
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize={26}
        fontWeight={700}
        className="fill-slate-800 dark:fill-white"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        fontSize={11}
        className="fill-slate-500 dark:fill-slate-400"
      >
        Total
      </text>
    </g>
  );
};

// Légende avec puces rondes, lisible en clair comme en sombre
const legendFormatter = (value) => (
  <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>
);

// Style commun des infobulles
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E9E4D6",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

// Couleurs sémantiques des statuts de rendez-vous (avec couleurs de secours)
const statutColors = {
  "Confirmé": "#3E8E63",
  "En attente": "#E0A33A",
  "Annulé": "#C4693F",
};
const fallbackColors = ["#6B8E6B", "#7C9CB8", "#9B7EBD", "#B0A48A"];

// Couleurs du graphique par genre
const genreColors = ["#D9825B", "#3E8E63"];

function Statistiques() {
  const { t } = useLanguage();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupération des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getDashboardData();
        setData(result);
      } catch (err) {
        setError(
          err.message || "Impossible de récupérer les statistiques."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chargement
  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Chargement des statistiques...
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-6 text-center font-medium text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  // Récupération des tableaux
  const chauffeurs =
    data?.chauffeurs?.data || data?.chauffeurs || [];

  const circuits =
    data?.circuits?.data || data?.circuits || [];

  const reservations =
    data?.reservations?.data || data?.reservations || [];

  const rendezVous =
    data?.rendezVous?.data || data?.rendezVous || [];

  // =====================================================
  // STATISTIQUE : CHAUFFEURS PAR GENRE
  // =====================================================

  const chauffeursFeminin = chauffeurs.filter((chauffeur) => {
    const genre = chauffeur.genre?.toLowerCase();

    return (
      genre === "féminin" ||
      genre === "feminin" ||
      genre === "f"
    );
  }).length;

  const chauffeursMasculin = chauffeurs.filter((chauffeur) => {
    const genre = chauffeur.genre?.toLowerCase();

    return (
      genre === "masculin" ||
      genre === "m" ||
      genre === "homme"
    );
  }).length;

  const genreData = [
    {
      name: "Féminin",
      value: chauffeursFeminin,
    },
    {
      name: "Masculin",
      value: chauffeursMasculin,
    },
  ].filter((item) => item.value > 0);

  // =====================================================
  // STATISTIQUE : RESERVATIONS PAR CIRCUIT
  // =====================================================

  const circuitsData = circuits
    .map((circuit) => {
      const nombreReservations = reservations.filter(
        (reservation) =>
          Number(reservation.idcircuit) === Number(circuit.idcircuit)
      ).length;

      return {
        nom: circuit.nom,
        nombre: nombreReservations,
      };
    })
    .sort((a, b) => b.nombre - a.nombre);

  // =====================================================
  // CIRCUIT LE PLUS ET LE MOINS UTILISE
  // =====================================================

  const circuitPlusUtilise = circuitsData[0] || null;

  const circuitMoinsUtilise =
    circuitsData.length > 0
      ? circuitsData[circuitsData.length - 1]
      : null;

  // =====================================================
  // STATISTIQUE : RENDEZ-VOUS PAR STATUT
  // =====================================================

  const rendezVousParStatut = {};

  rendezVous.forEach((rdv) => {
    const statut = rdv.statut || "Non défini";

    rendezVousParStatut[statut] =
      (rendezVousParStatut[statut] || 0) + 1;
  });

  const rendezVousData = Object.entries(
    rendezVousParStatut
  ).map(([statut, nombre]) => ({
    name: statut,
    value: nombre,
  }));

  // =====================================================
  // STATISTIQUE : RESERVATIONS PAR MOIS
  // =====================================================

  const reservationsParMois = {};

  reservations.forEach((reservation) => {
    if (!reservation.datereservation) {
      return;
    }

    const date = new Date(reservation.datereservation);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const mois = date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });

    reservationsParMois[mois] =
      (reservationsParMois[mois] || 0) + 1;
  });

  const reservationsMoisData = Object.entries(
    reservationsParMois
  ).map(([mois, nombre]) => ({
    mois,
    nombre,
  }));

  // Totaux affichés au centre des anneaux (présentation)
  const totalGenre = genreData.reduce((somme, item) => somme + item.value, 0);
  const totalRendezVous = rendezVousData.reduce((somme, item) => somme + item.value, 0);

  // Indicateurs du haut de page (mêmes valeurs qu'avant)
  const indicateurs = [
    {
      titre: "Chauffeurs",
      valeur: chauffeurs.length,
      Icone: IconUsers,
      accent: "bg-[#E8F0E3] text-[#2F5233] dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      titre: "Circuits",
      valeur: circuits.length,
      Icone: IconMap,
      accent: "bg-[#E3ECEF] text-[#3F6B7A] dark:bg-sky-900/30 dark:text-sky-300",
    },
    {
      titre: "Réservations",
      valeur: reservations.length,
      Icone: IconTicket,
      accent: "bg-[#F3E4DA] text-[#B85C38] dark:bg-orange-900/30 dark:text-orange-300",
    },
    {
      titre: "Rendez-vous",
      valeur: rendezVous.length,
      Icone: IconCalendar,
      accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
  ];

  // Style commun des cartes
  const carte =
    "rounded-2xl border border-[#E9E4D6] bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800";

  return (
    <div className="min-h-full bg-[#FAF8F3] p-4 dark:bg-slate-900 sm:p-6 lg:p-8">

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#232821] dark:text-white sm:text-3xl">
          Statistiques
        </h1>

        <p className="mt-2 text-sm text-[#6B7268] dark:text-slate-400">
          Analyse des données et de l'activité de l'agence.
        </p>
      </div>

      {/* =====================================================
          INDICATEURS
      ===================================================== */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {indicateurs.map(({ titre, valeur, Icone, accent }) => (
          <div
            key={titre}
            className={`${carte} flex items-center justify-between gap-4 p-5 transition-shadow hover:shadow-md`}
          >
            <div>
              <p className="text-sm font-medium text-[#6B7268] dark:text-slate-400">
                {titre}
              </p>

              <p className="mt-1.5 text-3xl font-bold tabular-nums text-[#232821] dark:text-white">
                {valeur}
              </p>
            </div>

            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}>
              <Icone className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          GRAPHIQUES
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Chauffeurs par genre */}
        <div className={`${carte} p-5`}>

          <h2 className="text-lg font-semibold text-[#232821] dark:text-white">
            Chauffeurs par genre
          </h2>

          <p className="mt-1 text-sm text-[#8B9186] dark:text-slate-400">
            Répartition des chauffeurs de l'agence.
          </p>

          <div className="h-72">
            {genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={100}
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="none"
                    labelLine={false}
                    label={renderLabelDansAnneau}
                  >
                    {genreData.map((entry, index) => (
                      <Cell
                        key={`genre-${index}`}
                        fill={genreColors[index % genreColors.length]}
                      />
                    ))}
                    <Label position="center" content={renderTotalCentre(totalGenre)} />
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={9} formatter={legendFormatter} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Aucune donnée disponible.
              </div>
            )}
          </div>
        </div>

        {/* Circuits par nombre de réservations */}
        <div className={`${carte} p-5`}>

          <h2 className="text-lg font-semibold text-[#232821] dark:text-white">
            Utilisation des circuits
          </h2>

          <p className="mt-1 text-sm text-[#8B9186] dark:text-slate-400">
            Nombre de réservations par circuit.
          </p>

          <div className="mt-2 h-72">
            {circuitsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={circuitsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#94a3b8"
                    strokeOpacity={0.25}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="nom"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#94a3b8", strokeOpacity: 0.4 }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#94a3b8", fillOpacity: 0.12 }} />

                  <Bar
                    dataKey="nombre"
                    name="Réservations"
                    fill="#3E8E63"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Aucune donnée disponible.
              </div>
            )}
          </div>
        </div>

        {/* Rendez-vous par statut */}
        <div className={`${carte} p-5`}>

          <h2 className="text-lg font-semibold text-[#232821] dark:text-white">
            Rendez-vous par statut
          </h2>

          <p className="mt-1 text-sm text-[#8B9186] dark:text-slate-400">
            Répartition des rendez-vous selon leur statut.
          </p>

          <div className="h-72">
            {rendezVousData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rendezVousData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={100}
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="none"
                    labelLine={false}
                    label={renderLabelDansAnneau}
                  >
                    {rendezVousData.map((entry, index) => (
                      <Cell
                        key={`rdv-${index}`}
                        fill={statutColors[entry.name] || fallbackColors[index % fallbackColors.length]}
                      />
                    ))}
                    <Label position="center" content={renderTotalCentre(totalRendezVous)} />
                  </Pie>

                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={9} formatter={legendFormatter} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Aucun rendez-vous disponible.
              </div>
            )}
          </div>
        </div>

        {/* Evolution des réservations */}
        <div className={`${carte} p-5`}>

          <h2 className="text-lg font-semibold text-[#232821] dark:text-white">
            Évolution des réservations
          </h2>

          <p className="mt-1 text-sm text-[#8B9186] dark:text-slate-400">
            Évolution du nombre de réservations dans le temps.
          </p>

          <div className="mt-2 h-72">
            {reservationsMoisData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={reservationsMoisData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#94a3b8"
                    strokeOpacity={0.25}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="mois"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#94a3b8", strokeOpacity: 0.4 }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip contentStyle={tooltipStyle} />

                  <Line
                    type="monotone"
                    dataKey="nombre"
                    name="Réservations"
                    stroke="#3E8E63"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#3E8E63", strokeWidth: 0 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Aucune réservation disponible.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          CIRCUITS LES PLUS ET MOINS UTILISES
      ===================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Plus utilisé */}
        <div className={`${carte} border-l-4 border-l-[#3E8E63] p-6`}>

          <p className="text-sm font-medium text-[#6B7268] dark:text-slate-400">
            Circuit le plus utilisé
          </p>

          {circuitPlusUtilise ? (
            <>
              <h3 className="mt-2 text-xl font-bold text-[#232821] dark:text-white">
                {circuitPlusUtilise.nom}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#3E8E63] dark:text-emerald-400">
                {circuitPlusUtilise.nombre} réservation
                {circuitPlusUtilise.nombre > 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <p className="mt-2 text-slate-400">
              Aucune donnée disponible.
            </p>
          )}
        </div>

        {/* Moins utilisé */}
        <div className={`${carte} border-l-4 border-l-[#C4693F] p-6`}>

          <p className="text-sm font-medium text-[#6B7268] dark:text-slate-400">
            Circuit le moins utilisé
          </p>

          {circuitMoinsUtilise ? (
            <>
              <h3 className="mt-2 text-xl font-bold text-[#232821] dark:text-white">
                {circuitMoinsUtilise.nom}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#C4693F] dark:text-orange-300">
                {circuitMoinsUtilise.nombre} réservation
                {circuitMoinsUtilise.nombre > 1 ? "s" : ""}
              </p>
            </>
          ) : (
            <p className="mt-2 text-slate-400">
              Aucune donnée disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistiques;