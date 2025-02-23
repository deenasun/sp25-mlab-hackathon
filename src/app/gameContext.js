import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [score, setScore] = useState(0);
    const [numRounds, setNumRounds] = useState(0);
    const [categories, setCategories] = useState([]);
    const [correctWords, setCorrectWords] = useState([]);

    const addToScore = (newScore) =>
        setScore((prevScore) => prevScore + newScore);
    const resetScore = () => setScore(0);
    const incrementRounds = () => setNumRounds((prevRounds) => prevRounds + 1);
    const updateCategories = (newCategories) => setCategories(newCategories);
    const updateCorrectWords = (newWords) => setCorrectWords(newWords);

    return (
        <GameContext.Provider
            value={{
                score,
                numRounds,
                categories,
                correctWords,
                addToScore,
                resetScore,
                incrementRounds,
                updateCategories,
                updateCorrectWords,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};
