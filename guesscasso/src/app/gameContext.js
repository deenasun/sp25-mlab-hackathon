import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [numRounds, setNumRounds] = useState(0);

  const incrementScore = () => setScore((prevScore) => prevScore + 1);
  const resetScore = () => setScore(0);
  const incrementRounds = () => setNumRounds((prevRounds) => prevRounds + 1);

  return (
    <GameContext.Provider value={{ score, numRounds, incrementScore, resetScore, incrementRounds }}>
      {children}
    </GameContext.Provider>
  );
};
