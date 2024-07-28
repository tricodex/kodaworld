import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

interface ClimateZone {
  name: string;
  color: string;
  characteristics: string[];
}

const climateZones: ClimateZone[] = [
  { name: "Tropical", color: "#00FF00", characteristics: ["High temperatures", "Heavy rainfall", "Lush vegetation"] },
  { name: "Arid", color: "#FFFF00", characteristics: ["Low precipitation", "High evaporation", "Temperature extremes"] },
  { name: "Temperate", color: "#00FFFF", characteristics: ["Moderate temperatures", "Distinct seasons", "Variable precipitation"] },
  { name: "Continental", color: "#FF00FF", characteristics: ["Hot summers", "Cold winters", "Moderate precipitation"] },
  { name: "Polar", color: "#FFFFFF", characteristics: ["Extremely cold", "Low precipitation", "Permafrost"] },
];

const ClimateChallenge: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [currentZone, setCurrentZone] = useState<ClimateZone | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      wireframe: true,
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 15;

    const colorZones = () => {
      const colors = new Float32Array(geometry.attributes.position.count * 3);
      const positions = geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        const y = positions[i + 1];
        let color;

        if (y > 4) color = new THREE.Color(climateZones[4].color);
        else if (y > 2) color = new THREE.Color(climateZones[3].color);
        else if (y > 0) color = new THREE.Color(climateZones[2].color);
        else if (y > -2) color = new THREE.Color(climateZones[1].color);
        else color = new THREE.Color(climateZones[0].color);

        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    };

    colorZones();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  const startNewRound = () => {
    const newZone = climateZones[Math.floor(Math.random() * climateZones.length)];
    setCurrentZone(newZone);
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const handleAnswer = (characteristic: string) => {
    if (currentZone && currentZone.characteristics.includes(characteristic)) {
      setScore(prevScore => prevScore + 1);
      gsap.to(containerRef.current, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          gsap.to(containerRef.current, { duration: 0.5, opacity: 1 });
          startNewRound();
        }
      });
    } else {
      gsap.to(containerRef.current, {
        duration: 0.1,
        x: -10,
        yoyo: true,
        repeat: 5
      });
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
      {currentZone && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded">
          <p className="text-center mb-2">Select a characteristic of the {currentZone.name} climate zone:</p>
          <div className="grid grid-cols-2 gap-2">
            {climateZones.flatMap(zone => zone.characteristics).sort(() => Math.random() - 0.5).slice(0, 4).map((characteristic, index) => (
              <button
                key={index}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleAnswer(characteristic)}
              >
                {characteristic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateChallenge;