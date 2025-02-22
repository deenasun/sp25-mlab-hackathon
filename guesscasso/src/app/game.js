import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { GameContext } from './gameContext';

function Game() {
    const ROUND_TIME = 10; // Round duration in seconds
    const IMAGE_UPDATE_INTERVAL = 2; // Interval to update the image in seconds

    const [timeLeft, setTimeLeft] = useState(0); // Time elapsed in the current round
    const [isGameRunning, setIsGameRunning] = useState(false); // Whether the game is running
    const [guess, setGuess] = useState(''); // User's guess
    const [image, setImage] = useState(''); // Generated image

    const { score, numRounds, incrementScore, resetScore, incrementRounds } =
        useContext(GameContext);

    // Start the game
    const startGame = () => {
        setTimeLeft(0); // Reset timer
        incrementRounds(); // Increment the number of rounds
        setGuess(''); // Reset the user's guess
        setImage(''); // Reset the image
        setIsGameRunning(true); // Start the game
    };

    // Stop the game
    const stopGame = () => {
        setIsGameRunning(false); // Stop the game
    };

    // Main game loop using useEffect
    useEffect(() => {
        if (!isGameRunning) return; // Exit if the game is not running

        const loadImageAndStartTimer = async () => {
            await fetchImage(); // Fetch the initial image
            console.log('Image fetched!');

            const interval = setInterval(async () => {
                setTimeLeft((prevTime) => {
                    if (prevTime + 1 >= ROUND_TIME) {
                        clearInterval(interval); // Stop the timer when round ends
                        setIsGameRunning(false); // End the game
                        console.log('Round over!');
                        return ROUND_TIME;
                    }
                    return prevTime + 1; // Increment elapsed time
                });

                if (timeLeft % IMAGE_UPDATE_INTERVAL === 0) {
                    await fetchImage(); // Update the image every few seconds
                }
            }, 1000); // Run every second

            return () => clearInterval(interval);
        };

        loadImageAndStartTimer();
    }, [isGameRunning]);

    // Fetch the generated image from the API
    const fetchImage = async () => {
        try {
            const response = await fetch('/api/generate');
            const data = await response.json();
            setImage(data.image);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    // Example: Handle user actions (e.g., scoring points)
    const handleAction = () => {
        if (isGameRunning) {
            // incrementScore(); // Increment score
        }
    };

    return (
        <>
            <div className="flex flex-col w-full self-center items-center justify-items-center gap-4 font-[family-name:var(--font-geist-sans)]">
                <h1 className="text-center font-[family-name:var(--font-geist-mono)]">
                    Guesscasso
                </h1>
                <p className="w-200 text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
                    Time left: {timeLeft} seconds
                    <br></br>
                    Round: {numRounds}
                    <br></br>
                    Score: {score}
                </p>
                <div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Guess:', e.target[0].value);
                            handleAction(e.target[0].value);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Enter your guess"
                            className="rounded-md bg-gray-200 p-2 disabled:opacity-50"
                            disabled={!isGameRunning}
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                        />

                        <input type="submit" disabled={!isGameRunning} hidden />
                    </form>
                </div>
                {image && (
                    <>
                        <Image src={image} alt="Generated Image" width={500} height={500} />
                    </>
                )}
            </div>

            <div className="flex flex-col w-full self-center items-center justify-items-center gap-4 font-[family-name:var(--font-geist-sans)]">
                {!isGameRunning ? (
                    <button
                        onClick={startGame}
                        className="rounded-md bg-gray-200 p-2"
                    >
                        {numRounds == 0 ? 'Start Game' : 'Next Round'}
                    </button>
                ) : (
                    <button
                        onClick={stopGame}
                        className="rounded-md bg-gray-200 p-2"
                    >
                        Stop Game
                    </button>
                )}

                {!isGameRunning && timeLeft >= ROUND_TIME ? (
                    <p>Round over! Final Score: {score}</p>
                ) : null}
            </div>
        </>
    );
}

export default Game;
