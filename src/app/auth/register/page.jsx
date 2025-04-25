"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { Card } from "@/components/custom/index";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

      // Let the middleware handle the redirect based on user role
      router.push("/");
    } catch (err) {
      console.error("Register - Error:", err);
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
        <Card
          className="w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl"
          borderTop={true}
          showLogo={true}
          logoTagline="STRENGTH OF THE ANCIENTS">
          <p className="text-gray-400 mb-8 text-center">
            Join our fitness community and start your journey today
          </p>

          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isLogin={false}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#ff7800] hover:text-[#ff5f00] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
