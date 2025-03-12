import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import SaturnV from './SaturnV';

export default function Scene() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} />
          <SaturnV position={[0, -2, 0]} scale={0.5} />
          <OrbitControls />
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  );
}