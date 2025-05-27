"use client";

import { useTranslation } from "react-i18next";

import { GreekLoaderIcon } from "./Icons";

export function FullScreenLoader({ text }) {
  const { t } = useTranslation();
  const defaultText = t("role.preparing.journey");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="flex flex-col items-center justify-center">
          <GreekLoaderIcon size="lg" className="mb-2" />
          {text && <p className="text-white text-sm font-medium">{text}</p>}
        </div>
        <p className="text-xl text-white font-medium mt-4">
          {(text || defaultText).split(" ").slice(0, -1).join(" ")}
          <br />
          <span className="text-[#ff7800]">
            {(text || defaultText).split(" ").slice(-1)}
          </span>
        </p>
      </div>
    </div>
  );
}
