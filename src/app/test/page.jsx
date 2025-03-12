"use client"
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);
      camera.position.z = 5;
      
      // Create cube
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      
      // Render the scene initially
      renderer.render(scene, camera);
      
      // Animation function
      const renderScene = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };
      
      // Start animation loop
      renderScene();
      
      // Cleanup function
      return () => {
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
      };
    }
  }, []);
  
  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ThreeScene;