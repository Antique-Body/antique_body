"use client";

import React, { useState } from "react";
import Background from "@/components/background";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-[28px] font-bold tracking-[2px] spartacus-font relative inline-block overflow-hidden after:content-[''] after:absolute after:w-1/2 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#ff7800] after:to-transparent after:bottom-[-8px] after:left-1/4">
            ANTIQUE <span className="text-[#ff7800]">BODY</span>
          </h1>
          <div className="text-[12px] font-normal tracking-[2px] text-[#777] mt-[5px] uppercase">
            STRENGTH OF THE ANCIENTS
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded focus:outline-none focus:border-[#ff7800] text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-[#1a1a1a] border border-[#333] rounded focus:outline-none focus:border-[#ff7800] text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff7800] to-[#ff5f00] py-2 rounded font-medium text-white hover:from-[#ff5f00] hover:to-[#ff7800] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#ff7800] hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
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
