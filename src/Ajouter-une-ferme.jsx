import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { useTranslation } from "./i18n";
import { getUser, getAuthToken } from "./utils/auth";
import API_CONFIG from "./config/api";
import Layout from "./components/Layout";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

function Ajoutferme() {
  const { language } = useLanguage();
  const t = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  
  // Retrieve userId and authToken from cookies
  const user = getUser();
  const token = getAuthToken();

  useEffect(() => {
    if (!user || !user.id || !token) {
      navigate("/signin");
    }
  }, [navigate, user, token]);

  const userId = user?.id;
  const { farm } = location.state || {};

  // Determine if this is an edit or add operation
  const isEdit = state?.isEdit || false;
  const farmToEdit = state?.farm || {};

  // State variables for form fields and UI
  const [farmName, setFarmName] = useState(farmToEdit.name || "");
  const [farmCity, setFarmCity] = useState(farmToEdit.address || "");
  const [farmDescription, setFarmDescription] = useState(farmToEdit.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const algerianCities = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar",
    "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers",
    "Djelfa", "Jijel", "Setif", "Saida", "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma",
    "Constantine", "Medea", "Mostaganem", "MSila", "Mascara", "Ouargla", "Oran", "El Bayadh",
    "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued",
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent",
    "Ghardaia", "Relizane", "El M'Ghair", "El Menia", "Ouled Djellal", "Bordj Badji Mokhtar",
    "Beni Abbes", "Timimoun", "Touggourt", "Djanet", "In Salah", "In Guezzam"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!farmName.trim() || !farmCity) {
      setError(language === "fr" 
        ? "Veuillez remplir tous les champs obligatoires." 
        : "يرجى ملء جميع الحقول المطلوبة."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const farmData = {
      name: farmName.trim(),
      address: farmCity,
      description: farmDescription.trim(),
      user_id: parseInt(userId)
    };

    try {
      const url = isEdit 
        ? `${API_CONFIG.BASE_URL}/farms/${farmToEdit.id}`
        : `${API_CONFIG.BASE_URL}/farms`;
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(farmData),
      });

      if (response.ok) {
        setSuccess(language === "fr" 
          ? (isEdit ? "Ferme mise à jour avec succès!" : "Ferme ajoutée avec succès!")
          : (isEdit ? "تم تحديث المزرعة بنجاح!" : "تم إضافة المزرعة بنجاح!")
        );
        
        setTimeout(() => {
          navigate("/vosfermes");
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.message || (language === "fr" 
          ? "Une erreur s'est produite lors de l'opération." 
          : "حدث خطأ أثناء العملية."
        ));
      }
    } catch (err) {
      console.error("Error:", err);
      setError(language === "fr" 
        ? "Une erreur s'est produite. Veuillez réessayer." 
        : "حدث خطأ. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return null; // Render nothing while redirecting
  }

  return (
    <Layout
      title={isEdit
        ? (language === "fr" ? "Modifier la ferme" : "تعديل المزرعة")
        : (language === "fr" ? "Ajouter une ferme" : "إضافة مزرعة")
      }
      showBackButton={true}
      backButtonPath="/vosfermes"
      className="bg-blue-50"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
              {/* Success Message */}
              {success && (
                <div className="mb-8 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {success}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-8 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {language === "fr" ? "Erreur" : "خطأ"}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Card */}
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {isEdit ? (
                          <PencilSquareIcon className="h-5 w-5 text-blue-600" />
                        ) : (
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {isEdit
                          ? (language === "fr" ? "Informations de la ferme" : "معلومات المزرعة")
                          : (language === "fr" ? "Nouvelle ferme" : "مزرعة جديدة")
                        }
                      </h3>
                      <p className="text-sm text-gray-500">
                        {language === "fr" 
                          ? "Remplissez les informations ci-dessous pour votre ferme."
                          : "املأ المعلومات أدناه لمزرعتك."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Farm Name */}
                  <div>
                    <label htmlFor="farmName" className="block text-sm font-medium text-gray-700">
                      {language === "fr" ? "Nom de la ferme" : "اسم المزرعة"} *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        type="text"
                        id="farmName"
                        required
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder={
                          language === "fr" ? "Entrez le nom de votre ferme" : "أدخل اسم مزرعتك"
                        }
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Farm City */}
                  <div>
                    <label htmlFor="farmCity" className="block text-sm font-medium text-gray-700">
                      {language === "fr" ? "Ville/Localisation" : "المدينة/الموقع"} *
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="farmCity"
                        required
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10 pr-10 bg-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        value={farmCity}
                        onChange={(e) => setFarmCity(e.target.value)}
                      >
                        <option value="" disabled>
                          {language === "fr" ? "Sélectionnez une ville" : "اختر مدينة"}
                        </option>
                        {algerianCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Farm Description */}
                  <div>
                    <label htmlFor="farmDescription" className="block text-sm font-medium text-gray-700">
                      {language === "fr" ? "Description (optionnel)" : "الوصف (اختياري)"}
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="farmDescription"
                        rows={4}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder={
                          language === "fr" 
                            ? "Décrivez votre ferme, les types de cultures, etc."
                            : "صف مزرعتك، أنواع المحاصيل، إلخ."
                        }
                        value={farmDescription}
                        onChange={(e) => setFarmDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => navigate("/vosfermes")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {language === "fr" ? "Annuler" : "إلغاء"}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      {loading
                        ? (language === "fr" ? "En cours..." : "جار المعالجة...")
                        : isEdit
                          ? (language === "fr" ? "Mettre à jour" : "تحديث")
                          : (language === "fr" ? "Ajouter la ferme" : "إضافة المزرعة")
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
    </Layout>
  );
}

export default Ajoutferme;
