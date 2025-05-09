"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./EffectBackground.css";

import { ColosseumIcon, ColumnIcon, DiscusIcon, ParthenonIcon, RunnerIcon, VaseIcon } from "@/components/common/Icons";

export const EffectBackground = () => {
    const canvasRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const particles = [];
        const particleCount = 100;

        // Set canvas dimensions
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Track mouse position for interactive particles
        const handleMouseMove = (event) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Create different types of particles
        for (let i = 0; i < particleCount; i++) {
            const size =
                Math.random() < 0.2
                    ? Math.random() * 3 + 2 // Larger particles (20% chance)
                    : Math.random() * 2 + 0.5; // Normal particles

            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: size,
                baseRadius: size, // Store original size for pulsing effect
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * 0.4 - 0.2,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() < 0.3 ? "#FF9A00" : "#FF6B00",
                pulseSpeed: Math.random() * 0.1,
                pulseDirection: 1,
                pulseAmount: Math.random() * 0.5 + 0.5,
            });
        }

        // Draw particles
        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines with proximity to mouse
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255, 107, 0, 0.05)";
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Draw lines between nearby particles
                    if (distance < 150) {
                        // Make lines more visible near mouse cursor
                        const distToMouse = Math.sqrt(
                            Math.pow((particles[i].x + particles[j].x) / 2 - mousePosition.x, 2) +
                                Math.pow((particles[i].y + particles[j].y) / 2 - mousePosition.y, 2)
                        );

                        const alpha = Math.min(0.15, 2000 / Math.pow(distToMouse + 200, 2));
                        ctx.strokeStyle = `rgba(255, 107, 0, ${alpha})`;

                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.beginPath();
                    }
                }
            }

            // Draw and update particles
            particles.forEach((particle) => {
                // Pulse effect
                particle.pulseDirection =
                    particle.radius >= particle.baseRadius * (1 + particle.pulseAmount)
                        ? -1
                        : particle.radius <= particle.baseRadius * (1 - particle.pulseAmount * 0.5)
                          ? 1
                          : particle.pulseDirection;

                particle.radius += particle.pulseDirection * particle.pulseSpeed;

                // Effect of mouse proximity
                const dx = mousePosition.x - particle.x;
                const dy = mousePosition.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                // Draw particle with color & glow
                if (distance < maxDistance) {
                    // Particle reacts to mouse proximity
                    const scale = 1 + (maxDistance - distance) / maxDistance;
                    const glowSize = particle.radius * scale * 2;

                    // Glow effect
                    const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize);
                    gradient.addColorStop(0, `rgba(255, 107, 0, ${particle.opacity * 0.8})`);
                    gradient.addColorStop(1, "rgba(255, 107, 0, 0)");

                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    // Particle core
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius * scale, 0, Math.PI * 2);
                    ctx.fillStyle = particle.color;
                    ctx.fill();
                } else {
                    // Normal particle
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${particle.color === "#FF6B00" ? "255, 107, 0" : "255, 154, 0"}, ${particle.opacity})`;
                    ctx.fill();
                }

                // Update particle position
                particle.x += particle.speedX;
                particle.y += particle.speedY;

                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });

            requestAnimationFrame(drawParticles);
        };

        drawParticles();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mousePosition]);

    return (
        <div className="home-background-container">
            {/* Canvas for particles */}
            <canvas ref={canvasRef} className="particle-canvas"></canvas>

            {/* Gradient overlays */}
            <div className="gradient-overlay top-gradient"></div>
            <div className="gradient-overlay bottom-gradient"></div>
            <div className="gradient-overlay center-gradient"></div>

            {/* Greek patterns */}
            <div className="greek-pattern-container">
                <div className="greek-pattern top-pattern"></div>
                <div className="greek-pattern bottom-pattern"></div>
                <div className="greek-pattern left-pattern"></div>
                <div className="greek-pattern right-pattern"></div>
            </div>

            {/* Ancient icons with enhanced animations */}
            <div className="ancient-elements visible">
                <motion.div
                    className="ancient-building parthenon"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.1 }}
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                >
                    <ParthenonIcon className="w-full h-full" />
                </motion.div>

                <motion.div
                    className="olympian runner"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 0.4, x: 0 }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                >
                    <RunnerIcon className="w-full h-full" />
                </motion.div>

                <motion.div
                    className="olympian discus"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 0.4, x: 0 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                >
                    <DiscusIcon className="w-full h-full" />
                </motion.div>

                <motion.div
                    className="ancient-building colosseum"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                >
                    <ColosseumIcon className="w-full h-full" />
                </motion.div>

                <motion.div
                    className="ancient-building column"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                >
                    <ColumnIcon className="w-full h-full" />
                </motion.div>

                <motion.div
                    className="ancient-building vase"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.6 }}
                    whileHover={{ scale: 1.05, opacity: 0.5 }}
                >
                    <VaseIcon className="w-full h-full" />
                </motion.div>
            </div>

            {/* Floating elements */}
            <div className="floating-elements">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className={`floating-element element-${index + 1}`}></div>
                ))}
            </div>

            {/* Dynamic lighting effect */}
            <div
                className="dynamic-light"
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                }}
            ></div>

            {/* Golden ratio spiral decoration */}
            <div className="golden-ratio">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="golden-ratio-svg">
                    <path d="M98,2 C98,59.5 59.5,98 2,98" stroke="#FF6B00" strokeOpacity="0.1" strokeWidth="1" fill="none" />
                    <path
                        d="M98,2 C98,38.4 67.7,68.3 31.7,68.3"
                        stroke="#FF6B00"
                        strokeOpacity="0.1"
                        strokeWidth="1"
                        fill="none"
                    />
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
};
