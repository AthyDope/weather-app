import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchBar = ({ onSearch, onLocationClick }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-24 relative">
      <div className="absolute -inset-10 bg-blue-600/5 blur-[50px] rounded-[5rem] -z-10" />
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-fuchsia-600 rounded-[2.5rem] opacity-0 group-focus-within:opacity-30 transition duration-500 blur" />
          <div className="relative">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 h-7 w-7 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where should we look for weather?"
              className="w-full bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] py-7 pl-20 pr-10 outline-none focus:bg-white/10 text-white placeholder-white/20 text-xl font-medium shadow-2xl transition-all"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onLocationClick}
            className="p-7 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] text-white/40 hover:text-blue-400 hover:border-blue-400/30 transition-all flex items-center justify-center min-w-[84px] shadow-2xl"
            title="Locate Me"
          >
            <MapPin size={32} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-14 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-[2rem] font-black text-xl shadow-[0_20px_50px_-15px_rgba(37,99,235,0.5)] hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.7)] transition-all whitespace-nowrap"
          >
            Show Sky
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
