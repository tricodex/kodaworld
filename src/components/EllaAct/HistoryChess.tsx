import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import * as CANNON from 'cannon-es';
import { gsap } from 'gsap';

interface ChessPiece {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  type: string;
  color: 'white' | 'black';
}

const HistoryChess: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece | null>(null);

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

    // Cannon.js world setup
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Chess board
    const boardGeometry = new THREE.BoxGeometry(8, 0.2, 8);
    const boardMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      metalness: 0.3,
      roughness: 0.8
    });
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    scene.add(boardMesh);

    const boardShape = new CANNON.Box(new CANNON.Vec3(4, 0.1, 4));
    const boardBody = new CANNON.Body({ mass: 0 });
    boardBody.addShape(boardShape);
    world.addBody(boardBody);

    // Chess pieces
    const pieces: ChessPiece[] = [];
    const loader = new GLTFLoader();

    const createPiece = (type: string, color: 'white' | 'black', position: THREE.Vector3) => {
      loader.load(`/placeholders/${color}_${type}.glb`, (gltf) => {
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        mesh.position.copy(position);
        scene.add(mesh);

        const shape = new CANNON.Sphere(0.25);
        const body = new CANNON.Body({ mass: 1 });
        body.addShape(shape);
        body.position.copy(position as unknown as CANNON.Vec3);
        world.addBody(body);

        const piece: ChessPiece = { mesh, body, type, color };
        pieces.push(piece);
      });
    };

    // Create chess pieces (simplified setup)
    for (let i = 0; i < 8; i++) {
      createPiece('pawn', 'white', new THREE.Vector3(i - 3.5, 0.5, 2.5));
      createPiece('pawn', 'black', new THREE.Vector3(i - 3.5, 0.5, -2.5));
    }

    const pieceTypes = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      createPiece(pieceTypes[i], 'white', new THREE.Vector3(i - 3.5, 0.5, 3.5));
      createPiece(pieceTypes[i], 'black', new THREE.Vector3(i - 3.5, 0.5, -3.5));
    }

    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    // Raycaster for piece selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pieces.map(piece => piece.mesh));

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        outlinePass.selectedObjects = [intersectedObject];
      } else {
        outlinePass.selectedObjects = [];
      }
    };

    const onMouseDown = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pieces.map(piece => piece.mesh));

      if (intersects.length > 0) {
        const selectedMesh = intersects[0].object as THREE.Mesh;
        const selectedPiece = pieces.find(piece => piece.mesh === selectedMesh);
        if (selectedPiece) {
          setSelectedPiece(selectedPiece);
          gsap.to(selectedPiece.mesh.position, {
            y: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    };

    const onMouseUp = () => {
      if (selectedPiece) {
        gsap.to(selectedPiece.mesh.position, {
          y: 0.5,
          duration: 0.3,
          ease: 'bounce.out'
        });
        setSelectedPiece(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      world.step(1 / 60);
      pieces.forEach(piece => {
        piece.mesh.position.copy(piece.body.position as unknown as THREE.Vector3);
        piece.mesh.quaternion.copy(piece.body.quaternion as unknown as THREE.Quaternion);
      });
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
        world.bodies.forEach(body => world.removeBody(body));
        scene.children.forEach(child => scene.remove(child));
      };
    }, [selectedPiece]);
  
    return (
      <div className="relative w-full h-screen">
        <div ref={containerRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
          History Chess
        </div>
        {selectedPiece && (
          <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded">
            Selected: {selectedPiece.color} {selectedPiece.type}
          </div>
        )}
      </div>
    );
  };
  
  export default HistoryChess;