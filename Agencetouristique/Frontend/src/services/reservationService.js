// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// Récupération de toutes les réservations
const getReservations = async () => {
  try {
    const response = await fetchAuth(API.reservations);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de récupérer les réservations"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Impossible de contacter le serveur.");
    }

    throw error;
  }
};

// Récupération d'une réservation
const getReservationById = async (id) => {
  try {
    const response = await fetchAuth(`${API.reservations}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de récupérer la réservation"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Impossible de contacter le serveur.");
    }

    throw error;
  }
};

// Création d'une réservation
const createReservation = async (reservationData) => {
  try {
    const response = await fetchAuth(API.reservations, {
      method: "POST",
      body: JSON.stringify(reservationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de créer la réservation"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Impossible de contacter le serveur.");
    }

    throw error;
  }
};

// Modification d'une réservation
const updateReservation = async (id, reservationData) => {
  try {
    const response = await fetchAuth(`${API.reservations}/${id}`, {
      method: "PUT",
      body: JSON.stringify(reservationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de modifier la réservation"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Impossible de contacter le serveur.");
    }

    throw error;
  }
};

// Suppression d'une réservation
const deleteReservation = async (id) => {
  try {
    const response = await fetchAuth(`${API.reservations}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de supprimer la réservation"
      );
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Impossible de contacter le serveur.");
    }

    throw error;
  }
};

export {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};