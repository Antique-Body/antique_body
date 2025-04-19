import React from "react";
import Parthenon from "./Parthenon";
import Runner from "./Runner";
import Discus from "./Discus";
import Colosseum from "./Colosseum";
import Column from "./Column";
import Vase from "./Vase";
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
      {parthenon && <Parthenon />}
      {runner && <Runner />}
      {discus && <Discus />}
      {colosseum && <Colosseum />}
      {column && <Column />}
      {vase && <Vase />}
    </div>
  );
};

export default Background;
