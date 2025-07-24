// weatherService.js

// Function to get current weather (kept for compatibility)
export async function getCurrentWeather(city) {
  const apiKey = '06371176807d4b07a85114311241810';
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    const temperature = data.current.temp_c;
    const humidity = data.current.humidity;
    const uv = data.current.uv;
    const dissolvedOxygen = 1;

    return { temperature, humidity, uv, dissolvedOxygen };
  } catch (error) {
    console.error('Error fetching current weather data:', error);
    return { temperature: null, humidity: null, uv: null, dissolvedOxygen: null };
  }
}

// Function to get 4-hour mean weather data
export async function getWeather(city) {
  const apiKey = '06371176807d4b07a85114311241810';
  
  try {
    // First, always try to get current weather as a baseline
    const currentWeatherData = await getCurrentWeather(city);
    
    if (!currentWeatherData.temperature) {
      throw new Error('Could not get current weather data');
    }
    
    // Try to get forecast data for hourly information
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;
    
    try {
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();
      
      // Check for API errors
      if (forecastData.error) {
        console.warn('Forecast API error:', forecastData.error.message);
        return currentWeatherData; // Fall back to current data
      }
      
      // Check if hourly data is available
      const hourlyData = forecastData.forecast?.forecastday?.[0]?.hour;
      
      if (!hourlyData || !Array.isArray(hourlyData)) {
        console.warn('No hourly forecast data available, using current data');
        return currentWeatherData;
      }
      
      // Get current hour and calculate the last 4 hours
      const now = new Date();
      const currentHour = now.getHours();
      
      // Get data for the last 4 hours (or as many as available)
      const last4Hours = [];
      for (let i = Math.max(0, currentHour - 3); i <= currentHour; i++) {
        if (hourlyData[i]) {
          last4Hours.push(hourlyData[i]);
        }
      }
      
      // If we don't have enough hours, pad with current data
      if (last4Hours.length === 0) {
        console.warn('No hourly data available, using current weather');
        return currentWeatherData;
      }
      
      // If we have less than 4 hours, supplement with current data
      const syntheticHour = {
        temp_c: currentWeatherData.temperature,
        humidity: currentWeatherData.humidity,
        uv: currentWeatherData.uv
      };
      
      while (last4Hours.length < 4) {
        last4Hours.unshift(syntheticHour); // Add to beginning
      }
      
      // Calculate mean values
      const meanTemperature = last4Hours.reduce((sum, hour) => sum + (hour.temp_c || currentWeatherData.temperature), 0) / last4Hours.length;
      const meanHumidity = last4Hours.reduce((sum, hour) => sum + (hour.humidity || currentWeatherData.humidity), 0) / last4Hours.length;
      const meanUV = last4Hours.reduce((sum, hour) => sum + (hour.uv || currentWeatherData.uv), 0) / last4Hours.length;
      
      console.log(`Weather data: Using ${last4Hours.length} hours of data for mean calculation`);
      
      return {
        temperature: Math.round(meanTemperature * 10) / 10,
        humidity: Math.round(meanHumidity),
        uv: Math.round(meanUV * 10) / 10,
        dissolvedOxygen: 1,
        hoursUsed: last4Hours.length
      };
      
    } catch (forecastError) {
      console.warn('Error fetching forecast data:', forecastError);
      console.log('Using current weather data as fallback');
      return currentWeatherData;
    }
    
  } catch (error) {
    console.error('Error in getWeather:', error);
    
    // Ultimate fallback - return some default values
    return {
      temperature: 25, // Default temperature
      humidity: 50,    // Default humidity
      uv: 5,          // Default UV
      dissolvedOxygen: 1,
      hoursUsed: 0
    };
  }
}
