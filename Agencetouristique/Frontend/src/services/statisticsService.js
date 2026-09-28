// Calcul de la répartition des chauffeurs par genre
const getChauffeursByGenre = (chauffeurs) => {
  const statistiques = {
    Féminin: 0,
    Masculin: 0,
  };

  chauffeurs.forEach((chauffeur) => {
    const genre = chauffeur.genre?.toLowerCase();

    if (genre === "féminin" || genre === "feminin" || genre === "f") {
      statistiques.Féminin++;
    } else if (
      genre === "masculin" ||
      genre === "m" ||
      genre === "homme"
    ) {
      statistiques.Masculin++;
    }
  });

  return Object.entries(statistiques).map(([genre, nombre]) => ({
    genre,
    nombre,
  }));
};

// Calcul du nombre de réservations par circuit
const getReservationsByCircuit = (reservations, circuits) => {
  const statistiques = circuits.map((circuit) => {
    const nombre = reservations.filter(
      (reservation) => reservation.idcircuit === circuit.idcircuit
    ).length;

    return {
      nom: circuit.nom,
      nombre,
    };
  });

  return statistiques.sort((a, b) => b.nombre - a.nombre);
};

// Calcul du nombre de rendez-vous par statut
const getRendezVousByStatut = (rendezVous) => {
  const statistiques = {};

  rendezVous.forEach((rdv) => {
    const statut = rdv.statut || "Non défini";

    statistiques[statut] = (statistiques[statut] || 0) + 1;
  });

  return Object.entries(statistiques).map(([statut, nombre]) => ({
    statut,
    nombre,
  }));
};

// Calcul de l'évolution des réservations par mois
const getReservationsByMonth = (reservations) => {
  const statistiques = {};

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

    statistiques[mois] = (statistiques[mois] || 0) + 1;
  });

  return Object.entries(statistiques).map(([mois, nombre]) => ({
    mois,
    nombre,
  }));
};

// Recherche du circuit le plus utilisé
const getMostUsedCircuit = (reservations, circuits) => {
  const statistiques = getReservationsByCircuit(reservations, circuits);

  return statistiques.length > 0 ? statistiques[0] : null;
};

// Recherche du circuit le moins utilisé
const getLeastUsedCircuit = (reservations, circuits) => {
  const statistiques = getReservationsByCircuit(reservations, circuits);

  return statistiques.length > 0
    ? statistiques[statistiques.length - 1]
    : null;
};

export {
  getChauffeursByGenre,
  getReservationsByCircuit,
  getRendezVousByStatut,
  getReservationsByMonth,
  getMostUsedCircuit,
  getLeastUsedCircuit,
};
