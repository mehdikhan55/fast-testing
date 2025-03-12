"use client"
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { FaRocket, FaSpaceShuttle, FaCubes, FaColumns, FaFire, FaCompass, FaGraduationCap } from 'react-icons/fa'
import { siteConfig } from '../config/siteConfig'
import MobileNav from '../components/MobileNav'

// Lazy load the model component
const RocketModel = dynamic(() => import('../components/RocketModel'), { ssr: false });
const RocketStages = dynamic(() => import('../components/RocketStages'), { ssr: false });
const RocketSeparation = dynamic(() => import('../components/RocketSeparation'), { ssr: false });

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

const Page = () => {
  const [currentSection, setCurrentSection] = useState('intro');
  const [previousSection, setPreviousSection] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [triggerSeparation, setTriggerSeparation] = useState(false);
  const sectionsRef = useRef([]);
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
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
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);
  
  return (
    <div className="bg-[#050a1f] text-white min-h-screen overflow-x-hidden">
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
            <RocketModel currentSection={currentSection} />
            <RocketStages currentSection={currentSection} />
            <RocketSeparation currentSection={currentSection} triggerSeparation={triggerSeparation} />
            
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
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaRocket className="text-blue-400" size={24} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                {siteConfig.name}
              </h1>
            </div>
            <ul className="hidden md:flex space-x-8">
              {sections.map((section) => (
                <li key={section.id}>
                  <a 
                    href={`#${section.id}`} 
                    className={`hover:text-blue-400 transition-colors ${
                      currentSection === section.id ? 'text-blue-500 font-medium' : 'text-gray-300'
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Mobile Navigation */}
            <MobileNav currentSection={currentSection} />
          </div>
        </nav>
      </header>
      
      {/* Main Content - Scrollable Sections */}
      <main className="relative z-1">
        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center text-center px-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              {siteConfig.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              {siteConfig.description}
            </p>
            <a 
              href="#intro" 
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 rounded-full text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Begin the Journey
            </a>
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
                <div className="w-full md:w-1/2">
                  <div className="md:max-w-lg mx-auto">
                    <div className="flex items-center mb-6">
                      <div className="mr-4 text-blue-400">
                        {section.icon}
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                          {section.title}
                        </span>
                      </h2>
                    </div>
                    
                    {/* Enhanced futuristic content section */}
                    <div className="relative backdrop-blur-sm bg-blue-900/10 border border-blue-500/20 rounded-lg p-6 mt-4 mb-8 shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 rounded-lg pointer-events-none"></div>
                      <p className="text-xl text-blue-50 leading-relaxed tracking-wide relative z-10">
                        {section.content}
                      </p>
                      
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-blue-400/20 to-indigo-600/30 rounded-bl-3xl blur-md"></div>
                      <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 rounded-tr-3xl blur-sm"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md transition-colors shadow-lg shadow-blue-500/25 hover:shadow-blue-600/40">
                        Learn More
                      </button>
                      <button className="border border-blue-500 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30 px-6 py-2 rounded-md transition-colors">
                        Explore Features
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  {/* This div is intentionally empty - it creates space for the 3D model to be visible */}
                  <div className="aspect-square md:aspect-auto md:h-[500px]"></div>
                </div>
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