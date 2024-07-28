import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';

interface HistoricalEvent {
  year: number;
  event: string;
}

const HistoricalTimelineGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<HistoricalEvent | null>(null);

  const historicalEvents: HistoricalEvent[] = useMemo(() => [
    { year: 1776, event: "American Declaration of Independence" },
    { year: 1789, event: "French Revolution begins" },
    { year: 1969, event: "First moon landing" },
    // Add more historical events here
  ], []);

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

    // Timeline
    const timelineGeometry = new THREE.BoxGeometry(20, 0.1, 0.1);
    const timelineMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
    scene.add(timeline);

    // Event markers
    const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    historicalEvents.forEach((event, index) => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set((index / (historicalEvents.length - 1)) * 20 - 10, 0, 0);
      scene.add(marker);
    });

    // Text
    const loader = new FontLoader();
    loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('Historical Timeline', {
        font: font,
        size: 0.5,
        height: 0.1,
      });
      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-5, 2, 0);
      scene.add(textMesh);
    });

    camera.position.set(0, 5, 15);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      composer.render();
    };

    animate();

    // Game logic
    const startNewRound = () => {
      const event = historicalEvents[Math.floor(Math.random() * historicalEvents.length)];
      setCurrentEvent(event);
    };

    startNewRound();

    // Clean up
    return () => {
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [historicalEvents]);

  const handleGuess = (guess: number) => {
    if (currentEvent) {
      const difference = Math.abs(guess - currentEvent.year);
      const points = Math.max(100 - difference, 0);
      setScore(prevScore => prevScore + points);
      // Animate the camera to focus on the correct marker
      // This is a placeholder for the animation logic
      console.log(`Focused on year ${currentEvent.year}`);
      // Start a new round
      const event = historicalEvents[Math.floor(Math.random() * historicalEvents.length)];
      setCurrentEvent(event);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
      {currentEvent && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded">
          <p>Event: {currentEvent.event}</p>
          <input 
            type="number" 
            placeholder="Enter the year"
            className="w-full p-2 mt-2"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleGuess(parseInt((e.target as HTMLInputElement).value));
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HistoricalTimelineGame;