"use client";

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

import { Card } from "..";

export const SelectionCard = ({
    selected,
    onClick,
    title,
    description,
    bgImage,
    className = "",
    aspect = "aspect-[4/3]",
    icon,
    emoji,
    iconName,
    // Enhanced styling options
    accentColor = "#FF7800",
    iconSize = "48",
    animateSelection = true,
    cardStyle = "default", // default, premium, minimal, gradient
    customGradient = "",
    showBadge = false,
    badgeText = "",
    iconBackground = true,
}) => {
    const { t } = useTranslation();
    
    // Get styling based on cardStyle
    const getCardStyle = () => {
        switch(cardStyle) {
            case 'premium':
                return {
                    variant: "premium",
                    accentCorner: true,
                    accentCornerColor: accentColor,
                    accentCornerPosition: "top-right",
                    glowEffect: selected,
                    glowColor: `${accentColor}40`,
                    animate: true,
                    animationVariant: "scale",
                };
            case 'minimal':
                return {
                    borderColor: selected ? accentColor : "transparent",
                    bgGradientFrom: "rgba(15,15,15,0.7)",
                    bgGradientTo: "rgba(15,15,15,0.7)",
                    backdropBlur: "md",
                    shadow: selected ? `0 8px 20px ${accentColor}20` : "none",
                    hoverShadow: `0 8px 25px ${accentColor}30`,
                };
            case 'gradient':
                return {
                    bgGradientFrom: customGradient ? customGradient.split(',')[0] : "rgba(30,30,30,0.8)",
                    bgGradientTo: customGradient ? customGradient.split(',')[1] : "rgba(20,20,20,0.8)",
                    borderColor: selected ? accentColor : "#2a2a2a",
                    shadow: selected ? `0 10px 25px ${accentColor}30` : "0 8px 15px rgba(0,0,0,0.3)",
                    animate: true,
                    animationVariant: "slideUp",
                };
            case 'glass':
                return {
                    variant: "glass",
                    borderColor: selected ? accentColor : "rgba(255,255,255,0.1)",
                    glowEffect: selected,
                    glowColor: `${accentColor}30`,
                    backdropBlur: "md",
                };
            default:
                return {};
        }
    };

    // Combine card style with base props
    const cardProps = {
        className: `relative ${aspect} overflow-hidden cursor-pointer ${className} transition-all duration-300`,
        borderTop: false,
        borderColor: selected ? accentColor : "#222",
        shadow: selected ? `0 0 20px ${accentColor}30` : "0 5px 15px rgba(0,0,0,0.2)",
        bgGradientFrom: selected ? "rgba(30,30,30,0.9)" : "rgba(20,20,20,0.8)",
        bgGradientTo: selected ? "rgba(30,30,30,0.9)" : "rgba(20,20,20,0.8)",
        padding: "0",
        width: "100%",
        onClick: onClick,
        // Hover props
        hoverTranslateY: "-3px",
        hoverBorderColor: accentColor,
        hoverShadow: `0 8px 20px ${accentColor}20`,
        hoverBgGradientFrom: "rgba(25,25,25,0.9)",
        hoverBgGradientTo: "rgba(25,25,25,0.9)",
        hoverScale: "1.02",
        ...(bgImage && {
            style: {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            },
        }),
        // Apply card style
        ...getCardStyle(),
    };

    // Remove cardStyle from props before passing to Card
    const { cardStyle: _, ...finalCardProps } = cardProps;

    // Card icon animations
    const iconAnimation = {
        initial: { scale: 1 },
        animate: selected ? { 
            scale: [1, 1.15, 1],
            transition: { duration: 0.5, ease: "easeInOut" }
        } : {},
    };
    
    // Badge component for premium or special cards
    const Badge = () => (
        <div className="absolute -top-2 -right-2 z-20">
            <div 
                className="px-2 py-1 text-xs font-bold rounded-full shadow-lg"
                style={{ backgroundColor: accentColor, color: '#fff' }}
            >
                {t(badgeText)}
            </div>
        </div>
    );

    return (
        <Card {...finalCardProps}>
            {bgImage && <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                {showBadge && badgeText && <Badge />}
                
                <motion.div 
                    className={`mb-3 ${selected ? 'text-white' : 'text-white'} transition-colors duration-300`}
                    style={{ color: selected ? accentColor : 'white' }}
                    {...(animateSelection ? iconAnimation : {})}
                >
                    {iconBackground && (
                        <div 
                            className={`p-3 rounded-full mb-3 ${selected ? 'scale-110' : ''} transition-all duration-300`}
                            style={{ 
                                background: selected ? `${accentColor}20` : 'rgba(255,255,255,0.1)',
                                boxShadow: selected ? `0 0 15px ${accentColor}30` : 'none'
                            }}
                        >
                            {iconName ? (
                                <Icon icon={iconName} width={iconSize} height={iconSize} style={{ color: selected ? accentColor : 'white' }} />
                            ) : (
                                icon || <div className="text-4xl">{emoji}</div>
                            )}
                        </div>
                    )} 
                    
                    {!iconBackground && (
                        iconName ? (
                            <Icon icon={iconName} width={iconSize} height={iconSize} style={{ color: selected ? accentColor : 'white' }} />
                        ) : (
                            icon || <div className="text-4xl">{emoji}</div>
                        )
                    )}
                </motion.div>
                
                <h3 className="text-lg font-bold mb-2 transition-colors duration-300" style={{ color: selected ? accentColor : 'white' }}>
                    {t(title)}
                </h3>
                <p className="text-sm text-[#aaa]">{t(description)}</p>
                
                {selected && (
                    <motion.div 
                        className="absolute bottom-2 right-2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={{ color: accentColor }}
                    >
                        <Icon icon="mdi:check-circle" width="24" height="24" />
                    </motion.div>
                )}
            </div>
        </Card>
    );
};
