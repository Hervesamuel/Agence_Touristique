// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// Récupération de tous les véhicules
const getVehicules = async () => {
  try {
    const response = await fetchAuth(API.vehicules);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer les véhicules");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Récupération d'un véhicule
const getVehiculeById = async (id) => {
  try {
    const response = await fetchAuth(`${API.vehicules}/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer le véhicule");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Création d'un véhicule
const createVehicule = async (vehiculeData) => {
  try {
    const response = await fetchAuth(API.vehicules, {
      method: "POST",
      body: JSON.stringify(vehiculeData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de créer le véhicule");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Modification d'un véhicule
const updateVehicule = async (id, vehiculeData) => {
  try {
    const response = await fetchAuth(`${API.vehicules}/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehiculeData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de modifier le véhicule");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Suppression d'un véhicule
const deleteVehicule = async (id) => {
  try {
    const response = await fetchAuth(`${API.vehicules}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de supprimer le véhicule");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

export { getVehicules, getVehiculeById, createVehicule, updateVehicule, deleteVehicule };