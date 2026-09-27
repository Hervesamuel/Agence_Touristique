import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { FontSizeProvider } from "./contexts/FontSizeContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FontSizeProvider>
          <AppRoutes />
        </FontSizeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;