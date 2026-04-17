import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Axios instance for weather API calls
 */
const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric', // Use metric by default
  },
});

export const weatherService = {
  /**
   * Fetch current weather for a city
   * @param {string} city 
   * @param {string} units
   */
  async getCurrentWeather(city, units = 'metric') {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error("Missing OpenWeather API Key. Please check your .env file.");
    }
    const response = await weatherAPI.get('/weather', { params: { q: city, units } });
    return response.data;
  },

  /**
   * Fetch 5-day forecast for a city
   * @param {string} city 
   * @param {string} units
   */
  async getForecast(city, units = 'metric') {
    const response = await weatherAPI.get('/forecast', { params: { q: city, units } });
    return response.data;
  },

  /**
   * Fetch current weather by geographic coordinates
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} units
   */
  async getWeatherByCoords(lat, lon, units = 'metric') {
    const response = await weatherAPI.get('/weather', { params: { lat, lon, units } });
    return response.data;
  },

  /**
   * Fetch 5-day forecast by geographic coordinates
   * @param {number} lat 
   * @param {number} lon 
   * @param {string} units
   */
  async getForecastByCoords(lat, lon, units = 'metric') {
    const response = await weatherAPI.get('/forecast', { params: { lat, lon, units } });
    return response.data;
  },

  /**
   * Fetch air pollution (AQI) data by coordinates
   */
  async getAirPollution(lat, lon) {
    const response = await weatherAPI.get('/air_pollution', { params: { lat, lon } });
    return response.data;
  },

  /**
   * Search for cities based on user input (for autocomplete)
   */
  async searchCities(query) {
    if (!query) return [];
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5,
        appid: API_KEY
      }
    });
    return response.data;
  }
};
