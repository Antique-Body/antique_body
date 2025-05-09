"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/common/index";
import { Card } from "@/components/custom/index";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

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

      const responseData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(responseData.error || t("register_failed"));
      }

      setRegisteredEmail(data.email);
      setRegistrationSuccess(true);
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
        throw new Error(data.error || t("verification_email_failed"));
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
    <main className="min-h-screen bg-gradient-to-b  text-white relative">
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card
          className="w-full max-w-md p-8 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl"
          borderTop={true}
          showLogo={true}
          logoTagline="STRENGTH OF THE ANCIENTS">
          {registrationSuccess ? (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-green-500">
                {t("registration_successful")}
              </h2>
              <p className="text-gray-400 mb-2">
                {t("auth.register.verification.email_sent_to")}
              </p>
              <p className="font-medium text-white mb-6">{registeredEmail}</p>
              <p className="text-gray-400 mb-6">
                {t("check_inbox_verification")}
              </p>

              {resendSuccess ? (
                <div className="mb-6 p-3 bg-green-500/10 rounded-lg">
                  <p className="text-green-500">
                    {t("verification_email_sent_again")}
                  </p>
                </div>
              ) : resendError ? (
                <div className="mb-6 p-3 bg-red-500/10 rounded-lg">
                  <p className="text-red-500">{resendError}</p>
                </div>
              ) : null}

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  loading={resendingEmail}
                  variant="outline"
                  className="w-full">
                  {t("resend_verification_email")}
                </Button>
                <Link
                  href="/auth/login"
                  className="inline-block w-full bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:from-[#ff5f00] hover:to-[#ff7800]">
                  {t("go_to_login")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-8 text-center">
                {t("auth.register.join_fitness_community")}
              </p>

              <AuthForm
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                isLogin={false}
              />

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {t("auth.register.have_account")}{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#ff7800] hover:text-[#ff5f00] transition-colors">
                    {t("auth.register.sign_in")}
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
