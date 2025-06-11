"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { FullScreenLoader } from "@/components/common";

export default function LoadingTestPage() {
  const [showLoader, setShowLoader] = useState(true);
  const [loadingText, setLoadingText] = useState(
    "Preparing your Ancient Journey"
  );

  const loaderTexts = [
    "Preparing your Ancient Journey",
    "Loading your Training Program",
    "Building your Workout Plan",
    "Connecting with Trainers",
    "Preparing your Spartan Challenge",
  ];

  const toggleLoader = () => {
    setShowLoader(!showLoader);
  };

  const changeLoaderText = () => {
    const currentIndex = loaderTexts.indexOf(loadingText);
    const nextIndex = (currentIndex + 1) % loaderTexts.length;
    setLoadingText(loaderTexts[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-white text-center">
          FullScreenLoader Test
        </h1>

        <div className="flex flex-col space-y-4">
          <Button
            variant="orangeFilled"
            onClick={toggleLoader}
            className="w-full"
          >
            {showLoader ? "Hide Loader" : "Show Loader"}
          </Button>

          <Button
            variant="outlineOrange"
            onClick={changeLoaderText}
            className="w-full"
            disabled={!showLoader}
          >
            Change Loader Text
          </Button>

          <div className="text-white text-center text-sm">
            <p>Current loader text:</p>
            <p className="font-medium text-[#FF7800]">{loadingText}</p>
          </div>
        </div>
      </div>

      {showLoader && <FullScreenLoader text={loadingText} />}
    </div>
  );
}
