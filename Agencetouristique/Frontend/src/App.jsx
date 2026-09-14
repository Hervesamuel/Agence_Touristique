import Sidebar from "./components/navigation/Sidebar";
import Navbar from "./components/navigation/Navbar";
import Dashboard from "./pages/responsable/Dashboard";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
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