import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Styled components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url('/backgrounds/puzzle.webp');
  background-size: cover;
  background-position: center;
  font-family: 'Arial', sans-serif;
`;

const GameOverlay = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  color: white;
  max-width: 800px;
  width: 90%;
`;

const GameBox = styled(motion.div)`
  position: relative;
  width: 300px;
  height: 300px;
  border: 2px solid #ffd700;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  background: rgba(35, 43, 43, 0.8);
  margin: 20px 0;
`;

const Block = styled.div`
  border: 1px solid #ffd700;
  &:hover {
    background: rgba(255, 215, 0, 0.3);
  }
`;

const Piece = styled(motion.div)<{ color: string }>`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(2, 37.5px);
  grid-template-rows: repeat(2, 37.5px);
  cursor: grab;
  filter: drop-shadow(0 0 5px ${props => props.color});
  z-index: 10;

  span {
    width: 37.5px;
    height: 37.5px;
    border: 2px inset rgba(0, 0, 0, 0.75);
    background: ${props => props.color};
    pointer-events: none;
  }
`;

const Button = styled.button`
  background: #ffd700;
  color: #000;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px;
  &:hover {
    background: #ffea00;
  }
`;

const InfoPanel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

// Game logic and component
const levels = [
  { pieces: 4, timeLimit: 60 },
  { pieces: 6, timeLimit: 90 },
  { pieces: 8, timeLimit: 120 },
];

const pieceShapes = [
  { shape: [[1, 1, 1, 1]], color: '#00CED1' },
  { shape: [[1, 0], [1, 1]], color: '#FFA500' },
  { shape: [[0, 1], [1, 1]], color: '#EE82EE' },
  { shape: [[1, 1], [1, 1]], color: '#FFFF00' },
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#FF4500' },
  { shape: [[1, 1], [1, 0], [1, 0]], color: '#32CD32' },
  { shape: [[1, 1, 1], [1, 0, 0]], color: '#FF69B4' },
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#4169E1' },
];

const LevoPuzzleGame: React.FC = () => {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(levels[0].timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pieces, setPieces] = useState<any[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('levoPuzzleHighScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore));
  }, []);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setLevel(0);
    setScore(0);
    setIsPlaying(true);
    initializeLevel(0);
  };

  const initializeLevel = (levelIndex: number) => {
    const currentLevel = levels[levelIndex];
    setPieces(pieceShapes.slice(0, currentLevel.pieces));
    setTimeLeft(currentLevel.timeLimit);
    randomizePieces();
  };

  const randomizePieces = () => {
    setPositions(pieces.map(() => ({
      x: Math.random() * 225 - 112.5,
      y: Math.random() * 225 - 112.5
    })));
  };

  const checkWin = useCallback(() => {
    const allInside = positions.every(pos => 
      pos.x >= 0 && pos.x <= 225 && pos.y >= 0 && pos.y <= 225
    );
    if (allInside) {
      setIsWinner(true);
      const newScore = score + timeLeft * 10;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('levoPuzzleHighScore', newScore.toString());
      }
      setTimeout(() => {
        setIsWinner(false);
        if (level < levels.length - 1) {
          setLevel(level + 1);
          initializeLevel(level + 1);
        } else {
          endGame();
        }
      }, 1500);
    }
  }, [positions, score, highScore, level]);

  const endGame = () => {
    setIsPlaying(false);
    // Show end game message or high score
  };

  const handlePieceClick = (index: number) => {
    setSelectedPiece(selectedPiece === index ? null : index);
  };

  const handleBlockClick = (x: number, y: number) => {
    if (selectedPiece !== null) {
      setPositions(prev => {
        const newPositions = [...prev];
        newPositions[selectedPiece] = { x, y };
        return newPositions;
      });
      setSelectedPiece(null);
      checkWin();
    }
  };

  return (
    <GameContainer>
      <GameOverlay>
        <h2 className="text-2xl font-bold mb-4">Levo&apos;s Shape Puzzle Challenge</h2>
        <InfoPanel>
          <div>Level: {level + 1}</div>
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
          <div>Time Left: {timeLeft}s</div>
        </InfoPanel>
        {!isPlaying ? (
          <>
            <p className="mb-4">
              Welcome to Levo&apos;s Shape Puzzle Challenge! Arrange the colorful shapes into the grid to complete each level.
              Be quick - you&apos;re racing against the clock! Can you beat your high score?
            </p>
            <Button onClick={startGame}>Start Game</Button>
          </>
        ) : (
          <GameBox
            animate={isWinner ? { rotate: 360 } : {}}
            transition={{ duration: 1 }}
          >
            {[...Array(16)].map((_, i) => (
              <Block key={i} onClick={() => handleBlockClick((i % 4) * 75, Math.floor(i / 4) * 75)} />
            ))}
            <AnimatePresence>
              {pieces.map((piece, index) => (
                <Piece
                  key={index}
                  color={piece.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: positions[index]?.x, 
                    y: positions[index]?.y
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  drag={selectedPiece === index}
                  dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
                  onDragEnd={(_, info) => {
                    setPositions(prev => {
                      const newPositions = [...prev];
                      newPositions[index] = { x: info.point.x, y: info.point.y };
                      return newPositions;
                    });
                    checkWin();
                  }}
                  onClick={() => handlePieceClick(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {piece.shape.flat().map((cell: any, i: any) => cell ? <span key={i} /> : null)}
                </Piece>
              ))}
            </AnimatePresence>
          </GameBox>
        )}
      </GameOverlay>
    </GameContainer>
  );
};

export default LevoPuzzleGame;