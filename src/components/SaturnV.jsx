import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function SaturnV({ ...props }) {
  const group = useRef();
  const gltf = useLoader(GLTFLoader, '/models/apollo_saturn_v/scene.gltf');
  
  return (
    <group ref={group} {...props}>
      <primitive object={gltf.scene} />
    </group>
  );
}