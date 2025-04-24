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

      const userResponse = await fetch("/api/users/me");
      const userData = await userResponse.json();

      if (!userData.role) {
        router.push("/select-role");
      } else {
        router.push(
          userData.role === "TRAINER" ? "/trainer-dashboard" : "/user-dashboard"
        );
      }
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

      <Card topBorderColor="#ff7800">
        <div className="text-center mb-[20px] flex flex-col items-center">
          <h1 className="text-[28px] font-bold tracking-[2px] spartacus-font relative inline-block overflow-hidden after:content-[''] after:absolute after:w-1/2 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#ff7800] after:to-transparent after:bottom-[-8px] after:left-1/4">
            ANTIQUE <span className="text-[#ff7800]">BODY</span>
          </h1>
          <div className="text-[12px] font-normal tracking-[2px] text-[#777] mt-[5px] uppercase">
            WELCOME BACK
          </div>
        </div>

        <div>
          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isLogin={true}
          />
        </div>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#ff7800] hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </main>
  );
}
