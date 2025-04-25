import React from "react";

export const BackgroundShapes = () => {
    return (
        <div className="fixed w-full h-full overflow-hidden z-10">
            {/* Parthenon at top */}
            <div
                className="absolute w-48 h-20 top-0 left-1/2 -translate-x-1/2 -translate-y-2/5 opacity-40 transition-all duration-500 ease-in-out hover:opacity-60 hover:-translate-y-1/3"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'%3E%3Cpath d='M10,60 L190,60 L170,20 L30,20 Z M25,60 L25,40 L35,40 L35,60 Z M45,60 L45,40 L55,40 L55,60 Z M65,60 L65,40 L75,40 L75,60 Z M85,60 L85,40 L95,40 L95,60 Z M105,60 L105,40 L115,40 L115,60 Z M125,60 L125,40 L135,40 L135,60 Z M145,60 L145,40 L155,40 L155,60 Z M165,60 L165,40 L175,40 L175,60 Z' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
                }}
            />

            {/* Discus thrower */}
            <div
                className="absolute w-24 h-24 top-1/3 right-[5%] transition-transform duration-500 ease-in-out hover:rotate-5 hover:scale-105"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50,20 C53,20 55,22 55,25 C55,28 53,30 50,30 C47,30 45,28 45,25 C45,22 47,20 50,20 Z M50,35 L43,45 L28,40 C25,43 22,48 25,53 C28,55 35,53 43,50 L46,53 L43,75 L55,75 L58,53 L65,50 C72,53 77,50 75,45 C72,40 65,40 58,43 L50,35 Z' fill='%23FFFFFF'/%3E%3Ccircle cx='28' cy='45' r='6' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.4,
                    filter: "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
                }}
            />

            {/* Colosseum at bottom */}
            <div
                className="absolute w-48 h-24 bottom-0 left-1/2 -translate-x-1/2 translate-y-2/5 opacity-40 transition-all duration-500 ease-in-out hover:opacity-60 hover:translate-y-1/3"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'%3E%3Cellipse cx='100' cy='60' rx='80' ry='30' fill='none' stroke='%23FFFFFF' stroke-width='3'/%3E%3Cellipse cx='100' cy='60' rx='65' ry='25' fill='none' stroke='%23FFFFFF' stroke-width='2'/%3E%3Cpath d='M35,60 L35,40 M45,60 L45,35 M55,60 L55,30 M65,60 L65,28 M75,60 L75,25 M85,60 L85,24 M95,60 L95,23 M105,60 L105,23 M115,60 L115,24 M125,60 L125,25 M135,60 L135,28 M145,60 L145,30 M155,60 L155,35 M165,60 L165,40' stroke='%23FFFFFF' stroke-width='2'/%3E%3C/svg%3E")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
                }}
            />

            {/* Runner on left */}
            <div
                className="absolute w-20 h-28 top-1/2 left-[5%] -translate-y-1/2 transition-transform duration-500 ease-in-out hover:-translate-y-[48%] hover:translate-x-[5px]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 120'%3E%3Cpath d='M40,20 C43,20 46,23 46,26 C46,29 43,32 40,32 C37,32 34,29 34,26 C34,23 37,20 40,20 Z M34,38 L40,45 L46,42 L52,53 L46,60 L40,53 L34,64 L40,82 L34,90 L28,75 L34,38 Z' fill='%23FFFFFF'/%3E%3C/svg%3E")`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.4,
                    filter: "brightness(0) saturate(100%) invert(56%) sepia(83%) saturate(1500%) hue-rotate(360deg) brightness(100%) contrast(106%)",
                }}
            />
        </div>
    );
};
