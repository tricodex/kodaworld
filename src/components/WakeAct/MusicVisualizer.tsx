import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

const MusicVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioContext) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext);

      if (audioRef.current) {
        const source = newAudioContext.createMediaElementSource(audioRef.current);
        const newAnalyser = newAudioContext.createAnalyser();
        source.connect(newAnalyser);
        newAnalyser.connect(newAudioContext.destination);
        setAnalyser(newAnalyser);
      }
    }
  }, [audioContext]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bars: THREE.Mesh[] = [];
    const numBars = 64;

    for (let i = 0; i < numBars; i++) {
      const bar = new THREE.Mesh(geometry, material.clone());
      bar.position.set(i * 1.5 - (numBars * 1.5) / 2, 0, 0);
      scene.add(bar);
      bars.push(bar);
    }

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(numBars * 3);
    const particleColors = new Float32Array(numBars * 3);
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleSystem = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
      })
    );
    scene.add(particleSystem);

    camera.position.z = 50;

    const frequencyData = new Uint8Array(numBars);

    const animate = () => {
      requestAnimationFrame(animate);

      if (analyser) {
        analyser.getByteFrequencyData(frequencyData);

        for (let i = 0; i < numBars; i++) {
          const value = frequencyData[i];
          const percent = value / 256;
          const height = percent * 30;
          bars[i].scale.y = height;

          const hue = (i / numBars) * 360;
          (bars[i].material as THREE.MeshBasicMaterial).color.setHSL(hue / 360, 1, 0.5);

          // Update particle positions and colors
          particlePositions[i * 3] = bars[i].position.x;
          particlePositions[i * 3 + 1] += 0.1; // Move particles upward
          particlePositions[i * 3 + 2] = bars[i].position.z;

          particleColors[i * 3] = (bars[i].material as THREE.MeshBasicMaterial).color.r;
          particleColors[i * 3 + 1] = (bars[i].material as THREE.MeshBasicMaterial).color.g;
          particleColors[i * 3 + 2] = (bars[i].material as THREE.MeshBasicMaterial).color.b;

          // Reset particles that have moved too high
          if (particlePositions[i * 3 + 1] > 30) {
            particlePositions[i * 3 + 1] = bars[i].position.y + bars[i].scale.y;
          }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      scene.remove(particleSystem);
      particleGeometry.dispose();
      (particleSystem.material as THREE.PointsMaterial).dispose();
    };
  }, [analyser]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.load();
      initializeAudio();
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Playback failed", error));
        initializeAudio();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
        <label htmlFor="audioFile" className="text-white">Choose an audio file:</label>
        <input type="file" id="audioFile" accept=".mp3,.wav" onChange={handleFileUpload} className="mb-2 text-white" />
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
        <div className="flex items-center space-x-4">
          <button onClick={togglePlayPause} className="text-white text-2xl focus:outline-none">
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <span className="text-white">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default MusicVisualizer;