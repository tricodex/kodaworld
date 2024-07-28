import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const LANE_COUNT = 4;
const LANE_WIDTH = 2;
const NOTE_SPEED = 0.1;

interface Note {
  lane: number;
  mesh: THREE.Mesh;
  time: number;
}

const RhythmGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);
    // Set up post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Set up game objects
    const laneGroup = new THREE.Group();
    scene.add(laneGroup);

    const lanes: THREE.Mesh[] = [];
    for (let i = 0; i < LANE_COUNT; i++) {
      const laneGeometry = new THREE.PlaneGeometry(LANE_WIDTH, 100);
      const laneMaterial = new THREE.MeshPhongMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
      const lane = new THREE.Mesh(laneGeometry, laneMaterial);
      lane.rotation.x = -Math.PI / 2;
      lane.position.x = (i - (LANE_COUNT - 1) / 2) * LANE_WIDTH;
      lanes.push(lane);
      laneGroup.add(lane);
    }

    // Load 3D model for notes
    const loader = new GLTFLoader();
    let noteMesh: THREE.Object3D | null = null;
    loader.load('/path/to/your/3d/note/model.glb', (gltf) => {
      noteMesh = gltf.scene.children[0];
      noteMesh.scale.set(0.5, 0.5, 0.5);
    });

    const notes: Note[] = [];

    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);

    // Game logic
    const spawnNote = () => {
      if (!noteMesh) return;
      const lane = Math.floor(Math.random() * LANE_COUNT);
      const noteInstance = noteMesh.clone();
      noteInstance.position.set(
        (lane - (LANE_COUNT - 1) / 2) * LANE_WIDTH,
        0,
        -50
      );
      laneGroup.add(noteInstance);
      notes.push({ lane, mesh: noteInstance as THREE.Mesh, time: Date.now() });
    };

    const removeNote = (note: Note) => {
      laneGroup.remove(note.mesh);
      const index = notes.indexOf(note);
      if (index > -1) {
        notes.splice(index, 1);
      }
    };

    const hitNote = (lane: number) => {
      const hitZoneStart = -2;
      const hitZoneEnd = 2;
      const hitNote = notes.find(
        (note) => note.lane === lane && note.mesh.position.z >= hitZoneStart && note.mesh.position.z <= hitZoneEnd
      );

      if (hitNote) {
        removeNote(hitNote);
        setScore((prevScore) => prevScore + 100);
        setCombo((prevCombo) => prevCombo + 1);
        // Add visual feedback for hit
        // note.mesh.material.color.setHex(0x00ff00);
        // Play sound effect
      } else {
        setCombo(0);
        // Add visual feedback for miss
      }
    };

    // Keyboard event listener
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameStarted) return;
      const key = event.key.toLowerCase();
      const laneKeys = ['d', 'f', 'j', 'k'];
      const laneIndex = laneKeys.indexOf(key);
      if (laneIndex !== -1) {
        hitNote(laneIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Animation loop
    let lastNoteTime = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      if (gameStarted) {
        const currentTime = Date.now();
        if (currentTime - lastNoteTime > 1000) {
          spawnNote();
          lastNoteTime = currentTime;
        }

        notes.forEach((note) => {
          note.mesh.position.z += NOTE_SPEED;
          if (note.mesh.position.z > 5) {
            removeNote(note);
            setCombo(0);
          }
        });

        // Add some movement to the lanes
        lanes.forEach((lane, index) => {
          lane.position.y = Math.sin(Date.now() * 0.002 + index * 0.5) * 0.2;
        });

        // Rotate the entire lane group slightly based on mouse position
        const mouseX = (event as MouseEvent).clientX / window.innerWidth * 2 - 1;
        laneGroup.rotation.y = mouseX * 0.1;
      }

      composer.render();
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCombo(0);
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-0 left-0 p-4 text-white">
        <div>Score: {score}</div>
        <div>Combo: {combo}</div>
      </div>
      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <button
            className="px-6 py-3 text-2xl text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default RhythmGame;