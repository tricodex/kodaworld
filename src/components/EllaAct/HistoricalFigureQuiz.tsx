import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';

interface HistoricalFigure {
  name: string;
  imageUrl: string;
  facts: string[];
}

const HistoricalFigureQuiz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [currentFigure, setCurrentFigure] = useState<HistoricalFigure | null>(null);
  const [options, setOptions] = useState<string[]>([]);

  const historicalFigures = useMemo<HistoricalFigure[]>(() => [
    {
      name: "Napoleon Bonaparte",
      imageUrl: "/placeholders/napoleon.jpg",
      facts: ["French military leader", "Emperor of France", "Fought in the Napoleonic Wars"]
    },
    {
      name: "Cleopatra",
      imageUrl: "/placeholders/cleopatra.jpg",
      facts: ["Last active ruler of the Ptolemaic Kingdom of Egypt", "Aligned with Julius Caesar", "Known for her intelligence and beauty"]
    },
    // Add more historical figures
  ], []);

  const startNewRound = useCallback(() => {
    const figure = historicalFigures[Math.floor(Math.random() * historicalFigures.length)];
    setCurrentFigure(figure);
    const incorrectOptions = historicalFigures
      .filter(f => f.name !== figure.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(f => f.name);
    setOptions([figure.name, ...incorrectOptions].sort(() => 0.5 - Math.random()));
  }, [historicalFigures]);

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

    // Create a rotating gallery of historical figures
    const textureLoader = new THREE.TextureLoader();
    const figureGroup = new THREE.Group();
    scene.add(figureGroup);

    historicalFigures.forEach((figure, index) => {
      const texture = textureLoader.load(figure.imageUrl);
      const geometry = new THREE.PlaneGeometry(2, 3);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(
        Math.cos(index / historicalFigures.length * Math.PI * 2) * 5,
        0,
        Math.sin(index / historicalFigures.length * Math.PI * 2) * 5
      );
      plane.lookAt(0, 0, 0);
      figureGroup.add(plane);
    });

    camera.position.set(0, 0, 10);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      figureGroup.rotation.y += 0.001;
      composer.render();
    };

    animate();

    startNewRound();

    // Clean up
    return () => {
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [historicalFigures, startNewRound]);

  const handleGuess = useCallback((guess: string) => {
    if (currentFigure && guess === currentFigure.name) {
      setScore(prevScore => prevScore + 1);
      gsap.to(containerRef.current, {
        duration: 0.5,
        opacity: 0,
        onComplete: () => {
          gsap.to(containerRef.current, {
            duration: 0.5,
            opacity: 1
          });
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
  }, [currentFigure, startNewRound]);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
      {currentFigure && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded">
          <p className="mb-2">Who is this historical figure?</p>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleGuess(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalFigureQuiz;