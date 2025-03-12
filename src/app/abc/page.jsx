"use client"
import React from 'react'
import { lazy, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import dynamic from 'next/dynamic'

// Lazy load the model component
const ModelComponent = dynamic(() => import('../../components/MyModel'), { ssr: false });

// Fallback component for when the 3D content is loading
const LoadingFallback = () => (
  <div style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'gray'
  }}>
    Loading 3D model...
  </div>
);

const page = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
           camera={{ position: [1, 1, 1], fov: 50 }}
           style={{ width: '100vw', height: '100vh' }}
           gl={{ 
             powerPreference: "high-performance",
             antialias: false, // Disable antialiasing for better performance
             alpha: false // Disable alpha channel
           }}
           dpr={[1, 1.5]} 
          >
            <color attach="background" args={["gray"]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            
            {/* The model component */}
            <ModelComponent />
            
            {/* Add orbit controls for better user interaction */}
            <OrbitControls />
            
            {/* Add environment lighting for better visuals */}
            <Environment preset="sunset" />
          </Canvas>
        </Suspense>
      )
}

export default page
