import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { gsap } from 'gsap';

interface PuzzlePiece {
  mesh: THREE.Mesh;
  correctPosition: THREE.Vector3;
}

const AncientCivilizationPuzzle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Puzzle pieces
    const puzzlePieces: PuzzlePiece[] = [];
    const loader = new GLTFLoader();

    // This is a placeholder. In a real scenario, you'd have actual 3D models for each piece.
    const pieceGeometry = new THREE.BoxGeometry(1, 1, 1);
    const pieceMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });

    for (let i = 0; i < 9; i++) {
      const mesh = new THREE.Mesh(pieceGeometry, pieceMaterial);
      const correctPosition = new THREE.Vector3(
        (i % 3) - 1,
        Math.floor(i / 3) - 1,
        0
      );
      mesh.position.set(
        Math.random() * 6 - 3,
        Math.random() * 6 - 3,
        Math.random() * 6 - 3
      );
      scene.add(mesh);
      puzzlePieces.push({ mesh, correctPosition });
    }

    // Background
    const textureLoader = new THREE.TextureLoader();
    const bgTexture = textureLoader.load('/placeholders/ancient_city.jpg');
    scene.background = bgTexture;

    camera.position.set(0, 0, 10);

    // Raycaster for piece selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedPiece: THREE.Mesh | null = null;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(puzzlePieces.map(piece => piece.mesh));

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        outlinePass.selectedObjects = [intersectedObject];
      } else {
        outlinePass.selectedObjects = [];
      }
    };

    const onMouseDown = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(puzzlePieces.map(piece => piece.mesh));

      if (intersects.length > 0) {
        controls.enabled = false;
        selectedPiece = intersects[0].object as THREE.Mesh;
      }
    };

    const onMouseUp = () => {
      controls.enabled = true;
      if (selectedPiece) {
        const puzzlePiece = puzzlePieces.find(piece => piece.mesh === selectedPiece);
        if (puzzlePiece) {
          if (puzzlePiece.mesh.position.distanceTo(puzzlePiece.correctPosition) < 0.5) {
            gsap.to(puzzlePiece.mesh.position, {
              x: puzzlePiece.correctPosition.x,
              y: puzzlePiece.correctPosition.y,
              z: puzzlePiece.correctPosition.z,
              duration: 0.5,
              onComplete: () => {
                setScore(prevScore => prevScore + 1);
                if (score + 1 === puzzlePieces.length) {
                  console.log("Puzzle completed!");
                }
              }
            });
          }
        }
        selectedPiece = null;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      composer.render();
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [score]);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Pieces Placed: {score} / 9
      </div>
    </div>
  );
};

export default AncientCivilizationPuzzle;