"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { EffectBackground } from "@/components/background";
import { Button, FormField } from "@/components/common";
import { Card } from "@/components/common/Card";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwords_do_not_match"));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("password_min_length"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("password_reset_failed"));
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
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
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                {t("invalid_reset_link")}
              </h2>
              <p className="text-gray-400 mb-4">{t("reset_link_expired")}</p>
              <Button
                onClick={() => router.push("/auth/login")}
                variant="ghostOrange"
              >
                {t("return_to_login")}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

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
          {success ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4 text-green-500">
                {t("password_reset_successful")}
              </h2>
              <p className="text-gray-400">{t("password_reset_redirect")}</p>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {t("reset_password")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  id="password"
                  name="password"
                  label={t("new_password")}
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder={t("enter_new_password")}
                  error={
                    error && error.includes(t("password_min_length"))
                      ? error
                      : ""
                  }
                  className="w-full"
                />
                <FormField
                  id="confirmPassword"
                  name="confirmPassword"
                  label={t("confirm_new_password")}
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  placeholder={t("confirm_new_password_placeholder")}
                  error={
                    error && error.includes(t("passwords_do_not_match"))
                      ? error
                      : ""
                  }
                />
                {error &&
                  !error.includes(t("password_min_length")) &&
                  !error.includes(t("passwords_do_not_match")) && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                <Button
                  type="submit"
                  loading={loading}
                  variant="primary"
                  className="w-full"
                >
                  {t("reset_password")}
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
