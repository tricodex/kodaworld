// spacepage.tsx
// 'use client';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import styles from './SpacePage.module.css';
// import KodaHeader from './KodaHeader';
// import SunPage from '@/components/SpaceAct/Sun';  
// import ActivityLayout from '@/components/ActivityLayout'; 
// import styled, { createGlobalStyle, keyframes } from 'styled-components';
// import Link from 'next/link';

// // Define custom CSS properties
// interface CustomCSS extends React.CSSProperties {
//   '--ring-colors'?: string;
//   '--ring-colors-reverse'?: string;
//   '--planet-gradient'?: string;
//   '--planet-size'?: string;
// }

// // Global style
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

//   :root {
//     --width: 0.5vmin;
//     --duration: 10s;
//     --button-size: 100px;
//     --ring-size: 200px;
//   }

//   body { margin: 0; background: #000; font-family: Arial, sans-serif; color: #fff; overflow-x: hidden; }
// `;

// // Keyframes
// const rotate = keyframes`
//   0% { transform: rotate(0deg); }
//   100% { transform: rotate(360deg); }
// `;

// const enhancedRing = keyframes`
//   0%, 100% { transform: rotateY(var(--start)) rotateX(var(--start)) rotateZ(var(--start)) scale(1); }
//   25%, 75% { transform: rotateY(calc(var(--start) + 90deg)) rotateX(calc(var(--start) + 90deg)) rotateZ(calc(var(--start) + 90deg)) scale(1.2); }
//   50% { transform: rotateY(calc(var(--start) + 180deg)) rotateX(calc(var(--start) + 180deg)) rotateZ(calc(var(--start) + 180deg)) scale(1); }
// `;

// const enhancedRingReverse = keyframes`
//   0%, 100% { transform: rotateY(calc(360deg - var(--start))) rotateX(calc(360deg - var(--start))) rotateZ(calc(360deg - var(--start))) scale(1); }
//   25%, 75% { transform: rotateY(calc(270deg - var(--start))) rotateX(calc(270deg - var(--start))) rotateZ(calc(270deg - var(--start))) scale(1.1); }
//   50% { transform: rotateY(calc(180deg - var(--start))) rotateX(calc(180deg - var(--start))) rotateZ(calc(180deg - var(--start))) scale(1); }
// `;

// // Styled components that couldn't be converted to regular CSS
// const ButtonContainer = styled.div<{ style?: CustomCSS }>`
//   position: relative;
//   width: var(--ring-size);
//   height: var(--ring-size);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 20px;
// `;

// const CentralButton = styled(Link)<{ style?: CustomCSS }>`
//   position: relative;
//   width: var(--button-size);
//   height: var(--button-size);
//   border: none;
//   border-radius: 50%;
//   color: white;
//   font-size: 14px;
//   font-weight: bold;
//   cursor: pointer;
//   z-index: 10;
//   transition: all 0.3s ease;
//   overflow: hidden;
//   text-decoration: none;
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   &::before {
//     content: "";
//     position: absolute;
//     inset: 0;
//     background: var(--planet-gradient);
//     border-radius: 50%;
//     animation: ${rotate} 20s linear infinite;
//   }

//   &.has-ring::after {
//     content: "";
//     position: absolute;
//     top: 50%;
//     left: 50%;
//     width: 140%;
//     height: 40px;
//     background: linear-gradient(to right, transparent 10%, #ffd700 50%, transparent 90%);
//     transform: translate(-50%, -50%) rotate3d(1, 0, 0, 75deg);
//     opacity: 0.7;
//     border-radius: 50%;
//     pointer-events: none;
//   }
// `;

// const Rings = styled.div<{ style?: CustomCSS }>`
//   position: absolute;
//   width: var(--ring-size);
//   height: var(--ring-size);
//   border-radius: 50%;
//   filter: url(#blurFilter);

//   &::before, &::after {
//     content: "";
//     position: absolute;
//     inset: 0;
//     border-radius: 50%;
//     --width-ratio: 1;
//     border: calc(var(--width) * var(--width-ratio)) solid transparent;
//     mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
//     mask-composite: exclude;
//     --start: 180deg;
//     --scale: 1;
//   }

//   &::before, &::after {
//     background: conic-gradient(from calc(var(--value) * 3), var(--ring-colors)) border-box;
//     animation: ${enhancedRing} var(--duration) ease-in-out infinite;
//     --value: var(--start);
//     transform: rotateY(var(--value)) rotateX(var(--value)) rotateZ(var(--value)) scale(var(--scale));
//   }

//   &::before { --start: 180deg; }
//   &::after { --start: 90deg; }
// `;

// const RingsReverse = styled(Rings)`
//   &::before, &::after {
//     background: conic-gradient(from calc(var(--value-reverse) * 3), var(--ring-colors-reverse)) border-box;
//     animation: ${enhancedRingReverse} var(--duration) ease-in-out infinite;
//     --value-reverse: calc(360deg - var(--start));
//     transform: rotateY(var(--value-reverse)) rotateX(var(--value-reverse)) rotateZ(var(--value-reverse)) scale(var(--scale));
//   }
// `;

// const ScaleModelContainer = styled.div`
//   display: flex;
//   align-items: flex-end;
//   justify-content: center;
//   margin-bottom: 2rem;
//   padding: 20px;
//   background: rgba(255, 255, 255, 0.05);
//   border-radius: 10px;
// `;

// const ScalePlanet = styled.div<{ style?: CustomCSS }>`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin: 0 5px;

//   &::before {
//     content: '';
//     width: var(--planet-size);
//     height: var(--planet-size);
//     background: var(--planet-gradient);
//     border-radius: 50%;
//   }
// `;

// const PlanetName = styled.div`
//   font-size: 10px;
//   text-align: center;
//   margin-top: 5px;
// `;

// const PlanetSize = styled.div`
//   font-size: 10px;
//   text-align: center;
//   margin-top: 5px;
// `;

// interface Planet {
//   name: string;
//   gradient: string;
//   ringColors: string;
//   textColor: string;
//   size: number;
//   hasRing?: boolean;
//   link?: string;
// }

// const planets: Planet[] = [
//   {name: "SUN", gradient: "radial-gradient(circle, #ffd200 0%, #f7971e 50%, #ff0000 100%)", ringColors: "#ffd700, #ffa500, #ff4500, #ff0000", textColor: "#8B0000", size: 100, link: "/spaceact/sun"},
//   {name: "MERCURY", gradient: "linear-gradient(45deg, #8c7e6d, #b8b8b8, #8c7e6d)", ringColors: "#696969, #a9a9a9, #d3d3d3, #696969", textColor: "#2F4F4F", size: 0.38},
//   {name: "VENUS", gradient: "linear-gradient(45deg, #ffd85c, #e8a95c, #b8693d)", ringColors: "#ffd700, #daa520, #cd853f, #8b4513", textColor: "#8B4513", size: 0.95},
//   {name: "EARTH", gradient: "linear-gradient(45deg, #4b6cb7, #1cb5e0, #2ecc71)", ringColors: "#1e90ff, #4169e1, #0000ff, #000080", textColor: "#000080", size: 1},
//   {name: "MARS", gradient: "linear-gradient(45deg, #ff4500, #8b0000, #ff4500)", ringColors: "#ff6347, #dc143c, #8b0000, #800000", textColor: "#400000", size: 0.53},
//   {name: "JUPITER", gradient: "linear-gradient(45deg, #b8860b, #cd853f, #daa520, #8b4513)", ringColors: "#ffd700, #f4a460, #d2691e, #8b4513", textColor: "#8B4513", size: 11.2},
//   {name: "SATURN", gradient: "linear-gradient(45deg, #ffd700, #eedd82, #daa520, #b8860b)", ringColors: "#ffe4b5, #f4a460, #d2691e, #8b4513", textColor: "#8B4513", size: 9.45, hasRing: true},
//   {name: "URANUS", gradient: "linear-gradient(45deg, #5dadec, #4eb3e8, #40e0d0, #48d1cc)", ringColors: "#e0ffff, #afeeee, #48d1cc, #00ced1", textColor: "#008B8B", size: 4},
//   {name: "NEPTUNE", gradient: "linear-gradient(45deg, #4169e1, #0000ff, #191970, #000080)", ringColors: "#1e90ff, #4169e1, #0000ff, #000080", textColor: "#0000CD", size: 3.88}
// ];

// const PlanetButton = ({ planet, onOpen }: { planet: Planet, onOpen: () => void }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isPressed, setIsPressed] = useState(false);

//   return (
//     <ButtonContainer style={{
//       '--ring-colors': planet.ringColors,
//       '--ring-colors-reverse': planet.ringColors.split(', ').reverse().join(', ')
//     } as React.CSSProperties}>
//       <CentralButton 
//         href={planet.link ? planet.link : `/planet/${planet.name.toLowerCase()}`}
//         className={`${isPressed ? 'pressed' : ''} ${planet.hasRing ? 'has-ring' : ''}`}
//         style={{
//           '--planet-gradient': planet.gradient,
//           transform: isHovered ? 'scale(1.1)' : 'scale(1)'
//         } as React.CSSProperties}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onClick={(e) => { 
//           e.preventDefault();
//           setIsPressed(true); 
//           setTimeout(() => setIsPressed(false), 1000); 
//           if (planet.name === "SUN") onOpen(); 
//         }}
//       >
//         <span style={{ color: planet.textColor, position: 'relative', zIndex: 2 }}>{planet.name}</span>
//       </CentralButton>
//       <Rings style={{ animationDuration: isHovered ? '5s' : '10s' }} />
//       <RingsReverse style={{ animationDuration: isHovered ? '5s' : '10s' }} />
//     </ButtonContainer>
//   );
// };

// const ScaleModel = () => (
//   <ScaleModelContainer>
//     {planets.map((planet, index) => (
//       <ScalePlanet key={index} style={{
//         '--planet-size': `${planet.size}px`,
//         '--planet-gradient': planet.gradient
//       } as React.CSSProperties}>
//         <PlanetName>{planet.name}</PlanetName>
//         <PlanetSize>{planet.size === 100 ? '100%' : `${planet.size}%`}</PlanetSize>
//       </ScalePlanet>
//     ))}
//   </ScaleModelContainer>
// );

// const SpacePage = () => {
//   const [showSunPage, setShowSunPage] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = useCallback(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   useEffect(() => {
//     const svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svgFilter.setAttribute("class", "filter");
//     svgFilter.innerHTML = '<filter id="blurFilter"><feGaussianBlur in="SourceGraphic" stdDeviation="2"></feGaussianBlur></filter>';
//     document.body.appendChild(svgFilter);
    
//     return () => {
//       document.body.removeChild(svgFilter);
//     };
//   }, [scrollToBottom]);


//   return (
//     <>
//       <KodaHeader />
//       <GlobalStyle />
//       <div className={styles.solarSystemContainer}>
//         <h1 className={styles.title}>Solar System</h1>
//         <div className={styles.solarSystemInfo}>
//           {/* ... (info content remains the same) */}
//         </div>
//         <ScaleModel />
//         <div className={styles.planetsContainer}>
//           {planets.map((planet, index) => (
//             <PlanetButton key={index} planet={planet} onOpen={() => setShowSunPage(true)} />
//           ))}
//         </div>
//       </div>
//       {showSunPage && (
//         <ActivityLayout title="The Sun" onClose={() => setShowSunPage(false)}>
//           <SunPage />
//         </ActivityLayout>
//       )}
//     </>
//   );
// };

// export default SpacePage;

'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GlobalStyle,
  SolarSystemContainer,
  Title,
  SolarSystemInfo,
  ScaleModelContainer,
  ScalePlanet,
  PlanetName,
  PlanetSize,
  PlanetsContainer,
  ButtonContainer,
  CentralButton,
  Rings,
  RingsReverse
} from '@/styles/Space.styles';
import KodaHeader from './KodaHeader';
import SunPage from '@/components/SpaceAct/Sun';  
import EarthPage from '@/components/SpaceAct/Earth';
import MarsPage from '@/components/SpaceAct/Mars';
import ActivityLayout from '@/components/ActivityLayout'; 

interface Planet {
  name: string;
  gradient: string;
  ringColors: string;
  textColor: string;
  size: number;
  hasRing?: boolean;
  link?: string;
}

const planets: Planet[] = [
  {name: "SUN", gradient: "radial-gradient(circle, #ffd200 0%, #f7971e 50%, #ff0000 100%)", ringColors: "#ffd700, #ffa500, #ff4500, #ff0000", textColor: "#8B0000", size: 100, link: "/spaceact/sun"},
  {name: "MERCURY", gradient: "linear-gradient(45deg, #8c7e6d, #b8b8b8, #8c7e6d)", ringColors: "#696969, #a9a9a9, #d3d3d3, #696969", textColor: "#2F4F4F", size: 0.38},
  {name: "VENUS", gradient: "linear-gradient(45deg, #ffd85c, #e8a95c, #b8693d)", ringColors: "#ffd700, #daa520, #cd853f, #8b4513", textColor: "#8B4513", size: 0.95},
  {name: "EARTH", gradient: "linear-gradient(45deg, #4b6cb7, #1cb5e0, #2ecc71)", ringColors: "#1e90ff, #4169e1, #0000ff, #000080", textColor: "#000080", size: 1, link: "/spaceact/earth"},
  {name: "MARS", gradient: "linear-gradient(45deg, #ff4500, #8b0000, #ff4500)", ringColors: "#ff6347, #dc143c, #8b0000, #800000", textColor: "#400000", size: 0.53, link: "/spaceact/mars"},
  {name: "JUPITER", gradient: "linear-gradient(45deg, #b8860b, #cd853f, #daa520, #8b4513)", ringColors: "#ffd700, #f4a460, #d2691e, #8b4513", textColor: "#8B4513", size: 11.2},
  {name: "SATURN", gradient: "linear-gradient(45deg, #ffd700, #eedd82, #daa520, #b8860b)", ringColors: "#ffe4b5, #f4a460, #d2691e, #8b4513", textColor: "#8B4513", size: 9.45, hasRing: true},
  {name: "URANUS", gradient: "linear-gradient(45deg, #5dadec, #4eb3e8, #40e0d0, #48d1cc)", ringColors: "#e0ffff, #afeeee, #48d1cc, #00ced1", textColor: "#008B8B", size: 4},
  {name: "NEPTUNE", gradient: "linear-gradient(45deg, #4169e1, #0000ff, #191970, #000080)", ringColors: "#1e90ff, #4169e1, #0000ff, #000080", textColor: "#0000CD", size: 3.88}
];

const PlanetButton = ({ planet, onOpen }: { planet: Planet, onOpen: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ButtonContainer style={{
      '--ring-colors': planet.ringColors,
      '--ring-colors-reverse': planet.ringColors.split(', ').reverse().join(', ')
    } as React.CSSProperties}>
      <CentralButton 
        href={planet.link ? planet.link : `/planet/${planet.name.toLowerCase()}`}
        className={`${isPressed ? 'pressed' : ''} ${planet.hasRing ? 'has-ring' : ''}`}
        style={{
          '--planet-gradient': planet.gradient,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        } as React.CSSProperties}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => { 
          e.preventDefault();
          setIsPressed(true); 
          setTimeout(() => setIsPressed(false), 1000); 
          if (planet.name === "SUN" || planet.name === "EARTH" || planet.name === "MARS") onOpen(); 
        }}
      >
        <span style={{ color: planet.textColor, position: 'relative', zIndex: 2 }}>{planet.name}</span>
      </CentralButton>
      <Rings style={{ animationDuration: isHovered ? '5s' : '10s' }} />
      <RingsReverse style={{ animationDuration: isHovered ? '5s' : '10s' }} />
    </ButtonContainer>
  );
};

const ScaleModel = () => (
  <ScaleModelContainer>
    {planets.map((planet, index) => (
      <ScalePlanet key={index} style={{
        '--planet-size': `${planet.size}px`,
        '--planet-gradient': planet.gradient
      } as React.CSSProperties}>
        <PlanetName>{planet.name}</PlanetName>
        <PlanetSize>{planet.size === 100 ? '100%' : `${planet.size}%`}</PlanetSize>
      </ScalePlanet>
    ))}
  </ScaleModelContainer>
);

const SpacePage = () => {
  const [showSunPage, setShowSunPage] = useState(false);
  const [showEarthPage, setShowEarthPage] = useState(false);
  const [showMarsPage, setShowMarsPage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgFilter.setAttribute("class", "filter");
    svgFilter.innerHTML = '<filter id="blurFilter"><feGaussianBlur in="SourceGraphic" stdDeviation="2"></feGaussianBlur></filter>';
    document.body.appendChild(svgFilter);
    
    return () => {
      document.body.removeChild(svgFilter);
    };
  }, [scrollToBottom]);

  return (
    <>
      <KodaHeader />
      <GlobalStyle />
      <SolarSystemContainer>
        <Title>Solar System</Title>
        <SolarSystemInfo>
          <h2>Our Cosmic Neighborhood</h2>
          <p>The Solar System, born ~4.6 billion years ago, is a celestial dance of the Sun and its orbiting objects:</p>
          <ul>
            <li>4 inner rocky planets: <b style={{ color: 'gray' }}>Mercury</b>, <b style={{ color: 'orange' }}>Venus</b>, <b style={{ color: 'blue' }}>Earth</b>, and <b style={{ color: 'red' }}>Mars</b></li>
            <li>4 outer gas giants: <b style={{ color: 'orange' }}>Jupiter</b>, <b style={{ color: 'gold' }}>Saturn</b>, <b style={{ color: 'lightblue' }}>Uranus</b>, and <b style={{ color: 'darkblue' }}>Neptune</b></li>
            <li>Dwarf planets, numerous moons, asteroids, and comets</li>
          </ul>
          <p>The Sun holds 99.86% of the system&apos;s mass. Saturn is famed for its stunning rings, while Jupiter boasts the Great Red Spot. Earth, our blue marble, is the only known harbor of life.</p>
        </SolarSystemInfo>
        <ScaleModel />
        <PlanetsContainer>
          {planets.map((planet, index) => (
            <PlanetButton key={index} planet={planet} onOpen={() => {
              if (planet.name === "SUN") setShowSunPage(true);
              if (planet.name === "EARTH") setShowEarthPage(true);
              if (planet.name === "MARS") setShowMarsPage(true);
            }} />
          ))}
        </PlanetsContainer>
      </SolarSystemContainer>
      {showSunPage && (
        <ActivityLayout title="The Sun" onClose={() => setShowSunPage(false)}>
          <SunPage />
        </ActivityLayout>
      )}
      {showEarthPage && (
        <ActivityLayout title="Earth" onClose={() => setShowEarthPage(false)}>
          <EarthPage />
        </ActivityLayout>
      )}
      {showMarsPage && (
        <ActivityLayout title="Mars" onClose={() => setShowMarsPage(false)}>
          <MarsPage />
        </ActivityLayout>
      )}
    </>
  );
};

export default SpacePage;
