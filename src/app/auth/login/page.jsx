"use client";

import Background from "@/components/background";
import { AuthForm, Card } from "@/components/custom";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
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
      const response = await fetch("/api/auth/send-phone-code", {
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
      if (data.email) {
        // Email login - no verification code needed
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          // Extract the error message from the URL if it's a credentials error
          if (result.error === "CredentialsSignin") {
            const errorUrl = new URL(result.url);
            const errorMessage = errorUrl.searchParams.get("error");
            throw new Error(errorMessage || "Authentication failed");
          }
          throw new Error(result.error);
        }
      } else {
        // Phone login - verification code required
        if (!verificationCode) {
          throw new Error(t("validation.verification_code_required"));
        }

        // First verify the code
        const verifyResponse = await fetch("/api/auth/verify-phone-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: data.phone,
            code: verificationCode,
          }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || "Verification failed");
        }

        // If verification successful, proceed with sign in
        const result = await signIn("credentials", {
          phone: data.phone,
          code: verificationCode,
          redirect: false,
        });

        if (result?.error) {
          // Extract the error message from the URL if it's a credentials error
          if (result.error === "CredentialsSignin") {
            const errorUrl = new URL(result.url);
            const errorMessage = errorUrl.searchParams.get("error");
            throw new Error(errorMessage || "Authentication failed");
          }
          throw new Error(result.error);
        }
      }

      // Redirect to select-role page after successful login
      router.push("/select-role");
    } catch (err) {
      console.error("Login - Error:", err);
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
          logoTagline="STRENGTH OF THE ANCIENTS"
        >
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
        </Card>
      </div>
    </main>
  );
}
