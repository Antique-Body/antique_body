import React from "react";

const Colosseum = () => {
  return (
    <div className="ancient-building colosseum">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
        <ellipse
          cx="100"
          cy="60"
          rx="80"
          ry="30"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <ellipse
          cx="100"
          cy="60"
          rx="65"
          ry="25"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <path
          d="M35,60 L35,40 M45,60 L45,35 M55,60 L55,30 M65,60 L65,28 M75,60 L75,25 M85,60 L85,24 M95,60 L95,23 M105,60 L105,23 M115,60 L115,24 M125,60 L125,25 M135,60 L135,28 M145,60 L145,30 M155,60 L155,35 M165,60 L165,40"
          stroke="#FFFFFF"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Colosseum;
