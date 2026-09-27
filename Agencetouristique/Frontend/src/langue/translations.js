import translationsCommon from "./translationsCommon";
import translationsParametres from "./translationsParametres";
import translationsAgents from "./translationsAgents";
import translationsAgentForm from "./translationsAgentForm";
import translationsNavbar from "./translationsNavbar";

const translations = {
  fr: {
    ...translationsCommon.fr,
    ...translationsParametres.fr,
    ...translationsAgents.fr,
    ...translationsAgentForm.fr,
    ...translationsNavbar.fr,
  },
  mg: {
    ...translationsCommon.mg,
    ...translationsParametres.mg,
    ...translationsAgents.mg,
    ...translationsAgentForm.mg,
    ...translationsNavbar.mg,
  },
  en: {
    ...translationsCommon.en,
    ...translationsParametres.en,
    ...translationsAgents.en,
    ...translationsAgentForm.en,
    ...translationsNavbar.en,
  },
};

export default translations;