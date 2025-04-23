import React from "react";
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
  return (
    <div className={`background-shapes ${className}`}>
      {parthenon && (
        <div className="ancient-building parthenon">
          <ParthenonIcon className="w-[200px] h-[80px]" />
        </div>
      )}
      {runner && (
        <div className="olympian runner">
          <RunnerIcon className="w-[80px] h-[120px]" />
        </div>
      )}
      {discus && (
        <div className="olympian discus">
          <DiscusIcon className="w-[100px] h-[100px]" />
        </div>
      )}
      {colosseum && (
        <div className="ancient-building colosseum">
          <ColosseumIcon className="w-[200px] h-[100px]" />
        </div>
      )}
      {column && (
        <div className="ancient-building column">
          <ColumnIcon className="w-[80px] h-[120px]" />
        </div>
      )}
      {vase && (
        <div className="ancient-building vase">
          <VaseIcon className="w-[80px] h-[100px]" />
        </div>
      )}
    </div>
  );
};

export default Background;
