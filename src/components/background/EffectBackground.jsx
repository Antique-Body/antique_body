"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./EffectBackground.css";

import {
  ColosseumIcon,
  ColumnIcon,
  DiscusIcon,
  ParthenonIcon,
  RunnerIcon,
  VaseIcon,
} from "@/components/common/Icons";

export const EffectBackground = () => {
  return (
    <div className="home-background-container">
      {/* Gradient overlays */}
      <div className="gradient-overlay top-gradient"></div>
      <div className="gradient-overlay bottom-gradient"></div>
      <div className="gradient-overlay center-gradient"></div>

      {/* Greek patterns */}
      <div className="greek-pattern-container">
        <div className="greek-pattern top-pattern"></div>
        <div className="greek-pattern bottom-pattern"></div>
        <div className="greek-pattern left-pattern"></div>
        <div className="greek-pattern right-pattern"></div>
      </div>

      {/* Ancient icons with enhanced animations */}
      <div className="ancient-elements visible">
        <motion.div
          className="ancient-building parthenon"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 0.1 }}
          whileHover={{ scale: 1.05, opacity: 0.5 }}>
          <ParthenonIcon className="w-full h-full" />
        </motion.div>

        <motion.div
          className="olympian runner"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.4, x: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          whileHover={{ scale: 1.05, opacity: 0.5 }}>
          <RunnerIcon className="w-full h-full" />
        </motion.div>

        <motion.div
          className="olympian discus"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.4, x: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          whileHover={{ scale: 1.05, opacity: 0.5 }}>
          <DiscusIcon className="w-full h-full" />
        </motion.div>

        <motion.div
          className="ancient-building colosseum"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          whileHover={{ scale: 1.05, opacity: 0.5 }}>
          <ColosseumIcon className="w-full h-full" />
        </motion.div>

        <motion.div
          className="ancient-building column"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          whileHover={{ scale: 1.05, opacity: 0.5 }}>
          <ColumnIcon className="w-full h-full" />
        </motion.div>

        <motion.div
          className="ancient-building vase"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          whileHover={{ scale: 1.05, opacity: 0.5 }}>
          <VaseIcon className="w-full h-full" />
        </motion.div>
      </div>

      {/* Floating elements */}
      <div className="floating-elements">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`floating-element element-${index + 1}`}></div>
        ))}
      </div>

      {/* Golden ratio spiral decoration */}
      <div className="golden-ratio">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="golden-ratio-svg">
          <path
            d="M98,2 C98,59.5 59.5,98 2,98"
            stroke="#FF6B00"
            strokeOpacity="0.1"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M98,2 C98,38.4 67.7,68.3 31.7,68.3"
            stroke="#FF6B00"
            strokeOpacity="0.1"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M31.7,68.3 C31.7,52 45.3,38.4 61.6,38.4"
            stroke="#FF6B00"
            strokeOpacity="0.1"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M61.6,38.4 C61.6,47.5 54.3,54.9 45.1,54.9"
            stroke="#FF6B00"
            strokeOpacity="0.1"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M45.1,54.9 C45.1,49.8 49.2,45.6 54.4,45.6"
            stroke="#FF6B00"
            strokeOpacity="0.1"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M54.4,45.6 C54.4,48.5 52 50.8 49.1,50.8"
            stroke="#FF6B00"
            strokeOpacity="0.1"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};
