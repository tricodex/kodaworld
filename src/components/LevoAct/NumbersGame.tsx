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
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);

  const generateNewTile = useCallback((currentTiles: Tile[]): Tile | null => {
    const emptyCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!currentTiles.some(tile => tile.row === row && tile.col === col)) {
          emptyCells.push({ row, col });
        }
      }
    }
    if (emptyCells.length === 0) return null;
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    return {
      value: Math.random() < 0.9 ? 2 : 4,
      row,
      col,
      id: Date.now() + Math.random()
    };
  }, []);

  const resetGame = useCallback(() => {
    const initialTiles = [];
    for (let i = 0; i < 2; i++) {
      const newTile = generateNewTile(initialTiles);
      if (newTile) initialTiles.push(newTile);
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
        setContainerSize({ width, height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [resetGame]);

  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const newTiles = [...tiles];
    let moved = false;
    let scoreIncrease = 0;

    const sortedTiles = newTiles.sort((a, b) => {
      if (direction === 'up' || direction === 'down') {
        return direction === 'up' ? a.row - b.row : b.row - a.row;
      } else {
        return direction === 'left' ? a.col - b.col : b.col - a.col;
      }
    });

    for (let i = 0; i < sortedTiles.length; i++) {
      const tile = sortedTiles[i];
      let { row, col } = tile;
      let newRow = row;
      let newCol = col;

      while (true) {
        const testRow = newRow + (direction === 'up' ? -1 : direction === 'down' ? 1 : 0);
        const testCol = newCol + (direction === 'left' ? -1 : direction === 'right' ? 1 : 0);

        if (testRow < 0 || testRow >= GRID_SIZE || testCol < 0 || testCol >= GRID_SIZE) {
          break;
        }

        const targetTile = sortedTiles.find(t => t.row === testRow && t.col === testCol);
        if (targetTile) {
          if (targetTile.value === tile.value) {
            targetTile.value *= 2;
            scoreIncrease += targetTile.value;
            sortedTiles.splice(sortedTiles.indexOf(tile), 1);
            i--;
            moved = true;
          }
          break;
        }

        newRow = testRow;
        newCol = testCol;
        moved = true;
      }

      if (newRow !== row || newCol !== col) {
        tile.row = newRow;
        tile.col = newCol;
      }
    }

    if (moved) {
      const newTile = generateNewTile(sortedTiles);
      if (newTile) sortedTiles.push(newTile);
      setTiles(sortedTiles);
      setScore(prevScore => prevScore + scoreIncrease);
    }

    if (!moved && !generateNewTile(sortedTiles)) {
      setGameOver(true);
    }
  }, [tiles, generateNewTile]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startPos) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - startPos.x;
    const dy = touch.clientY - startPos.y;
    handleSwipe(dx, dy);
    setStartPos(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!startPos) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    handleSwipe(dx, dy);
    setStartPos(null);
  };

  const handleSwipe = (dx: number, dy: number) => {
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 10) {
      if (absDx > absDy) {
        moveTiles(dx > 0 ? 'right' : 'left');
      } else {
        moveTiles(dy > 0 ? 'down' : 'up');
      }
    }
  };

  const cellSize = Math.min(containerSize.width, containerSize.height) / (GRID_SIZE + 1);

  return (
    <div 
      id="game-container"
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <h1 className="text-2xl font-bold text-white mb-2">2048</h1>
      <div className="text-xl text-white mb-2">Score: {score}</div>
      <div 
        className="relative bg-gray-800 rounded-lg"
        style={{
          width: `${cellSize * GRID_SIZE}px`,
          height: `${cellSize * GRID_SIZE}px`,
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
              width: `${cellSize - 4}px`,
              height: `${cellSize - 4}px`,
              fontSize: `${cellSize / 4}px`,
              backgroundColor: `hsl(${tile.value * 10}, 70%, 50%)`,
              color: tile.value > 4 ? 'white' : 'black',
            }}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              x: `${tile.col * cellSize + 2}px`,
              y: `${tile.row * cellSize + 2}px`,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {tile.value}
          </motion.div>
        ))}
      </div>
      <div className="mt-2 text-white text-lg">
        {gameOver ? "Game Over!" : "Swipe or drag to move tiles"}
      </div>
      <button 
        className="mt-2 px-4 py-1 bg-white text-purple-500 rounded-lg font-bold"
        onClick={resetGame}
      >
        {gameOver ? "New Game" : "Reset"}
      </button>
    </div>
  );
};

export default NumbersGame;