'use client';

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Slider } from "../ui/slider"

interface ParticlesProps {
  count: number;
  speed: number;
}

function Particles({ count, speed }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null)
  const [positions, setPositions] = useState(() => new Float32Array(count * 3))
  const [velocities] = useState(() => new Float32Array(count * 3))

  useMemo(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
  }, [count, positions, velocities])

  useFrame(() => {
    if (mesh.current) {
      const positionsArray = mesh.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positionsArray[i * 3] += velocities[i * 3] * speed
        positionsArray[i * 3 + 1] += velocities[i * 3 + 1] * speed
        positionsArray[i * 3 + 2] += velocities[i * 3 + 2] * speed

        if (Math.abs(positionsArray[i * 3]) > 5) velocities[i * 3] *= -1
        if (Math.abs(positionsArray[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1
        if (Math.abs(positionsArray[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1
      }
      mesh.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00ff00" />
    </points>
  )
}

export default function ParticleGame() {
  const [particleCount, setParticleCount] = useState(150)
  const [speed, setSpeed] = useState(1)

  return (
    <div className="w-full h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight />
        <Particles count={particleCount} speed={speed} />
        <OrbitControls />
      </Canvas>
      <div className="absolute bottom-4 left-4 right-4 flex flex-col space-y-4 bg-white bg-opacity-70 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Particle Count: {particleCount}
          </label>
          <Slider
            value={[particleCount]}
            onValueChange={(value: number[]) => setParticleCount(value[0])}
            min={50}
            max={250}
            step={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Speed: {speed.toFixed(2)}
          </label>
          <Slider
            value={[speed]}
            onValueChange={(value: number[]) => setSpeed(value[0])}
            min={0}
            max={5}
            step={0.1}
          />
        </div>
      </div>
    </div>
  )
}