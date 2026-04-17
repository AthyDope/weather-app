import React from 'react';
import Home from './pages/Home';
import { WeatherProvider } from './context/WeatherContext';
import './styles/index.css';

function App() {
  return (
    <WeatherProvider>
      <Home />
    </WeatherProvider>
  );
}

export default App;
