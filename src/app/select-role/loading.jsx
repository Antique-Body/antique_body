"use client";

import { FullScreenLoader } from "@/components/custom/FullScreenLoader";
import { useTranslation } from "react-i18next";

export default function Loading() {
  const { t } = useTranslation();
  return <FullScreenLoader text={t("role.preparing.journey")} />;
} 