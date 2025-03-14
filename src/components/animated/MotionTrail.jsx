import React from 'react'
import { motion } from 'framer-motion'

// Motion trail effect for sections
const MotionTrail = ({ children, fraction = 0.8, ...props }) => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 100, scale: fraction }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 30, 
            delay: 0.1 * (1 - fraction)
          }
        }}
        viewport={{ once: true, margin: "-100px" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  };

export default MotionTrail
