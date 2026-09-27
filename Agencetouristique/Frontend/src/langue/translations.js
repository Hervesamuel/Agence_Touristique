import translationsCommon from "./translationsCommon";
import translationsParametres from "./translationsParametres";
import translationsAgents from "./translationsAgents";
import translationsAgentForm from "./translationsAgentForm";
import translationsNavbar from "./translationsNavbar";
import translationsChauffeurForm from "./translationsChauffeurForm";
import translationsChauffeurs from "./translationsChauffeurs";
import translationsCircuits from "./translationsCircuits";
import translationsCircuitForm from "./translationsCircuitForm";
import translationsVehiculeForm from "./translationsVehiculeForm";
import translationsVehicules from "./translationsVehicules";


const translations = {
  fr: {
    ...translationsCommon.fr,
    ...translationsParametres.fr,
    ...translationsAgents.fr,
    ...translationsAgentForm.fr,
    ...translationsNavbar.fr,
    ...translationsChauffeurForm.fr,
    ...translationsChauffeurs.fr,
    ...translationsCircuitForm.fr,
    ...translationsCircuits.fr,
    ...translationsVehiculeForm.fr,
    ...translationsVehicules.fr,
  },
  mg: {
    ...translationsCommon.mg,
    ...translationsParametres.mg,
    ...translationsAgents.mg,
    ...translationsAgentForm.mg,
    ...translationsNavbar.mg,
    ...translationsChauffeurForm.mg,
    ...translationsChauffeurs.mg,
    ...translationsCircuitForm.mg,
    ...translationsCircuits.mg,
    ...translationsVehiculeForm.mg,
    ...translationsVehicules.mg,
  },
  en: {
    ...translationsCommon.en,
    ...translationsParametres.en,
    ...translationsAgents.en,
    ...translationsAgentForm.en,
    ...translationsNavbar.en,
    ...translationsChauffeurForm.en,
    ...translationsChauffeurs.en,
    ...translationsCircuitForm.en,
    ...translationsCircuits.en,
    ...translationsVehiculeForm.en,
    ...translationsVehicules.en,
  },
};

export default translations;