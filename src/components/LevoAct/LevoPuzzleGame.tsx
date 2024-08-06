import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Piece {
  shape: number[][];
  color: string;
}

const pieces: Piece[] = [
  { shape: [[1]], color: '#00CED1' },
  { shape: [[1, 1]], color: '#FFA500' },
  { shape: [[1, 1], [1, 0]], color: '#EE82EE' },
  { shape: [[1, 1], [1, 1]], color: '#FFFF00' },
  { shape: [[1, 1, 1]], color: '#FF4500' },
  { shape: [[1, 1], [0, 1]], color: '#32CD32' },
];

interface GameState {
  level: number;
  score: number;
  highScore: number;
  timeLeft: number;
  isPlaying: boolean;
  grid: (number | null)[][];
  availablePieces: Piece[];
  selectedPieceIndex: number;
  cursorPosition: { x: number; y: number };
}

const initialState: GameState = {
  level: 1,
  score: 0,
  highScore: 0,
  timeLeft: 120,
  isPlaying: false,
  grid: Array(4).fill(null).map(() => Array(4).fill(null)),
  availablePieces: pieces.slice(0, 4),
  selectedPieceIndex: -1,
  cursorPosition: { x: 0, y: 0 },
};

const LevoPuzzleGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('levoPuzzleHighScore');
    if (storedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(storedHighScore) }));
    }
    console.log('Initial game state set');
  }, []);

  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      const timer = setTimeout(() => 
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 
      1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0) {
      console.log('Time\'s up. Ending game.');
      endGame();
    }
  }, [gameState.isPlaying, gameState.timeLeft]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveCursor(-1, 0);
          break;
        case 'ArrowRight':
          moveCursor(1, 0);
          break;
        case 'ArrowUp':
          moveCursor(0, -1);
          break;
        case 'ArrowDown':
          moveCursor(0, 1);
          break;
        case 'Enter':
          placePiece();
          break;
        case 'r':
          rotatePiece();
          break;
        case 'Backspace':
          removePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  const moveCursor = (dx: number, dy: number) => {
    setGameState(prev => ({
      ...prev,
      cursorPosition: {
        x: Math.max(0, Math.min(3, prev.cursorPosition.x + dx)),
        y: Math.max(0, Math.min(3, prev.cursorPosition.y + dy)),
      }
    }));
    console.log('Cursor moved');
  };

  const startGame = () => {
    setGameState({
      ...initialState,
      isPlaying: true,
      highScore: gameState.highScore,
    });
    setShowInstructions(false);
    console.log('Game started');
  };

  const placePiece = () => {
    if (gameState.selectedPieceIndex === -1) {
      console.log('No piece selected');
      return;
    }

    const piece = gameState.availablePieces[gameState.selectedPieceIndex];
    const { x, y } = gameState.cursorPosition;

    if (canPlacePiece(piece, x, y)) {
      const newGrid = gameState.grid.map(row => [...row]);
      piece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell) {
            newGrid[y + dy][x + dx] = gameState.selectedPieceIndex;
          }
        });
      });

      setGameState(prev => ({
        ...prev,
        grid: newGrid,
        availablePieces: prev.availablePieces.filter((_, i) => i !== prev.selectedPieceIndex),
        selectedPieceIndex: -1,
      }));

      console.log('Piece placed');
      checkWin();
    } else {
      console.log('Cannot place piece at current position');
    }
  };

  const canPlacePiece = (piece: Piece, x: number, y: number): boolean => {
    return piece.shape.every((row, dy) =>
      row.every((cell, dx) =>
        cell === 0 || (
          y + dy < 4 &&
          x + dx < 4 &&
          gameState.grid[y + dy][x + dx] === null
        )
      )
    );
  };

  const rotatePiece = () => {
    if (gameState.selectedPieceIndex === -1) {
      console.log('No piece selected for rotation');
      return;
    }

    setGameState(prev => {
      const newPieces = [...prev.availablePieces];
      const piece = newPieces[prev.selectedPieceIndex];
      const rotatedShape = piece.shape[0].map((_, index) =>
        piece.shape.map(row => row[index]).reverse()
      );
      newPieces[prev.selectedPieceIndex] = { ...piece, shape: rotatedShape };
      console.log('Piece rotated');
      return { ...prev, availablePieces: newPieces };
    });
  };

  const removePiece = () => {
    const { x, y } = gameState.cursorPosition;
    const pieceIndex = gameState.grid[y][x];

    if (pieceIndex === null) {
      console.log('No piece to remove at cursor position');
      return;
    }

    const newGrid = gameState.grid.map(row => [...row]);
    const removedPiece = pieces[pieceIndex];

    for (let dy = 0; dy < 4; dy++) {
      for (let dx = 0; dx < 4; dx++) {
        if (newGrid[dy][dx] === pieceIndex) {
          newGrid[dy][dx] = null;
        }
      }
    }

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      availablePieces: [...prev.availablePieces, removedPiece],
    }));
    console.log('Piece removed');
  };

  const checkWin = () => {
    if (gameState.grid.every(row => row.every(cell => cell !== null))) {
      const newScore = gameState.score + gameState.timeLeft * 10 * gameState.level;
      const newHighScore = Math.max(newScore, gameState.highScore);

      if (newHighScore > gameState.highScore) {
        localStorage.setItem('levoPuzzleHighScore', newHighScore.toString());
      }

      if (gameState.level < 3) {
        setGameState(prev => ({
          ...prev,
          level: prev.level + 1,
          score: newScore,
          highScore: newHighScore,
          grid: Array(4).fill(null).map(() => Array(4).fill(null)),
          availablePieces: pieces.slice(0, 4 + prev.level * 2),
          timeLeft: prev.timeLeft + 60,
          selectedPieceIndex: -1,
          cursorPosition: { x: 0, y: 0 },
        }));
        console.log('Level completed. Moving to next level.');
      } else {
        console.log('Game completed. Ending game.');
        endGame();
      }
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    setShowInstructions(true);
    console.log('Game ended');
  };

  return (
    <div className="game-container">
      <div className="game-board-container">
        <motion.div 
          className="game-board"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {gameState.grid.map((row, y) =>
            row.map((cell, x) => (
              <motion.div 
                key={`${x}-${y}`} 
                className={`grid-cell ${gameState.cursorPosition.x === x && gameState.cursorPosition.y === y ? 'selected' : ''} ${
                  gameState.selectedPieceIndex !== -1 && !canPlacePiece(gameState.availablePieces[gameState.selectedPieceIndex], x, y) ? 'invalid' : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (y * 4 + x) * 0.05 }}
              >
                {cell !== null && (
                  <motion.div 
                    className="piece" 
                    style={{ 
                      backgroundColor: pieces[cell].color,
                      gridTemplateColumns: `repeat(${pieces[cell].shape[0].length}, 1fr)`,
                      gridTemplateRows: `repeat(${pieces[cell].shape.length}, 1fr)`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {pieces[cell].shape.flat().map((_, i) => (
                      <div key={i} className="piece-cell"></div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
      <div className="info-panel">
        <motion.div 
          className="game-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="game-title">Levo&apos;s Shape Puzzle</h2>
          <div className="stat-item">
            <div className="stat-value">{gameState.level}</div>
            <div className="stat-label">Level</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{gameState.score}</div>
            <div className="stat-label">Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{gameState.highScore}</div>
            <div className="stat-label">High Score</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{gameState.timeLeft}</div>
            <div className="stat-label">Time Left</div>
          </div>
        </motion.div>
        <AnimatePresence>
          {showInstructions && (
            <motion.div 
              className="instructions"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h3>How to Play:</h3>
              <p>Use arrow keys to move the cursor</p>
              <p>Press Enter to place a piece</p>
              <p>Press R to rotate the selected piece</p>
              <p>Press Backspace to remove a piece</p>
              <p>Fill the grid to complete the level!</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          className="available-pieces"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {gameState.availablePieces.map((piece, index) => (
            <motion.div 
              key={index}
              className={`piece-preview ${gameState.selectedPieceIndex === index ? 'selected' : ''}`}
              style={{ 
                backgroundColor: piece.color,
                display: 'grid',
                gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
                gridTemplateRows: `repeat(${piece.shape.length}, 1fr)`,
              }}
              onClick={() => setGameState(prev => ({ ...prev, selectedPieceIndex: index }))}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {piece.shape.flat().map((cell, i) => (
                <div key={i} className="piece-cell" style={{ backgroundColor: cell ? piece.color : 'transparent' }}></div>
              ))}
            </motion.div>
          ))}
        </motion.div>
        {!gameState.isPlaying && (
          <motion.button 
            className="button"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {gameState.score > 0 ? 'Play Again' : 'Start Game'}
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default LevoPuzzleGame;