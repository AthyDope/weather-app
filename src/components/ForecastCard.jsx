import React from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/formatDate';
import { getWeatherIcon } from '../utils/getWeatherIcon';

const ForecastCard = ({ forecastData }) => {
  // Filter for noon forecasts (approx) to show 1 per day
  const dailyForecast = forecastData.list.filter((item) => item.dt_txt.includes('12:00:00'));

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 px-6">
        <div className="space-y-1">
          <span className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase">Weekly Overview</span>
          <h3 className="text-5xl font-black text-white tracking-tighter">Full Forecast</h3>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-500/30 via-white/5 to-transparent hidden md:block mb-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {dailyForecast.map((item, index) => (
          <motion.div
            key={item.dt}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-[3.5rem] p-10 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/15 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:-translate-y-4 group relative cursor-pointer"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
            
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mb-10 group-hover:text-blue-300 transition-colors">
              {formatDate(item.dt, 'EEEE')}
            </p>
            
            <motion.div 
              whileHover={{ rotate: [0, 10, -10, 0] }}
              className="mb-10 drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] group-hover:scale-125 transition-transform duration-500"
            >
              {getWeatherIcon(item.weather[0].icon, "5.5rem")}
            </motion.div>
            
            <div className="flex flex-col gap-2">
              <p className="text-5xl font-black text-white tracking-tighter">
                {Math.round(item.main.temp_max)}°
              </p>
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-[1px] bg-white/20" />
                <p className="text-xl font-bold text-white/30 tracking-tight leading-none">
                  {Math.round(item.main.temp_min)}°
                </p>
              </div>
            </div>
            
            <div className="mt-8 px-5 py-2 glass-pill bg-white/5 border-white/5 transition-all group-hover:bg-blue-500/20">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                {item.weather[0].main}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
