"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Background from "@/components/background";
import { AuthForm, Card } from "@/components/custom";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

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
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("auth.login.code_send_error"));
      }

      setCodeSent(true);
    } catch (err) {
      console.error("Error sending code:", err);
      setCodeError(err.message);
      setCodeSent(false);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const requestBody = {
        name: data.firstName,
        lastName: data.lastName,
        code: verificationCode,
        ...(data.email
          ? {
              email: data.email,
              password: data.password,
            }
          : {
              phone: data.phone,
            }),
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Registration failed");
      }

      // After successful registration, sign in the user
      const signInResult = await signIn(data.email ? "email" : "phone", {
        ...(data.email
          ? {
              email: data.email,
              password: data.password,
            }
          : {
              phone: data.phone,
              code: verificationCode,
            }),
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // Redirect to select-role page after successful registration and sign in
      router.push("/select-role");
    } catch (err) {
      console.error("Register - Error:", err);
      setError(err.message || "Registration failed");
      setCodeSent(false);
      setVerificationCode("");
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
          logoTagline="STRENGTH OF THE ANCIENTS"
        >
          <h1 className="text-2xl font-bold mb-2 text-center">
            {t("auth.register.create_account")}
          </h1>
          <p className="text-gray-400 mb-8 text-center">
            {t("auth.register.join_fitness_community")}
          </p>

          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            isLogin={false}
            onSendCode={handleSendCode}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            codeSent={codeSent}
            sendingCode={sendingCode}
            codeError={codeError}
            phoneOnly={false}
          />

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {t("auth.register.have_account")}{" "}
              <Link
                href="/auth/login"
                className="text-[#ff7800] hover:text-[#ff5f00] transition-colors"
              >
                {t("auth.register.sign_in")}
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
