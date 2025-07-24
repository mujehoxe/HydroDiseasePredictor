import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWeather } from './js/weatherAPI';
import { useLanguage } from './LanguageContext';
import { getUser, getAuthToken } from './utils/auth';
import Sidebar from './components/SidebarOffcanvas';
import MaladiesList from './components/MaladiesList';
import {
  Bars3Icon,
  MapPinIcon,
  CloudIcon,
  EyeIcon,
  EyeSlashIcon,
  TemperatureIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

function Tableaudebord() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, address, farmId } = location.state || {};

  // Retrieve user data and token from cookies
  const user = getUser();
  const token = getAuthToken();

  useEffect(() => {
    if (!user || !user.id || !token) {
      navigate('/signin');
    }
  }, [navigate, user, token]);

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(null);
  const [isOutside, setIsOutside] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Fetch weather data when component mounts
  useEffect(() => {
    if (address) {
      setWeatherLoading(true);
      getWeather(address)
        .then(data => {
          console.log('Weather data:', data);
          setTemperature(data.temperature);
          setHumidity(data.humidity);
          setDissolvedOxygen(data.dissolvedOxygen);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
        })
        .finally(() => {
          setWeatherLoading(false);
        });
    }
  }, [address]);

  const toggleEnvironment = () => {
    setIsOutside(prev => !prev);
  };

  if (!user || !token) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-500 hover:text-gray-700 lg:hidden p-2"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <div className="ml-4">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {language === 'fr' ? 'Tableau de Bord' : 'لوحة مراقبة'}
                  </h1>
                  {name && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {name} - {address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Environment Toggle */}
              <div className="mb-8 flex justify-center">
                <button
                  onClick={toggleEnvironment}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  {isOutside ? (
                    <EyeIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5 mr-2" />
                  )}
                  {isOutside 
                    ? (language === 'fr' ? 'En plein champs' : 'في الهواء الطلق')
                    : (language === 'fr' ? 'Environnement contrôlé' : 'بيئة خاضعة للرقابة')
                  }
                </button>
              </div>

              {/* Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Diseases Section */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      {language === 'fr' ? 'Maladies' : 'الأمراض'}
                    </h3>
                  </div>
                  <div className="p-6">
                    {(() => {
                      try {
                        return (
                          <MaladiesList 
                            language={language}
                            temperature={temperature}
                            humidity={humidity}
                            dissolvedOxygen={dissolvedOxygen}
                            isOutside={isOutside}
                          />
                        );
                      } catch (error) {
                        console.error('Error rendering MaladiesList:', error);
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">
                              {language === 'fr' 
                                ? 'Erreur lors du chargement des maladies.' 
                                : 'خطأ أثناء تحميل الأمراض.'
                              }
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* Weather Section */}
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {language === 'fr' ? 'Météo' : 'تقرير الطقس'}
                      </h3>
                      {weatherLoading && (
                        <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Location */}
                    <div className="flex items-center mb-4">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        {address || 'Location not provided'}
                      </span>
                    </div>

                    {/* Temperature Display */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-2">
                        <CloudIcon className="h-10 w-10 text-blue-600" />
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900">
                        {temperature !== null ? `${temperature}°C` : 'Loading...'}
                      </h2>
                    </div>

                    {/* Weather Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">
                          {language === 'fr' ? 'Vent' : 'سرعة الرياح'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          0 km/h
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">
                          {language === 'fr' ? 'Humidité ambiante' : 'الرطوبة الجوية'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {humidity !== null ? `${humidity}%` : 'Loading...'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">
                          {language === 'fr' ? 'Température de l\'eau' : 'درجة حرارة الماء'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {temperature !== null ? `${temperature}°C` : 'Loading...'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">pH</span>
                        <span className="text-sm font-medium text-gray-900">7</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">
                          {language === 'fr' ? 'EC' : 'التوصيلية الكهربائية'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">1.5</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm text-gray-600">
                          {language === 'fr' ? 'Oxygène dissout' : 'الأوكسجين المذاب'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {dissolvedOxygen !== null ? dissolvedOxygen : '2'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">
                          {language === 'fr' ? 'Index UV' : 'مؤشر الأشعة فوق البنفسجية'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Tableaudebord;
