import React from "react";
import Parthenon from "./artefacts/Parthenon";
import Runner from "./artefacts/Runner";
import Discus from "./artefacts/Discus";
import Colosseum from "./artefacts/Colosseum";
import Column from "./artefacts/Column";
import Vase from "./artefacts/Vase";
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
