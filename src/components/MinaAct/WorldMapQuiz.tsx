import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { gsap } from 'gsap';

interface Country {
  name: string;
  position: THREE.Vector3;
}

const WorldMapQuiz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

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
    const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outlinePass);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 15;

    // Earth
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/placeholders/earth_texture.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    // Countries
    const countries: Country[] = [
      { name: 'United States', position: new THREE.Vector3(-2, 2, 4) },
      { name: 'Brazil', position: new THREE.Vector3(1, -1, 4) },
      { name: 'Russia', position: new THREE.Vector3(4, 3, 1) },
      { name: 'China', position: new THREE.Vector3(4, 2, -2) },
      { name: 'Australia', position: new THREE.Vector3(4, -3, -2) },
      // Add more countries with their approximate positions on the globe
    ];

    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    countries.forEach(country => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(country.position);
      earthMesh.add(marker);
    });

    camera.position.set(0, 0, 15);

    // Particle system for stars
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Game logic
    const startNewRound = () => {
      const country = countries[Math.floor(Math.random() * countries.length)];
      setCurrentCountry(country);

      gsap.to(camera.position, {
        x: country.position.x * 1.5,
        y: country.position.y * 1.5,
        z: country.position.z * 1.5,
        duration: 2,
        ease: 'power2.inOut'
      });
    };

    startNewRound();

    // Raycaster for country selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(earthMesh.children);

      if (intersects.length > 0) {
        outlinePass.selectedObjects = [intersects[0].object];
      } else {
        outlinePass.selectedObjects = [];
      }
    };

    const onMouseDown = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(earthMesh.children);

      if (intersects.length > 0 && currentCountry) {
        const selectedMarker = intersects[0].object;
        const selectedCountry = countries.find(country => 
          country.position.equals(selectedMarker.position)
        );

        if (selectedCountry && selectedCountry.name === currentCountry.name) {
          setScore(prevScore => prevScore + 1);
          startNewRound();
        } else {
          gsap.to(earthMesh.rotation, {
            x: earthMesh.rotation.x + Math.PI / 4,
            y: earthMesh.rotation.y + Math.PI / 4,
            duration: 0.5,
            ease: 'power2.inOut'
          });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      earthMesh.rotation.y += 0.001;
      controls.update();
      composer.render();
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [currentCountry]);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
      {currentCountry && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded text-center">
          Find and click on: {currentCountry.name}
        </div>
      )}
    </div>
  );
};

export default WorldMapQuiz;