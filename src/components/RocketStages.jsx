'use client'
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { PointMaterial, Points } from '@react-three/drei'
import * as THREE from 'three'
import { siteConfig } from '../config/siteConfig'

// This component creates visual elements to highlight different rocket stages
export default function RocketStages({ currentSection }) {
  const stagesRef = useRef()
  const particlesRef = useRef()
  const engineGlowRef = useRef()
  const starsRef = useRef()
  
  // Create highlight effects for each stage
  useEffect(() => {
    if (!stagesRef.current) return
    
    // Reset all highlights
    stagesRef.current.clear()
    
    // Get highlight config for current section
    const viewConfig = siteConfig.rocketModel.views[currentSection]
    
    // Create highlight based on current section
    if (viewConfig && viewConfig.highlight) {
      const highlight = viewConfig.highlight
      const color = new THREE.Color(highlight.color)
      
      // Create point light based on config
      const glow = new THREE.PointLight(
        color, 
        highlight.intensity, 
        highlight.distance
      )
      
      glow.position.set(
        highlight.position[0],
        highlight.position[1],
        highlight.position[2]
      )
      
      // Add animation to glow intensity
      gsap.from(glow, {
        intensity: 0,
        duration: 1.5,
        ease: "power2.out"
      })
      
      engineGlowRef.current = glow
      stagesRef.current.add(glow)
      
      // Add particles for the first stage (rocket engine)
      if (currentSection === 'foundation') {
        createExhaustParticles(highlight.position[1])
      }
      
      // Add additional effects for specific stages
      if (currentSection === 'fuel') {
        createEnergyField(highlight.position[1])
      }
      
      if (currentSection === 'guidance') {
        createGuidanceBeams(highlight.position)
      }
      
      if (currentSection === 'vehicle') {
        createLaunchEffects(highlight.position)
      }
    }
    
    // Always ensure stars are visible
    createStarfield()
    
  }, [currentSection])
  
  // Create particle system for rocket exhaust
  const createExhaustParticles = (yPosition) => {
    if (!particlesRef.current) {
      // Generate random particles for exhaust
      const particleCount = 1000
      const positions = new Float32Array(particleCount * 3)
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 0.2
        positions[i3 + 1] = (Math.random() - 0.5) * 5 - 2 // Extend below the rocket
        positions[i3 + 2] = (Math.random() - 0.5) * 0.2
      }
      
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      
      const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x55aaff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })
      
      const particles = new THREE.Points(geometry, material)
      particles.position.y = yPosition
      
      // Animate particles appearance
      gsap.from(material, {
        opacity: 0,
        duration: 2,
        ease: "power2.out"
      })
      
      particlesRef.current = particles
      stagesRef.current.add(particles)
    }
  }
  
  // Create energy field for fuel section
  const createEnergyField = (yPosition) => {
    // Create a sphere geometry for the energy field
    const geometry = new THREE.SphereGeometry(0.8, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0x66aaff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    })
    
    const energySphere = new THREE.Mesh(geometry, material)
    energySphere.position.y = yPosition
    
    // Animate energy field appearance
    gsap.from(energySphere.scale, {
      x: 0.1,
      y: 0.1,
      z: 0.1,
      duration: 2,
      ease: "elastic.out(1, 0.5)"
    })
    
    gsap.from(material, {
      opacity: 0,
      duration: 1.5,
      ease: "power2.out"
    })
    
    stagesRef.current.add(energySphere)
  }
  
  // Create guidance beams for guidance section
  const createGuidanceBeams = (position) => {
    const beamGroup = new THREE.Group()
    beamGroup.position.set(position[0], position[1], position[2])
    
    // Create several beams
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2
      const radius = 1.2
      
      const beamGeometry = new THREE.CylinderGeometry(0.02, 0.02, 5, 8)
      const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.5
      })
      
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      beam.position.x = Math.sin(angle) * radius
      beam.position.z = Math.cos(angle) * radius
      beam.rotation.x = Math.PI / 2
      
      // Animate beams
      gsap.from(beam.scale, {
        y: 0,
        duration: 1.5,
        delay: i * 0.2,
        ease: "power3.out"
      })
      
      beamGroup.add(beam)
    }
    
    stagesRef.current.add(beamGroup)
  }
  
  // Create launch effects for vehicle section
  const createLaunchEffects = (position) => {
    // Add launch platform
    const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16)
    const platformMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.7
    })
    
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    platform.position.set(position[0], position[1] - 2, position[2])
    
    // Add light beams from platform
    const beamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa55,
      transparent: true,
      opacity: 0.3
    })
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const beamGeometry = new THREE.ConeGeometry(0.5, 3, 8)
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      
      beam.position.set(
        platform.position.x + Math.sin(angle) * 1.2,
        platform.position.y + 1.5,
        platform.position.z + Math.cos(angle) * 1.2
      )
      
      beam.rotation.x = Math.PI
      
      stagesRef.current.add(beam)
    }
    
    stagesRef.current.add(platform)
  }
  
  // Create starfield background
  const createStarfield = () => {
    if (!starsRef.current) {
      // Generate random star positions
      const starCount = 2000
      const positions = new Float32Array(starCount * 3)
      
      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 100
        positions[i3 + 1] = (Math.random() - 0.5) * 100
        positions[i3 + 2] = (Math.random() - 0.5) * 100
      }
      
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      
      const materials = [
        new THREE.PointsMaterial({
          size: 0.1,
          color: 0xffffff,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        }),
        new THREE.PointsMaterial({
          size: 0.05,
          color: 0xaaaaff,
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending
        })
      ]
      
      // Create two star layers for parallax effect
      const stars1 = new THREE.Points(geometry, materials[0])
      const stars2 = new THREE.Points(geometry.clone(), materials[1])
      
      // Scale the second layer differently
      stars2.scale.set(1.5, 1.5, 1.5)
      
      starsRef.current = new THREE.Group()
      starsRef.current.add(stars1)
      starsRef.current.add(stars2)
      stagesRef.current.add(starsRef.current)
    }
  }
  
  // Animate particles and lights
  useFrame((state, delta) => {
    if (engineGlowRef.current) {
      // Make the engine glow flicker
      engineGlowRef.current.intensity = 
        engineGlowRef.current.intensity + 
        Math.sin(state.clock.getElapsedTime() * 10) * 0.5 * delta;
    }
    
    if (particlesRef.current && currentSection === 'foundation') {
      // Animate exhaust particles
      const positions = particlesRef.current.geometry.attributes.position.array
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles down
        positions[i + 1] -= siteConfig.animations.particleSpeed * (Math.random() + 0.5)
        
        // Reset particles that go too far down
        if (positions[i + 1] < -7) {
          positions[i + 1] = -2
          positions[i] = (Math.random() - 0.5) * 0.2
          positions[i + 2] = (Math.random() - 0.5) * 0.2
        }
        
        // Add some randomness to movement
        positions[i] += (Math.random() - 0.5) * 0.01
        positions[i + 2] += (Math.random() - 0.5) * 0.01
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
    
    // Animate starfield for parallax effect
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * siteConfig.animations.starRotationSpeed * 0.1
      starsRef.current.rotation.x += delta * siteConfig.animations.starRotationSpeed * 0.05
    }
  })
  
  return (
    <group ref={stagesRef}>
      {/* The stages visual elements will be added dynamically */}
    </group>
  )
}