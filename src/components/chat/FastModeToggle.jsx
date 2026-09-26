import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bolt } from 'lucide-react';

export default function FastModeToggle({ isOn, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
        isOn 
          ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-200' 
          : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:border-emerald-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isOn ? (
          <motion.div
            key="bolt"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            <Bolt className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="zap"
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -180 }}
            transition={{ duration: 0.2 }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className="text-sm font-medium">
        {isOn ? 'Fast Mode ⚡' : 'Fast Mode'}
      </span>

      {isOn && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(16, 185, 129, 0.3)',
              '0 0 40px rgba(6, 182, 212, 0.3)',
              '0 0 20px rgba(16, 185, 129, 0.3)',
            ]
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      )}
    </motion.button>
  );
}