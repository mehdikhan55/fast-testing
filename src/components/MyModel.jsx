'use client'
import React from 'react'
import { useGLTF } from '@react-three/drei'
// import rocketModel from "../assets/death_earth/scene.gltf"

export default function MyModel() {
  const model = useGLTF('/rocket/scene.glb')
  return (
     <primitive 
     object={model.scene} 
     scale={0.5} // Try different scale values
     position={[0, -25, 0]}
   />
  )
}