import { useState } from "react";
// Importation du composant Sidebar
import Sidebar from "./components/navigation/Sidebar";
// Importation du composant Navbar
import Navbar from "./components/navigation/Navbar";
// Importation du Dashboard Responsable
import Dashboard from "./pages/responsable/Dashboard";
// Importation de la page de connexion
import Login from "./pages/auth/Login";
// Importation du service d'authentification
import { getToken } from "./services/authService";

function App() {
  // Vérification de la présence du token JWT
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // Affichage de la page de connexion
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Zone principale */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard */}
        <div className="flex-1 overflow-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;