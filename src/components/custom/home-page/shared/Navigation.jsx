"use client";

import { Icon } from "@iconify/react";
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
    {
      path: "/",
      label: "Home",
      icon: "solar:home-smile-bold-duotone",
      description: "Welcome to your fitness journey",
    },
    {
      path: "/trainers-marketplace",
      label: "Trainers",
      icon: "solar:dumbbell-large-minimalistic-bold-duotone",
      description: "Find your perfect fitness coach",
    },
    {
      path: "/contact",
      label: "Contact",
      icon: "solar:phone-calling-rounded-bold-duotone",
      description: "Get in touch with our team",
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl shadow-lg shadow-black/30 py-3"
            : "bg-transparent py-3 md:py-4"
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
          {/* Logo - Left on desktop, Center on mobile */}
          <motion.div
            className="flex items-center md:flex-none absolute md:relative left-1/2 md:left-auto transform -translate-x-1/2 md:translate-x-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href="/"
              className="flex items-center space-x-2 relative group"
            >
              {/* Logo glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF9A00]/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <BrandLogo
                logoTitle="ANTIQUE BODY"
                className="flex items-center relative z-10"
                titleStyle={{
                  fontSize: logoFontSize,
                  fontWeight: "800",
                  letterSpacing: "0.05em",
                  marginBottom: "0",
                  lineHeight: "1",
                }}
                containerStyle={{
                  marginBottom: "0",
                  display: "flex",
                  alignItems: "center",
                }}
                firstWordColor="#FF6B00"
                secondWordColor="#ffffff"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center space-x-6 flex-1">
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

          {/* Auth buttons - Desktop only */}
          <div className="hidden md:flex items-center justify-end space-x-3 md:space-x-4 flex-shrink-0">
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

          {/* Mobile Menu Button - Right side */}
          <div className="md:hidden flex items-center justify-end relative z-50 ml-auto">
            <motion.button
              className="p-3 text-white focus:outline-none focus:ring-0 outline-none border-none bg-transparent rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative flex items-center justify-center w-8 h-8"
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div
                  className={`absolute flex flex-col justify-between w-6 h-5 ${
                    !mobileMenuOpen ? "mb-2" : ""
                  }`}
                >
                  <span className="block bg-white h-[2.5px] w-full"></span>
                  <span className="block bg-white h-[2.5px] w-full"></span>
                  <span className="block bg-white h-[2.5px] w-full"></span>
                </div>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu - COMPLETELY REDESIGNED */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Hamburger Menu Button - Always Visible */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              className="absolute top-2 right-4 z-[70] p-3 text-white focus:outline-none focus:ring-0 outline-none border-none bg-transparent"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative flex items-center justify-center w-8 h-8"
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="absolute flex flex-col justify-between w-6 h-5">
                  <span className="block bg-white h-[2.5px] w-full"></span>
                  <span className="block bg-white h-[2.5px] w-full"></span>
                  <span className="block bg-white h-[2.5px] w-full"></span>
                </div>
              </motion.div>
            </motion.button>

            {/* Menu Content */}
            <div className="relative z-[65] h-full flex flex-col">
              {/* Header Section */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="pt-6 pb-8 px-6 text-center border-b border-gray-800/50"
              >
                <BrandLogo
                  logoTitle="ANTIQUE BODY"
                  titleStyle={{
                    fontSize: "1.8rem",
                    fontWeight: "900",
                    letterSpacing: "0.1em",
                    marginBottom: "0",
                    lineHeight: "1",
                  }}
                  containerStyle={{
                    marginBottom: "8px",
                  }}
                  firstWordColor="#FF6B00"
                  secondWordColor="#ffffff"
                />
                <p className="text-gray-400 text-sm font-medium">
                  Discover your ancient strength
                </p>
              </motion.div>

              {/* Navigation Items */}
              <div className="flex-1 px-6 py-8">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        className={`group block p-4 rounded-2xl border transition-all duration-300 ${
                          pathname === item.path
                            ? "bg-gradient-to-r from-[#FF6B00]/10 to-[#FF9A00]/10 border-[#FF6B00]/30 shadow-lg shadow-[#FF6B00]/10"
                            : "bg-gray-900/30 border-gray-800/50 hover:bg-gray-800/50 hover:border-gray-700/50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              pathname === item.path
                                ? "bg-[#FF6B00]/20 text-[#FF6B00]"
                                : "bg-gray-800/50 text-gray-400 group-hover:bg-gray-700/50 group-hover:text-white"
                            }`}
                          >
                            <Icon icon={item.icon} className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-bold text-lg transition-colors duration-300 ${
                                pathname === item.path
                                  ? "text-[#FF6B00]"
                                  : "text-white group-hover:text-[#FF6B00]"
                              }`}
                            >
                              {item.label}
                            </h3>
                            <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                              {item.description}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                              pathname === item.path
                                ? "border-[#FF6B00] bg-[#FF6B00]"
                                : "border-gray-600 group-hover:border-[#FF6B00]/50"
                            }`}
                          >
                            {pathname === item.path && (
                              <motion.div
                                layoutId="activeMobileIndicator"
                                className="w-full h-full rounded-full bg-[#FF6B00] flex items-center justify-center"
                              >
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Auth Section */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-6 border-t border-gray-800/50 bg-gray-900/20"
              >
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="orangeOutline"
                      size="medium"
                      className="w-full py-4 mb-4 text-base font-semibold border-2 hover:bg-[#FF6B00]/10 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Icon
                        icon="solar:login-3-bold-duotone"
                        className="w-5 h-5"
                      />
                      <span>Sign In</span>
                    </Button>
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="orangeFilled"
                      size="medium"
                      className="w-full py-4 text-base font-semibold relative overflow-hidden group shadow-lg shadow-[#FF6B00]/20 hover:shadow-[#FF6B00]/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span className="absolute inset-0 w-0 bg-white transition-all duration-500 ease-out group-hover:w-full opacity-10"></span>
                      <Icon
                        icon="solar:rocket-2-bold-duotone"
                        className="w-5 h-5 relative z-10"
                      />
                      <span className="relative z-10">Get Started</span>
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    © 2024 Antique Body. All rights reserved.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-[#FF6B00]/5 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-1/4 -right-20 w-40 h-40 bg-[#FF9A00]/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
