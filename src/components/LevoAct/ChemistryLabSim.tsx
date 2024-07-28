import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const ChemistryLabSim: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
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

    // Chemistry elements
    const elements = ['H', 'O', 'C', 'N', 'Na', 'Cl'];
    const elementMeshes: THREE.Mesh[] = [];

    elements.forEach((element, index) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        emissive: new THREE.Color(0.2, 0.2, 0.2),
        metalness: 0.3,
        roughness: 0.4,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((index % 3) * 2 - 2, Math.floor(index / 3) * 2 - 1, 0);
      mesh.userData.element = element;
      scene.add(mesh);
      elementMeshes.push(mesh);
    });

    // Beaker
    const beakerGeometry = new THREE.CylinderGeometry(1, 1, 3, 32, 1, true);
    const beakerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
    });
    const beaker = new THREE.Mesh(beakerGeometry, beakerMaterial);
    beaker.position.set(4, 0, 0);
    scene.add(beaker);

    // Liquid in beaker
    const liquidGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 32);
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2,
      metalness: 0,
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.set(4, -1.4, 0);
    scene.add(liquid);

    camera.position.z = 10;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      elementMeshes.forEach((mesh) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
      });
      composer.render();
    };

    animate();

    // Raycaster for element selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(elementMeshes);

      if (intersects.length > 0) {
        const element = intersects[0].object.userData.element;
        setSelectedElement(element);
      } else {
        setSelectedElement(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      {selectedElement && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
          Selected Element: {selectedElement}
        </div>
      )}
    </div>
  );
};

export default ChemistryLabSim;