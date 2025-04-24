import React from "react";
import { BrandLogoIcon } from "../common/Icons";

export const BrandLogo = ({ size = "medium" }) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <BrandLogoIcon size={size} />
      <span className="text-xl font-bold bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
        AntiqueBody
      </span>
    </div>
  );
};
