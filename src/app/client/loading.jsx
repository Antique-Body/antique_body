"use client";

import { FullScreenLoader } from "@/components";

export default function TrainerLoading() {
  return (
    <FullScreenLoader text="Preparing your Ancient Journey" isVisible={true} />
  );
}
