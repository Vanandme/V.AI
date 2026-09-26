import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';

export default function SpecialModeToggle({ isOn, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
        isOn 
          ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-violet-600 text-white shadow-lg shadow-pink-200' 
          : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:border-violet-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isOn ? (
          <motion.div
            key="crown"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Crown className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="sparkles"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <span className="text-sm font-medium">
        {isOn ? 'Special Mode ✨' : 'Special Mode'}
      </span>

      {isOn && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 20px rgba(236, 72, 153, 0.3)',
              '0 0 40px rgba(167, 139, 250, 0.3)',
              '0 0 20px rgba(236, 72, 153, 0.3)',
            ]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.button>
  );
}