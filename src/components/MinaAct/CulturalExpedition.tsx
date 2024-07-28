import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';

interface Culture {
  name: string;
  landmarks: string[];
  traditions: string[];
  cuisine: string[];
}

const cultures: Culture[] = [
  {
    name: "Japan",
    landmarks: ["Mount Fuji", "Tokyo Tower", "Fushimi Inari Shrine"],
    traditions: ["Tea Ceremony", "Hanami", "Sumo Wrestling"],
    cuisine: ["Sushi", "Ramen", "Tempura"]
  },
  {
    name: "India",
    landmarks: ["Taj Mahal", "Gateway of India", "Golden Temple"],
    traditions: ["Diwali", "Holi", "Yoga"],
    cuisine: ["Curry", "Biryani", "Dosa"]
  },
  // Add more cultures here
];

const CulturalExpedition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentCulture, setCurrentCulture] = useState<Culture | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Create a globe
    const globeGeometry = new THREE.SphereGeometry(5, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('/placeholders/world_texture.jpg'),
      bumpMap: new THREE.TextureLoader().load('/placeholders/world_bump.jpg'),
      bumpScale: 0.05,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add cultural landmarks as points on the globe
    const landmarkGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const landmarkMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });

    cultures.forEach((culture) => {
      culture.landmarks.forEach((landmark) => {
        const landmarkMesh = new THREE.Mesh(landmarkGeometry, landmarkMaterial);
        const phi = Math.random() * Math.PI;
        const theta = Math.random() * Math.PI * 2;
        landmarkMesh.position.setFromSphericalCoords(5, phi, theta);
        globe.add(landmarkMesh);
      });
    });

    camera.position.z = 15;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      globe.rotation.y += 0.001;
      composer.render();
    };

    animate();

    // Game logic
    const startNewRound = () => {
      const newCulture = cultures[Math.floor(Math.random() * cultures.length)];
      setCurrentCulture(newCulture);

      // Animate camera to focus on a random landmark of the new culture
      const landmark = globe.children[Math.floor(Math.random() * globe.children.length)];
      gsap.to(camera.position, {
        x: landmark.getWorldPosition(new THREE.Vector3()).x * 1.5,
        y: landmark.getWorldPosition(new THREE.Vector3()).y * 1.5,
        z: landmark.getWorldPosition(new THREE.Vector3()).z * 1.5,
        duration: 2,
        ease: 'power2.inOut'
      });
    };

    startNewRound();

    // Clean up
    return () => {
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleAnswer = (answer: string) => {
    if (currentCulture) {
      if (
        currentCulture.landmarks.includes(answer) ||
        currentCulture.traditions.includes(answer) ||
        currentCulture.cuisine.includes(answer)
      ) {
        setScore((prevScore) => prevScore + 1);
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
    }
  };

  const startNewRound = () => {
    const newCulture = cultures[Math.floor(Math.random() * cultures.length)];
    setCurrentCulture(newCulture);
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
      {currentCulture && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded">
          <p className="text-center mb-2">Name a landmark, tradition, or cuisine from {currentCulture.name}:</p>
          <input
            type="text"
            className="w-full p-2 rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAnswer((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CulturalExpedition;