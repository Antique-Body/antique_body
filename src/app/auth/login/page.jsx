"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { signIn } from "next-auth/react";
import { Card } from "@/components/custom/index";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Let the middleware handle the redirect based on user role
      router.push("/");
    } catch (err) {
      console.error("Login - Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white relative">
      <Background
        parthenon={true}
        runner={true}
        discus={true}
        colosseum={true}
        column={false}
        vase={false}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center spartacus-font text-[#ff7800]">
            Welcome Back
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            Sign in to continue your fitness journey
          </p>

          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isLogin={true}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[#ff7800] hover:text-[#ff5f00] transition-colors">
                Register
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
