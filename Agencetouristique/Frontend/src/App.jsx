import { BrowserRouter } from "react-router-dom";
// Importation des routes de l'application
import AppRoutes from "./routes/AppRoutes";
// 
import { FontSizeProvider } from "./contexts/FontSizeContext";

function App() {
  return (
    <BrowserRouter>
      <FontSizeProvider>
        <AppRoutes />
      </FontSizeProvider>
    </BrowserRouter>
  );
}
export default App;