"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { BrandLogo } from "@/components/common/BrandLogo";
import { Button } from "@/components/common/Button";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFontSize, setLogoFontSize] = useState("2rem");
  const pathname = usePathname();

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle responsive font size
  useEffect(() => {
    const updateFontSize = () => {
      setLogoFontSize(window.innerWidth < 640 ? "1.5rem" : "2rem");
    };

    updateFontSize();
    window.addEventListener("resize", updateFontSize);
    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Navigation items shared across all pages
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/trainers-marketplace", label: "Trainers" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/30 py-2 sm:py-3"
          : "bg-transparent py-4 sm:py-6"
      }`}
    >
      {/* Glass effect border */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent transition-opacity duration-300
                ${scrolled ? "opacity-100" : "opacity-0"}
            `}
      ></div>

      {/* Glow effect on scroll */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent transition-opacity duration-300
                ${scrolled ? "opacity-100" : "opacity-0"}
            `}
      ></div>

      <div className="container mx-auto flex items-center justify-between px-4">
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-2 relative group">
            {/* Logo glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF9A00]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <BrandLogo
              className="flex items-center relative z-10"
              titleStyle={{
                fontSize: logoFontSize,
                fontWeight: "800",
                letterSpacing: "0.05em",
                marginBottom: "0",
              }}
              containerStyle={{
                marginBottom: "0",
              }}
              firstWordColor="#FF6B00"
              secondWordColor="#ffffff"
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="relative px-4 py-2 text-sm md:text-base font-medium tracking-wide text-gray-300 transition-all duration-300 hover:text-white group"
            >
              <span className="relative z-10">{item.label}</span>

              {/* Hover highlight effect */}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] transition-all duration-300 group-hover:w-full"></span>

              {/* Active indicator */}
              {pathname === item.path && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center space-x-3 md:space-x-4">
          <Link href="/auth/login">
            <Button
              variant="orangeOutline"
              size="small"
              className="px-4 md:px-5 text-sm"
            >
              Login
            </Button>
          </Link>

          <Link href="/auth/register">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Button glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00]/0 to-[#FF9A00]/0 group-hover:from-[#FF6B00]/30 group-hover:to-[#FF9A00]/30 rounded-md blur-md transition-all duration-500"></div>

              <Button
                variant="orangeFilled"
                size="small"
                className="font-medium px-4 md:px-5 py-2 relative z-10 overflow-hidden group text-sm"
              >
                <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                <span className="relative z-10">Register</span>
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            className="text-white focus:outline-none !focus-ring-0 !ring-0 relative z-50 w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-5 h-4 sm:w-6 sm:h-5">
              <span
                className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? "rotate-45 translate-y-1.5 sm:translate-y-2"
                    : "-translate-y-1.5 sm:-translate-y-2"
                }`}
              ></span>

              <span
                className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>

              <span
                className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen
                    ? "-rotate-45 translate-y-1.5 sm:translate-y-2"
                    : "translate-y-1.5 sm:translate-y-2"
                }`}
              ></span>
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu - IMPROVED */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 top-0 z-40 bg-gradient-to-b from-black via-[#0a0a0a] to-black backdrop-blur-xl pt-16 sm:pt-20"
          >
            {/* Background decorative elements */}
            <div className="absolute top-1/4 -left-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 -right-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#FF9A00]/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
              <div className="flex flex-col space-y-4 sm:space-y-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      className={`group py-3 sm:py-4 text-left text-xl sm:text-2xl font-bold tracking-wide transition-all duration-300 border-b border-gray-800/50 flex items-center justify-between hover:border-[#FF6B00]/30
                                            ${
                                              pathname === item.path
                                                ? "text-[#FF6B00]"
                                                : "text-gray-300 hover:text-white"
                                            }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 sm:mr-4 text-[#FF6B00]/60 text-base sm:text-lg font-normal">
                          0{index + 1}
                        </span>
                        <span className="group-hover:translate-x-2 transition-transform duration-300">
                          {item.label}
                        </span>
                      </div>

                      {pathname === item.path && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}

                <div className="flex flex-col space-y-3 sm:space-y-4 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-800/50">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Link href="/auth/login">
                      <Button
                        variant="orangeOutline"
                        size="medium"
                        className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 hover:scale-105"
                      >
                        Login
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Link href="/auth/register">
                      <Button
                        variant="orangeFilled"
                        size="medium"
                        className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold relative overflow-hidden group transition-all duration-300 hover:scale-105"
                      >
                        <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                        <span className="relative z-10">Register</span>
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* Footer text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center pt-6 sm:pt-8 text-xs sm:text-sm text-gray-500"
                >
                  Discover your ancient strength
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
