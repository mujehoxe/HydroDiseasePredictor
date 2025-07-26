import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getWeather } from './js/weatherAPI';
import Tableaudebord from './Tableau de Bord Boumerdas';

function DashboardWrapper() {
  const location = useLocation();
  const { address } = location.state || {};
  
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch weather data from weatherAPI.js
  const fetchWeatherData = useCallback(async (city) => {
    if (!city) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`DashboardWrapper: Fetching weather data for ${city}`);
      const data = await getWeather(city);
      
      console.log('DashboardWrapper: Weather data received from weatherAPI.js');
      console.log(`DashboardWrapper: Data includes ${data.historicalData?.length || 0} historical points`);
      console.log('DashboardWrapper: Real API data used for humidity and temp_c only');
      
      setWeatherData(data);
    } catch (err) {
      console.error('DashboardWrapper: Error fetching weather data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather data when component mounts or address changes
  useEffect(() => {
    if (address) {
      fetchWeatherData(address);
    }
  }, [address, fetchWeatherData]);

  // Set up periodic weather data updates (every hour)
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(() => {
      console.log('DashboardWrapper: Periodic weather data update (hourly)');
      fetchWeatherData(address);
    }, 60 * 60 * 1000); // Every hour

    return () => {
      console.log('DashboardWrapper: Cleaning up periodic weather updates');
      clearInterval(interval);
    };
  }, [address, fetchWeatherData]);

  // Handle manual refresh from dashboard
  const handleRefreshWeather = useCallback(async (city) => {
    console.log('DashboardWrapper: Manual weather refresh requested');
    await fetchWeatherData(city);
  }, [fetchWeatherData]);

  if (error) {
    console.error('DashboardWrapper: Error state:', error);
  }

  return (
    <Tableaudebord 
      weatherData={weatherData}
      onRefreshWeather={handleRefreshWeather}
      weatherLoading={isLoading}
    />
  );
}

export default DashboardWrapper;
