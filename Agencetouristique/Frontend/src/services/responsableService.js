// Importation de la configuration des API
import API, { fetchAuth } from "./api";

// Récupération de mon profil
const getMonProfil = async () => {
  try {
    const response = await fetchAuth(`${API.responsables}/me`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de récupérer le profil");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Modification de mon profil
const updateMonProfil = async (profilData) => {
  try {
    const response = await fetchAuth(`${API.responsables}/me`, {
      method: "PUT",
      body: JSON.stringify(profilData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de modifier le profil");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

// Changement du mot de passe
const changerMotDePasse = async (motDePasseData) => {
  try {
    const response = await fetchAuth(`${API.responsables}/me/mot-de-passe`, {
      method: "PUT",
      body: JSON.stringify(motDePasseData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible de changer le mot de passe");
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

export { getMonProfil, updateMonProfil, changerMotDePasse};