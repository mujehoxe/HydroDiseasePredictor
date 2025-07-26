import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWeather } from './js/weatherAPI';
import { useLanguage } from './LanguageContext';
import { useTranslation } from './i18n';
import { getUser, getAuthToken } from './utils/auth';
import Layout from './components/Layout';
import MaladiesList from './components/MaladiesList';
import {
  MapPinIcon,
  CloudIcon,
  EyeIcon,
  EyeSlashIcon,
  FireIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Tableaudebord() {
  const { language } = useLanguage();
  const t = useTranslation();
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
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [dissolvedOxygen, setDissolvedOxygen] = useState(null);
  const [isOutside, setIsOutside] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState('temperature');
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);

  // Fetch weather data when component mounts
  useEffect(() => {
    if (address) {
      fetchWeatherDataWithHistory();
    }
  }, [address]);

  const fetchWeatherDataWithHistory = async () => {
    setWeatherLoading(true);
    
    try {
      // Get current weather data
      const weatherData = await getWeather(address);
      console.log('Current weather data:', weatherData);
      
      setTemperature(weatherData.temperature);
      setHumidity(weatherData.humidity);
      setDissolvedOxygen(weatherData.dissolvedOxygen);

      // Try to get historical data from weather API
      await fetchHistoricalWeatherData(address, weatherData);
      
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchHistoricalWeatherData = async (city, currentWeather) => {
    const apiKey = '06371176807d4b07a85114311241810';
    const storageKey = `weather_history_${city.replace(/\s+/g, '_')}`;
    
    try {
      // Try to get historical data from API (last 3 days)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBefore = new Date();
      dayBefore.setDate(dayBefore.getDate() - 2);
      
      const historyUrl = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${yesterday.toISOString().split('T')[0]}`;
      
      try {
        const historyResponse = await fetch(historyUrl);
        const historyData = await historyResponse.json();
        
        if (historyData.forecast && historyData.forecast.forecastday) {
          // Process historical hourly data
          const hourlyData = historyData.forecast.forecastday[0].hour;
          const historicalPoints = [];
          
          // Get data from every 4 hours for the past day
          for (let i = 0; i < 24; i += 4) {
            if (hourlyData[i]) {
              const hour = hourlyData[i];
              const time = new Date(hour.time);
              historicalPoints.push({
                time: time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                timestamp: time.getTime(),
                temperature: hour.temp_c,
                humidity: hour.humidity,
                dissolvedOxygen: (currentWeather.dissolvedOxygen || 2) + (Math.random() - 0.5) * 0.5,
                ph: 7 + (Math.random() - 0.5) * 0.5,
                ec: 1.5 + (Math.random() - 0.5) * 0.3,
                uv: hour.uv || Math.floor(Math.random() * 10)
              });
            }
          }
          
          // Add current data point
          const now = new Date();
          historicalPoints.push({
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: now.getTime(),
            temperature: currentWeather.temperature,
            humidity: currentWeather.humidity,
            dissolvedOxygen: currentWeather.dissolvedOxygen || 2,
            ph: 7 + (Math.random() - 0.5) * 0.5,
            ec: 1.5 + (Math.random() - 0.5) * 0.3,
            uv: currentWeather.uv || Math.floor(Math.random() * 10)
          });
          
          // Store in localStorage and state
          localStorage.setItem(storageKey, JSON.stringify(historicalPoints));
          setWeatherHistory(historicalPoints);
          
          console.log('Historical weather data fetched and stored');
          return;
          
        }
      } catch (historyError) {
        console.warn('Could not fetch historical data:', historyError);
      }
      
      // Fallback: Use stored data or create new storage
      let storedData = [];
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          storedData = JSON.parse(stored);
          // Remove data older than 24 hours
          const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
          storedData = storedData.filter(point => point.timestamp > oneDayAgo);
        }
      } catch (e) {
        console.warn('Error reading stored weather data:', e);
        storedData = [];
      }
      
      // Add current data point
      const now = new Date();
      const newDataPoint = {
        time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.getTime(),
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
        dissolvedOxygen: currentWeather.dissolvedOxygen || 2,
        ph: 7 + (Math.random() - 0.5) * 0.5,
        ec: 1.5 + (Math.random() - 0.5) * 0.3,
        uv: currentWeather.uv || Math.floor(Math.random() * 10)
      };
      
      // Check if we should add this point (don't add if less than 30 minutes since last point)
      const lastPoint = storedData[storedData.length - 1];
      if (!lastPoint || (now.getTime() - lastPoint.timestamp) > (30 * 60 * 1000)) {
        storedData.push(newDataPoint);
      }
      
      // Keep only last 20 points (roughly 10 hours if taken every 30 minutes)
      if (storedData.length > 20) {
        storedData = storedData.slice(-20);
      }
      
      // If we have very little data, generate some mock historical points
      if (storedData.length < 6) {
        const mockPoints = [];
        for (let i = 5; i >= 1; i--) {
          const pastTime = new Date(now.getTime() - (i * 60 * 60 * 1000)); // i hours ago
          mockPoints.push({
            time: pastTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: pastTime.getTime(),
            temperature: currentWeather.temperature + (Math.random() - 0.5) * 4,
            humidity: currentWeather.humidity + (Math.random() - 0.5) * 10,
            dissolvedOxygen: (currentWeather.dissolvedOxygen || 2) + (Math.random() - 0.5) * 1,
            ph: 7 + (Math.random() - 0.5) * 0.5,
            ec: 1.5 + (Math.random() - 0.5) * 0.3,
            uv: Math.floor(Math.random() * 10)
          });
        }
        storedData = [...mockPoints, ...storedData];
      }
      
      // Store updated data and set state
      localStorage.setItem(storageKey, JSON.stringify(storedData));
      setWeatherHistory(storedData);
      
      console.log(`Using stored/real-time weather data: ${storedData.length} points`);
      
    } catch (error) {
      console.error('Error handling weather history:', error);
      // Generate minimal mock data as final fallback
      const now = new Date();
      const fallbackData = [];
      for (let i = 6; i >= 0; i--) {
        const pastTime = new Date(now.getTime() - (i * 60 * 60 * 1000));
        fallbackData.push({
          time: pastTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          timestamp: pastTime.getTime(),
          temperature: currentWeather.temperature + (Math.random() - 0.5) * 4,
          humidity: currentWeather.humidity + (Math.random() - 0.5) * 10,
          dissolvedOxygen: (currentWeather.dissolvedOxygen || 2) + (Math.random() - 0.5) * 1,
          ph: 7 + (Math.random() - 0.5) * 0.5,
          ec: 1.5 + (Math.random() - 0.5) * 0.3,
          uv: Math.floor(Math.random() * 10)
        });
      }
      setWeatherHistory(fallbackData);
    }
  };

  // Mock disease data for pie chart
  useEffect(() => {
    const mockDiseases = [
      { name: t('diseases'), risk: 'high', count: 3 },
      { name: 'Low Risk', risk: 'low', count: 5 },
      { name: 'Medium Risk', risk: 'medium', count: 2 }
    ];
    setDiseaseData(mockDiseases);
  }, [t]);

  // Set up periodic weather data collection (every 30 minutes)
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(async () => {
      try {
        console.log('Collecting periodic weather data...');
        const weatherData = await getWeather(address);
        
        // Update current values
        setTemperature(weatherData.temperature);
        setHumidity(weatherData.humidity);
        setDissolvedOxygen(weatherData.dissolvedOxygen);
        
        // Add to historical data
        const storageKey = `weather_history_${address.replace(/\s+/g, '_')}`;
        let storedData = [];
        
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            storedData = JSON.parse(stored);
            // Remove data older than 24 hours
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            storedData = storedData.filter(point => point.timestamp > oneDayAgo);
          }
        } catch (e) {
          console.warn('Error reading stored data during periodic update:', e);
        }
        
        // Add new data point
        const now = new Date();
        const newDataPoint = {
          time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          timestamp: now.getTime(),
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          dissolvedOxygen: weatherData.dissolvedOxygen || 2,
          ph: 7 + (Math.random() - 0.5) * 0.5,
          ec: 1.5 + (Math.random() - 0.5) * 0.3,
          uv: weatherData.uv || Math.floor(Math.random() * 10)
        };
        
        storedData.push(newDataPoint);
        
        // Keep only last 20 points
        if (storedData.length > 20) {
          storedData = storedData.slice(-20);
        }
        
        // Update storage and state
        localStorage.setItem(storageKey, JSON.stringify(storedData));
        setWeatherHistory(storedData);
        
        console.log('Periodic weather data collected and stored');
        
      } catch (error) {
        console.error('Error during periodic weather update:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [address]);

  const toggleEnvironment = () => {
    setIsOutside(prev => !prev);
  };

  // Chart configurations
  const getWeatherChartData = () => {
    const variableMap = {
      temperature: { key: 'temperature', label: t('currentTemperature'), color: 'rgb(239, 68, 68)' },
      humidity: { key: 'humidity', label: t('ambientHumidity'), color: 'rgb(59, 130, 246)' },
      dissolvedOxygen: { key: 'dissolvedOxygen', label: t('electricalConductivity'), color: 'rgb(34, 197, 94)' },
      ph: { key: 'ph', label: 'pH', color: 'rgb(168, 85, 247)' },
      ec: { key: 'ec', label: 'EC', color: 'rgb(245, 158, 11)' },
      uv: { key: 'uv', label: 'UV Index', color: 'rgb(236, 72, 153)' }
    };

    const variable = variableMap[selectedVariable];
    
    return {
      labels: weatherHistory.map(item => item.time),
      datasets: [
        {
          label: variable.label,
          data: weatherHistory.map(item => item[variable.key]),
          borderColor: variable.color,
          backgroundColor: variable.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  const diseaseChartData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [3, 2, 5],
        backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        borderColor: ['#dc2626', '#d97706', '#16a34a'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (!user || !token) {
    return null; // Render nothing while redirecting
  }

  return (
    <Layout
      title={t('dashboard')}
      subtitle={name ? (
        <div className="flex items-center">
          <MapPinIcon className="h-4 w-4 mr-1" />
          {name} - {address}
        </div>
      ) : null}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Environment Toggle */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={toggleEnvironment}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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

          {/* Dashboard Content - Stacked Layout */}
          <div className="space-y-8">
            {/* Weather Section */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('currentTemperature')}
                  </h3>
                  {weatherLoading && (
                    <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Current Weather Values */}
                  <div>
                    {/* Location */}
                    <div className="flex items-center mb-4">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        {address || 'Location not provided'}
                      </span>
                    </div>

                    {/* Temperature Display */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-2">
                        <FireIcon className="h-10 w-10 text-red-600" />
                      </div>
                      <div className="text-4xl font-bold text-gray-900 mb-1">
                        {temperature !== null ? `${temperature}°C` : 'Loading...'}
                      </div>
                      <div className="text-gray-500">
                        {t('currentTemperature')}
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{t('ambientHumidity')}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {humidity !== null ? `${humidity}%` : 'Loading...'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{t('waterTemperature')}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {temperature !== null ? `${temperature}°C` : 'Loading...'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">pH</span>
                        <span className="text-sm font-medium text-gray-900">7</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{t('electricalConductivity')}</span>
                        <span className="text-sm font-medium text-gray-900">1.5</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
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

                  {/* Weather Chart */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h4 className="text-md font-medium text-gray-900">
                          {language === 'fr' ? 'Tendances météorologiques' : 'اتجاهات الطقس'}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={fetchWeatherDataWithHistory}
                          disabled={weatherLoading}
                          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          title={language === 'fr' ? 'Actualiser les données' : 'تحديث البيانات'}
                        >
                          <ArrowPathIcon className={`h-4 w-4 ${weatherLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <select
                          value={selectedVariable}
                          onChange={(e) => setSelectedVariable(e.target.value)}
                          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="temperature">{t('currentTemperature')}</option>
                          <option value="humidity">{t('ambientHumidity')}</option>
                          <option value="dissolvedOxygen">{language === 'fr' ? 'Oxygène dissout' : 'الأوكسجين المذاب'}</option>
                          <option value="ph">pH</option>
                          <option value="ec">{t('electricalConductivity')}</option>
                          <option value="uv">{language === 'fr' ? 'Index UV' : 'مؤشر الأشعة فوق البنفسجية'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="h-64">
                      {weatherHistory.length > 0 ? (
                        <>
                          <Line data={getWeatherChartData()} options={chartOptions} />
                          <div className="mt-2 text-xs text-gray-500 text-center">
                            {language === 'fr' 
                              ? `${weatherHistory.length} points de données • Dernière mise à jour: ${weatherHistory[weatherHistory.length - 1]?.time || 'N/A'}`
                              : `${weatherHistory.length} نقاط البيانات • آخر تحديث: ${weatherHistory[weatherHistory.length - 1]?.time || 'N/A'}`
                            }
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          {language === 'fr' ? 'Chargement des données...' : 'جار تحميل البيانات...'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diseases Section */}
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('diseases')}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Disease List */}
                  <div>
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

                  {/* Disease Risk Chart */}
                  <div>
                    <div className="flex items-center mb-4">
                      <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-md font-medium text-gray-900">
                        {language === 'fr' ? 'Répartition des risques' : 'توزيع المخاطر'}
                      </h4>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-48 h-48">
                        <Pie data={diseaseChartData} options={pieOptions} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Tableaudebord;
