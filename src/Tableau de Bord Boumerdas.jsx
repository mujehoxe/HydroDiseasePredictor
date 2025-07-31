import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { useTranslation } from './i18n';
import { getUser, getAuthToken } from './utils/auth';
import Layout from './components/Layout';
import MaladiesList from './components/MaladiesList';
import diseaseRiskCalculators from './js/diseaseRiskCalculator';
import { getRecommendation } from './js/getRecommendation';
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
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Tableaudebord({ weatherData, onRefreshWeather }) {
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
  const [farmRecommendations, setFarmRecommendations] = useState([]);

  // Update component state when weatherData prop changes
  useEffect(() => {
    if (weatherData) {
      console.log('Dashboard: Received weather data from props');
      setTemperature(weatherData.temperature);
      setHumidity(weatherData.humidity);
      setDissolvedOxygen(2.0); // Static value as per requirements
      
      // Use historical data from weatherAPI.js (no API calls in dashboard)
      if (weatherData.historicalData && weatherData.historicalData.length > 0) {
        setWeatherHistory(weatherData.historicalData);
        console.log(`Dashboard: Using ${weatherData.historicalData.length} historical data points from props`);
        console.log('Dashboard: NO API calls made in this component');
      }

      // Generate farm recommendations based on weather data
      generateFarmRecommendations(weatherData.temperature, weatherData.humidity, 2.0, isOutside);
    }
  }, [weatherData, isOutside]);

  // Generate farm recommendations similar to vos fermes
  const generateFarmRecommendations = useCallback((temp, humid, dissolvedOxy, outside) => {
    const uniqueRecommendations = new Set();

    Object.keys(diseaseRiskCalculators).forEach((disease) => {
      const risk = diseaseRiskCalculators[disease](temp, humid, dissolvedOxy, outside);
      const recommendations = getRecommendation(disease, risk, humid, dissolvedOxy, language);

      if (recommendations) {
        recommendations.forEach((rec) => uniqueRecommendations.add(rec));
      }
    });

    setFarmRecommendations(Array.from(uniqueRecommendations));
  }, [language]);

  // Refresh weather data by calling parent's refresh function
  const handleRefreshWeather = useCallback(() => {
    if (onRefreshWeather && address) {
      setWeatherLoading(true);
      console.log('Dashboard: Requesting weather data refresh from parent component');
      onRefreshWeather(address).finally(() => setWeatherLoading(false));
    }
  }, [onRefreshWeather, address]);

  const toggleEnvironment = () => {
    setIsOutside(prev => !prev);
  };

  // Chart configurations
  const getSafetyIntervals = () => {
    return {
      temperature: { min: 0, max: 22 },
      humidity: { min: 40, max: 60 },
      dissolvedOxygen: { min: 0, max: 2 },
      ph: { min: 6, max: 8 },
      ec: { min: 1, max: 2 },
      uv: { min: 5, max: 8 }
    };
  };

  const getColorForValue = (value, variable) => {
    const intervals = getSafetyIntervals();
    const interval = intervals[variable];
    
    if (!interval) return 'rgb(59, 130, 246)'; // Default blue
    
    const { min, max } = interval;
    
    // If value is within safe range, return green
    if (value >= min && value <= max) {
      return 'rgb(34, 197, 94)'; // Green
    }
    
    // Calculate how far outside the safe range
    let deviation;
    if (value < min) {
      deviation = (min - value) / min; // How far below minimum
    } else {
      deviation = (value - max) / max; // How far above maximum
    }
    
    // Cap deviation at 1 for color calculation
    deviation = Math.min(deviation, 1);
    
    // Interpolate between yellow and red based on deviation
    if (deviation < 0.5) {
      // Green to Yellow (warning)
      const factor = deviation * 2;
      const red = Math.round(34 + (245 - 34) * factor);   // 34 -> 245
      const green = Math.round(197 + (158 - 197) * factor); // 197 -> 158
      const blue = Math.round(94 + (11 - 94) * factor);    // 94 -> 11
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      // Yellow to Red (danger)
      const factor = (deviation - 0.5) * 2;
      const red = Math.round(245 + (239 - 245) * factor);   // 245 -> 239
      const green = Math.round(158 + (68 - 158) * factor);  // 158 -> 68
      const blue = Math.round(11 + (68 - 11) * factor);     // 11 -> 68
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  const createGradientDataset = (data, variable, label) => {
    // Create segment colors based on values
    const segmentColors = [];
    const backgroundColors = [];
    
    for (let i = 0; i < data.length; i++) {
      const color = getColorForValue(data[i], variable);
      segmentColors.push(color);
      backgroundColors.push(color.replace('rgb', 'rgba').replace(')', ', 0.1)'));
    }
    
    return {
      label: label,
      data: data,
      borderColor: (context) => {
        const index = context.dataIndex;
        return segmentColors[index] || 'rgb(59, 130, 246)';
      },
      backgroundColor: (context) => {
        const index = context.dataIndex;
        return backgroundColors[index] || 'rgba(59, 130, 246, 0.1)';
      },
      pointBackgroundColor: segmentColors,
      pointBorderColor: segmentColors,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: false,
      segment: {
        borderColor: (ctx) => {
          const startValue = ctx.p0.parsed.y;
          const endValue = ctx.p1.parsed.y;
          const avgValue = (startValue + endValue) / 2;
          return getColorForValue(avgValue, variable);
        }
      }
    };
  };

  const getWeatherChartData = () => {
    const variableMap = {
      temperature: { key: 'temperature', label: t('currentTemperature') },
      humidity: { key: 'humidity', label: t('ambientHumidity') },
      dissolvedOxygen: { key: 'dissolvedOxygen', label: t('electricalConductivity') },
      ph: { key: 'ph', label: 'pH' },
      ec: { key: 'ec', label: 'EC' },
      uv: { key: 'uv', label: 'UV Index' }
    };

    const variable = variableMap[selectedVariable];
    const data = weatherHistory.map(item => item[variable.key]);
    
    return {
      labels: weatherHistory.map(item => item.time),
      datasets: [createGradientDataset(data, selectedVariable, variable.label)]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          generateLabels: (chart) => {
            const variable = selectedVariable;
            const intervals = getSafetyIntervals();
            const interval = intervals[variable];
            
            return [
              // Safe zone label
              {
                text: interval ? `${language === 'fr' ? 'Zone sûre' : 'منطقة آمنة'}: ${interval.min} - ${interval.max}` : '',
                fillStyle: 'rgb(34, 197, 94)',
                strokeStyle: 'rgb(34, 197, 94)',
                hidden: false,
                pointStyle: 'line'
              },
              // Warning zone label
              {
                text: `${language === 'fr' ? 'Zone d\'alerte' : 'منطقة تحذير'}`,
                fillStyle: 'rgb(245, 158, 11)',
                strokeStyle: 'rgb(245, 158, 11)',
                hidden: false,
                pointStyle: 'line'
              },
              // Danger zone label
              {
                text: `${language === 'fr' ? 'Zone de danger' : 'منطقة خطر'}`,
                fillStyle: 'rgb(239, 68, 68)',
                strokeStyle: 'rgb(239, 68, 68)',
                hidden: false,
                pointStyle: 'line'
              }
            ];
          }
        }
      },
      title: {
        display: true,
        text: (() => {
          const variableNames = {
            temperature: language === 'fr' ? 'Température' : 'درجة الحرارة',
            humidity: language === 'fr' ? 'Humidité' : 'الرطوبة',
            dissolvedOxygen: language === 'fr' ? 'Oxygène dissous' : 'الأكسجين المذاب',
            ph: 'pH',
            ec: 'EC',
            uv: language === 'fr' ? 'Index UV' : 'مؤشر الأشعة فوق البنفسجية'
          };
          return variableNames[selectedVariable] || selectedVariable;
        })(),
        font: {
          size: 16,
          weight: 'bold'
        },
        color: 'rgb(31, 41, 55)', // Dark gray color
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const formattedValue = parseFloat(value.toFixed(2));
            const variableLabels = {
              temperature: language === 'fr' ? 'Température' : 'درجة الحرارة',
              humidity: language === 'fr' ? 'Humidité' : 'الرطوبة',
              ph: 'pH',
              ec: 'EC',
              dissolvedOxygen: language === 'fr' ? 'Oxygène dissous' : 'الأكسجين المذاب',
              uv: language === 'fr' ? 'Index UV' : 'مؤشر الأشعة فوق البنفسجية'
            };
            const label = variableLabels[selectedVariable] || selectedVariable;
            return `${label}: ${formattedValue}`;
          },
          afterLabel: (context) => {
            const value = parseFloat(context.parsed.y.toFixed(2));
            const variable = selectedVariable;
            const intervals = getSafetyIntervals();
            const interval = intervals[variable];
            
            if (!interval) return '';
            
            const { min, max } = interval;
            
            if (value >= min && value <= max) {
              return language === 'fr' ? '✓ Valeur sûre' : '✓ قيمة آمنة';
            } else if (value < min) {
              const deviation = ((min - value) / min * 100).toFixed(1);
              return language === 'fr' 
                ? `⚠ ${deviation}% en dessous du minimum` 
                : `⚠ ${deviation}% تحت الحد الأدنى`;
            } else {
              const deviation = ((value - max) / max * 100).toFixed(1);
              return language === 'fr' 
                ? `⚠ ${deviation}% au-dessus du maximum` 
                : `⚠ ${deviation}% فوق الحد الأقصى`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: (context) => {
            const variable = selectedVariable;
            const intervals = getSafetyIntervals();
            const interval = intervals[variable];
            
            if (!interval) return '#e5e7eb';
            
            const value = context.tick.value;
            const { min, max } = interval;
            
            // Highlight safe zone boundaries
            if (value === min || value === max) {
              return 'rgb(34, 197, 94)';
            }
            
            return '#e5e7eb';
          }
        },
        ticks: {
          callback: function(value) {
            const variable = selectedVariable;
            const intervals = getSafetyIntervals();
            const interval = intervals[variable];
            
            // Format value to maximum 2 decimal places
            const formattedValue = parseFloat(value.toFixed(2));
            
            if (!interval) return formattedValue;
            
            const { min, max } = interval;
            
            // Add safety indicators to tick labels
            if (Math.abs(value - min) < 0.01) {
              return `${formattedValue} (min)`;
            } else if (Math.abs(value - max) < 0.01) {
              return `${formattedValue} (max)`;
            }
            
            return formattedValue;
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
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
                          onClick={handleRefreshWeather}
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
                          
                          {/* Safety Status Indicator */}
                          {(() => {
                            const currentValue = weatherHistory[weatherHistory.length - 1]?.[selectedVariable === 'dissolvedOxygen' ? 'dissolvedOxygen' : selectedVariable];
                            const intervals = getSafetyIntervals();
                            const interval = intervals[selectedVariable];
                            
                            if (!interval || currentValue === undefined) return null;
                            
                            const { min, max } = interval;
                            const isInSafeZone = currentValue >= min && currentValue <= max;
                            
                            let statusColor, statusText, statusIcon;
                            
                            if (isInSafeZone) {
                              statusColor = 'bg-green-100 text-green-800 border-green-200';
                              statusText = language === 'fr' ? 'Valeur dans la zone sûre' : 'القيمة في المنطقة الآمنة';
                              statusIcon = '✓';
                            } else {
                              const deviation = currentValue < min 
                                ? ((min - currentValue) / min * 100).toFixed(1)
                                : ((currentValue - max) / max * 100).toFixed(1);
                              
                              if (parseFloat(deviation) > 50) {
                                statusColor = 'bg-red-100 text-red-800 border-red-200';
                                statusText = language === 'fr' ? 'Valeur en zone de danger' : 'القيمة في منطقة خطر';
                                statusIcon = '⚠';
                              } else {
                                statusColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                                statusText = language === 'fr' ? 'Valeur en zone d\'alerte' : 'القيمة في منطقة تحذير';
                                statusIcon = '⚠';
                              }
                            }
                            
                            return (
                              <div className={`mt-2 p-2 rounded-md border ${statusColor}`}>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center">
                                    <span className="mr-1">{statusIcon}</span>
                                    {statusText}
                                  </span>
                                  <span className="font-medium">
                                    {language === 'fr' ? 'Actuel' : 'الحالي'}: {currentValue} 
                                    {selectedVariable === 'temperature' ? '°C' : 
                                     selectedVariable === 'humidity' ? '%' : 
                                     selectedVariable === 'uv' ? '' : ''}
                                  </span>
                                </div>
                                <div className="text-xs mt-1 opacity-75">
                                  {language === 'fr' ? 'Zone sûre' : 'المنطقة الآمنة'}: {min} - {max}
                                </div>
                              </div>
                            );
                          })()}
                          
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

                  {/* Farm Recommendations */}
                  <div>
                    <div className="flex items-center mb-4">
                      <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <h4 className="text-md font-medium text-gray-900">
                        {t('recommendations')}
                      </h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {farmRecommendations.length > 0 ? (
                        <div className="space-y-3">
                          {farmRecommendations.slice(0, 6).map((recommendation, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-400 mt-2"></div>
                              </div>
                              <p className="ml-3 text-sm text-gray-700">
                                {recommendation}
                              </p>
                            </div>
                          ))}
                          {farmRecommendations.length > 6 && (
                            <p className="text-xs text-gray-500 ml-6 pt-2 border-t">
                              {`+${farmRecommendations.length - 6} ${t('additionalRecommendations')}`}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-500 italic">
                            {t('noRecommendationsAvailable')}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {language === 'fr' 
                              ? 'Les recommandations apparaîtront une fois les données météorologiques chargées.' 
                              : 'ستظهر التوصيات بمجرد تحميل البيانات الجوية.'
                            }
                          </p>
                        </div>
                      )}
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
