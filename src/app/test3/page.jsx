"use client"
import { lazy, Suspense } from 'react'
import { Canvas, } from '@react-three/fiber'

const ModelComponent = lazy(() => import("../../components/MyModel"));

export default function page({ ...props }) {
  return (
    <Suspense fallback={"loading"}>
      <Canvas
        camera={{ position: [1, 1, 1] }}
      >
        <ModelComponent />
        <color attach="background" args={["hotpink"]} />
      </Canvas>
    </Suspense>
  )
}