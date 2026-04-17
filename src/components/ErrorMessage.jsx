import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl glass mb-6"
    >
      <AlertCircle size={20} />
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

export default ErrorMessage;
