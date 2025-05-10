"use client";
import { BrandLogo } from "@components/custom";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { EffectBackground } from "@/components/background";

const loadingTexts = [
    "Analiziramo vaš fitnes profil",
    "Identifikujemo optimalne obrasce treninga",
    "Prilagođavamo intenzitet vežbi",
    "Biramo idealne vežbe za vaše ciljeve",
    "Optimizujemo protokole oporavka",
    "Finaliziramo vaš personalizovani program",
    "Pripremamo vašu trening tablu",
];

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState(loadingTexts[0]);
    const router = useRouter();
    const interval = useRef(null);
    const textInterval = useRef(null);

    useEffect(() => {
        // Progress bar animation
        interval.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval.current);
                    return 100;
                }
                return prev + 1;
            });
        }, 100); // 10 seconds total (100 * 100ms)

        // Text rotation
        let textIndex = 0;
        textInterval.current = setInterval(() => {
            textIndex = (textIndex + 1) % loadingTexts.length;
            setLoadingText(loadingTexts[textIndex]);
        }, 1400);

        // Redirect after 10 seconds
        const timer = setTimeout(() => {
            router.push("/user/dashboard");
        }, 10000);

        return () => {
            clearInterval(interval.current);
            clearInterval(textInterval.current);
            clearTimeout(timer);
        };
    }, [router]);

    return (
        <div className="min-h-screen  text-white flex flex-col relative overflow-hidden">
            <EffectBackground />

            {/* Enhanced background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] opacity-[0.03] blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-[#3498db] opacity-[0.02] blur-2xl animate-float-slow"></div>
                <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full bg-[#9d4edd] opacity-[0.02] blur-2xl animate-float-slow-reverse"></div>

                {/* Particle effects */}
                <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-white rounded-full opacity-40 animate-twinkle"></div>
                <div
                    className="absolute top-[25%] left-[40%] w-1.5 h-1.5 bg-white rounded-full opacity-30 animate-twinkle"
                    style={{ animationDelay: "0.7s" }}
                ></div>
                <div
                    className="absolute top-[15%] right-[30%] w-1 h-1 bg-white rounded-full opacity-40 animate-twinkle"
                    style={{ animationDelay: "1.3s" }}
                ></div>
                <div
                    className="absolute top-[70%] left-[25%] w-1.5 h-1.5 bg-white rounded-full opacity-30 animate-twinkle"
                    style={{ animationDelay: "0.9s" }}
                ></div>
                <div
                    className="absolute top-[60%] right-[20%] w-1 h-1 bg-white rounded-full opacity-40 animate-twinkle"
                    style={{ animationDelay: "1.7s" }}
                ></div>
                <div
                    className="absolute top-[80%] right-[35%] w-1.5 h-1.5 bg-white rounded-full opacity-30 animate-twinkle"
                    style={{ animationDelay: "2.1s" }}
                ></div>
            </div>

            <div className="max-w-md mx-auto px-5 py-12 flex flex-col items-center justify-center flex-grow z-10">
                <div className="animate-fade-in-up">
                    <BrandLogo size="large" />
                </div>

                {/* Card container for content */}
                <div
                    className="w-full mt-12 p-8 bg-gradient-to-b from-[#161616] to-[#0a0a0a] border border-[#333] rounded-2xl shadow-xl animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                >
                    <div className="w-full relative mb-10">
                        <div className="flex justify-between text-xs text-gray-400 mb-3">
                            <span>Kreiranje programa</span>
                            <span className="font-medium text-white">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] rounded-full transition-all duration-300 ease-out shadow-glow"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="w-full text-center mb-8 min-h-[7rem] flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center h-8 mb-1">
                            <p className="text-lg font-medium animate-fade-in">{loadingText}</p>
                        </div>
                        <p className="text-gray-400 text-sm mt-4 max-w-[90%]">
                            Kreiramo vaš personalizovani plan treninga na osnovu vaših ciljeva, iskustva i preferencija
                        </p>
                    </div>

                    {/* Animated circular AI processor */}
                    <div
                        className="flex justify-center mt-4 mb-6 relative py-4 animate-fade-in-up"
                        style={{ animationDelay: "0.4s" }}
                    >
                        <div className="relative flex items-center justify-center">
                            {/* Orbital rings */}
                            <div className="absolute w-40 h-40 rounded-full border border-[#333] animate-spin-very-slow"></div>
                            <div className="absolute w-32 h-32 rounded-full border border-[#444] animate-spin-slow-reverse"></div>

                            {/* Moving particles on the rings */}
                            <div className="absolute w-40 h-40 animate-spin-very-slow">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF6B00] rounded-full shadow-glow-orange"></div>
                            </div>
                            <div className="absolute w-32 h-32 animate-spin-slow-reverse" style={{ animationDelay: "0.5s" }}>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3498db] rounded-full shadow-glow-blue"></div>
                            </div>

                            {/* Central AI node */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#111] to-[#222] border border-[#333] flex items-center justify-center shadow-xl">
                                <div className="w-16 h-16 rounded-full bg-gradient-radial from-[#FF6B00] to-transparent opacity-10 absolute animate-pulse-slow"></div>
                                <div className="z-10 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]">
                                    AI
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated fitness icons */}
                <div
                    className="flex items-center justify-center gap-8 mt-10 animate-fade-in-up"
                    style={{ animationDelay: "0.6s" }}
                >
                    <div className="animate-float">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF6B00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-glow-orange"
                        >
                            <path d="M6 5H4a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5H4v8h2v-8zm12-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8zm-6-5h-2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2zm0 5h-2v8h2v-8z"></path>
                        </svg>
                    </div>
                    <div className="animate-float" style={{ animationDelay: "0.2s" }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3498db"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-glow-blue"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <div className="animate-float" style={{ animationDelay: "0.4s" }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#9d4edd"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-glow-purple"
                        >
                            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                        </svg>
                    </div>
                    <div className="animate-float" style={{ animationDelay: "0.6s" }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2ecc71"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-glow-green"
                        >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                            <line x1="9" y1="9" x2="9.01" y2="9"></line>
                            <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                    </div>
                </div>
            </div>

            {/* CSS animations */}
            <style jsx>{`
                @keyframes pulse-slow {
                    0%,
                    100% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 0.1;
                    }
                }

                @keyframes float {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes float-slow {
                    0%,
                    100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(20px, -20px);
                    }
                }

                @keyframes float-slow-reverse {
                    0%,
                    100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(-20px, 20px);
                    }
                }

                @keyframes spin-very-slow {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes spin-slow-reverse {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(-360deg);
                    }
                }

                @keyframes twinkle {
                    0%,
                    100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1.3);
                    }
                }

                @keyframes fade-in {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }

                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 2s ease-in-out infinite;
                }

                .animate-float-slow {
                    animation: float-slow 20s ease-in-out infinite;
                }

                .animate-float-slow-reverse {
                    animation: float-slow-reverse 15s ease-in-out infinite;
                }

                .animate-spin-very-slow {
                    animation: spin-very-slow 12s linear infinite;
                }

                .animate-spin-slow-reverse {
                    animation: spin-slow-reverse 10s linear infinite;
                }

                .animate-twinkle {
                    animation: twinkle 4s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }

                .shadow-glow {
                    box-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
                }

                .shadow-glow-orange {
                    filter: drop-shadow(0 0 3px rgba(255, 107, 0, 0.7));
                }

                .shadow-glow-blue {
                    filter: drop-shadow(0 0 3px rgba(52, 152, 219, 0.7));
                }

                .shadow-glow-purple {
                    filter: drop-shadow(0 0 3px rgba(157, 78, 221, 0.7));
                }

                .shadow-glow-green {
                    filter: drop-shadow(0 0 3px rgba(46, 204, 113, 0.7));
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
