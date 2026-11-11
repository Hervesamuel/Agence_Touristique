const PAGES_COMMUNES = ["/dashboard", "/parametres", "/profil", "/notifications"];

// Pages supplémentaires selon le rôle. Le responsable a accès à tout.
const PAGES_PAR_ROLE = {
  AGENT: ["/reservations", "/rendez-vous", "/circuits", "/vehicules"],
  CHAUFFEUR: ["/circuits", "/vehicules"],
};

export const peutAcceder = (role, path) =>
  role === "RESPONSABLE" || PAGES_COMMUNES.includes(path) || (PAGES_PAR_ROLE[role] ?? []).includes(path);