"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { Button } from "@/components/common/index";
import { Card } from "@/components/custom/index";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const handleSubmit = async data => {
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

      const responseData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      // Set registered email for the success message
      setRegisteredEmail(data.email);
      setRegistrationSuccess(true);

      // Don't auto-sign in, wait for email verification
    } catch (err) {
      console.error("Register - Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendingEmail(true);
    setResendSuccess(false);
    setResendError("");

    try {
      const response = await fetch("/api/email-verification/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: registeredEmail }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      setResendSuccess(true);
    } catch (err) {
      console.error("Resend email error:", err);
      setResendError(err.message);
    } finally {
      setResendingEmail(false);
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
          {registrationSuccess ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-500/20 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-semibold text-green-500">Registration Successful!</h2>
              <p className="mb-2 text-gray-400">We've sent a verification email to:</p>
              <p className="mb-6 font-medium text-white">{registeredEmail}</p>
              <p className="mb-6 text-gray-400">
                Please check your inbox and click the verification link to activate your account.
              </p>

              {resendSuccess ? (
                <div className="mb-6 rounded-lg bg-green-500/10 p-3">
                  <p className="text-green-500">Verification email sent again! Please check your inbox.</p>
                </div>
              ) : resendError ? (
                <div className="mb-6 rounded-lg bg-red-500/10 p-3">
                  <p className="text-red-500">{resendError}</p>
                </div>
              ) : null}

              <div className="space-y-3">
                <Button onClick={handleResendEmail} loading={resendingEmail} variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
                <Link
                  href="/auth/login"
                  className="inline-block w-full rounded-lg bg-gradient-to-r from-[#ff7800] to-[#ff5f00] px-6 py-3 font-medium text-white transition-all hover:from-[#ff5f00] hover:to-[#ff7800] hover:shadow-lg"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-8 text-center text-gray-400">Join our fitness community and start your journey today</p>

              <AuthForm onSubmit={handleSubmit} loading={loading} error={error} isLogin={false} />

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-[#ff7800] transition-colors hover:text-[#ff5f00]">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
