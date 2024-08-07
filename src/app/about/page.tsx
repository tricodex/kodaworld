'use client';
import React, { useEffect, useRef } from 'react';
import KodaHeader from '@/components/KodaHeader';

const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, -s, s, c);
    return m * v;
  }

  vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 4.0; i++) {
      uv = fract(rotate(uv, uTime * 0.1) * 1.5) - 0.5;

      float d = length(uv) * exp(-length(uv0));

      vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.1);
      col = mix(col, vec3(0.05, 0.05, 0.1), 0.9); // Even darker base colors

      d = sin(d * 8. + uTime) / 8.;
      d = abs(d);

      d = pow(0.01 / d, 1.2);

      finalColor += col * d;
    }

    // Add flashing particles
    float particle = step(0.995, random(uv0 + fract(uTime)));
    vec3 particleColor = palette(fract(uTime * 0.1 + random(uv0)));
    float flash = (sin(uTime * 10.0 + random(uv0) * 10.0) * 0.5 + 0.5) * particle;
    
    finalColor = mix(finalColor, particleColor, flash * 0.8);

    // Add subtle glow
    float glow = max(0.0, 1.0 - length(uv0));
    finalColor += vec3(0.1, 0.2, 0.3) * pow(glow, 3.0);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const AboutPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create WebGL program');
      return;
    }

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
      -1.0,  1.0,
       1.0,  1.0,
      -1.0, -1.0,
       1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'aVertexPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionUniformLocation = gl.getUniformLocation(program, 'uResolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'uTime');

    let animationFrameId: number;

    const render = (time: number) => {
      time *= 0.001;  // Convert to seconds

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform1f(timeUniformLocation, time);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-10">
        <KodaHeader inverse={true}/>
        <main className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="bg-black bg-opacity-50 p-6 rounded-lg mb-8 max-w-3xl w-full">
            <h1 className="text-4xl font-bold mb-6 text-center text-white">Adventure Awaits in KodaWorld!</h1>
            <p className="text-lg text-white text-center">
              Welcome to KodaWorld, where learning becomes an extraordinary journey guided by your lovable animal companions! 
              Embark on thrilling adventures with Mina the globetrotting monkey, Ella the wise elephant, Levo the scholarly lion, and Wake the musical whale.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
            {[
              { title: "Explore the World with Mina", items: [
                "Take a whirlwind tour of global cultures in the Cultural Expedition",
                "Test your geography skills in the interactive World Map Quiz",
                "Learn about Earth's climate zones in the Climate Challenge",
                "Show off your global knowledge in the fast-paced Country Game"
              ]},
              { title: "Journey Through Time with Ella", items: [
                "Place events on a vivid, animated timeline in the Historical Timeline Game",
                "Piece together ancient civilizations in the Ancient Civilization Puzzle",
                "Step into the shoes of historical figures in the Historical Figure Quiz",
                "Orchestrate the flow of history in the unique History Chess game"
              ]},
              { title: "Discover Science with Levo", items: [
                "Manipulate atoms in the immersive Particle Game",
                "Challenge your spatial reasoning in the Shape Puzzle Challenge",
                "Control the laws of physics in the Physics Puzzle",
                "Merge numbers strategically in the educational Numbers Game"
              ]},
              { title: "Immerse Yourself in Music with Wake", items: [
                "Create melodies through movement in the Rhythm Game",
                "Experience your favorite songs visually in the Music Visualizer",
                "Bring new music to life as you Compose a Melody",
                "Identify and play instruments from around the world in the Instrument Quiz"
              ]}
            ].map((section, index) => (
              <div key={index} className="bg-black bg-opacity-50 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">{section.title}</h2>
                <ul className="list-disc pl-6 space-y-2 text-white">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="bg-black bg-opacity-50 p-6 rounded-lg mt-8 max-w-3xl w-full">
            <p className="text-lg text-white text-center">
              In KodaWorld, you&apos;ll experience the joy of learning through immersive, interactive adventures. 
              With Mina, Ella, Levo, and Wake as your guides, new wonders await you on every visit!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;