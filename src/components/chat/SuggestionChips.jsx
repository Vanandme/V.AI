import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Rocket, Heart, Palette, BookOpen, Zap, Image } from 'lucide-react';

const suggestions = [
  { text: "Give me creative ideas", icon: Lightbulb, color: "from-amber-400 to-orange-500" },
  { text: "Create image of a sunset beach", icon: Image, color: "from-cyan-400 to-blue-500" },
  { text: "Help me plan something amazing", icon: Rocket, color: "from-blue-400 to-indigo-500" },
  { text: "Make my day better", icon: Heart, color: "from-pink-400 to-rose-500" },
  { text: "Inspire me with art ideas", icon: Palette, color: "from-violet-400 to-purple-500" },
  { text: "Boost my productivity", icon: Zap, color: "from-yellow-400 to-amber-500" },
];

export default function SuggestionChips({ onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion, idx) => {
        const Icon = suggestion.icon;
        return (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(suggestion.text)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full hover:bg-white hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${suggestion.color} flex items-center justify-center`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
              {suggestion.text}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}