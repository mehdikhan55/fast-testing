"use client"
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Stars } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { FaRocket, FaSpaceShuttle, FaCubes, FaColumns, FaFire, FaCompass, FaGraduationCap } from 'react-icons/fa'
import { siteConfig } from '../config/siteConfig'
import MobileNav from '../components/MobileNav'
import _ from 'lodash'

// Lazy load the model component
const RocketModel = dynamic(() => import('../components/RocketModel'), { ssr: false });
const RocketStages = dynamic(() => import('../components/RocketStages'), { ssr: false });
const RocketSeparation = dynamic(() => import('../components/RocketSeparation'), { ssr: false });
// const SpaceParticles = dynamic(() => import('../components/SpaceParticles'), { ssr: false });

// Map sections from config and add icon components
const getIconComponent = (iconName, size = 30) => {
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
    case 'FaGraduationCap':
      return <FaGraduationCap size={size} />;
    default:
      return <FaRocket size={size} />;
  }
};

// Process sections data with icon components
const sections = siteConfig.sections.map(section => ({
  ...section,
  icon: getIconComponent(section.icon, 30)
}));

// Loading component
const LoadingFallback = () => (
  <div className="absolute inset-0 flex justify-center items-center bg-gradient-to-b from-slate-900 to-blue-900">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-xl text-white font-light tracking-wider">Initiating launch sequence...</p>
    </div>
  </div>
);

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

const Page = () => {
  const [currentSection, setCurrentSection] = useState('intro');
  const [previousSection, setPreviousSection] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [triggerSeparation, setTriggerSeparation] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionsRef = useRef([]);
  
  // Handle mouse movement for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = _.debounce(() => {
      setScrollY(window.scrollY);
      
      // Determine which section is in view
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY + viewportHeight * 0.5;
      
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        
        const { offsetTop, offsetHeight } = section;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          // Only update if section changes
          if (currentSection !== section.id) {
            setPreviousSection(currentSection);
            setCurrentSection(section.id);
            
            // Trigger separation animation when moving between sections
            setTriggerSeparation(true);
            // Reset trigger after a short delay
            setTimeout(() => setTriggerSeparation(false), 100);
          }
        }
      });
    }, 5);
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel(); // Cancel debounce on cleanup
    };
  }, [currentSection]);
  
  return (
    <div className="bg-[#050a1f] text-white min-h-screen overflow-x-hidden cursor-none">
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Star Field Background */}
      <StarField />
      
      {/* Floating Asteroids */}
      <FloatingAsteroids />
      
      {/* 3D Rocket Canvas - Fixed Position */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 15], fov: 50 }}
            gl={{ 
              powerPreference: "high-performance",
              antialias: true,
              alpha: true 
            }}
            dpr={[1, 2]}
          >
            <color attach="background" args={[siteConfig.environment.backgroundColor]} />
            <fog attach="fog" args={[siteConfig.environment.backgroundColor, ...siteConfig.environment.fogDistance]} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <spotLight position={[-5, 5, 5]} intensity={0.8} angle={0.3} penumbra={0.8} castShadow />
            
            {/* Camera with controls - position based on current section */}
            <PerspectiveCamera 
              makeDefault 
              position={
                siteConfig.rocketModel.views[currentSection]?.cameraPosition || 
                [0, 0, 15]
              } 
              fov={50}
            >
              <spotLight position={[0, 0, 10]} intensity={0.5} angle={0.6} penumbra={0.5} />
            </PerspectiveCamera>
            
            {/* The model component - we'll animate based on current section */}
            <RocketModel 
              currentSection={currentSection} 
              mousePosition={mousePosition}
            />
            <RocketStages currentSection={currentSection} />
            <RocketSeparation currentSection={currentSection} triggerSeparation={triggerSeparation} />
            {/* <SpaceParticles /> */}
            
            {/* Enhanced star field */}
            <Stars 
              radius={100} 
              depth={50} 
              count={5000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={0.5}
            />
            
            {/* Limited orbit controls */}
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              autoRotate
              autoRotateSpeed={0.5}
            />
            
            {/* Add environment lighting for better visuals */}
            <Environment preset={siteConfig.environment.preset} />
          </Canvas>
        </Suspense>
      </div>
      
      {/* Header - Navigation */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-30 backdrop-blur-md border-b border-blue-900/30">
        <motion.nav 
          className="container mx-auto px-6 py-4"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <FaRocket className="text-blue-400" size={24} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                {siteConfig.name}
              </h1>
            </motion.div>
            <ul className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <motion.li 
                  key={section.id}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <a 
                    href={`#${section.id}`} 
                    className={`hover:text-blue-400 transition-colors ${
                      currentSection === section.id ? 'text-blue-500 font-medium' : 'text-gray-300'
                    }`}
                  >
                    {currentSection === section.id ? (
                      <motion.span 
                        layoutId="activeSection"
                        className="relative"
                      >
                        {section.title}
                        <motion.div 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500"
                          layoutId="activeBar"
                        />
                      </motion.span>
                    ) : (
                      section.title
                    )}
                  </a>
                </motion.li>
              ))}
            </ul>
            
            {/* Mobile Navigation */}
            <MobileNav currentSection={currentSection} />
          </div>
        </motion.nav>
      </header>
      
      {/* Main Content - Scrollable Sections */}
      <main className="relative z-1">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center text-center px-4 max-sm:pt-20 md:pt-30">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            className="max-w-6xl"
          >
            <motion.h1 
              className="text-3xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent tracking-tight"
              animate={{ 
                textShadow: [
                  "0 0 8px rgba(59, 130, 246, 0.5)", 
                  "0 0 16px rgba(59, 130, 246, 0.8)", 
                  "0 0 8px rgba(59, 130, 246, 0.5)"
                ] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              {siteConfig.tagline}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl 2xl:text-3xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {siteConfig.description}
            </motion.p>
            <motion.a 
              href="#intro" 
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 rounded-full text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 0 20px 0 rgba(59, 130, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0.8,
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
            >
              Begin the Journey
            </motion.a>
          </motion.div>
        </section>
        
        {/* Program Components Sections */}
        {sections.map((section, index) => (
          <section 
            ref={(el) => (sectionsRef.current[index] = el)}
            key={section.id}
            id={section.id}
            className="min-h-screen flex items-center py-24"
          >
            <div className="container mx-auto px-6">
              <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                <MotionTrail 
                  className="w-full md:w-1/2"
                  fraction={0.8 + index * 0.02}
                >
                  <div className="md:max-w-lg mx-auto">
                    <ParallaxSection baseVelocity={100 + index * 50}>
                      <div className="flex items-center mb-6">
                        <motion.div 
                          className="mr-4 text-blue-400"
                          animate={{ 
                            rotate: [0, 5, 0, -5, 0],
                            scale: [1, 1.1, 1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 5, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.25, 0.5, 0.75, 1] 
                          }}
                        >
                          {section.icon}
                        </motion.div>
                        <motion.h2 
                          className="text-2xl md:text-4xl font-bold text-white tracking-tighter"
                          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                            delay: 0.2
                          }}
                        >
                          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                            {section.title}
                          </span>
                        </motion.h2>
                      </div>
                    </ParallaxSection>
                    
                    {/* Enhanced futuristic content section */}
                    <Card3D>
                      <div className="relative backdrop-blur-sm bg-blue-900/10 border border-blue-500/20 rounded-lg p-6 mt-4 mb-8 shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 rounded-lg pointer-events-none"></div>
                        <motion.p 
                          className="text-xl md:text-2xl text-blue-50 leading-relaxed tracking-wide relative z-10"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                        >
                          {section.content}
                        </motion.p>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-br from-blue-400/20 to-indigo-600/30 rounded-bl-3xl blur-md"></div>
                        <div className="absolute bottom-0 left-0 h-20 w-20 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 rounded-tr-3xl blur-sm"></div>
                        
                        {/* Animated orbital ring */}
                        <div className="absolute -right-4 -top-4 w-16 h-16 pointer-events-none">
                          <motion.div 
                            className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          ></motion.div>
                          <motion.div 
                            className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{ marginLeft: "-4px", marginTop: "-4px" }}
                          ></motion.div>
                        </div>
                      </div>
                    </Card3D>
                    
                    <div className="flex flex-wrap gap-4">
                      <motion.button 
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/25 hover:shadow-blue-600/40"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 15px 0 rgba(59, 130, 246, 0.6)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                      </motion.button>
                      <motion.button 
                        className="border border-blue-500 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30 px-6 py-2 rounded-md transition-colors"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 15px 0 rgba(59, 130, 246, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Explore Features
                      </motion.button>
                    </div>
                  </div>
                </MotionTrail>
                <motion.div 
                  className="w-full md:w-1/2"
                  style={{
                    x: useTransform(
                      useMotionValue(mousePosition.x),
                      [0, 1],
                      [index % 2 === 0 ? 10 : -10, index % 2 === 0 ? -10 : 10]
                    ),
                    y: useTransform(
                      useMotionValue(mousePosition.y),
                      [0, 1],
                      [10, -10]
                    ),
                  }}
                >
                  {/* This div is intentionally empty - it creates space for the 3D model to be visible */}
                  <div className="aspect-square md:aspect-auto md:h-[500px]"></div>
                </motion.div>
              </div>
            </div>
          </section>
        ))}
        
        {/* Contact Section */}
        <section className="min-h-screen flex items-center py-16 bg-gradient-to-b from-transparent to-blue-900/20">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Ready for Liftoff?</h2>
            <div className="backdrop-blur-md bg-blue-900/10 border border-blue-500/20 rounded-xl p-8 mb-12">
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Contact our team to learn more about the FAST @ CSI program and how we can help launch your students into a future of innovation and success.
              </p>
              
              {/* Contact form */}
              <div className="max-w-lg mx-auto">
                <form className="space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-300 mb-1 text-sm">Name</label>
                      <input 
                        type="text" 
                        className="w-full bg-blue-900/30 border border-blue-500/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-300 mb-1 text-sm">Email</label>
                      <input 
                        type="email" 
                        className="w-full bg-blue-900/30 border border-blue-500/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-blue-300 mb-1 text-sm">Message</label>
                    <textarea 
                      className="w-full bg-blue-900/30 border border-blue-500/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 rounded-full text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-600/40">
              Contact Us
            </button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="relative bg-black bg-opacity-70 py-12 px-6 border-t border-blue-900/30 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <FaRocket className="text-blue-500" size={20} />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                  {siteConfig.name}
                </h3>
              </div>
              <p className="text-blue-200 max-w-md">
                {siteConfig.tagline} - Pioneering the future of education with cutting-edge programs and innovative approaches.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Program</h4>
                <ul className="space-y-2 text-blue-300">
                  <li><a href="#foundation" className="hover:text-blue-400 transition-colors">The Foundation</a></li>
                  <li><a href="#supports" className="hover:text-blue-400 transition-colors">The Supports</a></li>
                  <li><a href="#fuel" className="hover:text-blue-400 transition-colors">The Fuel</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Journey</h4>
                <ul className="space-y-2 text-blue-300">
                  <li><a href="#guidance" className="hover:text-blue-400 transition-colors">The Guidance</a></li>
                  <li><a href="#vehicle" className="hover:text-blue-400 transition-colors">The Vehicle</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Connect</h4>
                <ul className="space-y-2 text-blue-300">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">For Students</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">For Educators</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">For Parents</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-900/30 mt-12 pt-8 text-center text-blue-400">
            <p>© {new Date().getFullYear()} FAST @ CSI. All rights reserved.</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </footer>
    </div>
  )
}

export default Page