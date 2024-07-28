import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Note {
  pitch: number;
  time: number;
  duration: number;
  mesh: THREE.Mesh;
}

const ComposeMelody: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

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
    controls.dampingFactor = 0.05;

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create piano keys
    const keyGroup = new THREE.Group();
    scene.add(keyGroup);

    const whiteKeyGeometry = new THREE.BoxGeometry(1, 0.5, 4);
    const blackKeyGeometry = new THREE.BoxGeometry(0.6, 0.8, 3);
    const whiteKeyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const blackKeyMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const keys: THREE.Mesh[] = [];
    const keyPattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
    for (let i = 0; i < 24; i++) {
      const isBlack = keyPattern[i % 12] === 1;
      const key = new THREE.Mesh(
        isBlack ? blackKeyGeometry : whiteKeyGeometry,
        isBlack ? blackKeyMaterial : whiteKeyMaterial
      );
      key.position.x = i * 0.7 - 8;
      key.position.y = isBlack ? 0.25 : 0;
      key.position.z = isBlack ? -0.5 : 0;
      keys.push(key);
      keyGroup.add(key);
    }

    camera.position.set(0, 5, 10);
    controls.update();

    // Note creation
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const addNote = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(keys);
      if (intersects.length > 0) {
        const key = intersects[0].object as THREE.Mesh;
        const pitch = keys.indexOf(key);
        const time = Date.now();

        const noteGeometry = new THREE.SphereGeometry(0.2);
        const noteMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const noteMesh = new THREE.Mesh(noteGeometry, noteMaterial);
        noteMesh.position.copy(key.position);
        noteMesh.position.y += 1;
        scene.add(noteMesh);

        setNotes(prevNotes => [...prevNotes, { pitch, time, duration: 0.5, mesh: noteMesh }]);
      }
    };

    window.addEventListener('click', addNote);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      if (isPlaying) {
        const currentTime = Date.now();
        notes.forEach(note => {
          const elapsedTime = (currentTime - note.time) / 1000;
          if (elapsedTime < note.duration) {
            note.mesh.position.y = keys[note.pitch].position.y + 1 + Math.sin(elapsedTime * Math.PI / note.duration) * 0.5;
          } else {
            note.mesh.position.y = keys[note.pitch].position.y + 1;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', addNote);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [isPlaying, notes]);

  const playMelody = () => {
    setIsPlaying(true);
    // Here you would add logic to play the actual sounds
    setTimeout(() => setIsPlaying(false), 5000); // Stop after 5 seconds
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 p-4 bg-black bg-opacity-50 text-white">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={playMelody}
        >
          {isPlaying ? 'Playing...' : 'Play Melody'}
        </button>
      </div>
    </div>
  );
};

export default ComposeMelody;