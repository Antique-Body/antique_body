"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./Button";

import { Card } from "@/components/custom";

export default function ErrorBoundary({ error, reset, className = "" }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={clsx(
        "min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden",
        "bg-gradient-to-br from-black via-zinc-900 to-orange-950/20",
        className
      )}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-orange-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-orange-600/20 rounded-full animate-bounce"></div>

        {/* Gradient Orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-l from-orange-500/8 to-yellow-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,120,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,120,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Error Card */}
      <div
        className={clsx(
          "relative z-10 max-w-md w-full transform transition-all duration-1000",
          mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <Card
          className="border-2 border-orange-500/30 !p-0 overflow-hidden backdrop-blur-xl"
          variant="darkStrong"
          glowEffect={true}
          glowColor="rgba(255,120,0,0.4)"
          backdropBlur="xl"
          shadow="0 25px 50px rgba(255,120,0,0.25), 0 0 0 1px rgba(255,120,0,0.1)"
          bgGradientFrom="rgba(26,10,10,0.95)"
          bgGradientTo="rgba(42,26,26,0.95)"
          borderRadius="20px"
          animate={true}
          animationVariant="fadeIn"
          topBorderColor="orange"
        >
          {/* Header Section with Icon */}
          <div className="relative bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-600/20 p-6 border-b border-orange-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,120,0,0.1),transparent_70%)]"></div>

            <div className="relative text-center">
              {/* Error Icon */}
              <div className="mx-auto mb-4 w-16 h-16 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-1 bg-gradient-to-r from-zinc-900 to-black rounded-full flex items-center justify-center">
                  <Icon
                    icon="material-symbols:warning"
                    className="w-8 h-8 text-orange-400"
                  />
                </div>
              </div>

              <h1 className="text-2xl font-black mb-3 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg">
                {t("errorBoundary.title")}
              </h1>

              <div className="relative bg-gradient-to-r from-zinc-800/80 via-zinc-900/80 to-zinc-800/80 p-4 rounded-lg border border-orange-500/30 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5 rounded-lg"></div>
                <p className="relative text-zinc-100 text-sm leading-relaxed font-medium">
                  {t("errorBoundary.message")}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => reset()}
                variant="primary"
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Icon
                  icon="material-symbols:refresh"
                  className="w-4 h-4 mr-2"
                />
                {t("errorBoundary.tryAgain")}
              </Button>

              <Button
                onClick={() => router.push("/")}
                variant="outlineOrange"
                className="w-full h-12 text-base font-bold border-2 border-orange-500 text-orange-400 hover:bg-orange-500/10 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Icon icon="material-symbols:home" className="w-4 h-4 mr-2" />
                {t("errorBoundary.goHome")}
              </Button>

              {/* Error Details Toggle Button */}
              <Button
                onClick={() => setShowDetails((v) => !v)}
                variant="orangeText"
                className="w-full h-10 text-sm font-semibold hover:text-orange-300 transition-all duration-200 flex items-center justify-center gap-2 border border-orange-500/20 hover:border-orange-500/40"
              >
                <Icon
                  icon="material-symbols:keyboard-arrow-down"
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200",
                    showDetails && "rotate-180"
                  )}
                />
                {showDetails
                  ? t("errorBoundary.hideDetails")
                  : t("errorBoundary.showDetails")}
              </Button>

              {/* Contact Support Button */}
              <a
                href="mailto:support@antiquebody.com"
                className="w-full h-10 inline-flex items-center justify-center gap-2 text-orange-400 font-semibold text-sm hover:text-orange-300 transition-all duration-200 border border-orange-500/20 rounded-lg hover:border-orange-500/40 hover:bg-orange-500/5"
              >
                <Icon icon="material-symbols:mail" className="w-4 h-4" />
                {t("errorBoundary.contactSupport")}
              </a>
            </div>

            {/* Error Details Section - Collapsible */}
            <div
              className={clsx(
                "transition-all duration-500 overflow-hidden",
                showDetails ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="bg-black/50 border border-orange-500/30 rounded-lg p-4 backdrop-blur-sm mt-4">
                <div className="mb-3">
                  <p className="font-mono text-xs text-orange-400 mb-1 flex items-center gap-1">
                    <Icon icon="material-symbols:info" className="w-3 h-3" />
                    <strong>{t("errorBoundary.messageLabel")}</strong>
                  </p>
                  <p className="text-orange-300 text-xs bg-orange-500/10 p-2 rounded border-l-2 border-orange-500">
                    {error?.message || String(error)}
                  </p>
                </div>

                {error?.stack && (
                  <div>
                    <p className="font-mono text-xs text-orange-400 mb-1 flex items-center gap-1">
                      <Icon icon="material-symbols:code" className="w-3 h-3" />
                      <strong>Stack Trace:</strong>
                    </p>
                    <pre className="font-mono text-xs text-orange-200 whitespace-pre-wrap bg-zinc-900/50 p-2 rounded border border-orange-500/20 max-h-32 overflow-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
