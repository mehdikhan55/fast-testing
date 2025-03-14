'use client'
import React from 'react'
import { motion, useTransform, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react';


// Parallax section
const ParallaxSection = ({ children, baseVelocity = 100 }) => {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const y = useTransform(
    useMotionValue(scrollY),
    [0, baseVelocity],
    [0, -50],
    { clamp: false }
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection
