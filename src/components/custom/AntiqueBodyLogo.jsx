import React from "react";

const AntiqueBodyLogo = ({ width = 400, height = 400 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 400 400"
    width={width}
    height={height}
  >
    {/* Enhanced definitions for gradients and animations */}
    <defs>
      {/* Main orange gradient with more complex animation */}
      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FF7800", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#FF7800;#FF9A00;#FFAA00;#FF9A00;#FF7800"
            dur="6s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" style={{ stopColor: "#FF8800", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#FF8800;#FF7800;#FF9A00;#FF7800;#FF8800"
            dur="6s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" style={{ stopColor: "#FF9A00", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#FF9A00;#FFAA00;#FF7800;#FFAA00;#FF9A00"
            dur="6s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      {/* Background gradient with subtle animation */}
      {/* <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#00000", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#000000;#151515;#000000"
            dur="10s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" style={{ stopColor: "#000000", stopOpacity: 1 }}>
          <animate
            attributeName="stop-color"
            values="#000000;#202020;#000000"
            dur="10s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient> */}

      {/* Enhanced glow filter */}
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur">
          <animate
            attributeName="stdDeviation"
            values="2;4;2"
            dur="3s"
            repeatCount="indefinite"
          />
        </feGaussianBlur>
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
        <feFlood floodColor="#FF9500" floodOpacity="0.5" result="glowColor" />
        <feComposite
          in="glowColor"
          in2="blur"
          operator="in"
          result="softGlow"
        />
        <feComposite in="SourceGraphic" in2="softGlow" operator="over" />
      </filter>

      {/* Particle effect for the disk */}
      <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feFlood floodColor="#FFA500" floodOpacity="0.8" result="glowColor" />
        <feComposite
          in="glowColor"
          in2="blur"
          operator="in"
          result="softGlow"
        />
        <feComposite in="SourceGraphic" in2="softGlow" operator="over" />
      </filter>

      {/* Motion blur for more dynamic animation */}
      <filter id="motionBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2 0">
          <animate
            attributeName="stdDeviation"
            values="2 0;0 2;2 0"
            dur="0.3s"
            repeatCount="indefinite"
          />
        </feGaussianBlur>
      </filter>

      {/* Shimmer effect for text */}
      <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "#FF7800", stopOpacity: 0.8 }}>
          <animate
            attributeName="offset"
            values="0;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="10%" style={{ stopColor: "#FFAA00", stopOpacity: 1 }}>
          <animate
            attributeName="offset"
            values="0.1;1.1"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="20%" style={{ stopColor: "#FF7800", stopOpacity: 0.8 }}>
          <animate
            attributeName="offset"
            values="0.2;1.2"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      {/* Enhanced shimmer effect for ANTIQUE text */}
      <linearGradient id="enhancedShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: "#FF5500", stopOpacity: 0.9 }}>
          <animate
            attributeName="offset"
            values="0;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="10%" style={{ stopColor: "#FFCC00", stopOpacity: 1 }}>
          <animate
            attributeName="offset"
            values="0.1;1.1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="20%" style={{ stopColor: "#FF5500", stopOpacity: 0.9 }}>
          <animate
            attributeName="offset"
            values="0.2;1.2"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>

    {/* Background with subtle pulse */}
    <rect width="400" height="400" fill="url(#bgGradient)">
      <animate
        attributeName="opacity"
        values="1;0.95;1"
        dur="5s"
        repeatCount="indefinite"
      />
    </rect>

    {/* Dynamic background elements */}
    <g id="backgroundElements">
      {/* Abstract shapes that move in the background */}
      <circle cx="50" cy="50" r="5" fill="#FF7800" opacity="0.3">
        <animate
          attributeName="cy"
          values="50;350;50"
          dur="20s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cx"
          values="50;150;50"
          dur="25s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.5;0.3"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="350" cy="100" r="8" fill="#FF9A00" opacity="0.2">
        <animate
          attributeName="cy"
          values="100;300;100"
          dur="18s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="cx"
          values="350;250;350"
          dur="22s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.2;0.4;0.2"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Additional subtle energy lines */}
      <path
        d="M100,80 Q150,50 200,80"
        stroke="#FF7800"
        strokeWidth="1"
        fill="none"
        opacity="0.15"
      >
        <animate
          attributeName="d"
          values="M100,80 Q150,50 200,80;M100,80 Q150,100 200,80;M100,80 Q150,50 200,80"
          dur="12s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.15;0.25;0.15"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      <path
        d="M280,120 Q310,150 340,120"
        stroke="#FF9A00"
        strokeWidth="1"
        fill="none"
        opacity="0.12"
      >
        <animate
          attributeName="d"
          values="M280,120 Q310,150 340,120;M280,120 Q310,90 340,120;M280,120 Q310,150 340,120"
          dur="14s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.12;0.22;0.12"
          dur="9s"
          repeatCount="indefinite"
        />
      </path>
    </g>

    {/* Curved line above the head - positioned higher with wave-like appearance and blur effect */}
    <path
      d="M100,40 Q170,25 200,45 Q230,65 300,45"
      stroke="#FF7800"
      strokeWidth="1"
      fill="none"
      opacity="0.7"
      filter="url(#motionBlur)"
    >
      <animate
        attributeName="opacity"
        values="0.7;0.9;0.7"
        dur="5s"
        repeatCount="indefinite"
      />
    </path>

    {/* Enhanced ancient discus thrower (based on Myron's Discobolus) */}
    <g transform="translate(200, 180) scale(1.2)">
      {/* More complex swaying animation */}
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="-4 0 0; 0 0 0; 4 0 0; 0 0 0; -4 0 0"
        dur="5s"
        repeatCount="indefinite"
        additive="sum"
      />

      {/* Silhouette with dynamic pulsing and subtle morphing */}
      <path
        d="M-10,-60 C-5,-65 5,-65 10,-60 C15,-55 15,-45 10,-40 C5,-35 -5,-35 -10,-40 C-15,-45 -15,-55 -10,-60 Z 
                 M0,-35 L-10,-10 L-40,-20 C-45,-15 -50,-5 -45,5 C-40,10 -30,5 -20,0 L-10,5 L-15,50 L10,60 L15,5 L30,0 
                 C40,5 50,0 45,-10 C40,-20 30,-20 20,-15 L0,-35 Z"
        fill="url(#orangeGradient)"
        filter="url(#glow)"
      >
        {/* Enhanced pulsating effect */}
        <animate
          attributeName="opacity"
          values="0.9;1;0.95;1;0.9"
          dur="4s"
          repeatCount="indefinite"
        />

        {/* Subtle path morphing for more organic movement */}
        <animate
          attributeName="d"
          values="M-10,-60 C-5,-65 5,-65 10,-60 C15,-55 15,-45 10,-40 C5,-35 -5,-35 -10,-40 C-15,-45 -15,-55 -10,-60 Z 
                    M0,-35 L-10,-10 L-40,-20 C-45,-15 -50,-5 -45,5 C-40,10 -30,5 -20,0 L-10,5 L-15,50 L10,60 L15,5 L30,0 
                    C40,5 50,0 45,-10 C40,-20 30,-20 20,-15 L0,-35 Z;
                    
                    M-10,-62 C-5,-67 5,-67 10,-62 C15,-57 15,-43 10,-38 C5,-33 -5,-33 -10,-38 C-15,-43 -15,-57 -10,-62 Z 
                    M0,-33 L-10,-8 L-40,-18 C-45,-13 -52,-3 -47,7 C-42,12 -30,7 -20,2 L-10,7 L-15,52 L10,62 L15,7 L30,2 
                    C40,7 52,2 47,-8 C42,-18 30,-18 20,-13 L0,-33 Z;
                    
                    M-10,-60 C-5,-65 5,-65 10,-60 C15,-55 15,-45 10,-40 C5,-35 -5,-35 -10,-40 C-15,-45 -15,-55 -10,-60 Z 
                    M0,-35 L-10,-10 L-40,-20 C-45,-15 -50,-5 -45,5 C-40,10 -30,5 -20,0 L-10,5 L-15,50 L10,60 L15,5 L30,0 
                    C40,5 50,0 45,-10 C40,-20 30,-20 20,-15 L0,-35 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>

      {/* Enhanced disk with particle effects and complex animation */}
      <g>
        {/* Disk trajectory visualization (subtle path trace) */}
        <path
          d="M-40,-5 Q-20,-30 0,-35"
          fill="none"
          stroke="#FF7800"
          strokeWidth="0.5"
          strokeDasharray="1,2"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0;0.5;0"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Main disk with enhanced rotation and effects */}
        <circle
          cx="-40"
          cy="-5"
          r="10"
          fill="#101010"
          stroke="#FF7800"
          strokeWidth="1.5"
          filter="url(#particleGlow)"
        >
          {/* Complex rotation animation */}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 -40 -5"
            to="360 -40 -5"
            dur="4s"
            repeatCount="indefinite"
          />

          {/* Pulsating glow effect */}
          <animate
            attributeName="stroke-width"
            values="1;2.5;1"
            dur="2s"
            repeatCount="indefinite"
          />

          {/* Subtle size variation */}
          <animate
            attributeName="r"
            values="10;10.5;10"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Enhanced particle effects around disk */}
        <g>
          <circle cx="-40" cy="-5" r="1" fill="#FFAA00" opacity="0.7">
            <animate
              attributeName="cx"
              values="-40;-30"
              dur="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="-5;-15"
              dur="0.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;0"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="-40" cy="-5" r="0.8" fill="#FFAA00" opacity="0.7">
            <animate
              attributeName="cx"
              values="-40;-35"
              dur="0.7s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="-5;-12"
              dur="0.7s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;0"
              dur="0.7s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="-40" cy="-5" r="0.6" fill="#FFAA00" opacity="0.7">
            <animate
              attributeName="cx"
              values="-40;-45"
              dur="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="-5;-10"
              dur="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.7;0"
              dur="0.4s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Additional particles for more dynamic effect */}
          <circle cx="-40" cy="-5" r="1.2" fill="#FFBB00" opacity="0.65">
            <animate
              attributeName="cx"
              values="-40;-32"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="-5;-13"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.65;0"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="-40" cy="-5" r="0.7" fill="#FFAA00" opacity="0.75">
            <animate
              attributeName="cx"
              values="-40;-38"
              dur="0.65s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="-5;-14"
              dur="0.65s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.75;0"
              dur="0.65s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </g>
    </g>

    {/* Enhanced ANTIQUE BODY text with modern text effects */}
    <g transform="translate(200, 310)">
      {/* ANTIQUE text with advanced shimmer effect */}
      <text
        x="0"
        y="0"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        textAnchor="middle"
        fill="url(#enhancedShimmer)"
        filter="url(#glow)"
      >
        ANTIQUE
        {/* Letter by letter reveal animation */}
        <animate
          attributeName="opacity"
          values="0;1"
          dur="1s"
          begin="0.2s"
          fill="freeze"
        />
        {/* Text scaling effect */}
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.95;1.02;1;1.02;0.95"
          dur="5s"
          repeatCount="indefinite"
          additive="sum"
        />
      </text>

      {/* BODY text with different animation timing */}
      <text
        x="0"
        y="35"
        fontFamily="Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FFFFFF"
        filter="url(#glow)"
      >
        BODY
        {/* Letter by letter reveal animation, slightly delayed */}
        <animate
          attributeName="opacity"
          values="0;1"
          dur="1s"
          begin="0.7s"
          fill="freeze"
        />
        {/* Different scaling pattern from ANTIQUE */}
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.05;0.98;1.05;1"
          dur="5s"
          repeatCount="indefinite"
          additive="sum"
        />
      </text>
    </g>

    <g>
      <line
        x1="150"
        y1="280"
        x2="250"
        y2="280"
        stroke="url(#orangeGradient)"
        strokeWidth="2"
        strokeLinecap="round"
      >
        {/* Advanced animation for the line */}
        <animate
          attributeName="x1"
          values="170;150;170"
          dur="7s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="x2"
          values="230;250;230"
          dur="7s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke-width"
          values="1;2.5;1"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.7;1;0.7"
          dur="5s"
          repeatCount="indefinite"
        />
      </line>
      {/* Particle effects along the line */}
      <circle cx="200" cy="280" r="1.5" fill="#FFAA00" opacity="0.8">
        <animate
          attributeName="cx"
          values="150;250;150"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.8;0"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="180" cy="280" r="1" fill="#FFAA00" opacity="0.6">
        <animate
          attributeName="cx"
          values="150;250;150"
          dur="5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.6;0"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Enhanced particle trail */}
      <circle cx="190" cy="280" r="1.2" fill="#FFAA00" opacity="0.7">
        <animate
          attributeName="cx"
          values="150;250;150"
          dur="4.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.7;0"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
);

export default AntiqueBodyLogo;
