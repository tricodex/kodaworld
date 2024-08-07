import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(to bottom, #8B0000, #A52A2A);
    font-family: 'Orbitron', sans-serif;
    color: white;
    overflow-x: hidden;
  }
`;

const MarsPage = () => {
  const [highlightedFeature, setHighlightedFeature] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  const marsFeatures = [
    { name: 'Olympus Mons', description: 'The largest volcano in the solar system, standing at 21.9 km high.' },
    { name: 'Valles Marineris', description: 'A system of canyons that runs along the Martian surface for nearly a quarter of the planet\'s circumference.' },
    { name: 'Polar Ice Caps', description: 'Made of water and dry ice, these caps grow and shrink with the Martian seasons.' },
  ];

  const handleFeatureClick = (index: number) => {
    setSelectedFeature(index);
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };

  return (
    <MarsPageContainer>
      <GlobalStyle />
      <Title>Mars: The Red Planet</Title>
      <MarsLandscape>
        {marsFeatures.map((feature, index) => (
          <FeaturePoint
            key={index}
            active={highlightedFeature === index}
            style={{ left: `${20 + index * 30}%`, top: `${30 + index * 20}%` }}
            onMouseEnter={() => setHighlightedFeature(index)}
            onMouseLeave={() => setHighlightedFeature(null)}
            onClick={() => handleFeatureClick(index)}
          >
            <button className="feature-button">{feature.name}</button>
          </FeaturePoint>
        ))}
      </MarsLandscape>
      {selectedFeature !== null && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h3>{marsFeatures[selectedFeature].name}</h3>
            </ModalHeader>
            <ModalBody>
              <p>{marsFeatures[selectedFeature].description}</p>
            </ModalBody>
            <ModalFooter>
              <button onClick={closeModal}>Close</button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
      <InfoPanel>
        <h2>Mars Facts</h2>
        <ul>
          <li>Fourth planet from the Sun</li>
          <li>Often called the &quot;Red Planet&quot; due to its reddish appearance</li>
          <li>Has two small moons: Phobos and Deimos</li>
          <li>Day length similar to Earth: 24 hours and 37 minutes</li>
        </ul>
      </InfoPanel>
    </MarsPageContainer>
  );
};

export default MarsPage;

const MarsPageContainer = styled.div`
  background: linear-gradient(to bottom, #8B0000, #A52A2A);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #FF4500;
`;

const MarsLandscape = styled.div`
  width: 80%;
  height: 400px;
  background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/PIA17944-MarsCuriosityRover-AfterCrossingDingoGapSanddune-20140209.jpg/1280px-PIA17944-MarsCuriosityRover-AfterCrossingDingoGapSanddune-20140209.jpg') no-repeat center center;
  background-size: cover;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
`;

const FeaturePoint = styled.div<{ active: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${(props) => (props.active ? 'scale(1.5)' : 'scale(1)')};

  .feature-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 5px #000;
  }
`;

const InfoPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
  margin-top: 2rem;
  max-width: 400px;

  ul {
    list-style-type: none;
    padding-left: 0;
  }

  li::before {
    content: "•";
    color: #FF4500;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  color: black;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
`;

const ModalHeader = styled.div`
  margin-bottom: 1rem;
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  button {
    background: #8B0000;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
      background: #A52A2A;
    }
  }
`;
