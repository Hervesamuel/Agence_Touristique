import { useState } from "react";
import { Navigate, Route, Routes, Outlet,useLocation } from "react-router-dom";
// Importation du service d'authentification
import { getToken } from "../services/authService";
// Importation de la page de connexion
import Login from "../pages/auth/Login";
// Importation du Dashboard Responsable
import Dashboard from "../pages/responsable/Dashboard";
// Importation de la page de gestion des agents
import Agents from "../pages/responsable/Agents";
// Importation de la Sidebar
import Sidebar from "../components/navigation/Sidebar";
// Importation de la Navbar
import Navbar from "../components/navigation/Navbar";
import Chauffeurs from "../pages/responsable/Chauffeurs";
// Importation de la page de gestion des circuits
import Circuits from "../pages/responsable/Circuits";
// Importation de la page de gestion des véhicules
import Vehicules from "../pages/responsable/Vehicules";

import RendezVous from "../pages/responsable/RendezVous";

import Parametres from "../pages/responsable/Parametres";

import Statistiques from "../pages/responsable/Statistique";

// Importation de la page de gestion des réservations
import Reservations from "../pages/responsable/Reservation";

import Notifications from "../pages/Notifications";

import Profil from "../pages/Profil";



function ProtectedLayout() {

  
  // Gestion de l'état d'ouverture de la Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Vérification du token JWT
  const token = getToken();
  // Page courante (sert à relancer l'animation à chaque changement de page)
  const location = useLocation();

  // Redirection vers la connexion si aucun token n'existe
  if (!token) return <Navigate to="/login" replace />;

  // Fermeture de la Sidebar après navigation
  const handleNavigation = () => setIsSidebarOpen(false);

    return (
    <div className="h-screen bg-slate-100 dark:bg-slate-900 flex relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleNavigation} />

      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Contenu des pages */}
        <main className="flex-1 overflow-y-auto">
                 {/* Contenu des pages */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </main>
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/login" element={<Login />} />

      {/* Pages protégées */}
      <Route element={<ProtectedLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Gestion des agents */}
        <Route path="/agents" element={<Agents />} />
        {/* Gestion des chauffeurs */}
        <Route path="/chauffeurs" element={<Chauffeurs />} />
        {/* Gestion des circuits */}
        <Route path="/circuits" element={<Circuits />} />
        {/* Gestion des véhicules */}
        <Route path="/vehicules" element={<Vehicules />} />
        {/* Gestion des Rendez_vous */}
        <Route path="/rendez-vous" element={<RendezVous />} />
        {/* Gestion des paramètres */}
        <Route path="/parametres" element={<Parametres />} />
        {/* Gestion des Statistiques */}
        <Route path="/statistiques" element={<Statistiques />} />
        {/* Gestion des réservations */}
        <Route path="/reservations" element={<Reservations />} />
        {/* Gestion des notifications */}
        <Route path="/notifications" element={<Notifications />} />
        {/* Gestion du profil */}
        <Route path="/profil" element={<Profil />} />
      </Route>
      

      {/* Route par défaut */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;