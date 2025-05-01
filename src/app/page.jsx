"use client";
import Background from "@/components/background";
import { Navbar } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative">
      <Navbar />
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
        column={false}
        vase={false}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 spartacus-font">
          Welcome to <span className="text-[#ff7800]">ANTIQUE BODY</span>
        </h1>

        <div className="text-xl mb-8 text-gray-300">
          Your personalized fitness journey inspired by ancient wisdom
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff7800]">
              Personalized Training
            </h3>
            <p className="text-gray-300">
              Get a custom workout plan tailored to your goals and fitness level
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff7800]">
              Expert Guidance
            </h3>
            <p className="text-gray-300">
              Access professional trainers and track your progress
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff7800]">
              Ancient Wisdom
            </h3>
            <p className="text-gray-300">
              Incorporate time-tested training methods from ancient
              civilizations
            </p>
          </div>
        </div>

        <div className="space-x-4 w-full">
          <a
            href="/auth/register"
            className="bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-8 py-3 rounded font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300">
            Get Started
          </a>
          <a
            href="/auth/login"
            className="border border-[#ff7800] px-8 py-3 rounded font-medium text-white hover:bg-[#ff7800] transition-all duration-300">
            Learn More
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
