// weatherService.js
export async function getWeather(city) {
  const apiKey = '06371176807d4b07a85114311241810';
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Extract temperature, humidity, and uv (sunlight hours)
    const temperature = data.current.temp_c;
    const humidity = data.current.humidity;
    const uv = data.uv;
    const dissolvedOxygen = 1 ;

    return { temperature, humidity, uv, dissolvedOxygen }; // Return an object with the values
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { temperature: null, humidity: null, uv: null, dissolvedOxygen: null }; // Handle errors
  }
}
