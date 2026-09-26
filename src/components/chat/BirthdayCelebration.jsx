import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, PartyPopper, Gift, Heart, Star } from 'lucide-react';

const Confetti = ({ count = 50 }) => {
  const colors = ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#F472B6'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            rotate: Math.random() * 360,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

const FloatingIcon = ({ Icon, delay, x }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%` }}
    initial={{ y: 100, opacity: 0, scale: 0 }}
    animate={{ 
      y: -100, 
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0.5],
      rotate: [0, 15, -15, 0]
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatDelay: 2,
    }}
  >
    <Icon className="w-8 h-8 text-pink-500" />
  </motion.div>
);

export default function BirthdayCelebration({ show, onClose }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {showConfetti && <Confetti count={80} />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-br from-violet-900/20 via-pink-900/20 to-amber-900/20 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 overflow-hidden">
                <FloatingIcon Icon={Star} delay={0} x={10} />
                <FloatingIcon Icon={Heart} delay={0.5} x={30} />
                <FloatingIcon Icon={Gift} delay={1} x={50} />
                <FloatingIcon Icon={PartyPopper} delay={1.5} x={70} />
                <FloatingIcon Icon={Cake} delay={2} x={90} />
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center mx-auto shadow-lg shadow-pink-200">
                    <Cake className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 bg-clip-text text-transparent mb-3"
                >
                  🎉 Happy Birthday! 🎉
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-6 leading-relaxed"
                >
                  Wishing you the most magical, wonderful, and joy-filled birthday ever! 
                  May all your dreams come true today and always! 🌟
                </motion.p>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-violet-200 hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Thank you! 💝
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}