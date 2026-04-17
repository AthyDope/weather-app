import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Star, StarOff } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { getWeatherIcon } from '../utils/getWeatherIcon';
import { useWeatherContext } from '../context/WeatherContext';

const WeatherCard = ({ data }) => {
  const { favorites, addFavorite, removeFavorite, unit } = useWeatherContext();
  const isFavorite = favorites.includes(data.name);

  const toggleFavorite = () => {
    if (isFavorite) removeFavorite(data.name);
    else addFavorite(data.name);
  };

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full glass-card rounded-[4rem] p-12 md:p-20 relative overflow-hidden group border-white/10"
    >
      {/* Dynamic Aura Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[180px] rounded-full -mr-96 -mt-96 group-hover:bg-blue-500/20 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[180px] rounded-full -ml-64 -mb-64 group-hover:bg-fuchsia-500/20 transition-all duration-1000" />

      <div className="relative z-10">
        <div className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 glass-pill bg-blue-500/20 text-blue-300 text-[10px] font-black tracking-[0.3em] uppercase border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Live Data
              </span>
              <p className="text-white/40 text-sm font-bold tracking-widest uppercase">
                {formatDate(data.dt, 'h:mm a')} • {data.sys.country}
              </p>
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
              {data.name}
            </h2>
            <div className="flex items-center gap-4">
              <p className="text-2xl text-white/50 font-semibold tracking-tight">
                {formatDate(data.dt, 'EEEE, MMMM do')}
              </p>
              <motion.button
                whileHover={{ scale: 1.15, rotate: 12 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFavorite}
                className={`p-4 rounded-[1.5rem] backdrop-blur-2xl border transition-all duration-500 ${
                  isFavorite 
                    ? 'bg-amber-400/40 border-amber-400/50 text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
                    : 'bg-white/5 border-white/10 text-white/20 hover:text-white hover:border-white/20'
                }`}
              >
                {isFavorite ? <Star size={32} fill="currentColor" /> : <Star size={32} />}
              </motion.button>
            </div>
          </div>
          
          <div className="flex flex-col items-start xl:items-end gap-1">
            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Outlook</span>
            <div className="bg-white/5 backdrop-blur-3xl border border-white/10 px-10 py-5 rounded-[2.5rem] shadow-2xl">
              <span className="text-4xl font-black text-white capitalize tracking-tighter">
                {data.weather[0].main}
              </span>
              <p className="text-white/40 text-center text-xs mt-1 font-bold italic tracking-wide">
                {data.weather[0].description}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="flex items-center gap-10 md:gap-16">
            <motion.div 
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 5, 0],
                filter: ["drop-shadow(0 0 40px rgba(255,255,255,0.1))", "drop-shadow(0 0 60px rgba(59,130,246,0.3))", "drop-shadow(0 0 40px rgba(255,255,255,0.1))"]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {getWeatherIcon(data.weather[0].icon, "14rem")}
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-start">
                <span className="text-[10rem] md:text-[14rem] leading-none font-black text-white tracking-tighter">
                  {Math.round(data.main.temp)}
                </span>
                <span className="text-6xl md:text-8xl font-black text-blue-500 mt-8 leading-none">{tempUnit}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:gap-8">
            <DetailItem 
              icon={<Thermometer className="text-orange-400" />} 
              label="Feels Like" 
              value={`${Math.round(data.main.feels_like)}${tempUnit}`} 
            />
            <DetailItem 
              icon={<Droplets className="text-cyan-400" />} 
              label="Humidity" 
              value={`${data.main.humidity}%`} 
            />
            <DetailItem 
              icon={<Wind className="text-indigo-400" />} 
              label="Wind Speed" 
              value={`${data.wind.speed} ${speedUnit}`} 
            />
            <DetailItem 
              icon={<Cloud className="text-fuchsia-400" />} 
              label="Pressure" 
              value={`${data.main.pressure} hPa`} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="bg-white/5 backdrop-blur-[30px] p-8 rounded-[3rem] border border-white/5 flex flex-col gap-4 transition-all duration-700 hover:bg-white/10 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] group cursor-pointer">
    <div className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">
      <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {label}
    </div>
    <div className="text-4xl font-black text-white tracking-tighter leading-none">{value}</div>
  </div>
);

export default WeatherCard;
