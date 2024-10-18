// weatherService.js
export async function getWeather(city) {
  const apiKey = 'd543e041e8f64fa885784608242709';
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Extract temperature, humidity, and lighting (sunlight hours)
    const temperature = data.current.temp_c;
    const humidity = data.current.humidity;
    const lighting = data.uv;

    return { temperature, humidity, lighting }; // Return an object with the values
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { temperature: null, humidity: null, lighting: null }; // Handle errors
  }
}
