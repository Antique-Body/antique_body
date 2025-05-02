"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import Background from "@/components/background";
import { Button } from "@/components/common/index";
import { Card } from "@/components/custom/index";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState("");
  const [manualFixingVerification, setManualFixingVerification] = useState(false);
  const [currentLoginEmail, setCurrentLoginEmail] = useState("");



  const handleSubmit = async (data) => {
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
        if (
          result.error.includes("not verified") ||
          result.error.includes("verify")
        ) {
          try {
            const resetResponse = await fetch(
              `/api/email-verification/resend`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
                cache: "no-store",
              }
            );

            const resetData = await resetResponse.json();

            if (resetResponse.ok) {
              setError(t("auth.register.verification_email_sent"));
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

  const handleForgotPassword = async (e) => {
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
        throw new Error(data.error || t("auth.password_reset.failed"));
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
        throw new Error(data.message || t("auth.register.verification_email_failed"));
      }

      setError(t("auth.register.verification_email_sent"));
    } catch (err) {
      console.error("Verification error:", err);
      setError(t("auth.register.verification_email_failed"));
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
          {showForgotPassword ? (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {t("auth.password_reset.title")}
              </h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {t("auth.form.email")}
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7800]"
                    required
                  />
                </div>
                {forgotPasswordStatus === "error" && (
                  <p className="text-red-500 text-sm">
                    {t("auth.password_reset.failed")}
                  </p>
                )}
                {forgotPasswordStatus === "success" && (
                  <p className="text-green-500 text-sm">
                    {t("auth.password_reset.instructions")}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={forgotPasswordStatus === "sending"}
                  loading={forgotPasswordStatus === "sending"}
                  className="w-full">
                  {t("auth.form.submit")}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setForgotPasswordStatus("");
                  }}
                  className="w-full">
                  {t("auth.login.back_to_login")}
                </Button>
              </form>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-8 text-center" >
                {t("auth.login.sign_in_to_account")}
              </p>

              <AuthForm
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                isLogin={true}
              />

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-gray-400 hover:text-[#ff7800] transition-colors duration-300 cursor-pointer">
                  {t("auth.login.forgot_password")}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400" >
                  {t("auth.login.no_account")}{" "}
                  <Link
                    href="/auth/register"
                    className="text-[#ff7800] hover:text-[#ff5f00] transition-colors">
                    {t("auth.register.title")}
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
