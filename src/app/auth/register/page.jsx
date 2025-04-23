"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || "Registration failed");
      }

      // Then, sign in the user
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/select-role");
    } catch (err) {
      setError(err.message);
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

      <div className="w-[90%] max-w-[500px] p-[40px_30px] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-[15px] shadow-[0_15px_25px_rgba(0,0,0,0.6)] relative z-10 backdrop-blur-sm border border-[#222] overflow-hidden">
        {/* Marble effect */}
        <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-[#ff7800] via-[#ffa500] to-[#ff7800] bg-[length:200%_100%]"></div>

        {/* Logo */}
        <div className="text-center mb-[20px] flex flex-col items-center">
          <h1 className="text-[28px] font-bold tracking-[2px] spartacus-font relative inline-block overflow-hidden after:content-[''] after:absolute after:w-1/2 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#ff7800] after:to-transparent after:bottom-[-8px] after:left-1/4">
            ANTIQUE <span className="text-[#ff7800]">BODY</span>
          </h1>
          <div className="text-[12px] font-normal tracking-[2px] text-[#777] mt-[5px] uppercase">
            CREATE YOUR ACCOUNT
          </div>
        </div>

        <div>
          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isLogin={false}
          />
        </div>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#ff7800] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
