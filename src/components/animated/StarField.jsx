import React from 'react'
import { motion } from 'framer-motion'

// Star field background
const StarField = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(200)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const duration = Math.random() * 3 + 2;
          const delay = Math.random() * 2;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>
    );
  };

export default StarField
