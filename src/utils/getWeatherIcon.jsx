import { 
  Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, Wind, Droplets, CloudSun
} from 'lucide-react';

export const getWeatherIcon = (iconCode, size = "4em", className = "") => {
  const iconProps = { size, className: `${className} drop-shadow-2xl` };
  
  const sunGlow = "text-yellow-400 drop-shadow-[0_0_35px_rgba(250,204,21,0.8)]";
  const rainGlow = "text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.6)]";
  const cloudGlow = "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]";

  switch (iconCode) {
    case '01d': 
      return <Sun {...iconProps} size={size === "8rem" ? 140 : 48} className={sunGlow} strokeWidth={1} />;
    case '01n': 
      return <Moon {...iconProps} size={size === "8rem" ? 140 : 48} className="text-indigo-200 drop-shadow-[0_0_30px_rgba(165,180,252,0.6)]" strokeWidth={1} />;
    case '02d': 
    case '03d':
    case '04d': 
      return <CloudSun {...iconProps} size={size === "8rem" ? 140 : 48} className={cloudGlow} strokeWidth={1} />;
    case '09d':
    case '10d': 
      return <CloudRain {...iconProps} size={size === "8rem" ? 140 : 48} className={rainGlow} strokeWidth={1} />;
    case '11d':
      return <CloudLightning {...iconProps} size={size === "8rem" ? 140 : 48} className="text-yellow-600 drop-shadow-[0_0_25px_rgba(202,138,4,0.6)]" strokeWidth={1} />;
    case '13d':
      return <CloudSnow {...iconProps} size={size === "8rem" ? 140 : 48} className="text-sky-200" strokeWidth={1} />;
    default: 
      return <Cloud {...iconProps} size={size === "8rem" ? 140 : 48} className={cloudGlow} strokeWidth={1} />;
  }
};
