import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import * as CANNON from 'cannon-es';

interface GameObject {
  mesh: THREE.Mesh;
  body: CANNON.Body;
}

const PhysicsPuzzle: React.FC = () => {
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

    // Cannon.js world setup
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    // Create ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(groundBody);

    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    scene.add(groundMesh);

    // Create objects
    const objects: GameObject[] = [];
    const objectCount = 10;

    for (let i = 0; i < objectCount; i++) {
      const radius = Math.random() * 0.3 + 0.1;
      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(Math.random() * 10 - 5, 5 + i * 0.5, Math.random() * 10 - 5),
      });
      world.addBody(body);

      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        emissive: new THREE.Color(0.2, 0.2, 0.2),
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      objects.push({ mesh, body });
    }

    // Create target
    const targetGeometry = new THREE.BoxGeometry(1, 1, 1);
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x330000 });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    targetMesh.position.set(0, 0.5, 0);
    scene.add(targetMesh);

    camera.position.set(0, 5, 15);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      world.step(1 / 60);

      objects.forEach((object) => {
        object.mesh.position.copy(object.body.position as unknown as THREE.Vector3);
        object.mesh.quaternion.copy(object.body.quaternion as unknown as THREE.Quaternion);

        // Check for collision with target
        if (object.mesh.position.distanceTo(targetMesh.position) < 1) {
          setScore((prevScore) => prevScore + 1);
          // Reset object position
          object.body.position.set(Math.random() * 10 - 5, 5, Math.random() * 10 - 5);
          object.body.velocity.set(0, 0, 0);
        }
      });

      controls.update();
      composer.render();
    };

    animate();

    // Raycaster for object interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objects.map((obj) => obj.mesh));

      if (intersects.length > 0) {
        const object = objects.find((obj) => obj.mesh === intersects[0].object);
        if (object) {
          const impulse = new CANNON.Vec3(0, 5, -5);
          object.body.applyImpulse(impulse);
        }
      }
    };

    window.addEventListener('mousedown', onMouseDown);

    // Clean up
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
    </div>
  );
};

export default PhysicsPuzzle;