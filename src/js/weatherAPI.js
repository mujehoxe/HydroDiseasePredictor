// weatherAPI.js - Single source of weather data

const API_KEY = '06371176807d4b07a85114311241810';
const BASE_URL = 'https://api.weatherapi.com/v1';

// Function to get current weather (kept for compatibility)
export async function getCurrentWeather(city) {
  try {
    const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}`);
    const data = await response.json();
    
    return {
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      uv: data.current.uv,
      dissolvedOxygen: 1
    };
  } catch (error) {
    console.error('Error fetching current weather data:', error);
    return { temperature: null, humidity: null, uv: null, dissolvedOxygen: null };
  }
}

// Main function to get weather data for dashboard
export async function getWeather(city) {
  try {
    // Single API call to get forecast data
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get current time and find current hour
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const hourlyData = data.forecast.forecastday[0].hour;
    
    // Extract last 8 hours using real API time data
    // Start from current hour (rounded down) and go back 7 hours
    const last8Hours = [];
    
    for (let i = 0; i < 8; i++) {
      const hourIndex = (currentHour - (7 - i) + 24) % 24; // Calculate hour index, handle day rollover
      const hourData = hourlyData[hourIndex];
      
      if (hourData) {
        // Extract the actual time from API response (e.g., "2025-07-26 23:00")
        const apiTime = hourData.time; // "2025-07-26 23:00"
        const timeOnly = apiTime.split(' ')[1]; // Extract "23:00"
        
        last8Hours.push({
          time: timeOnly, // Use real API time like "23:00", "00:00", "01:00", etc.
          timestamp: hourData.time_epoch * 1000, // Convert to milliseconds for consistency
          // Only real API data: humidity and temperature
          temperature: hourData.temp_c,
          humidity: hourData.humidity,
          // Static mock data for other dashboard parameters
          dissolvedOxygen: 2.0,
          ph: 7.0,
          ec: 1.5,
          uv: Math.max(0, hourData.uv || 0)
        });
      }
    }
    
    // Add current time data point from "current" in JSON response
    const currentTimeString = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // "HH:MM" format
    const currentDataPoint = {
      time: currentTimeString, // Current time like "19:32"
      timestamp: currentTime.getTime(),
      // Real current data from API
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      // Static mock data for other dashboard parameters
      dissolvedOxygen: 2.0,
      ph: 7.0,
      ec: 1.5,
      uv: Math.max(0, data.current.uv || 0)
    };
    
    // Combine historical data (8 hours) + current data point (total: 9 points)
    const allDataPoints = [...last8Hours, currentDataPoint];
    
    console.log(`Weather API: Fetched data for ${city}`);
    console.log(`Real API time extracted: Last 8 hours from ${last8Hours[0]?.time || 'N/A'} to ${last8Hours[7]?.time || 'N/A'}`);
    console.log(`Current time data point added: ${currentTimeString} with real current values`);
    console.log(`Total data points created: ${allDataPoints.length} (8 historical + 1 current)`);
    console.log(`Real data extracted: humidity and temp_c for each hour from API response + current values`);
    
    return {
      // Current weather data
      location: data.location.name,
      country: data.location.country,
      temperature: data.current.temp_c,
      condition: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_kph,
      pressure: data.current.pressure_mb,
      icon: data.current.condition.icon,
      uvIndex: data.current.uv,
      visibility: data.current.vis_km,
      feelsLike: data.current.feelslike_c,
      // Historical data for dashboard charts (8 hours + current time = 9 total points)
      historicalData: allDataPoints,
      // Meta information
      dataSource: 'WeatherAPI forecast with real time data',
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error fetching weather data from API:', error);
    
    // Fallback data generation with calculated times
    const currentTime = new Date();
    const fallbackHistorical = [];
    
    // Generate 8 hours of fallback data with calculated times
    for (let i = 7; i >= 0; i--) {
      const pastTime = new Date(currentTime.getTime() - (i * 60 * 60 * 1000));
      const timeString = pastTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // "HH:MM" format
      
      fallbackHistorical.push({
        time: timeString, // Calculated time in same format as API
        timestamp: pastTime.getTime(),
        // Fallback values for humidity and temperature
        temperature: 22 + (Math.random() - 0.5) * 6, // Random temp around 22°C ±3°C
        humidity: 55 + (Math.random() - 0.5) * 20, // Random humidity around 55% ±10%
        // Static mock data for other parameters
        dissolvedOxygen: 2.0,
        ph: 7.0,
        ec: 1.5,
        uv: Math.floor(Math.random() * 8) + 1
      });
    }
    
    // Add current time fallback data point
    const currentTimeString = currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const currentFallbackPoint = {
      time: currentTimeString,
      timestamp: currentTime.getTime(),
      temperature: 22, // Fallback current temperature
      humidity: 55,    // Fallback current humidity
      dissolvedOxygen: 2.0,
      ph: 7.0,
      ec: 1.5,
      uv: 5
    };
    
    // Combine historical + current (total: 9 points)
    const allFallbackPoints = [...fallbackHistorical, currentFallbackPoint];
    
    console.log('Weather API: Using fallback data due to API error');
    console.log(`Fallback data: 8 historical hours + 1 current time point = ${allFallbackPoints.length} total points`);
    
    return {
      location: city,
      country: 'Unknown',
      temperature: 22,
      condition: 'Data unavailable',
      humidity: 55,
      windSpeed: 0,
      pressure: 1013,
      icon: '',
      uvIndex: 0,
      visibility: 10,
      feelsLike: 22,
      historicalData: allFallbackPoints,
      dataSource: 'Fallback data with calculated times',
      lastUpdated: new Date().toISOString()
    };
  }
}
