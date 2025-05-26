"use client";

import { Card } from "@/components/custom";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

export default function ErrorBoundary({ error, reset, className = "" }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={clsx(
        "min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-[#18120b] to-[#1a1a1a]",
        className
      )}
    >
      <Card
        className="max-w-lg w-full border border-orange-700/50 !p-10"
        variant="darkStrong"
        glowEffect={true}
        glowColor="rgba(255,120,0,0.25)"
        backdropBlur="md"
        shadow="0 10px 40px rgba(255,120,0,0.15)"
        bgGradientFrom="#1a0a0a"
        bgGradientTo="#2a1a1a"
        borderRadius="20px"
        animate={true}
        animationVariant="fadeIn"
        topBorderColor="orange"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-4 text-orange-500 drop-shadow-sm">
            {t("errorBoundary.title")}
          </h2>
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 rounded-lg shadow-inner border border-orange-900/40">
            <p className="text-zinc-100 text-base leading-relaxed">
              {t("errorBoundary.message")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button onClick={() => reset()} variant="primary" className="flex-1">
            {t("errorBoundary.tryAgain")}
          </Button>

          <Button
            onClick={() => router.push("/auth/login")}
            variant="outlineOrange"
            className="flex-1 border border-orange-700 text-orange-400"
          >
            {t("errorBoundary.goHome")}
          </Button>
        </div>

        {/* Error Details Section */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <Button
              onClick={() => setShowDetails((v) => !v)}
              variant="orangeText"
              size="small"
              className="underline"
            >
              {showDetails
                ? t("errorBoundary.hideDetails")
                : t("errorBoundary.showDetails")}
            </Button>
          </div>

          {showDetails && (
            <div className="bg-zinc-800 border border-orange-900/30 rounded-lg p-4 overflow-auto max-h-60">
              <p className="font-mono text-sm break-words text-orange-400 mb-2">
                <strong>{t("errorBoundary.messageLabel")}</strong>{" "}
                {error?.message || String(error)}
              </p>
              {error?.stack && (
                <pre className="mt-2 font-mono text-xs text-orange-300 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <a
              href={`mailto:support@antiquebody.com?subject=Error%20Report&body=${encodeURIComponent(
                `Error message: ${
                  error?.message || String(error)
                }\n\nStack trace: ${error?.stack || "N/A"}`
              )}`}
              className="inline-block px-6 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-all duration-200 text-sm font-semibold hover:shadow-lg"
            >
              {t("errorBoundary.reportIssue")}
            </a>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="border-t border-orange-900/30 pt-6 text-center">
          <h3 className="text-lg font-semibold text-orange-400 mb-3">
            {t("errorBoundary.contactSupport")}
          </h3>
          <p className="text-zinc-200 text-sm mb-3 leading-relaxed">
            {t("errorBoundary.contactSupportDesc")}
          </p>
          <a
            href="mailto:support@antiquebody.com"
            className="inline-block text-orange-400 font-bold underline hover:text-orange-200 transition-colors text-base"
          >
            support@antiquebody.com
          </a>
        </div>
      </Card>
    </div>
  );
}
