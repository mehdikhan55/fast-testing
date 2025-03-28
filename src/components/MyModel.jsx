'use client'
import React from 'react'
import { useGLTF } from '@react-three/drei'

// /src/components/MyModel.jsx

export default function MyModel() {
  const model = useGLTF('/rocket/scene.glb')
  return (
     <primitive 
     object={model.scene} 
     scale={0.1} // Try different scale values
     position={[0, -6, 0]}
   />
  )
}