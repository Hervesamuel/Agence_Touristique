// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// =====================================================
// RECUPERATION DE TOUS LES CIRCUITS
// =====================================================
const getCircuits = async () => {
  try {
    const response = await fetchAuth(API.circuits);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer les circuits");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// RECUPERATION D'UN CIRCUIT
// =====================================================
const getCircuitById = async (id) => {
  try {
    const response = await fetchAuth(`${API.circuits}/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer le circuit");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// CREATION D'UN CIRCUIT
// =====================================================
const createCircuit = async (circuitData) => {
  try {
    const response = await fetchAuth(API.circuits, {
      method: "POST",
      body: JSON.stringify(circuitData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de créer le circuit");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// MODIFICATION D'UN CIRCUIT
// =====================================================
const updateCircuit = async (id, circuitData) => {
  try {
    const response = await fetchAuth(`${API.circuits}/${id}`, {
      method: "PUT",
      body: JSON.stringify(circuitData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de modifier le circuit");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// SUPPRESSION D'UN CIRCUIT
// =====================================================
const deleteCircuit = async (id) => {
  try {
    const response = await fetchAuth(`${API.circuits}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de supprimer le circuit");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================
export { getCircuits, getCircuitById, createCircuit, updateCircuit, deleteCircuit };