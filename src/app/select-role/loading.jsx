"use client";

import { useTranslation } from "react-i18next";

import { FullScreenLoader } from "@/components/custom/FullScreenLoader";

export default function Loading() {
  const { t } = useTranslation();
  return <FullScreenLoader text={t("role.preparing.journey")} />;
} 