import { useState, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

/**
 * Custom hook for fetching and managing weather data
 */
export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherByCity = useCallback(async (city, units = 'metric') => {
    setLoading(true);
    setError(null);
    try {
      const weather = await weatherService.getCurrentWeather(city, units);
      const [forecast, aqi] = await Promise.all([
        weatherService.getForecast(city, units),
        weatherService.getAirPollution(weather.coord.lat, weather.coord.lon)
      ]);
      setWeatherData(weather);
      setForecastData(forecast);
      setAqiData(aqi);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = useCallback(async (units = 'metric') => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const [weather, forecast, aqi] = await Promise.all([
            weatherService.getWeatherByCoords(latitude, longitude, units),
            weatherService.getForecastByCoords(latitude, longitude, units),
            weatherService.getAirPollution(latitude, longitude)
          ]);
          setWeatherData(weather);
          setForecastData(forecast);
          setAqiData(aqi);
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Failed to fetch weather data');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access denied');
        setLoading(false);
      }
    );
  }, []);

  return {
    weatherData,
    forecastData,
    aqiData,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
  };
};
