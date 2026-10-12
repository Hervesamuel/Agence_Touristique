import API, { fetchAuth } from "./api";

// Envoi d'un SMS aux clients des réservations sélectionnées (via le backend)
const envoyerSms = async (idsReservations, message) => {
  try {
    const response = await fetchAuth(`${API.sms}/envoyer`, {
      method: "POST",
      body: JSON.stringify({ idsReservations, message }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Impossible d'envoyer les SMS");
    return data.data;
  } catch (error) {
    if (error instanceof TypeError) throw new Error("Impossible de contacter le serveur.");
    throw error;
  }
};

export { envoyerSms };