import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { AnimationClass } from './AnimationClass';

interface AudioContextType extends AudioContext {
  webkitAudioContext?: typeof AudioContext;
}

const MusicVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [speedlines, setSpeedlines] = useState<AnimationClass | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioContext) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      const newAudioContext = new AudioContextClass();
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
    if (!containerRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.width, canvas.height);

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
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      scene.clear();
      renderer.dispose();
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
        audioRef.current.play().catch((error: Error) => console.error("Playback failed", error));
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-visualizer">
      <div ref={containerRef} className="visualizer-container">
        <canvas ref={canvasRef} className="visualizer-canvas" />
      </div>
      <div className="controls">
        <label htmlFor="audioFile" className="file-input-label">Choose an audio file:</label>
        <input type="file" id="audioFile" accept=".mp3,.wav" onChange={handleFileUpload} className="file-input" />
        <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
        <div className="playback-controls">
          <button onClick={togglePlayPause} className="play-pause-button">
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <input
            title="Audio Seek Bar"
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="seek-bar"
          />
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicVisualizer;