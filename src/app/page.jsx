"use client";
import { Navbar } from "@/components";
import Background from "@/components/background";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <Background parthenon={true} runner={true} discus={true} colosseum={true} column={false} vase={false} />

      <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center">
        <h1 className="spartacus-font mb-6 text-5xl font-bold">
          Welcome to <span className="text-[#ff7800]">ANTIQUE BODY</span>
        </h1>

        <div className="mb-8 text-xl text-gray-300">Your personalized fitness journey inspired by ancient wisdom</div>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-[#333] bg-[#1a1a1a] p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#ff7800]">Personalized Training</h3>
            <p className="text-gray-300">Get a custom workout plan tailored to your goals and fitness level</p>
          </div>

          <div className="rounded-lg border border-[#333] bg-[#1a1a1a] p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#ff7800]">Expert Guidance</h3>
            <p className="text-gray-300">Access professional trainers and track your progress</p>
          </div>

          <div className="rounded-lg border border-[#333] bg-[#1a1a1a] p-6">
            <h3 className="mb-3 text-xl font-semibold text-[#ff7800]">Ancient Wisdom</h3>
            <p className="text-gray-300">Incorporate time-tested training methods from ancient civilizations</p>
          </div>
        </div>

        <div className="w-full space-x-4">
          <a
            href="/auth/register"
            className="rounded bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-8 py-3 font-medium text-white transition-all duration-300 hover:from-[#ff5f00] hover:to-[#ff7800]"
          >
            Get Started
          </a>
          <a
            href="/auth/login"
            className="rounded border border-[#ff7800] px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-[#ff7800]"
          >
            Learn More
          </a>
        </div>
      </div>

      <style jsx>{`
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
