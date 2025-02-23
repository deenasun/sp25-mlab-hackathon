import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [score, setScore] = useState(0);
    const [numRounds, setNumRounds] = useState(0);

    const addToScore = (newScore) => setScore((prevScore) => prevScore + newScore);
    const resetScore = () => setScore(0);
    const incrementRounds = () => setNumRounds((prevRounds) => prevRounds + 1);

    return (
        <GameContext.Provider
            value={{
                score,
                numRounds,
                addToScore,
                resetScore,
                incrementRounds,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
