import React from "react";
import { svgData } from "@utils/svgData";

export const DecoratedBackground = () => {
  return (
    <div
      className="fixed w-full h-full overflow-hidden z-10"
      style={{ position: "fixed", top: 0, left: 0 }}>
      <div
        className="absolute w-[200px] h-[80px] top-0 left-1/2 transform -translate-x-1/2 -translate-y-2/5 bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.parthenon,
        }}></div>

      <div
        className="absolute w-[80px] h-[120px] top-0 left-[30%] transform translate-y-1/5 bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.column,
        }}></div>

      <div
        className="absolute w-[80px] h-[120px] top-0 right-[30%] transform translate-y-1/5 bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.column,
        }}></div>

      <div
        className="absolute w-[200px] h-[80px] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/5 bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.parthenon,
          transform: "translateX(-50%) rotate(180deg)",
        }}></div>

      <div
        className="absolute w-[100px] h-[100px] top-0 right-[30%] transform translate-y-[30%] bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.discusThrower,
        }}></div>

      <div
        className="absolute w-[200px] h-[100px] bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/5 bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.colosseum,
        }}></div>

      <div
        className="absolute w-[80px] h-[100px] bottom-0 right-[30%] transform -translate-y-1/5 bg-contain bg-no-repeat bg-center opacity-40"
        style={{
          filter:
            "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
          backgroundImage: svgData.vase,
        }}></div>
    </div>
  );
};
