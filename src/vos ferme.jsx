import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { getUser, getAuthToken } from "./utils/auth";
import FarmsList from "./components/FarmsList";
import Layout from "./components/Layout";
import API_CONFIG from "./config/api";
import { ChartBarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import diseaseRiskCalculators from "./js/diseaseRiskCalculator";
import { getRecommendation } from "./js/getRecommendation";
import { getWeather } from "./js/weatherAPI";

function VosFermes() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Retrieve userId and authToken from cookies
  const user = getUser();
  const token = getAuthToken();

  useEffect(() => {
    if (!user || !user.id || !token) {
      navigate("/signin");
    }
  }, [navigate, user, token]);

  const userId = user?.id;

  const generateFarmSummary = (farmId, weather) => {
    const { temperature, humidity, dissolvedOxygen, isOutside } = weather;
    const uniqueRecommendations = new Set();

    Object.keys(diseaseRiskCalculators).forEach((disease) => {
      const risk = diseaseRiskCalculators[disease](
        temperature,
        humidity,
        dissolvedOxygen,
        isOutside
      );
      const recommendations = getRecommendation(
        disease,
        risk,
        humidity,
        dissolvedOxygen,
        language
      );

      if (recommendations) {
        recommendations.forEach((rec) => uniqueRecommendations.add(rec));
      }
    });

    setSummaries((prevSummaries) => ({
      ...prevSummaries,
      [farmId]: Array.from(uniqueRecommendations),
    }));
  };

  useEffect(() => {
    if (!userId || !token) return;
    
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}/users/${userId}/farms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setFarms(data);
        data.forEach((farm) => {
          if (farm.address) {
            getWeather(farm.address)
              .then((weather) => {
                console.log(`Weather data for ${farm.name}:`, weather);
                setWeatherData((prevData) => ({
                  ...prevData,
                  [farm.id]: weather,
                }));
                generateFarmSummary(farm.id, weather);
              })
              .catch((error) =>
                console.error(`Error fetching weather for ${farm.name}:`, error)
              );
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching farms:", error);
        setError("Failed to fetch farms");
      })
      .finally(() => setLoading(false));
  }, [userId, token, language]);

  return (
    <Layout
      title={language === "fr" ? "Tableau de Bord" : "لوحة المراقبة"}
      subtitle={language === "fr" 
        ? "Gérez vos fermes et consultez les recommandations basées sur les conditions météorologiques"
        : "إدارة مزارعك ومراجعة التوصيات بناءً على الظروف الجوية"
      }
      className="bg-blue-50"
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">

              {error && (
                <div className="mb-8 rounded-md bg-red-50 p-4">
                  <div className="flex">
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

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Farms List Section */}
                  <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {language === "fr" ? "Vos Fermes" : "مزارعك"}
                        </h3>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {farms.length}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <FarmsList userId={userId} />
                    </div>
                  </div>

                  {/* Recommendations Summary Section */}
                  <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">
                          {language === "fr"
                            ? "Résumé des recommandations"
                            : "ملخص التوصيات"}
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-6">
                        {farms.length === 0 ? (
                          <div className="text-center py-8">
                            <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                              {language === "fr" ? "Aucune ferme" : "لا توجد مزارع"}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {language === "fr" 
                                ? "Commencez par ajouter votre première ferme."
                                : "ابدأ بإضافة مزرعتك الأولى."}
                            </p>
                            <div className="mt-6">
                              <button
                                onClick={() => navigate("/Ajoutferme", { state: { isEdit: false, userId } })}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                {language === "fr" ? "Ajouter une ferme" : "إضافة مزرعة"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          farms.map((farm) => (
                            <div key={farm.id} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                              <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {farm.name}
                                  </h4>
                                  <p className="text-sm text-gray-500 truncate">
                                    {farm.address}
                                  </p>
                                </div>
                                {weatherData[farm.id] && (
                                  <div className="ml-4 flex-shrink-0">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {weatherData[farm.id].temperature}°C
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3">
                                {summaries[farm.id]?.length > 0 ? (
                                  <div className="space-y-2">
                                    {summaries[farm.id].slice(0, 3).map((rec, index) => (
                                      <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">
                                          <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-2"></div>
                                        </div>
                                        <p className="ml-3 text-sm text-gray-700">
                                          {rec}
                                        </p>
                                      </div>
                                    ))}
                                    {summaries[farm.id].length > 3 && (
                                      <p className="text-xs text-gray-500 ml-6">
                                        {language === "fr" 
                                          ? `+${summaries[farm.id].length - 3} recommandations supplémentaires`
                                          : `+${summaries[farm.id].length - 3} توصيات إضافية`
                                        }
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 italic">
                                    {language === "fr"
                                      ? "Pas de recommandations disponibles pour l'instant."
                                      : "لا توجد توصيات متاحة حاليًا."}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
    </Layout>
  );
}

export default VosFermes;
