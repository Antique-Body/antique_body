import React, { useEffect, useState } from "react";
import {
  ParthenonIcon,
  RunnerIcon,
  DiscusIcon,
  ColosseumIcon,
  ColumnIcon,
  VaseIcon,
} from "@/components/common/Icons";
import "./background.css";

const Background = ({
  parthenon = true,
  runner = true,
  discus = true,
  colosseum = true,
  column = true,
  vase = true,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`background-shapes ${className} ${
        isVisible ? "visible" : ""
      }`}>
      {parthenon && (
        <div
          className="ancient-building parthenon"
          style={{ "--delay": "0.1s" }}>
          <ParthenonIcon className="w-full h-full" />
        </div>
      )}
      {runner && (
        <div className="olympian runner" style={{ "--delay": "0.3s" }}>
          <RunnerIcon className="w-full h-full" />
        </div>
      )}
      {discus && (
        <div className="olympian discus" style={{ "--delay": "0.5s" }}>
          <DiscusIcon className="w-full h-full" />
        </div>
      )}
      {colosseum && (
        <div
          className="ancient-building colosseum"
          style={{ "--delay": "0.2s" }}>
          <ColosseumIcon className="w-full h-full" />
        </div>
      )}
      {column && (
        <div className="ancient-building column" style={{ "--delay": "0.4s" }}>
          <ColumnIcon className="w-full h-full" />
        </div>
      )}
      {vase && (
        <div className="ancient-building vase" style={{ "--delay": "0.6s" }}>
          <VaseIcon className="w-full h-full" />
        </div>
      )}
    </div>
  );
};

// Memoriranje komponente za prevenciju nepotrebnih renderovanja
export default React.memo(Background);
