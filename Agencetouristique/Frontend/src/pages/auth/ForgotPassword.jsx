import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [envoye, setEnvoye] = useState(false);

  // Envoi de la demande de code temporaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      // Affichage du message de confirmation
      setEnvoye(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-800 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">Mot de passe oublié</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Saisissez votre email pour recevoir un code temporaire.
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4">
            {error}
          </div>
        )}

        {envoye ? (
          // Message de confirmation après l'envoi
          <div>
            <div className="mb-5 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 p-4">
              Si cet email existe, un code temporaire vient d'être envoyé. Il est valable{" "}
              <b>2 minutes</b>. Utilisez-le comme mot de passe pour vous connecter, puis choisissez
              un nouveau mot de passe dans votre profil.
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3 font-semibold text-white rounded-lg transition bg-teal-600 hover:bg-teal-700"
            >
              Aller à la connexion
            </button>
          </div>
        ) : (
          // Formulaire de saisie de l'email
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@gmail.com"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold text-white rounded-lg transition ${loading ? "bg-gray-400 dark:bg-slate-600" : "bg-teal-600 hover:bg-teal-700"}`}
            >
              {loading ? "Envoi en cours..." : "Envoyer le code"}
            </button>

            <div className="text-center mt-5">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;