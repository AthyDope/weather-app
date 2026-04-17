import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Umbrella, Thermometer, Cloud } from 'lucide-react';

const SmartInsight = ({ weatherData }) => {
  if (!weatherData) return null;

  const getInsight = () => {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main.toLowerCase();
    const humidity = weatherData.main.humidity;

    if (condition.includes('rain')) return {
      text: "Carry an umbrella today! It's likely to rain. ☔",
      color: "from-blue-400 to-indigo-500",
      icon: <Umbrella className="text-white" />
    };
    if (temp > 30) return {
      text: "It's quite hot. Stay hydrated and find some shade! 💧",
      color: "from-orange-400 to-red-500",
      icon: <Thermometer className="text-white" />
    };
    if (humidity > 80) return {
      text: "High humidity today. It might feel stuffy! 🌫️",
      color: "from-teal-400 to-emerald-500",
      icon: <Cloud className="text-white" />
    };
    return {
      text: "Perfect weather for a walk or outdoor activity! 🌤️",
      color: "from-purple-400 to-pink-500",
      icon: <Lightbulb className="text-white" />
    };
  };

  const insight = getInsight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1 }}
      className={`mt-24 p-12 rounded-[4rem] bg-gradient-to-br ${insight.color} shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden group cursor-pointer border border-white/20`}
      whileHover={{ scale: 1.02, y: -10 }}
    >
      {/* Animated Light Streaks */}
      <div className="absolute top-0 -left-1/2 w-full h-full bg-white/10 -skew-x-12 animate-[float_10s_infinite_linear] pointer-events-none" />
      <div className="absolute bottom-0 -right-1/2 w-full h-full bg-black/10 -skew-x-12 animate-[float_12s_infinite_linear] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
        <div className="p-8 bg-white/20 rounded-[3rem] backdrop-blur-3xl shadow-inner group-hover:scale-110 transition-transform duration-700">
          {React.cloneElement(insight.icon, { size: 48, className: "text-white drop-shadow-lg" })}
        </div>
        <div className="space-y-3">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">Aether Insight Engine</span>
          <h4 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
            {insight.text}
          </h4>
          <p className="text-white/50 font-bold tracking-wide italic">Tailored for your current location and conditions.</p>
        </div>
      </div>

      <div className="absolute top-4 right-8 opacity-10 group-hover:opacity-30 transition-opacity">
        <Lightbulb size={120} className="text-white" />
      </div>
    </motion.div>
  );
};

export default SmartInsight;
