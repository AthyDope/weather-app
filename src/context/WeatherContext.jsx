import React, { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteCities');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);

  const toggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  const addFavorite = (city) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const removeFavorite = (city) => {
    setFavorites(favorites.filter((fav) => fav !== city));
  };

  return (
    <WeatherContext.Provider 
      value={{ 
        unit, 
        toggleUnit, 
        favorites, 
        addFavorite, 
        removeFavorite 
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};
