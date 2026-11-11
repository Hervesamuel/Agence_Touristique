
import { useState } from "react";
import { Navigate, Route, Routes, Outlet, useLocation } from "react-router-dom";

// Importation des services d'authentification
import { getToken, getUser } from "../services/authService";

// Importation des pages d'authentification
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";

// Importation des dashboards
import Dashboard from "../pages/responsable/Dashboard";
import DashboardChauffeur from "../pages/chauffeur/DashboardChauffeur";

// Importation des composants de navigation
import Sidebar from "../components/navigation/Sidebar";
import Navbar from "../components/navigation/Navbar";

// Importation des pages du Responsable
import Agents from "../pages/responsable/Agents";
import Chauffeurs from "../pages/responsable/Chauffeurs";
import Circuits from "../pages/responsable/Circuits";
import Vehicules from "../pages/responsable/Vehicules";
import RendezVous from "../pages/responsable/RendezVous";
import Parametres from "../pages/responsable/Parametres";
import Statistiques from "../pages/responsable/Statistique";
import Reservations from "../pages/responsable/Reservation";

// Importation des autres pages
import Notifications from "../pages/Notifications";
import Profil from "../pages/Profil";
import ReservationForm from "../pages/agent/ReservationForm";

// =====================================================
// PROTECTION DES ROUTES
// =====================================================

function ProtectedLayout() {

    // Gestion de l'état d'ouverture de la Sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Récupération du token JWT
    const token = getToken();

    // Récupération des informations utilisateur
    const user = getUser();

    // Page courante
    const location = useLocation();

    // Redirection vers la connexion si aucune session n'existe
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Fermeture de la Sidebar après navigation
    const handleNavigation = () => setIsSidebarOpen(false);

    return (
        <div className="h-screen bg-slate-100 dark:bg-slate-900 flex relative overflow-hidden">

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={handleNavigation}
            />

            {/* Zone principale */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">

                {/* Navbar */}
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Contenu des pages */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div key={location.pathname} className="page-transition">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}

// =====================================================
// VÉRIFICATION DU RÔLE
// =====================================================

function RoleRoute({ allowedRoles, children }) {

    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

// =====================================================
// REDIRECTION DU DASHBOARD SELON LE RÔLE
// =====================================================

function DashboardRedirect() {

    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "CHAUFFEUR") {
        return <DashboardChauffeur />;
    }

    if (user.role === "RESPONSABLE") {
        return <Dashboard />;
    }

    // L'espace Agent sera intégré ultérieurement
    return <Navigate to="/login" replace />;
}

// =====================================================
// CONFIGURATION DES ROUTES
// =====================================================

function AppRoutes() {

    return (
        <Routes>

            {/* Pages publiques */}
            <Route path="/login" element={<Login />} />
            <Route
                path="/mot-de-passe-oublie"
                element={<ForgotPassword />}
            />

            {/* Pages protégées */}
            <Route element={<ProtectedLayout />}>

                {/* Dashboard selon le rôle */}
                <Route
                    path="/dashboard"
                    element={<DashboardRedirect />}
                />

                {/* Gestion des agents */}
                <Route
                    path="/agents"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE"]}>
                            <Agents />
                        </RoleRoute>
                    }
                />

                {/* Gestion des chauffeurs */}
                <Route
                    path="/chauffeurs"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE"]}>
                            <Chauffeurs />
                        </RoleRoute>
                    }
                />

                {/* Gestion des circuits */}
                <Route
                    path="/circuits"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE", "AGENT", "CHAUFFEUR"]}>
                            <Circuits />
                        </RoleRoute>
                    }
                />

                {/* Gestion des véhicules */}
                <Route
                    path="/vehicules"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE", "AGENT", "CHAUFFEUR"]}>
                            <Vehicules />
                        </RoleRoute>
                    }
                />

                {/* Gestion des rendez-vous */}
                <Route
                    path="/rendez-vous"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE", "AGENT"]}>
                            <RendezVous />
                        </RoleRoute>
                    }
                />

                {/* Paramètres */}
                {/* MODIFIÉ : ajout du rôle CHAUFFEUR */}
                <Route
                    path="/parametres"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE", "CHAUFFEUR"]}>
                            <Parametres />
                        </RoleRoute>
                    }
                />

                {/* Statistiques */}
                <Route
                    path="/statistiques"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE"]}>
                            <Statistiques />
                        </RoleRoute>
                    }
                />

                {/* Réservations */}
                <Route
                    path="/reservations"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE", "AGENT", "CHAUFFEUR"]}>
                            <Reservations />
                        </RoleRoute>
                    }
                />

                {/* Notifications */}
                {/* MODIFIÉ : ajout du rôle CHAUFFEUR */}
                <Route
                    path="/notifications"
                    element={
                        <RoleRoute allowedRoles={["RESPONSABLE", "AGENT", "CHAUFFEUR"]}>
                            <Notifications />
                        </RoleRoute>
                    }
                />

                {/* Profil */}
                <Route path="/profil" element={<Profil />} />

                {/* Création d'une réservation */}
                <Route
                    path="/reservations/nouveau"
                    element={
                        <RoleRoute allowedRoles={["AGENT"]}>
                            <ReservationForm />
                        </RoleRoute>
                    }
                />

                {/* Modification d'une réservation */}
                <Route
                    path="/reservations/:id/modifier"
                    element={
                        <RoleRoute allowedRoles={["AGENT"]}>
                            <ReservationForm />
                        </RoleRoute>
                    }
                />

            </Route>

            {/* Route par défaut */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
    );
}

export default AppRoutes;