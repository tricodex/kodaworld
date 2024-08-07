import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(to bottom, #000033, #000066);
    font-family: 'Orbitron', sans-serif;
    color: white;
    overflow-x: hidden;
  }
`;

const rotate = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const EarthContainer = styled.div`
  width: 300px;
  height: 300px;
  position: relative;
  perspective: 1000px;
`;

const Earth = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  animation: ${rotate} 20s infinite linear;
`;

const Layer = styled.div<{ active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  transition: opacity 0.5s ease;
  opacity: ${(props) => (props.active ? 1 : 0)};
`;

const Surface = styled(Layer)`
  background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg/2560px-Solarsystemscope_texture_2k_earth_daymap.jpg') repeat-x;
  background-size: cover;
`;

const Clouds = styled(Layer)`
  background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Earth_cloud_map.jpg/2560px-Earth_cloud_map.jpg') repeat-x;
  background-size: cover;
  opacity: 0.7;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #4169e1;
`;

const Controls = styled.div`
  margin-top: 1rem;

  button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background: #4169e1;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;

    &:hover {
      background: #1e90ff;
    }
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
    color: #4169e1;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
  }
`;

const ChartContainer = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 10px;
`;

const EarthPage = () => {
  const [activeLayer, setActiveLayer] = useState('surface');

  const temperatureData = [
    { month: 'Jan', temp: -5 },
    { month: 'Feb', temp: -3 },
    { month: 'Mar', temp: 2 },
    { month: 'Apr', temp: 8 },
    { month: 'May', temp: 14 },
    { month: 'Jun', temp: 19 },
    { month: 'Jul', temp: 22 },
    { month: 'Aug', temp: 21 },
    { month: 'Sep', temp: 16 },
    { month: 'Oct', temp: 10 },
    { month: 'Nov', temp: 4 },
    { month: 'Dec', temp: -2 },
  ];

  return (
    <div className="earth-page">
      <GlobalStyle />
      <Title>Earth: Our Blue Planet</Title>
      <EarthContainer>
        <Earth>
          <Surface active={activeLayer === 'surface'} />
          <Clouds active={activeLayer === 'clouds'} />
        </Earth>
      </EarthContainer>
      <Controls>
        <button onClick={() => setActiveLayer('surface')}>Surface View</button>
        <button onClick={() => setActiveLayer('clouds')}>Cloud Cover</button>
      </Controls>
      <InfoPanel>
        <h2>Earth Facts</h2>
        <ul>
          <li>Third planet from the Sun</li>
          <li>Only known planet with life</li>
          <li>70.8% of surface covered by water</li>
          <li>Has one natural satellite: the Moon</li>
        </ul>
      </InfoPanel>
      <ChartContainer>
        <h3>Average Temperature Variation (Northern Hemisphere)</h3>
        <LineChart width={600} height={300} data={temperatureData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="#8884d8" />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default EarthPage;
