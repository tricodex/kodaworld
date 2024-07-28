import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Question {
  instrumentName: string;
  options: string[];
  correctAnswer: string;
  modelPath: string;
}

const questions: Question[] = [
  {
    instrumentName: 'Guitar',
    options: ['Guitar', 'Violin', 'Cello', 'Bass'],
    correctAnswer: 'Guitar',
    modelPath: '/api/placeholder/guitar.glb'
  },
  {
    instrumentName: 'Piano',
    options: ['Organ', 'Harpsichord', 'Piano', 'Synthesizer'],
    correctAnswer: 'Piano',
    modelPath: '/api/placeholder/piano.glb'
  },
  {
    instrumentName: 'Drum Kit',
    options: ['Bongos', 'Drum Kit', 'Timpani', 'Xylophone'],
    correctAnswer: 'Drum Kit',
    modelPath: '/api/placeholder/drumkit.glb'
  }
];

const InstrumentQuiz: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    camera.position.set(0, 0, 5);

    // Load 3D model
    const loader = new GLTFLoader();
    let currentModel: THREE.Object3D | null = null;

    const loadModel = (modelPath: string) => {
      if (currentModel) {
        scene.remove(currentModel);
      }
      loader.load(modelPath, (gltf) => {
        currentModel = gltf.scene;
        scene.add(currentModel);
        
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        currentModel.scale.setScalar(scale);
        currentModel.position.sub(center.multiplyScalar(scale));
      });
    };

    loadModel(questions[currentQuestion].modelPath);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      if (currentModel) {
        currentModel.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-70 p-6 rounded-lg text-white">
          {!showResult ? (
            <>
              <h2 className="text-2xl mb-4">What instrument is this?</h2>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl mb-4">Quiz Completed!</h2>
              <p className="mb-4">Your score: {score} out of {questions.length}</p>
              <button
                className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded"
                onClick={restartQuiz}
              >
                Restart Quiz
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentQuiz;