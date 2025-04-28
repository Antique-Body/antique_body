"use client";

import { useRef, useState } from "react";

export const AudioPlayButton = ({ audioSrc }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch((error) => {
                    console.log("Audio playback error:", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            {/* Gladiator soundtrack */}
            <audio
                ref={audioRef}
                src={audioSrc}
                loop
                className="cursor-pointer"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Audio control button */}
            <button
                onClick={toggleAudio}
                className="z-20 bg-gradient-to-r from-[#b87333] to-[#ffd700] p-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 focus:outline-none border-2 border-[#ff7800] cursor-pointer"
                aria-label={isPlaying ? "Pause gladiator music" : "Play gladiator music"}
            >
                {isPlaying ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                )}
            </button>
        </>
    );
};
