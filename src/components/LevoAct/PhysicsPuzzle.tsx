import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import * as CANNON from 'cannon-es';

interface GameObject {
  mesh: THREE.Mesh;
  body: CANNON.Body;
  question: string;
  answer: string;
}

const PhysicsPuzzle: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

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

    const questions = [
      { q: "What planet is known as the Red Planet?", a: "Mars" },
      { q: "What is the force that pulls objects towards the Earth?", a: "Gravity" },
      { q: "What is 3 x 4?", a: "12" },
      { q: "What is the closest star to Earth?", a: "Sun" },
      { q: "What is the chemical symbol for water?", a: "H2O" },
      { q: "How many planets are in our solar system?", a: "8" },
      { q: "What is 15 + 7?", a: "22" },
      { q: "What is the largest planet in our solar system?", a: "Jupiter" },
    ];

    const newObjects: GameObject[] = [];

    for (let i = 0; i < questions.length; i++) {
      const radius = 0.5;
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

      newObjects.push({ mesh, body, question: questions[i].q, answer: questions[i].a });
    }

    setObjects(newObjects);

    const targetGeometry = new THREE.BoxGeometry(4, 0.1, 4);
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, emissive: 0x003300 });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    targetMesh.position.set(0, 0.05, 0);
    scene.add(targetMesh);

    camera.position.set(0, 10, 15);

    const animate = () => {
      requestAnimationFrame(animate);
      world.step(1 / 60);

      newObjects.forEach((object) => {
        object.mesh.position.copy(object.body.position as unknown as THREE.Vector3);
        object.mesh.quaternion.copy(object.body.quaternion as unknown as THREE.Quaternion);

        if (object.mesh.position.distanceTo(targetMesh.position) < 2 && object.mesh.position.y < 0.5) {
          setCurrentQuestion(object.question);
          object.body.position.set(Math.random() * 10 - 5, 5, Math.random() * 10 - 5);
          object.body.velocity.set(0, 0, 0);
        }
      });

      controls.update();
      composer.render();
    };

    animate();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current!.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current!.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(newObjects.map((obj) => obj.mesh));

      if (intersects.length > 0) {
        const object = newObjects.find((obj) => obj.mesh === intersects[0].object);
        if (object) {
          const impulse = new CANNON.Vec3(
            (Math.random() - 0.5) * 10,
            5,
            (Math.random() - 0.5) * 10
          );
          object.body.applyImpulse(impulse);
        }
      }
    };

    containerRef.current.addEventListener('mousedown', onMouseDown);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          alert(`Game Over! Your score: ${score}`);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      containerRef.current?.removeEventListener('mousedown', onMouseDown);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [score]);

  const handleAnswerSubmit = (answer: string) => {
    const correctObject = objects.find(obj => obj.question === currentQuestion);
    if (correctObject && answer.toLowerCase() === correctObject.answer.toLowerCase()) {
      setScore(prevScore => prevScore + 1);
      alert("Correct answer! +1 point");
    } else {
      alert("Incorrect answer. Try again!");
    }
    setCurrentQuestion(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-white bg-opacity-80 p-2 rounded mb-2">
        <div className="flex justify-between items-center">
          <div>Score: {score}</div>
          <div>Time Left: {timeLeft}s</div>
        </div>
        {currentQuestion && (
          <div className="mt-2">
            <h3 className="text-lg font-bold mb-2">{currentQuestion}</h3>
            <input
              type="text"
              className="w-full p-2 rounded border"
              placeholder="Enter your answer"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswerSubmit((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
        )}
      </div>
      <div ref={containerRef} className="flex-grow" />
      {showInstructions && (
        <div className="absolute top-20 left-4 bg-white bg-opacity-80 p-2 rounded max-w-xs">
          <h4 className="font-bold mb-2">Instructions:</h4>
          <ul className="list-disc pl-4 text-sm">
            <li>Click and drag spheres to move them</li>
            <li>Guide spheres to the green target area</li>
            <li>Answer questions to score points</li>
            <li>Score as many points as you can before time runs out!</li>
          </ul>
          <button 
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => setShowInstructions(false)}
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicsPuzzle;