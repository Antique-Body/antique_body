"use client";

import Background from "@/components/background";
import { Card } from "@/components/custom/index";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState("");
  const [debug, setDebug] = useState({});
  const [autoRedirect, setAutoRedirect] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (verificationAttempted.current) return;
      
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setError(t("missing_token_or_email"));
        return;
      }

      try {
        verificationAttempted.current = true;
        const response = await fetch(`/api/email-verification/verify?token=${token}&email=${email}`);
        const data = await response.json();

        // Store debug info
        setDebug({
          status: response.status,
          data,
          timestamp: new Date().toISOString()
        });

        if (!response.ok) {
          throw new Error(data.error || t("verification_failed"));
        }

        setStatus("success");
        setAutoRedirect(true);
      } catch (err) {
        console.error("Email verification client error:", err);
        setStatus("error");
        setError(err.message);
        setDebug(prev => ({ ...prev, error: err.message }));
      }
    };

    verifyEmail();
  }, [searchParams, t]);

  // Auto redirect countdown
  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (autoRedirect && countdown === 0) {
      router.push("/auth/login");
    }
  }, [autoRedirect, countdown, router]);

  // Cancel auto redirect
  const cancelRedirect = () => {
    setAutoRedirect(false);
  };

  // Function to toggle debug display
  const [showDebug, setShowDebug] = useState(false);

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
          {status === "verifying" && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">{t("verifying_email")}</h2>
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff7800]"></div>
              </div>
              <p className="text-gray-400">{t("please_wait")}</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-green-500">{t("email_verified")}</h2>
              <p className="text-gray-400 mb-6">{t("email_verification_success")}</p>
              
              {autoRedirect ? (
                <div className="mb-6">
                  <p className="text-green-500 mb-2">
                    {t("redirecting_to_login")} {countdown} {t("seconds")}...
                  </p>
                  <button 
                    onClick={cancelRedirect}
                    className="text-sm text-gray-400 hover:text-white">
                    {t("cancel_redirect")}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-block bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:from-[#ff5f00] hover:to-[#ff7800]">
                  {t("continue_to_login")}
                </Link>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-500/20 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-red-500">{t("verification_failed")}</h2>
              <p className="text-gray-400 mb-6">{error || t("verification_error")}</p>
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="inline-block w-full bg-gradient-to-r from-[#ff7800] to-[#ff5f00] text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:from-[#ff5f00] hover:to-[#ff7800]">
                  {t("back_to_login")}
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-block w-full border border-zinc-700 hover:border-[#ff7800] text-white px-6 py-3 rounded-lg font-medium transition-all">
                  {t("create_new_account")}
                </Link>
              </div>
            </div>
          )}
          
          {/* Debug section - toggle with button */}
          <div className="mt-6 pt-4 border-t border-zinc-800">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-xs text-gray-500 hover:text-gray-400"
            >
              {showDebug ? t("hide") : t("show")} {t("technical_details")}
            </button>
            
            {showDebug && (
              <div className="mt-2 p-3 bg-black/40 rounded text-left text-xs font-mono text-gray-400 overflow-auto max-h-32">
                <pre>{JSON.stringify(debug, null, 2)}</pre>
                <p className="mt-2">Token: {searchParams.get("token")?.substring(0, 10)}...</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
} 