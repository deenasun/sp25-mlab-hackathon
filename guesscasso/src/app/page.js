'use client';

config();

import Image from 'next/image';
import { GameProvider } from './gameContext';
import Game from './game';
import { config } from 'dotenv';

export default function Home() {
    return (
        <div className="grid grid-rows-[15px_1fr_15px] items-center justify-items-center min-h-screen p-6 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-4 row-start-2 items-center">
                <Image
                    src="/wordlogo.svg"
                    alt="Guesscaso logo"
                    width={360}
                    height={120}
                    priority
                />
                <GameProvider>
                    <Game />
                </GameProvider>
            </main>
        </div>
    );
}
