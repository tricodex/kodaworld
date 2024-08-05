'use client';

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Slider } from "../ui/slider";
import * as THREE from 'three';

interface ParticlesProps {
  count: number;
  speed: number;
  size: number;
  color: THREE.Color;
}

function Particles({ count, speed, size, color }: ParticlesProps) {
  const points = useRef<THREE.Points>(null) as React.MutableRefObject<THREE.Points>;
  const mousePosition = useRef([0, 0]);
  const { viewport } = useThree();
  

  const [positions, velocities, originalPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = originalPositions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = originalPositions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = originalPositions[i3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return [positions, velocities, originalPositions];
  }, [count]);

  useFrame(() => {
    if (points.current) {
      const positionsArray = points.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Move particles away from mouse
        const dx = positionsArray[i3] - mousePosition.current[0];
        const dy = positionsArray[i3 + 1] - mousePosition.current[1];
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 1) {
          positionsArray[i3] += dx * 0.1;
          positionsArray[i3 + 1] += dy * 0.1;
        }

        // Regular movement
        positionsArray[i3] += velocities[i3] * speed;
        positionsArray[i3 + 1] += velocities[i3 + 1] * speed;
        positionsArray[i3 + 2] += velocities[i3 + 2] * speed;

        // Boundary check
        for (let j = 0; j < 3; j++) {
          if (Math.abs(positionsArray[i3 + j]) > 5) {
            velocities[i3 + j] *= -1;
            positionsArray[i3 + j] = Math.sign(positionsArray[i3 + j]) * 5;
          }
        }
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const handlePointerMove = useCallback((event: ThreeEvent<PointerEvent>) => {
    const target = event.target as HTMLCanvasElement | null;
    if (target) {
      mousePosition.current = [
        (event.offsetX / target.clientWidth) * 2 - 1,
        -(event.offsetY / target.clientHeight) * 2 + 1,
      ];
    }
  }, []);
  

  const handleClick = useCallback(() => {
    if (points.current) {
      const positionsArray = points.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count * 3; i++) {
        positionsArray[i] = originalPositions[i] + (Math.random() - 0.5) * 2;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [count, originalPositions]);

  return (
    <points ref={points} onPointerMove={handlePointerMove} onClick={handleClick}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} />
    </points>
  );
}

export default function ParticleGame() {
  const [particleCount, setParticleCount] = useState(1000);
  const [speed, setSpeed] = useState(1);
  const [size, setSize] = useState(0.1);
  const [hue, setHue] = useState(120); // Green hue

  const color = useMemo(() => new THREE.Color(`hsl(${hue}, 100%, 50%)`), [hue]);

  return (
    <div className="w-full h-screen relative bg-gray-900">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight />
        <Particles count={particleCount} speed={speed} size={size} color={color} />
        <OrbitControls />
      </Canvas>
      <div className="absolute top-4 left-4 w-64 flex flex-col space-y-4 bg-white bg-opacity-20 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-white">
            Particle Count: {particleCount}
          </label>
          <Slider
            value={[particleCount]}
            onValueChange={(value: number[]) => setParticleCount(value[0])}
            min={100}
            max={5000}
            step={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
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
        <div>
          <label className="block text-sm font-medium text-white">
            Size: {size.toFixed(2)}
          </label>
          <Slider
            value={[size]}
            onValueChange={(value: number[]) => setSize(value[0])}
            min={0.01}
            max={0.5}
            step={0.01}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Color Hue: {hue}
          </label>
          <Slider
            value={[hue]}
            onValueChange={(value: number[]) => setHue(value[0])}
            min={0}
            max={360}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
