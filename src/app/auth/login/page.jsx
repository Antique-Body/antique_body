"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EffectBackground } from "@/components/background";
import { Button, Card } from "@/components/common";
import { FormField } from "@/components/common/FormField";
import { AuthForm } from "@/components/custom/auth/components/AuthForm";

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const startResendCountdown = () => {
    setResendDisabled(true);
    setResendCountdown(30);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordStatus("sending");
    setResendDisabled(false);

    try {
      const response = await fetch("/api/auth/password-reset", {
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
    } catch (err) {
      setForgotPasswordStatus("error");
      console.error("Forgot password error:", err);
    }
  };

  const handleResendToken = async () => {
    if (resendDisabled) return;

    setForgotPasswordStatus("sending");
    setResendDisabled(true);

    try {
      const response = await fetch("/api/auth/password-reset", {
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
      startResendCountdown();
    } catch (err) {
      setForgotPasswordStatus("error");
      setResendDisabled(false);
      console.error("Resend token error:", err);
    }
  };

  const handleSendCode = async (phone) => {
    if (!phone) {
      setCodeError(t("validation.phone_required"));
      return;
    }

    setCodeError("");
    setSendingCode(true);
    try {
      const response = await fetch("/api/auth/send-verification-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, mode: "login" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("auth.login.code_send_error"));
      }

      setCodeSent(true);
      setVerificationCode(""); // Reset verification code when sending new one
    } catch (err) {
      console.error("Error sending code:", err);
      setCodeError(err.message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      console.log("[login] Attempting login with data:", data);

      let result;
      if (data.email) {
        // Email login - no verification code needed
        result = await signIn("email", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
      } else {
        // Phone login - verification code required
        if (!verificationCode) {
          throw new Error(t("validation.verification_code_required"));
        }

        result = await signIn("phone", {
          phone: data.phone,
          code: verificationCode,
          redirect: false,
        });
      }

      console.log("[login] SignIn result:", result);

      if (result?.error) {
        console.error("[login] SignIn error:", result.error);
        throw new Error(result.error);
      }

      if (result?.ok) {
        console.log("[login] SignIn successful, redirecting to /select-role");
        // Wait a bit for session to be established
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/select-role");
      } else {
        console.error("[login] SignIn not successful:", result);
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error("Login - Error:", err);
      // Custom error message for 'Configuration' error
      if (err.message === "Configuration") {
        setError("Invalid email or password");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#161616] text-white relative">
      <EffectBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card
          className="w-full max-w-md p-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800/70 rounded-xl shadow-2xl"
          borderTop={true}
          showLogo={true}
          logoTagline="STRENGTH OF THE ANCIENTS"
        >
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
                  <FormField
                    type="email"
                    name="forgotPasswordEmail"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full mb-0"
                    backgroundStyle="darker"
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
                  variant="primary"
                  fullWidth
                >
                  {forgotPasswordStatus === "sending"
                    ? t("auth.form.sending")
                    : t("auth.form.submit")}
                </Button>
                {forgotPasswordStatus === "success" && (
                  <Button
                    type="button"
                    onClick={handleResendToken}
                    disabled={resendDisabled}
                    variant="secondary"
                    fullWidth
                  >
                    {resendDisabled
                      ? `${t("auth.password_reset.resend_countdown", {
                          count: resendCountdown,
                        })}`
                      : t("auth.password_reset.resend_token")}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setForgotPasswordStatus("");
                    setResendDisabled(false);
                    setResendCountdown(0);
                  }}
                  variant="secondary"
                  fullWidth
                >
                  {t("auth.login.back_to_login")}
                </Button>
              </form>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2 text-center">
                {t("auth.login.welcome_back")}
              </h1>
              <p className="text-gray-400 mb-8 text-center">
                {t("auth.login.sign_in_to_account")}
              </p>

              <AuthForm
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                isLogin={true}
                onSendCode={handleSendCode}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                codeSent={codeSent}
                sendingCode={sendingCode}
                codeError={codeError}
                phoneOnly={false}
              />

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  variant="ghostOrange"
                >
                  {t("auth.login.forgot_password")}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {t("auth.login.no_account")}{" "}
                  <Link
                    href="/auth/register"
                    className="text-[#ff7800] hover:text-[#ff5f00] transition-colors"
                  >
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
