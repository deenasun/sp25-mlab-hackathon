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
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex mt-2 items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/deenasun/piguesso"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          PiGuesso on Github
        </a>
      </footer>
        </div>
    );
}
