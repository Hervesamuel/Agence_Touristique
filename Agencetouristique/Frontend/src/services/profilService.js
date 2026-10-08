import API, { fetchAuth } from "./api";

// Appel authentifié commun : renvoie le JSON ou lève une erreur lisible
const appeler = async (url, options, messageParDefaut) => {
  try {
    const response = await fetchAuth(url, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || messageParDefaut);
    return data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

const getMonProfil = () => appeler(`${API.profil}/me`, {}, "Impossible de récupérer le profil");

const updateMonProfil = (profilData) =>
  appeler(`${API.profil}/me`, { method: "PUT", body: JSON.stringify(profilData) }, "Impossible de modifier le profil");

const changerMotDePasse = (mdpActuel, mdpNouveau) =>
  appeler(`${API.profil}/me/mot-de-passe`, { method: "PUT", body: JSON.stringify({ mdpActuel, mdpNouveau }) }, "Impossible de changer le mot de passe");

export { getMonProfil, updateMonProfil, changerMotDePasse };