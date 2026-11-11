
import { useState, useEffect } from "react";
import { getUser } from "../../services/authService";
import { useLanguage } from "../../contexts/LanguageContext";

// =====================================================
// COMPOSANT : TABLEAU DE BORD DU CHAUFFEUR
// =====================================================

function DashboardChauffeur() {
    const { language } = useLanguage();
    const user = getUser();

    // Gestion de la date du jour
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        setDate(new Date());
    }, []);

    // Langue utilisée pour le formatage
    const locale =
        language === "mg"
            ? "mg-MG"
            : language === "en"
                ? "en-US"
                : "fr-FR";

    // Formatage de la date
    const dateDuJour = date.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <main className="min-h-full bg-[#FAF8F3] dark:bg-slate-900 p-4 sm:p-6 lg:p-8">

            {/* Message de bienvenue */}
            <section className="relative overflow-hidden mb-8 p-6 sm:p-8 rounded-2xl border border-[#E9E4D6] dark:border-slate-700 bg-gradient-to-br from-[#E8F0E3] via-white to-[#FAF8F3] dark:from-emerald-900/25 dark:via-slate-800 dark:to-slate-900 shadow-sm">

                <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#2F5233]/10 dark:bg-emerald-400/10 blur-2xl"
                />

                <div className="relative">
                    <span className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-[#2F5233]/10 dark:bg-emerald-400/10 text-[#2F5233] dark:text-emerald-400 text-xs font-semibold">
                        ESPACE CHAUFFEUR
                    </span>

                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#232821] dark:text-slate-100">
                        Bonjour, {user?.nom || "Chauffeur"} !
                    </h1>

                    <p className="mt-2 text-[#6B7268] dark:text-slate-400">
                        Bienvenue dans votre espace personnel.
                    </p>

                    <div className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 ring-1 ring-[#2F5233]/15 dark:ring-emerald-400/20 text-[#2F5233] dark:text-emerald-400">
                        <span className="text-sm font-semibold capitalize">
                            {dateDuJour}
                        </span>
                    </div>
                </div>
            </section>

            {/* Informations personnelles */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold text-[#232821] dark:text-slate-100 mb-4">
                    Mes informations
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Nom */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E9E4D6] dark:border-slate-700 shadow-sm">
                        <p className="text-sm text-[#8B9186] dark:text-slate-400 mb-2">
                            Nom complet
                        </p>

                        <p className="font-semibold text-[#232821] dark:text-slate-100">
                            {user?.nom || "Non renseigné"}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E9E4D6] dark:border-slate-700 shadow-sm">
                        <p className="text-sm text-[#8B9186] dark:text-slate-400 mb-2">
                            Adresse e-mail
                        </p>

                        <p className="font-semibold text-[#232821] dark:text-slate-100 break-all">
                            {user?.email || "Non renseignée"}
                        </p>
                    </div>

                    {/* Rôle */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E9E4D6] dark:border-slate-700 shadow-sm">
                        <p className="text-sm text-[#8B9186] dark:text-slate-400 mb-2">
                            Fonction
                        </p>

                        <p className="font-semibold text-[#2F5233] dark:text-emerald-400">
                            Chauffeur
                        </p>
                    </div>

                    {/* Identifiant */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-[#E9E4D6] dark:border-slate-700 shadow-sm">
                        <p className="text-sm text-[#8B9186] dark:text-slate-400 mb-2">
                            Identifiant utilisateur
                        </p>

                        <p className="font-semibold text-[#232821] dark:text-slate-100">
                            {user?.id ?? "Non disponible"}
                        </p>
                    </div>

                </div>
            </section>

            {/* Information sur les fonctionnalités */}
            <section className="p-6 rounded-2xl border border-[#E9E4D6] dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <h2 className="text-lg font-semibold text-[#232821] dark:text-slate-100 mb-2">
                    Mon espace de travail
                </h2>

                <p className="text-sm leading-6 text-[#6B7268] dark:text-slate-400">
                    Cet espace sera utilisé pour consulter les informations
                    relatives à votre véhicule, vos circuits et vos missions.
                    Les fonctionnalités seront accessibles selon les
                    autorisations attribuées à votre compte.
                </p>
            </section>

        </main>
    );
}

export default DashboardChauffeur;
