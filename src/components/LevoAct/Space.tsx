import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Link from 'next/link';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  @property --value { syntax: "<angle>"; inherits: true; initial-value: 0deg; }
  @property --value-reverse { syntax: "<angle>"; inherits: true; initial-value: 360deg; }
  @property --width-ratio { syntax: "<number>"; inherits: true; initial-value: 0; }
  @property --scale { syntax: "<number>"; inherits: true; initial-value: 0; }

  :root {
    --width: 0.5vmin;
    --duration: 10s;
    --button-size: 100px;
    --ring-size: 200px;
  }

  body { margin: 0; background: #000; font-family: Arial, sans-serif; color: #fff; overflow-x: hidden; }
`;

const SolarSystemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700;
`;

const SolarSystemInfo = styled.div`
  max-width: 800px;
  margin-bottom: 2rem;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  line-height: 1.6;

  h2 {
    color: #ffd700;
    font-family: 'Orbitron', sans-serif;
    text-align: center;
    margin-bottom: 1rem;
  }

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li::before {
    content: "•";
    color: #ffd700;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`;

const ScaleModelContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

const ScalePlanet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;

  &::before {
    content: '';
    width: var(--planet-size);
    height: var(--planet-size);
    background: var(--planet-gradient);
    border-radius: 50%;
  }
`;

const PlanetName = styled.div`
  font-size: 10px;
  text-align: center;
  margin-top: 5px;
`;

const PlanetSize = styled.div`
  font-size: 10px;
  text-align: center;
  margin-top: 5px;
`;

const PlanetsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  position: relative;
  width: var(--ring-size);
  height: var(--ring-size);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

const CentralButton = styled(Link)`
  position: relative;
  width: var(--button-size);
  height: var(--button-size);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--planet-gradient);
    border-radius: 50%;
    animation: rotate 20s linear infinite;
  }

  &.has-ring::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140%;
    height: 40px;
    background: linear-gradient(to right, transparent 10%, #ffd700 50%, transparent 90%);
    transform: translate(-50%, -50%) rotate3d(1, 0, 0, 75deg);
    opacity: 0.7;
    border-radius: 50%;
    pointer-events: none;
  }
`;

const Rings = styled.div`
  position: absolute;
  width: var(--ring-size);
  height: var(--ring-size);
  border-radius: 50%;
  filter: url(#blurFilter);

  &::before, &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    --width-ratio: 1;
    border: calc(var(--width) * var(--width-ratio)) solid transparent;
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    --start: 180deg;
    --scale: 1;
  }

  &::before, &::after {
    background: conic-gradient(from calc(var(--value) * 3), var(--ring-colors)) border-box;
    animation: enhanced-ring var(--duration) ease-in-out infinite;
    --value: var(--start);
    transform: rotateY(var(--value)) rotateX(var(--value)) rotateZ(var(--value)) scale(var(--scale));
  }

  &::before { --start: 180deg; }
  &::after { --start: 90deg; }
`;

const RingsReverse = styled(Rings)`
  &::before, &::after {
    background: conic-gradient(from calc(var(--value-reverse) * 3), var(--ring-colors-reverse)) border-box;
    animation: enhanced-ring-reverse var(--duration) ease-in-out infinite;
    --value-reverse: calc(360deg - var(--start));
    transform: rotateY(var(--value-reverse)) rotateX(var(--value-reverse)) rotateZ(var(--value-reverse)) scale(var(--scale));
  }
`;

const planets = [
  {name: "SUN", gradient: "radial-gradient(circle, #ffd200 0%, #f7971e 50%, #ff0000 100%)", ringColors: "#ffd700, #ffa500, #ff4500, #ff0000", textColor: "#8B0000", size: 100},
  {name: "MERCURY", gradient: "linear-gradient(45deg, #8c7e6d, #b8b8b8, #8c7e6d)", ringColors: "#696969, #a9a9a9, #d3d3d3, #696969", textColor: "#2F4F4F", size: 0.38},
  {name: "VENUS", gradient: "linear-gradient(45deg, #ffd85c, #e8a95c, #b8693d)", ringColors: "#ffd700, #daa520, #cd853f, #8b4513", textColor: "#8B4513", size: 0.95},
  {name: "EARTH", gradient: "linear-gradient(45deg, #4b6cb7, #1cb5e0, #2ecc71)", ringColors: "#1e90ff, #4169e1, #0000ff, #000080", textColor: "#000080", size: 1},
  {name: "MARS", gradient: "linear-gradient(45deg, #ff4500, #8b0000, #ff4500)", ringColors: "#ff6347, #dc143c, #8b0000, #800000", textColor: "#400000", size: 0.53},
  {name: "JUPITER", gradient: "linear-gradient(45deg, #b8860b, #cd853f, #daa520, #8b4513)", ringColors: "#ffd700, #f4a460, #d2691e, #8b4513", textColor: "#8B4513", size: 11.2},
  {name: "SATURN", gradient: "linear-gradient(45deg, #ffd700, #eedd82, #daa520, #b8860b)", ringColors: "#ffe4b5, #f4a460, #d2691e, #8b4513", textColor: "#8B4513", size: 9.45, hasRing: true},
  {name: "URANUS", gradient: "linear-gradient(45deg, #5dadec, #4eb3e8, #40e0d0, #48d1cc)", ringColors: "#e0ffff, #afeeee, #48d1cc, #00ced1", textColor: "#008B8B", size: 4},
  {name: "NEPTUNE", gradient: "linear-gradient(45deg, #4169e1, #0000ff, #191970, #000080)", ringColors: "#1e90ff, #4169e1, #0000ff, #000080", textColor: "#0000CD", size: 3.88}
];

const PlanetButton = ({ planet }: { planet: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ButtonContainer style={{'--ring-colors': planet.ringColors, '--ring-colors-reverse': planet.ringColors.split(', ').reverse().join(', ')}}>
      <CentralButton 
        href={`/planet/${planet.name.toLowerCase()}`}
        className={`${isPressed ? 'pressed' : ''} ${planet.hasRing ? 'has-ring' : ''}`}
        style={{'--planet-gradient': planet.gradient, transform: isHovered ? 'scale(1.1)' : 'scale(1)'}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => { setIsPressed(true); setTimeout(() => setIsPressed(false), 1000); }}
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
      <ScalePlanet key={index} style={{ '--planet-size': `${planet.size}px`, '--planet-gradient': planet.gradient }}>
        <PlanetName>{planet.name}</PlanetName>
        <PlanetSize>{planet.size === 100 ? '100%' : `${planet.size}%`}</PlanetSize>
      </ScalePlanet>
    ))}
  </ScaleModelContainer>
);

const SolarSystemButtons = () => {
  useEffect(() => {
    const svgFilter = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgFilter.setAttribute("class", "filter");
    svgFilter.innerHTML = '<filter id="blurFilter"><feGaussianBlur in="SourceGraphic" stdDeviation="2"></feGaussianBlur></filter>';
    document.body.appendChild(svgFilter);

    return () => {
      document.body.removeChild(svgFilter);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <SolarSystemContainer>
        <Title>Solar System</Title>
        <SolarSystemInfo>
          <h2>Our Cosmic Neighborhood</h2>
          <p>The Solar System, born ~4.6 billion years ago, is a celestial dance of the Sun and its orbiting objects:</p>
          <ul>
            <li>4 inner rocky planets: Mercury, Venus, Earth, and Mars</li>
            <li>4 outer gas giants: Jupiter, Saturn, Uranus, and Neptune</li>
            <li>Dwarf planets, numerous moons, asteroids, and comets</li>
          </ul>
          <p>The Sun holds 99.86% of the system&apos;s mass. Saturn is famed for its stunning rings, while Jupiter boasts the Great Red Spot. Earth, our blue marble, is the only known harbor of life.</p>
        </SolarSystemInfo>
        <ScaleModel />
        <PlanetsContainer>
          {planets.map((planet, index) => (
            <PlanetButton key={index} planet={planet} />
          ))}
        </PlanetsContainer>
      </SolarSystemContainer>
    </>
  );
};

export default SolarSystemButtons;