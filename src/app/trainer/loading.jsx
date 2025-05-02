"use client";
import { FullScreenLoader } from "@/components";
import { useTranslation } from "react-i18next";

export default function TrainerLoading() {
  const { t } = useTranslation();
  return <FullScreenLoader text={t("role.preparing.trainer")} />;
}
