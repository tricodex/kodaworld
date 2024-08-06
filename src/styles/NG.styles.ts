import { CSSProperties } from 'react';

const styles = {
  gameContainer: `w-full h-full flex flex-col items-center justify-center 
    bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4`,
  title: 'text-3xl font-bold text-white mb-4',
  score: 'text-2xl text-white mb-4',
  modeToggle: 'flex items-center justify-center mb-4',
  modeButton: `ml-4 px-3 py-1 bg-white text-purple-500 rounded-lg font-bold text-sm 
    hover:bg-purple-100 transition-colors`,
  grid: 'relative bg-gray-800 rounded-lg shadow-lg overflow-hidden flex items-center justify-center',
  gridInner: 'relative',
  cell: 'absolute bg-gray-700 rounded-lg',
  tile: 'absolute rounded-lg flex items-center justify-center font-bold',
  message: 'mt-4 text-white text-lg text-center',
  button: `mt-4 px-6 py-2 bg-white text-purple-500 rounded-lg font-bold text-lg 
    hover:bg-purple-100 transition-colors`,

  gridSize: (containerSize: { width: number; height: number }): CSSProperties => ({
    width: `${containerSize.width}px`,
    height: `${containerSize.height}px`,
  }),

  gridInnerSize: (gridSize: number): CSSProperties => ({
    width: `${gridSize}px`,
    height: `${gridSize}px`,
  }),

  cellPosition: (index: number, cellSize: number): CSSProperties => ({
    width: `${cellSize - 4}px`,
    height: `${cellSize - 4}px`,
    left: `${(index % 4) * cellSize + 2}px`,
    top: `${Math.floor(index / 4) * cellSize + 2}px`,
  }),

  tileStyle: (tile: { value: number; row: number; col: number }, cellSize: number, tileSize: number): CSSProperties => ({
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    fontSize: `${tileSize / 3.5}px`,
    backgroundColor: `hsl(${Math.log2(tile.value) * 20}, 70%, 50%)`,
    color: tile.value > 4 ? 'white' : 'black',
    left: `${tile.col * cellSize + (cellSize - tileSize) / 2}px`,
    top: `${tile.row * cellSize + (cellSize - tileSize) / 2}px`,
  }),
};

export default styles;