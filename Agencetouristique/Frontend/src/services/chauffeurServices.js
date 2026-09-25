// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// =====================================================
// RECUPERATION DE TOUS LES CHAUFFEURS
// =====================================================
const getChauffeurs = async () => {
  try {
    const response = await fetchAuth(API.chauffeurs);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer les chauffeurs");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// RECUPERATION D'UN CHAUFFEUR
// =====================================================
const getChauffeurById = async (id) => {
  try {
    const response = await fetchAuth(`${API.chauffeurs}/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer le chauffeur");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// CREATION D'UN CHAUFFEUR
// =====================================================
const createChauffeur = async (chauffeurData) => {
  try {
    const response = await fetchAuth(API.chauffeurs, {
      method: "POST",
      body: JSON.stringify(chauffeurData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de créer le chauffeur");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// MODIFICATION D'UN CHAUFFEUR
// =====================================================
const updateChauffeur = async (id, chauffeurData) => {
  try {
    const response = await fetchAuth(`${API.chauffeurs}/${id}`, {
      method: "PUT",
      body: JSON.stringify(chauffeurData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de modifier le chauffeur");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// SUPPRESSION D'UN CHAUFFEUR
// =====================================================
const deleteChauffeur = async (id) => {
  try {
    const response = await fetchAuth(`${API.chauffeurs}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de supprimer le chauffeur");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================
export { getChauffeurs, getChauffeurById, createChauffeur, updateChauffeur, deleteChauffeur };