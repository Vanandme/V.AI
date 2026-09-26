import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Heart, Lightbulb, Zap, Star, Image as ImageIcon } from 'lucide-react';
import CodeMessage from '@/components/chat/CodeMessage';

const icons = [Lightbulb, Zap, Star, Heart];

export default function ChatMessage({ message, isUser, isSpecialMode, sections, imageUrl, code, language, instructions }) {
  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end mb-6"
      >
        <div className="flex items-end gap-3 max-w-[80%]">
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 text-white px-5 py-3.5 rounded-2xl rounded-br-md shadow-lg shadow-violet-200">
            <p className="text-[15px] leading-relaxed">{message}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-start mb-8"
    >
      <div className="flex items-start gap-3 max-w-[90%]">
        <motion.div 
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
            isSpecialMode 
              ? 'bg-gradient-to-br from-amber-400 via-pink-500 to-violet-600' 
              : 'bg-gradient-to-br from-violet-500 to-indigo-600'
          }`}
          animate={isSpecialMode ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
        
        <div className="space-y-3 flex-1">
          {imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isSpecialMode 
                    ? 'bg-gradient-to-br from-amber-100 to-pink-100' 
                    : 'bg-gradient-to-br from-violet-100 to-indigo-100'
                }`}>
                  <ImageIcon className={`w-4 h-4 ${
                    isSpecialMode ? 'text-pink-600' : 'text-violet-600'
                  }`} />
                </div>
                <h4 className="font-semibold text-gray-800 text-sm">Generated Image</h4>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Generated" 
                  className="w-full h-auto object-contain max-h-96"
                />
              </div>
              {message && (
                <p className="text-gray-600 text-sm mt-3">{message}</p>
              )}
            </motion.div>
          ) : code ? (
            <CodeMessage
              message={message}
              code={code}
              language={language}
              instructions={instructions}
              isSpecialMode={isSpecialMode}
            />
          ) : sections && sections.length > 0 ? (
            sections.map((section, idx) => {
              const IconComponent = icons[idx % icons.length];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                    isSpecialMode ? 'hover:border-violet-200 hover:bg-violet-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSpecialMode 
                        ? 'bg-gradient-to-br from-amber-100 to-pink-100' 
                        : 'bg-gradient-to-br from-violet-100 to-indigo-100'
                    }`}>
                      <IconComponent className={`w-4 h-4 ${
                        isSpecialMode ? 'text-pink-600' : 'text-violet-600'
                      }`} />
                    </div>
                    <div>
                      {section.title && (
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm">{section.title}</h4>
                      )}
                      <p className="text-gray-600 text-[14px] leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 shadow-sm">
              <p className="text-gray-700 text-[15px] leading-relaxed">{message}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}