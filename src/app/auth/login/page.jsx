"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { Button } from "@/components/common/index";
import { Card } from "@/components/custom/index";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState("");
  const [manualFixingVerification, setManualFixingVerification] = useState(false);
  const [currentLoginEmail, setCurrentLoginEmail] = useState("");

  const handleSubmit = async data => {
    setLoading(true);
    setError("");
    setCurrentLoginEmail(data.email);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("not verified") || result.error.includes("verify")) {
          try {
            const resetResponse = await fetch(`/api/email-verification/resend`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: data.email }),
              cache: "no-store",
            });

            const resetData = await resetResponse.json();

            if (resetResponse.ok) {
              setError("Verification email sent. Please check your inbox and verify your email before logging in.");
              return;
            } else {
              console.error("Verification reset error:", resetData.message);
            }
          } catch (fixError) {
            console.error("Verification fix error:", fixError);
          }
        }

        throw new Error(result.error);
      }

      router.push("/select-role");
    } catch (err) {
      console.error("Login - Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    setForgotPasswordStatus("sending");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setForgotPasswordStatus("success");
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
        setForgotPasswordStatus("");
      }, 3000);
    } catch (err) {
      setForgotPasswordStatus("error");
      console.error("Forgot password error:", err);
    }
  };

  const handleManualVerification = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/email-verification/resend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: currentLoginEmail }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification email");
      }

      setError("Verification email sent. Please check your inbox and verify your email before logging in.");
    } catch (err) {
      console.error("Verification error:", err);
      setError("Failed to send verification email. Please contact support.");
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
