import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  element: string;
}

const elements = ['H', 'O', 'C', 'N', 'Na', 'Cl'];
const colors = {
  H: '#FFFFFF',
  O: '#FF0000',
  C: '#00FF00',
  N: '#0000FF',
  Na: '#FFA500',
  Cl: '#00FFFF',
};

const ChemistryLabSim: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      element: elements[Math.floor(Math.random() * elements.length)],
    }));
    setParticles(initialParticles);

    const animate = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          let { x, y, vx, vy } = particle;
          x += vx;
          y += vy;

          if (x < 0 || x > 100) vx = -vx;
          if (y < 0 || y > 100) vy = -vy;

          return { ...particle, x, y, vx, vy };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleParticleClick = (element: string) => {
    setSelectedElement(element);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (selectedElement) {
      setParticles((prevParticles) => [
        ...prevParticles,
        {
          id: Date.now(),
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          element: selectedElement,
        },
      ]);
      setSelectedElement(null);
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-100" ref={containerRef} onClick={handleContainerClick}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
          style={{
            backgroundColor: colors[particle.element as keyof typeof colors],
            x: `${particle.x}%`,
            y: `${particle.y}%`,
          }}
          animate={{ x: `${particle.x}%`, y: `${particle.y}%` }}
          transition={{ type: 'tween', duration: 0.1 }}
          onClick={() => handleParticleClick(particle.element)}
        >
          {particle.element}
        </motion.div>
      ))}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Chemistry Lab</h2>
        <p>Click on an element to select it, then click anywhere to add it to the simulation.</p>
        <div className="mt-2">
          {elements.map((element) => (
            <button
              key={element}
              className={`mr-2 mb-2 px-2 py-1 rounded ${
                selectedElement === element ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => setSelectedElement(element)}
            >
              {element}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChemistryLabSim;