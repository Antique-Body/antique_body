"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/common/Button";
import { BrandLogo } from "@/components/common/BrandLogo";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
          ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/30 py-3"
          : "bg-transparent py-6"
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
                fontSize: "2rem",
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
              className="relative px-4 py-2 text-base font-medium tracking-wide text-gray-300 transition-all duration-300 hover:text-white group"
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
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="orangeOutline" size="small" className="px-5">
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
                className="font-medium px-5 py-2 relative z-10 overflow-hidden group"
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
            className="text-white focus:outline-none relative z-50 w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-5">
              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : "-translate-y-2"
                }`}
              ></span>

              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>

              <span
                className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? "-rotate-45 translate-y-2" : "translate-y-2"
                }`}
              ></span>
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-0 z-40 bg-gradient-to-b from-black to-[#121212]/95 backdrop-blur-xl pt-20"
          >
            <div className="container mx-auto px-6 py-8">
              <div className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      className={`py-4 text-left text-xl font-semibold tracking-wide transition-all duration-300 border-b border-gray-800 flex items-center
                                            ${
                                              pathname === item.path
                                                ? "text-[#FF6B00]"
                                                : "text-gray-300"
                                            }`}
                    >
                      <span className="mr-3 text-[#FF6B00] opacity-60">
                        0{index + 1}
                      </span>
                      {item.label}
                      {pathname === item.path && (
                        <span className="ml-3 h-1 w-3 rounded-full bg-[#FF6B00]"></span>
                      )}
                    </Link>
                  </motion.div>
                ))}

                <div className="flex flex-col space-y-4 pt-8 mt-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Link href="/auth/login">
                      <Button
                        variant="orangeOutline"
                        size="medium"
                        className="w-full py-3 text-base font-semibold"
                      >
                        Login
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <Link href="/auth/register">
                      <Button
                        variant="orangeFilled"
                        size="medium"
                        className="w-full py-3 text-base font-semibold"
                      >
                        Register
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
