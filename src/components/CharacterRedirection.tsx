// CharacterRedirection.tsx

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// The assistant defines an extensive list of domains and keywords for each character
const characterDomains = {
    wake: {
      keywords: [
        'music', 'sound', 'instrument', 'melody', 'rhythm', 'song', 'concert', 'orchestra', 'band', 'composer',
        'guitar', 'piano', 'drums', 'violin', 'trumpet', 'flute', 'saxophone', 'bass', 'vocalist', 'singer',
        'chord', 'scale', 'note', 'tempo', 'harmony', 'genre', 'jazz', 'rock', 'classical', 'pop',
        'musical', 'opera', 'symphony', 'concerto', 'sonata', 'lyrics', 'composition', 'arrangement', 'conducting', 'performance',
        'audio', 'recording', 'mixing', 'production', 'soundwave', 'frequency', 'pitch', 'timbre', 'acoustics', 'resonance',
        'playlist', 'album', 'artist', 'soundtrack', 'metronome', 'crescendo', 'diminuendo', 'staccato', 'legato', 'vibrato',
        'tuning', 'notation', 'improvisation', 'modulation', 'reverb', 'equalizer', 'synthesizer', 'midi', 'orchestration', 'transcription'
      ],
      subject: 'Music'
    },
    levo: {
      keywords: [
        'science', 'math', 'programming', 'physics', 'chemistry', 'biology', 'algorithm', 'coding', 'experiment', 'theory',
        'hypothesis', 'research', 'data', 'analysis', 'equation', 'formula', 'calculation', 'problem-solving', 'logic', 'reasoning',
        'computer', 'software', 'hardware', 'engineering', 'technology', 'innovation', 'invention', 'discovery', 'quantum', 'relativity',
        'molecule', 'atom', 'cell', 'gene', 'dna', 'ecosystem', 'evolution', 'astronomy', 'geology', 'meteorology',
        'arithmetic', 'algebra', 'geometry', 'calculus', 'statistics', 'probability', 'trigonometry', 'function', 'variable', 'constant',
        'energy', 'force', 'mass', 'velocity', 'acceleration', 'gravity', 'magnetism', 'electricity', 'thermodynamics', 'optics',
        'artificial intelligence', 'machine learning', 'neural network', 'database', 'algorithm', 'data structure', 'cryptography', 'cybersecurity',
        'robotics', 'nanotechnology', 'biotechnology', 'genetics', 'biochemistry', 'astrophysics', 'cosmology', 'paleontology', 'ecology', 'conservation'
      ],
      subject: 'Science'
    },
    mina: {
      keywords: [
        'geography', 'culture', 'space', 'planet', 'country', 'travel', 'exploration', 'map', 'world', 'continent',
        'ocean', 'mountain', 'river', 'desert', 'forest', 'climate', 'weather', 'environment', 'ecosystem', 'biodiversity',
        'language', 'tradition', 'custom', 'religion', 'art', 'cuisine', 'festival', 'ethnicity', 'society', 'anthropology',
        'solar system', 'galaxy', 'universe', 'star', 'constellation', 'asteroid', 'comet', 'nebula', 'black hole', 'astronaut',
        'capital', 'population', 'economy', 'politics', 'border', 'landmark', 'monument', 'tourism', 'expedition', 'navigation',
        'earth', 'globe', 'atlas', 'topography', 'latitude', 'longitude', 'equator', 'tropics', 'pole', 'hemisphere',
        'volcano', 'earthquake', 'tsunami', 'glacier', 'island', 'peninsula', 'bay', 'gulf', 'strait', 'canal',
        'savanna', 'tundra', 'rainforest', 'grassland', 'wetland', 'coral reef', 'mangrove', 'delta', 'plateau', 'valley',
        'heritage', 'nomad', 'urban', 'rural', 'agriculture', 'industrialization', 'migration', 'diaspora', 'colonialism', 'postcolonialism'
      ],
      subject: 'Geography'
    },
    ella: {
      keywords: [
        'history', 'past', 'ancient', 'civilization', 'war', 'revolution', 'empire', 'leader', 'event', 'era',
        'archaeology', 'artifact', 'document', 'source', 'timeline', 'dynasty', 'monarchy', 'democracy', 'republic', 'government',
        'medieval', 'renaissance', 'enlightenment', 'industrial', 'modern', 'contemporary', 'prehistoric', 'bronze age', 'iron age', 'stone age',
        'politics', 'economics', 'social', 'cultural', 'religious', 'military', 'diplomatic', 'technological', 'scientific', 'artistic',
        'colonialism', 'imperialism', 'nationalism', 'globalization', 'migration', 'trade', 'exploration', 'discovery', 'invention', 'innovation',
        'revolution', 'civil war', 'world war', 'cold war', 'reformation', 'crusades', 'renaissance', 'industrial revolution', 'civil rights', 'suffrage',
        'monarchy', 'feudalism', 'capitalism', 'communism', 'socialism', 'fascism', 'democracy', 'dictatorship', 'republic', 'empire',
        'pharaoh', 'emperor', 'king', 'queen', 'president', 'prime minister', 'general', 'philosopher', 'scientist', 'artist',
        'colonization', 'decolonization', 'human rights', 'law', 'justice', 'slavery', 'abolition', 'labor', 'industrialization', 'urbanization'
      ],
      subject: 'History'
    }
  };

// The assistant implements a function to calculate fuzzy match score
const fuzzyMatch = (word: string, keyword: string): number => {
  const maxLength = Math.max(word.length, keyword.length);
  const distance = levenshteinDistance(word, keyword);
  return 1 - distance / maxLength;
};

// The assistant implements the Levenshtein distance algorithm for fuzzy matching
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[b.length][a.length];
};

// The assistant improves the probability scoring function
const calculateProbabilityScores = (query: string): Record<string, number> => {
    const words = query.toLowerCase().split(/\s+/);
    const scores: Record<string, number> = { wake: 0, levo: 0, mina: 0, ella: 0 };
    const fuzzyThreshold = 0.8;
    const wordScores: Record<string, number> = {};
  
    words.forEach(word => {
      let maxScore = 0;
      let bestCharacter = '';
      for (const [character, domain] of Object.entries(characterDomains)) {
        for (const keyword of domain.keywords) {
          const fuzzyScore = fuzzyMatch(word, keyword);
          if (fuzzyScore >= fuzzyThreshold && fuzzyScore > maxScore) {
            maxScore = fuzzyScore;
            bestCharacter = character;
          }
        }
      }
      if (bestCharacter) {
        scores[bestCharacter] += maxScore;
        wordScores[word] = maxScore;
      }
    });
  
    // Apply word importance weighting
    const totalWordScore = Object.values(wordScores).reduce((sum, score) => sum + score, 0);
    for (const character in scores) {
      scores[character] /= totalWordScore || 1; // Avoid division by zero
    }
  
    return scores;
  };
  
  // The assistant improves edge case handling
  const handleEdgeCases = (scores: Record<string, number>, query: string): [string, string | null] => {
    const maxScore = Math.max(...Object.values(scores));
    const bestMatches = Object.entries(scores).filter(([_, score]) => score === maxScore);
  
    if (bestMatches.length > 1) {
      // Multiple characters with the same highest score
      const randomIndex = Math.floor(Math.random() * bestMatches.length);
      const [character, _] = bestMatches[randomIndex];
      return [character, `Your query relates to multiple subjects. I've chosen ${characterDomains[character as keyof typeof characterDomains].subject} for you, but feel free to explore other characters too!`];
    } else if (maxScore < 0.2) {
      // Very low confidence in any character
      return ['koda', `I'm not sure which specific subject your query relates to. Let's chat and I'll help you find the right information!`];
    } else {
      // Clear winner
      return [bestMatches[0][0], null];
    }
  };
  
  // The assistant exports an improved custom hook for character redirection
  export const useCharacterRedirection = () => {
    const [feedback, setFeedback] = useState<string | null>(null);
    const router = useRouter();
  
    const redirectToCharacter = useCallback((query: string) => {
      const scores = calculateProbabilityScores(query);
      const [bestMatch, edgeCaseFeedback] = handleEdgeCases(scores, query);
      
      if (edgeCaseFeedback) {
        setFeedback(edgeCaseFeedback);
      } else {
        setFeedback(null);
      }
  
      if (bestMatch === 'koda') {
        router.push(`/general-chat?q=${encodeURIComponent(query)}`);
      } else {
        router.push(`/${bestMatch.toLowerCase()}?q=${encodeURIComponent(query)}`);
      }
    }, [router]);
  
    return { redirectToCharacter, feedback };
  };
  