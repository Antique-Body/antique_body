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
      // Sigurnosna provera da postoji referenca
      if (!backgroundRef.current) return;

      const scrollPosition = window.scrollY;
      const scrollFactor = 0.03; // Suptilniji faktor za glatki efekat

      // Sigurnosna provera da su elementi dostupni pre pristupa
      try {
        const elements = backgroundRef.current.querySelectorAll(
          ".ancient-building, .olympian"
        );
        if (!elements || elements.length === 0) return;

        elements.forEach((el) => {
          // Različite brzine za različite elemente
          const individualFactor =
            el.classList.contains("parthenon") ||
            el.classList.contains("colosseum")
              ? scrollFactor
              : scrollFactor * 0.7;

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
      } catch (error) {
        console.log("Animation error:", error);
        // Tiho ignoriši grešku da ne prekineš aplikaciju
      }
    };

    // Mouse parallax efekat (suptilno praćenje miša)
    const handleMouseMove = (e) => {
      if (!backgroundRef.current) return;

      const mouseX = e.clientX / window.innerWidth - 0.5; // -0.5 do 0.5
      const mouseY = e.clientY / window.innerHeight - 0.5; // -0.5 do 0.5

      try {
        const elements = backgroundRef.current.querySelectorAll(
          ".ancient-building, .olympian"
        );
        if (!elements || elements.length === 0) return;

        elements.forEach((el) => {
          // Različiti efekti za različite elemente
          const depthFactor =
            el.classList.contains("parthenon") ||
            el.classList.contains("colosseum")
              ? 15
              : 8;

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
      } catch (error) {
        console.log("Mouse move error:", error);
      }
    };

    // Koristi setTimeout da osiguramo da su elementi učitani pre nego što dodamo event listenere
    const setupTimeoutId = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      // Izvrši handleScroll jednom nakon učitavanja za inicijalizaciju pozicija
      handleScroll();
    }, 100);

    // Automatsko resetovanje transformacija kada su elementi van ekrana
    let observer;
    if (backgroundRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && backgroundRef.current) {
              try {
                // Resetuj transformacije ako element nije vidljiv
                const elements = backgroundRef.current.querySelectorAll(
                  ".ancient-building, .olympian"
                );
                if (!elements || elements.length === 0) return;

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
              } catch (error) {
                console.log("Observer error:", error);
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(backgroundRef.current);
    }

    // Cleanup funkcija
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(setupTimeoutId);
      if (observer && backgroundRef.current) {
        observer.unobserve(backgroundRef.current);
      }
    };
  }, []); // Prazan dependency array - izvršava se samo jednom pri montiranju

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
