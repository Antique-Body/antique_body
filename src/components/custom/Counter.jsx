"use client";

import { useState, useEffect, useRef } from "react";

export function Counter({ end, duration = 2000, suffix = "", decimals = 0 }) {
    const [count, setCount] = useState(0);
    const startTimeRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Reset count when end value changes
        setCount(0);

        // Animation function
        const animate = (timestamp) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp;
            }

            const progress = timestamp - startTimeRef.current;
            const progressRatio = Math.min(progress / duration, 1);

            // Easing function for smoother animation (ease-out)
            const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
            const nextCount = easedProgress * end;

            setCount(nextCount);

            if (progressRatio < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [end, duration]);

    // Format the count with the appropriate number of decimal places
    const formattedCount = count.toFixed(decimals);

    return (
        <span>
            {formattedCount}
            {suffix}
        </span>
    );
}
