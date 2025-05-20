"use client";

import Background from "@/components/background";
import { AuthForm, Card } from "@/components/custom";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const handleSendCode = async (email) => {
    if (!email) {
      setCodeError(t("validation.email_required"));
      return;
    }

    setCodeError("");
    setSendingCode(true);
    try {
      const response = await fetch("/api/auth/send-email-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("auth.login.code_send_error"));
      }

      setCodeSent(true);
    } catch (err) {
      console.error("Error sending code:", err);
      setCodeError(err.message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (data) => {
    console.log("Register page received data:", data);
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !data.email ||
        !data.password ||
        !data.firstName ||
        !data.lastName ||
        !data.code
      ) {
        console.log("Missing required fields:", {
          email: !data.email,
          password: !data.password,
          firstName: !data.firstName,
          lastName: !data.lastName,
          code: !data.code,
        });
        setError("All fields are required");
        setLoading(false);
        return;
      }

      console.log("Sending registration request with data:", data);
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.firstName,
          lastName: data.lastName,
          code: data.code,
        }),
      });

      console.log("Register response status:", registerResponse.status);
      const responseData = await registerResponse.json();
      console.log("Register response data:", responseData);

      if (!registerResponse.ok) {
        throw new Error(responseData.error || "Registration failed");
      }

      // After successful registration, sign in the user
      console.log("Registration successful, signing in...");
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // After successful sign in, redirect to select-role page
      console.log("Sign in successful, redirecting to select-role...");
      router.push("/select-role");
    } catch (err) {
      console.error("Register - Error:", err);
      setError(err.message || "Registration failed");
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
