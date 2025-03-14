import React from 'react'
import { motion } from 'framer-motion'

// Floating asteroids component
const FloatingAsteroids = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 10 + 5;
          const duration = Math.random() * 120 + 60;
          const delay = Math.random() * 20;
          const startX = Math.random() * 100;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gray-600/30 backdrop-blur-sm"
              style={{
                width: size,
                height: size,
                left: `${startX}%`,
                top: '-5%',
              }}
              initial={{ y: '-5%', rotate: 0 }}
              animate={{ 
                y: '105%', 
                rotate: 360,
                filter: [
                  'brightness(0.8)',
                  'brightness(1.2)',
                  'brightness(0.8)'
                ]
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'linear',
                filter: {
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut'
                }
              }}
            />
          );
        })}
      </div>
    );
  };

export default FloatingAsteroids
