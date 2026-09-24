import { BrowserRouter } from "react-router-dom";
// Importation des routes de l'application
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
