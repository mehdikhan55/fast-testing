'use client'
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// This optimized star field uses Three.js directly for better performance
// It will be added to the Canvas, not as a regular React component
const StarField = () => {
  const starsRef = useRef()
  const groupRef = useRef()
  
  // Create stars on mount
  useEffect(() => {
    if (!starsRef.current) {
      // Generate random star positions
      const starCount = 2000
      const positions = new Float32Array(starCount * 3)
      const sizes = new Float32Array(starCount)
      const colors = new Float32Array(starCount * 3)
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3
        // Position stars in a sphere around the camera
        const radius = 50 + Math.random() * 50
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        positions[i3 + 2] = radius * Math.cos(phi)
        
        // Random sizes
        sizes[i] = Math.random() * 2 + 0.5
        
        // Colors (mostly white with some blue tint)
        colors[i3] = 0.8 + Math.random() * 0.2       // R
        colors[i3 + 1] = 0.8 + Math.random() * 0.2   // G
        colors[i3 + 2] = 0.9 + Math.random() * 0.1   // B (more blue)
      }
      
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      const starsMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      })
      
      starsRef.current = new THREE.Points(geometry, starsMaterial)
      
      // Create second layer for parallax effect
      const farStarCount = 1000
      const farPositions = new Float32Array(farStarCount * 3)
      const farSizes = new Float32Array(farStarCount)
      const farColors = new Float32Array(farStarCount * 3)
      
      for (let i = 0; i < farStarCount; i++) {
        const i3 = i * 3
        const radius = 100 + Math.random() * 100
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        
        farPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
        farPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        farPositions[i3 + 2] = radius * Math.cos(phi)
        
        farSizes[i] = Math.random() * 1.5 + 0.3
        
        farColors[i3] = 0.7 + Math.random() * 0.3
        farColors[i3 + 1] = 0.7 + Math.random() * 0.3
        farColors[i3 + 2] = 0.8 + Math.random() * 0.2
      }
      
      const farGeometry = new THREE.BufferGeometry()
      farGeometry.setAttribute('position', new THREE.BufferAttribute(farPositions, 3))
      farGeometry.setAttribute('size', new THREE.BufferAttribute(farSizes, 1))
      farGeometry.setAttribute('color', new THREE.BufferAttribute(farColors, 3))
      
      const farStarsMaterial = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      })
      
      const farStars = new THREE.Points(farGeometry, farStarsMaterial)
      
      // Create group to hold both star layers
      groupRef.current = new THREE.Group()
      groupRef.current.add(starsRef.current)
      groupRef.current.add(farStars)
    }
  }, [])
  
  // Animate stars using useFrame - this will run in the animation loop
  // and will not be affected by scrolling
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate the entire star field for a subtle parallax effect
      groupRef.current.rotation.y += delta * 0.01
      groupRef.current.rotation.x += delta * 0.005
      
      // Pulse the stars by adjusting their size
      if (starsRef.current && starsRef.current.material) {
        starsRef.current.material.size = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      }
    }
  })
  
  return (
    <primitive object={groupRef.current || new THREE.Group()} />
  )
}

export default StarField