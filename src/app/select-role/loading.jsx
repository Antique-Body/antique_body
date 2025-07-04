"use client";

import { FullScreenLoader } from "@/components/common";

export default function Loading() {
  return (
    <FullScreenLoader text="Preparing your Ancient Journey" isVisible={true} />
  );
}
