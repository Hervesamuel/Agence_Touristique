import translationsCommon from "./translationsCommon";
import translationsParametres from "./translationsParametres";
import translationsAgents from "./translationsAgents";
import translationsAgentForm from "./translationsAgentForm";
import translationsNavbar from "./translationsNavbar";
import translationsChauffeurForm from "./translationsChauffeurForm";
import translationsChauffeurs from "./translationsChauffeurs";

const translations = {
  fr: {
    ...translationsCommon.fr,
    ...translationsParametres.fr,
    ...translationsAgents.fr,
    ...translationsAgentForm.fr,
    ...translationsNavbar.fr,
    ...translationsChauffeurForm.fr,
    ...translationsChauffeurs.fr,
  },
  mg: {
    ...translationsCommon.mg,
    ...translationsParametres.mg,
    ...translationsAgents.mg,
    ...translationsAgentForm.mg,
    ...translationsNavbar.mg,
    ...translationsChauffeurForm.mg,
    ...translationsChauffeurs.mg,
  },
  en: {
    ...translationsCommon.en,
    ...translationsParametres.en,
    ...translationsAgents.en,
    ...translationsAgentForm.en,
    ...translationsNavbar.en,
    ...translationsChauffeurForm.en,
    ...translationsChauffeurs.en,
  },
};

export default translations;