import { BrandLogoIcon } from "../common/Icons";

export const BrandLogo = ({ size = "medium" }) => {
    return (
        <div className="flex items-center justify-center gap-3">
            <BrandLogoIcon size={size} />
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-transparent">
                AntiqueBody
            </span>
        </div>
    );
};

export const AntiqueBodyLogo = () => {
    return (
        <div className="flex justify-center items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 400 400">
                <defs>
                    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#FF6B00", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#FF9A00", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>
                <g transform="translate(200, 200) scale(0.9)">
                    <path
                        d="M-10,-60 C-5,-65 5,-65 10,-60 C15,-55 15,-45 10,-40 C5,-35 -5,-35 -10,-40 C-15,-45 -15,-55 -10,-60 Z
                    M0,-35 L-10,-10 L-40,-20 C-45,-15 -50,-5 -45,5 C-40,10 -30,5 -20,0 L-10,5 L-15,50 L10,60 L15,5 L30,0
                    C40,5 50,0 45,-10 C40,-20 30,-20 20,-15 L0,-35 Z"
                        fill="url(#footerGradient)"
                    />
                    <circle cx="-40" cy="-5" r="10" fill="#000" stroke="#FF6B00" strokeWidth="1" />
                </g>
            </svg>
            <h2 className="text-xl font-bold">
                ANTIQUE <span className="text-[#FF6B00]">BODY</span>
            </h2>
        </div>
    );
};
