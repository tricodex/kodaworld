import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './NumbersGame.module.css';

const GRID_SIZE = 4;

interface Tile {
  value: number;
  row: number;
  col: number;
  id: number;
}

type GameMode = 'normal' | 'blitz';

const NumbersGame: React.FC = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [gameMode, setGameMode] = useState<GameMode>('normal');

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

      const traversalX = direction === 'right' ? [3, 2, 1, 0] : [0, 1, 2, 3];
      const traversalY = direction === 'down' ? [3, 2, 1, 0] : [0, 1, 2, 3];

      const findFarthestPosition = (row: number, col: number, vector: [number, number]): [number, number] => {
        let previous: [number, number] = [row, col];

        do {
          previous = [row, col];
          row += vector[0];
          col += vector[1];
        } while (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE &&
                 !newTiles.some(t => t.row === row && t.col === col));

        return previous;
      };

      const moveTile = (tile: Tile) => {
        const vector: [number, number] = {
          'up': [-1, 0],
          'down': [1, 0],
          'left': [0, -1],
          'right': [0, 1]
        }[direction];

        const [newRow, newCol] = findFarthestPosition(tile.row, tile.col, vector);

        if (newRow !== tile.row || newCol !== tile.col) {
          moved = true;
        }

        const targetTile = newTiles.find(t => t.row === newRow + vector[0] && t.col === newCol + vector[1]);

        if (targetTile && targetTile.value === tile.value) {
          targetTile.value *= 2;
          scoreIncrease += targetTile.value;
          newTiles.splice(newTiles.indexOf(tile), 1);
          moved = true;
        } else {
          tile.row = newRow;
          tile.col = newCol;
        }
      };

      traversalY.forEach(y => {
        traversalX.forEach(x => {
          const tile = newTiles.find(t => t.row === y && t.col === x);
          if (tile) {
            moveTile(tile);
          }
        });
      });

      if (moved) {
        const newTile = generateNewTile(newTiles);
        newTiles.push(newTile);
        
        if (gameMode === 'blitz' && Math.random() < 0.5) {
          const extraTile = generateNewTile(newTiles);
          newTiles.push(extraTile);
        }
        
        setScore(prevScore => prevScore + scoreIncrease);
      }

      if (newTiles.length === GRID_SIZE * GRID_SIZE && !canMove(newTiles)) {
        setGameOver(true);
      }

      return newTiles;
    });
  }, [generateNewTile, gameMode]);

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

  const toggleGameMode = () => {
    setGameMode(prevMode => prevMode === 'normal' ? 'blitz' : 'normal');
    resetGame();
  };

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
    <div id="game-container" className={styles.gameContainer}>
      <h1 className={styles.title}>2048</h1>
      <div className={styles.score}>Score: {score}</div>
      <div className={styles.modeToggle}>
        <span>Mode: {gameMode === 'normal' ? 'Normal' : 'Blitz'} 🕹️</span>
        <button onClick={toggleGameMode} className={styles.modeButton}>
          Switch to {gameMode === 'normal' ? 'Blitz' : 'Normal'}
        </button>
      </div>
      <div className={styles.grid} style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px` }}>
        <div className={styles.gridInner} style={{ width: `${gridSize}px`, height: `${gridSize}px` }}>
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => (
            <div
              key={index}
              className={styles.cell}
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
              className={styles.tile}
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
      <div className={styles.message}>
        {gameOver ? "Game Over!" : `Use arrow keys to move tiles (${gameMode} mode)`}
      </div>
      <button className={styles.button} onClick={resetGame}>
        {gameOver ? "New Game" : "Reset"}
      </button>
    </div>
  );
};

export default NumbersGame;