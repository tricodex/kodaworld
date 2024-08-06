'use client';
import React, { useEffect, useRef } from 'react';

interface Mouse {
  x: number | null;
  y: number | null;
  radius: number;
}

interface ParticleProps {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  update: () => void;
  draw: () => void;
}

const InteractiveGlowingKODA: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
      }
    `;
    document.head.appendChild(style);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: ParticleProps[] = [];
    const particleCount = 5000;
    const mouseRadius = 50;
    const mouse: Mouse = { x: null, y: null, radius: mouseRadius };

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const svgPath = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100">
  <style>
    .text {
      font-family: 'Bungee Spice', sans-serif;
      font-size: 80px;
      fill: #FFA500;
      font-weight: bold;
      stroke: #FFA500;
      stroke-width: 2px; /* Increase thickness of the outline */
    }
    .shadow {
      font-family: 'Bungee Spice', sans-serif;
      font-size: 80px;
      fill: #FFA500;
      opacity: 0.5; /* Make the shadow slightly transparent */
    }
  </style>
  <!-- Shadow text for extra bold effect -->
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="shadow" dx="1" dy="1">KODA</text>
  <!-- Main text -->
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="text">KODA</text>
</svg>

    `;

    const getParticlePositions = (): Promise<ParticleProps[]> => {
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (!offscreenCtx) return Promise.resolve([]);

      const svgBlob = new Blob([svgPath], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      return new Promise<ParticleProps[]>((resolve) => {
        const img = new Image();
        img.onload = () => {
          offscreenCanvas.width = img.width;
          offscreenCanvas.height = img.height;
          offscreenCtx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);

          const imgData = offscreenCtx.getImageData(0, 0, img.width, img.height).data;
          const positions: ParticleProps[] = [];
          const step = 4;
          const scale = Math.min(canvas.width / 400, canvas.height / 100);
          const offsetX = (canvas.width - 400 * scale) / 2;
          const offsetY = (canvas.height - 100 * scale) / 2;

          for (let y = 0; y < img.height; y += step) {
            for (let x = 0; x < img.width; x += step) {
              const index = (y * img.width + x) * 4;
              if (imgData[index + 3] > 128) { // Check alpha channel
                positions.push({
                  x: x * scale + offsetX,
                  y: y * scale + offsetY,
                  baseX: x * scale + offsetX,
                  baseY: y * scale + offsetY,
                  size: 2,
                  density: Math.random() * 30 + 1,
                  update: () => {},
                  draw: () => {},
                });
              }
            }
          }
          resolve(positions);
        };
        img.src = url;
      });
    };

    class Particle implements ParticleProps {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;

      constructor({ x, y, baseX, baseY, size, density }: ParticleProps) {
        this.x = x;
        this.y = y;
        this.baseX = baseX;
        this.baseY = baseY;
        this.size = size;
        this.density = density;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        const dx = (mouse.x ?? 0) - this.x;
        const dy = (mouse.y ?? 0) - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * this.density;
          this.y -= directionY * force * this.density;
        } else {
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }
    }

    const init = async () => {
      particles = (await getParticlePositions()).map(pos => new Particle(pos));
      animate();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFA500';

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      document.head.removeChild(style);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default InteractiveGlowingKODA;
