"use client"
import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Enhanced 3D Card component
const Card3D = ({ children }) => {
    const ref = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [scale, setScale] = useState(1);
  
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const card = ref.current;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      // Calculate rotation
      const rotateY = ((e.clientX - cardCenterX) / (rect.width / 2)) * 5;
      const rotateX = -((e.clientY - cardCenterY) / (rect.height / 2)) * 5;
      
      setRotateX(rotateX);
      setRotateY(rotateY);
    };
  
    const handleMouseEnter = () => {
      setScale(1.02);
    };
  
    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
      setScale(1);
    };
  
    return (
      <motion.div
        ref={ref}
        className="relative transition-all duration-200 ease-out will-change-transform"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d",
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        }}
      >
        <div className="relative z-10">{children}</div>
        <div 
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ transform: "translateZ(-10px)" }}
        ></div>
      </motion.div>
    );
  };

export default Card3D
