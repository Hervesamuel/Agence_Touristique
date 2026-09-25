// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// Récupération de tous les rendez-vous
const getRendezVous = async () => {
  try {
    const response = await fetchAuth(API.rendezVous);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer les rendez-vous");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Création d'un rendez-vous
const createRendezVous = async (rdvData) => {
  try {
    const response = await fetchAuth(API.rendezVous, {
      method: "POST",
      body: JSON.stringify(rdvData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de créer le rendez-vous");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Modification d'un rendez-vous
const updateRendezVous = async (id, rdvData) => {
  try {
    const response = await fetchAuth(`${API.rendezVous}/${id}`, {
      method: "PUT",
      body: JSON.stringify(rdvData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de modifier le rendez-vous");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Suppression d'un rendez-vous
const deleteRendezVous = async (id) => {
  try {
    const response = await fetchAuth(`${API.rendezVous}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de supprimer le rendez-vous");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

export { getRendezVous, createRendezVous, updateRendezVous, deleteRendezVous };