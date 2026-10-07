import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { useLanguage } from "../../contexts/LanguageContext";

function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, mdp);
      console.log("Connexion réussie :", data);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setError(t("login_erreur_serveur"));
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-teal-600">{t("login_plateforme_titre")}</h1>
          <p className="text-gray-500 mt-2">{t("login_plateforme_soustitre")}</p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 p-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t("login_email_label")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("login_email_placeholder")}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="mdp" className="block text-sm font-medium text-gray-700 mb-2">
              {t("login_mdp_label")}
            </label>
            <input
              id="mdp"
              type="password"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              placeholder={t("login_mdp_placeholder")}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-sm text-teal-600 hover:underline"
            >
              {t("login_mdp_oublie")}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold text-white rounded-lg transition ${loading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {loading ? t("login_btn_en_cours") : t("login_btn")}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t("login_footer")}
        </p>
      </div>
    </div>
  );
}

export default Login;
