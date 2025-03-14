'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { siteConfig } from '../config/siteConfig'

// /src/components/RocketSeparation.jsx

// This component creates a separation animation between stages
export default function RocketSeparation({ currentSection, triggerSeparation }) {
  const separationRef = useRef()
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState([])
  
  // Create separation effect
  useEffect(() => {
    if (!separationRef.current) return
    if (!triggerSeparation) return
    
    // Only animate when explicitly triggered
    setIsAnimating(true)
    
    // Generate particles at separation point
    const newParticles = []
    
    // Determine separation point based on current section
    let separationY = 0
    if (currentSection === 'stage1') {
      separationY = -2
    } else if (currentSection === 'stage2') {
      separationY = 0
    }
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = {
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          separationY,
          (Math.random() - 0.5) * 0.5
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.03
        ),
        size: Math.random() * 0.05 + 0.02,
        life: 100
      }
      newParticles.push(particle)
    }
    
    setParticles(newParticles)
    
    // Create a small flash at separation point
    const flash = new THREE.PointLight(0xffaa00, 5, 2)
    flash.position.set(0, separationY, 0)
    separationRef.current.add(flash)
    
    // Animate flash
    gsap.to(flash, {
      intensity: 0,
      duration: 0.5,
      onComplete: () => {
        separationRef.current.remove(flash)
      }
    })
    
    // Reset animation state after a delay
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setParticles([])
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [currentSection, triggerSeparation])
  
  // Animate particles
  useFrame(() => {
    if (!isAnimating || particles.length === 0) return
    
    // Update particle mesh
    if (separationRef.current) {
      // Remove old particles
      separationRef.current.children = separationRef.current.children.filter(
        child => child.type !== 'Mesh' && child.type !== 'Points'
      )
      
      // Update particle positions
      particles.forEach((particle, i) => {
        // Update position
        particle.position.add(particle.velocity)
        
        // Slowly decrease life
        particle.life -= 1
        
        // Create mesh for particle
        if (particle.life > 0) {
          const geometry = new THREE.SphereGeometry(particle.size, 4, 4)
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(1, 0.6, 0.2),
            transparent: true,
            opacity: particle.life / 100
          })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.position.copy(particle.position)
          separationRef.current.add(mesh)
        }
      })
    }
  })
  
  return (
    <group ref={separationRef} />
  )
}