"use client";

import Background from "@/components/background";
import { Button } from "@/components/common/index";
import { Card } from "@/components/custom/index";
import { FormField } from "@/components/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Invalid Reset Link</h2>
              <p className="text-gray-400 mb-4">
                This password reset link is invalid or has expired.
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="text-[#ff7800] hover:text-[#ff5f00] transition-colors">
                Return to Login
              </button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

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
          {success ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4 text-green-500">
                Password Reset Successful
              </h2>
              <p className="text-gray-400">
                Your password has been reset successfully. Redirecting to
                login...
              </p>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Reset Password
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  id="password"
                  name="password"
                  label="New Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="Enter your new password"
                  error={
                    error && error.includes("Password must be") ? error : ""
                  }
                  className="w-full"
                />
                <FormField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Confirm your new password"
                  error={
                    error && error.includes("Passwords do not match")
                      ? error
                      : ""
                  }
                />
                {error &&
                  !error.includes("Password must be") &&
                  !error.includes("Passwords do not match") && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                <Button
                  type="submit"
                  loading={loading}
                  variant="primary"
                  className="w-full">
                  Reset Password
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
