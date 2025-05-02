// Navigation Icons
export const ArrowLeft = ({ size = 18, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

export const ArrowRight = ({ size = 18, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5l7 7-7 7" />
  </svg>
);

export const ArrowUp = ({ size = 18, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

export const ArrowDown = ({ size = 18, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 5v14" />
    <path d="M19 12l-7 7-7-7" />
  </svg>
);

// Status Icons
export const CheckIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// Audio Icons
export const PlayIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PauseIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
  </svg>
);

// Loading Icons
export const SpinnerIcon = ({ className = "", ...props }) => (
  <svg
    className={`h-5 w-5 animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Greek Theme Icons
export const TrainerIcon = ({ className = "h-12 w-12", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill={fill} {...props}>
    <path d="M50,20 C53,20 55,22 55,25 C55,28 53,30 50,30 C47,30 45,28 45,25 C45,22 47,20 50,20 Z" />
    <path d="M50,35 L43,45 L28,40 C25,43 22,48 25,53 C28,55 35,53 43,50 L46,53 L43,75 L55,75 L58,53 L65,50 C72,53 77,50 75,45 C72,40 65,40 58,43 L50,35 Z" />
    <circle cx="28" cy="45" r="6" />
  </svg>
);

export const ClientIcon = ({ className = "h-12 w-12", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill={fill} {...props}>
    <path d="M50,15 C53,15 56,18 56,21 C56,24 53,27 50,27 C47,27 44,24 44,21 C44,18 47,15 50,15 Z" />
    <path d="M50,32 L42,55 L30,40 C25,45 25,55 30,60 C35,65 42,63 50,60 L58,63 C66,65 73,65 78,60 C83,55 83,45 78,40 L66,55 L58,32 L50,32 Z" />
    <path d="M30,15 C25,22 22,30 25,38 C28,46 35,50 30,15 Z" />
    <path d="M70,15 C75,22 78,30 75,38 C72,46 65,50 70,15 Z" />
  </svg>
);

export const UserIcon = ({ className = "h-12 w-12", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill={fill} {...props}>
    <rect x="35" y="75" width="30" height="10" />
    <rect x="35" y="15" width="30" height="10" />
    <rect x="40" y="25" width="20" height="50" />
    <path d="M30,15 L70,15 L65,5 L35,5 Z" />
    <path d="M42,40 C30,35 30,65 42,60 M58,40 C70,35 70,65 58,60" />
    <path d="M44,38 L56,38 L56,62 L44,62 Z" />
  </svg>
);

// Greek Artefacts
export const ParthenonIcon = ({ className = "", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80" className={className} fill={fill} {...props}>
    <path d="M10,60 L190,60 L170,20 L30,20 Z M25,60 L25,40 L35,40 L35,60 Z M45,60 L45,40 L55,40 L55,60 Z M65,60 L65,40 L75,40 L75,60 Z M85,60 L85,40 L95,40 L95,60 Z M105,60 L105,40 L115,40 L115,60 Z M125,60 L125,40 L135,40 L135,60 Z M145,60 L145,40 L155,40 L155,60 Z M165,60 L165,40 L175,40 L175,60 Z" />
  </svg>
);

export const ColosseumIcon = ({ className = "", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100" className={className} fill={fill} {...props}>
    <ellipse cx="100" cy="60" rx="80" ry="30" fill="none" stroke="currentColor" strokeWidth="3" />
    <ellipse cx="100" cy="60" rx="65" ry="25" fill="none" stroke="currentColor" strokeWidth="2" />
    <path
      d="M35,60 L35,40 M45,60 L45,35 M55,60 L55,30 M65,60 L65,28 M75,60 L75,25 M85,60 L85,24 M95,60 L95,23 M105,60 L105,23 M115,60 L115,24 M125,60 L125,25 M135,60 L135,28 M145,60 L145,30 M155,60 L155,35 M165,60 L165,40"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const VaseIcon = ({ className = "", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 100" className={className} fill={fill} {...props}>
    <path
      d="M30,20 C30,10 50,10 50,20 L45,30 L35,30 Z M35,30 C25,35 25,75 30,85 C35,90 45,90 50,85 C55,75 55,35 45,30 Z M30,85 C30,90 50,90 50,85 L50,80 L30,80 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const ColumnIcon = ({ className = "", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" className={className} fill={fill} {...props}>
    <path
      d="M35,10 L45,10 L44,110 L36,110 Z M40,10 L40,0 L40,110 L40,120"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const RunnerIcon = ({ className = "", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" className={className} fill={fill} {...props}>
    <path d="M40,20 C43,20 46,23 46,26 C46,29 43,32 40,32 C37,32 34,29 34,26 C34,23 37,20 40,20 Z M34,38 L40,45 L46,42 L52,53 L46,60 L40,53 L34,64 L40,82 L34,90 L28,75 L34,38 Z" />
  </svg>
);

export const DiscusIcon = ({ className = "", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill={fill} {...props}>
    <path d="M50,20 C53,20 55,22 55,25 C55,28 53,30 50,30 C47,30 45,28 45,25 C45,22 47,20 50,20 Z M50,35 L43,45 L28,40 C25,43 22,48 25,53 C28,55 35,53 43,50 L46,53 L43,75 L55,75 L58,53 L65,50 C72,53 77,50 75,45 C72,40 65,40 58,43 L50,35 Z" />
    <circle cx="28" cy="45" r="6" />
  </svg>
);

// Brand Icons

export const BrandLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="160" height="160">
    {/* Gradient definitions */}
    <defs>
      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FF7800", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FF9A00", stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#0A0A0A", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#1A1A1A", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* Ancient discobolus silhouette (inspired by Myron) */}
    <path
      d="M190,120
       C195,115 205,115 210,120
       C215,125 215,135 210,140
       C205,145 195,145 190,140
       C185,135 185,125 190,120 Z

       M200,145
       L190,170
       L160,160
       C155,165 150,175 155,185
       C160,190 170,185 180,180
       L190,185
       L185,230
       L210,240
       L215,185
       L230,180
       C240,185 250,180 245,170
       C240,160 230,160 220,165
       L200,145 Z"
      fill="url(#orangeGradient)"
    />

    {/* Disc */}
    <circle cx="160" cy="175" r="10" fill="#000" stroke="#FF7800" strokeWidth="1" />

    {/* Decorative lines */}
    <line x1="150" y1="280" x2="250" y2="280" stroke="#FF7800" strokeWidth="2" />
    <line x1="175" y1="290" x2="225" y2="290" stroke="#FF7800" strokeWidth="1.5" />
    <path d="M150,285 C175,275 225,275 250,285" stroke="#FF7800" strokeWidth="1" fill="none" />
    <path d="M175,295 C188,300 212,300 225,295" stroke="#FF9A00" strokeWidth="0.8" fill="none" opacity="0.7" />
  </svg>
);
export const GoogleIcon = ({ className = "", ...props }) => (
  <svg className={`h-5 w-5 ${className}`} viewBox="0 0 24 24" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const GreekLoaderIcon = ({ size = "lg", className = "", ...props }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  return (
    <div className={`${sizeClasses[size]} relative mx-auto ${className}`} {...props}>
      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#ff7800"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="180 250"
        />
        <path
          d="M30,15 L70,15 L65,5 L35,5 Z M40,15 L40,85 M60,15 L60,85 M30,85 L70,85"
          stroke="#ff7800"
          strokeWidth="2"
        />
      </svg>

      {/* Greek meander pattern around spinner */}
      <div
        className="absolute inset-0 -m-2 animate-spin rounded-full"
        style={{
          animationDirection: "reverse",
          animationDuration: "12s",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M25,25 L75,25 L75,75 L25,75 Z' stroke='%23ff7800' fill='none' stroke-width='1' stroke-dasharray='10 5'/%3E%3C/svg%3E")`,
          backgroundSize: "contain",
        }}
      />
    </div>
  );
};

// Decorative Icons
export const GreekPatternIcon = ({ className = "", ...props }) => (
  <div
    className={`h-1 animate-pulse bg-white ${className}`}
    style={{
      width: "100%",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='4' viewBox='0 0 20 4'%3E%3Cpath d='M0,2 C1,0 4,0 5,2 C6,4 9,4 10,2 C11,0 14,0 15,2 C16,4 19,4 20,2' stroke='white' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat-x",
      backgroundSize: "20px 4px",
    }}
    {...props}
  />
);

export const GreekPatternBorder = ({ position = "top", isVisible = true }) => (
  <div
    className={`absolute ${position}-0 left-0 right-0 h-3 bg-repeat-x transition-all duration-500 ${
      isVisible ? "opacity-100" : "opacity-30"
    } ${position === "bottom" ? "bottom-0 rotate-180" : ""}`}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='12' viewBox='0 0 40 12'%3E%3Cpath d='M0,8 C2,5 5,5 8,8 C11,11 14,11 17,8 C20,5 23,5 26,8 C29,11 32,11 35,8 C38,5 40,5 40,8 L40,12 L0,12 Z' fill='%23ff7800'/%3E%3C/svg%3E")`,
      backgroundSize: "40px 12px",
    }}
  />
);

export const AdminIcon = ({ className = "h-12 w-12", fill = "currentColor", ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} fill={fill} {...props}>
    <path d="M50,15 C53,15 56,18 56,21 C56,24 53,27 50,27 C47,27 44,24 44,21 C44,18 47,15 50,15 Z" />
    <path d="M50,32 L42,55 L30,40 C25,45 25,55 30,60 C35,65 42,63 50,60 L58,63 C66,65 73,65 78,60 C83,55 83,45 78,40 L66,55 L58,32 L50,32 Z" />
    <path d="M30,15 C25,22 22,30 25,38 C28,46 35,50 30,15 Z" />
    <path d="M70,15 C75,22 78,30 75,38 C72,46 65,50 70,15 Z" />
    <path d="M45,75 L55,75 L55,85 L45,85 Z" />
    <path d="M40,85 L60,85 L60,95 L40,95 Z" />
  </svg>
);

export const CloseIcon = ({ size = 24, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const IconButton = ({
  icon: Icon,
  onClick,
  className = "",
  size = 24,
  hoverColor = "text-orange-500",
  defaultColor = "text-zinc-400",
  hoverBg = "hover:bg-zinc-700/30",
  ...props
}) => (
  <button
    onClick={onClick}
    className={`${defaultColor} hover:${hoverColor} cursor-pointer rounded-full p-2 ${hoverBg} ${className}`}
    {...props}
  >
    {typeof Icon === "function" ? <Icon size={size} /> : Icon}
  </button>
);

// Button Icons
export const PlusIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const CloseXIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Workout Icons
export const WorkoutIcon = ({ size = 20, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

// Timer Icon
export const TimerIcon = ({ size = 20, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// Message Icon
export const MessageIcon = ({ size = 20, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Nutrition Icon
export const NutritionIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

// Progress Chart Icon
export const ProgressChartIcon = ({ size = 20, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

// Send Icon
export const SendIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

// User Profile Icon
export const UserProfileIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Certificate Icon
export const CertificateIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

// Bookmark Icon (if not already present)
export const BookmarkIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Location Icon
export const LocationIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Clock Icon
export const ClockIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// Bell/Notification Icon
export const BellIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

// Settings Icon
export const SettingsIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const ChevronDownIcon = ({ size = 20, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const TrashIcon = ({ size = 14, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const MonitorIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

export const PerformanceIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M13 2L3 14h9l-1 8 10-16h-9l1-4z" />
  </svg>
);

export const StrengthIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 6h12v12H6z" />
    <path d="M4 10v4h2v-4H4zm14 0v4h2v-4h-2z" />
  </svg>
);

export const RecoveryIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const EducationIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export const InfoIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export const ErrorIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

export const CalendarIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export const NutritionStrategyIcon = () => (
  <span className="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,107,0,0.2)]">
    <svg viewBox="0 0 24 24" fill="#FF6B00" className="h-4 w-4">
      <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
    </svg>
  </span>
);

export const SaveIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export const ViewIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const EditIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export const MedicalIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

export const AlertIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export const InjuryIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M8 14V4l8 4z"></path>
    <path d="M8 18l8-4v10L8 20v-2"></path>
    <path d="M12 12a40 40 0 0 1-4 2 40 40 0 0 1-4-2 40 40 0 0 0 4-2 40 40 0 0 0 4 2"></path>
  </svg>
);

export const TargetIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

export const RulerIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M21 4L3 20" />
    <path d="M10.5 7L9.5 6" />
    <path d="M13.5 10L12.5 9" />
    <path d="M16.5 13L15.5 12" />
    <path d="M7.5 4L6.5 3" />
    <path d="M4.5 7L3.5 6" />
    <path d="M13.5 4L12.5 3" />
    <path d="M16.5 7L15.5 6" />
    <path d="M10.5 13L9.5 12" />
    <path d="M7.5 16L6.5 15" />
    <path d="M4.5 19L3.5 18" />
  </svg>
);

export const ChartBarIcon = ({ size = 16, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20v-4" />
    <path d="M2 20h20" />
  </svg>
);

export const ChatMessageIcon = ({ size = 32, className = "", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
