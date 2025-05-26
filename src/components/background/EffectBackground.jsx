"use client";

import "./EffectBackground.css";

export const EffectBackground = () => (
    <div className="home-background-container">
        {/* Gradient overlays */}
        <div className="gradient-overlay top-gradient"></div>
        <div className="gradient-overlay bottom-gradient"></div>
        <div className="gradient-overlay center-gradient"></div>

        {/* Floating elements */}
        <div className="floating-elements">
            {[...Array(5)].map((_, index) => (
                <div key={index} className={`floating-element element-${index + 1}`}></div>
            ))}
        </div>

        {/* Golden ratio spiral decoration */}
        <div className="golden-ratio">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="golden-ratio-svg">
                <path d="M98,2 C98,59.5 59.5,98 2,98" stroke="#FF6B00" strokeOpacity="0.1" strokeWidth="1" fill="none" />
                <path d="M98,2 C98,38.4 67.7,68.3 31.7,68.3" stroke="#FF6B00" strokeOpacity="0.1" strokeWidth="1" fill="none" />
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
