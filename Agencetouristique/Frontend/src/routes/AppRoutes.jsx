import { useState } from "react";
import { Navigate, Route, Routes, Outlet, useLocation } from "react-router-dom";
// Importation du service d'authentification
import { getToken } from "../services/authService";
// Importation de la page de connexion
import Login from "../pages/auth/Login";
// Importation du Dashboard Responsable
import Dashboard from "../pages/responsable/Dashboard";
// Importation de la Sidebar
import Sidebar from "../components/navigation/Sidebar";
// Importation de la Navbar
import Navbar from "../components/navigation/Navbar";

function ProtectedLayout() {
  // Gestion de l'état d'ouverture de la Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Récupération de l'URL actuelle
  const location = useLocation();
  // Vérification du token JWT
  const token = getToken();

  // Redirection vers la connexion si aucun token n'existe
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Fermeture de la Sidebar après changement de page
  const handleNavigation = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleNavigation} />
      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        {/* Contenu des pages */}
        <main className="flex-1 overflow-auto">
          <Outlet />
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
        {/* Les futures routes seront ajoutées ici */}
      </Route>
      {/* Route par défaut */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
