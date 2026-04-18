import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { weatherService } from '../services/weatherService';
import { formatDate } from '../utils/formatDate';
import { getWeatherIcon } from '../utils/getWeatherIcon';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { 
  Search, MapPin, Droplets, Wind, Thermometer, 
  Sun as SunIcon, Sunrise, Sunset, Wind as WindIcon, Clock, Moon as MoonIcon, CloudRain
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- Components ---

const UnitToggle = ({ units, setUnits }) => (
  <div className="flex bg-white/5 backdrop-blur-3xl p-1 rounded-full border border-white/10 w-24 relative overflow-hidden group cursor-pointer"
       onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
    <motion.div 
      animate={{ x: units === 'metric' ? 0 : 44 }}
      className="absolute top-1 left-1 bottom-1 w-10 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] z-0"
    />
    <div className={`flex-1 text-center text-[10px] font-black z-10 py-1.5 transition-colors ${units === 'metric' ? 'text-black' : 'text-white/40'}`}>°C</div>
    <div className={`flex-1 text-center text-[10px] font-black z-10 py-1.5 transition-colors ${units !== 'metric' ? 'text-black' : 'text-white/40'}`}>°F</div>
  </div>
);

const AQICard = ({ data }) => {
  if (!data) return null;
  const aqi = data.list[0].main.aqi;
  const levels = {
    1: { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    2: { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    3: { label: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    4: { label: 'Poor', color: 'text-red-400', bg: 'bg-red-500/10' },
    5: { label: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  };
  const current = levels[aqi] || levels[1];

  return (
    <div className={`bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex items-center gap-6 flex-1 shadow-2xl group transition-all`}>
      <div className={`p-4 rounded-3xl ${current.bg} ${current.color} shadow-inner shrink-0 group-hover:scale-110 transition-transform`}>
        <WindIcon size={32} />
      </div>
      <div>
        <p className={`opacity-60 text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${current.color}`}>Air Quality</p>
        <p className={`text-3xl font-black tracking-tighter ${current.color}`}>{current.label}</p>
        <p className="text-[10px] opacity-40 font-bold mt-1 uppercase tracking-wider text-white">PM2.5: <span className={current.color}>{data.list[0].components.pm2_5} µg/m³</span></p>
      </div>
    </div>
  );
};

const SunTimeline = ({ sunrise, sunset, timezone }) => {
  const now = Math.floor(Date.now() / 1000);
  const total = sunset - sunrise;
  const current = Math.max(0, Math.min(now - sunrise, total));
  const progress = (current / total) * 100;
  
  return (
    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex-1 shadow-2xl relative overflow-hidden group">
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <p className="text-orange-400/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
            <Sunrise size={12} /> Sunrise
          </p>
          <p className="text-xl font-black text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.4)]">{formatDate(sunrise, 'HH:mm')}</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.3em] mb-1 flex items-center gap-2 justify-end">
            Sunset <Sunset size={12} />
          </p>
          <p className="text-xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.4)]">{formatDate(sunset, 'HH:mm')}</p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-indigo-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]" 
        />
      </div>
      <p className="text-[10px] opacity-20 font-black tracking-widest uppercase mt-4 text-center">
        {now > sunset ? "Sun has set" : now < sunrise ? "Before sunrise" : `Daylight Progress: ${Math.round(progress)}%`}
      </p>
    </div>
  );
};

const MoonPhase = ({ date }) => {
  // Simple algorithm for moon phase (approximation)
  const getMoonPhase = (d) => {
    let year = d.getUTCFullYear();
    let month = d.getUTCMonth() + 1;
    const day = d.getUTCDate();
    if (month < 3) { year--; month += 12; }
    const res = Math.floor(365.25 * year) + Math.floor(30.6001 * (month + 1)) + day - 694039.09;
    const phase = (res / 29.5305886) % 1;
    if (phase < 0.0625) return "New Moon";
    if (phase < 0.1875) return "Waxing Crescent";
    if (phase < 0.3125) return "First Quarter";
    if (phase < 0.4375) return "Waxing Gibbous";
    if (phase < 0.5625) return "Full Moon";
    if (phase < 0.6875) return "Waning Gibbous";
    if (phase < 0.8125) return "Last Quarter";
    if (phase < 0.9375) return "Waning Crescent";
    return "New Moon";
  };
  
  const phase = getMoonPhase(new Date(date * 1000));
  
  return (
    <div className="flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition-all border-t border-white/5 pt-4 w-full">
      <div className="p-2 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-colors">
        <MoonIcon size={20} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-indigo-300 group-hover:text-cyan-400 transition-colors text-center px-1 leading-tight">{phase}</span>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="p-3 md:p-6 w-full max-w-5xl mx-auto space-y-8 animate-pulse">
    <div className="flex gap-4 h-12 w-full max-w-md bg-white/5 rounded-full" />
    <div className="flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-80 h-80 bg-white/5 rounded-[3rem]" />
      <div className="flex-1 space-y-6">
        <div className="h-20 w-3/4 bg-white/5 rounded-3xl" />
        <div className="h-10 w-1/2 bg-white/5 rounded-2xl" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-[2.5rem]" />)}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-2xl border border-white/20 p-4 rounded-2xl shadow-2xl ring-1 ring-white/10">
        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-1">
          {payload[0].payload.time}
        </p>
        <p className="text-2xl font-black text-white">
          {payload[0].value}°
        </p>
      </div>
    );
  }
  return null;
};

// --- Main App ---

const Home = () => {
  const { 
    weatherData, forecastData, aqiData, loading, error, 
    fetchWeatherByCity, fetchWeatherByLocation 
  } = useWeather();

  const [query, setQuery] = useState('');
  const [units, setUnits] = useState('metric');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchWeatherByLocation(units);
  }, [fetchWeatherByLocation]);

  useEffect(() => {
    if (weatherData) {
      fetchWeatherByCity(weatherData.name, units);
    }
  }, [units]);

  // Debounced Search Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const results = await weatherService.searchCities(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Suggestions error:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeatherByCity(query, units);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setQuery(city.name);
    fetchWeatherByCity(`${city.name},${city.country}`, units);
    setShowSuggestions(false);
  };

  const hourlyData = useMemo(() => {
    return forecastData?.list.slice(0, 10).map(item => ({
      time: formatDate(item.dt, 'HH:mm'),
      temp: Math.round(item.main.temp),
    }));
  }, [forecastData]);

  return (
    <>
      <div className="p-3 md:p-6 w-full max-w-5xl mx-auto overflow-x-hidden min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading && !weatherData ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <SkeletonLoader />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="glass-main p-10 text-center">
                <ErrorMessage message={error} />
                <button 
                  onClick={() => fetchWeatherByLocation(units)}
                  className="mt-6 px-8 py-3 bg-cyan-500 rounded-full font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          ) : weatherData ? (
            <motion.div 
              key={weatherData.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="glass-main p-6 md:p-10 w-full overflow-hidden"
            >
              {/* Brand Identity / Logo */}
              <div className="flex justify-center xl:justify-start mb-10">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:rotate-12 transition-transform">
                    <SunIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] uppercase bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">
                    Atmos
                  </h1>
                </motion.div>
              </div>

              {/* Header Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <UnitToggle units={units} setUnits={setUnits} />
                  <div className="flex-1 lg:w-80 relative group">
                    <form onSubmit={handleSubmit} className="relative z-50">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length > 2 && setShowSuggestions(true)}
                        placeholder="Find your city..."
                        className="w-full bg-white/5 rounded-full py-3 pl-12 pr-6 outline-none border border-white/10 text-white placeholder-white/20 focus:bg-white/10 transition-all font-bold"
                      />
                    </form>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl z-[100] p-2"
                        >
                          {suggestions.map((city, idx) => (
                            <button
                              key={`${city.lat}-${idx}`}
                              onClick={() => handleSuggestionClick(city)}
                              className="w-full text-left px-5 py-3 hover:bg-white/5 rounded-2xl transition-colors flex items-center justify-between group"
                            >
                              <div>
                                <p className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                                  {city.name}
                                </p>
                                <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">
                                  {city.state ? `${city.state}, ` : ''}{city.country}
                                </p>
                              </div>
                              <Search size={12} className="opacity-0 group-hover:opacity-40 transition-opacity text-cyan-400" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <button 
                  onClick={() => fetchWeatherByLocation(units)}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-3 rounded-full border border-white/10 transition-all group w-full lg:w-auto justify-center"
                >
                  <MapPin size={18} className="text-cyan-400 group-hover:animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Current Location</span>
                </button>
              </div>

              <div className="space-y-10">
                {/* Hero Section */}
                <div className="flex flex-col xl:flex-row gap-10 items-center">
                  <div className="bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/20 rounded-[3rem] p-10 flex flex-col items-center gap-6 w-full xl:w-[320px] shadow-2xl relative overflow-hidden group shrink-0">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/20 blur-[60px] pointer-events-none" />
                    {getWeatherIcon(weatherData.weather[0].icon, "6rem")}
                    <div className="text-7xl font-black tracking-tighter flex items-start bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
                      {Math.round(weatherData.main.temp)}<span className="text-3xl mt-4 ml-1 opacity-40">°</span>
                    </div>
                    <p className="text-xl font-black uppercase tracking-[0.4em] text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] italic">{weatherData.weather[0].main}</p>
                  </div>

                  <div className="flex-1 text-center xl:text-left">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-3 break-words bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent drop-shadow-[0_10px_10px_rgba(34,211,238,0.3)]">
                      {weatherData.name}
                    </h1>
                    <p className="text-2xl md:text-4xl font-black bg-gradient-to-r from-white to-white/30 bg-clip-text text-transparent capitalize mb-6">{weatherData.weather[0].description}</p>
                    <p className="text-sm md:text-lg opacity-30 font-black uppercase tracking-[0.3em] inline-block border-t border-white/10 pt-4">
                      {formatDate(weatherData.dt, 'EEEE, MMMM do')}
                    </p>
                  </div>
                </div>

                {/* AQI & Sun Timeline Row */}
                <div className="flex flex-col lg:flex-row gap-6">
                  <AQICard data={aqiData} />
                  <SunTimeline 
                    sunrise={weatherData.sys.sunrise} 
                    sunset={weatherData.sys.sunset} 
                    timezone={weatherData.timezone}
                  />
                </div>

                {/* Main Metrics (Precipitation added) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard 
                    icon={<CloudRain className="text-blue-400" />} 
                    label="Precipitation" 
                    value={`${Math.round((forecastData?.list[0]?.pop || 0) * 100)}%`} 
                    accent="bg-blue-500/10"
                    valColor="text-blue-400"
                  />
                  <StatCard 
                    icon={<Droplets className="text-cyan-400" />} 
                    label="Humidity" 
                    value={`${weatherData.main.humidity}%`} 
                    accent="bg-cyan-500/10"
                    valColor="text-cyan-400"
                  />
                  <StatCard 
                    icon={<WindIcon className="text-emerald-300" />} 
                    label="Wind Speed" 
                    value={`${Math.round(weatherData.wind.speed)} ${units === 'metric' ? 'km/h' : 'mph'}`} 
                    accent="bg-emerald-500/10"
                    valColor="text-emerald-300"
                  />
                  <StatCard 
                    icon={<Thermometer className="text-orange-400" />} 
                    label="Feels Like" 
                    value={`${Math.round(weatherData.main.feels_like)}°`} 
                    accent="bg-orange-500/10"
                    valColor="text-orange-400"
                  />
                </div>

                {/* Detailed Hourly Flow */}
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400/60">24-Hour Intensity</h3>
                    <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                      <Clock size={12} className="text-cyan-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Hourly Trend</span>
                    </div>
                  </div>
                  <div className="w-full min-h-[220px] relative overflow-visible" style={{ minWidth: 0 }}>
                    {hourlyData && hourlyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" hide />
                          <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)'}} />
                          <Area 
                            type="monotone" 
                            dataKey="temp" 
                            stroke="#22d3ee" 
                            strokeWidth={5} 
                            fillOpacity={1} 
                            fill="url(#colorTemp)" 
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[220px] flex items-center justify-center opacity-10">
                        <Clock size={40} />
                      </div>
                    )}
                  </div>
                </div>

                {/* 5-Day Forecast + Moon Phases */}
                {forecastData && (
                  <div className="bg-white/5 rounded-[2.5rem] border border-white/10 grid grid-cols-2 lg:grid-cols-5 p-4 md:p-6 shadow-2xl gap-4">
                    {forecastData.list.filter(f => f.dt_txt.includes("12:00:00")).slice(0, 5).map((f) => (
                      <div key={f.dt} className="flex flex-col items-center py-8 gap-6 hover:bg-white/5 transition-all rounded-[2rem] group cursor-default border border-transparent hover:border-white/5">
                        <span className="text-white font-black uppercase text-[10px] tracking-widest opacity-30 group-hover:opacity-100 group-hover:text-cyan-400 transition-all">{formatDate(f.dt, 'EEE')}</span>
                        <div className="group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                          {getWeatherIcon(f.weather[0].icon, "4rem")}
                        </div>
                        <div className="flex flex-col items-center w-full">
                          <div className="text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            {Math.round(f.main.temp_max)}°
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-colors mt-1">
                            High
                          </div>
                        </div>
                        <MoonPhase date={f.dt} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Developer Credit Footer */}
              <div className="mt-20 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white/20 hover:text-cyan-400/60 transition-colors duration-700 select-none">
                  Designed & Developed by <span className="text-white/40">Atharva Chaphe</span> with <span className="text-red-500/60">❤</span>
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
};

const StatCard = ({ icon, label, value, accent, valColor }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-[2.2rem] flex items-center gap-5 hover:bg-white/10 transition-all cursor-default relative overflow-hidden group shadow-xl">
    <div className={`absolute -right-4 -bottom-4 w-20 h-20 blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity ${accent}`} />
    <div className={`p-4 rounded-3xl ${accent} shrink-0 ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-500`}>
      {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
    </div>
    <div className="min-w-0">
      <p className="opacity-20 text-[9px] font-black uppercase tracking-[0.3em] mb-1 truncate">{label}</p>
      <p className={`text-2xl font-black tracking-tighter ${valColor || 'text-white'}`}>{value}</p>
    </div>
  </div>
);

export default Home;
