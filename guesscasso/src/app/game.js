import React, { useState, useEffect, useContext, useRef } from 'react';
import Image from 'next/image';
import { GameContext } from './gameContext';

function Game() {
    const ROUND_TIME = 10; // Round duration in seconds
    const IMAGE_UPDATE_INTERVAL = 2; // Interval to update the image in seconds

    const [timeLeft, setTimeLeft] = useState(0); // Time elapsed in the current round
    const [isGameRunning, setIsGameRunning] = useState(false); // Whether the game is running
    const [guess, setGuess] = useState(''); // User's guess
    const [answer, setAnswer] = useState(''); // Correct answer
    const [image, setImage] = useState(''); // Generated image

    const { score, numRounds, addToScore, resetScore, incrementRounds } =
        useContext(GameContext);

    const isGameRunningRef = useRef(isGameRunning);
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        isGameRunningRef.current = isGameRunning;
    }, [isGameRunning]);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    // Start the game
    const startGame = () => {
        setTimeLeft(ROUND_TIME); // Reset timer
        incrementRounds(); // Increment the number of rounds
        setGuess(''); // Reset the user's guess
        setImage(''); // Reset the image
        setIsGameRunning(true); // Start the game
    };

    const stopGame = () => {
        setIsGameRunning(false);
    };

    // Main game loop using useEffect
    useEffect(() => {
        if (!isGameRunning) return; // Exit if the game is not running

        const loadImageAndStartTimer = async () => {
            await fetchImage(); // Fetch the initial image
            console.log('Image fetched!');

            const interval = setInterval(async () => {
                if (!isGameRunningRef.current) {
                    clearInterval(interval); // Stop the interval if the game is not running
                    return;
                }
                setTimeLeft((prevTime) => {
                    if (prevTime - 1 <= 0) {
                        clearInterval(interval); // Stop the timer when round ends
                        setIsGameRunning(false); // End the game
                        return ROUND_TIME;
                    }
                    return prevTime - 1; // Increment elapsed time
                });

                // if (timeLeft % IMAGE_UPDATE_INTERVAL === 0) {
                //     await fetchImage(); // Update the image every few seconds
                // }
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
            setAnswer(data.answer);
            setImage(data.image);
            console.log("ANSWER: ", data.answer);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const checkAnswer = async (userGuess) => {
        try {
            const response = await fetch('/api/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answer,
                    userGuess,
                }),
            });
            const data = await response.json();
            if (data.score == 1) {
                const additonalScore = timeLeftRef.current * 10;
                addToScore(additonalScore)
                stopGame();
            }

        } catch (error) {
            console.error('Error checking answer:', error);
        }
    }

    const handleAction = (submittedGuess) => {
        if (isGameRunning) {
            checkAnswer(submittedGuess);
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
