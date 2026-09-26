import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingDots({ isSpecialMode, isFastMode }) {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3">
        <motion.div 
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
            isFastMode
              ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
              : isSpecialMode 
              ? 'bg-gradient-to-br from-amber-400 via-pink-500 to-violet-600' 
              : 'bg-gradient-to-br from-violet-500 to-indigo-600'
          }`}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: isFastMode ? 1 : 3, ease: 'linear' }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-4 shadow-sm">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  isFastMode
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                    : isSpecialMode 
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500' 
                    : 'bg-violet-500'
                }`}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: isFastMode ? 0.5 : 1,
                  delay: i * (isFastMode ? 0.1 : 0.2),
                }}
              />
            ))}
            <span className="ml-2 text-sm text-gray-400">V.AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}