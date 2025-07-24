import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_CONFIG from "./config/api";
import { useLanguage } from "./LanguageContext";
import { isAuthenticated } from "./utils/auth";
import { EyeIcon, EyeSlashIcon, GlobeAltIcon, UserIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import logo from "./imgtest/logo-tc-advisor 1.png";

function SignUp() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useLanguage();

  // Check if user is already authenticated and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/vosfermes"); // Redirect to dashboard/farms page
    }
  }, [navigate]);

  // State variables for form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const roles = [
    { value: "admin", label: language === "fr" ? "Administrateur" : "مدير" },
    { value: "farmer", label: language === "fr" ? "Agriculteur" : "مزارع" }
  ];

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "name" ? value.trimStart() : value.trim(),
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    const { name, email, password, role } = formData;

    if (!name || !email || !password || !role) {
      setError(
        language === "fr"
          ? "Tous les champs sont obligatoires."
          : "جميع المعلومات مطلوبة."
      );
      return;
    }

    if (!isValidEmail(email)) {
      setError(
        language === "fr"
          ? "Veuillez entrer une adresse e-mail valide."
          : "يرجى إدخال بريد إلكتروني صالح."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        return;
      }

      navigate("/signin");
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-16 w-auto"
            src={logo}
            alt="TecAdvisor Logo"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {language === "fr" ? "Créez votre compte" : "إنشاء حساب جديد"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {language === "fr" ? "Ou " : "أو "}
          <button
            onClick={() => navigate("/signin")}
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
          >
            {language === "fr" ? "connectez-vous à votre compte existant" : "تسجيل الدخول لحساب موجود"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl ring-1 ring-gray-900/5 sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {language === "fr" ? "Nom complet" : "الاسم الكامل"}
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-colors duration-200"
                  placeholder={
                    language === "fr" ? "Entrez votre nom complet" : "أدخل اسمك الكامل"
                  }
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {language === "fr" ? "Adresse e-mail" : "البريد الإلكتروني"}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-colors duration-200"
                  placeholder={
                    language === "fr" ? "Entrez votre adresse e-mail" : "أدخل بريدك الإلكتروني"
                  }
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {language === "fr" ? "Mot de passe" : "كلمة المرور"}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-colors duration-200"
                  placeholder={
                    language === "fr" ? "Créez un mot de passe sécurisé" : "أنشئ كلمة مرور آمنة"
                  }
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                {language === "fr" ? "Rôle" : "الدور"}
              </label>
              <div className="mt-1 relative">
                <select
                  id="role"
                  name="role"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-10 pr-10 bg-white placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm transition-colors duration-200"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    {language === "fr"
                      ? "Sélectionnez votre rôle"
                      : "اختر دورك"}
                  </option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {isLoading
                  ? (language === "fr" ? "Création du compte..." : "جار إنشاء الحساب...")
                  : (language === "fr" ? "Créer mon compte" : "إنشاء الحساب")
                }
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {language === "fr" ? "Préférences" : "التفضيلات"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={toggleLanguage}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              >
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                {language === "fr" ? "العربية" : "Français"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
