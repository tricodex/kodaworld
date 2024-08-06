import { type CSSProperties } from 'react';

export const styles = {
  root: {
    '--bg-color': '#e0f7fa',
    '--bg-color-light': '#b2ebf2',
    '--box-shadow-color': 'rgba(0, 0, 0, 0.15)',
    '--text-color-hover': '#1c988a',
    '--primary-color': '#ffd700',
    '--secondary-color': '#333',
    '--accent-color': '#ff4500',
    '--text-color': '#ffffff',
    '--border-color': '#ffd700',
    '--hover-color': '#ffea00',
    '--invalid-color': 'rgba(255, 0, 0, 0.3)',
    '--selected-color': 'rgba(255, 215, 0, 0.3)',
    '--overlay-color': 'rgba(0, 0, 0, 0.7)',
  } as CSSProperties,

  body: 'font-sans text-white m-0 p-0',

  gameContainer: 'flex justify-center items-center w-screen h-screen bg-cover bg-center overflow-hidden',

  gameBoardContainer: 'flex flex-col items-center bg-black bg-opacity-70 p-5 rounded-lg shadow-lg',

  gameBoard: 'grid grid-cols-4 grid-rows-4 gap-0.5 bg-secondary border-2 border-primary w-[300px] h-[300px] mb-5',

  gridCell: 'border border-primary relative transition-all duration-300 ease-in-out',

  gridCellSelected: 'bg-selected scale-105 z-10',

  gridCellInvalid: 'bg-invalid',

  piece: 'absolute w-full h-full grid transition-all duration-300 ease-in-out',

  pieceCell: 'border border-white border-opacity-30',

  piecePreview: 'w-[60px] h-[60px] m-1 cursor-pointer transition-all duration-300 ease-in-out hover:scale-110',

  piecePreviewSelected: 'border-2 border-white shadow-lg shadow-primary',

  infoPanel: 'flex flex-col justify-between w-[250px] p-5 bg-black bg-opacity-70 rounded-lg ml-5',

  gameTitle: 'text-2xl font-bold text-center mb-5 text-primary',

  gameStats: 'flex justify-between mb-5',

  statItem: 'text-center',

  statValue: 'text-2xl font-bold text-primary',

  statLabel: 'text-xs uppercase',

  instructions: 'mb-5 p-2.5 bg-white bg-opacity-10 rounded',

  instructionsTitle: 'mt-0 text-primary',

  instructionsText: 'my-1 text-sm',

  availablePieces: 'flex flex-wrap justify-center mb-5',

  button: 'bg-primary text-secondary border-none py-2.5 px-5 text-base font-bold cursor-pointer rounded transition-all duration-300 ease-in-out hover:bg-hover hover:translate-y-[-2px] hover:shadow-md active:translate-y-0 active:shadow-sm',

  pulse: 'animate-pulse',

  rotate: 'animate-spin',
};

export default styles;