import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getNotifications,
  marquerCommeLue,
  marquerToutesCommeLues,
} from "../services/notificationsService";
import { useLanguage } from "../contexts/LanguageContext";

function Notifications() {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getNotifications();
      setNotifications(response.data || response || []);
    } catch (err) {
      setError(err.message || t("notifications_erreur_defaut"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Marquer une notification comme lue au clic
  const handleClickNotification = async (notif) => {
    if (notif.lue) return;
    try {
      await marquerCommeLue(notif.idnotif);
      setNotifications((prev) =>
        prev.map((n) => (n.idnotif === notif.idnotif ? { ...n, lue: true } : n))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Tout marquer comme lu
  const handleMarquerTout = async () => {
    try {
      await marquerToutesCommeLues();
      setNotifications((prev) => prev.map((n) => ({ ...n, lue: true })));
    } catch (err) {
      alert(err.message);
    }
  };

  // Formatage de la date selon la langue active
  const formatDate = (date) => {
    const locale = language === "en" ? "en-US" : language === "mg" ? "fr-FR" : "fr-FR";
    return new Date(date).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasUnread = notifications.some((n) => !n.lue);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">
        {t("notifications_chargement")}
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 m-6 rounded-xl border border-red-200 dark:border-red-800 font-medium">
        {error}
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <Link
        to="/dashboard"
        className="md:hidden inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl shadow-sm"
      >
        <span>←</span> <span>{t("retour_dashboard")}</span>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {t("notifications_titre")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            {t("notifications_soustitre")}
          </p>
        </div>

        {hasUnread && (
          <button
            type="button"
            onClick={handleMarquerTout}
            className="w-full sm:w-auto px-5 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            {t("notifications_tout_marquer")}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-medium">
          {t("notifications_aucune")}
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <button
              key={notif.idnotif}
              type="button"
              onClick={() => handleClickNotification(notif)}
              className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border shadow-sm transition-colors ${
                notif.lue
                  ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 bg-emerald-500 dark:bg-emerald-400" style={{ visibility: notif.lue ? "hidden" : "visible" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800 dark:text-slate-100 font-medium">{notif.message}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatDate(notif.date)}</p>
              </div>
              <span
                className={`shrink-0 text-xxs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  notif.lue
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                {notif.lue ? t("notifications_lue") : t("notifications_non_lue")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;