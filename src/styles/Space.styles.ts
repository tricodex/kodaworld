import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Link from 'next/link';

// Define custom CSS properties
interface CustomCSS extends React.CSSProperties {
  '--ring-colors'?: string;
  '--ring-colors-reverse'?: string;
  '--planet-gradient'?: string;
  '--planet-size'?: string;
}

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  :root {
    --width: 0.5vmin;
    --duration: 10s;
    --button-size: 100px;
    --ring-size: 200px;
  }

  body { margin: 0; background: #000; font-family: Arial, sans-serif; color: #fff; overflow-x: hidden; }
`;

// Move the rotate keyframes definition here
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const enhancedRing = keyframes`
  0%, 100% { transform: rotateY(var(--start)) rotateX(var(--start)) rotateZ(var(--start)) scale(1); }
  25%, 75% { transform: rotateY(calc(var(--start) + 90deg)) rotateX(calc(var(--start) + 90deg)) rotateZ(calc(var(--start) + 90deg)) scale(1.2); }
  50% { transform: rotateY(calc(var(--start) + 180deg)) rotateX(calc(var(--start) + 180deg)) rotateZ(calc(var(--start) + 180deg)) scale(1); }
`;

const enhancedRingReverse = keyframes`
  0%, 100% { transform: rotateY(calc(360deg - var(--start))) rotateX(calc(360deg - var(--start))) rotateZ(calc(360deg - var(--start))) scale(1); }
  25%, 75% { transform: rotateY(calc(270deg - var(--start))) rotateX(calc(270deg - var(--start))) rotateZ(calc(270deg - var(--start))) scale(1.1); }
  50% { transform: rotateY(calc(180deg - var(--start))) rotateX(calc(180deg - var(--start))) rotateZ(calc(180deg - var(--start))) scale(1); }
`;

export const SolarSystemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
`;

export const Title = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700;
`;

export const SolarSystemInfo = styled.div`
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
    list-style-type: disc;
    padding-left: 30px;
  }

  li::before {
    content: "•";
    color: #ffd700;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    margin-bottom: 5px;
  }
`;

export const ScaleModelContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

export const ScalePlanet = styled.div<{ style?: CustomCSS }>`
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

export const PlanetName = styled.div`
  font-size: 10px;
  text-align: center;
  margin-top: 5px;
`;

export const PlanetSize = styled.div`
  font-size: 10px;
  text-align: center;
  margin-top: 5px;
`;

export const PlanetsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

export const ButtonContainer = styled.div<{ style?: CustomCSS }>`
  position: relative;
  width: var(--ring-size);
  height: var(--ring-size);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
`;

export const CentralButton = styled(Link)<{ style?: CustomCSS }>`
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
    animation: ${rotate} 20s linear infinite;
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

export const Rings = styled.div<{ style?: CustomCSS }>`
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
    animation: ${enhancedRing} var(--duration) ease-in-out infinite;
    --value: var(--start);
    transform: rotateY(var(--value)) rotateX(var(--value)) rotateZ(var(--value)) scale(var(--scale));
  }

  &::before { --start: 180deg; }
  &::after { --start: 90deg; }
`;

export const RingsReverse = styled(Rings)`
  &::before, &::after {
    background: conic-gradient(from calc(var(--value-reverse) * 3), var(--ring-colors-reverse)) border-box;
    animation: ${enhancedRingReverse} var(--duration) ease-in-out infinite;
    --value-reverse: calc(360deg - var(--start));
    transform: rotateY(var(--value-reverse)) rotateX(var(--value-reverse)) rotateZ(var(--value-reverse)) scale(var(--scale));
  }
`;
