import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Palette, Wand2 } from 'lucide-react';

export default function ImageLoadingAnimation({ isSpecialMode }) {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3">
        <motion.div 
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
            isSpecialMode 
              ? 'bg-gradient-to-br from-amber-400 via-pink-500 to-violet-600' 
              : 'bg-gradient-to-br from-violet-500 to-indigo-600'
          }`}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Palette className="w-5 h-5 text-violet-500" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            >
              <Wand2 className="w-5 h-5 text-pink-500" />
            </motion.div>

            <span className="ml-2 text-sm text-gray-600 font-medium">
              Creating your image... ✨
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">This may take 5-10 seconds</p>
        </div>
      </div>
    </div>
  );
}