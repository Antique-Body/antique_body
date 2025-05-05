"use client";

import { useTranslation } from "react-i18next";

import { FullScreenLoader } from "@/components";

export default function UserLoading() {
  const { t } = useTranslation();
  return <FullScreenLoader text={t("role.preparing.user")} />;
}
