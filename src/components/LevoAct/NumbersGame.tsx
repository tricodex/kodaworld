import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 4;

interface Tile {
  value: number;
  row: number;
  col: number;
  id: number;
}

const NumbersGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const generateNewTile = useCallback((currentTiles: Tile[]): Tile => {
    const emptyCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!currentTiles.some(tile => tile.row === row && tile.col === col)) {
          emptyCells.push({ row, col });
        }
      }
    }
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
      value: Math.random() < 0.9 ? 2 : 4,
      row,
      col,
      id: Date.now() + Math.random()
    };
  }, []);

  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setTiles(prevTiles => {
      const newTiles = [...prevTiles];
      let moved = false;
      let scoreIncrease = 0;
  
      const getNextPosition = (row: number, col: number): [number, number] => {
        switch (direction) {
          case 'up': return [row - 1, col];
          case 'down': return [row + 1, col];
          case 'left': return [row, col - 1];
          case 'right': return [row, col + 1];
        }
      };
  
      const sortedTiles = newTiles.sort((a, b) => {
        if (direction === 'up' || direction === 'down') {
          return direction === 'up' ? a.row - b.row : b.row - a.row;
        } else {
          return direction === 'left' ? a.col - b.col : b.col - a.col;
        }
      });
  
      for (const tile of sortedTiles) {
        let { row, col } = tile;
        let [nextRow, nextCol] = getNextPosition(row, col);
        let merged = false;
  
        while (
          nextRow >= 0 && nextRow < GRID_SIZE &&
          nextCol >= 0 && nextCol < GRID_SIZE && !merged
        ) {
          const targetTile = newTiles.find(t => t.row === nextRow && t.col === nextCol);
          
          if (!targetTile) {
            row = nextRow;
            col = nextCol;
            moved = true;
          } else if (targetTile.value === tile.value && !merged) {
            targetTile.value *= 2;
            scoreIncrease += targetTile.value;
            newTiles.splice(newTiles.indexOf(tile), 1);
            moved = true;
            merged = true;
          } else {
            break;
          }
  
          [nextRow, nextCol] = getNextPosition(row, col);
        }
  
        if (tile.row !== row || tile.col !== col) {
          tile.row = row;
          tile.col = col;
          moved = true;
        }
      }
  
      if (moved) {
        const newTile = generateNewTile(newTiles);
        newTiles.push(newTile);
        setScore(prevScore => prevScore + scoreIncrease);
      }
  
      if (newTiles.length === GRID_SIZE * GRID_SIZE && !canMove(newTiles)) {
        setGameOver(true);
      }
  
      console.log("Tiles after move:", newTiles);
      console.log("Score:", score);
      console.log("Game Over:", gameOver);
  
      return newTiles;
    });
  }, [generateNewTile]);
  

  const canMove = (tiles: Tile[]): boolean => {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const adjacentPositions = [
        [tile.row - 1, tile.col],
        [tile.row + 1, tile.col],
        [tile.row, tile.col - 1],
        [tile.row, tile.col + 1]
      ];

      for (const [row, col] of adjacentPositions) {
        if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) continue;
        const adjacentTile = tiles.find(t => t.row === row && t.col === col);
        if (!adjacentTile || adjacentTile.value === tile.value) {
          return true;
        }
      }
    }
    return false;
  };

  // The assistant resets the game state
  const resetGame = useCallback(() => {
    const initialTiles = [];
    for (let i = 0; i < 2; i++) {
      const newTile = generateNewTile(initialTiles);
      initialTiles.push(newTile);
    }
    setTiles(initialTiles);
    setScore(0);
    setGameOver(false);
  }, [generateNewTile]);

  useEffect(() => {
    resetGame();
    const updateSize = () => {
      const container = document.getElementById('game-container');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        const size = Math.min(width, height) * 0.8;
        setContainerSize({ width: size, height: size });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const direction = e.key.replace("Arrow", "").toLowerCase() as 'up' | 'down' | 'left' | 'right';
        moveTiles(direction);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resetGame, moveTiles]);

  const gridSize = containerSize.width * 0.6;
  const cellSize = gridSize / GRID_SIZE;
  const tileSize = cellSize * 0.9;

  return (
    <div 
      id="game-container"
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4"
    >
      <h1 className="text-3xl font-bold text-white mb-4">2048</h1>
      <div className="text-2xl text-white mb-4">Score: {score}</div>
      <div 
        className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
        }}
      >
        <div
          className="relative"
          style={{
            width: `${gridSize}px`,
            height: `${gridSize}px`,
          }}
        >
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-gray-700 rounded-lg"
              style={{
                width: `${cellSize - 4}px`,
                height: `${cellSize - 4}px`,
                left: `${(index % GRID_SIZE) * cellSize + 2}px`,
                top: `${Math.floor(index / GRID_SIZE) * cellSize + 2}px`,
              }}
            />
          ))}
          {tiles.map(tile => (
            <motion.div
              key={tile.id}
              className="absolute rounded-lg flex items-center justify-center font-bold"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                fontSize: `${tileSize / 3.5}px`,
                backgroundColor: `hsl(${Math.log2(tile.value) * 20}, 70%, 50%)`,
                color: tile.value > 4 ? 'white' : 'black',
                left: `${tile.col * cellSize + (cellSize - tileSize) / 2}px`,
                top: `${tile.row * cellSize + (cellSize - tileSize) / 2}px`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              {tile.value}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-4 text-white text-lg text-center">
        {gameOver ? "Game Over!" : "Use arrow keys to move tiles"}
      </div>
      <button 
        className="mt-4 px-6 py-2 bg-white text-purple-500 rounded-lg font-bold text-lg hover:bg-purple-100 transition-colors"
        onClick={resetGame}
      >
        {gameOver ? "New Game" : "Reset"}
      </button>
    </div>
  );
};

export default NumbersGame;