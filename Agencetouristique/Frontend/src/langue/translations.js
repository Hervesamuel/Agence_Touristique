// Dictionnaire de traductions — une entrée par clé, une valeur par langue
const translations = {
  fr: {
    parametres_titre: "Paramètres",
    parametres_soustitre: "Personnalisez votre expérience",

    taille_texte_titre: "Taille du texte",
    taille_texte_soustitre: "Ajustez la taille du texte dans toute l'application",
    taille_petit: "Petit",
    taille_normal: "Normal",
    taille_grand: "Grand",

    apparence_titre: "Apparence",
    apparence_soustitre: "Choisissez l'apparence de l'application",
    theme_clair: "Clair",
    theme_sombre: "Sombre",

    langue_titre: "Langue",
    langue_soustitre: "Choisissez la langue de l'application",
    langue_fr: "Français",
    langue_mg: "Malagasy",
    langue_en: "Anglais",

    retour_dashboard: "Retour au Dashboard",
  },
  mg: {
    parametres_titre: "Kirakira",
    parametres_soustitre: "Ataovy manaraka anao ny fampiasana ny rindrangaisa",

    taille_texte_titre: "Haben'ny soratra",
    taille_texte_soustitre: "Ovay ny habin'ny soratra manerana ny rindrangaisa",
    taille_petit: "Kely",
    taille_normal: "Antonony",
    taille_grand: "Lehibe",

    apparence_titre: "Endrika",
    apparence_soustitre: "Fidio ny endriky ny rindrangaisa",
    theme_clair: "Mazava",
    theme_sombre: "Maizina",

    langue_titre: "Fiteny",
    langue_soustitre: "Fidio ny fiteny ampiasaina",
    langue_fr: "Frantsay",
    langue_mg: "Malagasy",
    langue_en: "Anglisy",

    retour_dashboard: "Hiverina any amin'ny Dashboard",
  },
  en: {
    parametres_titre: "Settings",
    parametres_soustitre: "Customize your experience",

    taille_texte_titre: "Text size",
    taille_texte_soustitre: "Adjust the text size across the application",
    taille_petit: "Small",
    taille_normal: "Normal",
    taille_grand: "Large",

    apparence_titre: "Appearance",
    apparence_soustitre: "Choose the appearance of the application",
    theme_clair: "Light",
    theme_sombre: "Dark",

    langue_titre: "Language",
    langue_soustitre: "Choose the application language",
    langue_fr: "French",
    langue_mg: "Malagasy",
    langue_en: "English",

    retour_dashboard: "Back to Dashboard",
  },

    fr: {
    // ... clés existantes ...

    nav_principal: "Principal",
    nav_dashboard: "Tableau de Bord",
    nav_circuits: "Circuits",
    nav_vehicules: "Véhicules",
    nav_chauffeurs: "Chauffeurs",
    nav_agents: "Agents",
    nav_reservations: "Réservations",
    nav_rendezvous: "Rendez-vous",
    nav_systeme: "Système",
    nav_parametres: "Paramètres",
    sidebar_role: "Responsable",
    sidebar_titre_role: "Administrateur",
  },
  mg: {
    // ... clés existantes ...

    nav_principal: "Fototra",
    nav_dashboard: "Tabilao Fitantanana",
    nav_circuits: "Lalana",
    nav_vehicules: "Fiara",
    nav_chauffeurs: "Mpamily",
    nav_agents: "Mpiasa",
    nav_reservations: "Fanovana",
    nav_rendezvous: "Fotoam-pihaonana",
    nav_systeme: "Rafitra",
    nav_parametres: "Kirakira",
    sidebar_role: "Tompon'andraikitra",
    sidebar_titre_role: "Mpitantana",
  },
  en: {
    // ... clés existantes ...

    nav_principal: "Main",
    nav_dashboard: "Dashboard",
    nav_circuits: "Circuits",
    nav_vehicules: "Vehicles",
    nav_chauffeurs: "Drivers",
    nav_agents: "Agents",
    nav_reservations: "Bookings",
    nav_rendezvous: "Appointments",
    nav_systeme: "System",
    nav_parametres: "Settings",
    sidebar_role: "Manager",
    sidebar_titre_role: "Administrator",
  },
};

export default translations;