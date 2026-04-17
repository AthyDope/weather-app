import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          borderRadius: ["20%", "50%", "20%"],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="w-16 h-16 bg-blue-500/50 backdrop-blur-md border-2 border-blue-400"
      />
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Fetching sky data...</p>
    </div>
  );
};

export default Loader;
