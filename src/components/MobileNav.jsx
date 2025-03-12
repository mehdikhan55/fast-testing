'use client'
import React, { useState } from 'react'
import { FaBars, FaTimes, FaRocket, FaCubes, FaColumns, FaFire, FaCompass, FaSpaceShuttle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '../config/siteConfig'

export default function MobileNav({ currentSection }) {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  
  // Get icon component by name
  const getIconComponent = (iconName, size = 20) => {
    switch (iconName) {
      case 'FaRocket':
        return <FaRocket size={size} />;
      case 'FaSpaceShuttle':
        return <FaSpaceShuttle size={size} />;
      case 'FaCubes':
        return <FaCubes size={size} />;
      case 'FaColumns':
        return <FaColumns size={size} />;
      case 'FaFire':
        return <FaFire size={size} />;
      case 'FaCompass':
        return <FaCompass size={size} />;
      default:
        return <FaRocket size={size} />;
    }
  };
  
  return (
    <div className="md:hidden">
      <button 
        onClick={toggleMenu}
        className="p-2 focus:outline-none text-blue-400 hover:text-blue-300 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 right-0 bg-[#050a1f]/95 backdrop-blur-lg border-b border-blue-900/50 z-50"
          >
            <nav className="p-4">
              {/* Logo in mobile menu */}
              <div className="flex items-center space-x-2 mb-6 px-4">
                <FaRocket className="text-blue-400" size={20} />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  FAST @ CSI
                </h3>
              </div>

              <div className="relative mb-8 px-4">
                <div className="absolute inset-0 bg-blue-900/20 blur-md rounded-lg"></div>
                <p className="relative z-10 text-blue-100 p-3 text-sm">
                  Where Learning FASTs Innovation - Inspire Growth, Nurture Innovation, Achieve Technical Excellence
                </p>
              </div>

              <ul className="space-y-4">
                {siteConfig.sections.map((section) => (
                  <li key={section.id} className="border-b border-blue-900/30 pb-3 last:border-0">
                    <a 
                      href={`#${section.id}`} 
                      className={`block py-3 px-4 rounded-md transition-all ${
                        currentSection === section.id 
                          ? 'bg-blue-900/30 text-blue-400 font-medium' 
                          : 'text-gray-300 hover:bg-blue-900/20'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-500">
                          {getIconComponent(section.icon, 20)}
                        </span>
                        <span>{section.title}</span>
                      </div>
                      {currentSection === section.id && (
                        <div className="w-full h-0.5 mt-2 bg-gradient-to-r from-blue-500 to-transparent"></div>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              
              {/* Quick contact button */}
              <div className="mt-6 pt-4 border-t border-blue-900/30">
                <button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 px-4 rounded-md text-white font-medium shadow-lg shadow-blue-900/40"
                  onClick={() => {
                    setIsOpen(false);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact Us
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}