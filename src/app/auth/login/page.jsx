"use client";

import React from "react";
import Background from "@/components/background";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative bg-[#0a0a0a] text-white">
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
        column={false}
        vase={false}
      />

      <div className="w-[90%] max-w-[420px] p-[40px_30px] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-[15px] shadow-[0_15px_25px_rgba(0,0,0,0.6)] relative z-10 backdrop-blur-sm border border-[#222] overflow-hidden opacity-0 translate-y-5 animate-[0.8s_ease_forwards_fadeIn,1s_ease_forwards_floatUp]">
        {/* Marble effect */}
        <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#ff7800] via-[#ffa500] to-[#ff7800] bg-[length:200%_100%] animate-[2s_linear_infinite_shimmer]"></div>

        {/* Copper detail */}
        <div className="absolute w-[150px] h-[150px] bg-[radial-gradient(circle,rgba(184,115,51,0.05)_0%,transparent_70%)] rounded-full top-[-75px] right-[-75px] z-0"></div>

        {/* Gold detail */}
        <div className="absolute w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(255,215,0,0.05)_0%,transparent_70%)] rounded-full bottom-[-50px] left-[-50px] z-0"></div>

        {/* Logo */}
        <div className="text-center mb-[30px] flex flex-col items-center">
          <h1 className="text-[28px] font-bold tracking-[2px] relative inline-block overflow-hidden after:content-[''] after:absolute after:w-1/2 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#ff7800] after:to-transparent after:bottom-[-8px] after:left-1/4">
            ANTIQUE <span className="text-[#ff7800]">BODY</span>
          </h1>
          <div className="text-[12px] font-normal tracking-[2px] text-[#777] mt-[5px] uppercase">
            STRENGTH OF THE ANCIENTS
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mb-[25px] relative z-[1]">
          <div className="flex-1 text-center py-3 px-0 cursor-pointer transition-all duration-300 font-medium text-[#ff7800]">
            TRAINER
          </div>
          <div className="flex-1 text-center py-3 px-0 cursor-pointer transition-all duration-300 font-medium text-[#777]">
            USER
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-[3px] bg-[#ff7800] transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]"></div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Login page placeholder - complete version will be implemented in the
          LoginContainer and LoginForm components
        </p>
      </div>

      {/* Add keyframe animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(20px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
