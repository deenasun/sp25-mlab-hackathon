import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./gameContext";

function Game() {
  const ROUND_TIME = 10; // Round duration in seconds

  // State variables
  const [elapsedTime, setElapsedTime] = useState(0); // Time elapsed in the current round
  const [isGameRunning, setIsGameRunning] = useState(false); // Whether the game is running

  const { score, numRounds, incrementScore, resetScore, incrementRounds } = useContext(GameContext);

  // Start the game
  const startGame = () => {
    setElapsedTime(0); // Reset timer
    incrementRounds(); // Increment the number of rounds
    setIsGameRunning(true); // Start the game
  };

  // Stop the game
  const stopGame = () => {
    setIsGameRunning(false); // Stop the game
  };

  // Main game loop using useEffect
  useEffect(() => {
    if (!isGameRunning) return; // Exit if the game is not running

    const interval = setInterval(() => {
      setElapsedTime((prevTime) => {
        if (prevTime + 1 >= ROUND_TIME) {
          clearInterval(interval); // Stop the timer when round ends
          setIsGameRunning(false); // End the game
          console.log("Round over!");
          return ROUND_TIME;
        }
        return prevTime + 1; // Increment elapsed time
      });
    }, 1000); // Run every second

    return () => clearInterval(interval);
  }, [isGameRunning]);

  // Example: Handle user actions (e.g., scoring points)
  const handleAction = () => {
    if (isGameRunning) {
      incrementScore(); // Increment score
    }
  };

  return (
    <div className="flex flex-col w-full self-center items-center justify-items-center gap-4 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-center font-[family-name:var(--font-geist-mono)]">Guesscasso</h1>
          <p className="w-200 text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">Elapsed Time: {elapsedTime} seconds
              <br></br>
              Round: {numRounds}
              <br></br>
              Score: {score}
          </p>

      {!isGameRunning ? (
        <button onClick={startGame} className='rounded-md bg-gray-200 p-2'>{numRounds == 0 ? 'Start Game' : 'Next Game'}</button>
      ) : (
        <button onClick={stopGame} className='rounded-md bg-gray-200 p-2'>Stop Game</button>
      )}

      {!isGameRunning && elapsedTime >= ROUND_TIME ? (
        <p>Round over! Final Score: {score}</p>
      ) : null}
    </div>
  );
}

export default Game;
