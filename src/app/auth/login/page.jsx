"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { Card } from "@/components/custom/index";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async data => {
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
    <main className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white">
      <Background parthenon={true} runner={true} discus={true} colosseum={true} column={false} vase={false} />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <Card
          className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-md"
          borderTop={true}
          showLogo={true}
          logoTagline="STRENGTH OF THE ANCIENTS"
        >
          <p className="mb-8 text-center text-gray-400">Sign in to continue your fitness journey</p>

          <AuthForm onSubmit={handleSubmit} loading={loading} error={error} isLogin={true} />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-[#ff7800] transition-colors hover:text-[#ff5f00]">
                Register
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
