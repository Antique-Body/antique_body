"use client";

import { Icon } from "@iconify/react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EffectBackground } from "@/components/background";
import { BrandLogo, FormField, Button } from "@/components/common";
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

      if (result?.error) {
        console.error("[login] SignIn error:", result.error);
        throw new Error(result.error);
      }

      if (result?.ok) {
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
                    <Icon icon="mdi:login" className="text-sm" />
                  </span>
                  Welcome back, warrior
                </div>

                <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-white block mb-2">Continue Your</span>
                  <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent inline-block relative">
                    Ancient Journey
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
                  Sign in to access your personalized training programs, connect
                  with your trainer, and continue building your ancient
                  strength.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "mdi:dumbbell", text: "Your Training Plans" },
                    { icon: "mdi:account-group", text: "Trainer Connection" },
                    { icon: "mdi:chart-line", text: "Progress Tracking" },
                    { icon: "mdi:trophy", text: "Achievements" },
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
                        <Icon icon="mdi:login" className="text-sm" />
                      </span>
                      Welcome back
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                      <span className="text-white block mb-1">
                        Continue Your
                      </span>
                      <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-transparent">
                        Journey
                      </span>
                    </h1>
                    <p className="text-gray-400 text-base">
                      Sign in to access your training programs
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
                        Welcome Back
                      </h2>
                      <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    {/* Auth Form Content */}
                    {showForgotPassword ? (
                      <div className="w-full">
                        <div className="text-center mb-6">
                          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
                            Reset Password
                          </h2>
                          <p className="text-gray-400 text-sm sm:text-base">
                            Enter your email to receive reset instructions
                          </p>
                        </div>

                        <form
                          onSubmit={handleForgotPassword}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address
                            </label>
                            <FormField
                              type="email"
                              name="forgotPasswordEmail"
                              value={forgotPasswordEmail}
                              onChange={(e) =>
                                setForgotPasswordEmail(e.target.value)
                              }
                              className="w-full mb-0 bg-white/5 border-white/10 focus:border-[#FF6B00]/50 focus:bg-white/10 rounded-lg"
                              placeholder="Enter your email"
                              required
                            />
                          </div>

                          {forgotPasswordStatus === "error" && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-red-400 text-sm">
                                Password reset failed. Please try again.
                              </p>
                            </div>
                          )}

                          {forgotPasswordStatus === "success" && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <p className="text-green-400 text-sm">
                                Reset instructions sent to your email.
                              </p>
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={forgotPasswordStatus === "sending"}
                            loading={forgotPasswordStatus === "sending"}
                            className="w-full py-3 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium rounded-lg hover:from-[#FF5f00] hover:to-[#FF7800] transition-all duration-300"
                          >
                            {forgotPasswordStatus === "sending"
                              ? "Sending..."
                              : "Send Reset Link"}
                          </Button>

                          {forgotPasswordStatus === "success" && (
                            <Button
                              type="button"
                              onClick={handleResendToken}
                              disabled={resendDisabled}
                              className="w-full py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                            >
                              {resendDisabled
                                ? `Resend in ${resendCountdown}s`
                                : "Resend Email"}
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
                            variant="ghost"
                            className="w-full py-3 text-gray-400 hover:text-white transition-colors"
                          >
                            Back to Login
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <>
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
                          <Button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            variant="ghost"
                            className="text-[#FF6B00] hover:text-[#FF5f00] transition-colors text-sm"
                          >
                            Forgot your password?
                          </Button>
                        </div>

                        <div className="mt-6 text-center">
                          <p className="text-gray-400 text-sm">
                            Don't have an account?{" "}
                            <Link
                              href="/auth/register"
                              className="text-[#FF6B00] hover:text-[#FF5f00] transition-colors font-medium"
                            >
                              Create Account
                            </Link>
                          </p>
                        </div>
                      </>
                    )}
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
