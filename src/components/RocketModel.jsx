'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { gsap } from 'gsap'
import { siteConfig } from '../config/siteConfig'

export default function RocketModel({ currentSection }) {
  const modelRef = useRef()
  const { scene, camera } = useThree()
  const [targetPosition, setTargetPosition] = useState([0, 0, 0])
  const [targetRotation, setTargetRotation] = useState([0, 0, 0])
  const model = useGLTF(siteConfig.rocketModel.path)
  
  // Clone the model to avoid modifying the original
  useEffect(() => {
    if (modelRef.current) {
      // Set initial position
      const defaultPos = siteConfig.rocketModel.defaultPosition
      modelRef.current.position.set(defaultPos[0], defaultPos[1], defaultPos[2])
      modelRef.current.rotation.set(0, 0, 0)
      
      // Add initial animation
      gsap.from(modelRef.current.position, {
        y: -10,
        duration: 2,
        ease: "power3.out"
      })
      
      gsap.from(modelRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2.5,
        ease: "power2.out"
      })
    }
  }, [])
  
  // Handle section changes with animations
  useEffect(() => {
    if (!modelRef.current) return
    
    // Get settings from config
    const sectionSettings = siteConfig.rocketModel.views
    
    // Get settings for current section (or use default if not found)
    const settings = sectionSettings[currentSection] || sectionSettings.intro
    
    // Animate to new position and rotation
    gsap.to(modelRef.current.position, {
      x: settings.position[0],
      y: settings.position[1],
      z: settings.position[2],
      duration: siteConfig.animations.sectionTransition,
      ease: "power3.inOut"
    })
    
    gsap.to(modelRef.current.rotation, {
      x: settings.rotation[0],
      y: settings.rotation[1],
      z: settings.rotation[2],
      duration: siteConfig.animations.sectionTransition,
      ease: "power2.inOut"
    })
    
    gsap.to(modelRef.current.scale, {
      x: settings.scale,
      y: settings.scale,
      z: settings.scale,
      duration: siteConfig.animations.sectionTransition,
      ease: "power2.inOut"
    })
    
    // Optional: Move camera to match the view
    if (settings.cameraPosition) {
      gsap.to(camera.position, {
        x: settings.cameraPosition[0],
        y: settings.cameraPosition[1],
        z: settings.cameraPosition[2],
        duration: siteConfig.animations.sectionTransition * 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(
            modelRef.current.position.x,
            modelRef.current.position.y,
            modelRef.current.position.z
          )
        }
      })
    }
    
  }, [currentSection, camera])
  
  // Add subtle floating animation
  useFrame((state, delta) => {
    if (!modelRef.current) return
    
    // Add subtle floating movement
    const time = state.clock.getElapsedTime()
    modelRef.current.position.y += Math.sin(time) * siteConfig.animations.floatingIntensity
    
    // Add subtle rotation
    modelRef.current.rotation.y += delta * siteConfig.animations.rocketRotationSpeed
  })
  
  // Handle parts visibility based on section
  useEffect(() => {
    if (!model.scene) return
    
    // Example: You can modify specific parts of the model here
    // based on the current section if your model has separable parts
    
    // For example (assuming your model has named objects):
    // model.scene.traverse((child) => {
    //   if (child.isMesh) {
    //     if (child.name === 'stage1' && currentSection === 'foundation') {
    //       child.visible = true
    //     } else if (child.name === 'stage2' && currentSection === 'supports') {
    //       child.visible = true
    //     }
    //   }
    // })
    
  }, [currentSection, model.scene])
  
  return (
    <primitive 
      ref={modelRef} 
      object={model.scene}
      scale={siteConfig.rocketModel.defaultScale}
      position={siteConfig.rocketModel.defaultPosition}
      castShadow
      receiveShadow
    />
  )
}

// Preload the model
useGLTF.preload('/rocket/scene.glb')