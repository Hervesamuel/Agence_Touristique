// Importation de la configuration des API
import API from "./api";

// =====================================================
// RECUPERATION DE TOUS LES AGENTS
// =====================================================

const getAgents = async () => {
  try {
    const response = await fetch(API.agents);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de récupérer les agents"
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

// =====================================================
// RECUPERATION D'UN AGENT
// =====================================================

const getAgentById = async (id) => {
  try {
    const response = await fetch(`${API.agents}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de récupérer l'agent"
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

// =====================================================
// CREATION D'UN AGENT
// =====================================================

const createAgent = async (agentData) => {
  try {
    const response = await fetch(API.agents, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de créer l'agent"
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

// =====================================================
// MODIFICATION D'UN AGENT
// =====================================================

const updateAgent = async (id, agentData) => {
  try {
    const response = await fetch(`${API.agents}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de modifier l'agent"
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

// =====================================================
// SUPPRESSION D'UN AGENT
// =====================================================

const deleteAgent = async (id) => {
  try {
    const response = await fetch(`${API.agents}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible de supprimer l'agent"
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

// =====================================================
// EXPORTATION DU SERVICE
// =====================================================

export {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};