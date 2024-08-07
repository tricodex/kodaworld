import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import KodaHeader from '../KodaHeader';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: #000;
    font-family: 'Orbitron', sans-serif;
    color: #fff;
    overflow-x: hidden;
  }
`;

const pulsate = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const SunContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle at center, #1a0a00 0%, #000000 100%);
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #ffd700;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #ff4500, 0 0 20px #ff4500, 0 0 30px #ff4500;
`;

const SunVisualization = styled.div`
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ffd200 0%, #f7971e 50%, #ff4500 100%);
  border-radius: 50%;
  box-shadow: 0 0 50px #ff4500;
  margin-bottom: 2rem;
  animation: ${pulsate} 4s ease-in-out infinite;
`;

const InfoContainer = styled.div`
  max-width: 800px;
  background: rgba(255, 69, 0, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 0 20px rgba(255, 69, 0, 0.3);
`;

const InfoTitle = styled.h2`
  color: #ffd700;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  color: #fff;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const FactList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FactItem = styled.li`
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
  color: #fff;

  &::before {
    content: "•";
    color: #ffd700;
    text-color: #ffd700;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const InteractiveSection = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  max-width: 800px;
`;

const InteractiveButton = styled.button`
  background: linear-gradient(45deg, #ff4500, #ff8c00);
  border: none;
  color: white;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 15px #ff4500;
  }
`;

const SunPage = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <InfoContainer>
            <InfoTitle>Sun Overview</InfoTitle>
            <InfoText>
              The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core, radiating the energy mainly as visible light, ultraviolet light, and infrared radiation.
            </InfoText>
            <FactList>
              <FactItem>Age: About 4.6 billion years</FactItem>
              <FactItem>Diameter: 1,392,700 km (109 times Earth&apos;s diameter)</FactItem>
              <FactItem>Mass: 1.989 × 10^30 kg (333,000 times Earth&apos;s mass)</FactItem>
              <FactItem>Surface Temperature: 5,500°C (10,000°F)</FactItem>
            </FactList>
          </InfoContainer>
        );
      case 'structure':
        return (
          <InfoContainer>
            <InfoTitle>Sun&apos;s Structure</InfoTitle>
            <InfoText>
              The Sun&apos;s interior consists of the core, radiative zone, and convective zone. Its atmosphere is composed of the photosphere, chromosphere, and corona.
            </InfoText>
            <FactList>
              <FactItem>Core: Where nuclear fusion occurs, reaching 15 million °C</FactItem>
              <FactItem>Radiative Zone: Energy is transferred by radiation</FactItem>
              <FactItem>Convective Zone: Energy is transferred by convection</FactItem>
              <FactItem>Photosphere: The visible surface of the Sun</FactItem>
            </FactList>
          </InfoContainer>
        );
      case 'activity':
        return (
          <InfoContainer>
            <InfoTitle>Solar Activity</InfoTitle>
            <InfoText>
              The Sun exhibits various forms of magnetic activity, including sunspots, solar flares, and coronal mass ejections.
            </InfoText>
            <FactList>
              <FactItem>Sunspots: Cooler, darker areas on the Sun&apos;s surface</FactItem>
              <FactItem>Solar Flares: Sudden, intense variations in brightness</FactItem>
              <FactItem>Coronal Mass Ejections: Large releases of plasma and magnetic field</FactItem>
              <FactItem>Solar Wind: Stream of charged particles ejected from the Sun&apos;s upper atmosphere</FactItem>
            </FactList>
          </InfoContainer>
        );
      default:
        return null;
    }
  };

  return (
    <>
    {/* <KodaHeader /> */}
      <GlobalStyle />
      <SunContainer>
        <Title>The Sun</Title>
        <SunVisualization />
        {renderContent()}
        <InteractiveSection>
          <InteractiveButton onClick={() => setActiveSection('overview')}>Overview</InteractiveButton>
          <InteractiveButton onClick={() => setActiveSection('structure')}>Structure</InteractiveButton>
          <InteractiveButton onClick={() => setActiveSection('activity')}>Solar Activity</InteractiveButton>
        </InteractiveSection>
      </SunContainer>
    </>
  );
};

export default SunPage;