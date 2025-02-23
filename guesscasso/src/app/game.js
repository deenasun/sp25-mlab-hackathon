import React, { useState, useEffect, useContext, useRef } from 'react';
import Image from 'next/image';
import { GameContext } from './gameContext';

function Game() {
    const ROUND_TIME = 10; // Round duration in seconds
    const IMAGE_UPDATE_INTERVAL = 2; // Interval to update the image in seconds

    const [timeLeft, setTimeLeft] = useState(10); // Time elapsed in the current round
    const [isGameRunning, setIsGameRunning] = useState(false); // Whether the game is running
    const [guess, setGuess] = useState(''); // User's guess
    const [answer, setAnswer] = useState(''); // Correct answer
    const [image, setImage] = useState(''); // Generated image

    const { score, numRounds, addToScore, resetScore, incrementRounds, categories, correctWords } =
        useContext(GameContext);

    const isGameRunningRef = useRef(isGameRunning);

    useEffect(() => {
        isGameRunningRef.current = isGameRunning;
    }, [isGameRunning]);

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
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const checkAnswer = async (userGuess) => {
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
        console.log('Answer:', data);
    }

    const handleAction = (submittedGuess) => {
        if (isGameRunning) {
            checkAnswer(submittedGuess);
            if (submittedGuess === 'dog') {
                addToScore(50);
                stopGame();
            }
        }
    };

    const getTimeColor = () => {
        if (timeLeft > 10) return "text-green-500";  // Safe time
        if (timeLeft > 5) return "text-yellow-500"; // Warning
        return "text-red-500"; // Critical time
    };
    

    return (
        <>
            <div className="flex flex-col w-full self-center items-center justify-items-center gap-4 font-[family-name:var(--font-geist-sans)]">
                {(
                    <>
                        <Image src={image || '\placeholder.svg'} alt="Generated Image" width={450} height={225} layout="responsive" className="w-full max-w-[400px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"/>
                    </>
                )}
                <p className="w-200 text-sm text-center sm:text-center font-[family-name:var(--font-geist-mono)] text-2xl font-bold">
                    Round: {numRounds} | Score: {score}
                </p>
                <p className= {`text-2xl font-bold ${getTimeColor()} w-200 text-sm text-center sm:text-center font-[family-name:var(--font-geist-mono)]`}>
                    Time left: {timeLeft} seconds
                </p>
                


                <div className="flex items-center gap-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Guess:', e.target[0].value);
                            handleAction(e.target[0].value);
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Enter your guess"
                            className="rounded-md bg-gray-200 p-2 disabled:opacity-50 width: 400"
                            disabled={!isGameRunning}
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                        />

                        <input type="submit" disabled={!isGameRunning} hidden />
                    </form>
                
                {!isGameRunning ? (
                    <button
                        onClick={startGame}
                        className="rounded-md bg-green-100 p-2"
                    >
                        {numRounds == 0 ? 'Start Game' : 'Next Round'}
                    </button>
                ) : (
                    <button
                        onClick={stopGame}
                        className="rounded-md bg-red-100 p-2"
                    >
                        Stop Game
                    </button>
                )}
                </div>

                <div className="mt-4 text-center">
                    {isGameRunning ? (
                        <p className="text-sm text-gray-600">
                            Categories are{" "}
                            <span className="text-blue-600 font-bold">{categories[0]}</span> and{" "}
                            <span className="text-green-600 font-bold">{categories[1]}</span>.
                        </p>
                    ) : (
                        timeLeft >= ROUND_TIME && (
                            <div>
                                <p className="text-lg font-semibold text-black-500">
                                    Round over! Final Score: {score}
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Correct words were:{" "}
                                    <span className="text-blue-600 font-bold">{correctWords[0]}</span> and{" "}
                                    <span className="text-green-600 font-bold">{correctWords[1]}</span>.
                                </p>
                            </div>
                        )
                    )}
                </div>


            </div>
        </>
    );
}

export default Game;
