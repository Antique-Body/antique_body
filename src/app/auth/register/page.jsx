"use client";

import { Icon } from "@iconify/react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EffectBackground } from "@/components/background";
import { BrandLogo } from "@/components/common";
import { AuthForm } from "@/components/custom/auth/components/AuthForm";

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
        body: JSON.stringify({ phone, mode: "register" }),
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
    // Spremi imena u session storage
    if (data.firstName) sessionStorage.setItem("firstName", data.firstName);
    if (data.lastName) sessionStorage.setItem("lastName", data.lastName);
    try {
      const requestBody = {
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
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
          <div className="absolute top-1/4 -left-40 w-[800px] h-[800px] rounded-full bg-[#FF6B00]/20 blur-[100px] animate-pulse"></div>
          <div
            className="absolute bottom-1/4 -right-40 w-[800px] h-[800px] rounded-full bg-[#FF9A00]/20 blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[#FF6B00]/10 blur-[150px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <EffectBackground />

        {/* Navigation */}
        <nav className="relative z-20 px-4 sm:px-6 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <BrandLogo
                className="text-lg sm:text-xl md:text-2xl font-bold group-hover:scale-105 transition-transform"
                titleStyle={{ fontSize: "inherit", marginBottom: "0" }}
                containerStyle={{ marginBottom: "0" }}
              />
            </Link>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Side - Welcome Content (Hidden on Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex flex-col justify-center text-left max-w-xl"
              >
                <div className="inline-flex items-center justify-center text-sm font-medium mb-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20 self-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                    <Icon icon="mdi:account-plus" className="text-sm" />
                  </span>
                  Begin your transformation
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-white block mb-2">Start Your</span>
                  <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block relative">
                    Legendary Journey
                    <svg
                      width="100%"
                      height="8"
                      className="absolute -bottom-2 left-0"
                      viewBox="0 0 400 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5.5C96.5 1 148 1.5 399 5.5"
                        stroke="url(#paint0_linear)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear"
                          x1="1"
                          y1="5.5"
                          x2="399"
                          y2="5.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#FF6B00" stopOpacity="0" />
                          <stop offset="0.5" stopColor="#FF6B00" />
                          <stop
                            offset="1"
                            stopColor="#FF9A00"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>

                <p className="text-lg xl:text-xl text-gray-300 mb-8 leading-relaxed">
                  Join thousands of warriors who have discovered their ancient
                  strength. Connect with expert trainers and unlock your true
                  potential.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: "mdi:account-group", text: "Find Expert Trainers" },
                    { icon: "mdi:dumbbell", text: "Custom Training Plans" },
                    { icon: "mdi:chart-line", text: "Track Your Progress" },
                    { icon: "mdi:crown", text: "Unlock Achievements" },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 bg-gradient-to-r from-white/5 to-transparent rounded-xl p-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon={benefit.icon}
                          className="text-[#FF6B00] text-sm"
                        />
                      </div>
                      <p className="text-gray-300 text-sm font-medium">
                        {benefit.text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Social Proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="p-4 bg-gradient-to-r from-[#FF6B00]/10 to-transparent rounded-xl border border-[#FF6B00]/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] border-2 border-black flex items-center justify-center"
                        >
                          <Icon
                            icon="mdi:account"
                            className="text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">
                        Join 10,000+ warriors
                      </p>
                      <p className="text-xs text-gray-400">
                        Already transforming their lives
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Side - Auth Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <div className="w-full max-w-md">
                  {/* Mobile Header */}
                  <div className="lg:hidden text-center mb-8">
                    <div className="inline-flex items-center justify-center text-sm font-medium mb-4 bg-gradient-to-r from-[#FF6B00]/10 to-transparent backdrop-blur-sm px-4 py-2 rounded-full text-[#FF6B00] border border-[#FF6B00]/20">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF6B00]/20 mr-2">
                        <Icon icon="mdi:account-plus" className="text-sm" />
                      </span>
                      Start your journey
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                      <span className="text-white block mb-1">Create Your</span>
                      <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                        Account
                      </span>
                    </h1>
                    <p className="text-gray-400 text-base mb-4">
                      Join the fitness revolution
                    </p>
                  </div>

                  {/* Auth Card - Only on Desktop */}
                  <div className="lg:relative lg:bg-gradient-to-b lg:from-white/5 lg:to-white/[0.02] lg:backdrop-blur-xl lg:rounded-2xl lg:border lg:border-white/10 lg:p-8 lg:shadow-2xl">
                    {/* Decorative elements - Desktop Only */}
                    <div className="hidden lg:block absolute -top-2 -left-2 w-full h-full rounded-2xl border-2 border-[#FF6B00]/20 -z-10"></div>
                    <div className="hidden lg:block absolute -bottom-2 -right-2 w-full h-full rounded-2xl border-2 border-[#FF6B00]/20 -z-10"></div>

                    {/* Desktop Header */}
                    <div className="hidden lg:block text-center mb-8">
                      <h2 className="text-2xl font-bold mb-2 text-white">
                        Create Your Account
                      </h2>
                      <p className="text-gray-400">
                        Join the fitness revolution
                      </p>
                    </div>

                    {/* Auth Form */}
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

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link
                          href="/auth/login"
                          className="text-[#FF6B00] hover:text-[#FF5f00] transition-colors font-medium"
                        >
                          Sign In
                        </Link>
                      </p>
                    </div>

                    {/* Terms */}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        By creating an account, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="text-[#FF6B00] hover:text-[#FF5f00] transition-colors underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-[#FF6B00] hover:text-[#FF5f00] transition-colors underline"
                        >
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
}
