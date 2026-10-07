// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// Récupération de mes notifications
const getNotifications = async () => {
  try {
    const response = await fetchAuth(API.notifications);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer les notifications");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Récupération du nombre de notifications non lues
const getNombreNonLues = async () => {
  try {
    const response = await fetchAuth(`${API.notifications}/non-lues/count`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer le compteur");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Marquer une notification comme lue
const marquerCommeLue = async (id) => {
  try {
    const response = await fetchAuth(`${API.notifications}/${id}/lue`, { method: "PUT" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de mettre à jour la notification");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Marquer toutes les notifications comme lues
const marquerToutesCommeLues = async () => {
  try {
    const response = await fetchAuth(`${API.notifications}/lues/tout`, { method: "PUT" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de mettre à jour les notifications");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Suppression d'une notification
const deleteNotification = async (id) => {
  try {
    const response = await fetchAuth(`${API.notifications}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de supprimer la notification");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

export { getNotifications, getNombreNonLues, marquerCommeLue, marquerToutesCommeLues, deleteNotification };