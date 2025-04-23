import React, { useEffect, useRef, useState } from "react";
import {
  ParthenonIcon,
  RunnerIcon,
  DiscusIcon,
  ColosseumIcon,
  ColumnIcon,
  VaseIcon,
} from "@/components/common/Icons";
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
  const backgroundRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Optimizacija za praćenje scroll pozicije i mouse pozicije (parallax)
  useEffect(() => {
    // Dozvoli animacije tek nakon što je komponenta montirana
    setIsVisible(true);

    // Napredni parallax efekat baziran na skrolovanju
    const handleScroll = () => {
      if (!backgroundRef.current) return;

      const scrollPosition = window.scrollY;
      const scrollFactor = 0.03; // Suptilniji faktor za glatki efekat

      const elements = backgroundRef.current.querySelectorAll(
        ".ancient-building, .olympian"
      );
      elements.forEach((el) => {
        // Različite brzine za različite elemente
        const individualFactor =
          el.classList.contains("parthenon") ||
          el.classList.contains("colosseum")
            ? scrollFactor
            : scrollFactor * 0.7;

        // Primeni parallax transformaciju ali zadrži postojeće transformacije
        const baseTransform = window.getComputedStyle(el).transform;
        const parallaxY =
          el.classList.contains("parthenon") ||
          el.classList.contains("runner") ||
          el.classList.contains("discus")
            ? scrollPosition * individualFactor
            : -scrollPosition * individualFactor;

        // Primeni transformaciju zavisno od tipa elementa
        if (el.classList.contains("parthenon")) {
          el.style.transform = `translateX(-50%) translateY(calc(-40% - ${parallaxY}px))`;
        } else if (el.classList.contains("colosseum")) {
          el.style.transform = `translateX(-50%) translateY(calc(40% + ${parallaxY}px))`;
        } else if (el.classList.contains("runner")) {
          el.style.transform = `translateY(calc(20% - ${parallaxY}px))`;
        } else if (el.classList.contains("discus")) {
          el.style.transform = `translateY(calc(30% - ${parallaxY}px))`;
        } else if (el.classList.contains("column")) {
          el.style.transform = `translateY(calc(-30% + ${parallaxY}px))`;
        } else if (el.classList.contains("vase")) {
          el.style.transform = `translateY(calc(-20% + ${parallaxY}px))`;
        }
      });
    };

    // Mouse parallax efekat (suptilno praćenje miša)
    const handleMouseMove = (e) => {
      if (!backgroundRef.current) return;

      const mouseX = e.clientX / window.innerWidth - 0.5; // -0.5 do 0.5
      const mouseY = e.clientY / window.innerHeight - 0.5; // -0.5 do 0.5

      const elements = backgroundRef.current.querySelectorAll(
        ".ancient-building, .olympian"
      );
      elements.forEach((el) => {
        // Različiti efekti za različite elemente
        const depthFactor =
          el.classList.contains("parthenon") ||
          el.classList.contains("colosseum")
            ? 15
            : 8;

        // Primeni mouse parallax transformaciju bez ometanja drugih transformacija
        const currentTransform = window.getComputedStyle(el).transform;

        // Dodaj mouse parallax efekat na postojeću transformaciju
        const parallaxX = mouseX * depthFactor;
        const parallaxY = mouseY * depthFactor;

        // Primeni transformaciju zavisno od tipa elementa
        if (el.classList.contains("parthenon")) {
          el.style.transform = `translateX(calc(-50% + ${parallaxX}px)) translateY(calc(-40% + ${parallaxY}px))`;
        } else if (el.classList.contains("colosseum")) {
          el.style.transform = `translateX(calc(-50% + ${parallaxX}px)) translateY(calc(40% + ${parallaxY}px))`;
        } else if (el.classList.contains("runner")) {
          el.style.transform = `translateX(${parallaxX}px) translateY(calc(20% + ${parallaxY}px))`;
        } else if (el.classList.contains("discus")) {
          el.style.transform = `translateX(${parallaxX}px) translateY(calc(30% + ${parallaxY}px))`;
        } else if (el.classList.contains("column")) {
          el.style.transform = `translateX(${parallaxX}px) translateY(calc(-30% + ${parallaxY}px))`;
        } else if (el.classList.contains("vase")) {
          el.style.transform = `translateX(${parallaxX}px) translateY(calc(-20% + ${parallaxY}px))`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Automatsko resetovanje transformacija kada su elementi van ekrana
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Resetuj transformacije ako element nije vidljiv
            const elements = backgroundRef.current.querySelectorAll(
              ".ancient-building, .olympian"
            );
            elements.forEach((el) => {
              el.style.transition = "none";
              if (el.classList.contains("parthenon")) {
                el.style.transform = "translateX(-50%) translateY(-40%)";
              } else if (el.classList.contains("colosseum")) {
                el.style.transform = "translateX(-50%) translateY(40%)";
              } else if (el.classList.contains("runner")) {
                el.style.transform = "translateY(20%)";
              } else if (el.classList.contains("discus")) {
                el.style.transform = "translateY(30%)";
              } else if (el.classList.contains("column")) {
                el.style.transform = "translateY(-30%)";
              } else if (el.classList.contains("vase")) {
                el.style.transform = "translateY(-20%)";
              }
              setTimeout(() => {
                el.style.transition = "";
              }, 10);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (backgroundRef.current) {
      observer.observe(backgroundRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (backgroundRef.current) {
        observer.unobserve(backgroundRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`background-shapes ${className} ${
        isVisible ? "is-visible" : "is-hidden"
      }`}
      ref={backgroundRef}>
      {parthenon && (
        <div className="ancient-building parthenon">
          <ParthenonIcon className="w-[200px] h-[80px]" />
        </div>
      )}
      {runner && (
        <div className="olympian runner">
          <RunnerIcon className="w-[80px] h-[120px]" />
        </div>
      )}
      {discus && (
        <div className="olympian discus">
          <DiscusIcon className="w-[100px] h-[100px]" />
        </div>
      )}
      {colosseum && (
        <div className="ancient-building colosseum">
          <ColosseumIcon className="w-[200px] h-[100px]" />
        </div>
      )}
      {column && (
        <div className="ancient-building column">
          <ColumnIcon className="w-[80px] h-[120px]" />
        </div>
      )}
      {vase && (
        <div className="ancient-building vase">
          <VaseIcon className="w-[80px] h-[100px]" />
        </div>
      )}
    </div>
  );
};

// Memoriranje komponente za prevenciju nepotrebnih renderovanja
export default React.memo(Background);
