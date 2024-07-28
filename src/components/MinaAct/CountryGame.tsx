import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

interface Country {
  name: string;
  capital: string;
  continent: string;
  landmarks: string[];
}

const countries: Country[] = [
  { name: "France", capital: "Paris", continent: "Europe", landmarks: ["Eiffel Tower", "Louvre Museum"] },
  { name: "Japan", capital: "Tokyo", continent: "Asia", landmarks: ["Mount Fuji", "Tokyo Tower"] },
  { name: "Brazil", capital: "Brasília", continent: "South America", landmarks: ["Christ the Redeemer", "Amazon Rainforest"] },
  { name: "Egypt", capital: "Cairo", continent: "Africa", landmarks: ["Pyramids of Giza", "Sphinx"] },
  { name: "Australia", capital: "Canberra", continent: "Australia", landmarks: ["Sydney Opera House", "Great Barrier Reef"] },
];

const CountryGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [questionType, setQuestionType] = useState<'capital' | 'continent' | 'landmark'>('capital');

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const texture = new THREE.TextureLoader().load('/placeholders/world_texture.jpg');
    const material = new THREE.MeshPhongMaterial({ map: texture });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 15;

    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const currentContainer = containerRef.current;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  const startNewRound = () => {
    const newCountry = countries[Math.floor(Math.random() * countries.length)];
    setCurrentCountry(newCountry);
    setQuestionType(['capital', 'continent', 'landmark'][Math.floor(Math.random() * 3)] as 'capital' | 'continent' | 'landmark');
  };

  useEffect(() => {
    startNewRound();
  }, []);

  const handleAnswer = (answer: string) => {
    if (currentCountry) {
      let correct = false;
      switch (questionType) {
        case 'capital':
          correct = answer === currentCountry.capital;
          break;
        case 'continent':
          correct = answer === currentCountry.continent;
          break;
        case 'landmark':
          correct = currentCountry.landmarks.includes(answer);
          break;
      }

      if (correct) {
        setScore(prevScore => prevScore + 1);
        gsap.to(containerRef.current, {
          duration: 0.5,
          opacity: 0,
          onComplete: () => {
            gsap.to(containerRef.current, { duration: 0.5, opacity: 1 });
            startNewRound();
          }
        });
      } else {
        gsap.to(containerRef.current, {
          duration: 0.1,
          x: -10,
          yoyo: true,
          repeat: 5
        });
      }
    }
  };

  const getOptions = () => {
    if (!currentCountry) return [];
    let options: string[] = [];
    switch (questionType) {
      case 'capital':
        options = countries.map(c => c.capital);
        break;
      case 'continent':
        options = Array.from(new Set(countries.map(c => c.continent)));
        break;
      case 'landmark':
        options = countries.flatMap(c => c.landmarks);
        break;
    }
    return [
      questionType === 'landmark' ? currentCountry.landmarks[Math.floor(Math.random() * currentCountry.landmarks.length)] : 
        questionType === 'capital' ? currentCountry.capital : currentCountry.continent,
      ...options.filter(o => {
        if (questionType === 'landmark') {
          return !currentCountry.landmarks.includes(o);
        } else {
          return o !== currentCountry[questionType];
        }
      })
    ]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-2 rounded">
        Score: {score}
      </div>
      {currentCountry && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-80 p-2 rounded">
          <p className="text-center mb-2">
            What is the {questionType} of {currentCountry.name}?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {getOptions().map((option, index) => (
              <button
                key={index}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryGame;