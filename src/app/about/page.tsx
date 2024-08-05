import React from 'react';
import KodaHeader from '@/components/KodaHeader';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <KodaHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Adventure Awaits in KodaWorld!</h1>
        <div className="space-y-6 text-lg">
          <p>
            Welcome to KodaWorld, where learning becomes an extraordinary journey guided by your lovable animal companions! 
            Embark on thrilling adventures with Mina the globetrotting monkey, Ella the wise elephant, Levo the scholarly lion, and Wake the musical whale.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8">Explore the World with Mina</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Take a whirlwind tour of global cultures in the Cultural Expedition</li>
            <li>Test your geography skills in the interactive World Map Quiz</li>
            <li>Learn about Earth's climate zones in the Climate Challenge</li>
            <li>Show off your global knowledge in the fast-paced Country Game</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Journey Through Time with Ella</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Place events on a vivid, animated timeline in the Historical Timeline Game</li>
            <li>Piece together ancient civilizations in the Ancient Civilization Puzzle</li>
            <li>Step into the shoes of historical figures in the Historical Figure Quiz</li>
            <li>Orchestrate the flow of history in the unique History Chess game</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Discover Science with Levo</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Manipulate atoms in the immersive Particle Game</li>
            <li>Challenge your spatial reasoning in the Shape Puzzle Challenge</li>
            <li>Control the laws of physics in the Physics Puzzle</li>
            <li>Merge numbers strategically in the educational Numbers Game</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8">Immerse Yourself in Music with Wake</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create melodies through movement in the Rhythm Game</li>
            <li>Experience your favorite songs visually in the Music Visualizer</li>
            <li>Bring new music to life as you Compose a Melody</li>
            <li>Identify and play instruments from around the world in the Instrument Quiz</li>
          </ul>

          <p className="mt-8">
            In KodaWorld, you'll experience the joy of learning through immersive, interactive adventures. 
            With Mina, Ella, Levo, and Wake as your guides, new wonders await you on every visit!
          </p>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;