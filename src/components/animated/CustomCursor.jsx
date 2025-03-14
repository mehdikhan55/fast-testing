'use client'
import React from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react';

// Custom cursor component
const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);
  
    useEffect(() => {
      const moveCursor = (e) => {
        cursorX.set(e.clientX - 16);
        cursorY.set(e.clientY - 16);
      };
  
      window.addEventListener('mousemove', moveCursor);
      
      return () => {
        window.removeEventListener('mousemove', moveCursor);
      };
    }, [cursorX, cursorY]);
  
    return (
      <motion.div 
        className="custom-cursor fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div 
          className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            opacity: { duration: 0.2 }
          }}
        >
          <motion.div className="w-2 h-2 rounded-full bg-blue-400"></motion.div>
        </motion.div>
      </motion.div>
    );
  };
export default CustomCursor
