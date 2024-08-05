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

interface Planet {
  name: string;
  gradient: string;
  ringColors: string;
  textColor: string;
  size: number;
  hasRing?: boolean;
}

const planets: Planet[] = [
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

const PlanetButton = ({ planet }: { planet: Planet }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ButtonContainer style={{
      '--ring-colors': planet.ringColors,
      '--ring-colors-reverse': planet.ringColors.split(', ').reverse().join(', ')
    } as React.CSSProperties}>
      <CentralButton 
        href={`/planet/${planet.name.toLowerCase()}`}
        className={`${isPressed ? 'pressed' : ''} ${planet.hasRing ? 'has-ring' : ''}`}
        style={{
          '--planet-gradient': planet.gradient,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        } as React.CSSProperties}
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

export default SpacePage;