import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Importation du service d'authentification
import { login } from "../../services/authService";


function Login() {
  const navigate = useNavigate();
  // Gestion des données du formulaire
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  // Gestion du chargement
  const [loading, setLoading] = useState(false);

  // Gestion des erreurs
  const [error, setError] = useState("");

  // Gestion de la connexion
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Appel du service d'authentification
      const data = await login(email, mdp);

      // Affichage des informations reçues
      console.log("Connexion réussie :", data);

     // Redirection vers le Dashboard
    navigate("/dashboard", { replace: true });
    }  catch (error) {
  // Affichage d'un message adapté à l'erreur
  if (error.message === "Failed to fetch") {
        setError("Impossible de contacter le serveur. Veuillez réessayer.");
    } else {
        setError(error.message);
    }
    } finally {
        setLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Nom de la plateforme */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            AgenceTouristique
          </h1>

          <p className="text-slate-500 mt-2">
            Gestion de plateforme
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Connexion
            </h2>

            <p className="text-slate-500 mt-1">
              Connectez-vous à votre espace
            </p>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Adresse email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@gmail.com"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-6">
              <label
                htmlFor="mdp"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Mot de passe
              </label>

              <input
                id="mdp"
                type="password"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                placeholder="Votre mot de passe"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Mot de passe oublié */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Plateforme de gestion d'agence touristique
        </p>

      </div>
    </div>
  );

}



export default Login;